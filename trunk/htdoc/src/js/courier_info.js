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
    var myModule = angular.module('courier', ['ngSanitize']);

    myModule.controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
        $.extend($scope, Lang);
        Api.userInfo(function(json){
            if(json.statusCode != 0){
                location.href = 'login.html';
            }else{
                $scope.userrole = json.result.role, $scope.usertype = $scope[userType[json.result.role]];
                $scope.username = json.result.name;
                $scope.companyId = json.result.company.id;
                $scope.id = json.result.id;
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
            title : $scope.LPeopleInfo,
            content:[
            ]
        };

        Api.getPeopelDetails({'id':id}, function (json) {
            $scope.info.content = [];
            $scope.info.contactContent = [];
            var contentItem = {};
            var result = json.result;
            var details_role =result.role;
            //如果是员工，只能修改自己的信息,如果是和自己同等级的员工是不可以修改的
                if($scope.userrole=='ROOT'||$scope.userrole=='LOGISTICS_COMPANY_ADMIN'||$scope.userrole=='OPERATOR_ADMIN'){  
                    // window.location.reload();
                    if(details_role=="ROOT"){
                        if($scope.id==result.id){
                         $scope.info.title = $scope.LPeopleInfo + ' <a href="courier_edit.html?id=' + id + '"><small>>>' + $scope.LToEdit + '</small></a>';
                        }else{
                         $scope.info.title = $scope.LPeopleInfo+"<small>>></small>";
                        }
                    }
                    else if (details_role==$scope.userrole&&result.company.id==$scope.companyId) {
                        //是员工自己修改自己
                        if($scope.id==result.id){
                         $scope.info.title = $scope.LPeopleInfo + ' <a href="courier_edit.html?id=' + id + '"><small>>>' + $scope.LToEdit + '</small></a>';
                        }else{
                         $scope.info.title = $scope.LPeopleInfo+"<small>>></small>";
                        }
                    }
                    else{
                         $scope.info.title = $scope.LPeopleInfo + ' <a href="courier_edit.html?id=' + id + '"><small>>>' + $scope.LToEdit + '</small></a>';
                    }            
                }else{
                    $scope.info.title = $scope.LPeopleInfo+"<small>>></small>";
                }

            //登录名
            if(result.loginName){
                //如果是员工，只能修改自己的信息
                if($scope.userrole=='OPERATOR_USER'||$scope.userrole=='LOGISTICS_COMPANY_USER'){
                    if($scope.loginName != result.loginName){
                        $scope.info.title = $scope.LPeopleInfo;
                    }
                }
            }

            //编号
            if(result.name){
                $scope.info.content.push({key:$scope.LPeopleInfoName,value:result.name});
            }

            if(result.role){
                var role = 'NO';
                if(result.role=='OPERATOR_ADMIN'){
                    role = $scope.LOperatorAdmin
                }
                if(result.role=='OPERATOR_USER'){
                    role = $scope.LOperatorUser
                }
                if(result.role=='LOGISTICS_COMPANY_ADMIN'){
                    role = $scope.LLogisticsAdmin
                }
                if(result.role=='LOGISTICS_COMPANY_USER'){
                    role = $scope.LLogisticsUser
                }
                $scope.info.content.push({key:$scope.LPeopleType,value:role});
            }

            if(result.phoneNumber){
                $scope.info.content.push({key:$scope.LPeopleInfoPhone,value:result.phoneNumber});
            }

            if(result.wallets.length!=0){
                $scope.info.content.push({key:$scope.LPeopleInfoWallets,value:(result.wallets[0].currencyUnit+': '+result.wallets[0].balance)});
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