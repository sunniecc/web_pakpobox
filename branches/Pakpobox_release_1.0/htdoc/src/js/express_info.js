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
var Alert = require('./common/alert');

(function(angular) {
    'use strict';
    angular.module('express', ['ngSanitize'])
        .controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
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
        $scope.showTipsType = 1;  //1代表请求中，2代表是返回为空。
        var expressNumber = Api.param('expressNumber');

        $templateCache.put('header',Header);
        $templateCache.put('nav',Nav);
        $templateCache.put('info',Info);

        $scope.info = {
            title : $scope.LExpressInfo,
            secondTitle : $scope.LLinkmanInfo,
            content:[
            ]
        };
        $scope.msgUrl = '';

        $scope.checkMsg = function(){
            window.open($scope.msgUrl);
        }

        //取件人手机号
        $scope.showTakeUserPhone = false;
        $scope.onEdit = false;
        $scope.onNormal = true;
        $scope.onLoading = false;
        $scope.takeUserPhone = '88888888';
        $scope.takeUserPhoneEditor = '';
        $scope.modifyPhone = function(){
            $scope.takeUserPhoneEditor = $scope.takeUserPhone;
            $scope.onEdit = true;
            $scope.onNormal = false;
        }
        $scope.confirmModify = function(node){
            $scope.takeUserPhoneEditor = this.takeUserPhoneEditor;
            $scope.onLoading = true;
            $scope.onEdit = false;
            $scope.onNormal = false;
            $scope.modifyPhoneNum();
        }
        $scope.modifyPhoneNum = function(){
            var data = {
                'expressNumber':expressNumber,
                'takeUserPhoneNumber':$scope.takeUserPhoneEditor,
                'previousPhoneNumber':$scope.takeUserPhone
            }
            Api.modifyExpress(data,function(json){
                //对失败的情况做一下处理
                if(json.statusCode!= 0){
                    //Alert.show($scope.LResponseError);
                    $scope.onLoading = false;
                    $scope.onEdit = false;
                    $scope.onNormal = true;
                    $scope.$apply();
                    return;
                }
                $scope.takeUserPhone = json.result.takeUserPhoneNumber;
                $scope.onLoading = false;
                $scope.onEdit = false;
                $scope.onNormal = true;
                $scope.$apply();
            });
        }


        $scope.close = function () {
            window.close();
        }

        $scope.showTipsType = 1;
        Api.getExpress({'expressNumber': expressNumber}, function (json) {
            $scope.info.content = [];
            $scope.info.contactContent = [];

            var result = json.result.resultList;
            if(!result[0]){
                $scope.showTipsType = 2;
                $scope.$apply();
                return;
            }else{
                $scope.showTipsType = 0;
            }
            //编号
            if(result[0].expressNumber){
                $scope.info.content.push({key:$scope.LTableOrderNumber,value:result[0].expressNumber});
            }

            //电商名称
            if(result[0].electronicCommerce){
                $scope.info.content.push({key:$scope.LElectronicCommerceName,value:result[0].electronicCommerce.name});
            }

            //派宝箱名称
            if(result[0].mouth){
                $scope.info.content.push({key:$scope.LDetailPakpoboxName,value:result[0].mouth.box.name});
            }

            //派宝箱编号
            if(result[0].mouth){
                $scope.info.content.push({key:$scope.LDetailPakpobox,value:result[0].mouth.box.orderNo});
            }

            //派宝箱隔口编号
            if(result[0].mouth){
                $scope.info.content.push({key:$scope.LDetailPakpoboxMouth,value:result[0].mouth.number});
            }

            //取件人
            if(result[0].staffTakenUser){
                $scope.info.contactContent.push({key:$scope.LDetailTakerName,value:result[0].staffTakenUser.name});
            }

            //取件人手机
            if(result[0].takeUserPhoneNumber){
                $scope.showTakeUserPhone = true;
                $scope.takeUserPhone = result[0].takeUserPhoneNumber;
                //$scope.info.contactContent.push({key:$scope.LDetailTakerPhone,value:result[0].takeUserPhoneNumber});
            }


            //存件人姓名
            if(result[0].storeUser){
                $scope.info.contactContent.push({key:$scope.LDetailStoreName,value:result[0].storeUser.name});
            }

            //存件人手机
            if(result[0].storeUser){
                $scope.info.contactContent.push({key:$scope.LDetailStorePhone,value:result[0].storeUser.phoneNumber});
            }

            //存件时间
            if(result[0].storeTime){
                $scope.info.content.push({key:$scope.LDetailStoreTime,value:moment(result[0].storeTime).format('YYYY-MM-DD HH:mm')});
            }


            //取件时间
            if(result[0].takeTime){
                $scope.info.content.push({key:$scope.LDetailTakeTime,value:moment(result[0].takeTime).format('YYYY-MM-DD HH:mm')});
            }


            //到期时间
            if(result[0].overdueTime){
                $scope.info.content.push({key:$scope.LDetailOverTime,value:moment(result[0].overdueTime).format('YYYY-MM-DD HH:mm')});

            }

            //快件状态
            if(result[0].status){
                $scope.info.content.push({key:$scope.LDetailStatu,value:result[0].status});
            }

            //验证码
            if(result[0].validateCode){
                $scope.info.content.push({key:$scope.LDetailValidation,value:result[0].validateCode});
            }

            //验证码
            if(result[0].id){
                $scope.showMsg = true;
                $scope.msgUrl = 'sms.html?expressId='+result[0].id;
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