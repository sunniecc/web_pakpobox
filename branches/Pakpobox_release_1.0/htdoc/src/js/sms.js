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
var SmsList = require('raw!../tpl/smsList.html');

(function(angular) {
    'use strict';
    var myModule = angular.module('sms', ['ngSanitize']);

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
        $templateCache.put('smsList',SmsList);

        $scope.transformSmsStatu = function(status){
            if(status=='SEND_READY'){
                return $scope.LSmsStatusReady;
            }

            if(status=='SEND_FAILURE'){
                return $scope.LSmsStatusFail;
            }

            if(status=='SEND_SUCCESS'){
                return $scope.LSmsStatusSuc;
            }
            return '';
        }
        $scope.sms = {
            title : $scope.LSmsList,
            content:[
            ]
        };

        $scope.close = function () {
            window.close();
        }

        var expressId = Api.param('expressId');

        Api.getSmsInfo({'expressId': expressId}, function (json) {
            $scope.sms.content = [];
            var result = [];
            result = json.result.list;

            result && result.map(function (e,i) {
                var val = {};
                val.des = e?e.description:'';
                val.smsStatu = $scope.transformSmsStatu(e.smsStatus);
                val.text = e?e.content:'';
                val.time = e? '['+moment(e.createTimestamp).format('YYYY-MM-DD HH:mm')+']':'[]';
                $scope.sms.content.push(val);
            });

            $scope.$apply();

        })

    }])
        .filter('trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            }
        }]);

})(window.angular); $('body').show();