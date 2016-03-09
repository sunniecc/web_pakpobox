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
    var myModule = angular.module('operators', ['ngSanitize']);

    myModule.controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
        $.extend($scope, Lang);

        Api.userInfo(function(json){
            if(json.statusCode != 0){
                location.href = 'login.html';
            }else{
                $scope.userrole = json.result.role, $scope.usertype = $scope[userType[json.result.role]];
                $scope.username = json.result.name;
                if($scope.userrole=="OPERATOR_USER"){
                    $scope.info.title=$scope.LOperatorInfo + ' <a href="operator_edit.html?id=' + id + '"><small>>></small></a>';
                    $scope.info.secondTitle=$scope.LLinkmanInfo  + ' <a href="operator_user.html?id=' + id + '"><small>>></small></a>';
                }
                else{
                    $scope.info.title=$scope.LOperatorInfo + ' <a href="operator_edit.html?id=' + id + '"><small>>>' + $scope.LToEdit + '</small></a>';
                    $scope.info.secondTitle=$scope.LLinkmanInfo  + ' <a href="operator_user.html?id=' + id + '"><small>>>' + $scope.LToEdit + '</small></a>';
                }
                $scope.$apply();
            }
        })
        $scope.logout = Api.logout;

        $templateCache.put('header',Header);
        $templateCache.put('nav',Nav);
        $templateCache.put('info',Info);

        $scope.close = function () {
            window.close();
        }

        var id = Api.param('id');

        $scope.info = {
            content:[
            ]
        };

        Api.companyInfo({companyInfo: 'OPERATOR',companyId:id}, function (json) {
            $scope.info.content = [];
            $scope.info.contactContent = [];
            var contentItem = {};
            var result = json.result;

            //公司ID
            //if(result.id){
            //    $scope.info.content.push({key:$scope.LDetailOperatorsId,value:result.id});
            //}

            //空行
            //$scope.info.content.push({key:'',value:''});

            //公司名称
            if(result.name){
                $scope.info.content.push({key:$scope.LDetailOperatorsName,value:result.name});
            }

            //公司等级
            if(result.level){
                var levelWord = '';
                if(result.level == 1){
                    levelWord = $scope.LLevelOne;
                }
                if(result.level == 2){
                    levelWord = $scope.LLevelTwo;
                }
                if(result.level == 3){
                    levelWord = $scope.LLevelThree;
                }
                $scope.info.content.push({key:$scope.LDetailOperatorsLevel,value:levelWord});
            }

            ////上级公司ID
            //if(result.parentCompany){
            //    $scope.info.content.push({key:$scope.LDetailOperatorsParentId,value:result.parentCompany?result.parentCompany.id:''});
            //}
            //空行
            //$scope.info.content.push({key:'',value:''});

            //上级公司名称
            if(result.parentCompany){
                $scope.info.content.push({key:$scope.LDetailOperatorsParentName,value:result.parentCompany?result.parentCompany.name:''});
            }

            //联系人信息
            if(result.contactName){
                $scope.info.contactContent.push({key:$scope.LDetailOperatorsContact,value:result.contactName});
            }

            //联系人手机号
            if(result.contactPhoneNumber){
                for(var i=0; i< result.contactPhoneNumber.length; i++){
                    $scope.info.contactContent.push({key:$scope.LDetailOperatorsContactPhone,value:result.contactPhoneNumber[i]});
                }
            }

            //联系人邮箱
            if(result.contactEmail){ 
                for(var i=0; i< result.contactEmail.length; i++){
                    $scope.info.contactContent.push({key:$scope.LDetailOperatorsContactMail,value:result.contactEmail[i]});
                }
            }

            $scope.$apply();
        })

    }])
        .filter('trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            }
        }]);

})(window.angular); $('body').show();