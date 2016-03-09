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
var DropDown = require('./common/drop-down');

(function(angular) {
    'use strict';
    var myModule = angular.module('logistics', ['ngSanitize']);

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
            thead:[$scope.LTableOrderSeq,$scope.LDetailLogisticsName,$scope.LTableOperatorsLevel,$scope.LDetailLogisticsParentName,$scope.LDetailOperatorsContactPhone,$scope.LTableOperator,$scope.LTableDelete],
            tbody:[]
        };

        $scope.showTipsType = 0;  //1代表请求中，2代表是返回为空。

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


        //上级公司ID
        $scope.ParentIdVal = '';

        //编号
        $scope.numberValue = '';

        //名称
        $scope.nameValue = '';

         //删除机构
        $('body').on('click', '#isdelect', function () {
            $('#deleteCompanyModal').modal('show');
             var id = $(this).data('id')
             $scope.confirmDeleteUser = function () {
             var data ={
                'id':id,
                'role':$scope.role
             }
             Api.companyDelete(data, function (json) {
                if(json.statusCode==0)
                {
                    $('#deleteCompanyModal').modal('hide');   
                    Alert.show($scope.LTableDeleteCompanySuccess,'success');
                     setTimeout(function() {
                     window.location.reload();
                     }, 3000);
              
                }
                else
                {
                    $('#deleteCompanyModal').modal('hide');   
                    if(json.msg.http_code==400&&json.msg.statusCode==400){
                        Alert.show($scope.LLogisticsDeleteFailTips);
                    }else{
                        Alert.show(json.msg.errorMessage);
                    }
                }
               
             })
             }
            
          })

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

        var statusMap = [
            $scope.LExpressStatuStoring, $scope.LExpressStatuStore, $scope.LExpressStatuStored, $scope.LExpressStatuTimeout, $scope.LExpressStatuCourierPickup, $scope.LExpressStatuManagerPickup
        ]
        var btnColorMap = [
            'btn-default', 'btn-primary', 'btn-success', 'btn-danger', 'btn-primary', 'btn-warning'
        ]
        $scope.listSizes = 10;     //显示页数
        $scope.onSelectPage = function(page){
            $scope.showTipsType = 1;
            $scope.tableData.tbody = [];
            var data = {
                'page':page,
                'maxCount':$scope.listSizes,
                'companyType':'LOGISTICS_COMPANY',
                'id':$scope.numberValue,
                'level':$scope.levelValue,
                'parentId':$scope.pakpoboxCompanyId,
                'companyFuzzyName': $scope.nameValue
            }
            var data = {
                'page':page,
                'maxCount':$scope.listSizes,
                'companyType':'LOGISTICS_COMPANY',
                'id':$scope.numberValue,
                'level':$scope.levelValue,
                'parentId':$scope.pakpoboxCompanyId,
                'companyFuzzyName': $scope.nameValue
            }
            //拉取快件api
            Api.companyQuery(data, function (json) {

                //对失败的情况做一下处理
                if(json.statusCode != 0){
                    Alert.show($scope.LResponseError);
                }
                if(json.statusCode == -2){
                    $scope.logout();
                    location.href = 'login.html';
                }
                $scope.recordNum = parseInt(json.result.totalCount); //总记录数
                $scope.pageNum.pagesSize = parseInt((json.result.totalCount-1)/$scope.listSizes)+1;   //页总数
                var list = [];
                $scope.tableData.tbody = [];
                list =json.result.resultList;

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
                    arr[1] = e.name?e.name:'no';
                    arr[2] = $scope.transformLevelToWord(e.level);
                    arr[3] = e.parentCompany?e.parentCompany.name:'no';
                    // arr[4] = e.contactName;
                    arr[4] = e.contactPhoneNumber[0];
                    arr[5] = '<a href="logistics_info.html?id='+e.id+'" target="_blank">' + $scope.LTableDetails + '</a>';
                    if($scope.userrole=='ROOT'){
                            arr[6] = '<a id="isdelect" data-id='+e.id+' data-target="#pakpoboxInfoModal">' + $scope.LTableDelete + '</a>';
                    }else{
                        if($scope.companyId == e.id){
                            arr[6] = '<span target="_blank"> --- </span>';
                        }else{
                             arr[6] = '<a id="isdelect" data-id='+e.id+' data-target="#pakpoboxInfoModal">' + $scope.LTableDelete + '</a>';
                        }
                    }
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
         //上级公司名称下拉框
        var dropDown = new DropDown({
                selector: '#exampleInputName3',
                getData: function(value, callback){
                    var param = {
                        page:1,
                        maxCount:5,
                        companyType: 'LOGISTICS_COMPANY',
                        companyFuzzyName: value
                    }
                    Api.companyQuery(param, function (json) {
                        var data = [];
                        if(json.statusCode == 0){
                            json.result.resultList.map(function (e) {
                                if(e.name.length>25){
                                    e.name=e.name.substring(0,24)+"...";
                                }  
                                data.push({
                                    name: e.name,
                                    value: e.id,
                                    showValue: e.name
                                })
                            })
                        }
                        callback(data);
                    })
                },
                success: function(value){
                    $scope.pakpoboxCompanyId = value;
                    $scope.$apply();
                }
            })
        

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