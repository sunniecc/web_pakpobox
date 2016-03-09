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
var DropDown = require('./common/drop-down');

(function(angular) {
    'use strict';
    angular.module('logistics_edit', ['ngSanitize'])
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
            console.log(id)
            if(id){
                $scope.update = true;
                var data = {
                    companyType: 'LOGISTICS_COMPANY',
                    companyId:id
                }
                Api.companyInfo(data, function (json) {
                    if(json.statusCode == 0 && json.result){
                        company = json.result;
                        $scope.name = company.name;
                        $scope.parent = company.parentCompany ? company.parentCompany.name : '';
                        $scope.parentValue = company.parentCompany ? company.parentCompany.id : '';
                        $scope.$apply();
                    }
                })
            }

            $scope.SubmitText = $scope.LSubmitValidate;
            $scope.submit = function () {

                $scope.submitDisabled = true;
                $scope.SubmitText = $scope.LSubmitValidating;
                var data = {
                    name: $scope.name,
                    parentCompany: {
                        id: $scope.parentValue
                    },
                    companyType: 'LOGISTICS_COMPANY'
                }
                if($scope.parent){
                    data.parentCompany = {
                        id: $scope.parentValue
                    };
                }
                if(id){
                    data.id = id;
                    Api.updateCompany(data, function (json) {
                        if(json.statusCode == 0){
                            location.href = 'logistics_user.html?id='+id;
                        }else{
                            $scope.submitDisabled = false;
                            $scope.SubmitText = $scope.LSubmitValidate;
                            Alert.show(errorCode[json.statusCode]);
                        }
                        $scope.$apply();
                    })
                }else{
                    Api.createCompany(data, function (json) {
                        if(json.statusCode == 0){
                            location.href = 'logistics_user.html?id='+json.result.id;
                        }else{
                            $scope.submitDisabled = false;
                            $scope.SubmitText = $scope.LSubmitValidate;
                            Alert.show(errorCode[json.statusCode]);
                        }
                        $scope.$apply();
                    })
                }
            }

            var dropDown = new DropDown({
                selector: '#parent',
                getData: function(value, callback){
                    var param = {
                        page:1,
                        maxCount:5,
                        companyType: 'LOGISTICS_COMPANY',
                        companyFuzzyName: value
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
                    $scope.parentValue = value;
                    $scope.$apply();
                }
            })
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