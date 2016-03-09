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
var Alert = require('./common/alert');
var errorCode = require('./common/errorCode');
var Api = require('./common/api');
var userType = require('./common/usertype');
var Lang = require('./common/language');
var Header = require('raw!../tpl/Header.html');
var Nav = require('raw!../tpl/nav.html');
var Table = require('raw!../tpl/table.html');

(function(angular) {
    'use strict';
    angular.module('logistics_user', ['ngSanitize'])
        .controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
            $.extend($scope, Lang);

            $templateCache.removeAll();
            $templateCache.put('header',Header);
            $templateCache.put('nav',Nav);
            $templateCache.put('table',Table);

            Api.userInfo(function(json){
                if(json.statusCode != 0){
                    location.href = 'login.html';
                }else{
                    $scope.userrole = json.result.role, $scope.usertype = $scope[userType[json.result.role]];
                    $scope.username = json.result.name;
                    $scope.$apply();
                }
            })

            var id = Api.param('id'), company;
            if(id){
                $scope.update = true;
                var data = {
                    companyType: 'LOGISTICS_COMPANY',
                    companyId:id
                }
                Api.companyInfo(data, function (json) {
                    if(json.statusCode == 0 && json.result){
                        $scope.loginName = json.result.contactName;
                        $scope.phoneNumber = json.result.contactPhoneNumber;
                        $scope.$apply();
                    }
                })
            }

            $scope.SubmitText = $scope.LSubmit;
            $scope.submit = function () {
                if($scope.password != $scope.repassword){
                    Alert.show('密码不一致，请重新输入！');
                    return;
                }

                $scope.submitDisabled = true;
                $scope.SubmitText = $scope.LSubmitLoading;

                var data = {
                    contactName: $scope.loginName,
                    contactPhoneNumber: $scope.phoneNumber,
                    //company: JSON.stringify(company),
                    id: id,
                    role: 'LOGISTICS_COMPANY_USER'
                }

                Api.companyUpdate(data, function (json) {
                    if(json.statusCode == 0){
                        location.href = 'logistics.html';
                    }else{
                        $scope.submitDisabled = false;
                        $scope.SubmitText = $scope.LSubmit;
                        Alert.show(errorCode[json.statusCode]);
                        $scope.$apply();
                    }
                })



            }
        }])
        .filter('trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            }
        }]).directive('placeholder', ['$compile', function($compile){
            return {
                restrict: 'A',
                scope: {},
                link: function(scope, ele, attr) {
                    var input = document.createElement('input');
                    var isSupportPlaceholder = 'placeholder' in input;
                    if (!isSupportPlaceholder) {
                        var fakePlaceholder = angular.element(
                            '<span class="placeholder">' + attr['placeholder'] + '</span>');
                        fakePlaceholder.on('click', function(e){
                            e.stopPropagation();
                            ele.focus();
                        });
                        ele.before(fakePlaceholder);
                        $compile(fakePlaceholder)(scope);
                        ele.on('focus', function(){
                            fakePlaceholder.hide();
                        }).on('blur', function(){
                            if (ele.val() === '') {
                                fakePlaceholder.show();
                            }
                        });
                    }
                }
            };
        }]);;
})(window.angular); $('body').show();