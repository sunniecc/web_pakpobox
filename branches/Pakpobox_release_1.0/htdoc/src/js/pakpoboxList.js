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
    var myModule = angular.module('pakpoboxList', ['ngSanitize']);

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


        $scope.tableData = {
            thead:[$scope.LTableOrderSeq, $scope.LPakpoboxName, $scope.LPakpoboxOperatorName,$scope.LPakpoboxFreeNum, $scope.LPakpoboxStatus,$scope.LTableOperator],
            tbody:[]
        };

        $scope.showTipsType = 0;  //1代表请求中，2代表是返回为空。


        $templateCache.put('header',Header);
        $templateCache.put('nav',Nav);
        $templateCache.put('table',Table);

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


        //派宝箱名字
        $scope.pakpoboxName = '';

        //派宝箱编号
        $scope.pakpoboxNum = '';

        //运营商Id
        $scope.operatorName = '';



        //查询
        $scope.search = function(){

            $scope.onSelectPage(1);
        }
        //goto
        $scope.gotoPage = function(){
            var page = parseInt($scope.pageNum.gotoPage);
            $scope.onSelectPage(page);
        }

        var statusMap = {
            ENABLE:$scope.LPakpoboxRun,
            DISABLE:$scope.LPakpoboxStop
        }


        var btnColorMap = {
            ENABLE:'btn-success',
            DISABLE:'btn-danger',
            EXCEPTION: 'btn-warning'
        }
        $scope.listSizes = 10;     //显示页数
        $scope.onSelectPage = function(page){
            $scope.showTipsType = 1;
            $scope.tableData.tbody = [];
            //拉取快件api
            var data = {
                page: page,
                maxCount: $scope.listSizes,
                operatorName: $scope.operatorName,
                name: $scope.pakpoboxName,
                boxOrderNo: $scope.pakpoboxNum,
                status: $scope.statusValue
            }
            Api.queryBoxInfo(data, function (json) {

                //对失败的情况做一下处理
                if(json.statusCode != 0){
                    Alert.show($scope.LResponseError);
                }

                if(json.statusCode == -2){
                    $scope.logout();
                    location.href = 'login.html';
                }

                $scope.pageNum.pagesSize = parseInt((json.result.totalCount-1)/$scope.listSizes)+1;   //页总数
                var list = [];
                $scope.tableData.tbody = [];
                list =json.result.resultList;

                if(!list){
                    $scope.showTipsType = 2;
                }

                if(list.length == 0){
                    $scope.showTipsType = 2;
                }else{
                    $scope.showTipsType = 0;
                }

                $scope.pageNum.currentPage = 0;
                $scope.$apply();

                $scope.pageNum.currentPage = json.result.page;
                $scope.$apply();

                list && list.map(function (e,i) {
                    var arr = [];
                    arr[0] = $scope.listSizes*(page-1)+i+1+'';
                    arr[1] = e.name;
                    arr[2] = e.operator?e.operator.name:'no';
                    arr[3] = e.freeLocker+'';
                    arr[4] = '<div class="dropdown">' +
                        '<button class="btn '+btnColorMap[e.status]+' btn-sm dropdown-toggle" id="dropdownMenu'+i+'" data-toggle="dropdown">'+
                        statusMap[e.status]+
                        '</button>' +
                        '</div>';
                    arr[5] = '<div class="dropdown">' +
                        '<a href="box_info.html?id='+e.id+'" target="_blank">' + $scope.LPakpoboxDetail + '</a>' +
                        '</div>';
                    //arr[7] = '<a href="express_info.html" target="_blank">' + $scope.LTableDetails + '</a>';
                    $scope.tableData.tbody.push(arr);
                    $scope.$apply();
                });
            })
        }

        $scope.pageNum = {};
        $scope.pageNum.numPages = 5;     //显示页数
        $scope.pageNum.currentPage = 0;  //当前页数
        $scope.pageNum.pagesSize = 10;   //页总数
        $scope.pageNum.gotoPage = '';   //跳转页数
        $scope.pageNum.pages = [];       //显示页面数组

        $scope.onSelectPage(1);

        //$scope.modifyExpress = function () {
        //
        //    Api.modifyExpress(data, function (json) {
        //
        //    })
        //}

        //导出
        $scope.ImportExpress = function () {
            var arg ='expressType=COURIER_STORE'
                + '&expressStatus='+$scope.statusValue
                + '&takeUserPhone='+$scope.phoneValue
                + '&expressNumber='+$scope.numValue
                + '&startTakeTime='+beginTime.format('x')
                + '&endTakeTime='+endTime.format('x')
                + '&startStoreTime='+beginTime.format('x')
                + '&endTakeTime='+endTime.format('x')
                + '&startOverdueTime='+beginTime.format('x')
                + '&endOverdueTime='+endTime.format('x')

            window.open('/cgi-bin/index/express/exportExcel?'+arg);
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