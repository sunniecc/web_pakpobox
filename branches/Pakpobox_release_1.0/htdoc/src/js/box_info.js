/**
 * @fileOverview box_edit.js
 * @version 1.0.0
 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
 * @date 2015/08/15
 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
 * @see [link]
 *
 */

var Api = require('./common/api');
require('./lib/angular/angular-sanitize');
var Alert = require('./common/alert');
var errorCode = require('./common/errorCode');
var userType = require('./common/usertype');
var Lang = require('./common/language');
var BoxSelector = require('./common/box-selector');

var Header = require('raw!../tpl/Header.html');
var Box = require('raw!../tpl/box.html');



(function(angular) {
    'use strict';
    var myModule = angular.module('boxInfo', ['ngSanitize']);

    myModule.controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
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

        $templateCache.put('header',Header);
        $templateCache.put('box',Box);

        $scope.step = 2;

        $scope.box = {
            title : '',
            "cabinets": []
        };

        $scope.close = function () {
            window.close();
        }

        Api.getSmsList({}, function (json) {
            if(json.statusCode == 0){
                $scope.smsList = json.result.list;
                $scope.$apply();
            }
        })

        var boxNumber = Api.param('id');
        var boxSelector = new BoxSelector();

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
                $scope.smsAccountId = json.result.smsAccount.id;

                $scope.box.cabinets = json.result.cabinets.sort(function(a,b){
                    return a.number - b.number;
                });
                var size1 = $scope.box.cabinets.length;
                var size2 = Math.max.apply(null, $scope.box.cabinets.map(function(e){return e.mouths.length}));
                boxSelector.init($scope.box.cabinets, size1, size2);
                boxSelector.region();

                setTimeout(function () {
                    var remainLen = $('td[data-status="0"][data-del!="1"]').length;
                    $scope.remainMouths = remainLen;
                    $scope.$apply();
                },500)

                $scope.$apply();

                Api.getSmsList({}, function (json) {
                    if(json.statusCode == 0){
                        $scope.smsList = json.result.list;
                        $scope.smsList.map(function (e) {
                            if(e.id == $scope.smsAccountId){
                                $scope.smsAccountName = e.name;
                            }
                        })
                        $scope.$apply();
                    }
                })
            }
        })

        var statusMap = ['ENABLE', 'USED', 'LOCKED'];
        var taskMap = {
            'COMMIT': $scope.LTaskCOMMIT,
            'SUCCESS': $scope.LTaskSUCCESS,
            'ERROR': $scope.LTaskERROR,
        }

        $scope.setStatus = function (status) {
            var selectedBox = boxSelector.getSelected();
            if(!selectedBox || selectedBox.length < 1){
                Alert.show($scope.LPakpoBoxPleaseChooseAMouth)
            }else if(selectedBox.length >= 1 && !!selectedBox[0]){
                $scope.changeMouthStatus = status;
                $scope.mouthChangeList = selectedBox;
                var occupyFlag = 0;
                $scope.mouthChangeList.map(function (e, i) {
                    if ($('td[data-number="' + e.number + '"]').data('status') == 1) {
                        occupyFlag = 1;
                        return false;
                    }
                })
                if(occupyFlag){
                    Alert.show($scope.LPakpoBoxForbiddenBusyStatus);
                    return;
                }
                $('#changeStatusModal').modal({
                    backdrop: 'static'
                })
            }else{
                Alert.show($scope.LPakpoBoxGetMouthIdFailed)
            }

        };
        $scope.confirmChangeStatus = function () {
            $scope.mouthChangeList.map(function (e, i) {
                //if($('td[data-number="'+ e.number+'"]').data('status') == 1){
                //    console.log($('td[data-number="'+ e.id+'"]')[0])
                //    $scope.mouthChangeList[i].result = $scope.LStatusError;
                //    return true;
                //}
                $scope.mouthChangeList[i].result = $scope.LWaiting;
                var data = {
                    id: e.id,
                    status: statusMap[$scope.changeMouthStatus]
                }
                Api.updateMouth(data, function (json) {
                    if(json.statusCode == 0){
                        $scope.mouthChangeList[i].result = $scope.LSuccess;

                        var complited = true;
                        $scope.mouthChangeList.map(function (ee) {
                            if(ee.result != $scope.LSuccess){
                                complited = false;
                                return false;
                            }
                        })
                        if(complited){
                            boxSelector.setStatus($scope.mouthChangeList, $scope.changeMouthStatus);
                            $('#changeStatusModal').modal('hide');
                        }
                    }
                    $scope.$apply();
                })
            })

        }

        $scope.editBox = function () {
            location.href = 'box_edit.html?id=' + Api.param('id');
        }
        $scope.remoteUnlock = function () {
            var selectedBox = boxSelector.getSelected();
            if(!selectedBox || selectedBox.length < 1){
                Alert.show($scope.LPakpoBoxPleaseChooseAMouth)
            }else if(selectedBox.length >= 1 && !!selectedBox[0]){
                $scope.remoteUnlockList = selectedBox;
                $('#remoteUnlockModal').modal({
                    backdrop: 'static'
                })
            }else{
                Alert.show($scope.LPakpoBoxGetMouthIdFailed)
            }


        }
        $scope.remoteUnlockComplited = false;
        $scope.confirmRemoteUnlock = function () {
            if($scope.remoteUnlockComplited){
                $('#remoteUnlockModal').modal('hide');
                $scope.remoteUnlockComplited = false;
            }else{
                $scope.remoteUnlockList.map(function (e, i) {
                    $scope.remoteUnlockList[i].result = $scope.LWaiting;
                    var data = {
                        id: e.id
                    }
                    Api.remoteUnlock(data, function (json) {
                        if(json.statusCode == 0){
                            var taskId = json.result.id;
                            setTimeout(function () {
                                var data = {
                                    taskId: taskId
                                }
                                Api.getTaskInfo(data, function (json) {
                                    if(json.statusCode == 0){
                                        console.log(json.result.statusType)
                                        console.log(taskMap[json.result.statusType])
                                        $scope.remoteUnlockList[i].result = taskMap[json.result.statusType];

                                        $scope.remoteUnlockComplited = true;
                                        $scope.remoteUnlockList.map(function (ee) {
                                            if(ee.result == $scope.LWaiting){
                                                $scope.remoteUnlockComplited = false;
                                                return false;
                                            }
                                        })
                                    }
                                    $scope.$apply();
                                })
                            }, 5000)
                        }
                        $scope.$apply();
                    })
                })
            }


        }




    }])
        .filter('trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            }
        }])
    //.directive('drop',

})(window.angular); $('body').show();