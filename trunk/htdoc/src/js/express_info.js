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
                console.log($scope.userrole)
                //当是运营商公司人员登录，查看快件件信息时，修改电话号码的按钮隐藏
                if($scope.userrole=="OPERATOR_ADMIN"||$scope.userrole=="OPERATOR_ADMIN"){
                     $("#DetailModify").html("");

                }else{
                    $("#DetailModify").html($scope.LDetailModify);
                }
                $scope.$apply();
            }
        })
        $scope.logout = Api.logout;
        $scope.showTipsType = 1;  //1代表请求中，2代表是返回为空。
        var expressId = Api.param('id');

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
            $scope.takeUserPhone = $scope.takeUserPhoneEditor;
            $scope.onLoading = true;
            $scope.onEdit = false;
            $scope.onNormal = false;
            $scope.modifyPhoneNum();
        }
        $scope.modifyPhoneNum = function(){
            var data = {
                'id':expressId,
                'takeUserPhoneNumber':$scope.takeUserPhoneEditor,
                'previousPhoneNumber':$scope.takeUserPhone
            }
            Api.modifyExpress(data,function(json){
                //对失败的情况做一下处理
                if(json.statusCode!= 0){
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

        $scope.statusTransformToWord = function(status){
            if(status == 1){
                return $scope.LExpressStatuStoring;
            }
            if(status == 2){
                return $scope.LExpressStatuStore;
            }
            if(status == 3){
                return $scope.LExpressStatuStored;
            }
            if(status == 5){
                return $scope.LExpressStatuCourierPickup;
            }
            if(status == 6){
                return $scope.LExpressStatuManagerPickup;
            }
        }

        $scope.close = function () {
            window.close();
        }

        $scope.showTipsType = 1;
        Api.getExpress({'expressId': expressId}, function (json) {
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

            //快件类型
            if(result[0].expressType){
                if(result[0].expressType == 'COURIER_STORE'){
                    $scope.info.content.push({key:$scope.LImportExpressType,value:$scope.LImportCourier});
                    if(!(result[0].status==1||result[0].status==2)){
                        $scope.LDetailModify = '';
                    }
                }
                if(result[0].expressType == 'CUSTOMER_STORE'){
                    $scope.info.content.push({key:$scope.LImportExpressType,value:$scope.LImportSend});
                    $scope.LDetailModify = '';
                }
                if(result[0].expressType == 'CUSTOMER_REJECT'){
                    $scope.info.content.push({key:$scope.LImportExpressType,value:$scope.LImportReturn});
                    $scope.LDetailModify = '';
                }

            }

            //编号
            if(result[0].expressNumber){
                $scope.info.content.push({key:$scope.LTableOrderNumber,value:result[0].expressNumber});
            }

            //快件编号
            if(result[0].customerStoreNumber){
                $scope.info.content.push({key:$scope.LTableOrderNumber,value:result[0].customerStoreNumber});
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

             //创建时间
            if(result[0].createTime){
                $scope.info.content.push({key:$scope.LDetailCreateTime,value:moment(result[0].createTime).format('YYYY-MM-DD HH:mm')});
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
                //当是物流公司人员登录，查看已存逾期件信息时，修改电话号码的按钮隐藏
                if("2"==result[0].status){
                    if ("LOGISTICS_COMPANY_ADMIN"==$scope.userrole||"LOGISTICS_COMPANY_USER"==$scope.userrole) {
                         if(result[0].overdueTime<(new Date).valueOf()){
                             $("#DetailModify").html("")
                         }
                    };
                }
            }

            //快件状态
            if(result[0].status){
                $scope.info.content.push({key:$scope.LDetailStatu,value:$scope.statusTransformToWord(result[0].status)});
                //当是运营商公司人员登录，查看快件件信息时，修改电话号码的按钮隐藏
                if(result[0].status==1||result[0].status==2){
                     $("#DetailModify").html($scope.LDetailModify);

                }else{
                    $("#DetailModify").html("");
                }
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