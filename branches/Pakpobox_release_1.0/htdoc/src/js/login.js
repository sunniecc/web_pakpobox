/**
 * @fileOverview login.js
 * @version 1.0.0
 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
 * @date 2015/08/15
 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
 * @see [link]
 *
 */

require('./lib/angular/angular-sanitize');
var Api = require('./common/api');
var Lang = require('./common/language');
var Header = require('raw!../tpl/Header.html');
var Alert = require('./common/alert');

(function(angular) {
    'use strict';
    angular.module('login', ['ngSanitize'])
        .controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
            $.extend($scope, Lang);

            Api.userInfo(function(json){
                if(json.statusCode == 0){
                    location.href = 'express.html';
                }
            })

            var submit = function () {
                if(!$scope.username || !$scope.password){
                    Alert.show('用户名密码不能为空！')
                    return;
                }
                var param = {
                    loginName: $scope.username,
                    password: $scope.password
                }
                Api.login(param, function(json){
                    if(json.statusCode == 0){
                        location.href = 'index.html';
                    }else if(json.statusCode == -2){
                        Alert.show('用户名或密码错误！');
                    }
                })
            }
            $scope.submit = submit;
            $scope.keypress = function(e){
                if(e.keyCode == 13){
                    submit();
                }
            }
        }])
        .filter('trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            }
        }]);
})(window.angular); $('body').show();