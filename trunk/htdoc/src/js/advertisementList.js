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
var ecommerceList = require('./common/ecommerce-list');
var Lang = require('./common/language');
var Header = require('raw!../tpl/Header.html');
var Nav = require('raw!../tpl/nav.html');
var Table = require('raw!../tpl/table.html');
var Alert = require('./common/alert');
var DropDown = require('./common/drop-down');

(function(angular) {
    'use strict';
    var myModule = angular.module('advertisementList', ['ngSanitize']);

    myModule.controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
        $.extend($scope, Lang);
        $scope.ecommerceList = ecommerceList;

        Api.userInfo(function(json){
            if(json.statusCode != 0){
                location.href = 'login.html';
            }else{
                $scope.userrole = json.result.role, $scope.usertype = $scope[userType[json.result.role]];
                $scope.username = json.result.name;
                $scope.companyId = json.result.company.id;
                $scope.$apply();
            }
        })
        $scope.logout = Api.logout;


        $scope.tableData = {
            thead:[$scope.LOperatorName,$scope.LADPosition,$scope.LImgCreateTime,$scope.LImgName,$scope.LDetailModify,$scope.LTableDelete],
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



        $scope.ifAdmitResetStatus = function(status){
            var ret = false;
            if(status==3||status==5||status==6){
                ret = true;
            }
            return ret;
        }

        //派宝箱名称
         $scope.pakpoboxNameValue = '',


        //查询
        $scope.search = function(){

            $scope.onSelectPage(1);
        }
        //goto
        $scope.gotoPage = function(){
            var page = parseInt($scope.pageNum.gotoPage);
            $scope.onSelectPage(page);
        }
        var id = Api.param('id'), company;
        console.log(id+"---");
        $scope.listSizes = 10;     //显示页数
        $scope.onSelectPage = function(page){
            $scope.showTipsType = 1;
            $scope.tableData.tbody = [];
            //登录用户的id
            var data = {
                companyId:'cfe4680b09ab11e58bdb0242ac110001'
            }
            Api.queryADInfo(data, function (json) {

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
                    console.log(e.overdueFlag);
                    arr[0] = e.company.name?e.company.name:'no';
                    arr[1] = e.position+''?e.position+'':'no';
                    arr[2] = e.doc.createTime?moment(e.doc.createTime).format('YYYY-MM-DD HH:mm'):'no';
                    arr[3] = e.doc.displayName?e.doc.displayName:'no';
                    arr[4] = '<a href="courier_info.html?id='+e.id+'" target="_blank">' + $scope.LDetailModify + '</a>';
                    arr[5] = '<a id="isdelect" data-id='+e.id+' data-target="#pakpoboxInfoModal">' + $scope.LTableDelete + '</a>';        
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

        //删除图片
        $('body').on('click', '#isdelect', function () {
            $('#deleteUserModal').modal('show');
             var id = $(this).data('id')
             $scope.confirmDeleteUser = function () {
                 var data = {
                          id: id
                        }
                 Api.deleteImg(data,function(json){
                    if(json.statusCode==0){
                        $('#deleteUserModal').modal('hide');   
                        Alert.show("广告删除成功",'success');
                         setTimeout(function() {
                         window.location.reload();
                         }, 2000);
                    }else{
                        $('#deleteUserModal').modal('hide');   
                         Alert.show(json.msg.errorMessage);
                    }
                });

             }
            
          })
     
          var dropDown = new DropDown({
                selector: '#pakpoboxName',
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
                    $scope.parentValue = value;
                    $scope.$apply();
                }
            })

          // var dropDown = new DropDown({
          //       selector: '#pakpoboxName',
          //       getData: function(value, callback){
          //           var param = {
          //               page:1,
          //               maxCount:5,
          //               name:value.trim()
          //           }
          //           Api.queryBoxInfo(param, function (json) {
          //               var data = [];
          //               if(json.statusCode == 0){
          //                   json.result.resultList.map(function (e) {
          //                       if(e.name.length>25){
          //                           e.name=e.name.substring(0,24)+"...";
          //                       }                                
          //                       data.push({
          //                           name: e.name,
          //                           value: e.id,
          //                           showValue: e.name
          //                       })
          //                   })
          //               }
          //               callback(data);
          //           })
          //       },
          //       success: function(value){
          //           $scope.pakpoboxNameValue = value;
          //           $scope.$apply();
          //       }
          //   })
       
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