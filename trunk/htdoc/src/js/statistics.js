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
var Table = require('raw!../tpl/table.html');
var Alert = require('./common/alert');


(function(angular) {
    'use strict';
    var myModule = angular.module('statistics', ['ngSanitize']);

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

        var beginTimeStore = '';
        var endTimeStore = '';
        $('#time_store').daterangepicker({
            "timePicker": true,
            "timePicker24Hour": true,
            "linkedCalendars": false,
            "autoUpdateInput": false,
            "locale": {
                format: 'YYYY-MM-DD',
                separator: ' ~ ',
                applyLabel: $scope.LApply,
                cancelLabel: $scope.LCancel,
            }
        }, function(start, end, label) {
            beginTimeStore = start;
            endTimeStore = end;
            this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
            //console.log('New date range selected: ' + start.format() + ' to ' + end.format() + ' (predefined range: ' + label + ')');
        });
        var beginTimeTake = '';
        var endTimeTake = '';
        $('#time_take').daterangepicker({
            "timePicker": true,
            "timePicker24Hour": true,
            "linkedCalendars": false,
            "autoUpdateInput": false,
            "locale": {
                format: 'YYYY-MM-DD',
                separator: ' ~ ',
                applyLabel: $scope.LApply,
                cancelLabel: $scope.LCancel,
            }
        }, function(start, end, label) {
            beginTimeTake  = start;
            endTimeTake  = end;
            this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
            //console.log('New date range selected: ' + start.format() + ' to ' + end.format() + ' (predefined range: ' + label + ')');
        });

        $scope.tableData1 = {
            thead:[$scope.LStatisticsNameTime,$scope.LDetailPakpobox,$scope.LStatisticsDay1,$scope.LStatisticsPer,$scope.LStatisticsDay2,$scope.LStatisticsPer,$scope.LStatisticsDay3,$scope.LStatisticsPer,$scope.LStatisticsDayO,$scope.LStatisticsPer],
            tbody:[]
        };
        $scope.tableData2 = {
            thead:[$scope.LStatisticsNameType,$scope.LDetailPakpobox,$scope.LStatisticsMINI,$scope.LStatisticsS,$scope.LStatisticsM,$scope.LStatisticsL,$scope.LStatisticsXL,$scope.LStatisticsTotal],
            tbody:[]
        };

        $scope.showTipsType = 0;  //1代表请求中，2代表是返回为空。


        $templateCache.put('header',Header);
        $templateCache.put('nav',Nav);
        $templateCache.put('table1',Table.replace(/tableData/g, 'tableData1').replace(/showTipsType/g, 'showTipsType1'));
        $templateCache.put('table2',Table.replace(/tableData/g, 'tableData2').replace(/showTipsType/g, 'showTipsType2'));


        //状态
        $scope.statusValue = '';
        $scope.isStatusActive=function(value){
            return $scope.statusValue == value;
        }
        $scope.selectStatus = function(value){
            $scope.statusValue = value;
            $scope.pageNum.currentPage = 1;
            $scope.onSelectPage(1);
        }

        $scope.ifBeReset = function(status){
            var ret = true;
            if(status==1||status==2){
                ret = false;
            }
            return ret;
        }


        //查询
        $scope.search = function(){

            $scope.onSelectPage(1);
        }
        //goto
        $scope.gotoPage = function(){
            var page = parseInt($scope.pageNum.gotoPage);
            $scope.onSelectPage(page);
        }

        $scope.listSizes = 10;     //显示页数
        $scope.onSelectPage = function(page){
            $scope.showTipsType1 = 1;
            $scope.showTipsType2 = 1;
            if(beginTimeTake==""&&endTimeTake==""&&beginTimeStore==""&&endTimeStore=="")
            {
                endTimeStore=Date.parse(new Date());
                beginTimeStore=endTimeStore-86400000*30;
                var data = {
                    startTakeTime: beginTimeTake ? beginTimeTake.format('x') : '',
                    endTakeTime: endTimeTake ? endTimeTake.format('x') : '',
                    startStoreTime: beginTimeStore,
                    endStoreTime: endTimeStore,
                    method: 'json'
                 }

            }else{
                    //拉取快件api
                    var data = {
                        startTakeTime: beginTimeTake ? beginTimeTake.format('x') : '',
                        endTakeTime: endTimeTake ? endTimeTake.format('x') : '',
                        startStoreTime: beginTimeStore ? beginTimeStore.format('x') : '',
                        endStoreTime: endTimeStore ? endTimeStore.format('x') : '',
                        method: 'json'
                    }

            }
            $scope.pageHide = true;
            Api.getExpressStatics(data, function (json) {

                //对失败的情况做一下处理
                if(json.statusCode != 0){
                    Alert.show($scope.LResponseError);
                }
                if(json.statusCode == -2){
                    $scope.logout();
                    location.href = 'login.html';
                }

                var list1 = [];
                $scope.tableData1.tbody = [];
                list1 =json.result.day_list;

                if(list1.length == 0){
                    $scope.showTipsType1 = 2;
                }else{
                    $scope.showTipsType1 = 0;
                }

                list1 && list1.map(function (e,i) {
                    var arr = [
                        e.name,
                        e.id,
                        e.day1.toString(),
                        (e.day1Per * 100 ).toFixed(1) + '%',
                        e.day2.toString(),
                        (e.day2Per * 100 ).toFixed(1) + '%',
                        e.day3.toString(),
                        (e.day3Per * 100 ).toFixed(1) + '%',
                        e.dayOver.toString(),
                        (e.dayOPer * 100 ).toFixed(1) + '%'
                    ];
                    $scope.tableData1.tbody.push(arr);
                    $scope.$apply();
                });

                var list2 = [];
                $scope.tableData2.tbody = [];
                list2 =json.result.type_list;

                if(list2.length == 0){
                    $scope.showTipsType2 = 2;
                }else{
                    $scope.showTipsType2 = 0;
                }

                list2 && list2.map(function (e,i) {
                    var arr = [
                        e.name,
                        e.id,
                        e.MINI.toString(),
                        e.S.toString(),
                        e.M.toString(),
                        e.L.toString(),
                        e.XL.toString(),
                        e.total.toString(),
                    ];
                    $scope.tableData2.tbody.push(arr);
                    $scope.$apply();
                });

                $scope.$apply();
            })
        }

        $scope.pageNum = {};
        $scope.pageNum.numPages = 5;     //显示页数
        $scope.pageNum.currentPage = 0;  //当前页数
        $scope.pageNum.pagesSize = 10;   //页总数
        $scope.pageNum.gotoPage = '';   //跳转页数
        $scope.pageNum.pages = [];       //显示页面数组

        $scope.onSelectPage(1);

        //导出
        $scope.statisticsExport = function () {
            var arg ='startTakeTime='+(beginTimeTake==''?'':beginTimeTake.format('x'))
                + '&endTakeTime='+(endTimeTake==''?'':endTimeTake.format('x'))
                + '&startStoreTime='+(beginTimeStore==''?'':beginTimeStore.format('x'))
                + '&endStoreTime='+(endTimeStore==''?'':endTimeStore.format('x'))
                + '&language=' + localStorage.lang;
            window.open('/cgi-bin/index/express/expressStatics?'+arg);
        }


    }])
        .filter('trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            }
        }]);

    myModule.directive('paging',function(){
        return {
            restrict: 'E',
            template: '',
            scope:  true ,
            replace: true,
            link: function (scope, element, attrs) {
                scope.$watch('pageNum.currentPage', function (value) {
                    scope.pageNum.pages = [];
                    var leftNum = parseInt(scope.pageNum.numPages/2);
                    var rightNum = parseInt(scope.pageNum.numPages/2);
                    //分两种情况
                    if(scope.pageNum.pagesSize<=scope.pageNum.numPages){
                        for(var i=1;i<=scope.pageNum.pagesSize;i++){
                            scope.pageNum.pages.push(i);
                        }
                    }else{
                        console.log(value)
                        console.log(leftNum)
                        if(value<=leftNum){
                            console.log(scope.pageNum.numPages)
                            for(var i=1;i<=scope.pageNum.numPages;i++){
                                scope.pageNum.pages.push(i);
                            }
                            console.log(scope.pageNum.pages)
                        }else if((scope.pageNum.pagesSize-value)<rightNum){
                            for(var i=scope.pageNum.pagesSize-4;i<=scope.pageNum.pagesSize;i++){
                                scope.pageNum.pages.push(i);
                            }
                        }else{
                            for(var i=value-2;i<=(value+2);i++){
                                scope.pageNum.pages.push(i);
                            }
                        }
                    }
                });
                scope.isActive = function (page) {
                    return scope.pageNum.currentPage === page;
                };
                scope.selectPage = function (page) {
                    if (!scope.isActive(page)) {
                        scope.pageNum.currentPage = page;
                        scope.onSelectPage(page);
                    }
                };
                scope.selectPrevious = function () {
                    if (!scope.noPrevious()) {
                        scope.selectPage(scope.pageNum.currentPage - 1);
                    }
                };
                scope.selectNext = function () {
                    if (!scope.noNext()) {
                        scope.selectPage(scope.pageNum.currentPage + 1);
                    }
                };
                scope.selectStart = function () {
                    if (!scope.noPrevious()) {
                        scope.selectPage(1);
                    }
                };
                scope.selectEnd = function () {
                    if (!scope.noNext()) {
                        scope.selectPage(scope.pageNum.pagesSize);
                    }
                };
                scope.noPrevious = function () {
                    return scope.pageNum.currentPage == 1;
                };
                scope.noNext = function () {
                    return scope.pageNum.currentPage == scope.pageNum.pagesSize;
                };
            }
        }
    });

})(window.angular); $('body').show();