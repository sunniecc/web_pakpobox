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
    var myModule = angular.module('operators', ['ngSanitize']);

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
        });
        $scope.logout = Api.logout;

        $scope.tableData = {
            thead:[$scope.LTableOrderSeq,$scope.LTableOperatorsName,$scope.LTableOperatorsLevel,$scope.LTableOperatorsParent,$scope.LDetailOperatorsContact,$scope.LDetailOperatorsContactPhone,$scope.LTableOperator],
            tbody:[
                ['1', '18566259791', '2015-01-02','2015-01-04','AOV3X0', '<button class="btn btn-success btn-sm">未取<i class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"/></button>', '查看详情'],
                ['2', '18566259791', '2015-01-02','2015-01-04','AOV3X0', '<button class="btn btn-success btn-sm">未取<i class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"/></button>', '查看详情'],
                ['3', '18566259791', '2015-01-02','2015-01-04','AOV3X0', '<button class="btn btn-success btn-sm">未取<i class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"/></button>', '查看详情'],
                ['4', '18566259791', '2015-01-02','2015-01-04','AOV3X0', '<button class="btn btn-success btn-sm">未取<i class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"/></button>', '查看详情']
            ]
        };

        $scope.showTipsType = 0;  //1代表请求中，2代表是返回为空。

        $scope.originalText = 'hello';
        $templateCache.put('header',Header);
        $templateCache.put('nav',Nav);
        $templateCache.put('table',Table);


        $scope.levelValue = '';
        $scope.isLevelActive=function(value){
            return $scope.levelValue == value;
        }
        $scope.selectLevel = function(value){
            $scope.levelValue = value;
            $scope.pageNum.currentPage = 1;
            $scope.onSelectPage(1);
        }

        //编号
        $scope.numberValue = '';

        //上级公司ID
        $scope.ParentIdVal = '';

        //查询
        $scope.search = function(){

            $scope.onSelectPage(1);
        }

        //goto
        $scope.gotoPage = function(){
            var page = parseInt($scope.pageNum.gotoPage);
            $scope.onSelectPage(page);
        }

        //级别字段转换
        $scope.transformLevelToWord = function(num){

            if(num == 1){
                return $scope.LLevelOne;
            }

            if(num == 2){
                return $scope.LLevelTwo;
            }

            if(num == 3){
                return $scope.LLevelThree;
            }

            if(num == 4){
                return $scope.LLevelFour;
            }

            if(num == 5){
                return $scope.LLevelFive;
            }
        }

        $scope.listSizes = 10;     //显示页数
        $scope.onSelectPage = function(page){
            $scope.showTipsType = 1;
            $scope.tableData.tbody = [];
            //拉取快件api
            var data = {
                'page':page,
                'maxCount':$scope.listSizes,
                'companyType':'OPERATOR',
                'id':$scope.numberValue,
                'level':$scope.levelValue,
                'parentId':$scope.ParentIdVal,
                'companyFuzzyName': $scope.nameValue
            }
            Api.companyQuery(data, function (json) {

                //对失败的情况做一下处理
                if(json.statusCode != 0){
                    Alert.show($scope.LResponseError);
                    $scope.showTipsType = 2;
                    $scope.$apply();
                }
                if(json.statusCode == -2){
                    $scope.logout();
                    location.href = 'login.html';
                }

                $scope.pageNum.pagesSize = parseInt((json.result.totalCount-1)/$scope.listSizes)+1;     //显示页数
                var list = [];
                $scope.tableData.tbody = [];
                list =json.result.resultList;

                if(list.length == 0){
                    $scope.showTipsType = 2;
                }else{
                    $scope.showTipsType = 0;
                }

                $scope.pageNum.currentPage = 0;
                $scope.pageNum.currentPage = json.result.page;
                $scope.$apply();


                list.map(function (e,i) {
                    var arr = [];
                    arr[0] = $scope.listSizes*(page-1)+i+1+'';
                    arr[1] = e.name?e.name:'no';
                    arr[2] = $scope.transformLevelToWord(e.level);
                    arr[3] = e.parentCompany?e.parentCompany.name:'no';
                    arr[4] = e.contactName;
                    arr[5] = e.contactPhoneNumber;
                    arr[6] = '<a href="operators_info.html?id='+e.id+'"  target="_blank">' + $scope.LTableDetails + '</a>';
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
                    var leftNum = scope.pageNum.numPages/2;
                    var rightNum = scope.pageNum.numPages/2;
                    //分两种情况
                    if(scope.pageNum.pagesSize<=scope.pageNum.numPages){
                        for(var i=1;i<=scope.pageNum.pagesSize;i++){
                            scope.pageNum.pages.push(i);
                        }
                    }else{
                        if(value<=leftNum){
                            for(var i=1;i<=scope.pageNum.numPages;i++){
                                scope.pageNum.pages.push(i);
                            }
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