(function () {
    window.simplifyScorm = {};
    /**
     * 全局配置
     */
    window.simplifyScorm.constants = {
        SCORM_TRUE: "true",
        SCORM_FALSE: "false",
        STATE_NOT_INITIALIZED: 0,
        STATE_INITIALIZED: 1,
        STATE_TERMINATED: 2,
        LOG_LEVEL_DEBUG: 1,
        LOG_LEVEL_INFO: 2,
        LOG_LEVEL_WARNING: 3,
        LOG_LEVEL_ERROR: 4,
        LOG_LEVEL_NONE: 5
    };
    window.simplifyScorm.jsonFormatter = jsonFormatter;

    /**
     * jsonFormatter//转为json格式
     *
     * @returns {json}
     */
    function jsonFormatter() {
        this.jsonString = true;
        delete this.toJSON;

        var jsonValue = JSON.stringify(this);

        delete this.jsonString;
        this.toJSON = jsonFormatter;

        var returnObject = JSON.parse(jsonValue);
        delete returnObject.jsonString;

        for (var key in returnObject) {
            if (returnObject.hasOwnProperty(key) && key.indexOf("_") === 0) {
                delete returnObject[key];
            }
        }
        return returnObject;
    }
})();
/**
 * BaseAPI
 */
(function () {
    window.simplifyScorm.BaseAPI = BaseAPI;
    var constants = window.simplifyScorm.constants;
    function BaseAPI() {
        var _self = this;
        // Internal State
        _self.currentState = constants.STATE_NOT_INITIALIZED;
        _self.lastErrorCode = 0;
        // Utility Functions
        _self.apiLog = apiLog;
        _self.apiLogLevel = constants.LOG_LEVEL_ERROR;
        _self.clearSCORMError = clearSCORMError;
        _self.getLmsErrorMessageDetails = getLmsErrorMessageDetails;
        _self.isInitialized = isInitialized;
        _self.isNotInitialized = isNotInitialized;
        _self.isTerminated = isTerminated;
        _self.listenerArray = [];
        _self.on = onListener;
        _self.processListeners = processListeners;
        _self.throwSCORMError = throwSCORMError;
    }

    /**
     * Logging for all SCORM actions
     *
     * @param functionName
     * @param CMIElement
     * @param logMessage
     * @param messageLevel
     */
    function apiLog(functionName, CMIElement, logMessage, messageLevel) {
        logMessage = formatMessage(functionName, CMIElement, logMessage);
        if (messageLevel >= this.apiLogLevel) {
            switch (messageLevel) {
                case constants.LOG_LEVEL_ERROR:
                    console.error(logMessage);
                    break;
                case constants.LOG_LEVEL_WARNING:
                    console.warn(logMessage);
                    break;
                case constants.LOG_LEVEL_INFO:
                    console.info(logMessage);
                    break;
            }
        }
    }

    /**
     * Clears the last SCORM error code on success
     */
    function clearSCORMError(success) {
        if (success !== constants.SCORM_FALSE) {
            this.lastErrorCode = 0;
        }
    }

    /**
     * Formats the SCORM messages for easy reading
     *
     * @param functionName
     * @param CMIElement
     * @param message
     * @returns {string}
     */
    function formatMessage(functionName, CMIElement, message) {
        var baseLength = 20;
        var messageString = "";
        messageString += functionName;
        var fillChars = baseLength - messageString.length;
        for (var i = 0; i < fillChars; i++) {
            messageString += " ";
        }
        messageString += ": ";
        if (CMIElement) {
            var CMIElementBaseLength = 70;
            messageString += CMIElement;
            fillChars = CMIElementBaseLength - messageString.length;
            for (var j = 0; j < fillChars; j++) {
                messageString += " ";
            }
        }
        if (message) {
            messageString += message;
        }
        return messageString;
    }

    /**
     * Returns the message that corresponds to errrorNumber
     * APIs that inherit BaseAPI should override this function
     */
    function getLmsErrorMessageDetails(_errorNumber, _detail) {
        return "No error";
    }

    /**
     * Returns true if the API's current state is STATE_INITIALIZED
     */
    function isInitialized() {
        return this.currentState === constants.STATE_INITIALIZED;
    }

    /**
     * Returns true if the API's current state is STATE_NOT_INITIALIZED
     */
    function isNotInitialized() {
        return this.currentState === constants.STATE_NOT_INITIALIZED;
    }

    /**
     * Returns true if the API's current state is STATE_TERMINATED
     */
    function isTerminated() {
        return this.currentState === constants.STATE_TERMINATED;
    }

    /**
     * Provides a mechanism for attaching to a specific SCORM event
     *
     * @param listenerString
     * @param callback
     */
    function onListener(listenerString, callback) {
        if (!callback) return;
        var listenerFunctions = listenerString.split(" ");
        for (var i = 0; i < listenerFunctions.length; i++) {
            var listenerSplit = listenerFunctions[i].split(".");
            if (listenerSplit.length === 0) return;
            var functionName = listenerSplit[0];
            var CMIElement = null;
            if (listenerSplit.length > 1) {
                CMIElement = listenerString.replace(functionName + ".", "");
            }
            this.listenerArray.push({
                functionName: functionName,
                CMIElement: CMIElement,
                callback: callback
            });
        }
    }

    /**
     * Processes any 'on' listeners that have been created
     *
     * @param functionName
     * @param CMIElement
     * @param value
     */
    function processListeners(functionName, CMIElement, value) {
        for (var i = 0; i < this.listenerArray.length; i++) {
            var listener = this.listenerArray[i];
            console.log(11, listener)
            var functionsMatch = listener.functionName === functionName;
            var listenerHasCMIElement = !!listener.CMIElement;
            var CMIElementsMatch = listener.CMIElement === CMIElement;

            if (functionsMatch && (!listenerHasCMIElement || CMIElementsMatch)) {
                listener.callback(CMIElement, value);
            }
        }
    }

    /**
     * Throws a SCORM error
     *
     * @param errorNumber
     * @param message
     */
    function throwSCORMError(errorNumber, message) {
        if (!message) {
            message = this.getLmsErrorMessageDetails(errorNumber);
        }
        this.apiLog("throwSCORMError", null, errorNumber + ": " + message, constants.LOG_LEVEL_ERROR);
        this.lastErrorCode = String(errorNumber);
    }

})();
/**
 * ScormAPI
 */
(function () {
    window.simplifyScorm.ScormAPI = ScormAPI;
    var BaseAPI = window.simplifyScorm.BaseAPI;
    var constants = window.simplifyScorm.constants;
    var jsonFormatter = window.simplifyScorm.jsonFormatter;

    window.API = new ScormAPI();

    function ScormAPI() {
        var _self = this;
        BaseAPI.call(_self);
        // API Signature
        _self.LMSInitialize = LMSInitialize;
        _self.LMSFinish = LMSFinish;
        _self.LMSGetValue = LMSGetValue;
        _self.LMSSetValue = LMSSetValue;
        _self.LMSCommit = LMSCommit;
        _self.LMSGetLastError = LMSGetLastError;
        _self.LMSGetErrorString = LMSGetErrorString;
        _self.LMSGetDiagnostic = LMSGetDiagnostic;
        // Data Model
        _self.cmi = new CMI(_self);
        // Utility Functions
        _self.checkState = checkState;
        _self.getLmsErrorMessageDetails = getLmsErrorMessageDetails;
        _self.loadFromJSON = loadFromJSON;
        _self.replaceWithAnotherScormAPI = replaceWithAnotherScormAPI;

        /**
         * @returns {string} bool 初始化
         */
        function LMSInitialize() {
            var returnValue = constants.SCORM_FALSE;
            if (_self.isInitialized()) {
                _self.throwSCORMError(101, "LMS已经初始化！");
            } else if (_self.isTerminated()) {
                _self.throwSCORMError(101, "LMS已经完成！");
            } else {
                _self.currentState = constants.STATE_INITIALIZED;
                returnValue = constants.SCORM_TRUE;
                _self.processListeners("LMSInitialize");
            }
            _self.apiLog("LMSInitialize", null, "returned: " + returnValue, constants.LOG_LEVEL_INFO);
            _self.clearSCORMError(returnValue);
            return returnValue;
        }

        /**
         * @returns {string} bool
         */
        async function LMSFinish() {
            console.log('完成课程', window.API.cmi.toJSON())
            var returnValue = constants.SCORM_FALSE;
            if (_self.checkState()) {
                _self.currentState = constants.STATE_TERMINATED;
                returnValue = constants.SCORM_TRUE;
                _self.processListeners("LMSFinish");
            }
            _self.apiLog("LMSFinish", null, "returned: " + returnValue, constants.LOG_LEVEL_INFO);
            _self.clearSCORMError(returnValue);
            var ifSend = await updateCourseApi() //向后台提交数据
            if (ifSend) {
                returnValue = constants.SCORM_TRUE
            } else {
                returnValue = constants.SCORM_FALSE
            }
            return returnValue;
        }

        /**
         * @param CMIElement
         * @returns {string}
         */
        function LMSGetValue(CMIElement) {
            var returnValue = "";
            if (_self.checkState()) {
                returnValue = getCMIValue(CMIElement);
                _self.processListeners("LMSGetValue", CMIElement);
            }
            _self.apiLog("LMSGetValue", CMIElement, ": returned: " + returnValue, constants.LOG_LEVEL_INFO);
            _self.clearSCORMError(returnValue);
            console.log('获取数据', CMIElement, returnValue)
            return returnValue;
        }

        /**
         * @param CMIElement
         * @param value
         * @returns {string}
         */
        function LMSSetValue(CMIElement, value) {
            console.log('设置数据', CMIElement, value)
            var returnValue = "";
            if (_self.checkState()) {
                returnValue = setCMIValue(CMIElement, value);
                _self.processListeners("LMSSetValue", CMIElement, value);
            }
            _self.apiLog("LMSSetValue", CMIElement, ": " + value + ": returned: " + returnValue, constants.LOG_LEVEL_INFO);
            _self.clearSCORMError(returnValue);
            return returnValue;
        }

        /**
         * Orders LMS to store all content parameters
         *
         * @returns {string} bool
         */
        async function LMSCommit() {
            console.log('提交数据', window.API.cmi.toJSON())
            var returnValue = constants.SCORM_FALSE;
            if (_self.checkState()) {
                returnValue = constants.SCORM_TRUE;
                _self.processListeners("LMSCommit");
            }
            _self.apiLog("LMSCommit", null, "returned: " + returnValue, constants.LOG_LEVEL_INFO);
            _self.clearSCORMError(returnValue);
            var ifSend = await updateCourseApi() //向后台提交数据
            if (ifSend) {
                returnValue = constants.SCORM_TRUE
            } else {
                returnValue = constants.SCORM_FALSE
            }
            return returnValue;
        }

        /**
         * Returns last error code
         *
         * @returns {string}
         */
        function LMSGetLastError() {
            var returnValue = _self.lastErrorCode;
            _self.processListeners("LMSGetLastError");
            _self.apiLog("LMSGetLastError", null, "returned: " + returnValue, constants.LOG_LEVEL_INFO);
            return returnValue;
        }

        /**
         * Returns the errorNumber error description
         *
         * @param CMIErrorCode
         * @returns {string}
         */
        function LMSGetErrorString(CMIErrorCode) {
            var returnValue = "";
            if (CMIErrorCode !== null && CMIErrorCode !== "") {
                returnValue = _self.getLmsErrorMessageDetails(CMIErrorCode);
                _self.processListeners("LMSGetErrorString");
            }
            _self.apiLog("LMSGetErrorString", null, "returned: " + returnValue, constants.LOG_LEVEL_INFO);
            return returnValue;
        }

        /**
         * Returns a comprehensive description of the errorNumber error.
         *
         * @param CMIErrorCode
         * @returns {string}
         */
        function LMSGetDiagnostic(CMIErrorCode) {
            var returnValue = "";
            if (CMIErrorCode !== null && CMIErrorCode !== "") {
                returnValue = _self.getLmsErrorMessageDetails(CMIErrorCode, true);
                _self.processListeners("LMSGetDiagnostic");
            }
            _self.apiLog("LMSGetDiagnostic", null, "returned: " + returnValue, constants.LOG_LEVEL_INFO);
            return returnValue;
        }

        /**
         * Checks the LMS state and ensures it has been initialized
         */
        function checkState() {
            if (!this.isInitialized()) {
                this.throwSCORMError(301);
                return false;
            }
            return true;
        }

        /**
         * Sets a value on the CMI Object
         *
         * @param CMIElement
         * @param value
         * @returns {string}
         */
        function setCMIValue(CMIElement, value) {
            if (!CMIElement || CMIElement === "") {
                return constants.SCORM_FALSE;
            }
            var structure = CMIElement.split(".");
            var refObject = _self;
            var found = constants.SCORM_FALSE;
            for (var i = 0; i < structure.length; i++) {
                if (i === structure.length - 1) {
                    if (!refObject.hasOwnProperty(structure[i])) {
                        _self.throwSCORMError(101, "setCMIValue未找到以下项的元素：" + CMIElement);
                    } else {
                        refObject[structure[i]] = value;
                        found = constants.SCORM_TRUE;
                    }
                } else {
                    refObject = refObject[structure[i]];
                    if (!refObject) {
                        _self.throwSCORMError(101, "setCMIValue未找到以下项的元素：" + CMIElement);
                        break;
                    }
                    if (refObject.hasOwnProperty("childArray")) {
                        var index = parseInt(structure[i + 1], 10);
                        // SCO is trying to set an item on an array
                        if (!isNaN(index)) {
                            var item = refObject.childArray[index];
                            if (item) {
                                refObject = item;
                            } else {
                                var newChild;

                                if (CMIElement.indexOf("cmi.objectives") > -1) {
                                    newChild = new CMI_ObjectivesObject(_self);
                                } else if (CMIElement.indexOf(".correct_responses") > -1) {
                                    newChild = new CMI_InteractionsCorrectResponsesObject(_self);
                                } else if (CMIElement.indexOf(".objectives") > -1) {
                                    newChild = new CMI_InteractionsObjectivesObject(_self);
                                } else if (CMIElement.indexOf("cmi.interactions") > -1) {
                                    newChild = new CMI_InteractionsObject(_self);
                                }

                                if (!newChild) {
                                    _self.throwSCORMError(101, "无法创建新的子实体：" + CMIElement);
                                } else {
                                    refObject.childArray.push(newChild);
                                    refObject = newChild;
                                }
                            }

                            // Have to update i value to skip the array position
                            i++;
                        }
                    }
                }
            }
            if (found === constants.SCORM_FALSE) {
                _self.apiLog("LMSSetValue", null, "There was an error setting the value for: " + CMIElement + ", value of: " + value, constants.LOG_LEVEL_WARNING);
            }
            return found;
        }

        /**
         * Gets a value from the CMI Object
         *
         * @param CMIElement
         * @returns {*}
         */
        function getCMIValue(CMIElement) {
            if (!CMIElement || CMIElement === "") {
                return "";
            }
            var structure = CMIElement.split(".");
            var refObject = _self;
            var lastProperty = null;
            for (var i = 0; i < structure.length; i++) {
                lastProperty = structure[i];
                if (i === structure.length - 1) {
                    if (!refObject.hasOwnProperty(structure[i])) {
                        _self.throwSCORMError(101, "getCMIValue未找到以下项的值：" + CMIElement);
                    }
                }
                refObject = refObject[structure[i]];
            }
            if (refObject === null || refObject === undefined) {
                if (lastProperty === "_children") {
                    _self.throwSCORMError(202);
                } else if (lastProperty === "_count") {
                    _self.throwSCORMError(203);
                }
                return "";
            } else {
                return refObject;
            }
        }

        /**
         * Returns the message that corresponds to errrorNumber.
         */
        function getLmsErrorMessageDetails(errorNumber, detail) {
            var basicMessage = "";
            var detailMessage = "";
            // Set error number to string since inconsistent from modules if string or number
            errorNumber = String(errorNumber);
            switch (errorNumber) {
                case "101":
                    basicMessage = "General Exception";
                    detailMessage = "No specific error code exists to describe the error. Use LMSGetDiagnostic for more information";
                    break;
                case "201":
                    basicMessage = "Invalid argument error";
                    detailMessage = "Indicates that an argument represents an invalid data model element or is otherwise incorrect.";
                    break;
                case "202":
                    basicMessage = "Element cannot have children";
                    detailMessage = "Indicates that LMSGetValue was called with a data model element name that ends in \"_children\" for a data model element that does not support the \"_children\" suffix.";
                    break;
                case "203":
                    basicMessage = "Element not an array - cannot have count";
                    detailMessage = "Indicates that LMSGetValue was called with a data model element name that ends in \"_count\" for a data model element that does not support the \"_count\" suffix.";
                    break;
                case "301":
                    basicMessage = "Not initialized";
                    detailMessage = "Indicates that an API call was made before the call to LMSInitialize.";
                    break;
                case "401":
                    basicMessage = "Not implemented error";
                    detailMessage = "The data model element indicated in a call to LMSGetValue or LMSSetValue is valid, but was not implemented by this LMS. SCORM 1.2 defines a set of data model elements as being optional for an LMS to implement.";
                    break;
                case "402":
                    basicMessage = "Invalid set value, element is a keyword";
                    detailMessage = "Indicates that LMSSetValue was called on a data model element that represents a keyword (elements that end in \"_children\" and \"_count\").";
                    break;
                case "403":
                    basicMessage = "Element is read only";
                    detailMessage = "LMSSetValue was called with a data model element that can only be read.";
                    break;
                case "404":
                    basicMessage = "Element is write only";
                    detailMessage = "LMSGetValue was called on a data model element that can only be written to.";
                    break;
                case "405":
                    basicMessage = "Incorrect Data Type";
                    detailMessage = "LMSSetValue was called with a value that is not consistent with the data format of the supplied data model element.";
                    break;
                default:
                    basicMessage = "No Error";
                    detailMessage = "No Error";
                    break;
            }
            return detail ? detailMessage : basicMessage;
        }

        /**
         * Loads CMI data from a JSON object.
         */
        function loadFromJSON(json, CMIElement) {
            if (!_self.isNotInitialized()) {
                console.error("loadFromJSON can only be called before the call to LMSInitialize.");
                return;
            }
            CMIElement = CMIElement || "cmi";
            for (var key in json) {
                if (json.hasOwnProperty(key) && json[key]) {
                    var currentCMIElement = CMIElement + "." + key;
                    var value = json[key];
                    if (value["childArray"]) {
                        for (var i = 0; i < value["childArray"].length; i++) {
                            _self.loadFromJSON(value["childArray"][i], currentCMIElement + "." + i);
                        }
                    } else if (value.constructor === Object) {
                        _self.loadFromJSON(value, currentCMIElement);
                    } else {
                        setCMIValue(currentCMIElement, value);
                    }
                }
            }
        }

        /**
         * Replace the whole API with another
         */
        function replaceWithAnotherScormAPI(newAPI) {
            // API Signature
            _self.LMSInitialize = newAPI.LMSInitialize;
            _self.LMSFinish = newAPI.LMSFinish;
            _self.LMSGetValue = newAPI.LMSGetValue;
            _self.LMSSetValue = newAPI.LMSSetValue;
            _self.LMSCommit = newAPI.LMSCommit;
            _self.LMSGetLastError = newAPI.LMSGetLastError;
            _self.LMSGetErrorString = newAPI.LMSGetErrorString;
            _self.LMSGetDiagnostic = newAPI.LMSGetDiagnostic;
            // Data Model
            _self.cmi = newAPI.cmi;
            // Utility Functions
            _self.checkState = newAPI.checkState;
            _self.getLmsErrorMessageDetails = newAPI.getLmsErrorMessageDetails;
            _self.loadFromJSON = newAPI.loadFromJSON;
            _self.replaceWithAnotherScormAPI = newAPI.replaceWithAnotherScormAPI;
            // API itself
            _self = newAPI; // eslint-disable-line consistent-this
        }
        return _self;
    }

    /**
     * Scorm 1.2 Cmi data model 数据模型
     */
    function CMI(API) {
        return {
            _suspend_data: "",//暂存数据
            get suspend_data() { return this._suspend_data; },
            set suspend_data(suspend_data) { this._suspend_data = suspend_data; },

            _launch_data: "",//内容对象运行时所需的数据
            get launch_data() { return this._launch_data; },
            set launch_data(launch_data) { API.isNotInitialized() ? this._launch_data = launch_data : API.throwSCORMError(403); },

            _comments: "",//存储评论数据
            get comments() { return this._comments; },
            set comments(comments) { this._comments = comments; },

            _comments_from_lms: "",//存储LMS关于内容对象的评论数据
            get comments_from_lms() { return this._comments_from_lms; },
            set comments_from_lms(comments_from_lms) { API.isNotInitialized() ? this._comments_from_lms = comments_from_lms : API.throwSCORMError(403); },

            core: {
                __children: "student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time",
                get _children() { return this.__children; },
                set _children(_children) { API.throwSCORMError(402); },

                _student_id: "",//学生学号
                get student_id() { return this._student_id; },
                set student_id(student_id) { API.isNotInitialized() ? this._student_id = student_id : API.throwSCORMError(403); },

                _student_name: "",//学生姓名
                get student_name() { return this._student_name; },
                set student_name(student_name) { API.isNotInitialized() ? this._student_name = student_name : API.throwSCORMError(403); },

                _lesson_location: "", //记录上次离开sco时的位置
                get lesson_location() { return this._lesson_location; },
                set lesson_location(lesson_location) { this._lesson_location = lesson_location; },

                _lesson_progress: "", //记录课程学习进度
                get lesson_progress() { return this._lesson_progress; },
                set lesson_progress(lesson_progress) { this._lesson_progress = lesson_progress; },

                _credit: "",//是否有学分
                get credit() { return this._credit; },
                set credit(credit) { API.isNotInitialized() ? this._credit = credit : API.throwSCORMError(403); },

                _lesson_status: "not attempted",//记录sco的完成情况
                get lesson_status() { return this._lesson_status; },
                set lesson_status(lesson_status) { this._lesson_status = lesson_status; },

                _entry: "", //入口（进入内容对象）
                get entry() { return this._entry; },
                set entry(entry) { API.isNotInitialized() ? this._entry = entry : API.throwSCORMError(403); },

                _total_time: "",//学习总时间
                get total_time() { return this._total_time; },
                set total_time(total_time) { API.isNotInitialized() ? this._total_time = total_time : API.throwSCORMError(403); },

                _lesson_mode: "normal",//课的模式
                get lesson_mode() { return this._lesson_mode; },
                set lesson_mode(lesson_mode) { API.isNotInitialized() ? this._lesson_mode = lesson_mode : API.throwSCORMError(403); },

                _exit: "",//退出途径
                get exit() { return (!this.jsonString) ? API.throwSCORMError(404) : this._exit; },
                set exit(exit) { this._exit = exit; },

                _session_time: "", //本次学习时间
                get session_time() { return (!this.jsonString) ? API.throwSCORMError(404) : this._session_time; },
                set session_time(session_time) { this._session_time = session_time; },

                score: {
                    __children: "raw,min,max",
                    get _children() { return this.__children; },
                    set _children(_children) { API.throwSCORMError(402); },

                    _raw: "",//最后一次成绩
                    get raw() { return this._raw; },
                    set raw(raw) { this._raw = raw; },

                    _min: "",//最低成绩
                    get min() { return this._min; },
                    set min(min) { this._min = min; },

                    _max: "100",//最高成绩
                    get max() { return this._max; },
                    set max(max) { this._max = max; },

                    toJSON: jsonFormatter
                },

                toJSON: jsonFormatter
            },

            objectives: {
                __children: "id,score,status",
                get _children() { return this.__children; },
                set _children(_children) { API.throwSCORMError(402); },

                childArray: [],//返回所有属性
                get _count() { return this.childArray.length; },
                set _count(_count) { API.throwSCORMError(402); },

                toJSON: jsonFormatter
            },

            student_data: {
                __children: "mastery_score,max_time_allowed,time_limit_action",
                get _children() { return this.__children; },
                set _children(_children) { API.throwSCORMError(402); },

                _mastery_score: "",//掌握得分
                get mastery_score() { return this._mastery_score; },
                set mastery_score(mastery_score) { API.isNotInitialized() ? this._mastery_score = mastery_score : API.throwSCORMError(403); },

                _max_time_allowed: "", //最大允许时间
                get max_time_allowed() { return this._max_time_allowed; },
                set max_time_allowed(max_time_allowed) { API.isNotInitialized() ? this._max_time_allowed = max_time_allowed : API.throwSCORMError(403); },

                _time_limit_action: "", //限时反应
                get time_limit_action() { return this._time_limit_action; },
                set time_limit_action(time_limit_action) { API.isNotInitialized() ? this._time_limit_action = time_limit_action : API.throwSCORMError(403); },

                toJSON: jsonFormatter
            },

            student_preference: { //针对内容对象的用户偏好设置
                __children: "audio,language,speed,text",
                get _children() { return this.__children; },
                set _children(_children) { API.throwSCORMError(402); },

                _audio: "",//音频 
                get audio() { return this._audio; },
                set audio(audio) { this._audio = audio; },

                _language: "", //语言
                get language() { return this._language; },
                set language(language) { this._language = language; },

                _speed: "", //速度
                get speed() { return this._speed; },
                set speed(speed) { this._speed = speed; },

                _text: "", //文本
                get text() { return this._text; },
                set text(text) { this._text = text; },

                toJSON: jsonFormatter
            },

            interactions: {
                __children: "id,objectives,time,type,correct_responses,weighting,student_response,result,latency",
                get _children() { return this.__children; },
                set _children(_children) { API.throwSCORMError(402); },

                childArray: [],//	返回集合中元素总数
                get _count() { return this.childArray.length; },
                set _count(_count) { API.throwSCORMError(402); },

                toJSON: jsonFormatter
            },

            toJSON: jsonFormatter
        };
    }

    function CMI_InteractionsObject(API) {
        return {
            _id: "",//某一交互ID
            get id() { return (!this.jsonString) ? API.throwSCORMError(404) : this._id; },
            set id(id) { this._id = id; },

            _time: "",//交互完成时间
            get time() { return (!this.jsonString) ? API.throwSCORMError(404) : this._time; },
            set time(time) { this._time = time; },

            _type: "",//交互类型(true-false/choice/fill-in/matching/performance/sequencing/likert/numeric)
            get type() { return (!this.jsonString) ? API.throwSCORMError(404) : this._type; },
            set type(type) { this._type = type; },

            _weighting: "",//一个交互的权重
            get weighting() { return (!this.jsonString) ? API.throwSCORMError(404) : this._weighting; },
            set weighting(weighting) { this._weighting = weighting; },

            _student_response: "",//用户提供的答案
            get student_response() { return (!this.jsonString) ? API.throwSCORMError(404) : this._student_response; },
            set student_response(student_response) { this._student_response = student_response; },

            _result: "",//由用户答案计算的交互结果  (correct/wrong/unanticipated/neutral/x.x)
            get result() { return (!this.jsonString) ? API.throwSCORMError(404) : this._result; },
            set result(result) { this._result = result; },

            _latency: "",//	交互时间间隔
            get latency() { return (!this.jsonString) ? API.throwSCORMError(404) : this._latency; },
            set latency(latency) { this._latency = latency; },

            objectives: {//交互目标集合中总数
                childArray: [],
                get _count() { return this.childArray.length; },
                set _count(_count) { API.throwSCORMError(402); },

                toJSON: jsonFormatter
            },

            correct_responses: {//存储一个交互的答案数
                childArray: [],
                get _count() { return this.childArray.length; },
                set _count(_count) { API.throwSCORMError(402); },

                toJSON: jsonFormatter
            },

            toJSON: jsonFormatter
        };
    }

    function CMI_ObjectivesObject(API) {
        return {
            _id: "",//一个目标对象ID
            get id() { return this._id; },
            set id(id) { this._id = id; },

            _status: "",//目标完成状态(passed/completed/failed/incomplete/browsed/not attempted)
            get status() { return this._status; },
            set status(status) { this._status = status; },

            score: {
                __children: "raw,min,max",//获得score子属性
                get _children() { return this.__children; },
                set _children(children) { API.throwSCORMError(402); },

                _raw: "",//目标分数
                get raw() { return this._raw; },
                set raw(raw) { this._raw = raw; },

                _min: "",//目标分数最小值
                get min() { return this._min; },
                set min(min) { this._min = min; },

                _max: "",//目标分数最大值
                get max() { return this._max; },
                set max(max) { this._max = max; },

                toJSON: jsonFormatter
            },

            toJSON: jsonFormatter
        };
    }

    function CMI_InteractionsObjectivesObject(API) {
        return {
            _id: "", //交互的目标ID
            get id() { return (!this.jsonString) ? API.throwSCORMError(404) : this._id; },
            set id(id) { this._id = id; },

            toJSON: jsonFormatter
        };
    }

    function CMI_InteractionsCorrectResponsesObject(API) {
        return {
            _pattern: "",//存储一个交互的答案
            get pattern() { return (!this.jsonString) ? API.throwSCORMError(404) : this._pattern; },
            set pattern(pattern) { this._pattern = pattern; },

            toJSON: jsonFormatter
        };
    }
})();

/**
 * 逻辑代码
 */
// 初始化
console.log('window.API: ', window.API)
// doLMSInitialize()  //分数初始化为0
window.API.LMSInitialize() //未初始化分数
console.log('是否初始化', window.API.isInitialized())

// 获取信息
var baseUrl = 'https://xxx.com', //接口地址
    courseId = getQueryVariable("courseId"), // 课程id
    userId = getQueryVariable("userId")

console.log('id', courseId, userId)
console.log('cmi---', window.API.cmi.toJSON())

getCourseInfo() //获取课程详情

// 获取课程详情
function getCourseInfo() {
    request(`/course/get/${courseId}`, {
        method: 'get',
    }).then(res => {
        console.log('res---', res)
    }).catch(err => {
        console.log('err---', err)
    })
}

// 修改课程进度
async function updateCourseApi() {
    const params = {
        courseId: courseId,
        studyTime: window.API.cmi.core.session_time || window.API.cmi.core._session_time,  //本次学习时间
        // percentage: window.API.cmi.core.lesson_location || window.API.cmi.core._lesson_location,  //上次学习的位置（百分比）
        percentage: window.API.cmi.core.lesson_progress || window.API.cmi.core._lesson_progress,  //课程学习进度
        lesson_status: window.API.cmi.core.lesson_status || window.API.cmi.core._lesson_status,  //课程学习状态
        suspend_data: window.API.cmi.suspend_data,  //学习进度数据
        score: window.API.cmi.core.score.raw,  //本次测试分数
    }
    console.log('params----', params)
    const res = await request('/content-study/update-time', {
        method: 'post',
        data: params
    })
    console.log('res---', res)
    if (res.code == 20000) {
        return true
    } else {
        return false
    }
}
// 接口函数
function request(url, params) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: params.method || "GET",
            url: baseUrl + url,
            data: JSON.stringify(params.data),
            contentType: "application/json; charset=utf-8",
            success: (res) => {
                resolve(res);
            },
            error(err) {
                reject(err);
            },
        });
    })
};

// 获取路由参数
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; };
    }
    return '';
};