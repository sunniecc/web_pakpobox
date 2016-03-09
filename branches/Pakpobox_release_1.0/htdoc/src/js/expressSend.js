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


(function(angular) {
    'use strict';
    var myModule = angular.module('expressSend', ['ngSanitize']);

    myModule.controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
        $.extend($scope, Lang);
        $scope.ecommerceList = ecommerceList;

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
                resetLabel: $scope.LReset,
            }
        }, function(start, end, label) {
            beginTimeStore = start;
            endTimeStore = end;
            if(!this.startDate){
                this.element.val('');
            }else{
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
            }
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
                resetLabel: $scope.LReset,
            }
        }, function(start, end, label) {
            beginTimeTake  = start;
            endTimeTake  = end;
            if(!this.startDate){
                this.element.val('');
            }else{
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
            }
        });
        var ecommerce = [];
        setTimeout(function () {
            $('#multiSelector').show().multiselect({
                //buttonWidth: '179px',
                nonSelectedText: $scope.LPleaseChoose,
                nSelectedText: $scope.LMultiSelected,
                allSelectedText: $scope.LMultiSelectedAll,
                numberDisplayed: 4,
                onChange: function (option, checked, select) {
                    var value = $(option).val();
                    if(checked){
                        ecommerce.push(value);
                    }else{
                        ecommerce.splice(ecommerce.indexOf(value), 1);
                    }
                }

            });
        }, 500)

        $scope.tableData = {
            thead:[$scope.LTableOrderNumber,$scope.LDetailStoreName,$scope.LTableTakerPhone,$scope.LTableStoreTime,$scope.LTableTakeTime,$scope.LTablePakpoboxNum,$scope.LTableValidationNum,$scope.LTableExpressStatu,$scope.LTableOperator],
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

        //状态
        $scope.overdueValue = '';
        $scope.isOverdue=function(value){
            return $scope.overdueValue == value;
        }
        $scope.selectOverdue = function(value){
            $scope.overdueValue = value;
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

        //订单编号
        $scope.numValue = '';

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

        var statusMap = [
            $scope.LExpressStatuStoring, $scope.LExpressStatuStore, $scope.LExpressStatuStored, $scope.LExpressStatuTimeout, $scope.LExpressStatuCourierPickup, $scope.LExpressStatuManagerPickup
        ]
        var btnColorMap = [
            'btn-express-0', 'btn-express-1', 'btn-express-2', 'btn-express-3', 'btn-express-4', 'btn-express-5'
        ]
        $scope.listSizes = 10;     //显示页数
        $scope.onSelectPage = function(page){
            $scope.showTipsType = 1;
            $scope.tableData.tbody = [];
            //拉取快件api
            var data = {
                page: page,
                expressType: 'CUSTOMER_STORE',
                maxCount: $scope.listSizes,
                expressStatus: $scope.statusValue,
                overdueFlag: $scope.overdueValue,
                takeUserPhone: $scope.phoneValue,
                expressNumber: $scope.numValue,
                startTakeTime: beginTimeTake ? beginTimeTake.format('x') : '',
                endTakeTime: endTimeTake ? endTimeTake.format('x') : '',
                startStoreTime: beginTimeStore ? beginTimeStore.format('x') : '',
                endStoreTime: endTimeStore ? endTimeStore.format('x') : '',
                ecommerceCompanyIdList: ecommerce.join(',')
            }
            Api.getExpress(data, function (json) {

                //对失败的情况做一下处理
                if(json.statusCode != 0){
                    Alert.show($scope.LResponseError);
                }
                if(json.statusCode == -2){
                    $scope.logout();
                    location.href = 'login.html';
                }

                $scope.pageNum.pagesSize = parseInt(json.result.totalCount/$scope.listSizes)+1;   //页总数
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
                    arr[0] = e.customerStoreNumber;
                    arr[1] = e.storeUser?e.storeUser.name:'no';
                    arr[2] = e.takeUserPhoneNumber?e.takeUserPhoneNumber:'no';
                    arr[3] = moment(e.storeTime).format('YYYY-MM-DD HH:mm');
                    arr[4] = moment(e.takeTime).format('YYYY-MM-DD HH:mm');
                    arr[5] = e.mouth? e.mouth.box.orderNo:'no';
                    arr[6] = e.validateCode?e.validateCode:'no';
                    arr[7] = '<div class="dropdown">' +
                        '<button class="btn '+btnColorMap[e.status - 1]+' btn-sm dropdown-toggle" id="dropdownMenu'+i+'" data-toggle="dropdown">'+
                        statusMap[e.status - 1]+
                        '</button>' +
                        '</div>';
                    arr[8] = '<div class="dropdown">' +
                        '<a href="express_info.html?expressNumber='+e.expressNumber+'" target="_blank">' + $scope.LTableDetails + '</a>' +
                        '<button class="btn btn-sm dropdown-toggle detail-select" id="dropdownMenu'+i+'" data-toggle="dropdown">'+
                        '<i class="glyphicon glyphicon-triangle-bottom" style="padding-left:0;color: #F78F38;" aria-hidden="true"/>' +
                        '</button>' +
                        '<ul class="dropdown-menu" aria-labelledby="dLabel">' +

                        '<li><button class="btn  btn-sm send-select" onclick="alert(0)">'+ $scope.LSendValidation +'</button></li>'+
                        '<li><button class="btn  btn-sm send-select '+($scope.ifBeReset(e.status)?'':'disabled')+'" onclick="alert(0)">'+ $scope.LResetStatus +'</button></li>'+

                        '</ul>' +
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
            var arg ='expressType=CUSTOMER_STORE'
                + '&expressStatus='+$scope.statusValue
                + '&takeUserPhone='+$scope.phoneValue
                + '&expressNumber='+$scope.numValue
                + '&startTakeTime='+(beginTimeTake==''?'':beginTimeTake.format('x'))
                + '&endTakeTime='+(endTimeTake==''?'':endTimeTake.format('x'))
                + '&startStoreTime='+(beginTimeStore==''?'':beginTimeStore.format('x'))
                + '&endStoreTime='+(endTimeStore==''?'':endTimeStore.format('x'))
                + '&ecommerceCompanyIdList=' + ecommerce.join(',')

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