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
var DropDown = require('./common/drop-down');

(function(angular) {
    'use strict';
    angular.module('courier_edit', ['ngSanitize'])
        .controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
            $.extend($scope, Lang);

            $templateCache.removeAll();
            $templateCache.put('header',Header);
            $templateCache.put('nav',Nav);

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

            var id = Api.param('id'), company;
            console.log(id)
            if(id){
                $scope.update = true;
                var data = {
                    id: id
                }
                Api.getPeopelDetails(data, function (json) {
                    if(json.statusCode == 0 && json.result){
                        $scope.currencPeopleType = json.result.role;
                        $scope.loginName = json.result.loginName;
                        $scope.name = json.result.name;
                        $scope.phoneNumber = json.result.phoneNumber;
                        $scope.company = json.result.company.name;
                        $scope.companyValue = json.result.company.id;
                        $scope.$apply();
                    }
                })
            }

            $scope.companyList = [];
            var data = {
                'page':1,
                'length':100,
                'companyType':'OPERATOR',
            }
            Api.companyQuery(data, function (json) {
                if(json.statusCode == 0){
                    $scope.companyList = json.result.resultList;
                    $scope.$apply();
                }
            })

            $scope.submit = function () {

                if(!$scope.currencPeopleType){
                    Alert.show($scope.LPleaseChoose + $scope.LPeopleType);
                    $scope.peopleTypeError = true;
                    return;
                }
                //if(!$scope.loginName){
                //    Alert.show($scope.LLoginname + $scope.LNotEmpty);
                //    $scope.loginNameError = true;
                //    return;
                //}else if($scope.loginName.length > 50){
                //    Alert.show($scope.LLoginname + $scope.LFormatError);
                //    $scope.loginNameError = true;
                //    return;
                //}
                //if(!$scope.password){
                //    Alert.show($scope.LUPasswordPlaceholer + $scope.LNotEmpty);
                //    $scope.passwordError = true;
                //    return;
                //}else if($scope.password.length > 50){
                //    Alert.show($scope.LUPasswordPlaceholer + $scope.LFormatError);
                //    $scope.passwordError = true;
                //    return;
                //}
                //if($scope.repassword != $scope.password){
                //    Alert.show($scope.LResetPassword + $scope.LInconformity);
                //    $scope.repasswordError = true;
                //    return;
                //}
                if(!$scope.name){
                    Alert.show($scope.LUsername + $scope.LNotEmpty);
                    $scope.nameError = true;
                    return;
                }else if($scope.name.length > 50){
                    Alert.show($scope.LUsername + $scope.LFormatError);
                    $scope.nameError = true;
                    return;
                }
                if(!$scope.phoneNumber){
                    Alert.show($scope.LPhoneNumber + $scope.LNotEmpty);
                    $scope.phoneNumberError = true;
                    return;
                }else if($scope.phoneNumber.length > 50){
                    Alert.show($scope.LPhoneNumber + $scope.LFormatError);
                    $scope.phoneNumberError = true;
                    return;
                }
                if(!$scope.companyValue){
                    Alert.show($scope.LDetailOperatorsId + $scope.LNotEmpty);
                    $scope.companyError = true;
                    return;
                }

                var data = {
                    loginName: $scope.loginName,
                    password: $scope.password,
                    name: $scope.name,
                    phoneNumber: $scope.phoneNumber,
                    role: $scope.currencPeopleType,
                    company: {
                        id: $scope.companyValue
                    }
                }
                if(id){
                    data.id = id;

                    Api.updateStaff(data, function (json) {
                        if(json.statusCode == 0){
                            location.href = 'courier.html';
                        }else{
                            Alert.show(errorCode[json.statusCode]);
                        }
                    })
                }else{
                    if($scope.parent){
                        data.parentCompany = $scope.parent;
                    }
                    Api.createStaff(data, function (json) {
                        if(json.statusCode == 0){
                            location.href = 'courier.html';
                        }else{
                            Alert.show(errorCode[json.statusCode]);
                        }
                    })
                }
            }
            var dropDown = new DropDown({
                selector: '#compnay',
                getData: function(value, callback){
                    var param = {
                        page:1,
                        maxCount:5,
                        companyFuzzyName: value
                    }
                    if($scope.currencPeopleType == 'OPERATOR_ADMIN' || $scope.currencPeopleType == 'OPERATOR_USER'){
                        param.companyType = 'OPERATOR';
                    }else if($scope.currencPeopleType == 'LOGISTICS_COMPANY_ADMIN' || $scope.currencPeopleType == 'LOGISTICS_COMPANY_USER'){
                        param.companyType = 'LOGISTICS_COMPANY';
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