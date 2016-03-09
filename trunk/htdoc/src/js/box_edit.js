/**
 * @fileOverview box_edit.js
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
var BoxSelector = require('./common/box-selector');
var DropDown = require('./common/drop-down');
var Header = require('raw!../tpl/Header.html');
var Box = require('raw!../tpl/box.html');


(function(angular) {
    'use strict';
    var myModule = angular.module('express', ['ngSanitize']);

    myModule.controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
        $.extend($scope, Lang);

        Api.userInfo(function(json){
            if(json.statusCode != 0){
                location.href = 'login.html';
            }else{
                $scope.userrole = json.result.role, $scope.usertype = $scope[userType[json.result.role]];
                console.log($scope.usertype)
                $scope.username = json.result.name;
                $scope.$apply();
            }
        });

        Api.queryBoxType(function(json){
            if(json.statusCode != 0){
                Alert.show($scope.LResponseError);
            }else{
                var typeList = json.result.list;
                typeList && typeList.map(function (e,i) {
                    typeMap[e.name] = e.id;
                    typeReMap[e.id] = e.name;
                });
            }
        });

        $scope.logout = Api.logout;

        $templateCache.put('header',Header);
        $templateCache.put('box',Box);
        var boxName = '';
        $scope.step = Api.param('step') || 1;


        $scope.box = {
            title : '',
            "cabinets": [{
                "number": 1,
                "mouths": []
            }, {
                "number": 2,
                "mouths": []
            }]
        };


        Api.getSmsList({}, function (json) {
            if(json.statusCode == 0){
                $scope.smsList = json.result.list;
                $scope.$apply();
            }
        })

        $scope.companyList = [];
        var boxNumber = Api.param('id');
        var boxSelector = new BoxSelector();
        var data = {
            'page':1,
            'length':100,
            'companyType':'OPERATOR',
        }
 

        if(boxNumber!=null){
            var data = {
                boxId: boxNumber
            }
            Api.getBoxInfo(data, function (json) {
                if(json.statusCode == 0){
                    $scope.box.title = json.result.name;
                    $scope.box.id = json.result.id;
                    $scope.name = json.result.name;
                    boxName = json.result.name;
                    $scope.operator = json.result.operator.name;
                    $scope.operatorValue = json.result.operator.id;
                    $scope.overdueType = json.result.overdueType;
                    $scope.overdueTime = json.result.overdueType == 'DAY' ? json.result.freeDays : json.result.freeHours;
                    $scope.orderNo = json.result.orderNo;
                    $scope.currencyUnit = json.result.currencyUnit;
                    $scope.zoneId = json.result.zoneId
                    $scope.smsAccount = json.result.smsAccount.id;
                    $scope.box.cabinets = json.result.cabinets.sort(function(a,b){
                        return a.number - b.number;
                    });
                    var size1 = $scope.box.cabinets.length;
                    var size2 = Math.max.apply(null, $scope.box.cabinets.map(function(e){return e.mouths.length}));
                    boxSelector.init($scope.box.cabinets, size1, size2);
                    boxSelector.edit();
                    $scope.$apply();
                }else{
                    Alert.show(errorCode[json.statusCode]);
                }
            })
        }else{
            boxSelector.init($scope.box.cabinets);
            boxSelector.edit();
        }


        $scope.next = function(){
            console.log($scope.operatorValue)
            console.log($scope.name)
            console.log($scope.orderNo)
            console.log($scope.currencyUnit)
            console.log($scope.overdueType)
            console.log($scope.overdueTime)
            console.log($scope.smsAccount)
            if(!$scope.operatorValue || !$scope.name || !$scope.orderNo || !$scope.currencyUnit || !$scope.overdueType || !$scope.overdueTime || !$scope.smsAccount){
                Alert.show($scope.LFormNone);
                return;
            }

            $scope.step = 2;
        }

            $scope.boxSubmit = function () {
            var cabinets = boxSelector.getAll();
            console.log(cabinets)
            var cabinetsError = 0;
            for(var i = 0; i < cabinets.length; i ++){
                if(!cabinets[i]){
                    console.log(cabinets[i])
                    cabinetsError = 1;
                    break;
                }
                for(var j = 0; j< cabinets[i].mouths.length; j ++){
                    if(cabinets[i].mouths[j].numberInCabinet != (j+1)){
                        console.log(cabinets[i].mouths[j])
                        cabinetsError = 1;
                        break;
                    }
                }
                if(cabinetsError == 1){
                    break;
                }
            }

            if(cabinetsError){
                Alert.show($scope.LPakpoBoxColumns);
                return;
            }
            $scope.submitConfirm = true;
            var rebuildBoxData = {
                id: boxNumber,
                "operator":{
                    "id": $scope.operatorValue
                },
                "currencyUnit": $scope.currencyUnit,
                "zoneId": $scope.zoneId,
                "name": $scope.name,
                "orderNo": $scope.orderNo,
                "overdueType": $scope.overdueType,
                "smsAccount": {
                    "id": $scope.smsAccount
                },
                "cabinets": cabinets
            }
            if($scope.overdueType == 'DAY'){
                rebuildBoxData.freeDays = $scope.overdueTime;
            }else if($scope.overdueType == 'HOUR'){
                rebuildBoxData.freeHours = $scope.overdueTime;
            }
            if(boxNumber) {
                Api.rebuildBox(rebuildBoxData, function (json) {
                    if (json.statusCode == 0) {
                        $scope.submitRespose = $scope.LPakpoBoxSubmitRespose
                        $scope.returnPrev = function () {
                            location.href = 'pakpoboxList.html';
                            $('#submitModal').modal('hide');
                        };
                        setTimeout(function () {
                            //location.href = 'pakpoboxList.html';
                        }, 4000)
                    } else {
                        $scope.submitRespose = $scope.LPakpoBoxSubmitFail +
                            errorCode[json.statusCode] +
                            '<br />' +
                            '点击确定返回上一页编辑派宝箱信息。'
                        $scope.returnPrev = function () {
                            $scope.step = 1;
                            $('#submitModal').modal('hide');
                        };
                        $scope.submitConfirm = false;
                    }
                    $('#submitModal').modal('show');
                    $scope.$apply();
                })
            }
        }

        $scope.submit = function () { 
                //添加派宝箱时没有填写运营商名称
                if(!$scope.operatorValue){
                    Alert.show($scope.LPakpoboxOperatorName+$scope.LNotEmpty);
                    return;
                }
                //添加派宝箱时没有填写派宝箱名称
                if(!$scope.name){
                    Alert.show($scope.LPakpoboxName+$scope.LNotEmpty);
                    return;
                }
                //添加派宝箱时没有填写派宝箱业务编号
                if(!$scope.orderNo){
                    Alert.show($scope.LPakpoboxOrderNo+$scope.LNotEmpty);
                    return;
                }
                //添加派宝箱时没有填写派宝箱时区
                if(!$scope.zoneId){
                    Alert.show($scope.LPakpoboxZoneId+$scope.LNotEmpty);
                    return;
                }
                //添加派宝箱时没有填写派宝箱货币单位
                
                if(!$scope.currencyUnit){
                    Alert.show($scope.LPakpoboxCurrencyUnit+$scope.LNotEmpty);
                    return;
                }
                //添加派宝箱时没有填写逾期类型
                if(!$scope.overdueType){
                    Alert.show($scope.LPakpoboxOverdueType+$scope.LNotEmpty);
                    return;
                }
                //添加派宝箱时没有填写逾期时间
                if(!$scope.overdueTime&&$scope.overdueTime!=0){
                    Alert.show($scope.LPakpoboxOverdueTime+$scope.LNotEmpty);
                    return;
                }
                //添加派宝箱时没有填写短信运营商ID
                 if(!$scope.smsAccount){
                    Alert.show($scope.LPakpoboxSmsAccount+$scope.LNotEmpty);
                    return;
                }
                if($scope.name!=undefined&&$scope.name!=""&&$scope.name!=null)
                {     
                    var data = {
                        "name" : $scope.name
                    }
                    if(!boxNumber){
                         Api.queryBoxName(data, function (json) {
                             if(json.result.result=="1")
                             {
                                Alert.show($scope.LPakpoboxName+" '"+$scope.name+"' "+$scope.LExists+$scope.LRename);
                                return;
                             }else{
                                console.log($scope.operatorValue)
                                console.log($scope.name)
                                console.log($scope.orderNo)
                                console.log($scope.currencyUnit)
                                console.log($scope.overdueType)
                                console.log($scope.overdueTime)
                                console.log($scope.smsAccount)
                                //确认跳到添加格口的页面
                                    $('#goAddBoxView').modal('show');
                                     var id = $(this).data('id')
                                     $scope.confirmDeleteUser = function () {
                                        $('#goAddBoxView').modal('hide'); 
                                        $scope.step = 2;
                                     }
                                
                             }
                           
                        }) 

                    }else{
                        if(boxName!=$scope.name){
                             Api.queryBoxName(data, function (json) {
                                 if(json.result.result=="1")
                                 {
                                    Alert.show($scope.LPakpoboxName+" '"+$scope.name+"' "+$scope.LExists+$scope.LRename);
                                    return;
                                 }else{
                                    var cabinets = boxSelector.getAll();
                            console.log(cabinets)
                            var cabinetsError = 0;
                            for(var i = 0; i < cabinets.length; i ++){
                                if(!cabinets[i]){
                                    console.log(cabinets[i])
                                    cabinetsError = 1;
                                    break;
                                }
                                for(var j = 0; j< cabinets[i].mouths.length; j ++){
                                    if(cabinets[i].mouths[j].numberInCabinet != (j+1)){
                                        console.log(cabinets[i].mouths[j])
                                        cabinetsError = 1;
                                        break;
                                    }
                                }
                                if(cabinetsError == 1){
                                    break;
                                }
                            }
                            if(cabinetsError){
                                Alert.show($scope.LPakpoBoxColumns);
                                return;
                            }
                            $scope.submitConfirm = true;
                            var data = {
                                id: boxNumber,
                                "operator":{
                                    "id": $scope.operatorValue
                                },
                                "currencyUnit": $scope.currencyUnit,
                                "zoneId": $scope.zoneId,
                                "name": $scope.name,
                                "orderNo": $scope.orderNo,
                                "overdueType": $scope.overdueType,
                                "smsAccount": {
                                    "id": $scope.smsAccount
                                },
                                "cabinets": cabinets
                            }
                            if($scope.overdueType == 'DAY'){
                                data.freeDays = $scope.overdueTime;
                            }else if($scope.overdueType == 'HOUR'){
                                data.freeHours = $scope.overdueTime;
                            }
                            if(boxNumber) {
                                Api.updateBox(data, function (json) {
                                    if (json.statusCode == 0) {
                                        $scope.submitRespose = $scope.LPakpoBoxSubmitRespose
                                        $scope.returnPrev = function () {
                                            location.href = 'pakpoboxList.html';
                                            $('#submitModal').modal('hide');
                                        };
                                        setTimeout(function () {
                                            //location.href = 'pakpoboxList.html';
                                        }, 4000)
                                    } else {
                                        $scope.submitRespose = $scope.LPakpoBoxSubmitFail +
                                            errorCode[json.statusCode] +
                                            '<br />' +
                                            '点击确定返回上一页编辑派宝箱信息。'
                                        $scope.returnPrev = function () {
                                            $scope.step = 1;
                                            $('#submitModal').modal('hide');
                                        };
                                        $scope.submitConfirm = false;
                                    }
                                    $('#submitModal').modal('show');
                                    $scope.$apply();
                                })
                            }
                                }
                            })  

                         }else{
                            var cabinets = boxSelector.getAll();
                            console.log(cabinets)
                            var cabinetsError = 0;
                            for(var i = 0; i < cabinets.length; i ++){
                                if(!cabinets[i]){
                                    console.log(cabinets[i])
                                    cabinetsError = 1;
                                    break;
                                }
                                for(var j = 0; j< cabinets[i].mouths.length; j ++){
                                    if(cabinets[i].mouths[j].numberInCabinet != (j+1)){
                                        console.log(cabinets[i].mouths[j])
                                        cabinetsError = 1;
                                        break;
                                    }
                                }
                                if(cabinetsError == 1){
                                    break;
                                }
                            }
                            if(cabinetsError){
                                Alert.show($scope.LPakpoBoxColumns);
                                return;
                            }
                            $scope.submitConfirm = true;
                            var data = {
                                id: boxNumber,
                                "operator":{
                                    "id": $scope.operatorValue
                                },
                                "currencyUnit": $scope.currencyUnit,
                                "zoneId": $scope.zoneId,
                                "name": $scope.name,
                                "orderNo": $scope.orderNo,
                                "overdueType": $scope.overdueType,
                                "smsAccount": {
                                    "id": $scope.smsAccount
                                },
                                "cabinets": cabinets
                            }
                            if($scope.overdueType == 'DAY'){
                                data.freeDays = $scope.overdueTime;
                            }else if($scope.overdueType == 'HOUR'){
                                data.freeHours = $scope.overdueTime;
                            }
                            if(boxNumber) {
                                Api.updateBox(data, function (json) {
                                    if (json.statusCode == 0) {
                                        $scope.submitRespose = $scope.LPakpoBoxSubmitRespose
                                        $scope.returnPrev = function () {
                                            location.href = 'pakpoboxList.html';
                                            $('#submitModal').modal('hide');
                                        };
                                        setTimeout(function () {
                                            //location.href = 'pakpoboxList.html';
                                        }, 4000)
                                    } else {
                                        $scope.submitRespose = $scope.LPakpoBoxSubmitFail +
                                            errorCode[json.statusCode] +
                                            '<br />' +
                                            '点击确定返回上一页编辑派宝箱信息。'
                                        $scope.returnPrev = function () {
                                            $scope.step = 1;
                                            $('#submitModal').modal('hide');
                                        };
                                        $scope.submitConfirm = false;
                                    }
                                    $('#submitModal').modal('show');
                                    $scope.$apply();
                                })
                            }

                         }
                    }
                }

        }

        var dropDown = new DropDown({
            selector: '#operator',
            getData: function(value, callback){
                var param = {
                    page:1,
                    maxCount:5,
                    companyType: 'OPERATOR',
                    companyFuzzyName: value
                }
                if(boxNumber==null)
                { 
                $("#operator").attr('disabled', false)   
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
                }
                else
                {
                 $("#operator").attr('disabled', true)   
                }

            },
            success: function(value){
                $scope.operatorValue = value;
                $scope.$apply();
            }
        })

    }])
        .filter('trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            }
        }])

})(window.angular); $('body').show();