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

(function (angular) {
    'use strict';
    angular.module('business', ['ngSanitize'])
        .controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
            $.extend($scope, Lang);

            $templateCache.removeAll();
            $templateCache.put('header', Header);
            $templateCache.put('nav', Nav);
            $templateCache.put('table', Table);

            Api.userInfo(function (json) {
                if (json.statusCode != 0) {
                    location.href = 'login.html';
                } else {
                    $scope.userrole = json.result.role, $scope.usertype = $scope[userType[json.result.role]];
                    $scope.username = json.result.name;
                    $scope.$apply();
                }
            })

            $scope.imgList = [
                {
                    name: 'business_1.jpg',
                    url: 'assets/img/business_1.jpg'
                },
                {
                    name: 'business_2.jpg',
                    url: 'assets/img/business_2.jpg'
                },
                {
                    name: 'business_3.jpg',
                    url: 'assets/img/business_3.jpg'
                },
                {
                    name: 'business_4.jpg',
                    url: 'assets/img/business_4.jpg'
                },
            ]


            $scope.submit = function () {

                if($scope.newPassword != $scope.reNewPassword){
                    Alert.show($scope.LPasswordInconsistent);
                }

                var data = {
                    oldPassword: $scope.oldPassword,
                    newPassword: $scope.newPassword,
                }



            }
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