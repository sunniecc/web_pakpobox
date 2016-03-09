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
	var WebUploader = __webpack_require__(18);
	var Alert = __webpack_require__(2);
	var errorCode = __webpack_require__(13);
	var Api = __webpack_require__(3);
	var userType = __webpack_require__(9);
	var Lang = __webpack_require__(1);
	var Header = __webpack_require__(4);
	var Nav = __webpack_require__(10);
	var Table = __webpack_require__(11);
	var DropDown = __webpack_require__(12);
	var Api = __webpack_require__(3);

	(function (angular) {
	    'use strict';
	    angular.module('business', ['ngSanitize'])
	        .controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
	            $.extend($scope, Lang);

	            $templateCache.removeAll();
	            $templateCache.put('header', Header);
	            $templateCache.put('nav', Nav);
	            $templateCache.put('table', Table);
	            var imgList =[];
	            var ADList =[];
	            var selectFile = false;
	            Api.userInfo(function (json) {
	                if (json.statusCode != 0) {
	                    location.href = 'login.html';
	                } else {
	                    $scope.userrole = json.result.role, $scope.usertype = $scope[userType[json.result.role]];
	                    $scope.username = json.result.name;
	                    $scope.$apply();
	                }
	            })
	            $scope.logout = Api.logout;
	            // 初始化Web Uploader
	            var uploader = WebUploader.create({

	                // 选完文件后，是否自动上传。
	                auto: true,

	                // swf文件路径
	                swf:'assets/js/Uploader.swf',

	                // 文件接收服务端。
	                server: '/cgi-bin/index/upload/upload',

	                // 选择文件的按钮。可选。
	                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	                pick: '.filePicker',
	                 //指定上传图片的名字
	                fileVal:'file',

	                // 只允许选择图片文件。
	                accept: {
	                    title: 'Images',
	                    extensions: 'gif,jpg,jpeg,bmp,png',
	                    mimeTypes: 'image/*'
	                }

	            });

	            // 当有文件添加进来的时候
	            uploader.on( 'fileQueued', function( file ) {
	                selectFile = true;
	                var $li = $(
	                        '<div id="' + file.id + '" class="file-item thumbnail">' +
	                            '<img>' +
	                            '<div class="info">' + file.name + '</div>' +
	                        '</div>'
	                        ),
	                    $img = $li.find('img');

	                uploader.md5File( file );
	                console.log(uploader.md5File( file ));
	                // $list为容器jQuery实例
	                $('#fileList').append( $li );
	                // 创建缩略图
	                // 如果为非图片文件，可以不用调用此方法。
	                // thumbnailWidth x thumbnailHeight 为 100 x 100
	                uploader.makeThumb( file, function( error, src ) {
	                    if ( error ) {
	                        $img.replaceWith('<span>不能预览</span>');
	                        return;
	                    }

	                    $img.attr( 'src', src );
	                }, 150,150 );
	            });

	            // 文件上传过程中创建进度条实时显示。
	            uploader.on( 'uploadProgress', function( file, percentage ) {
	                var $li = $( '#'+file.id ),
	                    $percent = $li.find('.progress span');

	                // 避免重复创建
	                if ( !$percent.length ) {
	                    $percent = $('<p class="progress"><span></span></p>')
	                            .appendTo( $li )
	                            .find('span');
	                }
	                $percent.css( 'width', percentage * 100 + '%' );
	            });

	            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
	            uploader.on( 'uploadSuccess', function( file ,res) {
	                imgList.push(res.id);
	                Alert.show($scope.LUploadImgSuccess,'success');
	                $( '#'+file.id ).addClass('upload-state-done');
	                $( '#'+file.id ).val(res.id);
	                console.log(file.id);

	            });

	            // 文件上传失败，显示上传出错。
	            uploader.on( 'uploadError', function( file ) {
	                var $li = $( '#'+file.id ),
	                    $error = $li.find('div.error');

	                // 避免重复创建
	                if ( !$error.length ) {
	                    $error = $('<div class="error"></div>').appendTo( $li );
	                }

	                $error.text('上传失败');
	            });

	            // 完成上传完了，成功或者失败，先删除进度条。
	            uploader.on( 'uploadComplete', function( file ) {
	                console.log("删除进度条");
	                $( '#'+file.id ).find('.progress').remove();
	            });




	            $scope.imgList = [
	                {
	                    name: 'business_1.jpg',
	                    url: 'assets/img/business_1.jpg'
	                },
	            ]


	            $scope.submit = function () {
	                if(!selectFile){
	                    Alert.show($scope.LPleaseChooseFile);
	                    return;
	                }else if($scope.position==""||$scope.position==undefined){
	                    Alert.show($scope.LPleaseChooseADLocationInfo);
	                    return;
	                }else if($scope.companyValue==""||$scope.companyValue==undefined){
	                    Alert.show($scope.LPleaseChooseOprator);
	                    return;
	                }else{
	                    // uploader.upload()    
	                    for (var i = imgList.length - 1; i >= 0; i--) {
	                        console.log(imgList[i]);
	                    };
	                    var data = {
	                    "company":{
	                    "id": $scope.companyValue
	                    },
	                    "doc":{
	                    "id": imgList[0]
	                    },
	                    position:$scope.position
	                    }
	                    Api.uploadImgInfo(data,function(json){
	                        if(json.statusCode==0){
	                            ADList.push(json.result.id);
	                            Alert.show($scope.LUploadADInfoSuccess,'success');
	                        }else{
	                            Alert.show(json.msg.errorMessage);
	                        }
	                         // setTimeout(function() {
	                         // window.location.reload();
	                         // }, 2000);

	                    });
	                }
	                
	            }

	            var dropDown = new DropDown({
	            selector: '#company',
	            getData: function(value, callback){
	                var param = {
	                    page:1,
	                    maxCount:5,
	                    companyFuzzyName: value,
	                    startLevel: $scope.usercompanylevel,
	                    companyType: 'OPERATOR'
	                }                    
	                Api.companyQuery(param, function (json) {
	                    var data = [];
	                    if(json.statusCode == 0){
	                        json.result.resultList.map(function (e) {
	                            data.push({
	                                name: e.name + '(' + (e.contactName || ' ') + ')',
	                                value: e.id,
	                                showValue: e.name
	                            })
	                        })
	                    }
	                    callback(data);
	                })
	            },
	            success: function(value){
	                $scope.companyValue = value;
	                $scope.$apply();
	            }
	        })
	        }])
	        .filter('trusted', ['$sce', function ($sce) {
	            return function (text) {
	                return $sce.trustAsHtml(text);
	            }
	        }]).directive('placeholder', ['$compile', function ($compile) {
	            return {
	                restrict: 'A',
	                scope: {},
	                link: function (scope, ele, attr) {
	                    var input = document.createElement('input');
	                    var isSupportPlaceholder = 'placeholder' in input;
	                    if (!isSupportPlaceholder) {
	                        var fakePlaceholder = angular.element(
	                            '<span class="placeholder">' + attr['placeholder'] + '</span>');
	                        fakePlaceholder.on('click', function (e) {
	                            e.stopPropagation();
	                            ele.focus();
	                        });
	                        ele.before(fakePlaceholder);
	                        $compile(fakePlaceholder)(scope);
	                        ele.on('focus', function () {
	                            fakePlaceholder.hide();
	                        }).on('blur', function () {
	                            if (ele.val() === '') {
	                                fakePlaceholder.show();
	                            }
	                        });
	                    }
	                }
	            };
	        }]);
	    ;
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
/* 11 */
/***/ function(module, exports) {

	module.exports = "<div id=\"alert\"></div>\r\n<table ng-show=\"tableData && tableData.tbody.length > 0\" class=\"table table-striped table-hover\">\r\n    <thead>\r\n        <tr>\r\n            <th ng-repeat=\"item in tableData.thead track by $index\" ng-bind=\"item\"></th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr ng-repeat=\"tr in tableData.tbody track by $index\">\r\n            <td ng-repeat=\"item in tr track by $index\" ng-bind-html=\"item | trusted\"></td>\r\n        </tr>\r\n    </tbody>\r\n</table>\r\n<div ng-show=\"showTipsType==1\" class=\"loading\"><img ng-src=\"assets/img/loading.gif\"/></div>\r\n<div ng-show=\"showTipsType==2\" class=\"loading\"><span ng-bind=\"LResponseEmpty\"></span></div>\r\n<paging ng-show=\"tableData && tableData.tbody.length > 0 && !pageHide\">\r\n    <div class=\"page\">\r\n        <div class=\"goto-page\">\r\n            <input type=\"text\" class=\"goto-input\" ng-model=\"pageNum.gotoPage\">\r\n            <a class=\"goto-text\" ng-click=\"gotoPage()\" ng-bind=\"LGoto\"></a>\r\n        </div>\r\n\r\n        <ul class=\"pagination\">\r\n            <li ng-class=\"{disabled: noPrevious()}\">\r\n                <a href=\"#\" aria-label=\"Previous\" ng-click=\"selectStart()\">\r\n                    <i class=\"glyphicon glyphicon-backward\" aria-hidden=\"true\" />\r\n                </a>\r\n            </li>\r\n            <li ng-class=\"{disabled: noPrevious()}\">\r\n                <a href=\"#\" aria-label=\"Previous\" ng-click=\"selectPrevious()\">\r\n                    <i class=\"glyphicon glyphicon-triangle-left\" aria-hidden=\"true\" />\r\n                </a>\r\n            </li>\r\n            <li ng-repeat=\"page in pageNum.pages\" ng-class=\"{active: isActive(page)}\"><a ng-click=\"selectPage(page)\">{{page}}</a></li>\r\n            <li ng-class=\"{disabled: noNext()}\">\r\n                <a href=\"#\" aria-label=\"Next\" ng-click=\"selectNext()\">\r\n                    <i class=\"glyphicon glyphicon-triangle-right\" aria-hidden=\"true\" />\r\n                </a>\r\n            </li>\r\n            <li ng-class=\"{disabled: noNext()}\">\r\n                <a href=\"#\" aria-label=\"Next\" ng-click=\"selectEnd()\">\r\n                    <i class=\"glyphicon glyphicon-forward\" aria-hidden=\"true\" />\r\n                </a>\r\n            </li>\r\n        </ul>\r\n        <div class=\"page-num\">\r\n            <span ng-bind=\"LPageNum\"></span>\r\n            <span ng-bind=\"pageNum.pagesSize\"></span>&nbsp&nbsp&nbsp&nbsp&nbsp\r\n            <span ng-bind=\"LRecordNum\"></span>\r\n            <span ng-bind=\"recordNum\"></span>\r\n        </div>\r\n    </div>\r\n</paging>\r\n\r\n"

/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * @fileOverview drop-down下拉列表组件
	 * @version 1.0.0
	 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
	 * @date 2015/08/15
	 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
	 * @see [link]
	 *
	 */

	var DropDown = function (option) {
	    this.init(option);
	};

	DropDown.prototype.init = function (option) {
	    this.option = option;
	    var $dom = $(option.selector);
	    this.$dom = $dom;

	    this.getStyle();

	    var html = $('<ul style="' + this.ulStyle + '" class="dropdown-menu"></ul>');
	    this.$menu = html;
	    $dom.after(html);
	    this.bind();
	}

	DropDown.prototype.getStyle = function () {
	    var width = this.$dom.css('width');
	    var height = this.$dom.css('height');
	    var fontSize = this.$dom.css('font-size');
	    var lineHeight = this.$dom.css('line-height');
	    var padding = this.$dom.css('padding').toString();
	    console.log(padding)
	    this.liStyle = 'width:'+width+';height:'+height+';font-size:'+fontSize+';line-height:'+lineHeight+';padding:'+padding+';';
	    console.log(this.liStyle);

	    var marginTop = '-' + this.$dom.css('margin-bottom');
	    var marginLeft = this.$dom.css('margin-left');
	    var marginRight = this.$dom.css('margin-right');
	    var marginBottom = 0;
	    this.ulStyle = 'position:absolute;top: inherit;left: inherit;margin:'+marginTop+' '+marginRight+' '+marginBottom+' '+marginLeft+';';
	    console.log(this.ulStyle)

	}

	DropDown.prototype.bind = function () {
	    var self = this;
	    self.$dom.focus(function (e) {
	        e.stopPropagation();
	        self.updateMenu();
	        self.$menu.show();
	    }).on('keyup', function (e) {
	        var li = self.$menu.find('li.selected');
	        console.log(e.keyCode )
	        if(e.keyCode == 38){
	            li.prev()[0] && li .removeClass().prev().addClass('selected');
	        }else if(e.keyCode == 40){
	            li.next()[0] && li .removeClass().next().addClass('selected');
	        }else if(e.keyCode == 13){
	            self.selectItem(li);
	        }else{

	            self.$menu.show();
	            self.updateMenu();
	        }
	    })

	    $('body').on('click', function (e) {
	        //下面注释的是终止事件在传播过程的捕获、目标处理或起泡阶段进一步传播
	        // e.stopPropagation();
	        if(e.target.tagName != 'LI' && e.target.tagName != 'I' && e.target.id != self.$dom[0].id && $(e.target).data('toggle') != 'dropdown'){
	            self.$menu.hide();
	        }
	        
	    })

	    self.$menu.on('click', 'li', function (e) {
	        e.stopPropagation();
	        console.log(this);
	        self.selectItem($(this));
	    })
	}

	DropDown.prototype.updateMenu = function () {
	    var self = this;
	    var value = self.$dom.val()

	    this.option.getData(value, function (data) {
	        var html = '';
	        data && data.length && data.map(function (e) {
	            html += '<li style="' + self.liStyle + '" data-value="' + e.value + '" data-showvalue="' + e.showValue + '">' + e.name + '</li>'
	        })
	        self.$menu.html(html);
	        self.$menu.find('li:first').addClass('selected');
	    })

	}

	DropDown.prototype.selectItem = function ($item) {
	    var showValue = $item.data('showvalue')
	    var value = $item.data('value')
	    console.log(value)
	    this.$dom.val(showValue);
	    this.$menu.hide();
	    this.option.success(value)
	    return value;
	}


	module.exports = DropDown;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Lang = __webpack_require__(1);

	 var errorCode = {

			 '0': Lang.LSuccess,
		    '-1': Lang.LParameterError,
			'-2': Lang.LNoJurisdiction,
			'-3': Lang.LUnknownError,
			'-4': Lang.LSystemError,
		    '-5': Lang.LLoginTimeout,
			'-6': Lang.LNotFindRepository,
	}
	module.exports = errorCode;



/***/ },
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/*! WebUploader 0.1.5 */


	/**
	 * @fileOverview 让内部各个部件的代码可以用[amd](https://github.com/amdjs/amdjs-api/wiki/AMD)模块定义方式组织起来。
	 *
	 * AMD API 内部的简单不完全实现，请忽略。只有当WebUploader被合并成一个文件的时候才会引入。
	 */
	(function( root, factory ) {
	    var modules = {},

	        // 内部require, 简单不完全实现。
	        // https://github.com/amdjs/amdjs-api/wiki/require
	        _require = function( deps, callback ) {
	            var args, len, i;

	            // 如果deps不是数组，则直接返回指定module
	            if ( typeof deps === 'string' ) {
	                return getModule( deps );
	            } else {
	                args = [];
	                for( len = deps.length, i = 0; i < len; i++ ) {
	                    args.push( getModule( deps[ i ] ) );
	                }

	                return callback.apply( null, args );
	            }
	        },

	        // 内部define，暂时不支持不指定id.
	        _define = function( id, deps, factory ) {
	            if ( arguments.length === 2 ) {
	                factory = deps;
	                deps = null;
	            }

	            _require( deps || [], function() {
	                setModule( id, factory, arguments );
	            });
	        },

	        // 设置module, 兼容CommonJs写法。
	        setModule = function( id, factory, args ) {
	            var module = {
	                    exports: factory
	                },
	                returned;

	            if ( typeof factory === 'function' ) {
	                args.length || (args = [ _require, module.exports, module ]);
	                returned = factory.apply( null, args );
	                returned !== undefined && (module.exports = returned);
	            }

	            modules[ id ] = module.exports;
	        },

	        // 根据id获取module
	        getModule = function( id ) {
	            var module = modules[ id ] || root[ id ];

	            if ( !module ) {
	                throw new Error( '`' + id + '` is undefined' );
	            }

	            return module;
	        },

	        // 将所有modules，将路径ids装换成对象。
	        exportsTo = function( obj ) {
	            var key, host, parts, part, last, ucFirst;

	            // make the first character upper case.
	            ucFirst = function( str ) {
	                return str && (str.charAt( 0 ).toUpperCase() + str.substr( 1 ));
	            };

	            for ( key in modules ) {
	                host = obj;

	                if ( !modules.hasOwnProperty( key ) ) {
	                    continue;
	                }

	                parts = key.split('/');
	                last = ucFirst( parts.pop() );

	                while( (part = ucFirst( parts.shift() )) ) {
	                    host[ part ] = host[ part ] || {};
	                    host = host[ part ];
	                }

	                host[ last ] = modules[ key ];
	            }

	            return obj;
	        },

	        makeExport = function( dollar ) {
	            root.__dollar = dollar;

	            // exports every module.
	            return exportsTo( factory( root, _define, _require ) );
	        },

	        origin;

	    if ( typeof module === 'object' && typeof module.exports === 'object' ) {

	        // For CommonJS and CommonJS-like environments where a proper window is present,
	        module.exports = makeExport();
	    } else if ( true ) {

	        // Allow using this built library as an AMD module
	        // in another project. That other project will only
	        // see this AMD call, not the internal modules in
	        // the closure below.
	        //define([ 'jquery' ], makeExport );
	    } else {

	        // Browser globals case. Just assign the
	        // result to a property on the global.
	        origin = root.WebUploader;
	        root.WebUploader = makeExport();
	        root.WebUploader.noConflict = function() {
	            root.WebUploader = origin;
	        };
	    }
	})( window, function( window, define, require ) {


	    /**
	     * @fileOverview jQuery or Zepto
	     */
	    define('dollar-third',[],function() {
	        var $ = window.__dollar || window.jQuery || window.Zepto;
	    
	        if ( !$ ) {
	            throw new Error('jQuery or Zepto not found!');
	        }
	    
	        return $;
	    });
	    /**
	     * @fileOverview Dom 操作相关
	     */
	    define('dollar',[
	        'dollar-third'
	    ], function( _ ) {
	        return _;
	    });
	    /**
	     * @fileOverview 使用jQuery的Promise
	     */
	    define('promise-third',[
	        'dollar'
	    ], function( $ ) {
	        return {
	            Deferred: $.Deferred,
	            when: $.when,
	    
	            isPromise: function( anything ) {
	                return anything && typeof anything.then === 'function';
	            }
	        };
	    });
	    /**
	     * @fileOverview Promise/A+
	     */
	    define('promise',[
	        'promise-third'
	    ], function( _ ) {
	        return _;
	    });
	    /**
	     * @fileOverview 基础类方法。
	     */
	    
	    /**
	     * Web Uploader内部类的详细说明，以下提及的功能类，都可以在`WebUploader`这个变量中访问到。
	     *
	     * As you know, Web Uploader的每个文件都是用过[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD)规范中的`define`组织起来的, 每个Module都会有个module id.
	     * 默认module id为该文件的路径，而此路径将会转化成名字空间存放在WebUploader中。如：
	     *
	     * * module `base`：WebUploader.Base
	     * * module `file`: WebUploader.File
	     * * module `lib/dnd`: WebUploader.Lib.Dnd
	     * * module `runtime/html5/dnd`: WebUploader.Runtime.Html5.Dnd
	     *
	     *
	     * 以下文档中对类的使用可能省略掉了`WebUploader`前缀。
	     * @module WebUploader
	     * @title WebUploader API文档
	     */
	    define('base',[
	        'dollar',
	        'promise'
	    ], function( $, promise ) {
	    
	        var noop = function() {},
	            call = Function.call;
	    
	        // http://jsperf.com/uncurrythis
	        // 反科里化
	        function uncurryThis( fn ) {
	            return function() {
	                return call.apply( fn, arguments );
	            };
	        }
	    
	        function bindFn( fn, context ) {
	            return function() {
	                return fn.apply( context, arguments );
	            };
	        }
	    
	        function createObject( proto ) {
	            var f;
	    
	            if ( Object.create ) {
	                return Object.create( proto );
	            } else {
	                f = function() {};
	                f.prototype = proto;
	                return new f();
	            }
	        }
	    
	    
	        /**
	         * 基础类，提供一些简单常用的方法。
	         * @class Base
	         */
	        return {
	    
	            /**
	             * @property {String} version 当前版本号。
	             */
	            version: '0.1.5',
	    
	            /**
	             * @property {jQuery|Zepto} $ 引用依赖的jQuery或者Zepto对象。
	             */
	            $: $,
	    
	            Deferred: promise.Deferred,
	    
	            isPromise: promise.isPromise,
	    
	            when: promise.when,
	    
	            /**
	             * @description  简单的浏览器检查结果。
	             *
	             * * `webkit`  webkit版本号，如果浏览器为非webkit内核，此属性为`undefined`。
	             * * `chrome`  chrome浏览器版本号，如果浏览器为chrome，此属性为`undefined`。
	             * * `ie`  ie浏览器版本号，如果浏览器为非ie，此属性为`undefined`。**暂不支持ie10+**
	             * * `firefox`  firefox浏览器版本号，如果浏览器为非firefox，此属性为`undefined`。
	             * * `safari`  safari浏览器版本号，如果浏览器为非safari，此属性为`undefined`。
	             * * `opera`  opera浏览器版本号，如果浏览器为非opera，此属性为`undefined`。
	             *
	             * @property {Object} [browser]
	             */
	            browser: (function( ua ) {
	                var ret = {},
	                    webkit = ua.match( /WebKit\/([\d.]+)/ ),
	                    chrome = ua.match( /Chrome\/([\d.]+)/ ) ||
	                        ua.match( /CriOS\/([\d.]+)/ ),
	    
	                    ie = ua.match( /MSIE\s([\d\.]+)/ ) ||
	                        ua.match( /(?:trident)(?:.*rv:([\w.]+))?/i ),
	                    firefox = ua.match( /Firefox\/([\d.]+)/ ),
	                    safari = ua.match( /Safari\/([\d.]+)/ ),
	                    opera = ua.match( /OPR\/([\d.]+)/ );
	    
	                webkit && (ret.webkit = parseFloat( webkit[ 1 ] ));
	                chrome && (ret.chrome = parseFloat( chrome[ 1 ] ));
	                ie && (ret.ie = parseFloat( ie[ 1 ] ));
	                firefox && (ret.firefox = parseFloat( firefox[ 1 ] ));
	                safari && (ret.safari = parseFloat( safari[ 1 ] ));
	                opera && (ret.opera = parseFloat( opera[ 1 ] ));
	    
	                return ret;
	            })( navigator.userAgent ),
	    
	            /**
	             * @description  操作系统检查结果。
	             *
	             * * `android`  如果在android浏览器环境下，此值为对应的android版本号，否则为`undefined`。
	             * * `ios` 如果在ios浏览器环境下，此值为对应的ios版本号，否则为`undefined`。
	             * @property {Object} [os]
	             */
	            os: (function( ua ) {
	                var ret = {},
	    
	                    // osx = !!ua.match( /\(Macintosh\; Intel / ),
	                    android = ua.match( /(?:Android);?[\s\/]+([\d.]+)?/ ),
	                    ios = ua.match( /(?:iPad|iPod|iPhone).*OS\s([\d_]+)/ );
	    
	                // osx && (ret.osx = true);
	                android && (ret.android = parseFloat( android[ 1 ] ));
	                ios && (ret.ios = parseFloat( ios[ 1 ].replace( /_/g, '.' ) ));
	    
	                return ret;
	            })( navigator.userAgent ),
	    
	            /**
	             * 实现类与类之间的继承。
	             * @method inherits
	             * @grammar Base.inherits( super ) => child
	             * @grammar Base.inherits( super, protos ) => child
	             * @grammar Base.inherits( super, protos, statics ) => child
	             * @param  {Class} super 父类
	             * @param  {Object | Function} [protos] 子类或者对象。如果对象中包含constructor，子类将是用此属性值。
	             * @param  {Function} [protos.constructor] 子类构造器，不指定的话将创建个临时的直接执行父类构造器的方法。
	             * @param  {Object} [statics] 静态属性或方法。
	             * @return {Class} 返回子类。
	             * @example
	             * function Person() {
	             *     console.log( 'Super' );
	             * }
	             * Person.prototype.hello = function() {
	             *     console.log( 'hello' );
	             * };
	             *
	             * var Manager = Base.inherits( Person, {
	             *     world: function() {
	             *         console.log( 'World' );
	             *     }
	             * });
	             *
	             * // 因为没有指定构造器，父类的构造器将会执行。
	             * var instance = new Manager();    // => Super
	             *
	             * // 继承子父类的方法
	             * instance.hello();    // => hello
	             * instance.world();    // => World
	             *
	             * // 子类的__super__属性指向父类
	             * console.log( Manager.__super__ === Person );    // => true
	             */
	            inherits: function( Super, protos, staticProtos ) {
	                var child;
	    
	                if ( typeof protos === 'function' ) {
	                    child = protos;
	                    protos = null;
	                } else if ( protos && protos.hasOwnProperty('constructor') ) {
	                    child = protos.constructor;
	                } else {
	                    child = function() {
	                        return Super.apply( this, arguments );
	                    };
	                }
	    
	                // 复制静态方法
	                $.extend( true, child, Super, staticProtos || {} );
	    
	                /* jshint camelcase: false */
	    
	                // 让子类的__super__属性指向父类。
	                child.__super__ = Super.prototype;
	    
	                // 构建原型，添加原型方法或属性。
	                // 暂时用Object.create实现。
	                child.prototype = createObject( Super.prototype );
	                protos && $.extend( true, child.prototype, protos );
	    
	                return child;
	            },
	    
	            /**
	             * 一个不做任何事情的方法。可以用来赋值给默认的callback.
	             * @method noop
	             */
	            noop: noop,
	    
	            /**
	             * 返回一个新的方法，此方法将已指定的`context`来执行。
	             * @grammar Base.bindFn( fn, context ) => Function
	             * @method bindFn
	             * @example
	             * var doSomething = function() {
	             *         console.log( this.name );
	             *     },
	             *     obj = {
	             *         name: 'Object Name'
	             *     },
	             *     aliasFn = Base.bind( doSomething, obj );
	             *
	             *  aliasFn();    // => Object Name
	             *
	             */
	            bindFn: bindFn,
	    
	            /**
	             * 引用Console.log如果存在的话，否则引用一个[空函数noop](#WebUploader:Base.noop)。
	             * @grammar Base.log( args... ) => undefined
	             * @method log
	             */
	            log: (function() {
	                if ( window.console ) {
	                    return bindFn( console.log, console );
	                }
	                return noop;
	            })(),
	    
	            nextTick: (function() {
	    
	                return function( cb ) {
	                    setTimeout( cb, 1 );
	                };
	    
	                // @bug 当浏览器不在当前窗口时就停了。
	                // var next = window.requestAnimationFrame ||
	                //     window.webkitRequestAnimationFrame ||
	                //     window.mozRequestAnimationFrame ||
	                //     function( cb ) {
	                //         window.setTimeout( cb, 1000 / 60 );
	                //     };
	    
	                // // fix: Uncaught TypeError: Illegal invocation
	                // return bindFn( next, window );
	            })(),
	    
	            /**
	             * 被[uncurrythis](http://www.2ality.com/2011/11/uncurrying-this.html)的数组slice方法。
	             * 将用来将非数组对象转化成数组对象。
	             * @grammar Base.slice( target, start[, end] ) => Array
	             * @method slice
	             * @example
	             * function doSomthing() {
	             *     var args = Base.slice( arguments, 1 );
	             *     console.log( args );
	             * }
	             *
	             * doSomthing( 'ignored', 'arg2', 'arg3' );    // => Array ["arg2", "arg3"]
	             */
	            slice: uncurryThis( [].slice ),
	    
	            /**
	             * 生成唯一的ID
	             * @method guid
	             * @grammar Base.guid() => String
	             * @grammar Base.guid( prefx ) => String
	             */
	            guid: (function() {
	                var counter = 0;
	    
	                return function( prefix ) {
	                    var guid = (+new Date()).toString( 32 ),
	                        i = 0;
	    
	                    for ( ; i < 5; i++ ) {
	                        guid += Math.floor( Math.random() * 65535 ).toString( 32 );
	                    }
	    
	                    return (prefix || 'wu_') + guid + (counter++).toString( 32 );
	                };
	            })(),
	    
	            /**
	             * 格式化文件大小, 输出成带单位的字符串
	             * @method formatSize
	             * @grammar Base.formatSize( size ) => String
	             * @grammar Base.formatSize( size, pointLength ) => String
	             * @grammar Base.formatSize( size, pointLength, units ) => String
	             * @param {Number} size 文件大小
	             * @param {Number} [pointLength=2] 精确到的小数点数。
	             * @param {Array} [units=[ 'B', 'K', 'M', 'G', 'TB' ]] 单位数组。从字节，到千字节，一直往上指定。如果单位数组里面只指定了到了K(千字节)，同时文件大小大于M, 此方法的输出将还是显示成多少K.
	             * @example
	             * console.log( Base.formatSize( 100 ) );    // => 100B
	             * console.log( Base.formatSize( 1024 ) );    // => 1.00K
	             * console.log( Base.formatSize( 1024, 0 ) );    // => 1K
	             * console.log( Base.formatSize( 1024 * 1024 ) );    // => 1.00M
	             * console.log( Base.formatSize( 1024 * 1024 * 1024 ) );    // => 1.00G
	             * console.log( Base.formatSize( 1024 * 1024 * 1024, 0, ['B', 'KB', 'MB'] ) );    // => 1024MB
	             */
	            formatSize: function( size, pointLength, units ) {
	                var unit;
	    
	                units = units || [ 'B', 'K', 'M', 'G', 'TB' ];
	    
	                while ( (unit = units.shift()) && size > 1024 ) {
	                    size = size / 1024;
	                }
	    
	                return (unit === 'B' ? size : size.toFixed( pointLength || 2 )) +
	                        unit;
	            }
	        };
	    });
	    /**
	     * 事件处理类，可以独立使用，也可以扩展给对象使用。
	     * @fileOverview Mediator
	     */
	    define('mediator',[
	        'base'
	    ], function( Base ) {
	        var $ = Base.$,
	            slice = [].slice,
	            separator = /\s+/,
	            protos;
	    
	        // 根据条件过滤出事件handlers.
	        function findHandlers( arr, name, callback, context ) {
	            return $.grep( arr, function( handler ) {
	                return handler &&
	                        (!name || handler.e === name) &&
	                        (!callback || handler.cb === callback ||
	                        handler.cb._cb === callback) &&
	                        (!context || handler.ctx === context);
	            });
	        }
	    
	        function eachEvent( events, callback, iterator ) {
	            // 不支持对象，只支持多个event用空格隔开
	            $.each( (events || '').split( separator ), function( _, key ) {
	                iterator( key, callback );
	            });
	        }
	    
	        function triggerHanders( events, args ) {
	            var stoped = false,
	                i = -1,
	                len = events.length,
	                handler;
	    
	            while ( ++i < len ) {
	                handler = events[ i ];
	    
	                if ( handler.cb.apply( handler.ctx2, args ) === false ) {
	                    stoped = true;
	                    break;
	                }
	            }
	    
	            return !stoped;
	        }
	    
	        protos = {
	    
	            /**
	             * 绑定事件。
	             *
	             * `callback`方法在执行时，arguments将会来源于trigger的时候携带的参数。如
	             * ```javascript
	             * var obj = {};
	             *
	             * // 使得obj有事件行为
	             * Mediator.installTo( obj );
	             *
	             * obj.on( 'testa', function( arg1, arg2 ) {
	             *     console.log( arg1, arg2 ); // => 'arg1', 'arg2'
	             * });
	             *
	             * obj.trigger( 'testa', 'arg1', 'arg2' );
	             * ```
	             *
	             * 如果`callback`中，某一个方法`return false`了，则后续的其他`callback`都不会被执行到。
	             * 切会影响到`trigger`方法的返回值，为`false`。
	             *
	             * `on`还可以用来添加一个特殊事件`all`, 这样所有的事件触发都会响应到。同时此类`callback`中的arguments有一个不同处，
	             * 就是第一个参数为`type`，记录当前是什么事件在触发。此类`callback`的优先级比脚低，会再正常`callback`执行完后触发。
	             * ```javascript
	             * obj.on( 'all', function( type, arg1, arg2 ) {
	             *     console.log( type, arg1, arg2 ); // => 'testa', 'arg1', 'arg2'
	             * });
	             * ```
	             *
	             * @method on
	             * @grammar on( name, callback[, context] ) => self
	             * @param  {String}   name     事件名，支持多个事件用空格隔开
	             * @param  {Function} callback 事件处理器
	             * @param  {Object}   [context]  事件处理器的上下文。
	             * @return {self} 返回自身，方便链式
	             * @chainable
	             * @class Mediator
	             */
	            on: function( name, callback, context ) {
	                var me = this,
	                    set;
	    
	                if ( !callback ) {
	                    return this;
	                }
	    
	                set = this._events || (this._events = []);
	    
	                eachEvent( name, callback, function( name, callback ) {
	                    var handler = { e: name };
	    
	                    handler.cb = callback;
	                    handler.ctx = context;
	                    handler.ctx2 = context || me;
	                    handler.id = set.length;
	    
	                    set.push( handler );
	                });
	    
	                return this;
	            },
	    
	            /**
	             * 绑定事件，且当handler执行完后，自动解除绑定。
	             * @method once
	             * @grammar once( name, callback[, context] ) => self
	             * @param  {String}   name     事件名
	             * @param  {Function} callback 事件处理器
	             * @param  {Object}   [context]  事件处理器的上下文。
	             * @return {self} 返回自身，方便链式
	             * @chainable
	             */
	            once: function( name, callback, context ) {
	                var me = this;
	    
	                if ( !callback ) {
	                    return me;
	                }
	    
	                eachEvent( name, callback, function( name, callback ) {
	                    var once = function() {
	                            me.off( name, once );
	                            return callback.apply( context || me, arguments );
	                        };
	    
	                    once._cb = callback;
	                    me.on( name, once, context );
	                });
	    
	                return me;
	            },
	    
	            /**
	             * 解除事件绑定
	             * @method off
	             * @grammar off( [name[, callback[, context] ] ] ) => self
	             * @param  {String}   [name]     事件名
	             * @param  {Function} [callback] 事件处理器
	             * @param  {Object}   [context]  事件处理器的上下文。
	             * @return {self} 返回自身，方便链式
	             * @chainable
	             */
	            off: function( name, cb, ctx ) {
	                var events = this._events;
	    
	                if ( !events ) {
	                    return this;
	                }
	    
	                if ( !name && !cb && !ctx ) {
	                    this._events = [];
	                    return this;
	                }
	    
	                eachEvent( name, cb, function( name, cb ) {
	                    $.each( findHandlers( events, name, cb, ctx ), function() {
	                        delete events[ this.id ];
	                    });
	                });
	    
	                return this;
	            },
	    
	            /**
	             * 触发事件
	             * @method trigger
	             * @grammar trigger( name[, args...] ) => self
	             * @param  {String}   type     事件名
	             * @param  {*} [...] 任意参数
	             * @return {Boolean} 如果handler中return false了，则返回false, 否则返回true
	             */
	            trigger: function( type ) {
	                var args, events, allEvents;
	    
	                if ( !this._events || !type ) {
	                    return this;
	                }
	    
	                args = slice.call( arguments, 1 );
	                events = findHandlers( this._events, type );
	                allEvents = findHandlers( this._events, 'all' );
	    
	                return triggerHanders( events, args ) &&
	                        triggerHanders( allEvents, arguments );
	            }
	        };
	    
	        /**
	         * 中介者，它本身是个单例，但可以通过[installTo](#WebUploader:Mediator:installTo)方法，使任何对象具备事件行为。
	         * 主要目的是负责模块与模块之间的合作，降低耦合度。
	         *
	         * @class Mediator
	         */
	        return $.extend({
	    
	            /**
	             * 可以通过这个接口，使任何对象具备事件功能。
	             * @method installTo
	             * @param  {Object} obj 需要具备事件行为的对象。
	             * @return {Object} 返回obj.
	             */
	            installTo: function( obj ) {
	                return $.extend( obj, protos );
	            }
	    
	        }, protos );
	    });
	    /**
	     * @fileOverview Uploader上传类
	     */
	    define('uploader',[
	        'base',
	        'mediator'
	    ], function( Base, Mediator ) {
	    
	        var $ = Base.$;
	    
	        /**
	         * 上传入口类。
	         * @class Uploader
	         * @constructor
	         * @grammar new Uploader( opts ) => Uploader
	         * @example
	         * var uploader = WebUploader.Uploader({
	         *     swf: 'path_of_swf/Uploader.swf',
	         *
	         *     // 开起分片上传。
	         *     chunked: true
	         * });
	         */
	        function Uploader( opts ) {
	            this.options = $.extend( true, {}, Uploader.options, opts );
	            this._init( this.options );
	        }
	    
	        // default Options
	        // widgets中有相应扩展
	        Uploader.options = {};
	        Mediator.installTo( Uploader.prototype );
	    
	        // 批量添加纯命令式方法。
	        $.each({
	            upload: 'start-upload',
	            stop: 'stop-upload',
	            getFile: 'get-file',
	            getFiles: 'get-files',
	            addFile: 'add-file',
	            addFiles: 'add-file',
	            sort: 'sort-files',
	            removeFile: 'remove-file',
	            cancelFile: 'cancel-file',
	            skipFile: 'skip-file',
	            retry: 'retry',
	            isInProgress: 'is-in-progress',
	            makeThumb: 'make-thumb',
	            md5File: 'md5-file',
	            getDimension: 'get-dimension',
	            addButton: 'add-btn',
	            predictRuntimeType: 'predict-runtime-type',
	            refresh: 'refresh',
	            disable: 'disable',
	            enable: 'enable',
	            reset: 'reset'
	        }, function( fn, command ) {
	            Uploader.prototype[ fn ] = function() {
	                return this.request( command, arguments );
	            };
	        });
	    
	        $.extend( Uploader.prototype, {
	            state: 'pending',
	    
	            _init: function( opts ) {
	                var me = this;
	    
	                me.request( 'init', opts, function() {
	                    me.state = 'ready';
	                    me.trigger('ready');
	                });
	            },
	    
	            /**
	             * 获取或者设置Uploader配置项。
	             * @method option
	             * @grammar option( key ) => *
	             * @grammar option( key, val ) => self
	             * @example
	             *
	             * // 初始状态图片上传前不会压缩
	             * var uploader = new WebUploader.Uploader({
	             *     compress: null;
	             * });
	             *
	             * // 修改后图片上传前，尝试将图片压缩到1600 * 1600
	             * uploader.option( 'compress', {
	             *     width: 1600,
	             *     height: 1600
	             * });
	             */
	            option: function( key, val ) {
	                var opts = this.options;
	    
	                // setter
	                if ( arguments.length > 1 ) {
	    
	                    if ( $.isPlainObject( val ) &&
	                            $.isPlainObject( opts[ key ] ) ) {
	                        $.extend( opts[ key ], val );
	                    } else {
	                        opts[ key ] = val;
	                    }
	    
	                } else {    // getter
	                    return key ? opts[ key ] : opts;
	                }
	            },
	    
	            /**
	             * 获取文件统计信息。返回一个包含一下信息的对象。
	             * * `successNum` 上传成功的文件数
	             * * `progressNum` 上传中的文件数
	             * * `cancelNum` 被删除的文件数
	             * * `invalidNum` 无效的文件数
	             * * `uploadFailNum` 上传失败的文件数
	             * * `queueNum` 还在队列中的文件数
	             * * `interruptNum` 被暂停的文件数
	             * @method getStats
	             * @grammar getStats() => Object
	             */
	            getStats: function() {
	                // return this._mgr.getStats.apply( this._mgr, arguments );
	                var stats = this.request('get-stats');
	    
	                return stats ? {
	                    successNum: stats.numOfSuccess,
	                    progressNum: stats.numOfProgress,
	    
	                    // who care?
	                    // queueFailNum: 0,
	                    cancelNum: stats.numOfCancel,
	                    invalidNum: stats.numOfInvalid,
	                    uploadFailNum: stats.numOfUploadFailed,
	                    queueNum: stats.numOfQueue,
	                    interruptNum: stats.numofInterrupt
	                } : {};
	            },
	    
	            // 需要重写此方法来来支持opts.onEvent和instance.onEvent的处理器
	            trigger: function( type/*, args...*/ ) {
	                var args = [].slice.call( arguments, 1 ),
	                    opts = this.options,
	                    name = 'on' + type.substring( 0, 1 ).toUpperCase() +
	                        type.substring( 1 );
	    
	                if (
	                        // 调用通过on方法注册的handler.
	                        Mediator.trigger.apply( this, arguments ) === false ||
	    
	                        // 调用opts.onEvent
	                        $.isFunction( opts[ name ] ) &&
	                        opts[ name ].apply( this, args ) === false ||
	    
	                        // 调用this.onEvent
	                        $.isFunction( this[ name ] ) &&
	                        this[ name ].apply( this, args ) === false ||
	    
	                        // 广播所有uploader的事件。
	                        Mediator.trigger.apply( Mediator,
	                        [ this, type ].concat( args ) ) === false ) {
	    
	                    return false;
	                }
	    
	                return true;
	            },
	    
	            /**
	             * 销毁 webuploader 实例
	             * @method destroy
	             * @grammar destroy() => undefined
	             */
	            destroy: function() {
	                this.request( 'destroy', arguments );
	                this.off();
	            },
	    
	            // widgets/widget.js将补充此方法的详细文档。
	            request: Base.noop
	        });
	    
	        /**
	         * 创建Uploader实例，等同于new Uploader( opts );
	         * @method create
	         * @class Base
	         * @static
	         * @grammar Base.create( opts ) => Uploader
	         */
	        Base.create = Uploader.create = function( opts ) {
	            return new Uploader( opts );
	        };
	    
	        // 暴露Uploader，可以通过它来扩展业务逻辑。
	        Base.Uploader = Uploader;
	    
	        return Uploader;
	    });
	    /**
	     * @fileOverview Runtime管理器，负责Runtime的选择, 连接
	     */
	    define('runtime/runtime',[
	        'base',
	        'mediator'
	    ], function( Base, Mediator ) {
	    
	        var $ = Base.$,
	            factories = {},
	    
	            // 获取对象的第一个key
	            getFirstKey = function( obj ) {
	                for ( var key in obj ) {
	                    if ( obj.hasOwnProperty( key ) ) {
	                        return key;
	                    }
	                }
	                return null;
	            };
	    
	        // 接口类。
	        function Runtime( options ) {
	            this.options = $.extend({
	                container: document.body
	            }, options );
	            this.uid = Base.guid('rt_');
	        }
	    
	        $.extend( Runtime.prototype, {
	    
	            getContainer: function() {
	                var opts = this.options,
	                    parent, container;
	    
	                if ( this._container ) {
	                    return this._container;
	                }
	    
	                parent = $( opts.container || document.body );
	                container = $( document.createElement('div') );
	    
	                container.attr( 'id', 'rt_' + this.uid );
	                container.css({
	                    position: 'absolute',
	                    top: '0px',
	                    left: '0px',
	                    width: '1px',
	                    height: '1px',
	                    overflow: 'hidden'
	                });
	    
	                parent.append( container );
	                parent.addClass('webuploader-container');
	                this._container = container;
	                this._parent = parent;
	                return container;
	            },
	    
	            init: Base.noop,
	            exec: Base.noop,
	    
	            destroy: function() {
	                this._container && this._container.remove();
	                this._parent && this._parent.removeClass('webuploader-container');
	                this.off();
	            }
	        });
	    
	        Runtime.orders = 'html5,flash';
	    
	    
	        /**
	         * 添加Runtime实现。
	         * @param {String} type    类型
	         * @param {Runtime} factory 具体Runtime实现。
	         */
	        Runtime.addRuntime = function( type, factory ) {
	            factories[ type ] = factory;
	        };
	    
	        Runtime.hasRuntime = function( type ) {
	            return !!(type ? factories[ type ] : getFirstKey( factories ));
	        };
	    
	        Runtime.create = function( opts, orders ) {
	            var type, runtime;
	    
	            orders = orders || Runtime.orders;
	            $.each( orders.split( /\s*,\s*/g ), function() {
	                if ( factories[ this ] ) {
	                    type = this;
	                    return false;
	                }
	            });
	    
	            type = type || getFirstKey( factories );
	    
	            if ( !type ) {
	                throw new Error('Runtime Error');
	            }
	    
	            runtime = new factories[ type ]( opts );
	            return runtime;
	        };
	    
	        Mediator.installTo( Runtime.prototype );
	        return Runtime;
	    });
	    
	    /**
	     * @fileOverview Runtime管理器，负责Runtime的选择, 连接
	     */
	    define('runtime/client',[
	        'base',
	        'mediator',
	        'runtime/runtime'
	    ], function( Base, Mediator, Runtime ) {
	    
	        var cache;
	    
	        cache = (function() {
	            var obj = {};
	    
	            return {
	                add: function( runtime ) {
	                    obj[ runtime.uid ] = runtime;
	                },
	    
	                get: function( ruid, standalone ) {
	                    var i;
	    
	                    if ( ruid ) {
	                        return obj[ ruid ];
	                    }
	    
	                    for ( i in obj ) {
	                        // 有些类型不能重用，比如filepicker.
	                        if ( standalone && obj[ i ].__standalone ) {
	                            continue;
	                        }
	    
	                        return obj[ i ];
	                    }
	    
	                    return null;
	                },
	    
	                remove: function( runtime ) {
	                    delete obj[ runtime.uid ];
	                }
	            };
	        })();
	    
	        function RuntimeClient( component, standalone ) {
	            var deferred = Base.Deferred(),
	                runtime;
	    
	            this.uid = Base.guid('client_');
	    
	            // 允许runtime没有初始化之前，注册一些方法在初始化后执行。
	            this.runtimeReady = function( cb ) {
	                return deferred.done( cb );
	            };
	    
	            this.connectRuntime = function( opts, cb ) {
	    
	                // already connected.
	                if ( runtime ) {
	                    throw new Error('already connected!');
	                }
	    
	                deferred.done( cb );
	    
	                if ( typeof opts === 'string' && cache.get( opts ) ) {
	                    runtime = cache.get( opts );
	                }
	    
	                // 像filePicker只能独立存在，不能公用。
	                runtime = runtime || cache.get( null, standalone );
	    
	                // 需要创建
	                if ( !runtime ) {
	                    runtime = Runtime.create( opts, opts.runtimeOrder );
	                    runtime.__promise = deferred.promise();
	                    runtime.once( 'ready', deferred.resolve );
	                    runtime.init();
	                    cache.add( runtime );
	                    runtime.__client = 1;
	                } else {
	                    // 来自cache
	                    Base.$.extend( runtime.options, opts );
	                    runtime.__promise.then( deferred.resolve );
	                    runtime.__client++;
	                }
	    
	                standalone && (runtime.__standalone = standalone);
	                return runtime;
	            };
	    
	            this.getRuntime = function() {
	                return runtime;
	            };
	    
	            this.disconnectRuntime = function() {
	                if ( !runtime ) {
	                    return;
	                }
	    
	                runtime.__client--;
	    
	                if ( runtime.__client <= 0 ) {
	                    cache.remove( runtime );
	                    delete runtime.__promise;
	                    runtime.destroy();
	                }
	    
	                runtime = null;
	            };
	    
	            this.exec = function() {
	                if ( !runtime ) {
	                    return;
	                }
	    
	                var args = Base.slice( arguments );
	                component && args.unshift( component );
	    
	                return runtime.exec.apply( this, args );
	            };
	    
	            this.getRuid = function() {
	                return runtime && runtime.uid;
	            };
	    
	            this.destroy = (function( destroy ) {
	                return function() {
	                    destroy && destroy.apply( this, arguments );
	                    this.trigger('destroy');
	                    this.off();
	                    this.exec('destroy');
	                    this.disconnectRuntime();
	                };
	            })( this.destroy );
	        }
	    
	        Mediator.installTo( RuntimeClient.prototype );
	        return RuntimeClient;
	    });
	    /**
	     * @fileOverview 错误信息
	     */
	    define('lib/dnd',[
	        'base',
	        'mediator',
	        'runtime/client'
	    ], function( Base, Mediator, RuntimeClent ) {
	    
	        var $ = Base.$;
	    
	        function DragAndDrop( opts ) {
	            opts = this.options = $.extend({}, DragAndDrop.options, opts );
	    
	            opts.container = $( opts.container );
	    
	            if ( !opts.container.length ) {
	                return;
	            }
	    
	            RuntimeClent.call( this, 'DragAndDrop' );
	        }
	    
	        DragAndDrop.options = {
	            accept: null,
	            disableGlobalDnd: false
	        };
	    
	        Base.inherits( RuntimeClent, {
	            constructor: DragAndDrop,
	    
	            init: function() {
	                var me = this;
	    
	                me.connectRuntime( me.options, function() {
	                    me.exec('init');
	                    me.trigger('ready');
	                });
	            }
	        });
	    
	        Mediator.installTo( DragAndDrop.prototype );
	    
	        return DragAndDrop;
	    });
	    /**
	     * @fileOverview 组件基类。
	     */
	    define('widgets/widget',[
	        'base',
	        'uploader'
	    ], function( Base, Uploader ) {
	    
	        var $ = Base.$,
	            _init = Uploader.prototype._init,
	            _destroy = Uploader.prototype.destroy,
	            IGNORE = {},
	            widgetClass = [];
	    
	        function isArrayLike( obj ) {
	            if ( !obj ) {
	                return false;
	            }
	    
	            var length = obj.length,
	                type = $.type( obj );
	    
	            if ( obj.nodeType === 1 && length ) {
	                return true;
	            }
	    
	            return type === 'array' || type !== 'function' && type !== 'string' &&
	                    (length === 0 || typeof length === 'number' && length > 0 &&
	                    (length - 1) in obj);
	        }
	    
	        function Widget( uploader ) {
	            this.owner = uploader;
	            this.options = uploader.options;
	        }
	    
	        $.extend( Widget.prototype, {
	    
	            init: Base.noop,
	    
	            // 类Backbone的事件监听声明，监听uploader实例上的事件
	            // widget直接无法监听事件，事件只能通过uploader来传递
	            invoke: function( apiName, args ) {
	    
	                /*
	                    {
	                        'make-thumb': 'makeThumb'
	                    }
	                 */
	                var map = this.responseMap;
	    
	                // 如果无API响应声明则忽略
	                if ( !map || !(apiName in map) || !(map[ apiName ] in this) ||
	                        !$.isFunction( this[ map[ apiName ] ] ) ) {
	    
	                    return IGNORE;
	                }
	    
	                return this[ map[ apiName ] ].apply( this, args );
	    
	            },
	    
	            /**
	             * 发送命令。当传入`callback`或者`handler`中返回`promise`时。返回一个当所有`handler`中的promise都完成后完成的新`promise`。
	             * @method request
	             * @grammar request( command, args ) => * | Promise
	             * @grammar request( command, args, callback ) => Promise
	             * @for  Uploader
	             */
	            request: function() {
	                return this.owner.request.apply( this.owner, arguments );
	            }
	        });
	    
	        // 扩展Uploader.
	        $.extend( Uploader.prototype, {
	    
	            /**
	             * @property {String | Array} [disableWidgets=undefined]
	             * @namespace options
	             * @for Uploader
	             * @description 默认所有 Uploader.register 了的 widget 都会被加载，如果禁用某一部分，请通过此 option 指定黑名单。
	             */
	    
	            // 覆写_init用来初始化widgets
	            _init: function() {
	                var me = this,
	                    widgets = me._widgets = [],
	                    deactives = me.options.disableWidgets || '';
	    
	                $.each( widgetClass, function( _, klass ) {
	                    (!deactives || !~deactives.indexOf( klass._name )) &&
	                        widgets.push( new klass( me ) );
	                });
	    
	                return _init.apply( me, arguments );
	            },
	    
	            request: function( apiName, args, callback ) {
	                var i = 0,
	                    widgets = this._widgets,
	                    len = widgets && widgets.length,
	                    rlts = [],
	                    dfds = [],
	                    widget, rlt, promise, key;
	    
	                args = isArrayLike( args ) ? args : [ args ];
	    
	                for ( ; i < len; i++ ) {
	                    widget = widgets[ i ];
	                    rlt = widget.invoke( apiName, args );
	    
	                    if ( rlt !== IGNORE ) {
	    
	                        // Deferred对象
	                        if ( Base.isPromise( rlt ) ) {
	                            dfds.push( rlt );
	                        } else {
	                            rlts.push( rlt );
	                        }
	                    }
	                }
	    
	                // 如果有callback，则用异步方式。
	                if ( callback || dfds.length ) {
	                    promise = Base.when.apply( Base, dfds );
	                    key = promise.pipe ? 'pipe' : 'then';
	    
	                    // 很重要不能删除。删除了会死循环。
	                    // 保证执行顺序。让callback总是在下一个 tick 中执行。
	                    return promise[ key ](function() {
	                                var deferred = Base.Deferred(),
	                                    args = arguments;
	    
	                                if ( args.length === 1 ) {
	                                    args = args[ 0 ];
	                                }
	    
	                                setTimeout(function() {
	                                    deferred.resolve( args );
	                                }, 1 );
	    
	                                return deferred.promise();
	                            })[ callback ? key : 'done' ]( callback || Base.noop );
	                } else {
	                    return rlts[ 0 ];
	                }
	            },
	    
	            destroy: function() {
	                _destroy.apply( this, arguments );
	                this._widgets = null;
	            }
	        });
	    
	        /**
	         * 添加组件
	         * @grammar Uploader.register(proto);
	         * @grammar Uploader.register(map, proto);
	         * @param  {object} responseMap API 名称与函数实现的映射
	         * @param  {object} proto 组件原型，构造函数通过 constructor 属性定义
	         * @method Uploader.register
	         * @for Uploader
	         * @example
	         * Uploader.register({
	         *     'make-thumb': 'makeThumb'
	         * }, {
	         *     init: function( options ) {},
	         *     makeThumb: function() {}
	         * });
	         *
	         * Uploader.register({
	         *     'make-thumb': function() {
	         *         
	         *     }
	         * });
	         */
	        Uploader.register = Widget.register = function( responseMap, widgetProto ) {
	            var map = { init: 'init', destroy: 'destroy', name: 'anonymous' },
	                klass;
	    
	            if ( arguments.length === 1 ) {
	                widgetProto = responseMap;
	    
	                // 自动生成 map 表。
	                $.each(widgetProto, function(key) {
	                    if ( key[0] === '_' || key === 'name' ) {
	                        key === 'name' && (map.name = widgetProto.name);
	                        return;
	                    }
	    
	                    map[key.replace(/[A-Z]/g, '-$&').toLowerCase()] = key;
	                });
	    
	            } else {
	                map = $.extend( map, responseMap );
	            }
	    
	            widgetProto.responseMap = map;
	            klass = Base.inherits( Widget, widgetProto );
	            klass._name = map.name;
	            widgetClass.push( klass );
	    
	            return klass;
	        };
	    
	        /**
	         * 删除插件，只有在注册时指定了名字的才能被删除。
	         * @grammar Uploader.unRegister(name);
	         * @param  {string} name 组件名字
	         * @method Uploader.unRegister
	         * @for Uploader
	         * @example
	         *
	         * Uploader.register({
	         *     name: 'custom',
	         *     
	         *     'make-thumb': function() {
	         *         
	         *     }
	         * });
	         *
	         * Uploader.unRegister('custom');
	         */
	        Uploader.unRegister = Widget.unRegister = function( name ) {
	            if ( !name || name === 'anonymous' ) {
	                return;
	            }
	            
	            // 删除指定的插件。
	            for ( var i = widgetClass.length; i--; ) {
	                if ( widgetClass[i]._name === name ) {
	                    widgetClass.splice(i, 1)
	                }
	            }
	        };
	    
	        return Widget;
	    });
	    /**
	     * @fileOverview DragAndDrop Widget。
	     */
	    define('widgets/filednd',[
	        'base',
	        'uploader',
	        'lib/dnd',
	        'widgets/widget'
	    ], function( Base, Uploader, Dnd ) {
	        var $ = Base.$;
	    
	        Uploader.options.dnd = '';
	    
	        /**
	         * @property {Selector} [dnd=undefined]  指定Drag And Drop拖拽的容器，如果不指定，则不启动。
	         * @namespace options
	         * @for Uploader
	         */
	        
	        /**
	         * @property {Selector} [disableGlobalDnd=false]  是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
	         * @namespace options
	         * @for Uploader
	         */
	    
	        /**
	         * @event dndAccept
	         * @param {DataTransferItemList} items DataTransferItem
	         * @description 阻止此事件可以拒绝某些类型的文件拖入进来。目前只有 chrome 提供这样的 API，且只能通过 mime-type 验证。
	         * @for  Uploader
	         */
	        return Uploader.register({
	            name: 'dnd',
	            
	            init: function( opts ) {
	    
	                if ( !opts.dnd ||
	                        this.request('predict-runtime-type') !== 'html5' ) {
	                    return;
	                }
	    
	                var me = this,
	                    deferred = Base.Deferred(),
	                    options = $.extend({}, {
	                        disableGlobalDnd: opts.disableGlobalDnd,
	                        container: opts.dnd,
	                        accept: opts.accept
	                    }),
	                    dnd;
	    
	                this.dnd = dnd = new Dnd( options );
	    
	                dnd.once( 'ready', deferred.resolve );
	                dnd.on( 'drop', function( files ) {
	                    me.request( 'add-file', [ files ]);
	                });
	    
	                // 检测文件是否全部允许添加。
	                dnd.on( 'accept', function( items ) {
	                    return me.owner.trigger( 'dndAccept', items );
	                });
	    
	                dnd.init();
	    
	                return deferred.promise();
	            },
	    
	            destroy: function() {
	                this.dnd && this.dnd.destroy();
	            }
	        });
	    });
	    
	    /**
	     * @fileOverview 错误信息
	     */
	    define('lib/filepaste',[
	        'base',
	        'mediator',
	        'runtime/client'
	    ], function( Base, Mediator, RuntimeClent ) {
	    
	        var $ = Base.$;
	    
	        function FilePaste( opts ) {
	            opts = this.options = $.extend({}, opts );
	            opts.container = $( opts.container || document.body );
	            RuntimeClent.call( this, 'FilePaste' );
	        }
	    
	        Base.inherits( RuntimeClent, {
	            constructor: FilePaste,
	    
	            init: function() {
	                var me = this;
	    
	                me.connectRuntime( me.options, function() {
	                    me.exec('init');
	                    me.trigger('ready');
	                });
	            }
	        });
	    
	        Mediator.installTo( FilePaste.prototype );
	    
	        return FilePaste;
	    });
	    /**
	     * @fileOverview 组件基类。
	     */
	    define('widgets/filepaste',[
	        'base',
	        'uploader',
	        'lib/filepaste',
	        'widgets/widget'
	    ], function( Base, Uploader, FilePaste ) {
	        var $ = Base.$;
	    
	        /**
	         * @property {Selector} [paste=undefined]  指定监听paste事件的容器，如果不指定，不启用此功能。此功能为通过粘贴来添加截屏的图片。建议设置为`document.body`.
	         * @namespace options
	         * @for Uploader
	         */
	        return Uploader.register({
	            name: 'paste',
	            
	            init: function( opts ) {
	    
	                if ( !opts.paste ||
	                        this.request('predict-runtime-type') !== 'html5' ) {
	                    return;
	                }
	    
	                var me = this,
	                    deferred = Base.Deferred(),
	                    options = $.extend({}, {
	                        container: opts.paste,
	                        accept: opts.accept
	                    }),
	                    paste;
	    
	                this.paste = paste = new FilePaste( options );
	    
	                paste.once( 'ready', deferred.resolve );
	                paste.on( 'paste', function( files ) {
	                    me.owner.request( 'add-file', [ files ]);
	                });
	                paste.init();
	    
	                return deferred.promise();
	            },
	    
	            destroy: function() {
	                this.paste && this.paste.destroy();
	            }
	        });
	    });
	    /**
	     * @fileOverview Blob
	     */
	    define('lib/blob',[
	        'base',
	        'runtime/client'
	    ], function( Base, RuntimeClient ) {
	    
	        function Blob( ruid, source ) {
	            var me = this;
	    
	            me.source = source;
	            me.ruid = ruid;
	            this.size = source.size || 0;
	    
	            // 如果没有指定 mimetype, 但是知道文件后缀。
	            if ( !source.type && this.ext &&
	                    ~'jpg,jpeg,png,gif,bmp'.indexOf( this.ext ) ) {
	                this.type = 'image/' + (this.ext === 'jpg' ? 'jpeg' : this.ext);
	            } else {
	                this.type = source.type || 'application/octet-stream';
	            }
	    
	            RuntimeClient.call( me, 'Blob' );
	            this.uid = source.uid || this.uid;
	    
	            if ( ruid ) {
	                me.connectRuntime( ruid );
	            }
	        }
	    
	        Base.inherits( RuntimeClient, {
	            constructor: Blob,
	    
	            slice: function( start, end ) {
	                return this.exec( 'slice', start, end );
	            },
	    
	            getSource: function() {
	                return this.source;
	            }
	        });
	    
	        return Blob;
	    });
	    /**
	     * 为了统一化Flash的File和HTML5的File而存在。
	     * 以至于要调用Flash里面的File，也可以像调用HTML5版本的File一下。
	     * @fileOverview File
	     */
	    define('lib/file',[
	        'base',
	        'lib/blob'
	    ], function( Base, Blob ) {
	    
	        var uid = 1,
	            rExt = /\.([^.]+)$/;
	    
	        function File( ruid, file ) {
	            var ext;
	    
	            this.name = file.name || ('untitled' + uid++);
	            ext = rExt.exec( file.name ) ? RegExp.$1.toLowerCase() : '';
	    
	            // todo 支持其他类型文件的转换。
	            // 如果有 mimetype, 但是文件名里面没有找出后缀规律
	            if ( !ext && file.type ) {
	                ext = /\/(jpg|jpeg|png|gif|bmp)$/i.exec( file.type ) ?
	                        RegExp.$1.toLowerCase() : '';
	                this.name += '.' + ext;
	            }
	    
	            this.ext = ext;
	            this.lastModifiedDate = file.lastModifiedDate ||
	                    (new Date()).toLocaleString();
	    
	            Blob.apply( this, arguments );
	        }
	    
	        return Base.inherits( Blob, File );
	    });
	    
	    /**
	     * @fileOverview 错误信息
	     */
	    define('lib/filepicker',[
	        'base',
	        'runtime/client',
	        'lib/file'
	    ], function( Base, RuntimeClent, File ) {
	    
	        var $ = Base.$;
	    
	        function FilePicker( opts ) {
	            opts = this.options = $.extend({}, FilePicker.options, opts );
	    
	            opts.container = $( opts.id );
	    
	            if ( !opts.container.length ) {
	                throw new Error('按钮指定错误');
	            }
	    
	            opts.innerHTML = opts.innerHTML || opts.label ||
	                    opts.container.html() || '';
	    
	            opts.button = $( opts.button || document.createElement('div') );
	            opts.button.html( opts.innerHTML );
	            opts.container.html( opts.button );
	    
	            RuntimeClent.call( this, 'FilePicker', true );
	        }
	    
	        FilePicker.options = {
	            button: null,
	            container: null,
	            label: null,
	            innerHTML: null,
	            multiple: true,
	            accept: null,
	            name: 'file'
	        };
	    
	        Base.inherits( RuntimeClent, {
	            constructor: FilePicker,
	    
	            init: function() {
	                var me = this,
	                    opts = me.options,
	                    button = opts.button;
	    
	                button.addClass('webuploader-pick');
	    
	                me.on( 'all', function( type ) {
	                    var files;
	    
	                    switch ( type ) {
	                        case 'mouseenter':
	                            button.addClass('webuploader-pick-hover');
	                            break;
	    
	                        case 'mouseleave':
	                            button.removeClass('webuploader-pick-hover');
	                            break;
	    
	                        case 'change':
	                            files = me.exec('getFiles');
	                            me.trigger( 'select', $.map( files, function( file ) {
	                                file = new File( me.getRuid(), file );
	    
	                                // 记录来源。
	                                file._refer = opts.container;
	                                return file;
	                            }), opts.container );
	                            break;
	                    }
	                });
	    
	                me.connectRuntime( opts, function() {
	                    me.refresh();
	                    me.exec( 'init', opts );
	                    me.trigger('ready');
	                });
	    
	                this._resizeHandler = Base.bindFn( this.refresh, this );
	                $( window ).on( 'resize', this._resizeHandler );
	            },
	    
	            refresh: function() {
	                var shimContainer = this.getRuntime().getContainer(),
	                    button = this.options.button,
	                    width = button.outerWidth ?
	                            button.outerWidth() : button.width(),
	    
	                    height = button.outerHeight ?
	                            button.outerHeight() : button.height(),
	    
	                    pos = button.offset();
	    
	                width && height && shimContainer.css({
	                    bottom: 'auto',
	                    right: 'auto',
	                    width: width + 'px',
	                    height: height + 'px'
	                }).offset( pos );
	            },
	    
	            enable: function() {
	                var btn = this.options.button;
	    
	                btn.removeClass('webuploader-pick-disable');
	                this.refresh();
	            },
	    
	            disable: function() {
	                var btn = this.options.button;
	    
	                this.getRuntime().getContainer().css({
	                    top: '-99999px'
	                });
	    
	                btn.addClass('webuploader-pick-disable');
	            },
	    
	            destroy: function() {
	                var btn = this.options.button;
	                $( window ).off( 'resize', this._resizeHandler );
	                btn.removeClass('webuploader-pick-disable webuploader-pick-hover ' +
	                    'webuploader-pick');
	            }
	        });
	    
	        return FilePicker;
	    });
	    
	    /**
	     * @fileOverview 文件选择相关
	     */
	    define('widgets/filepicker',[
	        'base',
	        'uploader',
	        'lib/filepicker',
	        'widgets/widget'
	    ], function( Base, Uploader, FilePicker ) {
	        var $ = Base.$;
	    
	        $.extend( Uploader.options, {
	    
	            /**
	             * @property {Selector | Object} [pick=undefined]
	             * @namespace options
	             * @for Uploader
	             * @description 指定选择文件的按钮容器，不指定则不创建按钮。
	             *
	             * * `id` {Seletor|dom} 指定选择文件的按钮容器，不指定则不创建按钮。**注意** 这里虽然写的是 id, 但是不是只支持 id, 还支持 class, 或者 dom 节点。
	             * * `label` {String} 请采用 `innerHTML` 代替
	             * * `innerHTML` {String} 指定按钮文字。不指定时优先从指定的容器中看是否自带文字。
	             * * `multiple` {Boolean} 是否开起同时选择多个文件能力。
	             */
	            pick: null,
	    
	            /**
	             * @property {Arroy} [accept=null]
	             * @namespace options
	             * @for Uploader
	             * @description 指定接受哪些类型的文件。 由于目前还有ext转mimeType表，所以这里需要分开指定。
	             *
	             * * `title` {String} 文字描述
	             * * `extensions` {String} 允许的文件后缀，不带点，多个用逗号分割。
	             * * `mimeTypes` {String} 多个用逗号分割。
	             *
	             * 如：
	             *
	             * ```
	             * {
	             *     title: 'Images',
	             *     extensions: 'gif,jpg,jpeg,bmp,png',
	             *     mimeTypes: 'image/*'
	             * }
	             * ```
	             */
	            accept: null/*{
	                title: 'Images',
	                extensions: 'gif,jpg,jpeg,bmp,png',
	                mimeTypes: 'image/*'
	            }*/
	        });
	    
	        return Uploader.register({
	            name: 'picker',
	    
	            init: function( opts ) {
	                this.pickers = [];
	                return opts.pick && this.addBtn( opts.pick );
	            },
	    
	            refresh: function() {
	                $.each( this.pickers, function() {
	                    this.refresh();
	                });
	            },
	    
	            /**
	             * @method addButton
	             * @for Uploader
	             * @grammar addButton( pick ) => Promise
	             * @description
	             * 添加文件选择按钮，如果一个按钮不够，需要调用此方法来添加。参数跟[options.pick](#WebUploader:Uploader:options)一致。
	             * @example
	             * uploader.addButton({
	             *     id: '#btnContainer',
	             *     innerHTML: '选择文件'
	             * });
	             */
	            addBtn: function( pick ) {
	                var me = this,
	                    opts = me.options,
	                    accept = opts.accept,
	                    promises = [];
	    
	                if ( !pick ) {
	                    return;
	                }
	    
	                $.isPlainObject( pick ) || (pick = {
	                    id: pick
	                });
	    
	                $( pick.id ).each(function() {
	                    var options, picker, deferred;
	    
	                    deferred = Base.Deferred();
	    
	                    options = $.extend({}, pick, {
	                        accept: $.isPlainObject( accept ) ? [ accept ] : accept,
	                        swf: opts.swf,
	                        runtimeOrder: opts.runtimeOrder,
	                        id: this
	                    });
	    
	                    picker = new FilePicker( options );
	    
	                    picker.once( 'ready', deferred.resolve );
	                    picker.on( 'select', function( files ) {
	                        me.owner.request( 'add-file', [ files ]);
	                    });
	                    picker.init();
	    
	                    me.pickers.push( picker );
	    
	                    promises.push( deferred.promise() );
	                });
	    
	                return Base.when.apply( Base, promises );
	            },
	    
	            disable: function() {
	                $.each( this.pickers, function() {
	                    this.disable();
	                });
	            },
	    
	            enable: function() {
	                $.each( this.pickers, function() {
	                    this.enable();
	                });
	            },
	    
	            destroy: function() {
	                $.each( this.pickers, function() {
	                    this.destroy();
	                });
	                this.pickers = null;
	            }
	        });
	    });
	    /**
	     * @fileOverview Image
	     */
	    define('lib/image',[
	        'base',
	        'runtime/client',
	        'lib/blob'
	    ], function( Base, RuntimeClient, Blob ) {
	        var $ = Base.$;
	    
	        // 构造器。
	        function Image( opts ) {
	            this.options = $.extend({}, Image.options, opts );
	            RuntimeClient.call( this, 'Image' );
	    
	            this.on( 'load', function() {
	                this._info = this.exec('info');
	                this._meta = this.exec('meta');
	            });
	        }
	    
	        // 默认选项。
	        Image.options = {
	    
	            // 默认的图片处理质量
	            quality: 90,
	    
	            // 是否裁剪
	            crop: false,
	    
	            // 是否保留头部信息
	            preserveHeaders: false,
	    
	            // 是否允许放大。
	            allowMagnify: false
	        };
	    
	        // 继承RuntimeClient.
	        Base.inherits( RuntimeClient, {
	            constructor: Image,
	    
	            info: function( val ) {
	    
	                // setter
	                if ( val ) {
	                    this._info = val;
	                    return this;
	                }
	    
	                // getter
	                return this._info;
	            },
	    
	            meta: function( val ) {
	    
	                // setter
	                if ( val ) {
	                    this._meta = val;
	                    return this;
	                }
	    
	                // getter
	                return this._meta;
	            },
	    
	            loadFromBlob: function( blob ) {
	                var me = this,
	                    ruid = blob.getRuid();
	    
	                this.connectRuntime( ruid, function() {
	                    me.exec( 'init', me.options );
	                    me.exec( 'loadFromBlob', blob );
	                });
	            },
	    
	            resize: function() {
	                var args = Base.slice( arguments );
	                return this.exec.apply( this, [ 'resize' ].concat( args ) );
	            },
	    
	            crop: function() {
	                var args = Base.slice( arguments );
	                return this.exec.apply( this, [ 'crop' ].concat( args ) );
	            },
	    
	            getAsDataUrl: function( type ) {
	                return this.exec( 'getAsDataUrl', type );
	            },
	    
	            getAsBlob: function( type ) {
	                var blob = this.exec( 'getAsBlob', type );
	    
	                return new Blob( this.getRuid(), blob );
	            }
	        });
	    
	        return Image;
	    });
	    /**
	     * @fileOverview 图片操作, 负责预览图片和上传前压缩图片
	     */
	    define('widgets/image',[
	        'base',
	        'uploader',
	        'lib/image',
	        'widgets/widget'
	    ], function( Base, Uploader, Image ) {
	    
	        var $ = Base.$,
	            throttle;
	    
	        // 根据要处理的文件大小来节流，一次不能处理太多，会卡。
	        throttle = (function( max ) {
	            var occupied = 0,
	                waiting = [],
	                tick = function() {
	                    var item;
	    
	                    while ( waiting.length && occupied < max ) {
	                        item = waiting.shift();
	                        occupied += item[ 0 ];
	                        item[ 1 ]();
	                    }
	                };
	    
	            return function( emiter, size, cb ) {
	                waiting.push([ size, cb ]);
	                emiter.once( 'destroy', function() {
	                    occupied -= size;
	                    setTimeout( tick, 1 );
	                });
	                setTimeout( tick, 1 );
	            };
	        })( 5 * 1024 * 1024 );
	    
	        $.extend( Uploader.options, {
	    
	            /**
	             * @property {Object} [thumb]
	             * @namespace options
	             * @for Uploader
	             * @description 配置生成缩略图的选项。
	             *
	             * 默认为：
	             *
	             * ```javascript
	             * {
	             *     width: 110,
	             *     height: 110,
	             *
	             *     // 图片质量，只有type为`image/jpeg`的时候才有效。
	             *     quality: 70,
	             *
	             *     // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
	             *     allowMagnify: true,
	             *
	             *     // 是否允许裁剪。
	             *     crop: true,
	             *
	             *     // 为空的话则保留原有图片格式。
	             *     // 否则强制转换成指定的类型。
	             *     type: 'image/jpeg'
	             * }
	             * ```
	             */
	            thumb: {
	                width: 110,
	                height: 110,
	                quality: 70,
	                allowMagnify: true,
	                crop: true,
	                preserveHeaders: false,
	    
	                // 为空的话则保留原有图片格式。
	                // 否则强制转换成指定的类型。
	                // IE 8下面 base64 大小不能超过 32K 否则预览失败，而非 jpeg 编码的图片很可
	                // 能会超过 32k, 所以这里设置成预览的时候都是 image/jpeg
	                type: 'image/jpeg'
	            },
	    
	            /**
	             * @property {Object} [compress]
	             * @namespace options
	             * @for Uploader
	             * @description 配置压缩的图片的选项。如果此选项为`false`, 则图片在上传前不进行压缩。
	             *
	             * 默认为：
	             *
	             * ```javascript
	             * {
	             *     width: 1600,
	             *     height: 1600,
	             *
	             *     // 图片质量，只有type为`image/jpeg`的时候才有效。
	             *     quality: 90,
	             *
	             *     // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
	             *     allowMagnify: false,
	             *
	             *     // 是否允许裁剪。
	             *     crop: false,
	             *
	             *     // 是否保留头部meta信息。
	             *     preserveHeaders: true,
	             *
	             *     // 如果发现压缩后文件大小比原来还大，则使用原来图片
	             *     // 此属性可能会影响图片自动纠正功能
	             *     noCompressIfLarger: false,
	             *
	             *     // 单位字节，如果图片大小小于此值，不会采用压缩。
	             *     compressSize: 0
	             * }
	             * ```
	             */
	            compress: {
	                width: 1600,
	                height: 1600,
	                quality: 90,
	                allowMagnify: false,
	                crop: false,
	                preserveHeaders: true
	            }
	        });
	    
	        return Uploader.register({
	    
	            name: 'image',
	    
	    
	            /**
	             * 生成缩略图，此过程为异步，所以需要传入`callback`。
	             * 通常情况在图片加入队里后调用此方法来生成预览图以增强交互效果。
	             *
	             * 当 width 或者 height 的值介于 0 - 1 时，被当成百分比使用。
	             *
	             * `callback`中可以接收到两个参数。
	             * * 第一个为error，如果生成缩略图有错误，此error将为真。
	             * * 第二个为ret, 缩略图的Data URL值。
	             *
	             * **注意**
	             * Date URL在IE6/7中不支持，所以不用调用此方法了，直接显示一张暂不支持预览图片好了。
	             * 也可以借助服务端，将 base64 数据传给服务端，生成一个临时文件供预览。
	             *
	             * @method makeThumb
	             * @grammar makeThumb( file, callback ) => undefined
	             * @grammar makeThumb( file, callback, width, height ) => undefined
	             * @for Uploader
	             * @example
	             *
	             * uploader.on( 'fileQueued', function( file ) {
	             *     var $li = ...;
	             *
	             *     uploader.makeThumb( file, function( error, ret ) {
	             *         if ( error ) {
	             *             $li.text('预览错误');
	             *         } else {
	             *             $li.append('<img alt="" src="' + ret + '" />');
	             *         }
	             *     });
	             *
	             * });
	             */
	            makeThumb: function( file, cb, width, height ) {
	                var opts, image;
	    
	                file = this.request( 'get-file', file );
	    
	                // 只预览图片格式。
	                if ( !file.type.match( /^image/ ) ) {
	                    cb( true );
	                    return;
	                }
	    
	                opts = $.extend({}, this.options.thumb );
	    
	                // 如果传入的是object.
	                if ( $.isPlainObject( width ) ) {
	                    opts = $.extend( opts, width );
	                    width = null;
	                }
	    
	                width = width || opts.width;
	                height = height || opts.height;
	    
	                image = new Image( opts );
	    
	                image.once( 'load', function() {
	                    file._info = file._info || image.info();
	                    file._meta = file._meta || image.meta();
	    
	                    // 如果 width 的值介于 0 - 1
	                    // 说明设置的是百分比。
	                    if ( width <= 1 && width > 0 ) {
	                        width = file._info.width * width;
	                    }
	    
	                    // 同样的规则应用于 height
	                    if ( height <= 1 && height > 0 ) {
	                        height = file._info.height * height;
	                    }
	    
	                    image.resize( width, height );
	                });
	    
	                // 当 resize 完后
	                image.once( 'complete', function() {
	                    cb( false, image.getAsDataUrl( opts.type ) );
	                    image.destroy();
	                });
	    
	                image.once( 'error', function( reason ) {
	                    cb( reason || true );
	                    image.destroy();
	                });
	    
	                throttle( image, file.source.size, function() {
	                    file._info && image.info( file._info );
	                    file._meta && image.meta( file._meta );
	                    image.loadFromBlob( file.source );
	                });
	            },
	    
	            beforeSendFile: function( file ) {
	                var opts = this.options.compress || this.options.resize,
	                    compressSize = opts && opts.compressSize || 0,
	                    noCompressIfLarger = opts && opts.noCompressIfLarger || false,
	                    image, deferred;
	    
	                file = this.request( 'get-file', file );
	    
	                // 只压缩 jpeg 图片格式。
	                // gif 可能会丢失针
	                // bmp png 基本上尺寸都不大，且压缩比比较小。
	                if ( !opts || !~'image/jpeg,image/jpg'.indexOf( file.type ) ||
	                        file.size < compressSize ||
	                        file._compressed ) {
	                    return;
	                }
	    
	                opts = $.extend({}, opts );
	                deferred = Base.Deferred();
	    
	                image = new Image( opts );
	    
	                deferred.always(function() {
	                    image.destroy();
	                    image = null;
	                });
	                image.once( 'error', deferred.reject );
	                image.once( 'load', function() {
	                    var width = opts.width,
	                        height = opts.height;
	    
	                    file._info = file._info || image.info();
	                    file._meta = file._meta || image.meta();
	    
	                    // 如果 width 的值介于 0 - 1
	                    // 说明设置的是百分比。
	                    if ( width <= 1 && width > 0 ) {
	                        width = file._info.width * width;
	                    }
	    
	                    // 同样的规则应用于 height
	                    if ( height <= 1 && height > 0 ) {
	                        height = file._info.height * height;
	                    }
	    
	                    image.resize( width, height );
	                });
	    
	                image.once( 'complete', function() {
	                    var blob, size;
	    
	                    // 移动端 UC / qq 浏览器的无图模式下
	                    // ctx.getImageData 处理大图的时候会报 Exception
	                    // INDEX_SIZE_ERR: DOM Exception 1
	                    try {
	                        blob = image.getAsBlob( opts.type );
	    
	                        size = file.size;
	    
	                        // 如果压缩后，比原来还大则不用压缩后的。
	                        if ( !noCompressIfLarger || blob.size < size ) {
	                            // file.source.destroy && file.source.destroy();
	                            file.source = blob;
	                            file.size = blob.size;
	    
	                            file.trigger( 'resize', blob.size, size );
	                        }
	    
	                        // 标记，避免重复压缩。
	                        file._compressed = true;
	                        deferred.resolve();
	                    } catch ( e ) {
	                        // 出错了直接继续，让其上传原始图片
	                        deferred.resolve();
	                    }
	                });
	    
	                file._info && image.info( file._info );
	                file._meta && image.meta( file._meta );
	    
	                image.loadFromBlob( file.source );
	                return deferred.promise();
	            }
	        });
	    });
	    /**
	     * @fileOverview 文件属性封装
	     */
	    define('file',[
	        'base',
	        'mediator'
	    ], function( Base, Mediator ) {
	    
	        var $ = Base.$,
	            idPrefix = 'WU_FILE_',
	            idSuffix = 0,
	            rExt = /\.([^.]+)$/,
	            statusMap = {};
	    
	        function gid() {
	            return idPrefix + idSuffix++;
	        }
	    
	        /**
	         * 文件类
	         * @class File
	         * @constructor 构造函数
	         * @grammar new File( source ) => File
	         * @param {Lib.File} source [lib.File](#Lib.File)实例, 此source对象是带有Runtime信息的。
	         */
	        function WUFile( source ) {
	    
	            /**
	             * 文件名，包括扩展名（后缀）
	             * @property name
	             * @type {string}
	             */
	            this.name = source.name || 'Untitled';
	    
	            /**
	             * 文件体积（字节）
	             * @property size
	             * @type {uint}
	             * @default 0
	             */
	            this.size = source.size || 0;
	    
	            /**
	             * 文件MIMETYPE类型，与文件类型的对应关系请参考[http://t.cn/z8ZnFny](http://t.cn/z8ZnFny)
	             * @property type
	             * @type {string}
	             * @default 'application/octet-stream'
	             */
	            this.type = source.type || 'application/octet-stream';
	    
	            /**
	             * 文件最后修改日期
	             * @property lastModifiedDate
	             * @type {int}
	             * @default 当前时间戳
	             */
	            this.lastModifiedDate = source.lastModifiedDate || (new Date() * 1);
	    
	            /**
	             * 文件ID，每个对象具有唯一ID，与文件名无关
	             * @property id
	             * @type {string}
	             */
	            this.id = gid();
	    
	            /**
	             * 文件扩展名，通过文件名获取，例如test.png的扩展名为png
	             * @property ext
	             * @type {string}
	             */
	            this.ext = rExt.exec( this.name ) ? RegExp.$1 : '';
	    
	    
	            /**
	             * 状态文字说明。在不同的status语境下有不同的用途。
	             * @property statusText
	             * @type {string}
	             */
	            this.statusText = '';
	    
	            // 存储文件状态，防止通过属性直接修改
	            statusMap[ this.id ] = WUFile.Status.INITED;
	    
	            this.source = source;
	            this.loaded = 0;
	    
	            this.on( 'error', function( msg ) {
	                this.setStatus( WUFile.Status.ERROR, msg );
	            });
	        }
	    
	        $.extend( WUFile.prototype, {
	    
	            /**
	             * 设置状态，状态变化时会触发`change`事件。
	             * @method setStatus
	             * @grammar setStatus( status[, statusText] );
	             * @param {File.Status|String} status [文件状态值](#WebUploader:File:File.Status)
	             * @param {String} [statusText=''] 状态说明，常在error时使用，用http, abort,server等来标记是由于什么原因导致文件错误。
	             */
	            setStatus: function( status, text ) {
	    
	                var prevStatus = statusMap[ this.id ];
	    
	                typeof text !== 'undefined' && (this.statusText = text);
	    
	                if ( status !== prevStatus ) {
	                    statusMap[ this.id ] = status;
	                    /**
	                     * 文件状态变化
	                     * @event statuschange
	                     */
	                    this.trigger( 'statuschange', status, prevStatus );
	                }
	    
	            },
	    
	            /**
	             * 获取文件状态
	             * @return {File.Status}
	             * @example
	                     文件状态具体包括以下几种类型：
	                     {
	                         // 初始化
	                        INITED:     0,
	                        // 已入队列
	                        QUEUED:     1,
	                        // 正在上传
	                        PROGRESS:     2,
	                        // 上传出错
	                        ERROR:         3,
	                        // 上传成功
	                        COMPLETE:     4,
	                        // 上传取消
	                        CANCELLED:     5
	                    }
	             */
	            getStatus: function() {
	                return statusMap[ this.id ];
	            },
	    
	            /**
	             * 获取文件原始信息。
	             * @return {*}
	             */
	            getSource: function() {
	                return this.source;
	            },
	    
	            destroy: function() {
	                this.off();
	                delete statusMap[ this.id ];
	            }
	        });
	    
	        Mediator.installTo( WUFile.prototype );
	    
	        /**
	         * 文件状态值，具体包括以下几种类型：
	         * * `inited` 初始状态
	         * * `queued` 已经进入队列, 等待上传
	         * * `progress` 上传中
	         * * `complete` 上传完成。
	         * * `error` 上传出错，可重试
	         * * `interrupt` 上传中断，可续传。
	         * * `invalid` 文件不合格，不能重试上传。会自动从队列中移除。
	         * * `cancelled` 文件被移除。
	         * @property {Object} Status
	         * @namespace File
	         * @class File
	         * @static
	         */
	        WUFile.Status = {
	            INITED:     'inited',    // 初始状态
	            QUEUED:     'queued',    // 已经进入队列, 等待上传
	            PROGRESS:   'progress',    // 上传中
	            ERROR:      'error',    // 上传出错，可重试
	            COMPLETE:   'complete',    // 上传完成。
	            CANCELLED:  'cancelled',    // 上传取消。
	            INTERRUPT:  'interrupt',    // 上传中断，可续传。
	            INVALID:    'invalid'    // 文件不合格，不能重试上传。
	        };
	    
	        return WUFile;
	    });
	    
	    /**
	     * @fileOverview 文件队列
	     */
	    define('queue',[
	        'base',
	        'mediator',
	        'file'
	    ], function( Base, Mediator, WUFile ) {
	    
	        var $ = Base.$,
	            STATUS = WUFile.Status;
	    
	        /**
	         * 文件队列, 用来存储各个状态中的文件。
	         * @class Queue
	         * @extends Mediator
	         */
	        function Queue() {
	    
	            /**
	             * 统计文件数。
	             * * `numOfQueue` 队列中的文件数。
	             * * `numOfSuccess` 上传成功的文件数
	             * * `numOfCancel` 被取消的文件数
	             * * `numOfProgress` 正在上传中的文件数
	             * * `numOfUploadFailed` 上传错误的文件数。
	             * * `numOfInvalid` 无效的文件数。
	             * * `numofDeleted` 被移除的文件数。
	             * @property {Object} stats
	             */
	            this.stats = {
	                numOfQueue: 0,
	                numOfSuccess: 0,
	                numOfCancel: 0,
	                numOfProgress: 0,
	                numOfUploadFailed: 0,
	                numOfInvalid: 0,
	                numofDeleted: 0,
	                numofInterrupt: 0
	            };
	    
	            // 上传队列，仅包括等待上传的文件
	            this._queue = [];
	    
	            // 存储所有文件
	            this._map = {};
	        }
	    
	        $.extend( Queue.prototype, {
	    
	            /**
	             * 将新文件加入对队列尾部
	             *
	             * @method append
	             * @param  {File} file   文件对象
	             */
	            append: function( file ) {
	                this._queue.push( file );
	                this._fileAdded( file );
	                return this;
	            },
	    
	            /**
	             * 将新文件加入对队列头部
	             *
	             * @method prepend
	             * @param  {File} file   文件对象
	             */
	            prepend: function( file ) {
	                this._queue.unshift( file );
	                this._fileAdded( file );
	                return this;
	            },
	    
	            /**
	             * 获取文件对象
	             *
	             * @method getFile
	             * @param  {String} fileId   文件ID
	             * @return {File}
	             */
	            getFile: function( fileId ) {
	                if ( typeof fileId !== 'string' ) {
	                    return fileId;
	                }
	                return this._map[ fileId ];
	            },
	    
	            /**
	             * 从队列中取出一个指定状态的文件。
	             * @grammar fetch( status ) => File
	             * @method fetch
	             * @param {String} status [文件状态值](#WebUploader:File:File.Status)
	             * @return {File} [File](#WebUploader:File)
	             */
	            fetch: function( status ) {
	                var len = this._queue.length,
	                    i, file;
	    
	                status = status || STATUS.QUEUED;
	    
	                for ( i = 0; i < len; i++ ) {
	                    file = this._queue[ i ];
	    
	                    if ( status === file.getStatus() ) {
	                        return file;
	                    }
	                }
	    
	                return null;
	            },
	    
	            /**
	             * 对队列进行排序，能够控制文件上传顺序。
	             * @grammar sort( fn ) => undefined
	             * @method sort
	             * @param {Function} fn 排序方法
	             */
	            sort: function( fn ) {
	                if ( typeof fn === 'function' ) {
	                    this._queue.sort( fn );
	                }
	            },
	    
	            /**
	             * 获取指定类型的文件列表, 列表中每一个成员为[File](#WebUploader:File)对象。
	             * @grammar getFiles( [status1[, status2 ...]] ) => Array
	             * @method getFiles
	             * @param {String} [status] [文件状态值](#WebUploader:File:File.Status)
	             */
	            getFiles: function() {
	                var sts = [].slice.call( arguments, 0 ),
	                    ret = [],
	                    i = 0,
	                    len = this._queue.length,
	                    file;
	    
	                for ( ; i < len; i++ ) {
	                    file = this._queue[ i ];
	    
	                    if ( sts.length && !~$.inArray( file.getStatus(), sts ) ) {
	                        continue;
	                    }
	    
	                    ret.push( file );
	                }
	    
	                return ret;
	            },
	    
	            /**
	             * 在队列中删除文件。
	             * @grammar removeFile( file ) => Array
	             * @method removeFile
	             * @param {File} 文件对象。
	             */
	            removeFile: function( file ) {
	                var me = this,
	                    existing = this._map[ file.id ];
	    
	                if ( existing ) {
	                    delete this._map[ file.id ];
	                    file.destroy();
	                    this.stats.numofDeleted++;
	                }
	            },
	    
	            _fileAdded: function( file ) {
	                var me = this,
	                    existing = this._map[ file.id ];
	    
	                if ( !existing ) {
	                    this._map[ file.id ] = file;
	    
	                    file.on( 'statuschange', function( cur, pre ) {
	                        me._onFileStatusChange( cur, pre );
	                    });
	                }
	            },
	    
	            _onFileStatusChange: function( curStatus, preStatus ) {
	                var stats = this.stats;
	    
	                switch ( preStatus ) {
	                    case STATUS.PROGRESS:
	                        stats.numOfProgress--;
	                        break;
	    
	                    case STATUS.QUEUED:
	                        stats.numOfQueue --;
	                        break;
	    
	                    case STATUS.ERROR:
	                        stats.numOfUploadFailed--;
	                        break;
	    
	                    case STATUS.INVALID:
	                        stats.numOfInvalid--;
	                        break;
	    
	                    case STATUS.INTERRUPT:
	                        stats.numofInterrupt--;
	                        break;
	                }
	    
	                switch ( curStatus ) {
	                    case STATUS.QUEUED:
	                        stats.numOfQueue++;
	                        break;
	    
	                    case STATUS.PROGRESS:
	                        stats.numOfProgress++;
	                        break;
	    
	                    case STATUS.ERROR:
	                        stats.numOfUploadFailed++;
	                        break;
	    
	                    case STATUS.COMPLETE:
	                        stats.numOfSuccess++;
	                        break;
	    
	                    case STATUS.CANCELLED:
	                        stats.numOfCancel++;
	                        break;
	    
	    
	                    case STATUS.INVALID:
	                        stats.numOfInvalid++;
	                        break;
	    
	                    case STATUS.INTERRUPT:
	                        stats.numofInterrupt++;
	                        break;
	                }
	            }
	    
	        });
	    
	        Mediator.installTo( Queue.prototype );
	    
	        return Queue;
	    });
	    /**
	     * @fileOverview 队列
	     */
	    define('widgets/queue',[
	        'base',
	        'uploader',
	        'queue',
	        'file',
	        'lib/file',
	        'runtime/client',
	        'widgets/widget'
	    ], function( Base, Uploader, Queue, WUFile, File, RuntimeClient ) {
	    
	        var $ = Base.$,
	            rExt = /\.\w+$/,
	            Status = WUFile.Status;
	    
	        return Uploader.register({
	            name: 'queue',
	    
	            init: function( opts ) {
	                var me = this,
	                    deferred, len, i, item, arr, accept, runtime;
	    
	                if ( $.isPlainObject( opts.accept ) ) {
	                    opts.accept = [ opts.accept ];
	                }
	    
	                // accept中的中生成匹配正则。
	                if ( opts.accept ) {
	                    arr = [];
	    
	                    for ( i = 0, len = opts.accept.length; i < len; i++ ) {
	                        item = opts.accept[ i ].extensions;
	                        item && arr.push( item );
	                    }
	    
	                    if ( arr.length ) {
	                        accept = '\\.' + arr.join(',')
	                                .replace( /,/g, '$|\\.' )
	                                .replace( /\*/g, '.*' ) + '$';
	                    }
	    
	                    me.accept = new RegExp( accept, 'i' );
	                }
	    
	                me.queue = new Queue();
	                me.stats = me.queue.stats;
	    
	                // 如果当前不是html5运行时，那就算了。
	                // 不执行后续操作
	                if ( this.request('predict-runtime-type') !== 'html5' ) {
	                    return;
	                }
	    
	                // 创建一个 html5 运行时的 placeholder
	                // 以至于外部添加原生 File 对象的时候能正确包裹一下供 webuploader 使用。
	                deferred = Base.Deferred();
	                this.placeholder = runtime = new RuntimeClient('Placeholder');
	                runtime.connectRuntime({
	                    runtimeOrder: 'html5'
	                }, function() {
	                    me._ruid = runtime.getRuid();
	                    deferred.resolve();
	                });
	                return deferred.promise();
	            },
	    
	    
	            // 为了支持外部直接添加一个原生File对象。
	            _wrapFile: function( file ) {
	                if ( !(file instanceof WUFile) ) {
	    
	                    if ( !(file instanceof File) ) {
	                        if ( !this._ruid ) {
	                            throw new Error('Can\'t add external files.');
	                        }
	                        file = new File( this._ruid, file );
	                    }
	    
	                    file = new WUFile( file );
	                }
	    
	                return file;
	            },
	    
	            // 判断文件是否可以被加入队列
	            acceptFile: function( file ) {
	                var invalid = !file || !file.size || this.accept &&
	    
	                        // 如果名字中有后缀，才做后缀白名单处理。
	                        rExt.exec( file.name ) && !this.accept.test( file.name );
	    
	                return !invalid;
	            },
	    
	    
	            /**
	             * @event beforeFileQueued
	             * @param {File} file File对象
	             * @description 当文件被加入队列之前触发，此事件的handler返回值为`false`，则此文件不会被添加进入队列。
	             * @for  Uploader
	             */
	    
	            /**
	             * @event fileQueued
	             * @param {File} file File对象
	             * @description 当文件被加入队列以后触发。
	             * @for  Uploader
	             */
	    
	            _addFile: function( file ) {
	                var me = this;
	    
	                file = me._wrapFile( file );
	    
	                // 不过类型判断允许不允许，先派送 `beforeFileQueued`
	                if ( !me.owner.trigger( 'beforeFileQueued', file ) ) {
	                    return;
	                }
	    
	                // 类型不匹配，则派送错误事件，并返回。
	                if ( !me.acceptFile( file ) ) {
	                    me.owner.trigger( 'error', 'Q_TYPE_DENIED', file );
	                    return;
	                }
	    
	                me.queue.append( file );
	                me.owner.trigger( 'fileQueued', file );
	                return file;
	            },
	    
	            getFile: function( fileId ) {
	                return this.queue.getFile( fileId );
	            },
	    
	            /**
	             * @event filesQueued
	             * @param {File} files 数组，内容为原始File(lib/File）对象。
	             * @description 当一批文件添加进队列以后触发。
	             * @for  Uploader
	             */
	            
	            /**
	             * @property {Boolean} [auto=false]
	             * @namespace options
	             * @for Uploader
	             * @description 设置为 true 后，不需要手动调用上传，有文件选择即开始上传。
	             * 
	             */
	    
	            /**
	             * @method addFiles
	             * @grammar addFiles( file ) => undefined
	             * @grammar addFiles( [file1, file2 ...] ) => undefined
	             * @param {Array of File or File} [files] Files 对象 数组
	             * @description 添加文件到队列
	             * @for  Uploader
	             */
	            addFile: function( files ) {
	                var me = this;
	    
	                if ( !files.length ) {
	                    files = [ files ];
	                }
	    
	                files = $.map( files, function( file ) {
	                    return me._addFile( file );
	                });
	    
	                me.owner.trigger( 'filesQueued', files );
	    
	                if ( me.options.auto ) {
	                    setTimeout(function() {
	                        me.request('start-upload');
	                    }, 20 );
	                }
	            },
	    
	            getStats: function() {
	                return this.stats;
	            },
	    
	            /**
	             * @event fileDequeued
	             * @param {File} file File对象
	             * @description 当文件被移除队列后触发。
	             * @for  Uploader
	             */
	    
	             /**
	             * @method removeFile
	             * @grammar removeFile( file ) => undefined
	             * @grammar removeFile( id ) => undefined
	             * @grammar removeFile( file, true ) => undefined
	             * @grammar removeFile( id, true ) => undefined
	             * @param {File|id} file File对象或这File对象的id
	             * @description 移除某一文件, 默认只会标记文件状态为已取消，如果第二个参数为 `true` 则会从 queue 中移除。
	             * @for  Uploader
	             * @example
	             *
	             * $li.on('click', '.remove-this', function() {
	             *     uploader.removeFile( file );
	             * })
	             */
	            removeFile: function( file, remove ) {
	                var me = this;
	    
	                file = file.id ? file : me.queue.getFile( file );
	    
	                this.request( 'cancel-file', file );
	    
	                if ( remove ) {
	                    this.queue.removeFile( file );
	                }
	            },
	    
	            /**
	             * @method getFiles
	             * @grammar getFiles() => Array
	             * @grammar getFiles( status1, status2, status... ) => Array
	             * @description 返回指定状态的文件集合，不传参数将返回所有状态的文件。
	             * @for  Uploader
	             * @example
	             * console.log( uploader.getFiles() );    // => all files
	             * console.log( uploader.getFiles('error') )    // => all error files.
	             */
	            getFiles: function() {
	                return this.queue.getFiles.apply( this.queue, arguments );
	            },
	    
	            fetchFile: function() {
	                return this.queue.fetch.apply( this.queue, arguments );
	            },
	    
	            /**
	             * @method retry
	             * @grammar retry() => undefined
	             * @grammar retry( file ) => undefined
	             * @description 重试上传，重试指定文件，或者从出错的文件开始重新上传。
	             * @for  Uploader
	             * @example
	             * function retry() {
	             *     uploader.retry();
	             * }
	             */
	            retry: function( file, noForceStart ) {
	                var me = this,
	                    files, i, len;
	    
	                if ( file ) {
	                    file = file.id ? file : me.queue.getFile( file );
	                    file.setStatus( Status.QUEUED );
	                    noForceStart || me.request('start-upload');
	                    return;
	                }
	    
	                files = me.queue.getFiles( Status.ERROR );
	                i = 0;
	                len = files.length;
	    
	                for ( ; i < len; i++ ) {
	                    file = files[ i ];
	                    file.setStatus( Status.QUEUED );
	                }
	    
	                me.request('start-upload');
	            },
	    
	            /**
	             * @method sort
	             * @grammar sort( fn ) => undefined
	             * @description 排序队列中的文件，在上传之前调整可以控制上传顺序。
	             * @for  Uploader
	             */
	            sortFiles: function() {
	                return this.queue.sort.apply( this.queue, arguments );
	            },
	    
	            /**
	             * @event reset
	             * @description 当 uploader 被重置的时候触发。
	             * @for  Uploader
	             */
	    
	            /**
	             * @method reset
	             * @grammar reset() => undefined
	             * @description 重置uploader。目前只重置了队列。
	             * @for  Uploader
	             * @example
	             * uploader.reset();
	             */
	            reset: function() {
	                this.owner.trigger('reset');
	                this.queue = new Queue();
	                this.stats = this.queue.stats;
	            },
	    
	            destroy: function() {
	                this.reset();
	                this.placeholder && this.placeholder.destroy();
	            }
	        });
	    
	    });
	    /**
	     * @fileOverview 添加获取Runtime相关信息的方法。
	     */
	    define('widgets/runtime',[
	        'uploader',
	        'runtime/runtime',
	        'widgets/widget'
	    ], function( Uploader, Runtime ) {
	    
	        Uploader.support = function() {
	            return Runtime.hasRuntime.apply( Runtime, arguments );
	        };
	    
	        /**
	         * @property {Object} [runtimeOrder=html5,flash]
	         * @namespace options
	         * @for Uploader
	         * @description 指定运行时启动顺序。默认会想尝试 html5 是否支持，如果支持则使用 html5, 否则则使用 flash.
	         *
	         * 可以将此值设置成 `flash`，来强制使用 flash 运行时。
	         */
	    
	        return Uploader.register({
	            name: 'runtime',
	    
	            init: function() {
	                if ( !this.predictRuntimeType() ) {
	                    throw Error('Runtime Error');
	                }
	            },
	    
	            /**
	             * 预测Uploader将采用哪个`Runtime`
	             * @grammar predictRuntimeType() => String
	             * @method predictRuntimeType
	             * @for  Uploader
	             */
	            predictRuntimeType: function() {
	                var orders = this.options.runtimeOrder || Runtime.orders,
	                    type = this.type,
	                    i, len;
	    
	                if ( !type ) {
	                    orders = orders.split( /\s*,\s*/g );
	    
	                    for ( i = 0, len = orders.length; i < len; i++ ) {
	                        if ( Runtime.hasRuntime( orders[ i ] ) ) {
	                            this.type = type = orders[ i ];
	                            break;
	                        }
	                    }
	                }
	    
	                return type;
	            }
	        });
	    });
	    /**
	     * @fileOverview Transport
	     */
	    define('lib/transport',[
	        'base',
	        'runtime/client',
	        'mediator'
	    ], function( Base, RuntimeClient, Mediator ) {
	    
	        var $ = Base.$;
	    
	        function Transport( opts ) {
	            var me = this;
	    
	            opts = me.options = $.extend( true, {}, Transport.options, opts || {} );
	            RuntimeClient.call( this, 'Transport' );
	    
	            this._blob = null;
	            this._formData = opts.formData || {};
	            this._headers = opts.headers || {};
	    
	            this.on( 'progress', this._timeout );
	            this.on( 'load error', function() {
	                me.trigger( 'progress', 1 );
	                clearTimeout( me._timer );
	            });
	        }
	    
	        Transport.options = {
	            server: '',
	            method: 'POST',
	    
	            // 跨域时，是否允许携带cookie, 只有html5 runtime才有效
	            withCredentials: false,
	            fileVal: 'file',
	            timeout: 2 * 60 * 1000,    // 2分钟
	            formData: {},
	            headers: {},
	            sendAsBinary: false
	        };
	    
	        $.extend( Transport.prototype, {
	    
	            // 添加Blob, 只能添加一次，最后一次有效。
	            appendBlob: function( key, blob, filename ) {
	                var me = this,
	                    opts = me.options;
	    
	                if ( me.getRuid() ) {
	                    me.disconnectRuntime();
	                }
	    
	                // 连接到blob归属的同一个runtime.
	                me.connectRuntime( blob.ruid, function() {
	                    me.exec('init');
	                });
	    
	                me._blob = blob;
	                opts.fileVal = key || opts.fileVal;
	                opts.filename = filename || opts.filename;
	            },
	    
	            // 添加其他字段
	            append: function( key, value ) {
	                if ( typeof key === 'object' ) {
	                    $.extend( this._formData, key );
	                } else {
	                    this._formData[ key ] = value;
	                }
	            },
	    
	            setRequestHeader: function( key, value ) {
	                if ( typeof key === 'object' ) {
	                    $.extend( this._headers, key );
	                } else {
	                    this._headers[ key ] = value;
	                }
	            },
	    
	            send: function( method ) {
	                this.exec( 'send', method );
	                this._timeout();
	            },
	    
	            abort: function() {
	                clearTimeout( this._timer );
	                return this.exec('abort');
	            },
	    
	            destroy: function() {
	                this.trigger('destroy');
	                this.off();
	                this.exec('destroy');
	                this.disconnectRuntime();
	            },
	    
	            getResponse: function() {
	                return this.exec('getResponse');
	            },
	    
	            getResponseAsJson: function() {
	                return this.exec('getResponseAsJson');
	            },
	    
	            getStatus: function() {
	                return this.exec('getStatus');
	            },
	    
	            _timeout: function() {
	                var me = this,
	                    duration = me.options.timeout;
	    
	                if ( !duration ) {
	                    return;
	                }
	    
	                clearTimeout( me._timer );
	                me._timer = setTimeout(function() {
	                    me.abort();
	                    me.trigger( 'error', 'timeout' );
	                }, duration );
	            }
	    
	        });
	    
	        // 让Transport具备事件功能。
	        Mediator.installTo( Transport.prototype );
	    
	        return Transport;
	    });
	    /**
	     * @fileOverview 负责文件上传相关。
	     */
	    define('widgets/upload',[
	        'base',
	        'uploader',
	        'file',
	        'lib/transport',
	        'widgets/widget'
	    ], function( Base, Uploader, WUFile, Transport ) {
	    
	        var $ = Base.$,
	            isPromise = Base.isPromise,
	            Status = WUFile.Status;
	    
	        // 添加默认配置项
	        $.extend( Uploader.options, {
	    
	    
	            /**
	             * @property {Boolean} [prepareNextFile=false]
	             * @namespace options
	             * @for Uploader
	             * @description 是否允许在文件传输时提前把下一个文件准备好。
	             * 对于一个文件的准备工作比较耗时，比如图片压缩，md5序列化。
	             * 如果能提前在当前文件传输期处理，可以节省总体耗时。
	             */
	            prepareNextFile: false,
	    
	            /**
	             * @property {Boolean} [chunked=false]
	             * @namespace options
	             * @for Uploader
	             * @description 是否要分片处理大文件上传。
	             */
	            chunked: false,
	    
	            /**
	             * @property {Boolean} [chunkSize=5242880]
	             * @namespace options
	             * @for Uploader
	             * @description 如果要分片，分多大一片？ 默认大小为5M.
	             */
	            chunkSize: 5 * 1024 * 1024,
	    
	            /**
	             * @property {Boolean} [chunkRetry=2]
	             * @namespace options
	             * @for Uploader
	             * @description 如果某个分片由于网络问题出错，允许自动重传多少次？
	             */
	            chunkRetry: 2,
	    
	            /**
	             * @property {Boolean} [threads=3]
	             * @namespace options
	             * @for Uploader
	             * @description 上传并发数。允许同时最大上传进程数。
	             */
	            threads: 3,
	    
	    
	            /**
	             * @property {Object} [formData={}]
	             * @namespace options
	             * @for Uploader
	             * @description 文件上传请求的参数表，每次发送都会发送此对象中的参数。
	             */
	            formData: {}
	    
	            /**
	             * @property {Object} [fileVal='file']
	             * @namespace options
	             * @for Uploader
	             * @description 设置文件上传域的name。
	             */
	    
	            /**
	             * @property {Object} [method='POST']
	             * @namespace options
	             * @for Uploader
	             * @description 文件上传方式，`POST`或者`GET`。
	             */
	    
	            /**
	             * @property {Object} [sendAsBinary=false]
	             * @namespace options
	             * @for Uploader
	             * @description 是否已二进制的流的方式发送文件，这样整个上传内容`php://input`都为文件内容，
	             * 其他参数在$_GET数组中。
	             */
	        });
	    
	        // 负责将文件切片。
	        function CuteFile( file, chunkSize ) {
	            var pending = [],
	                blob = file.source,
	                total = blob.size,
	                chunks = chunkSize ? Math.ceil( total / chunkSize ) : 1,
	                start = 0,
	                index = 0,
	                len, api;
	    
	            api = {
	                file: file,
	    
	                has: function() {
	                    return !!pending.length;
	                },
	    
	                shift: function() {
	                    return pending.shift();
	                },
	    
	                unshift: function( block ) {
	                    pending.unshift( block );
	                }
	            };
	    
	            while ( index < chunks ) {
	                len = Math.min( chunkSize, total - start );
	    
	                pending.push({
	                    file: file,
	                    start: start,
	                    end: chunkSize ? (start + len) : total,
	                    total: total,
	                    chunks: chunks,
	                    chunk: index++,
	                    cuted: api
	                });
	                start += len;
	            }
	    
	            file.blocks = pending.concat();
	            file.remaning = pending.length;
	    
	            return api;
	        }
	    
	        Uploader.register({
	            name: 'upload',
	    
	            init: function() {
	                var owner = this.owner,
	                    me = this;
	    
	                this.runing = false;
	                this.progress = false;
	    
	                owner
	                    .on( 'startUpload', function() {
	                        me.progress = true;
	                    })
	                    .on( 'uploadFinished', function() {
	                        me.progress = false;
	                    });
	    
	                // 记录当前正在传的数据，跟threads相关
	                this.pool = [];
	    
	                // 缓存分好片的文件。
	                this.stack = [];
	    
	                // 缓存即将上传的文件。
	                this.pending = [];
	    
	                // 跟踪还有多少分片在上传中但是没有完成上传。
	                this.remaning = 0;
	                this.__tick = Base.bindFn( this._tick, this );
	    
	                owner.on( 'uploadComplete', function( file ) {
	    
	                    // 把其他块取消了。
	                    file.blocks && $.each( file.blocks, function( _, v ) {
	                        v.transport && (v.transport.abort(), v.transport.destroy());
	                        delete v.transport;
	                    });
	    
	                    delete file.blocks;
	                    delete file.remaning;
	                });
	            },
	    
	            reset: function() {
	                this.request( 'stop-upload', true );
	                this.runing = false;
	                this.pool = [];
	                this.stack = [];
	                this.pending = [];
	                this.remaning = 0;
	                this._trigged = false;
	                this._promise = null;
	            },
	    
	            /**
	             * @event startUpload
	             * @description 当开始上传流程时触发。
	             * @for  Uploader
	             */
	    
	            /**
	             * 开始上传。此方法可以从初始状态调用开始上传流程，也可以从暂停状态调用，继续上传流程。
	             *
	             * 可以指定开始某一个文件。
	             * @grammar upload() => undefined
	             * @grammar upload( file | fileId) => undefined
	             * @method upload
	             * @for  Uploader
	             */
	            startUpload: function(file) {
	                var me = this;
	    
	                // 移出invalid的文件
	                $.each( me.request( 'get-files', Status.INVALID ), function() {
	                    me.request( 'remove-file', this );
	                });
	    
	                // 如果指定了开始某个文件，则只开始指定文件。
	                if ( file ) {
	                    file = file.id ? file : me.request( 'get-file', file );
	    
	                    if (file.getStatus() === Status.INTERRUPT) {
	                        $.each( me.pool, function( _, v ) {
	    
	                            // 之前暂停过。
	                            if (v.file !== file) {
	                                return;
	                            }
	    
	                            v.transport && v.transport.send();
	                        });
	    
	                        file.setStatus( Status.QUEUED );
	                    } else if (file.getStatus() === Status.PROGRESS) {
	                        return;
	                    } else {
	                        file.setStatus( Status.QUEUED );
	                    }
	                } else {
	                    $.each( me.request( 'get-files', [ Status.INITED ] ), function() {
	                        this.setStatus( Status.QUEUED );
	                    });
	                }
	    
	                if ( me.runing ) {
	                    return;
	                }
	    
	                me.runing = true;
	    
	                var files = [];
	    
	                // 如果有暂停的，则续传
	                $.each( me.pool, function( _, v ) {
	                    var file = v.file;
	    
	                    if ( file.getStatus() === Status.INTERRUPT ) {
	                        files.push(file);
	                        me._trigged = false;
	                        v.transport && v.transport.send();
	                    }
	                });
	    
	                var file;
	                while ( (file = files.shift()) ) {
	                    file.setStatus( Status.PROGRESS );
	                }
	    
	                file || $.each( me.request( 'get-files',
	                        Status.INTERRUPT ), function() {
	                    this.setStatus( Status.PROGRESS );
	                });
	    
	                me._trigged = false;
	                Base.nextTick( me.__tick );
	                me.owner.trigger('startUpload');
	            },
	    
	            /**
	             * @event stopUpload
	             * @description 当开始上传流程暂停时触发。
	             * @for  Uploader
	             */
	    
	            /**
	             * 暂停上传。第一个参数为是否中断上传当前正在上传的文件。
	             *
	             * 如果第一个参数是文件，则只暂停指定文件。
	             * @grammar stop() => undefined
	             * @grammar stop( true ) => undefined
	             * @grammar stop( file ) => undefined
	             * @method stop
	             * @for  Uploader
	             */
	            stopUpload: function( file, interrupt ) {
	                var me = this;
	    
	                if (file === true) {
	                    interrupt = file;
	                    file = null;
	                }
	    
	                if ( me.runing === false ) {
	                    return;
	                }
	    
	                // 如果只是暂停某个文件。
	                if ( file ) {
	                    file = file.id ? file : me.request( 'get-file', file );
	    
	                    if ( file.getStatus() !== Status.PROGRESS &&
	                            file.getStatus() !== Status.QUEUED ) {
	                        return;
	                    }
	    
	                    file.setStatus( Status.INTERRUPT );
	                    $.each( me.pool, function( _, v ) {
	    
	                        // 只 abort 指定的文件。
	                        if (v.file !== file) {
	                            return;
	                        }
	    
	                        v.transport && v.transport.abort();
	                        me._putback(v);
	                        me._popBlock(v);
	                    });
	    
	                    return Base.nextTick( me.__tick );
	                }
	    
	                me.runing = false;
	    
	                if (this._promise && this._promise.file) {
	                    this._promise.file.setStatus( Status.INTERRUPT );
	                }
	    
	                interrupt && $.each( me.pool, function( _, v ) {
	                    v.transport && v.transport.abort();
	                    v.file.setStatus( Status.INTERRUPT );
	                });
	    
	                me.owner.trigger('stopUpload');
	            },
	    
	            /**
	             * @method cancelFile
	             * @grammar cancelFile( file ) => undefined
	             * @grammar cancelFile( id ) => undefined
	             * @param {File|id} file File对象或这File对象的id
	             * @description 标记文件状态为已取消, 同时将中断文件传输。
	             * @for  Uploader
	             * @example
	             *
	             * $li.on('click', '.remove-this', function() {
	             *     uploader.cancelFile( file );
	             * })
	             */
	            cancelFile: function( file ) {
	                file = file.id ? file : this.request( 'get-file', file );
	    
	                // 如果正在上传。
	                file.blocks && $.each( file.blocks, function( _, v ) {
	                    var _tr = v.transport;
	    
	                    if ( _tr ) {
	                        _tr.abort();
	                        _tr.destroy();
	                        delete v.transport;
	                    }
	                });
	    
	                file.setStatus( Status.CANCELLED );
	                this.owner.trigger( 'fileDequeued', file );
	            },
	    
	            /**
	             * 判断`Uplaode`r是否正在上传中。
	             * @grammar isInProgress() => Boolean
	             * @method isInProgress
	             * @for  Uploader
	             */
	            isInProgress: function() {
	                return !!this.progress;
	            },
	    
	            _getStats: function() {
	                return this.request('get-stats');
	            },
	    
	            /**
	             * 掉过一个文件上传，直接标记指定文件为已上传状态。
	             * @grammar skipFile( file ) => undefined
	             * @method skipFile
	             * @for  Uploader
	             */
	            skipFile: function( file, status ) {
	                file = file.id ? file : this.request( 'get-file', file );
	    
	                file.setStatus( status || Status.COMPLETE );
	                file.skipped = true;
	    
	                // 如果正在上传。
	                file.blocks && $.each( file.blocks, function( _, v ) {
	                    var _tr = v.transport;
	    
	                    if ( _tr ) {
	                        _tr.abort();
	                        _tr.destroy();
	                        delete v.transport;
	                    }
	                });
	    
	                this.owner.trigger( 'uploadSkip', file );
	            },
	    
	            /**
	             * @event uploadFinished
	             * @description 当所有文件上传结束时触发。
	             * @for  Uploader
	             */
	            _tick: function() {
	                var me = this,
	                    opts = me.options,
	                    fn, val;
	    
	                // 上一个promise还没有结束，则等待完成后再执行。
	                if ( me._promise ) {
	                    return me._promise.always( me.__tick );
	                }
	    
	                // 还有位置，且还有文件要处理的话。
	                if ( me.pool.length < opts.threads && (val = me._nextBlock()) ) {
	                    me._trigged = false;
	    
	                    fn = function( val ) {
	                        me._promise = null;
	    
	                        // 有可能是reject过来的，所以要检测val的类型。
	                        val && val.file && me._startSend( val );
	                        Base.nextTick( me.__tick );
	                    };
	    
	                    me._promise = isPromise( val ) ? val.always( fn ) : fn( val );
	    
	                // 没有要上传的了，且没有正在传输的了。
	                } else if ( !me.remaning && !me._getStats().numOfQueue &&
	                    !me._getStats().numofInterrupt ) {
	                    me.runing = false;
	    
	                    me._trigged || Base.nextTick(function() {
	                        me.owner.trigger('uploadFinished');
	                    });
	                    me._trigged = true;
	                }
	            },
	    
	            _putback: function(block) {
	                var idx;
	    
	                block.cuted.unshift(block);
	                idx = this.stack.indexOf(block.cuted);
	    
	                if (!~idx) {
	                    this.stack.unshift(block.cuted);
	                }
	            },
	    
	            _getStack: function() {
	                var i = 0,
	                    act;
	    
	                while ( (act = this.stack[ i++ ]) ) {
	                    if ( act.has() && act.file.getStatus() === Status.PROGRESS ) {
	                        return act;
	                    } else if (!act.has() ||
	                            act.file.getStatus() !== Status.PROGRESS &&
	                            act.file.getStatus() !== Status.INTERRUPT ) {
	    
	                        // 把已经处理完了的，或者，状态为非 progress（上传中）、
	                        // interupt（暂停中） 的移除。
	                        this.stack.splice( --i, 1 );
	                    }
	                }
	    
	                return null;
	            },
	    
	            _nextBlock: function() {
	                var me = this,
	                    opts = me.options,
	                    act, next, done, preparing;
	    
	                // 如果当前文件还有没有需要传输的，则直接返回剩下的。
	                if ( (act = this._getStack()) ) {
	    
	                    // 是否提前准备下一个文件
	                    if ( opts.prepareNextFile && !me.pending.length ) {
	                        me._prepareNextFile();
	                    }
	    
	                    return act.shift();
	    
	                // 否则，如果正在运行，则准备下一个文件，并等待完成后返回下个分片。
	                } else if ( me.runing ) {
	    
	                    // 如果缓存中有，则直接在缓存中取，没有则去queue中取。
	                    if ( !me.pending.length && me._getStats().numOfQueue ) {
	                        me._prepareNextFile();
	                    }
	    
	                    next = me.pending.shift();
	                    done = function( file ) {
	                        if ( !file ) {
	                            return null;
	                        }
	    
	                        act = CuteFile( file, opts.chunked ? opts.chunkSize : 0 );
	                        me.stack.push(act);
	                        return act.shift();
	                    };
	    
	                    // 文件可能还在prepare中，也有可能已经完全准备好了。
	                    if ( isPromise( next) ) {
	                        preparing = next.file;
	                        next = next[ next.pipe ? 'pipe' : 'then' ]( done );
	                        next.file = preparing;
	                        return next;
	                    }
	    
	                    return done( next );
	                }
	            },
	    
	    
	            /**
	             * @event uploadStart
	             * @param {File} file File对象
	             * @description 某个文件开始上传前触发，一个文件只会触发一次。
	             * @for  Uploader
	             */
	            _prepareNextFile: function() {
	                var me = this,
	                    file = me.request('fetch-file'),
	                    pending = me.pending,
	                    promise;
	    
	                if ( file ) {
	                    promise = me.request( 'before-send-file', file, function() {
	    
	                        // 有可能文件被skip掉了。文件被skip掉后，状态坑定不是Queued.
	                        if ( file.getStatus() === Status.PROGRESS ||
	                            file.getStatus() === Status.INTERRUPT ) {
	                            return file;
	                        }
	    
	                        return me._finishFile( file );
	                    });
	    
	                    me.owner.trigger( 'uploadStart', file );
	                    file.setStatus( Status.PROGRESS );
	    
	                    promise.file = file;
	    
	                    // 如果还在pending中，则替换成文件本身。
	                    promise.done(function() {
	                        var idx = $.inArray( promise, pending );
	    
	                        ~idx && pending.splice( idx, 1, file );
	                    });
	    
	                    // befeore-send-file的钩子就有错误发生。
	                    promise.fail(function( reason ) {
	                        file.setStatus( Status.ERROR, reason );
	                        me.owner.trigger( 'uploadError', file, reason );
	                        me.owner.trigger( 'uploadComplete', file );
	                    });
	    
	                    pending.push( promise );
	                }
	            },
	    
	            // 让出位置了，可以让其他分片开始上传
	            _popBlock: function( block ) {
	                var idx = $.inArray( block, this.pool );
	    
	                this.pool.splice( idx, 1 );
	                block.file.remaning--;
	                this.remaning--;
	            },
	    
	            // 开始上传，可以被掉过。如果promise被reject了，则表示跳过此分片。
	            _startSend: function( block ) {
	                var me = this,
	                    file = block.file,
	                    promise;
	    
	                // 有可能在 before-send-file 的 promise 期间改变了文件状态。
	                // 如：暂停，取消
	                // 我们不能中断 promise, 但是可以在 promise 完后，不做上传操作。
	                if ( file.getStatus() !== Status.PROGRESS ) {
	    
	                    // 如果是中断，则还需要放回去。
	                    if (file.getStatus() === Status.INTERRUPT) {
	                        me._putback(block);
	                    }
	    
	                    return;
	                }
	    
	                me.pool.push( block );
	                me.remaning++;
	    
	                // 如果没有分片，则直接使用原始的。
	                // 不会丢失content-type信息。
	                block.blob = block.chunks === 1 ? file.source :
	                        file.source.slice( block.start, block.end );
	    
	                // hook, 每个分片发送之前可能要做些异步的事情。
	                promise = me.request( 'before-send', block, function() {
	    
	                    // 有可能文件已经上传出错了，所以不需要再传输了。
	                    if ( file.getStatus() === Status.PROGRESS ) {
	                        me._doSend( block );
	                    } else {
	                        me._popBlock( block );
	                        Base.nextTick( me.__tick );
	                    }
	                });
	    
	                // 如果为fail了，则跳过此分片。
	                promise.fail(function() {
	                    if ( file.remaning === 1 ) {
	                        me._finishFile( file ).always(function() {
	                            block.percentage = 1;
	                            me._popBlock( block );
	                            me.owner.trigger( 'uploadComplete', file );
	                            Base.nextTick( me.__tick );
	                        });
	                    } else {
	                        block.percentage = 1;
	                        me.updateFileProgress( file );
	                        me._popBlock( block );
	                        Base.nextTick( me.__tick );
	                    }
	                });
	            },
	    
	    
	            /**
	             * @event uploadBeforeSend
	             * @param {Object} object
	             * @param {Object} data 默认的上传参数，可以扩展此对象来控制上传参数。
	             * @param {Object} headers 可以扩展此对象来控制上传头部。
	             * @description 当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
	             * @for  Uploader
	             */
	    
	            /**
	             * @event uploadAccept
	             * @param {Object} object
	             * @param {Object} ret 服务端的返回数据，json格式，如果服务端不是json格式，从ret._raw中取数据，自行解析。
	             * @description 当某个文件上传到服务端响应后，会派送此事件来询问服务端响应是否有效。如果此事件handler返回值为`false`, 则此文件将派送`server`类型的`uploadError`事件。
	             * @for  Uploader
	             */
	    
	            /**
	             * @event uploadProgress
	             * @param {File} file File对象
	             * @param {Number} percentage 上传进度
	             * @description 上传过程中触发，携带上传进度。
	             * @for  Uploader
	             */
	    
	    
	            /**
	             * @event uploadError
	             * @param {File} file File对象
	             * @param {String} reason 出错的code
	             * @description 当文件上传出错时触发。
	             * @for  Uploader
	             */
	    
	            /**
	             * @event uploadSuccess
	             * @param {File} file File对象
	             * @param {Object} response 服务端返回的数据
	             * @description 当文件上传成功时触发。
	             * @for  Uploader
	             */
	    
	            /**
	             * @event uploadComplete
	             * @param {File} [file] File对象
	             * @description 不管成功或者失败，文件上传完成时触发。
	             * @for  Uploader
	             */
	    
	            // 做上传操作。
	            _doSend: function( block ) {
	                var me = this,
	                    owner = me.owner,
	                    opts = me.options,
	                    file = block.file,
	                    tr = new Transport( opts ),
	                    data = $.extend({}, opts.formData ),
	                    headers = $.extend({}, opts.headers ),
	                    requestAccept, ret;
	    
	                block.transport = tr;
	    
	                tr.on( 'destroy', function() {
	                    delete block.transport;
	                    me._popBlock( block );
	                    Base.nextTick( me.__tick );
	                });
	    
	                // 广播上传进度。以文件为单位。
	                tr.on( 'progress', function( percentage ) {
	                    block.percentage = percentage;
	                    me.updateFileProgress( file );
	                });
	    
	                // 用来询问，是否返回的结果是有错误的。
	                requestAccept = function( reject ) {
	                    var fn;
	    
	                    ret = tr.getResponseAsJson() || {};
	                    ret._raw = tr.getResponse();
	                    fn = function( value ) {
	                        reject = value;
	                    };
	    
	                    // 服务端响应了，不代表成功了，询问是否响应正确。
	                    if ( !owner.trigger( 'uploadAccept', block, ret, fn ) ) {
	                        reject = reject || 'server';
	                    }
	    
	                    return reject;
	                };
	    
	                // 尝试重试，然后广播文件上传出错。
	                tr.on( 'error', function( type, flag ) {
	                    block.retried = block.retried || 0;
	    
	                    // 自动重试
	                    if ( block.chunks > 1 && ~'http,abort'.indexOf( type ) &&
	                            block.retried < opts.chunkRetry ) {
	    
	                        block.retried++;
	                        tr.send();
	    
	                    } else {
	    
	                        // http status 500 ~ 600
	                        if ( !flag && type === 'server' ) {
	                            type = requestAccept( type );
	                        }
	    
	                        file.setStatus( Status.ERROR, type );
	                        owner.trigger( 'uploadError', file, type );
	                        owner.trigger( 'uploadComplete', file );
	                    }
	                });
	    
	                // 上传成功
	                tr.on( 'load', function() {
	                    var reason;
	    
	                    // 如果非预期，转向上传出错。
	                    if ( (reason = requestAccept()) ) {
	                        tr.trigger( 'error', reason, true );
	                        return;
	                    }
	    
	                    // 全部上传完成。
	                    if ( file.remaning === 1 ) {
	                        me._finishFile( file, ret );
	                    } else {
	                        tr.destroy();
	                    }
	                });
	    
	                // 配置默认的上传字段。
	                data = $.extend( data, {
	                    id: file.id,
	                    name: file.name,
	                    type: file.type,
	                    lastModifiedDate: file.lastModifiedDate,
	                    size: file.size
	                });
	    
	                block.chunks > 1 && $.extend( data, {
	                    chunks: block.chunks,
	                    chunk: block.chunk
	                });
	    
	                // 在发送之间可以添加字段什么的。。。
	                // 如果默认的字段不够使用，可以通过监听此事件来扩展
	                owner.trigger( 'uploadBeforeSend', block, data, headers );
	    
	                // 开始发送。
	                tr.appendBlob( opts.fileVal, block.blob, file.name );
	                tr.append( data );
	                tr.setRequestHeader( headers );
	                tr.send();
	            },
	    
	            // 完成上传。
	            _finishFile: function( file, ret, hds ) {
	                var owner = this.owner;
	    
	                return owner
	                        .request( 'after-send-file', arguments, function() {
	                            file.setStatus( Status.COMPLETE );
	                            owner.trigger( 'uploadSuccess', file, ret, hds );
	                        })
	                        .fail(function( reason ) {
	    
	                            // 如果外部已经标记为invalid什么的，不再改状态。
	                            if ( file.getStatus() === Status.PROGRESS ) {
	                                file.setStatus( Status.ERROR, reason );
	                            }
	    
	                            owner.trigger( 'uploadError', file, reason );
	                        })
	                        .always(function() {
	                            owner.trigger( 'uploadComplete', file );
	                        });
	            },
	    
	            updateFileProgress: function(file) {
	                var totalPercent = 0,
	                    uploaded = 0;
	    
	                if (!file.blocks) {
	                    return;
	                }
	    
	                $.each( file.blocks, function( _, v ) {
	                    uploaded += (v.percentage || 0) * (v.end - v.start);
	                });
	    
	                totalPercent = uploaded / file.size;
	                this.owner.trigger( 'uploadProgress', file, totalPercent || 0 );
	            }
	    
	        });
	    });
	    /**
	     * @fileOverview 各种验证，包括文件总大小是否超出、单文件是否超出和文件是否重复。
	     */
	    
	    define('widgets/validator',[
	        'base',
	        'uploader',
	        'file',
	        'widgets/widget'
	    ], function( Base, Uploader, WUFile ) {
	    
	        var $ = Base.$,
	            validators = {},
	            api;
	    
	        /**
	         * @event error
	         * @param {String} type 错误类型。
	         * @description 当validate不通过时，会以派送错误事件的形式通知调用者。通过`upload.on('error', handler)`可以捕获到此类错误，目前有以下错误会在特定的情况下派送错来。
	         *
	         * * `Q_EXCEED_NUM_LIMIT` 在设置了`fileNumLimit`且尝试给`uploader`添加的文件数量超出这个值时派送。
	         * * `Q_EXCEED_SIZE_LIMIT` 在设置了`Q_EXCEED_SIZE_LIMIT`且尝试给`uploader`添加的文件总大小超出这个值时派送。
	         * * `Q_TYPE_DENIED` 当文件类型不满足时触发。。
	         * @for  Uploader
	         */
	    
	        // 暴露给外面的api
	        api = {
	    
	            // 添加验证器
	            addValidator: function( type, cb ) {
	                validators[ type ] = cb;
	            },
	    
	            // 移除验证器
	            removeValidator: function( type ) {
	                delete validators[ type ];
	            }
	        };
	    
	        // 在Uploader初始化的时候启动Validators的初始化
	        Uploader.register({
	            name: 'validator',
	    
	            init: function() {
	                var me = this;
	                Base.nextTick(function() {
	                    $.each( validators, function() {
	                        this.call( me.owner );
	                    });
	                });
	            }
	        });
	    
	        /**
	         * @property {int} [fileNumLimit=undefined]
	         * @namespace options
	         * @for Uploader
	         * @description 验证文件总数量, 超出则不允许加入队列。
	         */
	        api.addValidator( 'fileNumLimit', function() {
	            var uploader = this,
	                opts = uploader.options,
	                count = 0,
	                max = parseInt( opts.fileNumLimit, 10 ),
	                flag = true;
	    
	            if ( !max ) {
	                return;
	            }
	    
	            uploader.on( 'beforeFileQueued', function( file ) {
	    
	                if ( count >= max && flag ) {
	                    flag = false;
	                    this.trigger( 'error', 'Q_EXCEED_NUM_LIMIT', max, file );
	                    setTimeout(function() {
	                        flag = true;
	                    }, 1 );
	                }
	    
	                return count >= max ? false : true;
	            });
	    
	            uploader.on( 'fileQueued', function() {
	                count++;
	            });
	    
	            uploader.on( 'fileDequeued', function() {
	                count--;
	            });
	    
	            uploader.on( 'reset', function() {
	                count = 0;
	            });
	        });
	    
	    
	        /**
	         * @property {int} [fileSizeLimit=undefined]
	         * @namespace options
	         * @for Uploader
	         * @description 验证文件总大小是否超出限制, 超出则不允许加入队列。
	         */
	        api.addValidator( 'fileSizeLimit', function() {
	            var uploader = this,
	                opts = uploader.options,
	                count = 0,
	                max = parseInt( opts.fileSizeLimit, 10 ),
	                flag = true;
	    
	            if ( !max ) {
	                return;
	            }
	    
	            uploader.on( 'beforeFileQueued', function( file ) {
	                var invalid = count + file.size > max;
	    
	                if ( invalid && flag ) {
	                    flag = false;
	                    this.trigger( 'error', 'Q_EXCEED_SIZE_LIMIT', max, file );
	                    setTimeout(function() {
	                        flag = true;
	                    }, 1 );
	                }
	    
	                return invalid ? false : true;
	            });
	    
	            uploader.on( 'fileQueued', function( file ) {
	                count += file.size;
	            });
	    
	            uploader.on( 'fileDequeued', function( file ) {
	                count -= file.size;
	            });
	    
	            uploader.on( 'reset', function() {
	                count = 0;
	            });
	        });
	    
	        /**
	         * @property {int} [fileSingleSizeLimit=undefined]
	         * @namespace options
	         * @for Uploader
	         * @description 验证单个文件大小是否超出限制, 超出则不允许加入队列。
	         */
	        api.addValidator( 'fileSingleSizeLimit', function() {
	            var uploader = this,
	                opts = uploader.options,
	                max = opts.fileSingleSizeLimit;
	    
	            if ( !max ) {
	                return;
	            }
	    
	            uploader.on( 'beforeFileQueued', function( file ) {
	    
	                if ( file.size > max ) {
	                    file.setStatus( WUFile.Status.INVALID, 'exceed_size' );
	                    this.trigger( 'error', 'F_EXCEED_SIZE', max, file );
	                    return false;
	                }
	    
	            });
	    
	        });
	    
	        /**
	         * @property {Boolean} [duplicate=undefined]
	         * @namespace options
	         * @for Uploader
	         * @description 去重， 根据文件名字、文件大小和最后修改时间来生成hash Key.
	         */
	        api.addValidator( 'duplicate', function() {
	            var uploader = this,
	                opts = uploader.options,
	                mapping = {};
	    
	            if ( opts.duplicate ) {
	                return;
	            }
	    
	            function hashString( str ) {
	                var hash = 0,
	                    i = 0,
	                    len = str.length,
	                    _char;
	    
	                for ( ; i < len; i++ ) {
	                    _char = str.charCodeAt( i );
	                    hash = _char + (hash << 6) + (hash << 16) - hash;
	                }
	    
	                return hash;
	            }
	    
	            uploader.on( 'beforeFileQueued', function( file ) {
	                var hash = file.__hash || (file.__hash = hashString( file.name +
	                        file.size + file.lastModifiedDate ));
	    
	                // 已经重复了
	                if ( mapping[ hash ] ) {
	                    this.trigger( 'error', 'F_DUPLICATE', file );
	                    return false;
	                }
	            });
	    
	            uploader.on( 'fileQueued', function( file ) {
	                var hash = file.__hash;
	    
	                hash && (mapping[ hash ] = true);
	            });
	    
	            uploader.on( 'fileDequeued', function( file ) {
	                var hash = file.__hash;
	    
	                hash && (delete mapping[ hash ]);
	            });
	    
	            uploader.on( 'reset', function() {
	                mapping = {};
	            });
	        });
	    
	        return api;
	    });
	    
	    /**
	     * @fileOverview Md5
	     */
	    define('lib/md5',[
	        'runtime/client',
	        'mediator'
	    ], function( RuntimeClient, Mediator ) {
	    
	        function Md5() {
	            RuntimeClient.call( this, 'Md5' );
	        }
	    
	        // 让 Md5 具备事件功能。
	        Mediator.installTo( Md5.prototype );
	    
	        Md5.prototype.loadFromBlob = function( blob ) {
	            var me = this;
	    
	            if ( me.getRuid() ) {
	                me.disconnectRuntime();
	            }
	    
	            // 连接到blob归属的同一个runtime.
	            me.connectRuntime( blob.ruid, function() {
	                me.exec('init');
	                me.exec( 'loadFromBlob', blob );
	            });
	        };
	    
	        Md5.prototype.getResult = function() {
	            return this.exec('getResult');
	        };
	    
	        return Md5;
	    });
	    /**
	     * @fileOverview 图片操作, 负责预览图片和上传前压缩图片
	     */
	    define('widgets/md5',[
	        'base',
	        'uploader',
	        'lib/md5',
	        'lib/blob',
	        'widgets/widget'
	    ], function( Base, Uploader, Md5, Blob ) {
	    
	        return Uploader.register({
	            name: 'md5',
	    
	    
	            /**
	             * 计算文件 md5 值，返回一个 promise 对象，可以监听 progress 进度。
	             *
	             *
	             * @method md5File
	             * @grammar md5File( file[, start[, end]] ) => promise
	             * @for Uploader
	             * @example
	             *
	             * uploader.on( 'fileQueued', function( file ) {
	             *     var $li = ...;
	             *
	             *     uploader.md5File( file )
	             *
	             *         // 及时显示进度
	             *         .progress(function(percentage) {
	             *             console.log('Percentage:', percentage);
	             *         })
	             *
	             *         // 完成
	             *         .then(function(val) {
	             *             console.log('md5 result:', val);
	             *         });
	             *
	             * });
	             */
	            md5File: function( file, start, end ) {
	                var md5 = new Md5(),
	                    deferred = Base.Deferred(),
	                    blob = (file instanceof Blob) ? file :
	                        this.request( 'get-file', file ).source;
	    
	                md5.on( 'progress load', function( e ) {
	                    e = e || {};
	                    deferred.notify( e.total ? e.loaded / e.total : 1 );
	                });
	    
	                md5.on( 'complete', function() {
	                    deferred.resolve( md5.getResult() );
	                });
	    
	                md5.on( 'error', function( reason ) {
	                    deferred.reject( reason );
	                });
	    
	                if ( arguments.length > 1 ) {
	                    start = start || 0;
	                    end = end || 0;
	                    start < 0 && (start = blob.size + start);
	                    end < 0 && (end = blob.size + end);
	                    end = Math.min( end, blob.size );
	                    blob = blob.slice( start, end );
	                }
	    
	                md5.loadFromBlob( blob );
	    
	                return deferred.promise();
	            }
	        });
	    });
	    /**
	     * @fileOverview Runtime管理器，负责Runtime的选择, 连接
	     */
	    define('runtime/compbase',[],function() {
	    
	        function CompBase( owner, runtime ) {
	    
	            this.owner = owner;
	            this.options = owner.options;
	    
	            this.getRuntime = function() {
	                return runtime;
	            };
	    
	            this.getRuid = function() {
	                return runtime.uid;
	            };
	    
	            this.trigger = function() {
	                return owner.trigger.apply( owner, arguments );
	            };
	        }
	    
	        return CompBase;
	    });
	    /**
	     * @fileOverview Html5Runtime
	     */
	    define('runtime/html5/runtime',[
	        'base',
	        'runtime/runtime',
	        'runtime/compbase'
	    ], function( Base, Runtime, CompBase ) {
	    
	        var type = 'html5',
	            components = {};
	    
	        function Html5Runtime() {
	            var pool = {},
	                me = this,
	                destroy = this.destroy;
	    
	            Runtime.apply( me, arguments );
	            me.type = type;
	    
	    
	            // 这个方法的调用者，实际上是RuntimeClient
	            me.exec = function( comp, fn/*, args...*/) {
	                var client = this,
	                    uid = client.uid,
	                    args = Base.slice( arguments, 2 ),
	                    instance;
	    
	                if ( components[ comp ] ) {
	                    instance = pool[ uid ] = pool[ uid ] ||
	                            new components[ comp ]( client, me );
	    
	                    if ( instance[ fn ] ) {
	                        return instance[ fn ].apply( instance, args );
	                    }
	                }
	            };
	    
	            me.destroy = function() {
	                // @todo 删除池子中的所有实例
	                return destroy && destroy.apply( this, arguments );
	            };
	        }
	    
	        Base.inherits( Runtime, {
	            constructor: Html5Runtime,
	    
	            // 不需要连接其他程序，直接执行callback
	            init: function() {
	                var me = this;
	                setTimeout(function() {
	                    me.trigger('ready');
	                }, 1 );
	            }
	    
	        });
	    
	        // 注册Components
	        Html5Runtime.register = function( name, component ) {
	            var klass = components[ name ] = Base.inherits( CompBase, component );
	            return klass;
	        };
	    
	        // 注册html5运行时。
	        // 只有在支持的前提下注册。
	        if ( window.Blob && window.FileReader && window.DataView ) {
	            Runtime.addRuntime( type, Html5Runtime );
	        }
	    
	        return Html5Runtime;
	    });
	    /**
	     * @fileOverview Blob Html实现
	     */
	    define('runtime/html5/blob',[
	        'runtime/html5/runtime',
	        'lib/blob'
	    ], function( Html5Runtime, Blob ) {
	    
	        return Html5Runtime.register( 'Blob', {
	            slice: function( start, end ) {
	                var blob = this.owner.source,
	                    slice = blob.slice || blob.webkitSlice || blob.mozSlice;
	    
	                blob = slice.call( blob, start, end );
	    
	                return new Blob( this.getRuid(), blob );
	            }
	        });
	    });
	    /**
	     * @fileOverview FilePaste
	     */
	    define('runtime/html5/dnd',[
	        'base',
	        'runtime/html5/runtime',
	        'lib/file'
	    ], function( Base, Html5Runtime, File ) {
	    
	        var $ = Base.$,
	            prefix = 'webuploader-dnd-';
	    
	        return Html5Runtime.register( 'DragAndDrop', {
	            init: function() {
	                var elem = this.elem = this.options.container;
	    
	                this.dragEnterHandler = Base.bindFn( this._dragEnterHandler, this );
	                this.dragOverHandler = Base.bindFn( this._dragOverHandler, this );
	                this.dragLeaveHandler = Base.bindFn( this._dragLeaveHandler, this );
	                this.dropHandler = Base.bindFn( this._dropHandler, this );
	                this.dndOver = false;
	    
	                elem.on( 'dragenter', this.dragEnterHandler );
	                elem.on( 'dragover', this.dragOverHandler );
	                elem.on( 'dragleave', this.dragLeaveHandler );
	                elem.on( 'drop', this.dropHandler );
	    
	                if ( this.options.disableGlobalDnd ) {
	                    $( document ).on( 'dragover', this.dragOverHandler );
	                    $( document ).on( 'drop', this.dropHandler );
	                }
	            },
	    
	            _dragEnterHandler: function( e ) {
	                var me = this,
	                    denied = me._denied || false,
	                    items;
	    
	                e = e.originalEvent || e;
	    
	                if ( !me.dndOver ) {
	                    me.dndOver = true;
	    
	                    // 注意只有 chrome 支持。
	                    items = e.dataTransfer.items;
	    
	                    if ( items && items.length ) {
	                        me._denied = denied = !me.trigger( 'accept', items );
	                    }
	    
	                    me.elem.addClass( prefix + 'over' );
	                    me.elem[ denied ? 'addClass' :
	                            'removeClass' ]( prefix + 'denied' );
	                }
	    
	                e.dataTransfer.dropEffect = denied ? 'none' : 'copy';
	    
	                return false;
	            },
	    
	            _dragOverHandler: function( e ) {
	                // 只处理框内的。
	                var parentElem = this.elem.parent().get( 0 );
	                if ( parentElem && !$.contains( parentElem, e.currentTarget ) ) {
	                    return false;
	                }
	    
	                clearTimeout( this._leaveTimer );
	                this._dragEnterHandler.call( this, e );
	    
	                return false;
	            },
	    
	            _dragLeaveHandler: function() {
	                var me = this,
	                    handler;
	    
	                handler = function() {
	                    me.dndOver = false;
	                    me.elem.removeClass( prefix + 'over ' + prefix + 'denied' );
	                };
	    
	                clearTimeout( me._leaveTimer );
	                me._leaveTimer = setTimeout( handler, 100 );
	                return false;
	            },
	    
	            _dropHandler: function( e ) {
	                var me = this,
	                    ruid = me.getRuid(),
	                    parentElem = me.elem.parent().get( 0 ),
	                    dataTransfer, data;
	    
	                // 只处理框内的。
	                if ( parentElem && !$.contains( parentElem, e.currentTarget ) ) {
	                    return false;
	                }
	    
	                e = e.originalEvent || e;
	                dataTransfer = e.dataTransfer;
	    
	                // 如果是页面内拖拽，还不能处理，不阻止事件。
	                // 此处 ie11 下会报参数错误，
	                try {
	                    data = dataTransfer.getData('text/html');
	                } catch( err ) {
	                }
	    
	                if ( data ) {
	                    return;
	                }
	    
	                me._getTansferFiles( dataTransfer, function( results ) {
	                    me.trigger( 'drop', $.map( results, function( file ) {
	                        return new File( ruid, file );
	                    }) );
	                });
	    
	                me.dndOver = false;
	                me.elem.removeClass( prefix + 'over' );
	                return false;
	            },
	    
	            // 如果传入 callback 则去查看文件夹，否则只管当前文件夹。
	            _getTansferFiles: function( dataTransfer, callback ) {
	                var results  = [],
	                    promises = [],
	                    items, files, file, item, i, len, canAccessFolder;
	    
	                items = dataTransfer.items;
	                files = dataTransfer.files;
	    
	                canAccessFolder = !!(items && items[ 0 ].webkitGetAsEntry);
	    
	                for ( i = 0, len = files.length; i < len; i++ ) {
	                    file = files[ i ];
	                    item = items && items[ i ];
	    
	                    if ( canAccessFolder && item.webkitGetAsEntry().isDirectory ) {
	    
	                        promises.push( this._traverseDirectoryTree(
	                                item.webkitGetAsEntry(), results ) );
	                    } else {
	                        results.push( file );
	                    }
	                }
	    
	                Base.when.apply( Base, promises ).done(function() {
	    
	                    if ( !results.length ) {
	                        return;
	                    }
	    
	                    callback( results );
	                });
	            },
	    
	            _traverseDirectoryTree: function( entry, results ) {
	                var deferred = Base.Deferred(),
	                    me = this;
	    
	                if ( entry.isFile ) {
	                    entry.file(function( file ) {
	                        results.push( file );
	                        deferred.resolve();
	                    });
	                } else if ( entry.isDirectory ) {
	                    entry.createReader().readEntries(function( entries ) {
	                        var len = entries.length,
	                            promises = [],
	                            arr = [],    // 为了保证顺序。
	                            i;
	    
	                        for ( i = 0; i < len; i++ ) {
	                            promises.push( me._traverseDirectoryTree(
	                                    entries[ i ], arr ) );
	                        }
	    
	                        Base.when.apply( Base, promises ).then(function() {
	                            results.push.apply( results, arr );
	                            deferred.resolve();
	                        }, deferred.reject );
	                    });
	                }
	    
	                return deferred.promise();
	            },
	    
	            destroy: function() {
	                var elem = this.elem;
	    
	                // 还没 init 就调用 destroy
	                if (!elem) {
	                    return;
	                }
	                
	                elem.off( 'dragenter', this.dragEnterHandler );
	                elem.off( 'dragover', this.dragOverHandler );
	                elem.off( 'dragleave', this.dragLeaveHandler );
	                elem.off( 'drop', this.dropHandler );
	    
	                if ( this.options.disableGlobalDnd ) {
	                    $( document ).off( 'dragover', this.dragOverHandler );
	                    $( document ).off( 'drop', this.dropHandler );
	                }
	            }
	        });
	    });
	    
	    /**
	     * @fileOverview FilePaste
	     */
	    define('runtime/html5/filepaste',[
	        'base',
	        'runtime/html5/runtime',
	        'lib/file'
	    ], function( Base, Html5Runtime, File ) {
	    
	        return Html5Runtime.register( 'FilePaste', {
	            init: function() {
	                var opts = this.options,
	                    elem = this.elem = opts.container,
	                    accept = '.*',
	                    arr, i, len, item;
	    
	                // accetp的mimeTypes中生成匹配正则。
	                if ( opts.accept ) {
	                    arr = [];
	    
	                    for ( i = 0, len = opts.accept.length; i < len; i++ ) {
	                        item = opts.accept[ i ].mimeTypes;
	                        item && arr.push( item );
	                    }
	    
	                    if ( arr.length ) {
	                        accept = arr.join(',');
	                        accept = accept.replace( /,/g, '|' ).replace( /\*/g, '.*' );
	                    }
	                }
	                this.accept = accept = new RegExp( accept, 'i' );
	                this.hander = Base.bindFn( this._pasteHander, this );
	                elem.on( 'paste', this.hander );
	            },
	    
	            _pasteHander: function( e ) {
	                var allowed = [],
	                    ruid = this.getRuid(),
	                    items, item, blob, i, len;
	    
	                e = e.originalEvent || e;
	                items = e.clipboardData.items;
	    
	                for ( i = 0, len = items.length; i < len; i++ ) {
	                    item = items[ i ];
	    
	                    if ( item.kind !== 'file' || !(blob = item.getAsFile()) ) {
	                        continue;
	                    }
	    
	                    allowed.push( new File( ruid, blob ) );
	                }
	    
	                if ( allowed.length ) {
	                    // 不阻止非文件粘贴（文字粘贴）的事件冒泡
	                    e.preventDefault();
	                    e.stopPropagation();
	                    this.trigger( 'paste', allowed );
	                }
	            },
	    
	            destroy: function() {
	                this.elem.off( 'paste', this.hander );
	            }
	        });
	    });
	    
	    /**
	     * @fileOverview FilePicker
	     */
	    define('runtime/html5/filepicker',[
	        'base',
	        'runtime/html5/runtime'
	    ], function( Base, Html5Runtime ) {
	    
	        var $ = Base.$;
	    
	        return Html5Runtime.register( 'FilePicker', {
	            init: function() {
	                var container = this.getRuntime().getContainer(),
	                    me = this,
	                    owner = me.owner,
	                    opts = me.options,
	                    label = this.label = $( document.createElement('label') ),
	                    input =  this.input = $( document.createElement('input') ),
	                    arr, i, len, mouseHandler;
	    
	                input.attr( 'type', 'file' );
	                input.attr( 'name', opts.name );
	                input.addClass('webuploader-element-invisible');
	    
	                label.on( 'click', function() {
	                    input.trigger('click');
	                });
	    
	                label.css({
	                    opacity: 0,
	                    width: '100%',
	                    height: '100%',
	                    display: 'block',
	                    cursor: 'pointer',
	                    background: '#ffffff'
	                });
	    
	                if ( opts.multiple ) {
	                    input.attr( 'multiple', 'multiple' );
	                }
	    
	                // @todo Firefox不支持单独指定后缀
	                if ( opts.accept && opts.accept.length > 0 ) {
	                    arr = [];
	    
	                    for ( i = 0, len = opts.accept.length; i < len; i++ ) {
	                        arr.push( opts.accept[ i ].mimeTypes );
	                    }
	    
	                    input.attr( 'accept', arr.join(',') );
	                }
	    
	                container.append( input );
	                container.append( label );
	    
	                mouseHandler = function( e ) {
	                    owner.trigger( e.type );
	                };
	    
	                input.on( 'change', function( e ) {
	                    var fn = arguments.callee,
	                        clone;
	    
	                    me.files = e.target.files;
	    
	                    // reset input
	                    clone = this.cloneNode( true );
	                    clone.value = null;
	                    this.parentNode.replaceChild( clone, this );
	    
	                    input.off();
	                    input = $( clone ).on( 'change', fn )
	                            .on( 'mouseenter mouseleave', mouseHandler );
	    
	                    owner.trigger('change');
	                });
	    
	                label.on( 'mouseenter mouseleave', mouseHandler );
	    
	            },
	    
	    
	            getFiles: function() {
	                return this.files;
	            },
	    
	            destroy: function() {
	                this.input.off();
	                this.label.off();
	            }
	        });
	    });
	    /**
	     * Terms:
	     *
	     * Uint8Array, FileReader, BlobBuilder, atob, ArrayBuffer
	     * @fileOverview Image控件
	     */
	    define('runtime/html5/util',[
	        'base'
	    ], function( Base ) {
	    
	        var urlAPI = window.createObjectURL && window ||
	                window.URL && URL.revokeObjectURL && URL ||
	                window.webkitURL,
	            createObjectURL = Base.noop,
	            revokeObjectURL = createObjectURL;
	    
	        if ( urlAPI ) {
	    
	            // 更安全的方式调用，比如android里面就能把context改成其他的对象。
	            createObjectURL = function() {
	                return urlAPI.createObjectURL.apply( urlAPI, arguments );
	            };
	    
	            revokeObjectURL = function() {
	                return urlAPI.revokeObjectURL.apply( urlAPI, arguments );
	            };
	        }
	    
	        return {
	            createObjectURL: createObjectURL,
	            revokeObjectURL: revokeObjectURL,
	    
	            dataURL2Blob: function( dataURI ) {
	                var byteStr, intArray, ab, i, mimetype, parts;
	    
	                parts = dataURI.split(',');
	    
	                if ( ~parts[ 0 ].indexOf('base64') ) {
	                    byteStr = atob( parts[ 1 ] );
	                } else {
	                    byteStr = decodeURIComponent( parts[ 1 ] );
	                }
	    
	                ab = new ArrayBuffer( byteStr.length );
	                intArray = new Uint8Array( ab );
	    
	                for ( i = 0; i < byteStr.length; i++ ) {
	                    intArray[ i ] = byteStr.charCodeAt( i );
	                }
	    
	                mimetype = parts[ 0 ].split(':')[ 1 ].split(';')[ 0 ];
	    
	                return this.arrayBufferToBlob( ab, mimetype );
	            },
	    
	            dataURL2ArrayBuffer: function( dataURI ) {
	                var byteStr, intArray, i, parts;
	    
	                parts = dataURI.split(',');
	    
	                if ( ~parts[ 0 ].indexOf('base64') ) {
	                    byteStr = atob( parts[ 1 ] );
	                } else {
	                    byteStr = decodeURIComponent( parts[ 1 ] );
	                }
	    
	                intArray = new Uint8Array( byteStr.length );
	    
	                for ( i = 0; i < byteStr.length; i++ ) {
	                    intArray[ i ] = byteStr.charCodeAt( i );
	                }
	    
	                return intArray.buffer;
	            },
	    
	            arrayBufferToBlob: function( buffer, type ) {
	                var builder = window.BlobBuilder || window.WebKitBlobBuilder,
	                    bb;
	    
	                // android不支持直接new Blob, 只能借助blobbuilder.
	                if ( builder ) {
	                    bb = new builder();
	                    bb.append( buffer );
	                    return bb.getBlob( type );
	                }
	    
	                return new Blob([ buffer ], type ? { type: type } : {} );
	            },
	    
	            // 抽出来主要是为了解决android下面canvas.toDataUrl不支持jpeg.
	            // 你得到的结果是png.
	            canvasToDataUrl: function( canvas, type, quality ) {
	                return canvas.toDataURL( type, quality / 100 );
	            },
	    
	            // imagemeat会复写这个方法，如果用户选择加载那个文件了的话。
	            parseMeta: function( blob, callback ) {
	                callback( false, {});
	            },
	    
	            // imagemeat会复写这个方法，如果用户选择加载那个文件了的话。
	            updateImageHead: function( data ) {
	                return data;
	            }
	        };
	    });
	    /**
	     * Terms:
	     *
	     * Uint8Array, FileReader, BlobBuilder, atob, ArrayBuffer
	     * @fileOverview Image控件
	     */
	    define('runtime/html5/imagemeta',[
	        'runtime/html5/util'
	    ], function( Util ) {
	    
	        var api;
	    
	        api = {
	            parsers: {
	                0xffe1: []
	            },
	    
	            maxMetaDataSize: 262144,
	    
	            parse: function( blob, cb ) {
	                var me = this,
	                    fr = new FileReader();
	    
	                fr.onload = function() {
	                    cb( false, me._parse( this.result ) );
	                    fr = fr.onload = fr.onerror = null;
	                };
	    
	                fr.onerror = function( e ) {
	                    cb( e.message );
	                    fr = fr.onload = fr.onerror = null;
	                };
	    
	                blob = blob.slice( 0, me.maxMetaDataSize );
	                fr.readAsArrayBuffer( blob.getSource() );
	            },
	    
	            _parse: function( buffer, noParse ) {
	                if ( buffer.byteLength < 6 ) {
	                    return;
	                }
	    
	                var dataview = new DataView( buffer ),
	                    offset = 2,
	                    maxOffset = dataview.byteLength - 4,
	                    headLength = offset,
	                    ret = {},
	                    markerBytes, markerLength, parsers, i;
	    
	                if ( dataview.getUint16( 0 ) === 0xffd8 ) {
	    
	                    while ( offset < maxOffset ) {
	                        markerBytes = dataview.getUint16( offset );
	    
	                        if ( markerBytes >= 0xffe0 && markerBytes <= 0xffef ||
	                                markerBytes === 0xfffe ) {
	    
	                            markerLength = dataview.getUint16( offset + 2 ) + 2;
	    
	                            if ( offset + markerLength > dataview.byteLength ) {
	                                break;
	                            }
	    
	                            parsers = api.parsers[ markerBytes ];
	    
	                            if ( !noParse && parsers ) {
	                                for ( i = 0; i < parsers.length; i += 1 ) {
	                                    parsers[ i ].call( api, dataview, offset,
	                                            markerLength, ret );
	                                }
	                            }
	    
	                            offset += markerLength;
	                            headLength = offset;
	                        } else {
	                            break;
	                        }
	                    }
	    
	                    if ( headLength > 6 ) {
	                        if ( buffer.slice ) {
	                            ret.imageHead = buffer.slice( 2, headLength );
	                        } else {
	                            // Workaround for IE10, which does not yet
	                            // support ArrayBuffer.slice:
	                            ret.imageHead = new Uint8Array( buffer )
	                                    .subarray( 2, headLength );
	                        }
	                    }
	                }
	    
	                return ret;
	            },
	    
	            updateImageHead: function( buffer, head ) {
	                var data = this._parse( buffer, true ),
	                    buf1, buf2, bodyoffset;
	    
	    
	                bodyoffset = 2;
	                if ( data.imageHead ) {
	                    bodyoffset = 2 + data.imageHead.byteLength;
	                }
	    
	                if ( buffer.slice ) {
	                    buf2 = buffer.slice( bodyoffset );
	                } else {
	                    buf2 = new Uint8Array( buffer ).subarray( bodyoffset );
	                }
	    
	                buf1 = new Uint8Array( head.byteLength + 2 + buf2.byteLength );
	    
	                buf1[ 0 ] = 0xFF;
	                buf1[ 1 ] = 0xD8;
	                buf1.set( new Uint8Array( head ), 2 );
	                buf1.set( new Uint8Array( buf2 ), head.byteLength + 2 );
	    
	                return buf1.buffer;
	            }
	        };
	    
	        Util.parseMeta = function() {
	            return api.parse.apply( api, arguments );
	        };
	    
	        Util.updateImageHead = function() {
	            return api.updateImageHead.apply( api, arguments );
	        };
	    
	        return api;
	    });
	    /**
	     * 代码来自于：https://github.com/blueimp/JavaScript-Load-Image
	     * 暂时项目中只用了orientation.
	     *
	     * 去除了 Exif Sub IFD Pointer, GPS Info IFD Pointer, Exif Thumbnail.
	     * @fileOverview EXIF解析
	     */
	    
	    // Sample
	    // ====================================
	    // Make : Apple
	    // Model : iPhone 4S
	    // Orientation : 1
	    // XResolution : 72 [72/1]
	    // YResolution : 72 [72/1]
	    // ResolutionUnit : 2
	    // Software : QuickTime 7.7.1
	    // DateTime : 2013:09:01 22:53:55
	    // ExifIFDPointer : 190
	    // ExposureTime : 0.058823529411764705 [1/17]
	    // FNumber : 2.4 [12/5]
	    // ExposureProgram : Normal program
	    // ISOSpeedRatings : 800
	    // ExifVersion : 0220
	    // DateTimeOriginal : 2013:09:01 22:52:51
	    // DateTimeDigitized : 2013:09:01 22:52:51
	    // ComponentsConfiguration : YCbCr
	    // ShutterSpeedValue : 4.058893515764426
	    // ApertureValue : 2.5260688216892597 [4845/1918]
	    // BrightnessValue : -0.3126686601998395
	    // MeteringMode : Pattern
	    // Flash : Flash did not fire, compulsory flash mode
	    // FocalLength : 4.28 [107/25]
	    // SubjectArea : [4 values]
	    // FlashpixVersion : 0100
	    // ColorSpace : 1
	    // PixelXDimension : 2448
	    // PixelYDimension : 3264
	    // SensingMethod : One-chip color area sensor
	    // ExposureMode : 0
	    // WhiteBalance : Auto white balance
	    // FocalLengthIn35mmFilm : 35
	    // SceneCaptureType : Standard
	    define('runtime/html5/imagemeta/exif',[
	        'base',
	        'runtime/html5/imagemeta'
	    ], function( Base, ImageMeta ) {
	    
	        var EXIF = {};
	    
	        EXIF.ExifMap = function() {
	            return this;
	        };
	    
	        EXIF.ExifMap.prototype.map = {
	            'Orientation': 0x0112
	        };
	    
	        EXIF.ExifMap.prototype.get = function( id ) {
	            return this[ id ] || this[ this.map[ id ] ];
	        };
	    
	        EXIF.exifTagTypes = {
	            // byte, 8-bit unsigned int:
	            1: {
	                getValue: function( dataView, dataOffset ) {
	                    return dataView.getUint8( dataOffset );
	                },
	                size: 1
	            },
	    
	            // ascii, 8-bit byte:
	            2: {
	                getValue: function( dataView, dataOffset ) {
	                    return String.fromCharCode( dataView.getUint8( dataOffset ) );
	                },
	                size: 1,
	                ascii: true
	            },
	    
	            // short, 16 bit int:
	            3: {
	                getValue: function( dataView, dataOffset, littleEndian ) {
	                    return dataView.getUint16( dataOffset, littleEndian );
	                },
	                size: 2
	            },
	    
	            // long, 32 bit int:
	            4: {
	                getValue: function( dataView, dataOffset, littleEndian ) {
	                    return dataView.getUint32( dataOffset, littleEndian );
	                },
	                size: 4
	            },
	    
	            // rational = two long values,
	            // first is numerator, second is denominator:
	            5: {
	                getValue: function( dataView, dataOffset, littleEndian ) {
	                    return dataView.getUint32( dataOffset, littleEndian ) /
	                        dataView.getUint32( dataOffset + 4, littleEndian );
	                },
	                size: 8
	            },
	    
	            // slong, 32 bit signed int:
	            9: {
	                getValue: function( dataView, dataOffset, littleEndian ) {
	                    return dataView.getInt32( dataOffset, littleEndian );
	                },
	                size: 4
	            },
	    
	            // srational, two slongs, first is numerator, second is denominator:
	            10: {
	                getValue: function( dataView, dataOffset, littleEndian ) {
	                    return dataView.getInt32( dataOffset, littleEndian ) /
	                        dataView.getInt32( dataOffset + 4, littleEndian );
	                },
	                size: 8
	            }
	        };
	    
	        // undefined, 8-bit byte, value depending on field:
	        EXIF.exifTagTypes[ 7 ] = EXIF.exifTagTypes[ 1 ];
	    
	        EXIF.getExifValue = function( dataView, tiffOffset, offset, type, length,
	                littleEndian ) {
	    
	            var tagType = EXIF.exifTagTypes[ type ],
	                tagSize, dataOffset, values, i, str, c;
	    
	            if ( !tagType ) {
	                Base.log('Invalid Exif data: Invalid tag type.');
	                return;
	            }
	    
	            tagSize = tagType.size * length;
	    
	            // Determine if the value is contained in the dataOffset bytes,
	            // or if the value at the dataOffset is a pointer to the actual data:
	            dataOffset = tagSize > 4 ? tiffOffset + dataView.getUint32( offset + 8,
	                    littleEndian ) : (offset + 8);
	    
	            if ( dataOffset + tagSize > dataView.byteLength ) {
	                Base.log('Invalid Exif data: Invalid data offset.');
	                return;
	            }
	    
	            if ( length === 1 ) {
	                return tagType.getValue( dataView, dataOffset, littleEndian );
	            }
	    
	            values = [];
	    
	            for ( i = 0; i < length; i += 1 ) {
	                values[ i ] = tagType.getValue( dataView,
	                        dataOffset + i * tagType.size, littleEndian );
	            }
	    
	            if ( tagType.ascii ) {
	                str = '';
	    
	                // Concatenate the chars:
	                for ( i = 0; i < values.length; i += 1 ) {
	                    c = values[ i ];
	    
	                    // Ignore the terminating NULL byte(s):
	                    if ( c === '\u0000' ) {
	                        break;
	                    }
	                    str += c;
	                }
	    
	                return str;
	            }
	            return values;
	        };
	    
	        EXIF.parseExifTag = function( dataView, tiffOffset, offset, littleEndian,
	                data ) {
	    
	            var tag = dataView.getUint16( offset, littleEndian );
	            data.exif[ tag ] = EXIF.getExifValue( dataView, tiffOffset, offset,
	                    dataView.getUint16( offset + 2, littleEndian ),    // tag type
	                    dataView.getUint32( offset + 4, littleEndian ),    // tag length
	                    littleEndian );
	        };
	    
	        EXIF.parseExifTags = function( dataView, tiffOffset, dirOffset,
	                littleEndian, data ) {
	    
	            var tagsNumber, dirEndOffset, i;
	    
	            if ( dirOffset + 6 > dataView.byteLength ) {
	                Base.log('Invalid Exif data: Invalid directory offset.');
	                return;
	            }
	    
	            tagsNumber = dataView.getUint16( dirOffset, littleEndian );
	            dirEndOffset = dirOffset + 2 + 12 * tagsNumber;
	    
	            if ( dirEndOffset + 4 > dataView.byteLength ) {
	                Base.log('Invalid Exif data: Invalid directory size.');
	                return;
	            }
	    
	            for ( i = 0; i < tagsNumber; i += 1 ) {
	                this.parseExifTag( dataView, tiffOffset,
	                        dirOffset + 2 + 12 * i,    // tag offset
	                        littleEndian, data );
	            }
	    
	            // Return the offset to the next directory:
	            return dataView.getUint32( dirEndOffset, littleEndian );
	        };
	    
	        // EXIF.getExifThumbnail = function(dataView, offset, length) {
	        //     var hexData,
	        //         i,
	        //         b;
	        //     if (!length || offset + length > dataView.byteLength) {
	        //         Base.log('Invalid Exif data: Invalid thumbnail data.');
	        //         return;
	        //     }
	        //     hexData = [];
	        //     for (i = 0; i < length; i += 1) {
	        //         b = dataView.getUint8(offset + i);
	        //         hexData.push((b < 16 ? '0' : '') + b.toString(16));
	        //     }
	        //     return 'data:image/jpeg,%' + hexData.join('%');
	        // };
	    
	        EXIF.parseExifData = function( dataView, offset, length, data ) {
	    
	            var tiffOffset = offset + 10,
	                littleEndian, dirOffset;
	    
	            // Check for the ASCII code for "Exif" (0x45786966):
	            if ( dataView.getUint32( offset + 4 ) !== 0x45786966 ) {
	                // No Exif data, might be XMP data instead
	                return;
	            }
	            if ( tiffOffset + 8 > dataView.byteLength ) {
	                Base.log('Invalid Exif data: Invalid segment size.');
	                return;
	            }
	    
	            // Check for the two null bytes:
	            if ( dataView.getUint16( offset + 8 ) !== 0x0000 ) {
	                Base.log('Invalid Exif data: Missing byte alignment offset.');
	                return;
	            }
	    
	            // Check the byte alignment:
	            switch ( dataView.getUint16( tiffOffset ) ) {
	                case 0x4949:
	                    littleEndian = true;
	                    break;
	    
	                case 0x4D4D:
	                    littleEndian = false;
	                    break;
	    
	                default:
	                    Base.log('Invalid Exif data: Invalid byte alignment marker.');
	                    return;
	            }
	    
	            // Check for the TIFF tag marker (0x002A):
	            if ( dataView.getUint16( tiffOffset + 2, littleEndian ) !== 0x002A ) {
	                Base.log('Invalid Exif data: Missing TIFF marker.');
	                return;
	            }
	    
	            // Retrieve the directory offset bytes, usually 0x00000008 or 8 decimal:
	            dirOffset = dataView.getUint32( tiffOffset + 4, littleEndian );
	            // Create the exif object to store the tags:
	            data.exif = new EXIF.ExifMap();
	            // Parse the tags of the main image directory and retrieve the
	            // offset to the next directory, usually the thumbnail directory:
	            dirOffset = EXIF.parseExifTags( dataView, tiffOffset,
	                    tiffOffset + dirOffset, littleEndian, data );
	    
	            // 尝试读取缩略图
	            // if ( dirOffset ) {
	            //     thumbnailData = {exif: {}};
	            //     dirOffset = EXIF.parseExifTags(
	            //         dataView,
	            //         tiffOffset,
	            //         tiffOffset + dirOffset,
	            //         littleEndian,
	            //         thumbnailData
	            //     );
	    
	            //     // Check for JPEG Thumbnail offset:
	            //     if (thumbnailData.exif[0x0201]) {
	            //         data.exif.Thumbnail = EXIF.getExifThumbnail(
	            //             dataView,
	            //             tiffOffset + thumbnailData.exif[0x0201],
	            //             thumbnailData.exif[0x0202] // Thumbnail data length
	            //         );
	            //     }
	            // }
	        };
	    
	        ImageMeta.parsers[ 0xffe1 ].push( EXIF.parseExifData );
	        return EXIF;
	    });
	    /**
	     * 这个方式性能不行，但是可以解决android里面的toDataUrl的bug
	     * android里面toDataUrl('image/jpege')得到的结果却是png.
	     *
	     * 所以这里没辙，只能借助这个工具
	     * @fileOverview jpeg encoder
	     */
	    define('runtime/html5/jpegencoder',[], function( require, exports, module ) {
	    
	        /*
	          Copyright (c) 2008, Adobe Systems Incorporated
	          All rights reserved.
	    
	          Redistribution and use in source and binary forms, with or without
	          modification, are permitted provided that the following conditions are
	          met:
	    
	          * Redistributions of source code must retain the above copyright notice,
	            this list of conditions and the following disclaimer.
	    
	          * Redistributions in binary form must reproduce the above copyright
	            notice, this list of conditions and the following disclaimer in the
	            documentation and/or other materials provided with the distribution.
	    
	          * Neither the name of Adobe Systems Incorporated nor the names of its
	            contributors may be used to endorse or promote products derived from
	            this software without specific prior written permission.
	    
	          THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
	          IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
	          THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
	          PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
	          CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	          EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
	          PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
	          PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	          LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	          NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	          SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	        */
	        /*
	        JPEG encoder ported to JavaScript and optimized by Andreas Ritter, www.bytestrom.eu, 11/2009
	    
	        Basic GUI blocking jpeg encoder
	        */
	    
	        function JPEGEncoder(quality) {
	          var self = this;
	            var fround = Math.round;
	            var ffloor = Math.floor;
	            var YTable = new Array(64);
	            var UVTable = new Array(64);
	            var fdtbl_Y = new Array(64);
	            var fdtbl_UV = new Array(64);
	            var YDC_HT;
	            var UVDC_HT;
	            var YAC_HT;
	            var UVAC_HT;
	    
	            var bitcode = new Array(65535);
	            var category = new Array(65535);
	            var outputfDCTQuant = new Array(64);
	            var DU = new Array(64);
	            var byteout = [];
	            var bytenew = 0;
	            var bytepos = 7;
	    
	            var YDU = new Array(64);
	            var UDU = new Array(64);
	            var VDU = new Array(64);
	            var clt = new Array(256);
	            var RGB_YUV_TABLE = new Array(2048);
	            var currentQuality;
	    
	            var ZigZag = [
	                     0, 1, 5, 6,14,15,27,28,
	                     2, 4, 7,13,16,26,29,42,
	                     3, 8,12,17,25,30,41,43,
	                     9,11,18,24,31,40,44,53,
	                    10,19,23,32,39,45,52,54,
	                    20,22,33,38,46,51,55,60,
	                    21,34,37,47,50,56,59,61,
	                    35,36,48,49,57,58,62,63
	                ];
	    
	            var std_dc_luminance_nrcodes = [0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0];
	            var std_dc_luminance_values = [0,1,2,3,4,5,6,7,8,9,10,11];
	            var std_ac_luminance_nrcodes = [0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,0x7d];
	            var std_ac_luminance_values = [
	                    0x01,0x02,0x03,0x00,0x04,0x11,0x05,0x12,
	                    0x21,0x31,0x41,0x06,0x13,0x51,0x61,0x07,
	                    0x22,0x71,0x14,0x32,0x81,0x91,0xa1,0x08,
	                    0x23,0x42,0xb1,0xc1,0x15,0x52,0xd1,0xf0,
	                    0x24,0x33,0x62,0x72,0x82,0x09,0x0a,0x16,
	                    0x17,0x18,0x19,0x1a,0x25,0x26,0x27,0x28,
	                    0x29,0x2a,0x34,0x35,0x36,0x37,0x38,0x39,
	                    0x3a,0x43,0x44,0x45,0x46,0x47,0x48,0x49,
	                    0x4a,0x53,0x54,0x55,0x56,0x57,0x58,0x59,
	                    0x5a,0x63,0x64,0x65,0x66,0x67,0x68,0x69,
	                    0x6a,0x73,0x74,0x75,0x76,0x77,0x78,0x79,
	                    0x7a,0x83,0x84,0x85,0x86,0x87,0x88,0x89,
	                    0x8a,0x92,0x93,0x94,0x95,0x96,0x97,0x98,
	                    0x99,0x9a,0xa2,0xa3,0xa4,0xa5,0xa6,0xa7,
	                    0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,0xb5,0xb6,
	                    0xb7,0xb8,0xb9,0xba,0xc2,0xc3,0xc4,0xc5,
	                    0xc6,0xc7,0xc8,0xc9,0xca,0xd2,0xd3,0xd4,
	                    0xd5,0xd6,0xd7,0xd8,0xd9,0xda,0xe1,0xe2,
	                    0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,0xea,
	                    0xf1,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
	                    0xf9,0xfa
	                ];
	    
	            var std_dc_chrominance_nrcodes = [0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0];
	            var std_dc_chrominance_values = [0,1,2,3,4,5,6,7,8,9,10,11];
	            var std_ac_chrominance_nrcodes = [0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,0x77];
	            var std_ac_chrominance_values = [
	                    0x00,0x01,0x02,0x03,0x11,0x04,0x05,0x21,
	                    0x31,0x06,0x12,0x41,0x51,0x07,0x61,0x71,
	                    0x13,0x22,0x32,0x81,0x08,0x14,0x42,0x91,
	                    0xa1,0xb1,0xc1,0x09,0x23,0x33,0x52,0xf0,
	                    0x15,0x62,0x72,0xd1,0x0a,0x16,0x24,0x34,
	                    0xe1,0x25,0xf1,0x17,0x18,0x19,0x1a,0x26,
	                    0x27,0x28,0x29,0x2a,0x35,0x36,0x37,0x38,
	                    0x39,0x3a,0x43,0x44,0x45,0x46,0x47,0x48,
	                    0x49,0x4a,0x53,0x54,0x55,0x56,0x57,0x58,
	                    0x59,0x5a,0x63,0x64,0x65,0x66,0x67,0x68,
	                    0x69,0x6a,0x73,0x74,0x75,0x76,0x77,0x78,
	                    0x79,0x7a,0x82,0x83,0x84,0x85,0x86,0x87,
	                    0x88,0x89,0x8a,0x92,0x93,0x94,0x95,0x96,
	                    0x97,0x98,0x99,0x9a,0xa2,0xa3,0xa4,0xa5,
	                    0xa6,0xa7,0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,
	                    0xb5,0xb6,0xb7,0xb8,0xb9,0xba,0xc2,0xc3,
	                    0xc4,0xc5,0xc6,0xc7,0xc8,0xc9,0xca,0xd2,
	                    0xd3,0xd4,0xd5,0xd6,0xd7,0xd8,0xd9,0xda,
	                    0xe2,0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,
	                    0xea,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
	                    0xf9,0xfa
	                ];
	    
	            function initQuantTables(sf){
	                    var YQT = [
	                        16, 11, 10, 16, 24, 40, 51, 61,
	                        12, 12, 14, 19, 26, 58, 60, 55,
	                        14, 13, 16, 24, 40, 57, 69, 56,
	                        14, 17, 22, 29, 51, 87, 80, 62,
	                        18, 22, 37, 56, 68,109,103, 77,
	                        24, 35, 55, 64, 81,104,113, 92,
	                        49, 64, 78, 87,103,121,120,101,
	                        72, 92, 95, 98,112,100,103, 99
	                    ];
	    
	                    for (var i = 0; i < 64; i++) {
	                        var t = ffloor((YQT[i]*sf+50)/100);
	                        if (t < 1) {
	                            t = 1;
	                        } else if (t > 255) {
	                            t = 255;
	                        }
	                        YTable[ZigZag[i]] = t;
	                    }
	                    var UVQT = [
	                        17, 18, 24, 47, 99, 99, 99, 99,
	                        18, 21, 26, 66, 99, 99, 99, 99,
	                        24, 26, 56, 99, 99, 99, 99, 99,
	                        47, 66, 99, 99, 99, 99, 99, 99,
	                        99, 99, 99, 99, 99, 99, 99, 99,
	                        99, 99, 99, 99, 99, 99, 99, 99,
	                        99, 99, 99, 99, 99, 99, 99, 99,
	                        99, 99, 99, 99, 99, 99, 99, 99
	                    ];
	                    for (var j = 0; j < 64; j++) {
	                        var u = ffloor((UVQT[j]*sf+50)/100);
	                        if (u < 1) {
	                            u = 1;
	                        } else if (u > 255) {
	                            u = 255;
	                        }
	                        UVTable[ZigZag[j]] = u;
	                    }
	                    var aasf = [
	                        1.0, 1.387039845, 1.306562965, 1.175875602,
	                        1.0, 0.785694958, 0.541196100, 0.275899379
	                    ];
	                    var k = 0;
	                    for (var row = 0; row < 8; row++)
	                    {
	                        for (var col = 0; col < 8; col++)
	                        {
	                            fdtbl_Y[k]  = (1.0 / (YTable [ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
	                            fdtbl_UV[k] = (1.0 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
	                            k++;
	                        }
	                    }
	                }
	    
	                function computeHuffmanTbl(nrcodes, std_table){
	                    var codevalue = 0;
	                    var pos_in_table = 0;
	                    var HT = new Array();
	                    for (var k = 1; k <= 16; k++) {
	                        for (var j = 1; j <= nrcodes[k]; j++) {
	                            HT[std_table[pos_in_table]] = [];
	                            HT[std_table[pos_in_table]][0] = codevalue;
	                            HT[std_table[pos_in_table]][1] = k;
	                            pos_in_table++;
	                            codevalue++;
	                        }
	                        codevalue*=2;
	                    }
	                    return HT;
	                }
	    
	                function initHuffmanTbl()
	                {
	                    YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes,std_dc_luminance_values);
	                    UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes,std_dc_chrominance_values);
	                    YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes,std_ac_luminance_values);
	                    UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes,std_ac_chrominance_values);
	                }
	    
	                function initCategoryNumber()
	                {
	                    var nrlower = 1;
	                    var nrupper = 2;
	                    for (var cat = 1; cat <= 15; cat++) {
	                        //Positive numbers
	                        for (var nr = nrlower; nr<nrupper; nr++) {
	                            category[32767+nr] = cat;
	                            bitcode[32767+nr] = [];
	                            bitcode[32767+nr][1] = cat;
	                            bitcode[32767+nr][0] = nr;
	                        }
	                        //Negative numbers
	                        for (var nrneg =-(nrupper-1); nrneg<=-nrlower; nrneg++) {
	                            category[32767+nrneg] = cat;
	                            bitcode[32767+nrneg] = [];
	                            bitcode[32767+nrneg][1] = cat;
	                            bitcode[32767+nrneg][0] = nrupper-1+nrneg;
	                        }
	                        nrlower <<= 1;
	                        nrupper <<= 1;
	                    }
	                }
	    
	                function initRGBYUVTable() {
	                    for(var i = 0; i < 256;i++) {
	                        RGB_YUV_TABLE[i]            =  19595 * i;
	                        RGB_YUV_TABLE[(i+ 256)>>0]  =  38470 * i;
	                        RGB_YUV_TABLE[(i+ 512)>>0]  =   7471 * i + 0x8000;
	                        RGB_YUV_TABLE[(i+ 768)>>0]  = -11059 * i;
	                        RGB_YUV_TABLE[(i+1024)>>0]  = -21709 * i;
	                        RGB_YUV_TABLE[(i+1280)>>0]  =  32768 * i + 0x807FFF;
	                        RGB_YUV_TABLE[(i+1536)>>0]  = -27439 * i;
	                        RGB_YUV_TABLE[(i+1792)>>0]  = - 5329 * i;
	                    }
	                }
	    
	                // IO functions
	                function writeBits(bs)
	                {
	                    var value = bs[0];
	                    var posval = bs[1]-1;
	                    while ( posval >= 0 ) {
	                        if (value & (1 << posval) ) {
	                            bytenew |= (1 << bytepos);
	                        }
	                        posval--;
	                        bytepos--;
	                        if (bytepos < 0) {
	                            if (bytenew == 0xFF) {
	                                writeByte(0xFF);
	                                writeByte(0);
	                            }
	                            else {
	                                writeByte(bytenew);
	                            }
	                            bytepos=7;
	                            bytenew=0;
	                        }
	                    }
	                }
	    
	                function writeByte(value)
	                {
	                    byteout.push(clt[value]); // write char directly instead of converting later
	                }
	    
	                function writeWord(value)
	                {
	                    writeByte((value>>8)&0xFF);
	                    writeByte((value   )&0xFF);
	                }
	    
	                // DCT & quantization core
	                function fDCTQuant(data, fdtbl)
	                {
	                    var d0, d1, d2, d3, d4, d5, d6, d7;
	                    /* Pass 1: process rows. */
	                    var dataOff=0;
	                    var i;
	                    var I8 = 8;
	                    var I64 = 64;
	                    for (i=0; i<I8; ++i)
	                    {
	                        d0 = data[dataOff];
	                        d1 = data[dataOff+1];
	                        d2 = data[dataOff+2];
	                        d3 = data[dataOff+3];
	                        d4 = data[dataOff+4];
	                        d5 = data[dataOff+5];
	                        d6 = data[dataOff+6];
	                        d7 = data[dataOff+7];
	    
	                        var tmp0 = d0 + d7;
	                        var tmp7 = d0 - d7;
	                        var tmp1 = d1 + d6;
	                        var tmp6 = d1 - d6;
	                        var tmp2 = d2 + d5;
	                        var tmp5 = d2 - d5;
	                        var tmp3 = d3 + d4;
	                        var tmp4 = d3 - d4;
	    
	                        /* Even part */
	                        var tmp10 = tmp0 + tmp3;    /* phase 2 */
	                        var tmp13 = tmp0 - tmp3;
	                        var tmp11 = tmp1 + tmp2;
	                        var tmp12 = tmp1 - tmp2;
	    
	                        data[dataOff] = tmp10 + tmp11; /* phase 3 */
	                        data[dataOff+4] = tmp10 - tmp11;
	    
	                        var z1 = (tmp12 + tmp13) * 0.707106781; /* c4 */
	                        data[dataOff+2] = tmp13 + z1; /* phase 5 */
	                        data[dataOff+6] = tmp13 - z1;
	    
	                        /* Odd part */
	                        tmp10 = tmp4 + tmp5; /* phase 2 */
	                        tmp11 = tmp5 + tmp6;
	                        tmp12 = tmp6 + tmp7;
	    
	                        /* The rotator is modified from fig 4-8 to avoid extra negations. */
	                        var z5 = (tmp10 - tmp12) * 0.382683433; /* c6 */
	                        var z2 = 0.541196100 * tmp10 + z5; /* c2-c6 */
	                        var z4 = 1.306562965 * tmp12 + z5; /* c2+c6 */
	                        var z3 = tmp11 * 0.707106781; /* c4 */
	    
	                        var z11 = tmp7 + z3;    /* phase 5 */
	                        var z13 = tmp7 - z3;
	    
	                        data[dataOff+5] = z13 + z2; /* phase 6 */
	                        data[dataOff+3] = z13 - z2;
	                        data[dataOff+1] = z11 + z4;
	                        data[dataOff+7] = z11 - z4;
	    
	                        dataOff += 8; /* advance pointer to next row */
	                    }
	    
	                    /* Pass 2: process columns. */
	                    dataOff = 0;
	                    for (i=0; i<I8; ++i)
	                    {
	                        d0 = data[dataOff];
	                        d1 = data[dataOff + 8];
	                        d2 = data[dataOff + 16];
	                        d3 = data[dataOff + 24];
	                        d4 = data[dataOff + 32];
	                        d5 = data[dataOff + 40];
	                        d6 = data[dataOff + 48];
	                        d7 = data[dataOff + 56];
	    
	                        var tmp0p2 = d0 + d7;
	                        var tmp7p2 = d0 - d7;
	                        var tmp1p2 = d1 + d6;
	                        var tmp6p2 = d1 - d6;
	                        var tmp2p2 = d2 + d5;
	                        var tmp5p2 = d2 - d5;
	                        var tmp3p2 = d3 + d4;
	                        var tmp4p2 = d3 - d4;
	    
	                        /* Even part */
	                        var tmp10p2 = tmp0p2 + tmp3p2;  /* phase 2 */
	                        var tmp13p2 = tmp0p2 - tmp3p2;
	                        var tmp11p2 = tmp1p2 + tmp2p2;
	                        var tmp12p2 = tmp1p2 - tmp2p2;
	    
	                        data[dataOff] = tmp10p2 + tmp11p2; /* phase 3 */
	                        data[dataOff+32] = tmp10p2 - tmp11p2;
	    
	                        var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; /* c4 */
	                        data[dataOff+16] = tmp13p2 + z1p2; /* phase 5 */
	                        data[dataOff+48] = tmp13p2 - z1p2;
	    
	                        /* Odd part */
	                        tmp10p2 = tmp4p2 + tmp5p2; /* phase 2 */
	                        tmp11p2 = tmp5p2 + tmp6p2;
	                        tmp12p2 = tmp6p2 + tmp7p2;
	    
	                        /* The rotator is modified from fig 4-8 to avoid extra negations. */
	                        var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; /* c6 */
	                        var z2p2 = 0.541196100 * tmp10p2 + z5p2; /* c2-c6 */
	                        var z4p2 = 1.306562965 * tmp12p2 + z5p2; /* c2+c6 */
	                        var z3p2 = tmp11p2 * 0.707106781; /* c4 */
	    
	                        var z11p2 = tmp7p2 + z3p2;  /* phase 5 */
	                        var z13p2 = tmp7p2 - z3p2;
	    
	                        data[dataOff+40] = z13p2 + z2p2; /* phase 6 */
	                        data[dataOff+24] = z13p2 - z2p2;
	                        data[dataOff+ 8] = z11p2 + z4p2;
	                        data[dataOff+56] = z11p2 - z4p2;
	    
	                        dataOff++; /* advance pointer to next column */
	                    }
	    
	                    // Quantize/descale the coefficients
	                    var fDCTQuant;
	                    for (i=0; i<I64; ++i)
	                    {
	                        // Apply the quantization and scaling factor & Round to nearest integer
	                        fDCTQuant = data[i]*fdtbl[i];
	                        outputfDCTQuant[i] = (fDCTQuant > 0.0) ? ((fDCTQuant + 0.5)|0) : ((fDCTQuant - 0.5)|0);
	                        //outputfDCTQuant[i] = fround(fDCTQuant);
	    
	                    }
	                    return outputfDCTQuant;
	                }
	    
	                function writeAPP0()
	                {
	                    writeWord(0xFFE0); // marker
	                    writeWord(16); // length
	                    writeByte(0x4A); // J
	                    writeByte(0x46); // F
	                    writeByte(0x49); // I
	                    writeByte(0x46); // F
	                    writeByte(0); // = "JFIF",'\0'
	                    writeByte(1); // versionhi
	                    writeByte(1); // versionlo
	                    writeByte(0); // xyunits
	                    writeWord(1); // xdensity
	                    writeWord(1); // ydensity
	                    writeByte(0); // thumbnwidth
	                    writeByte(0); // thumbnheight
	                }
	    
	                function writeSOF0(width, height)
	                {
	                    writeWord(0xFFC0); // marker
	                    writeWord(17);   // length, truecolor YUV JPG
	                    writeByte(8);    // precision
	                    writeWord(height);
	                    writeWord(width);
	                    writeByte(3);    // nrofcomponents
	                    writeByte(1);    // IdY
	                    writeByte(0x11); // HVY
	                    writeByte(0);    // QTY
	                    writeByte(2);    // IdU
	                    writeByte(0x11); // HVU
	                    writeByte(1);    // QTU
	                    writeByte(3);    // IdV
	                    writeByte(0x11); // HVV
	                    writeByte(1);    // QTV
	                }
	    
	                function writeDQT()
	                {
	                    writeWord(0xFFDB); // marker
	                    writeWord(132);    // length
	                    writeByte(0);
	                    for (var i=0; i<64; i++) {
	                        writeByte(YTable[i]);
	                    }
	                    writeByte(1);
	                    for (var j=0; j<64; j++) {
	                        writeByte(UVTable[j]);
	                    }
	                }
	    
	                function writeDHT()
	                {
	                    writeWord(0xFFC4); // marker
	                    writeWord(0x01A2); // length
	    
	                    writeByte(0); // HTYDCinfo
	                    for (var i=0; i<16; i++) {
	                        writeByte(std_dc_luminance_nrcodes[i+1]);
	                    }
	                    for (var j=0; j<=11; j++) {
	                        writeByte(std_dc_luminance_values[j]);
	                    }
	    
	                    writeByte(0x10); // HTYACinfo
	                    for (var k=0; k<16; k++) {
	                        writeByte(std_ac_luminance_nrcodes[k+1]);
	                    }
	                    for (var l=0; l<=161; l++) {
	                        writeByte(std_ac_luminance_values[l]);
	                    }
	    
	                    writeByte(1); // HTUDCinfo
	                    for (var m=0; m<16; m++) {
	                        writeByte(std_dc_chrominance_nrcodes[m+1]);
	                    }
	                    for (var n=0; n<=11; n++) {
	                        writeByte(std_dc_chrominance_values[n]);
	                    }
	    
	                    writeByte(0x11); // HTUACinfo
	                    for (var o=0; o<16; o++) {
	                        writeByte(std_ac_chrominance_nrcodes[o+1]);
	                    }
	                    for (var p=0; p<=161; p++) {
	                        writeByte(std_ac_chrominance_values[p]);
	                    }
	                }
	    
	                function writeSOS()
	                {
	                    writeWord(0xFFDA); // marker
	                    writeWord(12); // length
	                    writeByte(3); // nrofcomponents
	                    writeByte(1); // IdY
	                    writeByte(0); // HTY
	                    writeByte(2); // IdU
	                    writeByte(0x11); // HTU
	                    writeByte(3); // IdV
	                    writeByte(0x11); // HTV
	                    writeByte(0); // Ss
	                    writeByte(0x3f); // Se
	                    writeByte(0); // Bf
	                }
	    
	                function processDU(CDU, fdtbl, DC, HTDC, HTAC){
	                    var EOB = HTAC[0x00];
	                    var M16zeroes = HTAC[0xF0];
	                    var pos;
	                    var I16 = 16;
	                    var I63 = 63;
	                    var I64 = 64;
	                    var DU_DCT = fDCTQuant(CDU, fdtbl);
	                    //ZigZag reorder
	                    for (var j=0;j<I64;++j) {
	                        DU[ZigZag[j]]=DU_DCT[j];
	                    }
	                    var Diff = DU[0] - DC; DC = DU[0];
	                    //Encode DC
	                    if (Diff==0) {
	                        writeBits(HTDC[0]); // Diff might be 0
	                    } else {
	                        pos = 32767+Diff;
	                        writeBits(HTDC[category[pos]]);
	                        writeBits(bitcode[pos]);
	                    }
	                    //Encode ACs
	                    var end0pos = 63; // was const... which is crazy
	                    for (; (end0pos>0)&&(DU[end0pos]==0); end0pos--) {};
	                    //end0pos = first element in reverse order !=0
	                    if ( end0pos == 0) {
	                        writeBits(EOB);
	                        return DC;
	                    }
	                    var i = 1;
	                    var lng;
	                    while ( i <= end0pos ) {
	                        var startpos = i;
	                        for (; (DU[i]==0) && (i<=end0pos); ++i) {}
	                        var nrzeroes = i-startpos;
	                        if ( nrzeroes >= I16 ) {
	                            lng = nrzeroes>>4;
	                            for (var nrmarker=1; nrmarker <= lng; ++nrmarker)
	                                writeBits(M16zeroes);
	                            nrzeroes = nrzeroes&0xF;
	                        }
	                        pos = 32767+DU[i];
	                        writeBits(HTAC[(nrzeroes<<4)+category[pos]]);
	                        writeBits(bitcode[pos]);
	                        i++;
	                    }
	                    if ( end0pos != I63 ) {
	                        writeBits(EOB);
	                    }
	                    return DC;
	                }
	    
	                function initCharLookupTable(){
	                    var sfcc = String.fromCharCode;
	                    for(var i=0; i < 256; i++){ ///// ACHTUNG // 255
	                        clt[i] = sfcc(i);
	                    }
	                }
	    
	                this.encode = function(image,quality) // image data object
	                {
	                    // var time_start = new Date().getTime();
	    
	                    if(quality) setQuality(quality);
	    
	                    // Initialize bit writer
	                    byteout = new Array();
	                    bytenew=0;
	                    bytepos=7;
	    
	                    // Add JPEG headers
	                    writeWord(0xFFD8); // SOI
	                    writeAPP0();
	                    writeDQT();
	                    writeSOF0(image.width,image.height);
	                    writeDHT();
	                    writeSOS();
	    
	    
	                    // Encode 8x8 macroblocks
	                    var DCY=0;
	                    var DCU=0;
	                    var DCV=0;
	    
	                    bytenew=0;
	                    bytepos=7;
	    
	    
	                    this.encode.displayName = "_encode_";
	    
	                    var imageData = image.data;
	                    var width = image.width;
	                    var height = image.height;
	    
	                    var quadWidth = width*4;
	                    var tripleWidth = width*3;
	    
	                    var x, y = 0;
	                    var r, g, b;
	                    var start,p, col,row,pos;
	                    while(y < height){
	                        x = 0;
	                        while(x < quadWidth){
	                        start = quadWidth * y + x;
	                        p = start;
	                        col = -1;
	                        row = 0;
	    
	                        for(pos=0; pos < 64; pos++){
	                            row = pos >> 3;// /8
	                            col = ( pos & 7 ) * 4; // %8
	                            p = start + ( row * quadWidth ) + col;
	    
	                            if(y+row >= height){ // padding bottom
	                                p-= (quadWidth*(y+1+row-height));
	                            }
	    
	                            if(x+col >= quadWidth){ // padding right
	                                p-= ((x+col) - quadWidth +4)
	                            }
	    
	                            r = imageData[ p++ ];
	                            g = imageData[ p++ ];
	                            b = imageData[ p++ ];
	    
	    
	                            /* // calculate YUV values dynamically
	                            YDU[pos]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
	                            UDU[pos]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
	                            VDU[pos]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
	                            */
	    
	                            // use lookup table (slightly faster)
	                            YDU[pos] = ((RGB_YUV_TABLE[r]             + RGB_YUV_TABLE[(g +  256)>>0] + RGB_YUV_TABLE[(b +  512)>>0]) >> 16)-128;
	                            UDU[pos] = ((RGB_YUV_TABLE[(r +  768)>>0] + RGB_YUV_TABLE[(g + 1024)>>0] + RGB_YUV_TABLE[(b + 1280)>>0]) >> 16)-128;
	                            VDU[pos] = ((RGB_YUV_TABLE[(r + 1280)>>0] + RGB_YUV_TABLE[(g + 1536)>>0] + RGB_YUV_TABLE[(b + 1792)>>0]) >> 16)-128;
	    
	                        }
	    
	                        DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
	                        DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
	                        DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
	                        x+=32;
	                        }
	                        y+=8;
	                    }
	    
	    
	                    ////////////////////////////////////////////////////////////////
	    
	                    // Do the bit alignment of the EOI marker
	                    if ( bytepos >= 0 ) {
	                        var fillbits = [];
	                        fillbits[1] = bytepos+1;
	                        fillbits[0] = (1<<(bytepos+1))-1;
	                        writeBits(fillbits);
	                    }
	    
	                    writeWord(0xFFD9); //EOI
	    
	                    var jpegDataUri = 'data:image/jpeg;base64,' + btoa(byteout.join(''));
	    
	                    byteout = [];
	    
	                    // benchmarking
	                    // var duration = new Date().getTime() - time_start;
	                    // console.log('Encoding time: '+ currentQuality + 'ms');
	                    //
	    
	                    return jpegDataUri
	            }
	    
	            function setQuality(quality){
	                if (quality <= 0) {
	                    quality = 1;
	                }
	                if (quality > 100) {
	                    quality = 100;
	                }
	    
	                if(currentQuality == quality) return // don't recalc if unchanged
	    
	                var sf = 0;
	                if (quality < 50) {
	                    sf = Math.floor(5000 / quality);
	                } else {
	                    sf = Math.floor(200 - quality*2);
	                }
	    
	                initQuantTables(sf);
	                currentQuality = quality;
	                // console.log('Quality set to: '+quality +'%');
	            }
	    
	            function init(){
	                // var time_start = new Date().getTime();
	                if(!quality) quality = 50;
	                // Create tables
	                initCharLookupTable()
	                initHuffmanTbl();
	                initCategoryNumber();
	                initRGBYUVTable();
	    
	                setQuality(quality);
	                // var duration = new Date().getTime() - time_start;
	                // console.log('Initialization '+ duration + 'ms');
	            }
	    
	            init();
	    
	        };
	    
	        JPEGEncoder.encode = function( data, quality ) {
	            var encoder = new JPEGEncoder( quality );
	    
	            return encoder.encode( data );
	        }
	    
	        return JPEGEncoder;
	    });
	    /**
	     * @fileOverview Fix android canvas.toDataUrl bug.
	     */
	    define('runtime/html5/androidpatch',[
	        'runtime/html5/util',
	        'runtime/html5/jpegencoder',
	        'base'
	    ], function( Util, encoder, Base ) {
	        var origin = Util.canvasToDataUrl,
	            supportJpeg;
	    
	        Util.canvasToDataUrl = function( canvas, type, quality ) {
	            var ctx, w, h, fragement, parts;
	    
	            // 非android手机直接跳过。
	            if ( !Base.os.android ) {
	                return origin.apply( null, arguments );
	            }
	    
	            // 检测是否canvas支持jpeg导出，根据数据格式来判断。
	            // JPEG 前两位分别是：255, 216
	            if ( type === 'image/jpeg' && typeof supportJpeg === 'undefined' ) {
	                fragement = origin.apply( null, arguments );
	    
	                parts = fragement.split(',');
	    
	                if ( ~parts[ 0 ].indexOf('base64') ) {
	                    fragement = atob( parts[ 1 ] );
	                } else {
	                    fragement = decodeURIComponent( parts[ 1 ] );
	                }
	    
	                fragement = fragement.substring( 0, 2 );
	    
	                supportJpeg = fragement.charCodeAt( 0 ) === 255 &&
	                        fragement.charCodeAt( 1 ) === 216;
	            }
	    
	            // 只有在android环境下才修复
	            if ( type === 'image/jpeg' && !supportJpeg ) {
	                w = canvas.width;
	                h = canvas.height;
	                ctx = canvas.getContext('2d');
	    
	                return encoder.encode( ctx.getImageData( 0, 0, w, h ), quality );
	            }
	    
	            return origin.apply( null, arguments );
	        };
	    });
	    /**
	     * @fileOverview Image
	     */
	    define('runtime/html5/image',[
	        'base',
	        'runtime/html5/runtime',
	        'runtime/html5/util'
	    ], function( Base, Html5Runtime, Util ) {
	    
	        var BLANK = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D';
	    
	        return Html5Runtime.register( 'Image', {
	    
	            // flag: 标记是否被修改过。
	            modified: false,
	    
	            init: function() {
	                var me = this,
	                    img = new Image();
	    
	                img.onload = function() {
	    
	                    me._info = {
	                        type: me.type,
	                        width: this.width,
	                        height: this.height
	                    };
	    
	                    // 读取meta信息。
	                    if ( !me._metas && 'image/jpeg' === me.type ) {
	                        Util.parseMeta( me._blob, function( error, ret ) {
	                            me._metas = ret;
	                            me.owner.trigger('load');
	                        });
	                    } else {
	                        me.owner.trigger('load');
	                    }
	                };
	    
	                img.onerror = function() {
	                    me.owner.trigger('error');
	                };
	    
	                me._img = img;
	            },
	    
	            loadFromBlob: function( blob ) {
	                var me = this,
	                    img = me._img;
	    
	                me._blob = blob;
	                me.type = blob.type;
	                img.src = Util.createObjectURL( blob.getSource() );
	                me.owner.once( 'load', function() {
	                    Util.revokeObjectURL( img.src );
	                });
	            },
	    
	            resize: function( width, height ) {
	                var canvas = this._canvas ||
	                        (this._canvas = document.createElement('canvas'));
	    
	                this._resize( this._img, canvas, width, height );
	                this._blob = null;    // 没用了，可以删掉了。
	                this.modified = true;
	                this.owner.trigger( 'complete', 'resize' );
	            },
	    
	            crop: function( x, y, w, h, s ) {
	                var cvs = this._canvas ||
	                        (this._canvas = document.createElement('canvas')),
	                    opts = this.options,
	                    img = this._img,
	                    iw = img.naturalWidth,
	                    ih = img.naturalHeight,
	                    orientation = this.getOrientation();
	    
	                s = s || 1;
	    
	                // todo 解决 orientation 的问题。
	                // values that require 90 degree rotation
	                // if ( ~[ 5, 6, 7, 8 ].indexOf( orientation ) ) {
	    
	                //     switch ( orientation ) {
	                //         case 6:
	                //             tmp = x;
	                //             x = y;
	                //             y = iw * s - tmp - w;
	                //             console.log(ih * s, tmp, w)
	                //             break;
	                //     }
	    
	                //     (w ^= h, h ^= w, w ^= h);
	                // }
	    
	                cvs.width = w;
	                cvs.height = h;
	    
	                opts.preserveHeaders || this._rotate2Orientaion( cvs, orientation );
	                this._renderImageToCanvas( cvs, img, -x, -y, iw * s, ih * s );
	    
	                this._blob = null;    // 没用了，可以删掉了。
	                this.modified = true;
	                this.owner.trigger( 'complete', 'crop' );
	            },
	    
	            getAsBlob: function( type ) {
	                var blob = this._blob,
	                    opts = this.options,
	                    canvas;
	    
	                type = type || this.type;
	    
	                // blob需要重新生成。
	                if ( this.modified || this.type !== type ) {
	                    canvas = this._canvas;
	    
	                    if ( type === 'image/jpeg' ) {
	    
	                        blob = Util.canvasToDataUrl( canvas, type, opts.quality );
	    
	                        if ( opts.preserveHeaders && this._metas &&
	                                this._metas.imageHead ) {
	    
	                            blob = Util.dataURL2ArrayBuffer( blob );
	                            blob = Util.updateImageHead( blob,
	                                    this._metas.imageHead );
	                            blob = Util.arrayBufferToBlob( blob, type );
	                            return blob;
	                        }
	                    } else {
	                        blob = Util.canvasToDataUrl( canvas, type );
	                    }
	    
	                    blob = Util.dataURL2Blob( blob );
	                }
	    
	                return blob;
	            },
	    
	            getAsDataUrl: function( type ) {
	                var opts = this.options;
	    
	                type = type || this.type;
	    
	                if ( type === 'image/jpeg' ) {
	                    return Util.canvasToDataUrl( this._canvas, type, opts.quality );
	                } else {
	                    return this._canvas.toDataURL( type );
	                }
	            },
	    
	            getOrientation: function() {
	                return this._metas && this._metas.exif &&
	                        this._metas.exif.get('Orientation') || 1;
	            },
	    
	            info: function( val ) {
	    
	                // setter
	                if ( val ) {
	                    this._info = val;
	                    return this;
	                }
	    
	                // getter
	                return this._info;
	            },
	    
	            meta: function( val ) {
	    
	                // setter
	                if ( val ) {
	                    this._meta = val;
	                    return this;
	                }
	    
	                // getter
	                return this._meta;
	            },
	    
	            destroy: function() {
	                var canvas = this._canvas;
	                this._img.onload = null;
	    
	                if ( canvas ) {
	                    canvas.getContext('2d')
	                            .clearRect( 0, 0, canvas.width, canvas.height );
	                    canvas.width = canvas.height = 0;
	                    this._canvas = null;
	                }
	    
	                // 释放内存。非常重要，否则释放不了image的内存。
	                this._img.src = BLANK;
	                this._img = this._blob = null;
	            },
	    
	            _resize: function( img, cvs, width, height ) {
	                var opts = this.options,
	                    naturalWidth = img.width,
	                    naturalHeight = img.height,
	                    orientation = this.getOrientation(),
	                    scale, w, h, x, y;
	    
	                // values that require 90 degree rotation
	                if ( ~[ 5, 6, 7, 8 ].indexOf( orientation ) ) {
	    
	                    // 交换width, height的值。
	                    width ^= height;
	                    height ^= width;
	                    width ^= height;
	                }
	    
	                scale = Math[ opts.crop ? 'max' : 'min' ]( width / naturalWidth,
	                        height / naturalHeight );
	    
	                // 不允许放大。
	                opts.allowMagnify || (scale = Math.min( 1, scale ));
	    
	                w = naturalWidth * scale;
	                h = naturalHeight * scale;
	    
	                if ( opts.crop ) {
	                    cvs.width = width;
	                    cvs.height = height;
	                } else {
	                    cvs.width = w;
	                    cvs.height = h;
	                }
	    
	                x = (cvs.width - w) / 2;
	                y = (cvs.height - h) / 2;
	    
	                opts.preserveHeaders || this._rotate2Orientaion( cvs, orientation );
	    
	                this._renderImageToCanvas( cvs, img, x, y, w, h );
	            },
	    
	            _rotate2Orientaion: function( canvas, orientation ) {
	                var width = canvas.width,
	                    height = canvas.height,
	                    ctx = canvas.getContext('2d');
	    
	                switch ( orientation ) {
	                    case 5:
	                    case 6:
	                    case 7:
	                    case 8:
	                        canvas.width = height;
	                        canvas.height = width;
	                        break;
	                }
	    
	                switch ( orientation ) {
	                    case 2:    // horizontal flip
	                        ctx.translate( width, 0 );
	                        ctx.scale( -1, 1 );
	                        break;
	    
	                    case 3:    // 180 rotate left
	                        ctx.translate( width, height );
	                        ctx.rotate( Math.PI );
	                        break;
	    
	                    case 4:    // vertical flip
	                        ctx.translate( 0, height );
	                        ctx.scale( 1, -1 );
	                        break;
	    
	                    case 5:    // vertical flip + 90 rotate right
	                        ctx.rotate( 0.5 * Math.PI );
	                        ctx.scale( 1, -1 );
	                        break;
	    
	                    case 6:    // 90 rotate right
	                        ctx.rotate( 0.5 * Math.PI );
	                        ctx.translate( 0, -height );
	                        break;
	    
	                    case 7:    // horizontal flip + 90 rotate right
	                        ctx.rotate( 0.5 * Math.PI );
	                        ctx.translate( width, -height );
	                        ctx.scale( -1, 1 );
	                        break;
	    
	                    case 8:    // 90 rotate left
	                        ctx.rotate( -0.5 * Math.PI );
	                        ctx.translate( -width, 0 );
	                        break;
	                }
	            },
	    
	            // https://github.com/stomita/ios-imagefile-megapixel/
	            // blob/master/src/megapix-image.js
	            _renderImageToCanvas: (function() {
	    
	                // 如果不是ios, 不需要这么复杂！
	                if ( !Base.os.ios ) {
	                    return function( canvas ) {
	                        var args = Base.slice( arguments, 1 ),
	                            ctx = canvas.getContext('2d');
	    
	                        ctx.drawImage.apply( ctx, args );
	                    };
	                }
	    
	                /**
	                 * Detecting vertical squash in loaded image.
	                 * Fixes a bug which squash image vertically while drawing into
	                 * canvas for some images.
	                 */
	                function detectVerticalSquash( img, iw, ih ) {
	                    var canvas = document.createElement('canvas'),
	                        ctx = canvas.getContext('2d'),
	                        sy = 0,
	                        ey = ih,
	                        py = ih,
	                        data, alpha, ratio;
	    
	    
	                    canvas.width = 1;
	                    canvas.height = ih;
	                    ctx.drawImage( img, 0, 0 );
	                    data = ctx.getImageData( 0, 0, 1, ih ).data;
	    
	                    // search image edge pixel position in case
	                    // it is squashed vertically.
	                    while ( py > sy ) {
	                        alpha = data[ (py - 1) * 4 + 3 ];
	    
	                        if ( alpha === 0 ) {
	                            ey = py;
	                        } else {
	                            sy = py;
	                        }
	    
	                        py = (ey + sy) >> 1;
	                    }
	    
	                    ratio = (py / ih);
	                    return (ratio === 0) ? 1 : ratio;
	                }
	    
	                // fix ie7 bug
	                // http://stackoverflow.com/questions/11929099/
	                // html5-canvas-drawimage-ratio-bug-ios
	                if ( Base.os.ios >= 7 ) {
	                    return function( canvas, img, x, y, w, h ) {
	                        var iw = img.naturalWidth,
	                            ih = img.naturalHeight,
	                            vertSquashRatio = detectVerticalSquash( img, iw, ih );
	    
	                        return canvas.getContext('2d').drawImage( img, 0, 0,
	                                iw * vertSquashRatio, ih * vertSquashRatio,
	                                x, y, w, h );
	                    };
	                }
	    
	                /**
	                 * Detect subsampling in loaded image.
	                 * In iOS, larger images than 2M pixels may be
	                 * subsampled in rendering.
	                 */
	                function detectSubsampling( img ) {
	                    var iw = img.naturalWidth,
	                        ih = img.naturalHeight,
	                        canvas, ctx;
	    
	                    // subsampling may happen overmegapixel image
	                    if ( iw * ih > 1024 * 1024 ) {
	                        canvas = document.createElement('canvas');
	                        canvas.width = canvas.height = 1;
	                        ctx = canvas.getContext('2d');
	                        ctx.drawImage( img, -iw + 1, 0 );
	    
	                        // subsampled image becomes half smaller in rendering size.
	                        // check alpha channel value to confirm image is covering
	                        // edge pixel or not. if alpha value is 0
	                        // image is not covering, hence subsampled.
	                        return ctx.getImageData( 0, 0, 1, 1 ).data[ 3 ] === 0;
	                    } else {
	                        return false;
	                    }
	                }
	    
	    
	                return function( canvas, img, x, y, width, height ) {
	                    var iw = img.naturalWidth,
	                        ih = img.naturalHeight,
	                        ctx = canvas.getContext('2d'),
	                        subsampled = detectSubsampling( img ),
	                        doSquash = this.type === 'image/jpeg',
	                        d = 1024,
	                        sy = 0,
	                        dy = 0,
	                        tmpCanvas, tmpCtx, vertSquashRatio, dw, dh, sx, dx;
	    
	                    if ( subsampled ) {
	                        iw /= 2;
	                        ih /= 2;
	                    }
	    
	                    ctx.save();
	                    tmpCanvas = document.createElement('canvas');
	                    tmpCanvas.width = tmpCanvas.height = d;
	    
	                    tmpCtx = tmpCanvas.getContext('2d');
	                    vertSquashRatio = doSquash ?
	                            detectVerticalSquash( img, iw, ih ) : 1;
	    
	                    dw = Math.ceil( d * width / iw );
	                    dh = Math.ceil( d * height / ih / vertSquashRatio );
	    
	                    while ( sy < ih ) {
	                        sx = 0;
	                        dx = 0;
	                        while ( sx < iw ) {
	                            tmpCtx.clearRect( 0, 0, d, d );
	                            tmpCtx.drawImage( img, -sx, -sy );
	                            ctx.drawImage( tmpCanvas, 0, 0, d, d,
	                                    x + dx, y + dy, dw, dh );
	                            sx += d;
	                            dx += dw;
	                        }
	                        sy += d;
	                        dy += dh;
	                    }
	                    ctx.restore();
	                    tmpCanvas = tmpCtx = null;
	                };
	            })()
	        });
	    });
	    /**
	     * @fileOverview Transport
	     * @todo 支持chunked传输，优势：
	     * 可以将大文件分成小块，挨个传输，可以提高大文件成功率，当失败的时候，也只需要重传那小部分，
	     * 而不需要重头再传一次。另外断点续传也需要用chunked方式。
	     */
	    define('runtime/html5/transport',[
	        'base',
	        'runtime/html5/runtime'
	    ], function( Base, Html5Runtime ) {
	    
	        var noop = Base.noop,
	            $ = Base.$;
	    
	        return Html5Runtime.register( 'Transport', {
	            init: function() {
	                this._status = 0;
	                this._response = null;
	            },
	    
	            send: function() {
	                var owner = this.owner,
	                    opts = this.options,
	                    xhr = this._initAjax(),
	                    blob = owner._blob,
	                    server = opts.server,
	                    formData, binary, fr;
	    
	                if ( opts.sendAsBinary ) {
	                    server += (/\?/.test( server ) ? '&' : '?') +
	                            $.param( owner._formData );
	    
	                    binary = blob.getSource();
	                } else {
	                    formData = new FormData();
	                    $.each( owner._formData, function( k, v ) {
	                        formData.append( k, v );
	                    });
	    
	                    formData.append( opts.fileVal, blob.getSource(),
	                            opts.filename || owner._formData.name || '' );
	                }
	    
	                if ( opts.withCredentials && 'withCredentials' in xhr ) {
	                    xhr.open( opts.method, server, true );
	                    xhr.withCredentials = true;
	                } else {
	                    xhr.open( opts.method, server );
	                }
	    
	                this._setRequestHeader( xhr, opts.headers );
	    
	                if ( binary ) {
	                    // 强制设置成 content-type 为文件流。
	                    xhr.overrideMimeType &&
	                            xhr.overrideMimeType('application/octet-stream');
	    
	                    // android直接发送blob会导致服务端接收到的是空文件。
	                    // bug详情。
	                    // https://code.google.com/p/android/issues/detail?id=39882
	                    // 所以先用fileReader读取出来再通过arraybuffer的方式发送。
	                    if ( Base.os.android ) {
	                        fr = new FileReader();
	    
	                        fr.onload = function() {
	                            xhr.send( this.result );
	                            fr = fr.onload = null;
	                        };
	    
	                        fr.readAsArrayBuffer( binary );
	                    } else {
	                        xhr.send( binary );
	                    }
	                } else {
	                    xhr.send( formData );
	                }
	            },
	    
	            getResponse: function() {
	                return this._response;
	            },
	    
	            getResponseAsJson: function() {
	                return this._parseJson( this._response );
	            },
	    
	            getStatus: function() {
	                return this._status;
	            },
	    
	            abort: function() {
	                var xhr = this._xhr;
	    
	                if ( xhr ) {
	                    xhr.upload.onprogress = noop;
	                    xhr.onreadystatechange = noop;
	                    xhr.abort();
	    
	                    this._xhr = xhr = null;
	                }
	            },
	    
	            destroy: function() {
	                this.abort();
	            },
	    
	            _initAjax: function() {
	                var me = this,
	                    xhr = new XMLHttpRequest(),
	                    opts = this.options;
	    
	                if ( opts.withCredentials && !('withCredentials' in xhr) &&
	                        typeof XDomainRequest !== 'undefined' ) {
	                    xhr = new XDomainRequest();
	                }
	    
	                xhr.upload.onprogress = function( e ) {
	                    var percentage = 0;
	    
	                    if ( e.lengthComputable ) {
	                        percentage = e.loaded / e.total;
	                    }
	    
	                    return me.trigger( 'progress', percentage );
	                };
	    
	                xhr.onreadystatechange = function() {
	    
	                    if ( xhr.readyState !== 4 ) {
	                        return;
	                    }
	    
	                    xhr.upload.onprogress = noop;
	                    xhr.onreadystatechange = noop;
	                    me._xhr = null;
	                    me._status = xhr.status;
	    
	                    if ( xhr.status >= 200 && xhr.status < 300 ) {
	                        me._response = xhr.responseText;
	                        return me.trigger('load');
	                    } else if ( xhr.status >= 500 && xhr.status < 600 ) {
	                        me._response = xhr.responseText;
	                        return me.trigger( 'error', 'server' );
	                    }
	    
	    
	                    return me.trigger( 'error', me._status ? 'http' : 'abort' );
	                };
	    
	                me._xhr = xhr;
	                return xhr;
	            },
	    
	            _setRequestHeader: function( xhr, headers ) {
	                $.each( headers, function( key, val ) {
	                    xhr.setRequestHeader( key, val );
	                });
	            },
	    
	            _parseJson: function( str ) {
	                var json;
	    
	                try {
	                    json = JSON.parse( str );
	                } catch ( ex ) {
	                    json = {};
	                }
	    
	                return json;
	            }
	        });
	    });
	    /**
	     * @fileOverview  Transport flash实现
	     */
	    define('runtime/html5/md5',[
	        'runtime/html5/runtime'
	    ], function( FlashRuntime ) {
	    
	        /*
	         * Fastest md5 implementation around (JKM md5)
	         * Credits: Joseph Myers
	         *
	         * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
	         * @see http://jsperf.com/md5-shootout/7
	         */
	    
	        /* this function is much faster,
	          so if possible we use it. Some IEs
	          are the only ones I know of that
	          need the idiotic second function,
	          generated by an if clause.  */
	        var add32 = function (a, b) {
	            return (a + b) & 0xFFFFFFFF;
	        },
	    
	        cmn = function (q, a, b, x, s, t) {
	            a = add32(add32(a, q), add32(x, t));
	            return add32((a << s) | (a >>> (32 - s)), b);
	        },
	    
	        ff = function (a, b, c, d, x, s, t) {
	            return cmn((b & c) | ((~b) & d), a, b, x, s, t);
	        },
	    
	        gg = function (a, b, c, d, x, s, t) {
	            return cmn((b & d) | (c & (~d)), a, b, x, s, t);
	        },
	    
	        hh = function (a, b, c, d, x, s, t) {
	            return cmn(b ^ c ^ d, a, b, x, s, t);
	        },
	    
	        ii = function (a, b, c, d, x, s, t) {
	            return cmn(c ^ (b | (~d)), a, b, x, s, t);
	        },
	    
	        md5cycle = function (x, k) {
	            var a = x[0],
	                b = x[1],
	                c = x[2],
	                d = x[3];
	    
	            a = ff(a, b, c, d, k[0], 7, -680876936);
	            d = ff(d, a, b, c, k[1], 12, -389564586);
	            c = ff(c, d, a, b, k[2], 17, 606105819);
	            b = ff(b, c, d, a, k[3], 22, -1044525330);
	            a = ff(a, b, c, d, k[4], 7, -176418897);
	            d = ff(d, a, b, c, k[5], 12, 1200080426);
	            c = ff(c, d, a, b, k[6], 17, -1473231341);
	            b = ff(b, c, d, a, k[7], 22, -45705983);
	            a = ff(a, b, c, d, k[8], 7, 1770035416);
	            d = ff(d, a, b, c, k[9], 12, -1958414417);
	            c = ff(c, d, a, b, k[10], 17, -42063);
	            b = ff(b, c, d, a, k[11], 22, -1990404162);
	            a = ff(a, b, c, d, k[12], 7, 1804603682);
	            d = ff(d, a, b, c, k[13], 12, -40341101);
	            c = ff(c, d, a, b, k[14], 17, -1502002290);
	            b = ff(b, c, d, a, k[15], 22, 1236535329);
	    
	            a = gg(a, b, c, d, k[1], 5, -165796510);
	            d = gg(d, a, b, c, k[6], 9, -1069501632);
	            c = gg(c, d, a, b, k[11], 14, 643717713);
	            b = gg(b, c, d, a, k[0], 20, -373897302);
	            a = gg(a, b, c, d, k[5], 5, -701558691);
	            d = gg(d, a, b, c, k[10], 9, 38016083);
	            c = gg(c, d, a, b, k[15], 14, -660478335);
	            b = gg(b, c, d, a, k[4], 20, -405537848);
	            a = gg(a, b, c, d, k[9], 5, 568446438);
	            d = gg(d, a, b, c, k[14], 9, -1019803690);
	            c = gg(c, d, a, b, k[3], 14, -187363961);
	            b = gg(b, c, d, a, k[8], 20, 1163531501);
	            a = gg(a, b, c, d, k[13], 5, -1444681467);
	            d = gg(d, a, b, c, k[2], 9, -51403784);
	            c = gg(c, d, a, b, k[7], 14, 1735328473);
	            b = gg(b, c, d, a, k[12], 20, -1926607734);
	    
	            a = hh(a, b, c, d, k[5], 4, -378558);
	            d = hh(d, a, b, c, k[8], 11, -2022574463);
	            c = hh(c, d, a, b, k[11], 16, 1839030562);
	            b = hh(b, c, d, a, k[14], 23, -35309556);
	            a = hh(a, b, c, d, k[1], 4, -1530992060);
	            d = hh(d, a, b, c, k[4], 11, 1272893353);
	            c = hh(c, d, a, b, k[7], 16, -155497632);
	            b = hh(b, c, d, a, k[10], 23, -1094730640);
	            a = hh(a, b, c, d, k[13], 4, 681279174);
	            d = hh(d, a, b, c, k[0], 11, -358537222);
	            c = hh(c, d, a, b, k[3], 16, -722521979);
	            b = hh(b, c, d, a, k[6], 23, 76029189);
	            a = hh(a, b, c, d, k[9], 4, -640364487);
	            d = hh(d, a, b, c, k[12], 11, -421815835);
	            c = hh(c, d, a, b, k[15], 16, 530742520);
	            b = hh(b, c, d, a, k[2], 23, -995338651);
	    
	            a = ii(a, b, c, d, k[0], 6, -198630844);
	            d = ii(d, a, b, c, k[7], 10, 1126891415);
	            c = ii(c, d, a, b, k[14], 15, -1416354905);
	            b = ii(b, c, d, a, k[5], 21, -57434055);
	            a = ii(a, b, c, d, k[12], 6, 1700485571);
	            d = ii(d, a, b, c, k[3], 10, -1894986606);
	            c = ii(c, d, a, b, k[10], 15, -1051523);
	            b = ii(b, c, d, a, k[1], 21, -2054922799);
	            a = ii(a, b, c, d, k[8], 6, 1873313359);
	            d = ii(d, a, b, c, k[15], 10, -30611744);
	            c = ii(c, d, a, b, k[6], 15, -1560198380);
	            b = ii(b, c, d, a, k[13], 21, 1309151649);
	            a = ii(a, b, c, d, k[4], 6, -145523070);
	            d = ii(d, a, b, c, k[11], 10, -1120210379);
	            c = ii(c, d, a, b, k[2], 15, 718787259);
	            b = ii(b, c, d, a, k[9], 21, -343485551);
	    
	            x[0] = add32(a, x[0]);
	            x[1] = add32(b, x[1]);
	            x[2] = add32(c, x[2]);
	            x[3] = add32(d, x[3]);
	        },
	    
	        /* there needs to be support for Unicode here,
	           * unless we pretend that we can redefine the MD-5
	           * algorithm for multi-byte characters (perhaps
	           * by adding every four 16-bit characters and
	           * shortening the sum to 32 bits). Otherwise
	           * I suggest performing MD-5 as if every character
	           * was two bytes--e.g., 0040 0025 = @%--but then
	           * how will an ordinary MD-5 sum be matched?
	           * There is no way to standardize text to something
	           * like UTF-8 before transformation; speed cost is
	           * utterly prohibitive. The JavaScript standard
	           * itself needs to look at this: it should start
	           * providing access to strings as preformed UTF-8
	           * 8-bit unsigned value arrays.
	           */
	        md5blk = function (s) {
	            var md5blks = [],
	                i; /* Andy King said do it this way. */
	    
	            for (i = 0; i < 64; i += 4) {
	                md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
	            }
	            return md5blks;
	        },
	    
	        md5blk_array = function (a) {
	            var md5blks = [],
	                i; /* Andy King said do it this way. */
	    
	            for (i = 0; i < 64; i += 4) {
	                md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
	            }
	            return md5blks;
	        },
	    
	        md51 = function (s) {
	            var n = s.length,
	                state = [1732584193, -271733879, -1732584194, 271733878],
	                i,
	                length,
	                tail,
	                tmp,
	                lo,
	                hi;
	    
	            for (i = 64; i <= n; i += 64) {
	                md5cycle(state, md5blk(s.substring(i - 64, i)));
	            }
	            s = s.substring(i - 64);
	            length = s.length;
	            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	            for (i = 0; i < length; i += 1) {
	                tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
	            }
	            tail[i >> 2] |= 0x80 << ((i % 4) << 3);
	            if (i > 55) {
	                md5cycle(state, tail);
	                for (i = 0; i < 16; i += 1) {
	                    tail[i] = 0;
	                }
	            }
	    
	            // Beware that the final length might not fit in 32 bits so we take care of that
	            tmp = n * 8;
	            tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
	            lo = parseInt(tmp[2], 16);
	            hi = parseInt(tmp[1], 16) || 0;
	    
	            tail[14] = lo;
	            tail[15] = hi;
	    
	            md5cycle(state, tail);
	            return state;
	        },
	    
	        md51_array = function (a) {
	            var n = a.length,
	                state = [1732584193, -271733879, -1732584194, 271733878],
	                i,
	                length,
	                tail,
	                tmp,
	                lo,
	                hi;
	    
	            for (i = 64; i <= n; i += 64) {
	                md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
	            }
	    
	            // Not sure if it is a bug, however IE10 will always produce a sub array of length 1
	            // containing the last element of the parent array if the sub array specified starts
	            // beyond the length of the parent array - weird.
	            // https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue
	            a = (i - 64) < n ? a.subarray(i - 64) : new Uint8Array(0);
	    
	            length = a.length;
	            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	            for (i = 0; i < length; i += 1) {
	                tail[i >> 2] |= a[i] << ((i % 4) << 3);
	            }
	    
	            tail[i >> 2] |= 0x80 << ((i % 4) << 3);
	            if (i > 55) {
	                md5cycle(state, tail);
	                for (i = 0; i < 16; i += 1) {
	                    tail[i] = 0;
	                }
	            }
	    
	            // Beware that the final length might not fit in 32 bits so we take care of that
	            tmp = n * 8;
	            tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
	            lo = parseInt(tmp[2], 16);
	            hi = parseInt(tmp[1], 16) || 0;
	    
	            tail[14] = lo;
	            tail[15] = hi;
	    
	            md5cycle(state, tail);
	    
	            return state;
	        },
	    
	        hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'],
	    
	        rhex = function (n) {
	            var s = '',
	                j;
	            for (j = 0; j < 4; j += 1) {
	                s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
	            }
	            return s;
	        },
	    
	        hex = function (x) {
	            var i;
	            for (i = 0; i < x.length; i += 1) {
	                x[i] = rhex(x[i]);
	            }
	            return x.join('');
	        },
	    
	        md5 = function (s) {
	            return hex(md51(s));
	        },
	    
	    
	    
	        ////////////////////////////////////////////////////////////////////////////
	    
	        /**
	         * SparkMD5 OOP implementation.
	         *
	         * Use this class to perform an incremental md5, otherwise use the
	         * static methods instead.
	         */
	        SparkMD5 = function () {
	            // call reset to init the instance
	            this.reset();
	        };
	    
	    
	        // In some cases the fast add32 function cannot be used..
	        if (md5('hello') !== '5d41402abc4b2a76b9719d911017c592') {
	            add32 = function (x, y) {
	                var lsw = (x & 0xFFFF) + (y & 0xFFFF),
	                    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	                return (msw << 16) | (lsw & 0xFFFF);
	            };
	        }
	    
	    
	        /**
	         * Appends a string.
	         * A conversion will be applied if an utf8 string is detected.
	         *
	         * @param {String} str The string to be appended
	         *
	         * @return {SparkMD5} The instance itself
	         */
	        SparkMD5.prototype.append = function (str) {
	            // converts the string to utf8 bytes if necessary
	            if (/[\u0080-\uFFFF]/.test(str)) {
	                str = unescape(encodeURIComponent(str));
	            }
	    
	            // then append as binary
	            this.appendBinary(str);
	    
	            return this;
	        };
	    
	        /**
	         * Appends a binary string.
	         *
	         * @param {String} contents The binary string to be appended
	         *
	         * @return {SparkMD5} The instance itself
	         */
	        SparkMD5.prototype.appendBinary = function (contents) {
	            this._buff += contents;
	            this._length += contents.length;
	    
	            var length = this._buff.length,
	                i;
	    
	            for (i = 64; i <= length; i += 64) {
	                md5cycle(this._state, md5blk(this._buff.substring(i - 64, i)));
	            }
	    
	            this._buff = this._buff.substr(i - 64);
	    
	            return this;
	        };
	    
	        /**
	         * Finishes the incremental computation, reseting the internal state and
	         * returning the result.
	         * Use the raw parameter to obtain the raw result instead of the hex one.
	         *
	         * @param {Boolean} raw True to get the raw result, false to get the hex result
	         *
	         * @return {String|Array} The result
	         */
	        SparkMD5.prototype.end = function (raw) {
	            var buff = this._buff,
	                length = buff.length,
	                i,
	                tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                ret;
	    
	            for (i = 0; i < length; i += 1) {
	                tail[i >> 2] |= buff.charCodeAt(i) << ((i % 4) << 3);
	            }
	    
	            this._finish(tail, length);
	            ret = !!raw ? this._state : hex(this._state);
	    
	            this.reset();
	    
	            return ret;
	        };
	    
	        /**
	         * Finish the final calculation based on the tail.
	         *
	         * @param {Array}  tail   The tail (will be modified)
	         * @param {Number} length The length of the remaining buffer
	         */
	        SparkMD5.prototype._finish = function (tail, length) {
	            var i = length,
	                tmp,
	                lo,
	                hi;
	    
	            tail[i >> 2] |= 0x80 << ((i % 4) << 3);
	            if (i > 55) {
	                md5cycle(this._state, tail);
	                for (i = 0; i < 16; i += 1) {
	                    tail[i] = 0;
	                }
	            }
	    
	            // Do the final computation based on the tail and length
	            // Beware that the final length may not fit in 32 bits so we take care of that
	            tmp = this._length * 8;
	            tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
	            lo = parseInt(tmp[2], 16);
	            hi = parseInt(tmp[1], 16) || 0;
	    
	            tail[14] = lo;
	            tail[15] = hi;
	            md5cycle(this._state, tail);
	        };
	    
	        /**
	         * Resets the internal state of the computation.
	         *
	         * @return {SparkMD5} The instance itself
	         */
	        SparkMD5.prototype.reset = function () {
	            this._buff = "";
	            this._length = 0;
	            this._state = [1732584193, -271733879, -1732584194, 271733878];
	    
	            return this;
	        };
	    
	        /**
	         * Releases memory used by the incremental buffer and other aditional
	         * resources. If you plan to use the instance again, use reset instead.
	         */
	        SparkMD5.prototype.destroy = function () {
	            delete this._state;
	            delete this._buff;
	            delete this._length;
	        };
	    
	    
	        /**
	         * Performs the md5 hash on a string.
	         * A conversion will be applied if utf8 string is detected.
	         *
	         * @param {String}  str The string
	         * @param {Boolean} raw True to get the raw result, false to get the hex result
	         *
	         * @return {String|Array} The result
	         */
	        SparkMD5.hash = function (str, raw) {
	            // converts the string to utf8 bytes if necessary
	            if (/[\u0080-\uFFFF]/.test(str)) {
	                str = unescape(encodeURIComponent(str));
	            }
	    
	            var hash = md51(str);
	    
	            return !!raw ? hash : hex(hash);
	        };
	    
	        /**
	         * Performs the md5 hash on a binary string.
	         *
	         * @param {String}  content The binary string
	         * @param {Boolean} raw     True to get the raw result, false to get the hex result
	         *
	         * @return {String|Array} The result
	         */
	        SparkMD5.hashBinary = function (content, raw) {
	            var hash = md51(content);
	    
	            return !!raw ? hash : hex(hash);
	        };
	    
	        /**
	         * SparkMD5 OOP implementation for array buffers.
	         *
	         * Use this class to perform an incremental md5 ONLY for array buffers.
	         */
	        SparkMD5.ArrayBuffer = function () {
	            // call reset to init the instance
	            this.reset();
	        };
	    
	        ////////////////////////////////////////////////////////////////////////////
	    
	        /**
	         * Appends an array buffer.
	         *
	         * @param {ArrayBuffer} arr The array to be appended
	         *
	         * @return {SparkMD5.ArrayBuffer} The instance itself
	         */
	        SparkMD5.ArrayBuffer.prototype.append = function (arr) {
	            // TODO: we could avoid the concatenation here but the algorithm would be more complex
	            //       if you find yourself needing extra performance, please make a PR.
	            var buff = this._concatArrayBuffer(this._buff, arr),
	                length = buff.length,
	                i;
	    
	            this._length += arr.byteLength;
	    
	            for (i = 64; i <= length; i += 64) {
	                md5cycle(this._state, md5blk_array(buff.subarray(i - 64, i)));
	            }
	    
	            // Avoids IE10 weirdness (documented above)
	            this._buff = (i - 64) < length ? buff.subarray(i - 64) : new Uint8Array(0);
	    
	            return this;
	        };
	    
	        /**
	         * Finishes the incremental computation, reseting the internal state and
	         * returning the result.
	         * Use the raw parameter to obtain the raw result instead of the hex one.
	         *
	         * @param {Boolean} raw True to get the raw result, false to get the hex result
	         *
	         * @return {String|Array} The result
	         */
	        SparkMD5.ArrayBuffer.prototype.end = function (raw) {
	            var buff = this._buff,
	                length = buff.length,
	                tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	                i,
	                ret;
	    
	            for (i = 0; i < length; i += 1) {
	                tail[i >> 2] |= buff[i] << ((i % 4) << 3);
	            }
	    
	            this._finish(tail, length);
	            ret = !!raw ? this._state : hex(this._state);
	    
	            this.reset();
	    
	            return ret;
	        };
	    
	        SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;
	    
	        /**
	         * Resets the internal state of the computation.
	         *
	         * @return {SparkMD5.ArrayBuffer} The instance itself
	         */
	        SparkMD5.ArrayBuffer.prototype.reset = function () {
	            this._buff = new Uint8Array(0);
	            this._length = 0;
	            this._state = [1732584193, -271733879, -1732584194, 271733878];
	    
	            return this;
	        };
	    
	        /**
	         * Releases memory used by the incremental buffer and other aditional
	         * resources. If you plan to use the instance again, use reset instead.
	         */
	        SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;
	    
	        /**
	         * Concats two array buffers, returning a new one.
	         *
	         * @param  {ArrayBuffer} first  The first array buffer
	         * @param  {ArrayBuffer} second The second array buffer
	         *
	         * @return {ArrayBuffer} The new array buffer
	         */
	        SparkMD5.ArrayBuffer.prototype._concatArrayBuffer = function (first, second) {
	            var firstLength = first.length,
	                result = new Uint8Array(firstLength + second.byteLength);
	    
	            result.set(first);
	            result.set(new Uint8Array(second), firstLength);
	    
	            return result;
	        };
	    
	        /**
	         * Performs the md5 hash on an array buffer.
	         *
	         * @param {ArrayBuffer} arr The array buffer
	         * @param {Boolean}     raw True to get the raw result, false to get the hex result
	         *
	         * @return {String|Array} The result
	         */
	        SparkMD5.ArrayBuffer.hash = function (arr, raw) {
	            var hash = md51_array(new Uint8Array(arr));
	    
	            return !!raw ? hash : hex(hash);
	        };
	        
	        return FlashRuntime.register( 'Md5', {
	            init: function() {
	                // do nothing.
	            },
	    
	            loadFromBlob: function( file ) {
	                var blob = file.getSource(),
	                    chunkSize = 2 * 1024 * 1024,
	                    chunks = Math.ceil( blob.size / chunkSize ),
	                    chunk = 0,
	                    owner = this.owner,
	                    spark = new SparkMD5.ArrayBuffer(),
	                    me = this,
	                    blobSlice = blob.mozSlice || blob.webkitSlice || blob.slice,
	                    loadNext, fr;
	    
	                fr = new FileReader();
	    
	                loadNext = function() {
	                    var start, end;
	    
	                    start = chunk * chunkSize;
	                    end = Math.min( start + chunkSize, blob.size );
	    
	                    fr.onload = function( e ) {
	                        spark.append( e.target.result );
	                        owner.trigger( 'progress', {
	                            total: file.size,
	                            loaded: end
	                        });
	                    };
	    
	                    fr.onloadend = function() {
	                        fr.onloadend = fr.onload = null;
	    
	                        if ( ++chunk < chunks ) {
	                            setTimeout( loadNext, 1 );
	                        } else {
	                            setTimeout(function(){
	                                owner.trigger('load');
	                                me.result = spark.end();
	                                loadNext = file = blob = spark = null;
	                                owner.trigger('complete');
	                            }, 50 );
	                        }
	                    };
	    
	                    fr.readAsArrayBuffer( blobSlice.call( blob, start, end ) );
	                };
	    
	                loadNext();
	            },
	    
	            getResult: function() {
	                return this.result;
	            }
	        });
	    });
	    /**
	     * @fileOverview FlashRuntime
	     */
	    define('runtime/flash/runtime',[
	        'base',
	        'runtime/runtime',
	        'runtime/compbase'
	    ], function( Base, Runtime, CompBase ) {
	    
	        var $ = Base.$,
	            type = 'flash',
	            components = {};
	    
	    
	        function getFlashVersion() {
	            var version;
	    
	            try {
	                version = navigator.plugins[ 'Shockwave Flash' ];
	                version = version.description;
	            } catch ( ex ) {
	                try {
	                    version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
	                            .GetVariable('$version');
	                } catch ( ex2 ) {
	                    version = '0.0';
	                }
	            }
	            version = version.match( /\d+/g );
	            return parseFloat( version[ 0 ] + '.' + version[ 1 ], 10 );
	        }
	    
	        function FlashRuntime() {
	            var pool = {},
	                clients = {},
	                destroy = this.destroy,
	                me = this,
	                jsreciver = Base.guid('webuploader_');
	    
	            Runtime.apply( me, arguments );
	            me.type = type;
	    
	    
	            // 这个方法的调用者，实际上是RuntimeClient
	            me.exec = function( comp, fn/*, args...*/ ) {
	                var client = this,
	                    uid = client.uid,
	                    args = Base.slice( arguments, 2 ),
	                    instance;
	    
	                clients[ uid ] = client;
	    
	                if ( components[ comp ] ) {
	                    if ( !pool[ uid ] ) {
	                        pool[ uid ] = new components[ comp ]( client, me );
	                    }
	    
	                    instance = pool[ uid ];
	    
	                    if ( instance[ fn ] ) {
	                        return instance[ fn ].apply( instance, args );
	                    }
	                }
	    
	                return me.flashExec.apply( client, arguments );
	            };
	    
	            function handler( evt, obj ) {
	                var type = evt.type || evt,
	                    parts, uid;
	    
	                parts = type.split('::');
	                uid = parts[ 0 ];
	                type = parts[ 1 ];
	    
	                // console.log.apply( console, arguments );
	    
	                if ( type === 'Ready' && uid === me.uid ) {
	                    me.trigger('ready');
	                } else if ( clients[ uid ] ) {
	                    clients[ uid ].trigger( type.toLowerCase(), evt, obj );
	                }
	    
	                // Base.log( evt, obj );
	            }
	    
	            // flash的接受器。
	            window[ jsreciver ] = function() {
	                var args = arguments;
	    
	                // 为了能捕获得到。
	                setTimeout(function() {
	                    handler.apply( null, args );
	                }, 1 );
	            };
	    
	            this.jsreciver = jsreciver;
	    
	            this.destroy = function() {
	                // @todo 删除池子中的所有实例
	                return destroy && destroy.apply( this, arguments );
	            };
	    
	            this.flashExec = function( comp, fn ) {
	                var flash = me.getFlash(),
	                    args = Base.slice( arguments, 2 );
	    
	                return flash.exec( this.uid, comp, fn, args );
	            };
	    
	            // @todo
	        }
	    
	        Base.inherits( Runtime, {
	            constructor: FlashRuntime,
	    
	            init: function() {
	                var container = this.getContainer(),
	                    opts = this.options,
	                    html;
	    
	                // if not the minimal height, shims are not initialized
	                // in older browsers (e.g FF3.6, IE6,7,8, Safari 4.0,5.0, etc)
	                container.css({
	                    position: 'absolute',
	                    top: '-8px',
	                    left: '-8px',
	                    width: '9px',
	                    height: '9px',
	                    overflow: 'hidden'
	                });
	    
	                // insert flash object
	                html = '<object id="' + this.uid + '" type="application/' +
	                        'x-shockwave-flash" data="' +  opts.swf + '" ';
	    
	                if ( Base.browser.ie ) {
	                    html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
	                }
	    
	                html += 'width="100%" height="100%" style="outline:0">'  +
	                    '<param name="movie" value="' + opts.swf + '" />' +
	                    '<param name="flashvars" value="uid=' + this.uid +
	                    '&jsreciver=' + this.jsreciver + '" />' +
	                    '<param name="wmode" value="transparent" />' +
	                    '<param name="allowscriptaccess" value="always" />' +
	                '</object>';
	    
	                container.html( html );
	            },
	    
	            getFlash: function() {
	                if ( this._flash ) {
	                    return this._flash;
	                }
	    
	                this._flash = $( '#' + this.uid ).get( 0 );
	                return this._flash;
	            }
	    
	        });
	    
	        FlashRuntime.register = function( name, component ) {
	            component = components[ name ] = Base.inherits( CompBase, $.extend({
	    
	                // @todo fix this later
	                flashExec: function() {
	                    var owner = this.owner,
	                        runtime = this.getRuntime();
	    
	                    return runtime.flashExec.apply( owner, arguments );
	                }
	            }, component ) );
	    
	            return component;
	        };
	    
	        if ( getFlashVersion() >= 11.4 ) {
	            Runtime.addRuntime( type, FlashRuntime );
	        }
	    
	        return FlashRuntime;
	    });
	    /**
	     * @fileOverview FilePicker
	     */
	    define('runtime/flash/filepicker',[
	        'base',
	        'runtime/flash/runtime'
	    ], function( Base, FlashRuntime ) {
	        var $ = Base.$;
	    
	        return FlashRuntime.register( 'FilePicker', {
	            init: function( opts ) {
	                var copy = $.extend({}, opts ),
	                    len, i;
	    
	                // 修复Flash再没有设置title的情况下无法弹出flash文件选择框的bug.
	                len = copy.accept && copy.accept.length;
	                for (  i = 0; i < len; i++ ) {
	                    if ( !copy.accept[ i ].title ) {
	                        copy.accept[ i ].title = 'Files';
	                    }
	                }
	    
	                delete copy.button;
	                delete copy.id;
	                delete copy.container;
	    
	                this.flashExec( 'FilePicker', 'init', copy );
	            },
	    
	            destroy: function() {
	                this.flashExec( 'FilePicker', 'destroy' );
	            }
	        });
	    });
	    /**
	     * @fileOverview 图片压缩
	     */
	    define('runtime/flash/image',[
	        'runtime/flash/runtime'
	    ], function( FlashRuntime ) {
	    
	        return FlashRuntime.register( 'Image', {
	            // init: function( options ) {
	            //     var owner = this.owner;
	    
	            //     this.flashExec( 'Image', 'init', options );
	            //     owner.on( 'load', function() {
	            //         debugger;
	            //     });
	            // },
	    
	            loadFromBlob: function( blob ) {
	                var owner = this.owner;
	    
	                owner.info() && this.flashExec( 'Image', 'info', owner.info() );
	                owner.meta() && this.flashExec( 'Image', 'meta', owner.meta() );
	    
	                this.flashExec( 'Image', 'loadFromBlob', blob.uid );
	            }
	        });
	    });
	    /**
	     * @fileOverview  Transport flash实现
	     */
	    define('runtime/flash/transport',[
	        'base',
	        'runtime/flash/runtime',
	        'runtime/client'
	    ], function( Base, FlashRuntime, RuntimeClient ) {
	        var $ = Base.$;
	    
	        return FlashRuntime.register( 'Transport', {
	            init: function() {
	                this._status = 0;
	                this._response = null;
	                this._responseJson = null;
	            },
	    
	            send: function() {
	                var owner = this.owner,
	                    opts = this.options,
	                    xhr = this._initAjax(),
	                    blob = owner._blob,
	                    server = opts.server,
	                    binary;
	    
	                xhr.connectRuntime( blob.ruid );
	    
	                if ( opts.sendAsBinary ) {
	                    server += (/\?/.test( server ) ? '&' : '?') +
	                            $.param( owner._formData );
	    
	                    binary = blob.uid;
	                } else {
	                    $.each( owner._formData, function( k, v ) {
	                        xhr.exec( 'append', k, v );
	                    });
	    
	                    xhr.exec( 'appendBlob', opts.fileVal, blob.uid,
	                            opts.filename || owner._formData.name || '' );
	                }
	    
	                this._setRequestHeader( xhr, opts.headers );
	                xhr.exec( 'send', {
	                    method: opts.method,
	                    url: server,
	                    forceURLStream: opts.forceURLStream,
	                    mimeType: 'application/octet-stream'
	                }, binary );
	            },
	    
	            getStatus: function() {
	                return this._status;
	            },
	    
	            getResponse: function() {
	                return this._response || '';
	            },
	    
	            getResponseAsJson: function() {
	                return this._responseJson;
	            },
	    
	            abort: function() {
	                var xhr = this._xhr;
	    
	                if ( xhr ) {
	                    xhr.exec('abort');
	                    xhr.destroy();
	                    this._xhr = xhr = null;
	                }
	            },
	    
	            destroy: function() {
	                this.abort();
	            },
	    
	            _initAjax: function() {
	                var me = this,
	                    xhr = new RuntimeClient('XMLHttpRequest');
	    
	                xhr.on( 'uploadprogress progress', function( e ) {
	                    var percent = e.loaded / e.total;
	                    percent = Math.min( 1, Math.max( 0, percent ) );
	                    return me.trigger( 'progress', percent );
	                });
	    
	                xhr.on( 'load', function() {
	                    var status = xhr.exec('getStatus'),
	                        readBody = false,
	                        err = '',
	                        p;
	    
	                    xhr.off();
	                    me._xhr = null;
	    
	                    if ( status >= 200 && status < 300 ) {
	                        readBody = true;
	                    } else if ( status >= 500 && status < 600 ) {
	                        readBody = true;
	                        err = 'server';
	                    } else {
	                        err = 'http';
	                    }
	    
	                    if ( readBody ) {
	                        me._response = xhr.exec('getResponse');
	                        me._response = decodeURIComponent( me._response );
	    
	                        // flash 处理可能存在 bug, 没辙只能靠 js 了
	                        // try {
	                        //     me._responseJson = xhr.exec('getResponseAsJson');
	                        // } catch ( error ) {
	                            
	                        p = window.JSON && window.JSON.parse || function( s ) {
	                            try {
	                                return new Function('return ' + s).call();
	                            } catch ( err ) {
	                                return {};
	                            }
	                        };
	                        me._responseJson  = me._response ? p(me._response) : {};
	                            
	                        // }
	                    }
	                    
	                    xhr.destroy();
	                    xhr = null;
	    
	                    return err ? me.trigger( 'error', err ) : me.trigger('load');
	                });
	    
	                xhr.on( 'error', function() {
	                    xhr.off();
	                    me._xhr = null;
	                    me.trigger( 'error', 'http' );
	                });
	    
	                me._xhr = xhr;
	                return xhr;
	            },
	    
	            _setRequestHeader: function( xhr, headers ) {
	                $.each( headers, function( key, val ) {
	                    xhr.exec( 'setRequestHeader', key, val );
	                });
	            }
	        });
	    });
	    /**
	     * @fileOverview Blob Html实现
	     */
	    define('runtime/flash/blob',[
	        'runtime/flash/runtime',
	        'lib/blob'
	    ], function( FlashRuntime, Blob ) {
	    
	        return FlashRuntime.register( 'Blob', {
	            slice: function( start, end ) {
	                var blob = this.flashExec( 'Blob', 'slice', start, end );
	    
	                return new Blob( blob.uid, blob );
	            }
	        });
	    });
	    /**
	     * @fileOverview  Md5 flash实现
	     */
	    define('runtime/flash/md5',[
	        'runtime/flash/runtime'
	    ], function( FlashRuntime ) {
	        
	        return FlashRuntime.register( 'Md5', {
	            init: function() {
	                // do nothing.
	            },
	    
	            loadFromBlob: function( blob ) {
	                return this.flashExec( 'Md5', 'loadFromBlob', blob.uid );
	            }
	        });
	    });
	    /**
	     * @fileOverview 完全版本。
	     */
	    define('preset/all',[
	        'base',
	    
	        // widgets
	        'widgets/filednd',
	        'widgets/filepaste',
	        'widgets/filepicker',
	        'widgets/image',
	        'widgets/queue',
	        'widgets/runtime',
	        'widgets/upload',
	        'widgets/validator',
	        'widgets/md5',
	    
	        // runtimes
	        // html5
	        'runtime/html5/blob',
	        'runtime/html5/dnd',
	        'runtime/html5/filepaste',
	        'runtime/html5/filepicker',
	        'runtime/html5/imagemeta/exif',
	        'runtime/html5/androidpatch',
	        'runtime/html5/image',
	        'runtime/html5/transport',
	        'runtime/html5/md5',
	    
	        // flash
	        'runtime/flash/filepicker',
	        'runtime/flash/image',
	        'runtime/flash/transport',
	        'runtime/flash/blob',
	        'runtime/flash/md5'
	    ], function( Base ) {
	        return Base;
	    });
	    /**
	     * @fileOverview 日志组件，主要用来收集错误信息，可以帮助 webuploader 更好的定位问题和发展。
	     *
	     * 如果您不想要启用此功能，请在打包的时候去掉 log 模块。
	     *
	     * 或者可以在初始化的时候通过 options.disableWidgets 属性禁用。
	     *
	     * 如：
	     * WebUploader.create({
	     *     ...
	     *
	     *     disableWidgets: 'log',
	     *
	     *     ...
	     * })
	     */
	    define('widgets/log',[
	        'base',
	        'uploader',
	        'widgets/widget'
	    ], function( Base, Uploader ) {
	        var $ = Base.$,
	            logUrl = ' http://static.tieba.baidu.com/tb/pms/img/st.gif??',
	            product = (location.hostname || location.host || 'protected').toLowerCase(),
	    
	            // 只针对 baidu 内部产品用户做统计功能。
	            enable = product && /baidu/i.exec(product),
	            base;
	    
	        if (!enable) {
	            return;
	        }
	    
	        base = {
	            dv: 3,
	            master: 'webuploader',
	            online: /test/.exec(product) ? 0 : 1,
	            module: '',
	            product: product,
	            type: 0
	        };
	    
	        function send(data) {
	            var obj = $.extend({}, base, data),
	                url = logUrl.replace(/^(.*)\?/, '$1' + $.param( obj )),
	                image = new Image();
	    
	            image.src = url;
	        }
	    
	        return Uploader.register({
	            name: 'log',
	    
	            init: function() {
	                var owner = this.owner,
	                    count = 0,
	                    size = 0;
	    
	                owner
	                    .on('error', function(code) {
	                        send({
	                            type: 2,
	                            c_error_code: code
	                        });
	                    })
	                    .on('uploadError', function(file, reason) {
	                        send({
	                            type: 2,
	                            c_error_code: 'UPLOAD_ERROR',
	                            c_reason: '' + reason
	                        });
	                    })
	                    .on('uploadComplete', function(file) {
	                        count++;
	                        size += file.size;
	                    }).
	                    on('uploadFinished', function() {
	                        send({
	                            c_count: count,
	                            c_size: size
	                        });
	                        count = size = 0;
	                    });
	    
	                send({
	                    c_usage: 1
	                });
	            }
	        });
	    });
	    /**
	     * @fileOverview Uploader上传类
	     */
	    define('webuploader',[
	        'preset/all',
	        'widgets/log'
	    ], function( preset ) {
	        return preset;
	    });
	    return require('webuploader');
	});


/***/ }
/******/ ]);