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
                    $scope.usercompanyid = json.result.company.id;
                    $scope.usercompanyname = json.result.company.name;
                    $scope.usercompanylevel =json.result.company.level;
                    if($scope.userrole=="ROOT")
                    {
                        $scope.usercompanylevel =0;
                    }
                    $scope.id =json.result.id;

                    //存放角色的集合
                    if($scope.userrole=="OPERATOR_ADMIN")
                    {
                    //如果是OPERATOR进入courier_edit页面
                        $scope.peopleTypeList = [
                        {id:'OPERATOR_ADMIN',peopleType:$scope.LUserTypeOpratorAdmin},
                        {id:'OPERATOR_USER',peopleType:$scope.LUserTypeOprator}];              

                    }else if($scope.userrole=="LOGISTICS_COMPANY_ADMIN"){
                    //如果是LOGISTICS进入courier_edit页面
                        $scope.peopleTypeList = [
                        {id:'LOGISTICS_COMPANY_ADMIN',peopleType:$scope.LUserTypeLogisticsAdmin},
                        {id:'LOGISTICS_COMPANY_USER',peopleType:$scope.LUserTypeLogistics}];
                       
                    }else{
                    //如果是root进入courier_edit页面
                        $scope.peopleTypeList = [
                        {id:'LOGISTICS_COMPANY_ADMIN',peopleType:$scope.LUserTypeLogisticsAdmin},
                        {id:'LOGISTICS_COMPANY_USER',peopleType:$scope.LUserTypeLogistics},
                        {id:'OPERATOR_ADMIN',peopleType:$scope.LUserTypeOpratorAdmin},
                        {id:'OPERATOR_USER',peopleType:$scope.LUserTypeOprator}];
                    }
                    $scope.$apply();
                }
            })
            $scope.logout = Api.logout;
            //存放公司的集合
            $scope.companyList = [];
            //其他页面跳转到这个页面传过来的人员id（修改人员信息时才会有这个id）
            var id = Api.param('id'), company;
            //查询公司信息时用到的查询信息
            var data = {
                'page':1,
                'length':100,
                'companyType':'OPERATOR',
                'startLevel':$scope.usercompanylevel,
                'id':id,
            }
            //修改时拿到用户的电话号码
            var phoneNumberValue = '';
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
                        phoneNumberValue = json.result.phoneNumber;
                        if (json.result.role!="ROOT") {
                        $scope.company = json.result.company.name;
                        $scope.companyValue = json.result.company.id;
                        };
                       
                        if(id==$scope.id){
                            //处理不同权限的员工修改自己
                            if($scope.userrole=="LOGISTICS_COMPANY_ADMIN"||$scope.userrole=="OPERATOR_ADMIN"||$scope.userrole=="ROOT"){
                                $("#peopleType").attr("disabled",true);
                                 $("#peopleType").css("background","#e2e1e1");
                                 $("#company").attr("disabled",true);
                                 $("#company").css("background","#e2e1e1"); 
                                 $("#noroot_company").attr("disabled",true);
                                 $("#noroot_company").css("background","#e2e1e1"); 
                                  
                            }               
                        }else if(json.result.role=="LOGISTICS_COMPANY_ADMIN"||json.result.role=="OPERATOR_ADMIN"){   
                                 //修改低等级管理员   
                                data.startLevel = $scope.usercompanylevel + 1;
                                Api.companyQuery(data, function (json) {
                                        if(json.statusCode == 0){
                                            $scope.companyList = json.result.resultList;
                                            if($scope.companyList.length<=0)
                                            {
                                                $("#company").val('')
                                            }
                                            $scope.$apply();                    
                                        }
                                    })              
                             $("#peopleType").change(function(){
                              var operator=$("#peopleType option:selected").val()
                              if(operator=="LOGISTICS_COMPANY_ADMIN"||operator=="OPERATOR_ADMIN"){
                               data.startLevel = $scope.usercompanylevel + 1;
                                }  else{
                                    data.startLevel = $scope.usercompanylevel;                                 
                                }
                                Api.companyQuery(data, function (json) {
                                        if(json.statusCode == 0){
                                            $scope.companyList = json.result.resultList;
                                             if($scope.companyList.length<=0)
                                            {
                                                $("#company").val('')
                                            }
                                            $scope.$apply();                    
                                        }
                                    })
                            })
                        }else{
                            //处理管理员修改其他员工
                            $("#peopleType").change(function(){
                               var operator=$("#peopleType option:selected").val()
                            
                                if(operator=="LOGISTICS_COMPANY_ADMIN"||operator=="OPERATOR_ADMIN"){
                                    data.startLevel = $scope.usercompanylevel + 1;
                                }
                                else{
                                    data.startLevel = $scope.usercompanylevel; 
                                }
                                 Api.companyQuery(data, function (json) {
                                        if(json.statusCode == 0){
                                            $scope.companyList = json.result.resultList;
                                             if($scope.companyList.length<=0)
                                            {
                                                $("#company").val('')
                                            }
                                            $scope.$apply();                    
                                        }
                                    })
                            });
                        }
                        $scope.$apply();
                    }
                })
            }
            else{

                             $("#peopleType").change(function(){
                              var operator=$("#peopleType option:selected").val()
                              if(operator=="LOGISTICS_COMPANY_ADMIN"||operator=="OPERATOR_ADMIN"){
                                    data.startLevel = $scope.usercompanylevel + 1;
                                    data.id = $scope.id;
                                } else{
                                    data.startLevel = $scope.usercompanylevel;
                                    data.id = $scope.id;
                                }
                                Api.companyQuery(data, function (json) {
                                        if(json.statusCode == 0){
                                            $scope.companyList = json.result.resultList;
                                              if($scope.companyList.length<=0)
                                            {
                                                $("#company").val('')
                                            }
                                            $scope.$apply();                    
                                        }
                                })

                            })                           
            }
            $scope.submit = function () {
                // if($scope.userrole!="ROOT"){
                //     if(!$scope.currencPeopleType){
                //         Alert.show($scope.LPleaseChoose + $scope.LPeopleType);
                //         $scope.peopleTypeError = true;
                //         return;
                //     }
                // }
                if(!$scope.currencPeopleType){
                    Alert.show($scope.LPeopleType + $scope.LNotEmpty);
                    $scope.peopleTypeError = true;
                    return;
                }else if(!$scope.loginName){
                    Alert.show($scope.LLoginname + $scope.LNotEmpty);
                    $scope.loginNameError = true;
                    return;
                }else if($scope.loginName.length > 50){
                    Alert.show($scope.LLoginname + $scope.LFormatError);
                    $scope.loginNameError = true;
                    return;
                }
                if(!$scope.password){
                    Alert.show($scope.LUPasswordPlaceholer + $scope.LNotEmpty);
                    $scope.passwordError = true;
                    return;
                }else if($scope.password.length > 50){
                    Alert.show($scope.LUPasswordPlaceholer + $scope.LFormatError);
                    $scope.passwordError = true;
                    return;
                }
                if($scope.repassword != $scope.password){
                    Alert.show($scope.LResetPassword + $scope.LInconformity);
                    $scope.repasswordError = true;
                    return;
                }
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
                if($scope.userrole!="ROOT"){
                    if(!$scope.companyValue){
                        Alert.show($scope.LCompanyName + $scope.LNotEmpty);
                        $scope.companyError = true;
                        return;
                    }
                }
                var loginName = {
                    loginName: $scope.loginName
                }
                var phoneNumber = {
                    phoneNumber: $scope.phoneNumber
                }
                var addUser_loginName = false;
                var addUser_phoneNumber =false;
                //判断用户名是否存在或用户电话号码是否存在！
                 if($scope.loginName!=undefined&&$scope.loginName!=""&&$scope.loginName!=null&&$scope.phoneNumber!=undefined&&$scope.phoneNumber!=""&&$scope.phoneNumber!=null)
                { 

                    Api.loginNameExist(loginName,function (json) {
                        if(id){
                            addUser_loginName = true;
                        }
                        else{
                            if(json.statusCode == 0)
                            {
                                if(json.result.result=="1"){
                                    Alert.show($scope.LLoginname+" '"+$scope.loginName+"' "+$scope.LExists+$scope.LRename);
                                    return;
                                }else{
                                addUser_loginName = true;
                                }
                            }
                        }
                        if(addUser_loginName){
                             Api.phoneExist(phoneNumber,function (json) {
                                if($scope.phoneNumber == phoneNumberValue){ 
                                    addUser_phoneNumber =true;
                                }else{
                                    if(json.statusCode == 0)
                                    {
                                        if(json.result.result=="1"){
                                            addUser_phoneNumber =false;
                                            Alert.show($scope.LPhoneNumber+" '"+$scope.phoneNumber+"' "+$scope.LExists+$scope.LRename);
                                            return;
                                        }
                                        else{
                                            addUser_phoneNumber =true;
                                        }
                                     }
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
                            if(addUser_loginName&&addUser_phoneNumber){
                                if(id){
                                    data.id = id;
                                    Api.updateStaff(data, function (json) {
                                        if(json.statusCode == 0){
                                            location.href = 'courier.html';
                                        }else{
                                            // Alert.show(errorCode[json.statusCode]);
                                            Alert.show(json.msg.errorMessage);
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
                                            // Alert.show(errorCode[json.statusCode]);
                                            Alert.show(json.msg.errorMessage);
                                        }
                                    })
                                }
                            }
                        })

                        }
                    })
                }
                
            }
            var dropDown = new DropDown({
                selector: '#company',
                getData: function(value, callback){
                    var param = {
                        page:1,
                        maxCount:5,
                        companyFuzzyName: value,
                        startLevel: $scope.usercompanylevel
                    }
                    if($scope.currencPeopleType == 'OPERATOR_ADMIN' || $scope.currencPeopleType == 'OPERATOR_USER'){
                        param.companyType = 'OPERATOR';
                    }else if($scope.currencPeopleType == 'LOGISTICS_COMPANY_ADMIN' || $scope.currencPeopleType == 'LOGISTICS_COMPANY_USER'){
                        param.companyType = 'LOGISTICS_COMPANY';
                    }
            
                    var operator=$("#peopleType option:selected").val()
                    if(operator=="LOGISTICS_COMPANY_ADMIN"||operator=="OPERATOR_ADMIN"){
                               param.startLevel = $scope.usercompanylevel + 1;}
                     $("#peopleType").change(function(){
                              if(operator=="LOGISTICS_COMPANY_ADMIN"||operator=="OPERATOR_ADMIN"){
                               param.startLevel = $scope.usercompanylevel + 1;}
                           })
                    
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