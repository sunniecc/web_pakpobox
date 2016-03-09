/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview index.js
	 * @version 1.0.0
	 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
	 * @date 2015/08/15
	 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
	 * @see [link]
	 *
	 */

	__webpack_require__(8);
	var Api = __webpack_require__(3);
	var userType = __webpack_require__(9);
	var Lang = __webpack_require__(1);
	var Header = __webpack_require__(4);
	var Nav = __webpack_require__(10);
	var Info = __webpack_require__(14);

	(function(angular) {
	    'use strict';
	    var myModule = angular.module('express', ['ngSanitize']);

	    myModule.controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
	        $.extend($scope, Lang);

	        Api.userInfo(function(json){
	            if(json.statusCode != 0){
	                location.href = 'login.html';
	            }else{
	                $scope.userrole = json.result.role, $scope.usertype = $scope[userType[json.result.role]];
	                $scope.username = json.result.name;
	                $scope.$apply();
	            }
	        })
	        $scope.logout = Api.logout;

	        $templateCache.put('header',Header);
	        $templateCache.put('nav',Nav);
	        $templateCache.put('info',Info);

	        $scope.info = {
	            title : $scope.LExpressInfo,
	            secondTitle : $scope.LLinkmanInfo,
	            content:[
	            ]
	        };

	        $scope.close = function () {
	            window.close();
	        }

	        var expressNumber = Api.param('expressNumber');

	        Api.getExpress({'expressNumber': expressNumber}, function (json) {
	            $scope.info.content = [];
	            $scope.info.contactContent = [];
	            var contentItem = {};
	            var result = json.result.resultList;
	            //编号
	            $scope.info.content.push({key:$scope.LTableOrderNumber,value:result[0].expressNumber});

	            //派宝箱名称
	            $scope.info.content.push({key:$scope.LDetailPakpoboxName,value:result[0].mouth.box.name});

	            //派宝箱编号
	            contentItem.key = $scope.LDetailPakpobox;
	            contentItem.value = result[0].mouth.number;
	            $scope.info.content.push({key:$scope.LDetailPakpobox,value:result[0].mouth.number});

	            //取件人
	            $scope.info.contactContent.push({key:$scope.LDetailTakerName,value:result[0].staffTakenUser.name});

	            //取件人手机
	            $scope.info.contactContent.push({key:$scope.LDetailTakerPhone,value:result[0].staffTakenUser.phoneNumber});

	            //存件人姓名
	            $scope.info.contactContent.push({key:$scope.LDetailStoreName,value:result[0].storeUser.name});

	            //存件人手机
	            $scope.info.contactContent.push({key:$scope.LDetailStorePhone,value:result[0].storeUser.phoneNumber});

	            //存件时间
	            $scope.info.content.push({key:$scope.LDetailStoreTime,value:result[0].storeTime});

	            //取件时间
	            $scope.info.content.push({key:$scope.LDetailTakeTime,value:result[0].takeTime});

	            //到期时间
	            $scope.info.content.push({key:$scope.LDetailOverTime,value:result[0].overdueTime});

	            //快件状态
	            $scope.info.content.push({key:$scope.LDetailStatu,value:result[0].status});

	            //验证码
	            $scope.info.content.push({key:$scope.LDetailValidation,value:result[0].validateCode});

	            $scope.$apply();
	        })

	    }])
	        .filter('trusted', ['$sce', function ($sce) {
	            return function (text) {
	                return $sce.trustAsHtml(text);
	            }
	        }]);

	})(window.angular); $('body').show();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	
	if(localStorage.lang == 'en'){
	    var Lang = __webpack_require__(6);
	}else{
	    var Lang = __webpack_require__(7);
	}
	console.log(Lang)
	Lang.localStorage = localStorage;
	Lang.location = location;

	Lang.LChooseLang = function (type) {
	    localStorage.lang = type;
	    location.href = location.href;
	}
	module.exports = Lang;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview alert警告框
	 * @version 1.0.0
	 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
	 * @date 2015/08/15
	 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
	 * @see [link]
	 *
	 */

	var tpl = __webpack_require__(5);

	var Alert = {
	    show: function (msg, type, hideDelay, hideClose) {
	        $('#alert').html(tpl);
	        $('#msg').html(msg);
	        hideDelay = hideDelay || 3000;
	        switch (type){
	            case 'success':
	                $('.alert')[0].className = "alert alert-success";
	                break;
	            case 'info':
	                $('.alert')[0].className = "alert alert-info";
	                break;
	            case 'warning':
	                $('.alert')[0].className = "alert alert-warning";
	                break;
	            case 'danger':
	                $('.alert')[0].className = "alert alert-danger";
	                break;
	            default :
	                $('.alert')[0].className = "alert alert-danger";
	                break;
	        }
	        $('.alert').show();
	        if(hideDelay != 'none'){
	            setTimeout(function(){
	                $('.alert').hide(200);
	            }, hideDelay)
	        }
	        if(hideClose){
	            $('.alert .close').hide();
	        }
	    }
	}

	module.exports = Alert;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview api接口
	 * @version 1.0.0
	 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
	 * @date 2015/08/15
	 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
	 * @see [link]
	 *
	 */

	var Lang = __webpack_require__(1);
	var Alert = __webpack_require__(2);

	var urlHead = '/cgi-bin/';
	var getData = function (url, data, callback) {
	    $.ajax({
	        url: urlHead + url,
	        type: 'GET',
	        data: data,
	        dataType: 'json',
	        success: function (json) {
	            callback(json);
	        },
	        error: function (err) {
	            console.log(err)
	            Alert.show(Lang.LConnectError);
	        }
	    })
	}

	var postData = function (url, data, callback) {
	    data = JSON.stringify(data);
	    $.ajax({
	        url: urlHead + url,
	        type: 'POST',
	        data: data,
	        dataType: 'json',
	        contentType: 'application/json',
	        success: function (json) {
	            callback(json);
	        },
	        error: function () {
	            Alert.show(Lang.LConnectError);
	        }
	    })
	}

	var Api = {
	    param: function (name) {
	        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	        var r = window.location.search.substr(1).match(reg);
	        if (r != null) {
	            return decodeURIComponent(r[2]);
	        }
	        return null;
	    },
	    login: function (param, callback) {
	        var url = 'index/user/login',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    logout: function () {
	        var url = 'index/user/logout',
	            data = {}
	        postData(url, data, function (json) {
	            if(json.statusCode == 0){
	                location.href = 'login.html';
	            }
	        })
	    },
	    post: function (callback) {
	        var url = 'index/user/post',
	            data = {}
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    userInfo: function (callback) {
	        var url = 'index/user/userInfo',
	            data = {}
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    getPeopelDetails: function (param, callback) {
	        var url = 'index/user/info',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    loginNameExist: function (param,callback){
	        var url = 'index/user/loginNameExist',
	            data = {}
	        $.extend(data, param);
	        getData(url,data,function(json){
	            callback(json);
	        })

	    },
	    phoneExist: function (param,callback){
	        var url = 'index/user/phoneExist',
	            data = {}
	        $.extend(data, param);
	        getData(url,data,function(json){
	            callback(json);
	        })

	    },
	    getExpress: function (param, callback) {
	        var url = 'index/express/query',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    getExpressDayCount: function (param, callback) {
	        var url = 'index/express/getDayCount',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    getExpressStatics: function (param, callback) {
	        var url = 'index/express/expressStatics',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    companyQuery: function(param, callback){
	        var url = 'index/company/query',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    companyInfo: function(param, callback){
	        var url = 'index/company/info',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    companyUpdate: function(param, callback){
	        var url = 'index/company/update',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    companyDelete: function(param, callback){
	        var url = 'index/company/delete',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    courierInfo: function(param, callback){
	        var url = 'index/user/queryStaff',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    updatePassword: function (param, callback) {
	        var url = 'index/user/updatePassword',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    delectUser: function (param, callback) {
	        var url = 'index/user/deleteStaff',
	            data = {}
	        $.extend(data, param);
	         postData(url, data, function (json) {
	            callback(json);
	            })
	    },
	    modifyExpress: function (param, callback) {
	        var url = 'index/express/modifyPhoneNumber',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    createCompany: function (param, callback) {
	        var url = 'index/company/create',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    updateCompany: function (param, callback) {
	        var url = 'index/company/update',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    createStaff: function (param, callback) {
	        var url = 'index/user/createStaff',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    updateStaff: function (param, callback) {
	        var url = 'index/user/updateStaff',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    createBox: function (param, callback) {
	        var url = 'index/box/create',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    queryBoxType: function (callback) {
	        var url = 'box/mouth/type',
	            data = {}
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    updateBox: function (param, callback) {
	        var url = 'index/box/update',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	     rebuildBox: function (param, callback) {
	        var url = 'index/box/rebuild',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    queryBoxInfo: function (param, callback) {
	        var url = 'index/box/query',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    queryBoxName: function (param, callback){
	        var url = 'index/box/queryBoxName',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    getBoxInfo: function (param, callback) {
	        var url = 'index/box/info',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    querySurplusMouth: function (param, callback) {
	        var url = 'index/box/querySurplusMouth',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    remoteUnlock: function (param, callback) {
	        var url = 'task/mouth/remoteUnlock',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    updateMouth: function (param, callback) {
	        var url = 'box/mouth/update',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    getTaskInfo: function (param, callback) {
	        var url = 'index/task/info',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    getSmsInfo: function (param, callback) {
	        var url = 'index/sms/express',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    resendSms: function (param, callback) {
	        var url = 'index/express/resendSms',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    resetExpress: function (param, callback) {
	        var url = 'task/express/resetExpress',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    getSmsList: function (param, callback) {
	        var url = 'sms/account/list',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    uploadImgInfo: function (param, callback) {
	        var url = 'index/upload/uploadImgInfo',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },
	    deleteImg: function (param, callback) {
	        var url = 'index/upload/deleteImg',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },

	    queryADInfo: function (param, callback){
	        var url = 'index/upload/queryADInfo',
	            data = {}
	        $.extend(data, param);
	        getData(url, data, function (json) {
	            callback(json);
	        })
	    },

	    updateBoxStatus: function(param, callback){
	        var url = 'index/box/updateBoxStatus',
	            data = {}
	        $.extend(data, param);
	        postData(url, data, function (json) {
	            callback(json);
	        })
	    },

	}

	module.exports = Api;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = "\r\n<header class=\"header\">\r\n    <div class=\"header-box\">\r\n        <div class=\"inner-wrapper\">\r\n            <h1 class=\"logo\">\r\n                <a href=\"/\" title=\"pakbox\">\r\n                    <img ng-src=\"assets/img/logo.png\"/>\r\n                </a>\r\n            </h1>\r\n\r\n            <div class=\"account\" ng-init=\"showDrop = 0\" ng-mouseover=\"showDrop = 1\" ng-mouseleave=\"showDrop = 0\">\r\n                <div class=\"account-info\">\r\n                    <span ng-bind=\"username || ''\"></span>\r\n                </div>\r\n                <div class=\"account-type\">\r\n                    <span ng-bind=\"usertype\"></span>\r\n                </div>\r\n                <div class=\"account-dropdown\" ng-style=\"showDrop && {'display': 'block'}\">\r\n                    <ul class=\"account-dropdown-menu\">\r\n                        <li><a href=\"passwd.html\" ng-bind=\"LUpdatePassword\"></a></li>\r\n                        <li><a ng-click=\"logout()\" ng-bind=\"LLogout\"></a></li>\r\n                    </ul>\r\n                </div>\r\n\r\n            </div>\r\n\r\n            <div class=\"language\">\r\n                <a href=\"javascript:;\" ng-click=\"LChooseLang('zh')\" ng-class=\"{selectedLanguage:localStorage.lang == 'zh'}\">中文</a>\r\n                |\r\n                <a href=\"javascript:;\" ng-click=\"LChooseLang('en')\" ng-class=\"{selectedLanguage:localStorage.lang == 'en'}\">English</a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</header>\r\n\r\n\r\n"

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = "<div class=\"alert alert-danger\" role=\"alert\" style=\"display: none;\">\r\n    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\r\n    <div id=\"msg\">warning!<div>\r\n</div>"

/***/ },
/* 6 */
/***/ function(module, exports) {

	
	var Lang = {
	    'LTitle': "Pakpobox",
	    'LConnectError': 'Server Error',
	    'LSystemError': 'Systerm Error',
	    'LUsernamePlaceholer': 'Email/Phone/LoginName',
	    'LUPasswordPlaceholer': 'Password',
	    'LLoginSubmit': 'login',
	    'LContratUs': 'Connect Us',
	    'LForgetPassword': 'Forget Password？',
	    'LValidation': 'Validation',
	    'LResetPassword': 'Reset',
	    'LValidationTips': 'Please put your binding infomation for Validation：',
	    'LValitaionSubmit': 'Validate',
	    'LValidationResultTips': 'Validate Successfully！Please check your random in your email！',
	    'LValitaionResultButton': 'Return Login',
	    'LLogout': 'Logout',

	    'LUserTypeRoot': 'Super Admin',
	    'LUserTypeManager': 'Manager',
	    'LUserTypeOprator': 'Operator',
	    'LUserTypeLogistics': 'Courier',
	    'LUserTypeOpratorAdmin': 'OperatorAdmin',
	    'LUserTypeLogisticsAdmin': 'CourierAdmin',

	    'LLoginname': 'UserName',
	    'LUsername': 'NickName',
	    'LPhoneNumber': 'PhoneNumber',
	    'LCompany': 'Company',
	    'LRole': 'Role',
	    'LCompanyName': 'Company Name',


	    'LUpdatePassword': 'Password',
	    'LOldPassword': 'OldPassword',
	    'LNewPassword': 'NewPassword',
	    'LReNewPassword': 'ReNewPassword',
	    'LPasswordInconsistent': 'Password Inconsistent!',
	    'LPasswordSuccess': 'Reset Successfully！Go to homepage...',

	    'LAll': 'All',

	    'LLevel': 'Level',
	    'LLevelOne': 'Level1',
	    'LLevelTwo': 'Level2',
	    'LLevelThree': 'Level3',
	    'LLevelFour': 'Level4',
	    'LLevelFive': 'Level5',

	    'LRole': 'Role',
	    'LOperatorAdmin': 'Operator Admin',
	    'LOperatorUser': 'Operator User',
	    'LLogisticsAdmin': 'Logistics Admin',
	    'LLogisticsUser': 'Logistics User',
	    'LRootUser': 'Super Admin',

	    'LStatus': 'Status',
	    'LStatusOn': 'Open',
	    'LStatusOff': 'Disable',

	    'LNumber': 'Number',
	    'LName': 'Name',
	    'LCompanyNumber':'Company Number',
	    'LSearch': 'Query',
	    'LPhoneNum': 'TakePhone',
	    'LTime': 'Time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
	    'LTimeStore': 'Store Time',
	    'LTimeStatistics': 'Statistics Time',
	    'LTimeTake': 'Take Time',
	    'LEcommerce': 'Choose Ecommerce',
	    'LStatisticsNote':'(Note: the default take statistical records for 30 days, if you need other time please choose statistical time)',

	    'LOperatorInfo': 'Operator ',
	    'LLinkmanInfo': 'Linkman ',
	    'LOperatorInfoTips': 'Please confirm your company info',
	    'LLinkmanInfoTips':'Please confirm your linkman info',
	    'LOperatorNamePlaceholder': 'Please type your company info',
	    'LOperatorParentPlaceholder': 'Please type your parent company info',

	    //新增物流公司
	    'LLogisticsInfo': 'Logistics Info',
	    'LLogisticsInfoTips': 'Please confirm your company info',
	    'LLogisticsNamePlaceholder': 'Please type your company info',
	    'LLogisticsParentPlaceholder': 'Please type your parent company info',

	    //新增人员信息
	    'LPeopleInfo': ' People Info',
	    'LPeopleType':' People Type',

	    //人员信息详情
	    'LPeopleInfoName': 'Name',
	    'LPeopleInfoPhone': 'Phone',
	    'LPeopleInfoWallets': 'Wallets',


	    'LClose': 'Close',
	    'LApply': 'Apply',
	    'LReset': 'Reset',
	    'LCancel': 'Cancel',
	    'LNext': 'Next',
	    'LSubmit': 'Submit',
	    'LSubmitLoading': 'Submit...',
	    'LSubmitValidate': 'Validate',
	    'LSubmitValidating': 'Validating...',

	    'LExpressInfo': 'Express Info',
	    'LExpressStatuStoring': 'need Store',
	    'LExpressStatuStore': 'stored',
	    'LExpressStatuStored': 'taken',
	    'LExpressStatuTimeout': 'timeout',
	    'LExpressStatuCourierPickup': 'logistics pick',
	    'LExpressStatuManagerPickup': 'operators pick',

	    //table
	    'LTableOrderSeq': 'sequence',
	    'LTableOrderNumber': 'number',
	    'LTableTakerPhone': 'takerPhone',
	    'LTableCreateTime':'createTime',
	    'LTableStoreTime': 'storeTime',
	    'LTableTakeTime': 'takeTime',
	    'LTablePakpoboxNum': 'BoxNum',
	    'LTableValidationNum': 'validation',
	    'LTableExpressStatu': 'Status',
	    'LTableOperator': 'operator',
	    'LTableDetails': 'Details',
	    'LTableDelete' : 'Delete',
	    'LTableDeleteOperator' : 'deleteOperator',
	    'LTableDeleteAffirm' : 'Whether to delete information',
	    'LTableDeleteCompanyAffirm' : 'Whether to delete company information',
	    'LTableDeleteCompanySuccess': 'Company information deleted successfully',
	    'LTableDeleteSuccess' : 'Personnel information deleted successfully',
	    'LTableDeleteFailed': 'Personnel information delete failed',
	    'LTablecCompanyDeleteFailed': 'Company information delete failed',


	    'LToEdit': 'To Edit',
	    //运营商详情
	    'LDetailOperatorsId': 'ID',
	    'LDetailOperatorsName': 'NAME',
	    'LDetailOperatorsParentName': 'PARENT',
	    'LDetailLogisticsParentId': 'PARENT ID',
	    'LDetailOperatorsParentId': 'PARENT ID',
	    'LDetailOperatorsContact': 'CONTACT',
	    'LDetailOperatorsContactPhone': 'PHONE',
	    'LDetailOperatorsContactMail': 'MAIL',

	    //运营商tableHead
	    'LTableOperatorsSqe': 'seq',
	    'LTableOperatorsName': 'Name',
	    'LTableOperatorsLevel': 'Level',
	    'LTableOperatorsParent': 'Parent',

	    //物流公司详情
	    'LDetailLogisticsInfo': 'LOGISTICS COMPANY INFO',
	    'LDetailLogisticsId': 'ID',
	    'LDetailLogisticsName': 'NAME',
	    'LDetailLogisticsLevel': 'Logistics Level',
	    'LDetailLogisticsParentName': 'PARENT',
	    'LDetailLogisticsParentId': 'PARENT ID',
	    'LDetailLogisticsContact': 'CONTACT',
	    'LDetailLogisticsContactPhone': 'PHONE',
	    'LDetailLogisticsContactMail': 'MAIL',

	    //快件详情
	    'LDetailPakpoboxMouth': 'Door Num',
	    'LDetailPakpobox': 'Pakpobox Num',
	    'LDetailPakpoboxName': 'Box Name',
	    'LDetailTakerName': 'Taker Name',
	    'LDetailTakerPhone': 'Taker phone',
	    'LDetailStoreName': 'Receiver',
	    'LDetailStorePhone': 'Receiver Phone',
	    'LDetailCreateTime': 'Create Time',
	    'LDetailStoreTime': 'Stored Time',
	    'LDetailTakeTime': 'Get Time',
	    'LDetailOverTime': 'Deadline',
	    'LDetailStatu': 'Status',
	    'LDetailValidation': 'Validation Number',
	    'LDetailModify': 'Modify',
	    'LDetailSure': 'Confirm',
	    'LDetailIfReSendValidation': 'Whether confirm resend verification code？',
	    'LDetailIfResetStatu': 'Whether Reset Statu？',
	    'LDetailIfReSendSuccessfully': 'Send Validation Code Successfully',
	    'LDetailIfReSendFailed': 'Send Validation Code Failed！',
	    'LDetailIfDoReset': 'Reset Operator Is Send！',
	    'LDetailReseting': 'Reseting。。。。',
	    'LDetailIfResetSuccessfully': 'Reset Successfully！',
	    'LDetailIfResetFailed': 'Reset Failed！',

	    //人员信息详情
	    'LDetailPeople': 'Store Time',
	    'LDetailTakeTime': 'Get Time',
	    'LDetailOverTime': 'Overdue Time',
	    'LDetailStatu': 'status',
	    'LDetailValidation': 'validation',
	    'LDetailExpressMessage': 'Message Infomation',
	    'LDetailMsgClick': 'Please Click',

	    //导航
	    'LNavBaseInfomation': 'Base Info',
	    'LNavOperator': 'Operators',
	    'LNavLogisticsCompany': 'LogisticsCompany',
	    'LNavPeople': 'People Infomation',
	    'LNavCourier': 'Courier',
	    'LNavAccount': 'My Account',
	    'LNavPakpobox': 'Pakpobox',
	    'LNavPakpoboxMaintain': 'Maintain',
	    'LNavPakpoboxManagement': 'Management',
	    'LNavExpressManagement': 'Express',
	    'LNavAbnomalExpress': 'AbnomalExpress',
	    'LNavExpressManagementAll': 'courier',
	    'LNavExpressManagementSend': 'Post',
	    'LNavExpressManagementCustomertToStaff':'userInfo',
	    'LNavExpressManagementBack': 'Return',
	    'LNavExpressManagementImport': 'Import',
	    'LNavAd': 'Ad',
	    'LNavAdManagement': 'Management',
	    'LNavStatic'     :  'Static',
	    'LNavStaticExpress'     :  'Express Static',

	    //快递员
	    'LCourierCompany': 'Company',
	    'LCourierName': 'Name',
	    'LCourierPhone': 'Phone',
	    'LLogisticsParentId': 'Parent company ID',
	    'LLogisticsLevel': 'Level',
	    'LLogisticsParent': 'Parent',
	    'LLogisticsParentId': 'Parent Id',

	    //拉取信息提示
	    'LResponseEmpty': 'It is empty!',
	    'LResponseError': 'OCCOUR ERROR',

	    //新建按钮
	    'LNewOperator': '+ Operator',
	    'LNewLogistics': '+ Logistics',
	    'LNewCourier': '+ People',

	    //导出列表
	    'LExportlist': 'Export',

	    //操作列表
	    'LSendValidation': 'send validation',
	    'LResetStatus': 'reset',

	    //分页
	    'LGoto': 'Goto',
	    'LPageNum':'Pages Number:',
	    'LRecordNum':'Record Number:',

	    //导入列表
	    'LImportExpressType': 'Express Type',
	    'LImportAll': 'All',
	    'LImportCourier':'Courier Express',
	    'LImportSend':'Send Express',
	    'LImportReturn':'Return Express',
	    'LImportExpress':'Import Express',
	    'LImportModelDownload':'Download Import Model',
	    //新增派宝箱
	    'LPakpoboxOperator': 'Operator Id',
	    'LPakpoboxName': 'Box Name',
	    'LPakpoboxOrderNo': 'OrderNo',
	    'LPakpoboxCurrencyUnit': 'Unit',
	    'LPakpoboxZoneId': 'Zone',
	    'LPakpoboxOverdueType': 'Overdue Tyte',
	    'LPakpoboxOverdueTime': 'Overdue Time',
	    'LPakpoboxSmsAccount': 'Sms Account',
	    'LBoxSize': 'Box Size',
	    'LPakpoboxInfoTips': 'Please Confirm infomation',
	    'LFormNone': 'Lost Infomation！',

	    //派宝箱维护
	    'LPakpoboxStatus':'Status' ,
	    'LPakpoboxRun':'RUN' ,
	    'LPakpoboxStop':'STOP' ,
	    'LPakpoboxException':'Exception' ,
	    'LPakpoboxStopSuccess':'Box Run ',
	    'LPakpoboxRunSuccess':'Box Stop ',
	    'LPakpoboxOperator':'Operator Num' ,
	    'LPakpoboxOperatorName':'Operator Name',
	    'LPakpoboxName':'Pakpobox Name',
	    'LPakpoboxStatus':'Pakpobox Status',
	    'LPakpoboxDetail':'Pakpobox Management',
	    'LPakpoboxNew':'+New',
	    'LPakpoboxFreeNum': 'Pakpobox Free Num',
	    'LPakpoboxNum':'Pakpobox Number',
	    'LPakpoBoxInfoUpdate':'Pakpobox DoorUpdate',
	    'LPakpoBoxDetail': 'Detail',
	    'LPakpoBoxColumns': 'Not null columns between the two columns！',
	    'LPakpoBoxSubmitRespose': 'Submit Successfullly，Wating ...！',
	    'LPakpoBoxSubmitFail': 'Submmit Failed！',
	    'LPakpoBoxSubmitBack': 'Confirm To Back！',
	    'LPakpoBoxModifyMouthStatus': 'Modidfy Door Status',
	    'LPakpoBoxEmpty': 'Empty',
	    'LPakpoBoxLock': 'Lock',
	    'LPakpoBoxFreeMouthNum': 'Free Door Num：',
	    'LPakpoBoxRemoteUnlock': 'To confirm the following selected case door were unlocked remotely？',
	    'LPakpoBoxStatusModify': 'To confirm for the following selected door state changes？',
	    'LPakpoBoxPleaseChooseAMouth': 'Please Choose A Door',
	    'LPakpoBoxForbiddenBusyStatus': 'Forbid the operator of busy door!',
	    'LPakpoBoxGetMouthIdFailed': 'Get Door Id Failed!',
	    'LPakpoBoxFree': 'Free',
	    'LPakpoBoxBusy': 'Busy',
	    'LPakpoBoxLocked': 'Locked',
	    'LAddPakpoboxView': 'Go to add door view!',
	    'LCopyCol':'CopyCol',

	    //导入
	    'LChooseFile':'Choose File',
	    'LBeginUpload':'Upload',
	    'LUploadGuide':'Guide',
	    'LUploadStep1':'1.First ',
	    'LUploadStep12':'，fill in the information according to the example',
	    'LUploadStep2':'2. Click select files above, choose the file you want to import',
	    'LUploadStep3':'3. Click start uploading, you can upload your files',
	    'LWaitingUpload':'Waiting Upload....',
	    'LUploading':'Uploading....',
	    'LUploadingComplete':'Upload Complete',
	    'LUploadingSuccess': 'Upload Success',
	    'LUploadFailId':'Fail Id',
	    'LUploadType':'Fail Type',
	    'LUploadexisted':'Existed',
	    'LUploadNotSure':'Not Sure',
	    'LUploadArgError':'Arg Error',
	    'LUploadFailCounts':'Records fail，',
	    'LUploadFailContent':'Click here to export the failures',
	    'LUploadError':'Upload Failed',
	    'LPleaseChooseFile': 'Please choose file',

	    'LStatisticsNameTime': 'Store Time',
	    'LStatisticsNameType': 'Store Type',
	    'LStatisticsDay1': 'First Day',
	    'LStatisticsDay2': 'Second Day',
	    'LStatisticsDay3': 'Third Day',
	    'LStatisticsDayO': 'Overdue',
	    'LStatisticsPer': '%',
	    'LStatisticsMINI': 'MINI',
	    'LStatisticsS': 'S',
	    'LStatisticsM': 'M',
	    'LStatisticsL': 'L',
	    'LStatisticsXL': 'XL',
	    'LStatisticsTotal': 'Combine',
	    'LStatisticsExport': 'Import',
	    'LPakpoboxEdit': 'Adjust Pakpobox',
	    'LPakpoboxRemoteUnlock': 'Remote Unlock',
	    'LPakpoboxChangeStatus': 'Modify Status',
	    'LPakpoboxMouthId': 'Door ID',

	    'LWaiting': 'Wait......',
	    'LSuccess': 'Successful！',
	    'LTips': 'Tips',
	    'LStatusError': 'forbid do this for door on this status',

	    'LTaskCOMMIT': 'Submit Successfully',
	    'LTaskSUCCESS': 'Task Successful',
	    'LTaskERROR': 'Task Error',


	    'LPleaseChoose': 'Please Choose',
	    'LNotEmpty': ' Cannot be Empty!',
	    'LFormatError': 'Format Error!',
	    'LInconformity': 'Inconformity!',
	    'LMultiSelected': 'Selected',
	    'LMultiSelectedAll': 'All Selected',
	    'LExists':' already exists!',
	    'LRename':' Please input again!',

	    //短信列表
	    'LSmsList': 'Message List',
	    'LSmsStatus': 'status',
	    'LSmsStatusReady': 'Ready',
	    'LSmsStatusSuc': 'Success',
	    'LSmsStatusFail': 'Failure',
	    //广告
	    'LBusinessPicChoose': 'Choose Picture...',
	    'LBusinessPicAdd': 'Add',

	    //逾期
	    'LOverdueStatus': 'If Overdue',
	    'LOverdueStatusOverdue': 'Overdue',
	    'LOverdueStatusYes': 'OD',
	    'LOverdueStatusNo': 'No',
	    'LOverdueTimeReset': 'Choose Overdue Time',
	    'LResetOverTime' : 'Reset Overdue Time',

	    //电商名称
	    'LElectronicCommerceName': 'ElectronicCommerceName',

	    //errorcode
	    //'LSUCCESS': '成功',
	    'LParameterError': 'Parameter Error',
	    'LNoJurisdiction': 'Access denied, have no jurisdiction',
	    'LUnknownError': 'Unknown Error',
	    //'LSystemError': '系统错误',
	    'LLoginTimeout': 'login timeout',
	    'LNotFindRepository': 'did not find repository',


	    //快递员派件数报表
	    'LMonday' : 'Mon',
	    'LTuesday' : 'Tue',
	    'LWednesday' : 'Wed',
	    'LThursday' : 'Thu',
	    'LFriday' : 'Fri',
	    'LSaturday' : 'Sat',
	    'LSunday' : 'Sun',
	    'LExpressNumber' : 'ExpressNumber',

	    //有格口被使用或者被锁定修改格口按钮不能点击
	    'LNotModifyMouth' : 'Have door is “USED” or “LOCKED”,Do not modify the door!',

	    //时区
	    'LACT':'Australia/Darwin',
	    'LAET':'Australia/Sydney',
	    'LAGT':'America/Argentina/Buenos_Aires',
	    'LART':'Africa/Cairo',
	    'LAST':'America/Anchorage',
	    'LBET':'America/Sao_Paulo',
	    'LBST':'Asia/Dhaka',
	    'LCAT':'America/St_Johns',
	    'LCNT':'America/St_Johns',
	    'LCST':'America/Chicago',
	    'LCTT':'Asia/Shanghai',
	    'LEAT':'Africa/Addis_Ababa',
	    'LECT':'Europe/Paris',
	    'LIET':'America/Indiana/Indianapolis',
	    'LIST':'Asia/Kolkata',
	    'LJST':'Asia/Tokyo',
	    'LMIT':'Pacific/Apia',
	    'LNET':'sia/Yerevan',
	    'LNST':'Pacific/Auckland',
	    'LPLT':'Asia/Karachi',
	    'LPNT':'America/Phoenix',
	    'LPRT':'America/Puerto_Rico',
	    'LPST':'America/Los_Angeles',
	    'LSST':'Pacific/Guadalcanal',
	    'LVST':'Asia/Ho_Chi_Minh',


	    //广告发布管理
	    'LADEdit' :'Advertising editor',
	    'LChooseADManager' :'Please select advertising pictures and upload to management',
	    'LADLocationInfo' :'The location information of display advertising',
	    'LChooseOprator' :'Choosing operator',
	    'LChooseImg':'Choose Picture',
	    'LUploadImgSuccess' :'Picture uploaded successfully',
	    'LUploadADInfoSuccess' :'Advertising uploaded successfully',
	    'LPleaseChooseADLocationInfo' :'Please select a picture position',
	    'LPleaseChooseOprator' :'Please select on the operators', 

	    //广告列表
	    'LOperatorName' :'Operator',
	    'LADPosition' :'Position',
	    'LImgCreateTime' :'CreateTime',
	    'LImgName' :'PicName',

	    //错误提示
	    //基本信息-运营商模块提示
	    'LOperatorDeleteFailTips':'the company has box, can not be delete',
	    'LLogisticsDeleteFailTips':'the company has the staff, can not be delete',
	    'LCompanyNameExist':'company name already exists',
	    'LCreateOutLimit':'Level out of limit',
	    'LUpdateParentCompanyFail':'Exceed the lowest grade',
	}

	module.exports = Lang;

/***/ },
/* 7 */
/***/ function(module, exports) {

	
	var Lang = {
	    'LTitle': "派宝箱",

	    'LConnectError': '连接服务器异常',
	    'LSystemError': '系统错误',

	    //登录
	    'LUsernamePlaceholer': '邮箱/手机/登录名',
	    'LUPasswordPlaceholer': '密码',
	    'LLoginSubmit': '登录',
	    'LContratUs': '联系我们',
	    'LForgetPassword': '忘记密码？',
	    'LValidation': '验证信息',
	    'LResetPassword': '重复密码',
	    'LValidationTips': '如忘记密码，请输入您的绑定信息以验证：',
	    'LValitaionSubmit': '立即验证',
	    'LValidationResultTips': '验证成功！已发送随机密码到您的邮箱！',
	    'LValitaionResultButton': '返回登录',

	    'LLogout': '退出登录',

	    'LUserTypeRoot': '超级管理员',
	    'LUserTypeManager': '管理员',
	    'LUserTypeOprator': '运营商员工',
	    'LUserTypeLogistics': '物流公司员工',
	    'LUserTypeOpratorAdmin': '运营商管理员',
	    'LUserTypeLogisticsAdmin': '物流公司管理员',

	    'LLoginname': '用户名',
	    'LUsername': '昵称',
	    'LPhoneNumber': '手机号',
	    'LCompany': '所属公司',
	    'LRole': '角色',

	    'LCompanyName': '公司名称',

	    'LUpdatePassword': '修改密码',
	    'LOldPassword': '原密码',
	    'LNewPassword': '新密码',
	    'LReNewPassword': '重复新密码',
	    'LPasswordInconsistent': '新密码输入不一致！',
	    'LPasswordSuccess': '重置密码成功！即将跳转至首页...',

	    'LAll': '全部',

	    'LLevel': '等级',
	    'LLevelOne': '一级',
	    'LLevelTwo': '二级',
	    'LLevelThree': '三级',
	    'LLevelFour': '四级',
	    'LLevelFive': '五级',

	    'LRole': '角色',
	    'LOperatorAdmin': '运营商管理员',
	    'LOperatorUser': '运营商员工',
	    'LLogisticsAdmin': '物流公司管理员',
	    'LLogisticsUser': '物流公司员工',
	    'LRootUser': '超级管理员',

	    'LStatus': '快件状态',
	    'LStatusOn': '启用',
	    'LStatusOff': '禁用',

	    'LNumber': '快件编号',
	    'LName': '名称',
	    'LCompanyNumber':'编号',
	    'LSearch': '查询',
	    'LPhoneNum': '取件手机',
	    'LTime': '时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间',
	    'LTimeStore': '存件时间',
	    'LTimeStatistics': '统计时间',
	    'LTimeTake': '取件时间',
	    'LEcommerce': '选择电商',
	    'LStatisticsNote':'(备注：默认为30天的取件统计记录,如需其他时段请选择统计时间)',

	    //新增运营商
	    'LOperatorInfo': '运营商信息',
	    'LLinkmanInfo': '联系人',
	    'LOperatorInfoTips': '请确认运营商信息填写无误',
	    'LLinkmanInfoTips':'请确认联系人信息填写无误',
	    'LOperatorNamePlaceholder': '输入运营商名称',
	    'LOperatorParentPlaceholder': '请输入上级运营商名称',
	    // 'LOperatorParentSelectName': '请确认物流公司信息填写无误',

	    //新增物流公司
	    'LLogisticsInfo': '物流公司信息',
	    'LLogisticsInfoTips': '请确认物流公司信息填写无误',
	    'LLogisticsNamePlaceholder': '输入物流公司名称',
	    'LLogisticsParentPlaceholder': '请输入上级物流公司名称',

	    //新增人员信息
	    'LPeopleInfo': '人员信息',
	    'LPeopleType':'人员类型',

	    //人员信息详情
	    'LPeopleInfoName': '人员姓名',
	    'LPeopleInfoPhone': '人员电话',
	    'LPeopleInfoWallets': '人员钱包',

	    'LClose': '关闭',
	    'LApply': '确定',
	    'LReset': '重置',
	    'LCancel': '取消',
	    'LNext': '下一步',
	    'LSubmit': '提交',
	    'LSubmitLoading': '正在提交...',
	    'LSubmitValidate': '立即验证',
	    'LSubmitValidating': '正在验证...',

	    'LExpressInfo': '快件信息',
	    'LExpressStatuStoring': '未存',
	    'LExpressStatuStore': '已存',
	    'LExpressStatuStored': '已取',
	    'LExpressStatuTimeout': '逾期',
	    'LExpressStatuCourierPickup': '物流公司收',
	    'LExpressStatuManagerPickup': '运营商收',


	    //table
	    'LTableOrderSeq': '序列',
	    'LTableOrderNumber': '快件编号',
	    'LTableTakerPhone': '取件人手机',
	    'LTableCreateTime':'创建时间',
	    'LTableStoreTime': '存件时间',
	    'LTableTakeTime': '取件时间',
	    'LTablePakpoboxNum': '箱子编号',
	    'LTableValidationNum': '验证码',
	    'LTableExpressStatu': '快件状态',
	    'LTableOperator': '操作',
	    'LTableDetails': '详情',
	    'LTableDelete' : '删除',
	    'LTableDeleteOperator' : '删除操作',
	    'LTableDeleteAffirm' : '是否删除人员信息',
	    'LTableDeleteCompanyAffirm' : '是否删除公司信息',
	    'LTableDeleteCompanySuccess': '公司信息删除成功',
	    'LTableDeleteSuccess' : '人员信息删除成功',
	    'LTableDeleteFailed': '人员信息删除失败',
	    'LTablecCompanyDeleteFailed': '公司信息删除失败',



	    //运营商tableHead
	    'LTableOperatorsSqe': '序列',
	    'LTableOperatorsName': '运营商名称',
	    'LTableOperatorsLevel': '等级',
	    'LTableOperatorsParent': '上级运营商',

	    'LToEdit': '点此修改',
	    //运营商详情
	    'LDetailOperatorsId': '运营商编号',
	    'LDetailOperatorsName': '运营商名称',
	    'LDetailOperatorsParentName': '上级运营商名称',
	    'LDetailOperatorsLevel': '运营商等级',
	    'LDetailOperatorsParentId': '上级运营商编号',
	    'LDetailOperatorsContact': '联系人',
	    'LDetailOperatorsContactPhone': '联系人手机号',
	    'LDetailOperatorsContactMail': '联系人邮箱',

	    //物流公司详情
	    'LDetailLogisticsInfo': '物流公司信息',
	    'LDetailLogisticsId': '物流公司编号',
	    'LDetailLogisticsName': '物流公司名称',
	    'LDetailLogisticsLevel': '物流公司等级',
	    'LDetailLogisticsParentName': '上级物流公司名称',
	    'LDetailLogisticsParentId': '上级物流公司编号',
	    'LDetailLogisticsContact': '联系人',
	    'LDetailLogisticsContactPhone': '联系人手机号',
	    'LDetailLogisticsContactMail': '联系人邮箱',


	    //快件详情
	    'LDetailPakpoboxMouth': '隔口编号',
	    'LDetailPakpobox': '派宝箱编号',
	    'LDetailPakpoboxName': '派宝箱名称',
	    'LDetailTakerName': '取件人',
	    'LDetailTakerPhone': '取件人手机',
	    'LDetailStoreName': '存件人',
	    'LDetailStorePhone': '存件人手机',
	    'LDetailCreateTime': '创建时间',
	    'LDetailStoreTime': '存件时间',
	    'LDetailTakeTime': '取件时间',
	    'LDetailOverTime': '到期时间',
	    'LDetailStatu': '快件状态',
	    'LDetailValidation': '验证码',
	    'LDetailModify': '修改',
	    'LDetailSure': '确定',
	    'LDetailIfReSendValidation': '是否确认重发验证码？',
	    'LDetailIfResetStatu': '是否确认重置？',
	    'LDetailIfReSendSuccessfully': '重发验证码成功！',
	    'LDetailIfReSendFailed': '重发验证码失败！',
	    'LDetailIfDoReset': '重发已经发出！',
	    'LDetailReseting': '正在重置中。。。。',
	    'LDetailIfResetSuccessfully': '重置成功！',
	    'LDetailIfResetFailed': '重置失败！',

	    //人员信息详情
	    'LDetailPeople': '存件时间',
	    'LDetailTakeTime': '取件时间',
	    'LDetailOverTime': '到期时间',
	    'LDetailStatu': '快件状态',
	    'LDetailValidation': '验证码',
	    'LDetailExpressMessage': '已发短信',
	    'LDetailMsgClick': '点击查看',

	    //导航
	    'LNavBaseInfomation': '基础信息',
	    'LNavOperator': '运营商',
	    'LNavLogisticsCompany': '物流公司',
	    'LNavPeople': '人员信息',
	    'LNavCourier': '快递员',
	    'LNavAccount': '当前账户',
	    'LNavPakpobox': '派宝箱',
	    'LNavPakpoboxMaintain': '维护',
	    'LNavPakpoboxManagement': '综合管理',
	    'LNavExpressManagement': '快件管理',
	    'LNavAbnomalExpress': '异常逾期件维护',
	    'LNavExpressManagementAll': '快递员派件信息',
	    'LNavExpressManagementSend': '寄件信息',
	    'LNavExpressManagementCustomertToStaff':'用户寄件信息',
	    'LNavExpressManagementBack': '退件信息',
	    'LNavExpressManagementImport': '导入',
	    'LNavAd': '广告投放',
	    'LNavAdManagement': '广告发布管理',
	    'LNavStatic'     :  '统计信息',
	    'LNavStaticExpress'     :  '快件统计',

	    //快递员
	    'LCourierCompany': '公司',
	    'LCourierName': '昵称',
	    'LCourierPhone': '手机',

	    //快递公司
	    'LLogisticsCompany': '公司',
	    'LLogisticsLevel': '级别',
	    'LLogisticsParent': '上级公司',
	    'LLogisticsParentId': '上级公司ID',

	    //拉取信息提示
	    'LResponseEmpty': '是空的哦！',
	    'LResponseError': '出错啦！',

	    //新建按钮
	    'LNewOperator': '+ 新建运营商',
	    'LNewLogistics': '+ 新建物流公司',
	    'LNewCourier': '+ 新建人员信息',

	    //导出列表
	    'LExportlist': '导出列表',

	    //操作列表
	    'LSendValidation': '重发验证码',
	    'LResetStatus': '重置状态',

	    //分页
	    'LGoto': '前往',
	    'LPageNum':'页总数:',
	    'LRecordNum':'记录总数:',

	    //导入列表
	    'LImportExpressType': '快件类型',
	    'LImportAll': '全部',
	    'LImportCourier':'快递员派件',
	    'LImportSend':'寄件',
	    'LImportReturn':'退件',
	    'LImportExpress':'导入快件',
	    'LImportModelDownload':'下载导入模版',

	    //新增派宝箱
	    'LPakpoboxOperator': '所属运营商ID',
	    'LPakpoboxName': '派宝箱名称',
	    'LPakpoboxOrderNo': '派宝箱业务编号',
	    'LPakpoboxCurrencyUnit': '派宝箱货币单位',
	    'LPakpoboxZoneId': '派宝箱时区',
	    'LPakpoboxOverdueType': '逾期类型',
	    'LPakpoboxOverdueTime': '逾期时间',
	    'LPakpoboxSmsAccount': '短信运营商ID',
	    'LBoxSize': '派宝箱大小',
	    'LPakpoboxInfoTips': '请确认箱子信息填写无误。',
	    'LFormNone': '信息填写不完整！',


	    //派宝箱维护
	    'LPakpoboxStatus':'状态' ,
	    'LPakpoboxRun':'启用' ,
	    'LPakpoboxStop':'禁用' ,
	    'LPakpoboxException':'异常' ,
	    'LPakpoboxStopSuccess':'箱子启用',
	    'LPakpoboxRunSuccess':'箱子禁用',
	    'LPakpoboxOperator':'运营商编号' ,
	    'LPakpoboxName':'派宝箱名称',
	    'LPakpoboxOperatorName':'运营商名称',
	    'LPakpoboxStatus':'派宝箱状态',
	    'LPakpoboxDetail':'派宝箱管理',
	    'LPakpoboxNew':'+新增派宝箱',
	    'LPakpoboxFreeNum': '格口空闲数量',
	    'LPakpoboxNum':'派宝箱编号',
	    'LPakpoBoxDetail': '派宝箱详情',
	    'LPakpoBoxColumns': '派宝箱两列之间不能有空列！',
	    'LPakpoBoxSubmitRespose': '提交成功，页面即将跳转！',
	    'LPakpoBoxSubmitFail': '提交失败！',
	    'LPakpoBoxSubmitBack': '点击确定返回上一页编辑派宝箱信息。！',
	    'LPakpoBoxModifyMouthStatus': '修改隔口状态：',
	    'LPakpoBoxEmpty': '空闲',
	    'LPakpoBoxLock': '锁定',
	    'LPakpoBoxFreeMouthNum': '剩余空闲格口数量：',
	    'LPakpoBoxRemoteUnlock': '是否确认对以下选中格口进行远程开锁？',
	    'LPakpoBoxStatusModify': '是否确认对以下选中格口状态进行修改？',
	    'LPakpoBoxPleaseChooseAMouth': '请选择一个格口',
	    'LPakpoBoxForbiddenBusyStatus': '不允许操作占用中的格口状态！',
	    'LPakpoBoxGetMouthIdFailed': '获取格口id失败！',
	    'LPakpoBoxFree': '空闲',
	    'LPakpoBoxBusy': '占用',
	    'LPakpoBoxLocked': '锁定',
	    'LAddPakpoboxView': '前往添加格口页面!',
	    'LCopyCol':'复制列',

	    //导入
	    'LChooseFile':'选择文件',
	    'LBeginUpload':'开始上传',
	    'LUploadGuide':'导入快件指引',
	    'LUploadStep1':'1. 首次使用请先',
	    'LUploadStep12':'，按照模板所示填写您的快件信息',
	    'LUploadStep2':'2. 点击上方选择文件，选择您要导入的文件',
	    'LUploadStep3':'3. 点击开始上传，即可上传您的文件',
	    'LWaitingUpload':'等待上传....',
	    'LUploading':'上传中....',
	    'LUploadingComplete':'上传结束',
	    'LUploadingSuccess': '上传成功',
	    'LUploadFailId':'失败Id',
	    'LUploadType':'失败类型',
	    'LUploadexisted':'已存在',
	    'LUploadNotSure':'存疑',
	    'LUploadArgError':'参数错误',
	    'LUploadFailCounts':'条记录上传失败，',
	    'LUploadFailContent':'点此可导出失败内容',
	    'LUploadError':'上传出错',
	    'LPleaseChooseFile': '请选择文件',

	    'LStatisticsNameTime': '存放时间统计表',
	    'LStatisticsNameType': '存放规格统计表',
	    'LStatisticsDay1': '第一日取件',
	    'LStatisticsDay2': '第二日取件',
	    'LStatisticsDay3': '第三日取件',
	    'LStatisticsDayO': '逾期被取',
	    'LStatisticsPer': '百分比',
	    'LStatisticsMINI': 'MINI',
	    'LStatisticsS': 'S',
	    'LStatisticsM': 'M',
	    'LStatisticsL': 'L',
	    'LStatisticsXL': 'XL',
	    'LStatisticsTotal': '合计',
	    'LStatisticsExport': '导出报表',
	    'LPakpoboxEdit': '修改派宝箱信息',
	    'LPakpoBoxInfoUpdate':'修改派宝箱格口',
	    'LPakpoboxRemoteUnlock': '远程开锁',
	    'LPakpoboxChangeStatus': '修改格口状态',
	    'LPakpoboxMouthId': '格口ID',

	    'LWaiting': '请稍等......',
	    'LSuccess': '成功！',
	    'LTips': '提示',
	    'LStatusError': '该状态不允许此操作',

	    'LTaskCOMMIT': '已经提交',
	    'LTaskSUCCESS': '执行成功',
	    'LTaskERROR': '执行失败',

	    'LPleaseChoose': '请选择',
	    'LNotEmpty': '不能为空！',
	    'LFormatError': '格式有误！',
	    'LInconformity': '不一致！',
	    'LMultiSelected': '个已选',
	    'LMultiSelectedAll': '全选',
	    'LExists':'已经存在!',
	    'LRename':'请重新输入!',



	    //短信列表
	    'LSmsList': '本快件短信列表',
	    'LSmsStatus': '状态',
	    'LSmsStatusReady': '准备发送',
	    'LSmsStatusSuc': '发送成功',
	    'LSmsStatusFail': '发送失败',

	    //广告
	    'LBusinessPicChoose': '选择图片...',
	    'LBusinessPicAdd': '添加',

	    //逾期
	    'LOverdueStatus': '是否逾期',
	    'LOverdueStatusOverdue':'逾期',
	    'LOverdueStatusYes': '逾期',
	    'LOverdueStatusNo': '未逾期',
	    'LOverdueTimeReset': '选择重置逾期时间',
	    'LResetOverTime' : '重置逾期时间',

	    //电商名称
	    'LElectronicCommerceName': '电商名称',

	     //errorcode
	    //'LSUCCESS': '成功',
	    'LParameterError': '参数错误',
	    'LNoJurisdiction': '禁止访问，没有权限',
	    'LUnknownError': '未知错误',
	    //'LSystemError': '系统错误',
	    'LLoginTimeout': '登录超时',
	    'LNotFindRepository': '没有找到资源',

	    //快递员派件数报表
	    'LMonday' : '周一',
	    'LTuesday' : '周二',
	    'LWednesday' : '周三',
	    'LThursday' : '周四',
	    'LFriday' : '周五',
	    'LSaturday' : '周六',
	    'LSunday' : '周日',
	    'LExpressNumber' : '快递员派件数',
	     //有格口被使用或者被锁定修改格口按钮不能点击
	    'LNotModifyMouth' : '有格口被“使用”或者被“锁定”，“修改派宝箱格口”按钮不能使用!',

	    //广告发布管理
	    'LADEdit' :'广告发布编辑',
	    'LChooseADManager' :'请选择广告图片并上传至管理端',
	    'LADLocationInfo' :'广告展示时的位置信息',
	    'LChooseOprator' :'选择投放的运营商',
	    'LChooseImg':'选择图片',
	    'LUploadImgSuccess' :'图片上传成功',
	    'LUploadADInfoSuccess' :'广告上传成功',
	    'LPleaseChooseADLocationInfo' :'请选择图片位置',
	    'LPleaseChooseOprator' :'请选择投放的运营商',
	    
	    //广告列表
	    'LOperatorName' :'运营商名称',
	    'LADPosition' :'广告的位置',
	    'LImgCreateTime' :'创建时间',
	    'LImgName' :'图片名称',

	    //错误提示
	    //基本信息-运营商模块提示
	    'LOperatorDeleteFailTips':'此运营商下还有箱子,不能删除!',
	    'LLogisticsDeleteFailTips':'此物流公司下还有人员，不能被删除!',
	    'LCompanyNameExist':'公司名称已经存在',
	    'LCreateOutLimit':'不能创建5级以下权限的公司',
	    'LUpdateParentCompanyFail':'不能修改为5级以下权限的公司',


	}

	module.exports = Lang;

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * @license AngularJS v1.4.0-rc.2
	 * (c) 2010-2015 Google, Inc. http://angularjs.org
	 * License: MIT
	 */
	(function(window, angular, undefined) {'use strict';

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 *     Any commits to this file should be reviewed with security in mind.  *
	 *   Changes to this file can potentially create security vulnerabilities. *
	 *          An approval from 2 Core members with history of modifying      *
	 *                         this file is required.                          *
	 *                                                                         *
	 *  Does the change somehow allow for arbitrary javascript to be executed? *
	 *    Or allows for someone to change the prototype of built-in objects?   *
	 *     Or gives undesired access to variables likes document or window?    *
	 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	var $sanitizeMinErr = angular.$$minErr('$sanitize');

	/**
	 * @ngdoc module
	 * @name ngSanitize
	 * @description
	 *
	 * # ngSanitize
	 *
	 * The `ngSanitize` module provides functionality to sanitize HTML.
	 *
	 *
	 * <div doc-module-components="ngSanitize"></div>
	 *
	 * See {@link ngSanitize.$sanitize `$sanitize`} for usage.
	 */

	/*
	 * HTML Parser By Misko Hevery (misko@hevery.com)
	 * based on:  HTML Parser By John Resig (ejohn.org)
	 * Original code by Erik Arvidsson, Mozilla Public License
	 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
	 *
	 * // Use like so:
	 * htmlParser(htmlString, {
	 *     start: function(tag, attrs, unary) {},
	 *     end: function(tag) {},
	 *     chars: function(text) {},
	 *     comment: function(text) {}
	 * });
	 *
	 */


	/**
	 * @ngdoc service
	 * @name $sanitize
	 * @kind function
	 *
	 * @description
	 *   The input is sanitized by parsing the HTML into tokens. All safe tokens (from a whitelist) are
	 *   then serialized back to properly escaped html string. This means that no unsafe input can make
	 *   it into the returned string, however, since our parser is more strict than a typical browser
	 *   parser, it's possible that some obscure input, which would be recognized as valid HTML by a
	 *   browser, won't make it through the sanitizer. The input may also contain SVG markup.
	 *   The whitelist is configured using the functions `aHrefSanitizationWhitelist` and
	 *   `imgSrcSanitizationWhitelist` of {@link ng.$compileProvider `$compileProvider`}.
	 *
	 * @param {string} html HTML input.
	 * @returns {string} Sanitized HTML.
	 *
	 * @example
	   <example module="sanitizeExample" deps="angular-sanitize.js">
	   <file name="index.html">
	     <script>
	         angular.module('sanitizeExample', ['ngSanitize'])
	           .controller('ExampleController', ['$scope', '$sce', function($scope, $sce) {
	             $scope.snippet =
	               '<p style="color:blue">an html\n' +
	               '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
	               'snippet</p>';
	             $scope.deliberatelyTrustDangerousSnippet = function() {
	               return $sce.trustAsHtml($scope.snippet);
	             };
	           }]);
	     </script>
	     <div ng-controller="ExampleController">
	        Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
	       <table>
	         <tr>
	           <td>Directive</td>
	           <td>How</td>
	           <td>Source</td>
	           <td>Rendered</td>
	         </tr>
	         <tr id="bind-html-with-sanitize">
	           <td>ng-bind-html</td>
	           <td>Automatically uses $sanitize</td>
	           <td><pre>&lt;div ng-bind-html="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
	           <td><div ng-bind-html="snippet"></div></td>
	         </tr>
	         <tr id="bind-html-with-trust">
	           <td>ng-bind-html</td>
	           <td>Bypass $sanitize by explicitly trusting the dangerous value</td>
	           <td>
	           <pre>&lt;div ng-bind-html="deliberatelyTrustDangerousSnippet()"&gt;
	&lt;/div&gt;</pre>
	           </td>
	           <td><div ng-bind-html="deliberatelyTrustDangerousSnippet()"></div></td>
	         </tr>
	         <tr id="bind-default">
	           <td>ng-bind</td>
	           <td>Automatically escapes</td>
	           <td><pre>&lt;div ng-bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
	           <td><div ng-bind="snippet"></div></td>
	         </tr>
	       </table>
	       </div>
	   </file>
	   <file name="protractor.js" type="protractor">
	     it('should sanitize the html snippet by default', function() {
	       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
	         toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
	     });

	     it('should inline raw snippet if bound to a trusted value', function() {
	       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).
	         toBe("<p style=\"color:blue\">an html\n" +
	              "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
	              "snippet</p>");
	     });

	     it('should escape snippet without any filter', function() {
	       expect(element(by.css('#bind-default div')).getInnerHtml()).
	         toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
	              "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
	              "snippet&lt;/p&gt;");
	     });

	     it('should update', function() {
	       element(by.model('snippet')).clear();
	       element(by.model('snippet')).sendKeys('new <b onclick="alert(1)">text</b>');
	       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
	         toBe('new <b>text</b>');
	       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).toBe(
	         'new <b onclick="alert(1)">text</b>');
	       expect(element(by.css('#bind-default div')).getInnerHtml()).toBe(
	         "new &lt;b onclick=\"alert(1)\"&gt;text&lt;/b&gt;");
	     });
	   </file>
	   </example>
	 */
	function $SanitizeProvider() {
	  this.$get = ['$$sanitizeUri', function($$sanitizeUri) {
	    return function(html) {
	      var buf = [];
	      htmlParser(html, htmlSanitizeWriter(buf, function(uri, isImage) {
	        return !/^unsafe/.test($$sanitizeUri(uri, isImage));
	      }));
	      return buf.join('');
	    };
	  }];
	}

	function sanitizeText(chars) {
	  var buf = [];
	  var writer = htmlSanitizeWriter(buf, angular.noop);
	  writer.chars(chars);
	  return buf.join('');
	}


	// Regular Expressions for parsing tags and attributes
	var START_TAG_REGEXP =
	       /^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/,
	  END_TAG_REGEXP = /^<\/\s*([\w:-]+)[^>]*>/,
	  ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
	  BEGIN_TAG_REGEXP = /^</,
	  BEGING_END_TAGE_REGEXP = /^<\//,
	  COMMENT_REGEXP = /<!--(.*?)-->/g,
	  DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
	  CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
	  SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
	  // Match everything outside of normal chars and " (quote character)
	  NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;


	// Good source of info about elements and attributes
	// http://dev.w3.org/html5/spec/Overview.html#semantics
	// http://simon.html5.org/html-elements

	// Safe Void Elements - HTML5
	// http://dev.w3.org/html5/spec/Overview.html#void-elements
	var voidElements = makeMap("area,br,col,hr,img,wbr");

	// Elements that you can, intentionally, leave open (and which close themselves)
	// http://dev.w3.org/html5/spec/Overview.html#optional-tags
	var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
	    optionalEndTagInlineElements = makeMap("rp,rt"),
	    optionalEndTagElements = angular.extend({},
	                                            optionalEndTagInlineElements,
	                                            optionalEndTagBlockElements);

	// Safe Block Elements - HTML5
	var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap("address,article," +
	        "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
	        "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));

	// Inline Elements - HTML5
	var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," +
	        "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
	        "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));

	// SVG Elements
	// https://wiki.whatwg.org/wiki/Sanitization_rules#svg_Elements
	// Note: the elements animate,animateColor,animateMotion,animateTransform,set are intentionally omitted.
	// They can potentially allow for arbitrary javascript to be executed. See #11290
	var svgElements = makeMap("circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph," +
	        "hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline," +
	        "radialGradient,rect,stop,svg,switch,text,title,tspan,use");

	// Special Elements (can contain anything)
	var specialElements = makeMap("script,style");

	var validElements = angular.extend({},
	                                   voidElements,
	                                   blockElements,
	                                   inlineElements,
	                                   optionalEndTagElements,
	                                   svgElements);

	//Attributes that have href and hence need to be sanitized
	var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap,xlink:href");

	var htmlAttrs = makeMap('abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,' +
	    'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,' +
	    'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,' +
	    'scope,scrolling,shape,size,span,start,summary,target,title,type,' +
	    'valign,value,vspace,width');

	// SVG attributes (without "id" and "name" attributes)
	// https://wiki.whatwg.org/wiki/Sanitization_rules#svg_Attributes
	var svgAttrs = makeMap('accent-height,accumulate,additive,alphabetic,arabic-form,ascent,' +
	    'baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,' +
	    'cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,' +
	    'font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,' +
	    'height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,' +
	    'marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,' +
	    'max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,' +
	    'path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,' +
	    'requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,' +
	    'stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,' +
	    'stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,' +
	    'stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,' +
	    'underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,' +
	    'width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,' +
	    'xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan', true);

	var validAttrs = angular.extend({},
	                                uriAttrs,
	                                svgAttrs,
	                                htmlAttrs);

	function makeMap(str, lowercaseKeys) {
	  var obj = {}, items = str.split(','), i;
	  for (i = 0; i < items.length; i++) {
	    obj[lowercaseKeys ? angular.lowercase(items[i]) : items[i]] = true;
	  }
	  return obj;
	}


	/**
	 * @example
	 * htmlParser(htmlString, {
	 *     start: function(tag, attrs, unary) {},
	 *     end: function(tag) {},
	 *     chars: function(text) {},
	 *     comment: function(text) {}
	 * });
	 *
	 * @param {string} html string
	 * @param {object} handler
	 */
	function htmlParser(html, handler) {
	  if (typeof html !== 'string') {
	    if (html === null || typeof html === 'undefined') {
	      html = '';
	    } else {
	      html = '' + html;
	    }
	  }
	  var index, chars, match, stack = [], last = html, text;
	  stack.last = function() { return stack[stack.length - 1]; };

	  while (html) {
	    text = '';
	    chars = true;

	    // Make sure we're not in a script or style element
	    if (!stack.last() || !specialElements[stack.last()]) {

	      // Comment
	      if (html.indexOf("<!--") === 0) {
	        // comments containing -- are not allowed unless they terminate the comment
	        index = html.indexOf("--", 4);

	        if (index >= 0 && html.lastIndexOf("-->", index) === index) {
	          if (handler.comment) handler.comment(html.substring(4, index));
	          html = html.substring(index + 3);
	          chars = false;
	        }
	      // DOCTYPE
	      } else if (DOCTYPE_REGEXP.test(html)) {
	        match = html.match(DOCTYPE_REGEXP);

	        if (match) {
	          html = html.replace(match[0], '');
	          chars = false;
	        }
	      // end tag
	      } else if (BEGING_END_TAGE_REGEXP.test(html)) {
	        match = html.match(END_TAG_REGEXP);

	        if (match) {
	          html = html.substring(match[0].length);
	          match[0].replace(END_TAG_REGEXP, parseEndTag);
	          chars = false;
	        }

	      // start tag
	      } else if (BEGIN_TAG_REGEXP.test(html)) {
	        match = html.match(START_TAG_REGEXP);

	        if (match) {
	          // We only have a valid start-tag if there is a '>'.
	          if (match[4]) {
	            html = html.substring(match[0].length);
	            match[0].replace(START_TAG_REGEXP, parseStartTag);
	          }
	          chars = false;
	        } else {
	          // no ending tag found --- this piece should be encoded as an entity.
	          text += '<';
	          html = html.substring(1);
	        }
	      }

	      if (chars) {
	        index = html.indexOf("<");

	        text += index < 0 ? html : html.substring(0, index);
	        html = index < 0 ? "" : html.substring(index);

	        if (handler.chars) handler.chars(decodeEntities(text));
	      }

	    } else {
	      // IE versions 9 and 10 do not understand the regex '[^]', so using a workaround with [\W\w].
	      html = html.replace(new RegExp("([\\W\\w]*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'),
	        function(all, text) {
	          text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");

	          if (handler.chars) handler.chars(decodeEntities(text));

	          return "";
	      });

	      parseEndTag("", stack.last());
	    }

	    if (html == last) {
	      throw $sanitizeMinErr('badparse', "The sanitizer was unable to parse the following block " +
	                                        "of html: {0}", html);
	    }
	    last = html;
	  }

	  // Clean up any remaining tags
	  parseEndTag();

	  function parseStartTag(tag, tagName, rest, unary) {
	    tagName = angular.lowercase(tagName);
	    if (blockElements[tagName]) {
	      while (stack.last() && inlineElements[stack.last()]) {
	        parseEndTag("", stack.last());
	      }
	    }

	    if (optionalEndTagElements[tagName] && stack.last() == tagName) {
	      parseEndTag("", tagName);
	    }

	    unary = voidElements[tagName] || !!unary;

	    if (!unary) {
	      stack.push(tagName);
	    }

	    var attrs = {};

	    rest.replace(ATTR_REGEXP,
	      function(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
	        var value = doubleQuotedValue
	          || singleQuotedValue
	          || unquotedValue
	          || '';

	        attrs[name] = decodeEntities(value);
	    });
	    if (handler.start) handler.start(tagName, attrs, unary);
	  }

	  function parseEndTag(tag, tagName) {
	    var pos = 0, i;
	    tagName = angular.lowercase(tagName);
	    if (tagName) {
	      // Find the closest opened tag of the same type
	      for (pos = stack.length - 1; pos >= 0; pos--) {
	        if (stack[pos] == tagName) break;
	      }
	    }

	    if (pos >= 0) {
	      // Close all the open elements, up the stack
	      for (i = stack.length - 1; i >= pos; i--)
	        if (handler.end) handler.end(stack[i]);

	      // Remove the open elements from the stack
	      stack.length = pos;
	    }
	  }
	}

	var hiddenPre=document.createElement("pre");
	/**
	 * decodes all entities into regular string
	 * @param value
	 * @returns {string} A string with decoded entities.
	 */
	function decodeEntities(value) {
	  if (!value) { return ''; }

	  hiddenPre.innerHTML = value.replace(/</g,"&lt;");
	  // innerText depends on styling as it doesn't display hidden elements.
	  // Therefore, it's better to use textContent not to cause unnecessary reflows.
	  return hiddenPre.textContent;
	}

	/**
	 * Escapes all potentially dangerous characters, so that the
	 * resulting string can be safely inserted into attribute or
	 * element text.
	 * @param value
	 * @returns {string} escaped text
	 */
	function encodeEntities(value) {
	  return value.
	    replace(/&/g, '&amp;').
	    replace(SURROGATE_PAIR_REGEXP, function(value) {
	      var hi = value.charCodeAt(0);
	      var low = value.charCodeAt(1);
	      return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
	    }).
	    replace(NON_ALPHANUMERIC_REGEXP, function(value) {
	      return '&#' + value.charCodeAt(0) + ';';
	    }).
	    replace(/</g, '&lt;').
	    replace(/>/g, '&gt;');
	}

	/**
	 * create an HTML/XML writer which writes to buffer
	 * @param {Array} buf use buf.jain('') to get out sanitized html string
	 * @returns {object} in the form of {
	 *     start: function(tag, attrs, unary) {},
	 *     end: function(tag) {},
	 *     chars: function(text) {},
	 *     comment: function(text) {}
	 * }
	 */
	function htmlSanitizeWriter(buf, uriValidator) {
	  var ignore = false;
	  var out = angular.bind(buf, buf.push);
	  return {
	    start: function(tag, attrs, unary) {
	      tag = angular.lowercase(tag);
	      if (!ignore && specialElements[tag]) {
	        ignore = tag;
	      }
	      if (!ignore && validElements[tag] === true) {
	        out('<');
	        out(tag);
	        angular.forEach(attrs, function(value, key) {
	          var lkey=angular.lowercase(key);
	          var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
	          if (validAttrs[lkey] === true &&
	            (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
	            out(' ');
	            out(key);
	            out('="');
	            out(encodeEntities(value));
	            out('"');
	          }
	        });
	        out(unary ? '/>' : '>');
	      }
	    },
	    end: function(tag) {
	        tag = angular.lowercase(tag);
	        if (!ignore && validElements[tag] === true) {
	          out('</');
	          out(tag);
	          out('>');
	        }
	        if (tag == ignore) {
	          ignore = false;
	        }
	      },
	    chars: function(chars) {
	        if (!ignore) {
	          out(encodeEntities(chars));
	        }
	      }
	  };
	}


	// define ngSanitize module and register $sanitize service
	angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);

	/* global sanitizeText: false */

	/**
	 * @ngdoc filter
	 * @name linky
	 * @kind function
	 *
	 * @description
	 * Finds links in text input and turns them into html links. Supports http/https/ftp/mailto and
	 * plain email address links.
	 *
	 * Requires the {@link ngSanitize `ngSanitize`} module to be installed.
	 *
	 * @param {string} text Input text.
	 * @param {string} target Window (_blank|_self|_parent|_top) or named frame to open links in.
	 * @returns {string} Html-linkified text.
	 *
	 * @usage
	   <span ng-bind-html="linky_expression | linky"></span>
	 *
	 * @example
	   <example module="linkyExample" deps="angular-sanitize.js">
	     <file name="index.html">
	       <script>
	         angular.module('linkyExample', ['ngSanitize'])
	           .controller('ExampleController', ['$scope', function($scope) {
	             $scope.snippet =
	               'Pretty text with some links:\n'+
	               'http://angularjs.org/,\n'+
	               'mailto:us@somewhere.org,\n'+
	               'another@somewhere.org,\n'+
	               'and one more: ftp://127.0.0.1/.';
	             $scope.snippetWithTarget = 'http://angularjs.org/';
	           }]);
	       </script>
	       <div ng-controller="ExampleController">
	       Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
	       <table>
	         <tr>
	           <td>Filter</td>
	           <td>Source</td>
	           <td>Rendered</td>
	         </tr>
	         <tr id="linky-filter">
	           <td>linky filter</td>
	           <td>
	             <pre>&lt;div ng-bind-html="snippet | linky"&gt;<br>&lt;/div&gt;</pre>
	           </td>
	           <td>
	             <div ng-bind-html="snippet | linky"></div>
	           </td>
	         </tr>
	         <tr id="linky-target">
	          <td>linky target</td>
	          <td>
	            <pre>&lt;div ng-bind-html="snippetWithTarget | linky:'_blank'"&gt;<br>&lt;/div&gt;</pre>
	          </td>
	          <td>
	            <div ng-bind-html="snippetWithTarget | linky:'_blank'"></div>
	          </td>
	         </tr>
	         <tr id="escaped-html">
	           <td>no filter</td>
	           <td><pre>&lt;div ng-bind="snippet"&gt;<br>&lt;/div&gt;</pre></td>
	           <td><div ng-bind="snippet"></div></td>
	         </tr>
	       </table>
	     </file>
	     <file name="protractor.js" type="protractor">
	       it('should linkify the snippet with urls', function() {
	         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
	             toBe('Pretty text with some links: http://angularjs.org/, us@somewhere.org, ' +
	                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
	         expect(element.all(by.css('#linky-filter a')).count()).toEqual(4);
	       });

	       it('should not linkify snippet without the linky filter', function() {
	         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText()).
	             toBe('Pretty text with some links: http://angularjs.org/, mailto:us@somewhere.org, ' +
	                  'another@somewhere.org, and one more: ftp://127.0.0.1/.');
	         expect(element.all(by.css('#escaped-html a')).count()).toEqual(0);
	       });

	       it('should update', function() {
	         element(by.model('snippet')).clear();
	         element(by.model('snippet')).sendKeys('new http://link.');
	         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
	             toBe('new http://link.');
	         expect(element.all(by.css('#linky-filter a')).count()).toEqual(1);
	         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText())
	             .toBe('new http://link.');
	       });

	       it('should work with the target property', function() {
	        expect(element(by.id('linky-target')).
	            element(by.binding("snippetWithTarget | linky:'_blank'")).getText()).
	            toBe('http://angularjs.org/');
	        expect(element(by.css('#linky-target a')).getAttribute('target')).toEqual('_blank');
	       });
	     </file>
	   </example>
	 */
	angular.module('ngSanitize').filter('linky', ['$sanitize', function($sanitize) {
	  var LINKY_URL_REGEXP =
	        /((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"”’]/,
	      MAILTO_REGEXP = /^mailto:/;

	  return function(text, target) {
	    if (!text) return text;
	    var match;
	    var raw = text;
	    var html = [];
	    var url;
	    var i;
	    while ((match = raw.match(LINKY_URL_REGEXP))) {
	      // We can not end in these as they are sometimes found at the end of the sentence
	      url = match[0];
	      // if we did not match ftp/http/www/mailto then assume mailto
	      if (!match[2] && !match[4]) {
	        url = (match[3] ? 'http://' : 'mailto:') + url;
	      }
	      i = match.index;
	      addText(raw.substr(0, i));
	      addLink(url, match[0].replace(MAILTO_REGEXP, ''));
	      raw = raw.substring(i + match[0].length);
	    }
	    addText(raw);
	    return $sanitize(html.join(''));

	    function addText(text) {
	      if (!text) {
	        return;
	      }
	      html.push(sanitizeText(text));
	    }

	    function addLink(url, text) {
	      html.push('<a ');
	      if (angular.isDefined(target)) {
	        html.push('target="',
	                  target,
	                  '" ');
	      }
	      html.push('href="',
	                url.replace(/"/g, '&quot;'),
	                '">');
	      addText(text);
	      html.push('</a>');
	    }
	  };
	}]);


	})(window, window.angular);


/***/ },
/* 9 */
/***/ function(module, exports) {

	var userType = {
	    'ROOT': 'LUserTypeRoot',
	    'OPERATOR_ADMIN': 'LUserTypeOpratorAdmin',
	    'OPERATOR_USER': 'LUserTypeOprator',
	    'LOGISTICS_COMPANY_ADMIN': 'LUserTypeLogisticsAdmin',
	    'LOGISTICS_COMPANY_USER': 'LUserTypeLogistics',
	}

	module.exports = userType;

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "<nav class=\"nav\">\r\n    <ul>\r\n        <li class=\"nav_title\">\r\n            <i class=\"nav_icon\" style=\"background:url(\r\n        assets/img/nav-icon.png\r\n        ) no-repeat center;\">\r\n            </i>\r\n            <span ng-bind=\"LNavBaseInfomation\"></span>\r\n        </li>\r\n\r\n        <li ng-class=\"{nav_item: 1, selected: location.pathname.split('/').pop() == 'operators.html'}\" ng-show=\"userrole == 'ROOT' ||userrole == 'OPERATOR_ADMIN' || userrole == 'OPERATOR_USER'\">\r\n            <a href=\"operators.html\" ng-bind=\"LNavOperator\">运营商</a>\r\n        </li>\r\n        <li ng-class=\"{nav_item: 1, selected: location.pathname.split('/').pop() == 'logistics.html'}\" ng-show=\"userrole == 'ROOT' ||userrole == 'LOGISTICS_COMPANY_ADMIN' || userrole == 'LOGISTICS_COMPANY_USER'\">\r\n            <a href=\"logistics.html\" ng-bind=\"LNavLogisticsCompany\">物流公司</a>\r\n        </li>\r\n        <li ng-class=\"{nav_item: 1, selected: location.pathname.split('/').pop() == 'courier.html'}\">\r\n            <a href=\"courier.html\" ng-bind=\"LNavPeople\">人员信息</a>\r\n        </li>\r\n        <li ng-class=\"{nav_item: 1, selected: location.pathname.split('/').pop() == 'index.html'}\">\r\n            <a href=\"index.html\" ng-bind=\"LNavAccount\">当前账户</a>\r\n        </li>\r\n    </ul>\r\n    <ul ng-show=\"userrole == 'ROOT' ||userrole == 'OPERATOR_ADMIN' || userrole == 'OPERATOR_USER'\">\r\n        <li class=\"nav_title\">\r\n            <i class=\"nav_icon\" style=\"background:url(\r\n        assets/img/nav-icon.png\r\n        ) no-repeat center;\">\r\n            </i>\r\n            <span ng-bind=\"LNavPakpobox\"></span>\r\n        </li>\r\n        <li class=\"nav_item\"  ng-class=\"{nav_item: 1, selected: location.pathname.split('/').pop() == 'pakpoboxList.html'}\">\r\n            <a href=\"pakpoboxList.html\" ng-bind=\"LNavPakpoboxMaintain\">维护</a>\r\n        </li>\r\n    </ul>\r\n    <ul>\r\n        <li class=\"nav_title\">\r\n            <i class=\"nav_icon\" style=\"background:url(\r\n        assets/img/nav-icon.png\r\n        ) no-repeat center;\">\r\n            </i>\r\n            <span ng-bind=\"LNavExpressManagement\"></span>\r\n        </li>\r\n\r\n        <li class=\"nav_item\"  ng-class=\"{nav_item: 1, selected: location.href.split('/').pop() == 'express.html?type=COURIER_STORE'}\">\r\n            <a href=\"express.html?type=COURIER_STORE\" ng-bind=\"LNavExpressManagementAll\">综合管理</a>\r\n        </li>\r\n\r\n        <li class=\"nav_item\"  ng-class=\"{nav_item: 1, selected: location.href.split('/').pop() == 'express.html?type=CUSTOMER_STORE'}\">\r\n            <a href=\"express.html?type=CUSTOMER_STORE\" ng-bind=\"LNavExpressManagementSend\">寄件信息</a>\r\n        </li>\r\n\t\t\r\n\t\t <li class=\"nav_item\"  ng-class=\"{nav_item: 1, selected: location.href.split('/').pop() == 'express.html?type=CUSTOMER_TO_STAFF'}\">\r\n            <a href=\"express.html?type=CUSTOMER_TO_STAFF\" ng-bind=\"LNavExpressManagementCustomertToStaff\">用户寄件信息</a>\r\n        </li>\r\n\r\n        <li class=\"nav_item\"  ng-class=\"{nav_item: 1, selected: location.href.split('/').pop() == 'express.html?type=CUSTOMER_REJECT'}\">\r\n            <a href=\"express.html?type=CUSTOMER_REJECT\" ng-bind=\"LNavExpressManagementBack\">退件信息</a>\r\n        </li>\r\n\r\n        <li class=\"nav_item\"  ng-class=\"{nav_item: 1, selected: location.pathname.split('/').pop() == 'expressImport.html'}\"  ng-show=\"userrole == 'ROOT' ||userrole == 'LOGISTICS_COMPANY_ADMIN' || userrole == 'LOGISTICS_COMPANY_USER'\">\r\n            <a href=\"expressImport.html\" ng-bind=\"LNavExpressManagementImport\">导入</a>\r\n        </li>\r\n    </ul>\r\n    <ul>\r\n        <li class=\"nav_title\">\r\n            <i class=\"nav_icon\" style=\"background:url(\r\n        assets/img/nav-icon.png\r\n        ) no-repeat center;\">\r\n            </i>\r\n            <span ng-bind=\"LNavStatic\"></span>\r\n        </li>\r\n        <li class=\"nav_item\" ng-class=\"{nav_item: 1, selected: location.pathname.split('/').pop() == 'statistics.html'}\">\r\n            <a href=\"statistics.html\" ng-bind=\"LNavStaticExpress\">统计信息</a>\r\n        </li>\r\n    </ul>\r\n    <ul ng-show=\"userrole == 'ROOT' ||userrole == 'OPERATOR_ADMIN' || userrole == 'OPERATOR_USER'\">\r\n        <li class=\"nav_title\">\r\n            <i class=\"nav_icon\" style=\"background:url(\r\n        assets/img/nav-icon.png\r\n        ) no-repeat center;\">\r\n            </i>\r\n            <span ng-bind=\"LNavAd\"></span>\r\n        </li>\r\n        <li class=\"nav_item\" ng-class=\"{nav_item: 1, selected: location.pathname.split('/').pop() == 'business.html'}\">\r\n            <a href=\"advertisementList.html\" ng-bind=\"LNavAdManagement\">广告发布管理</a>\r\n        </li>\r\n    </ul>\r\n</nav>"

/***/ },
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ function(module, exports) {

	module.exports = "<h3 class=\"info-h3\" ng-bind-html=\"info.title\"></h3>\r\n<hr class=\"info-hr\"/>\r\n\r\n<div class=\"info-content\">\r\n    <div ng-show=\"showTipsType==1\" class=\"loading\"><img ng-src=\"assets/img/loading.gif\"/></div>\r\n    <div ng-show=\"showTipsType==2\" class=\"loading\"><span ng-bind=\"LResponseEmpty\"></span></div>\r\n    <div class=\"info-item\" ng-repeat=\"item in info.content track by $index\">\r\n        <p ng-bind=\"item.key\"></p>\r\n        <p class=\"info-value\" ng-bind=\"item.value\"></p>\r\n    </div>\r\n    <div class=\"info-item\" ng-show=\"showMsg\">\r\n        <p ng-bind=\"LDetailExpressMessage\"></p>\r\n        <p class=\"info-value\"><a style=\"cursor: pointer\" ng-click=\"checkMsg()\"  ng-bind=\"LDetailMsgClick\"></a></p>\r\n    </div>\r\n</div>\r\n\r\n<h3 class=\"info-h3\" ng-bind-html=\"info.secondTitle | trusted\"></h3>\r\n<hr class=\"info-hr\"/>\r\n\r\n<div class=\"info-content\">\r\n    <div ng-show=\"showTipsType==1\" class=\"loading\"><img ng-src=\"assets/img/loading.gif\"/></div>\r\n    <div ng-show=\"showTipsType==2\" class=\"loading\"><span ng-bind=\"LResponseEmpty\"></span></div>\r\n    <div class=\"info-item\" ng-show=\"showTakeUserPhone\">\r\n        <p ng-bind=\"LTableTakerPhone\">取件人手机</p>\r\n        <p class=\"info-value\"><span class=\"takePhone\" ><span ng-bind=\"takeUserPhone\" ng-show=\"onNormal\"></span><span ng-show=\"onLoading\"><img class=\"info-loding\" ng-src=\"assets/img/loading.gif\"/></span><a  ng-show=\"onNormal\"  ng-click=\"modifyPhone()\" id=\"DetailModify\"></a></span><span  class=\"phoneModify\" ng-show=\"onEdit\"><input class=\"form-control\" ng-model=\"takeUserPhoneEditor\" /><a ng-click=\"confirmModify()\" ng-bind=\"LDetailSure\">确定</a></span></p>\r\n    </div>\r\n    <div class=\"info-item\" ng-repeat=\"item in info.contactContent track by $index\">\r\n        <p ng-bind=\"item.key\"></p>\r\n        <p class=\"info-value\" ng-bind=\"item.value\"></p>\r\n    </div>\r\n</div>\r\n\r\n<div class=\"info-button\">\r\n    <input type=\"button\" class=\"btn btn-lg btn-primary input-md\" ng-click=\"close()\" ng-value=\"LClose\" \\>\r\n</div>"

/***/ }
/******/ ]);