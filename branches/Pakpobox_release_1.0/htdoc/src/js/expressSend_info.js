/**
 * @fileOverview index.js
 * @version 1.0.0
 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
 * @date 2015/08/15
 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
 * @see [link]
 *
 */

require('./lib/angular/angular-sanitize');
var Api = require('./common/api');
var userType = require('./common/usertype');
var Lang = require('./common/language');
var Header = require('raw!../tpl/Header.html');
var Nav = require('raw!../tpl/nav.html');
var Info = require('raw!../tpl/info.html');

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