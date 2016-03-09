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
        })
        $scope.logout = Api.logout;

        $templateCache.put('header',Header);
        $templateCache.put('box',Box);

        $scope.step = Api.param('type') || 1;


        $scope.box = {
            title : '',
            "cabinets": [{
                "number": 1,
                "mouths": [{
                    "number": 1,
                    "numberInCabinet": 1,
                    "status": 0,
                    "mouthType": {
                        "id": "fa820ca9082f11e5a29a0242ac110001"
                    }
                }, {
                    "number": 2,
                    "numberInCabinet": 2,
                    "status": 1,
                    "mouthType": {
                        "id": "fa820ca9082f11e5a29a0242ac110001"
                    }
                }, {
                    "number": 3,
                    "numberInCabinet": 3,
                    "status": 2,
                    "mouthType": {
                        "id": "fa820ca9082f11e5a29a0242ac110001"
                    }
                }, {
                    "number": 4,
                    "numberInCabinet": 4,
                    "status": 0,
                    "mouthType": {
                        "id": "fa820ca9082f11e5a29a0242ac110001"
                    }
                }]
            }, {
                "number": 2,
                "mouths": [{
                    "number": 5,
                    "numberInCabinet": 1,
                    "status": 1,
                    "mouthType": {
                        "id": "fa820ca9082f11e5a29a0242ac110001"
                    }
                }, {
                    "number": 6,
                    "numberInCabinet": 2,
                    "status": 2,
                    "mouthType": {
                        "id": "fa820ca9082f11e5a29a0242ac110001"
                    }
                }, {
                    "number": 7,
                    "numberInCabinet": 3,
                    "status": 0,
                    "mouthType": {
                        "id": "fa820ca9082f11e5a29a0242ac110001"
                    }
                }, {
                    "number": 8,
                    "numberInCabinet": 4,
                    "status": 1,
                    "mouthType": {
                        "id": "fa820ca9082f11e5a29a0242ac110001"
                    }
                }]
            }]
        };

        //for(var i = 0; i <= 10; i++){
        //    if( !$scope.box.content[i] ){
        //        $scope.box.content[i] = [];
        //    }
        //
        //    for(var j = 0; j <= 10; j++){
        //        if( !$scope.box.content[i][j] ){
        //            $scope.box.content[i][j] = {};
        //        }
        //
        //    }
        //}

        var boxNumber = Api.param('id');
        var boxSelector = new BoxSelector();
        if(boxNumber){
            var data = {
                boxId: boxNumber
            }
            Api.getBoxInfo(data, function (json) {
                if(json.statusCode == 0){
                    $scope.box.title = json.result.name;
                    $scope.box.id = json.result.id;
                    $scope.name = json.result.name;
                    $scope.operator = json.result.operator.name;
                    $scope.operatorValue = json.result.operator.id;
                    $scope.overdueType = json.result.overdueType;
                    $scope.overdueTime = json.result.freeDays || json.result.freeHours;
                    $scope.orderNo = json.result.orderNo;
                    $scope.currencyUnit = json.result.currencyUnit;
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
        var data = {
            boxId: boxNumber
        }



        Api.getSmsList({}, function (json) {
            if(json.statusCode == 0){
                $scope.smsList = json.result.list;
                $scope.$apply();
            }
        })

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

        $scope.submit = function () {
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
            //cabinets.map(function (e, i) {
            //    console.log(e.number, i)
            //    if(e.number != (i + 1)){
            //        console.log(e.number)
            //        cabinetsRight = 0;
            //
            //        return false;
            //    }
            //})
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
                            location.href = 'pakpoboxList.html';
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
            }else{
                Api.createBox(data, function (json) {
                    if (json.statusCode == 0) {
                        $scope.submitRespose = $scope.LPakpoBoxSubmitRespose
                        $scope.returnPrev = function () {
                            location.href = 'pakpoboxList.html';
                            $('#submitModal').modal('hide');
                        };
                        setTimeout(function () {
                            location.href = 'pakpoboxList.html';
                        }, 4000)
                    } else {
                        $scope.submitRespose = $scope.LPakpoBoxSubmitFail +
                            errorCode[json.statusCode] +
                            '<br />' +
                            $scope.LPakpoBoxSubmitBack
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

        var dropDown = new DropDown({
            selector: '#operator',
            getData: function(value, callback){
                var param = {
                    page:1,
                    maxCount:5,
                    companyType: 'OPERATOR',
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
        //.directive('drop',

})(window.angular); $('body').show();