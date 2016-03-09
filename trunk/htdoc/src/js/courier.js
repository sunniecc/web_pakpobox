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
    var myModule = angular.module('courier', ['ngSanitize']);

    myModule.controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
        $.extend($scope, Lang);

        Api.userInfo(function(json){
            if(json.statusCode != 0){
                location.href = 'login.html';
            }else{
                $scope.userrole = json.result.role, $scope.usertype = $scope[userType[json.result.role]];
                $scope.username = json.result.name;
                if($scope.userrole!='ROOT')
                {
                     $scope.usercompanyid = json.result.company.id;
                }
                else
                {
                    $scope.userid = json.result.id;
                }
                $scope.$apply();

            }
        })

        $scope.logout = Api.logout;
        if($scope.userrole==null)
        {

        }

        $scope.tableData = {
           
            thead:[$scope.LRole,$scope.LLoginname, $scope.LCourierName,$scope.LCourierCompany,$scope.LCourierPhone,$scope.LTableOperator,$scope.LTableDelete],
            tbody:[
                ['1', 'L0329423423423', '18566259791', '2015-01-02','2015-01-04','AOV3X0', '<button class="btn btn-success btn-sm">未取<i class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"/></button>', '查看详情'],
                ['2', 'L0329423423423', '18566259791', '2015-01-02','2015-01-04','AOV3X0', '<button class="btn btn-success btn-sm">未取<i class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"/></button>', '查看详情'],
                ['3', 'L0329423423423', '18566259791', '2015-01-02','2015-01-04','AOV3X0', '<button class="btn btn-success btn-sm">未取<i class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"/></button>', '查看详情'],
                ['4', 'L0329423423423', '18566259791', '2015-01-02','2015-01-04','AOV3X0', '<button class="btn btn-success btn-sm">未取<i class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"/></button>', '查看详情']
            ]
        };

        $scope.showTipsType = 0;  //1代表请求中，2代表是返回为空。

        $scope.originalText = 'hell';
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
        //角色
        $scope.role = '';
        $scope.isRoleActive=function(value){
            return $scope.role == value;
        }
        $scope.selectRole = function(value){
            $scope.role = value;
            $scope.pageNum.currentPage = 1;
            $scope.onSelectPage(1);
        }
        $scope.roleTransformToWord = function(value){
            var role = 'no';
            if(value == 'OPERATOR_ADMIN'){
                role = $scope.LOperatorAdmin;
            }

            if(value == 'OPERATOR_USER'){
                role = $scope.LOperatorUser;
            }

            if(value == 'LOGISTICS_COMPANY_ADMIN'){
                role = $scope.LLogisticsAdmin;
            }

            if(value == 'LOGISTICS_COMPANY_USER'){
                role = $scope.LLogisticsUser;
            }
            if(value == 'ROOT'){
                role = $scope.LRootUser;
            }

            return role;
        }


        //姓名
        $scope.nameValue = '';


        //公司
        $scope.companyValue = '';

        //手机号
        $scope.phoneValue = '';

        //查询
        $scope.search = function(){

            $scope.onSelectPage(1);
        }

        //goto
        $scope.gotoPage = function(){
            var page = parseInt($scope.pageNum.gotoPage);
            $scope.onSelectPage(page);
        }

        //删除员工
        $('body').on('click', '#isdelect', function () {
            $('#deleteUserModal').modal('show');
             var id = $(this).data('id')
             $scope.confirmDeleteUser = function () {
             var data ={
                'id':id,
                'role':$scope.role
             }
             Api.delectUser(data, function (json) {
                if(json.statusCode==0)
                {
                    $('#deleteUserModal').modal('hide');   
                    Alert.show($scope.LTableDeleteSuccess,'success');
                     setTimeout(function() {
                     window.location.reload();
                     }, 1000);
              
                }
                else
                {
                    $('#deleteUserModal').modal('hide');   
                    Alert.show(json.msg.errorMessage);
                }
               
             })
             }
            
          })

        var statusMap = [
            $scope.LExpressStatuStoring, $scope.LExpressStatuStore, $scope.LExpressStatuStored, $scope.LExpressStatuTimeout, $scope.LExpressStatuCourierPickup, $scope.LExpressStatuManagerPickup
        ]

        $scope.listSizes = 10;     //显示页数
        $scope.onSelectPage = function(page){
            $scope.showTipsType = 1;
            $scope.tableData.tbody = [];
            //拉取快件api
            var data = {
                'page':page,
                'maxCount':$scope.listSizes,
                'companyFuzzyName':$scope.companyValue,
                'name':$scope.nameValue,
                'phoneNumber':$scope.phoneValue,
                'role':$scope.role
            }
            Api.courierInfo(data, function (json) {

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

                $scope.tableData.tbody = [];
                var list = [];
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

                    arr[0] = $scope.roleTransformToWord(e.role);
                    arr[1] = e.loginName?e.loginName:'no';
                    arr[2] = e.name?e.name:'no';
                    arr[3] = e.company?e.company.name:'no';
                    arr[4] = e.phoneNumber?e.phoneNumber:'no';
                    arr[5] = '<a href="courier_info.html?id='+e.id+'" target="_blank">' + $scope.LTableDetails + '</a>';
                    if($scope.userrole=='ROOT')
                    {
                        if(e.role==$scope.userrole)
                        {
                            arr[6] = '<span target="_blank"> --- </span>';
                        } 
                        else
                        {
                            arr[6] = '<a id="isdelect" data-id='+e.id+' data-target="#pakpoboxInfoModal">' + $scope.LTableDelete + '</a>';
                        }
                    }
                    else if($scope.userrole=='LOGISTICS_COMPANY_ADMIN'||$scope.userrole=='OPERATOR_ADMIN')
                    {
                        if(e.role==$scope.userrole&&e.company.id==$scope.usercompanyid)
                        {
                            arr[6] = '<span target="_blank"> --- </span>';
                        }
                        else
                        {
                            arr[6] = '<a id="isdelect" data-id='+e.id+' data-target="#pakpoboxInfoModal">' + $scope.LTableDelete + '</a>';
                        }
                    }
                    else
                    {

                        arr[6] = '<span target="_blank"> ---</span>';
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