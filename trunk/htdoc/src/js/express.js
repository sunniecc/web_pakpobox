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
    var myModule = angular.module('express', ['ngSanitize']);

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
            thead:[$scope.LTableOrderNumber,$scope.LDetailStoreName,$scope.LTableTakerPhone,$scope.LTableCreateTime,$scope.LTableStoreTime,$scope.LTableTakeTime,$scope.LPakpoboxName,$scope.LTableValidationNum,$scope.LTableExpressStatu,$scope.LTableOperator],
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


        $scope.ifAdmitReValidation = function(status){
            var ret = false;
            var expressType = Api.param('type') || 'COURIER_STORE';
            if(status==2&&expressType=='COURIER_STORE'){
                ret = true;
            }
            return ret;
        }

        $scope.ifAdmitResetStatus = function(status){
            var ret = false;
            if(status==3||status==5||status==6){
                ret = true;
            }
            return ret;
        }


        //订单编号
        $scope.numValue = '';

        //手机号
        $scope.phoneValue = '';

        //派宝箱名称
         $scope.pakpoboxNameValue = '',
        // //派宝箱编号
        // var boxOrderNo = '';

        //查询
        $scope.search = function(){

            $scope.onSelectPage(1);
        }
        //goto
        $scope.gotoPage = function(){
            var page = parseInt($scope.pageNum.gotoPage);
            $scope.onSelectPage(page);
        }

        //是否加上逾期标志
        $scope.IfAddOverFlag = function(overflag){
            if(overflag==1){
                return ('<button class="overdueFlag">'+$scope.LOverdueStatusYes+'</button>');
            }
            return '';
        }

        var statusMap = [
            $scope.LExpressStatuStoring, $scope.LExpressStatuStore, $scope.LExpressStatuStored, $scope.LExpressStatuTimeout, $scope.LExpressStatuCourierPickup, $scope.LExpressStatuManagerPickup
        ]
        var btnColorMap = [
            'btn-express-0', 'btn-express-1', 'btn-express-2', 'btn-express-3', 'btn-express-4', 'btn-express-5'
        ]
        $scope.listSizes = 10;     //显示页数
        var expressType = Api.param('type') || 'COURIER_STORE';
        $scope.onSelectPage = function(page){
            $scope.showTipsType = 1;
            $scope.tableData.tbody = [];
            //拉取快件api
            var data = {
                all: '1',
                page: page,
                expressType: expressType,
                maxCount: $scope.listSizes,
                expressStatus: $scope.statusValue,
                overdueFlag: $scope.overdueValue,
                takeUserPhone: $scope.phoneValue,
                boxId: $scope.pakpoboxNameValue,
                startTakeTime: beginTimeTake ? beginTimeTake.format('x') : '',
                endTakeTime: endTimeTake ? endTimeTake.format('x') : '',
                startStoreTime: beginTimeStore ? beginTimeStore.format('x') : '',
                endStoreTime: endTimeStore ? endTimeStore.format('x') : '',
                ecommerceCompanyIdList: ecommerce.join(',')
            }
            expressType != 'COURIER_STORE' ? (data.customerStoreNumber = $scope.numValue) : (data.expressNumber = $scope.numValue);
            Api.getExpress(data, function (json) {

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
                    arr[0] = (e.expressNumber || e.customerStoreNumber)+$scope.IfAddOverFlag(e.overdueFlag);
                    arr[1] = e.storeUser?e.storeUser.name:'no';
                    arr[2] = e.takeUserPhoneNumber?e.takeUserPhoneNumber:'no';
                    arr[3] = e.createTime?moment(e.createTime).format('YYYY-MM-DD HH:mm'):'no';
                    arr[4] = e.storeTime?moment(e.storeTime).format('YYYY-MM-DD HH:mm'):'no';
                    arr[5] = e.takeTime?moment(e.takeTime).format('YYYY-MM-DD HH:mm'):'no';
                    arr[6] = e.mouth? e.mouth.box.name:'no';
                    arr[7] = e.validateCode?e.validateCode:'no';
                    arr[8] = '<div class="dropdown">' +
                                '<button class="btn '+btnColorMap[e.status - 1]+' btn-sm " id="dropdownMenu'+i+'" data-toggle="dropdown">'+
                                    statusMap[e.status - 1]+
                                '</button>' +
                            '</div>';
                    arr[9] = '<div class="dropdown">' +
                                '<a href="express_info.html?id='+e.id+'" target="_blank">' + $scope.LTableDetails + '</a>' +
                                '<button class="btn btn-sm dropdown-toggle detail-select" id="dropdownMenu'+i+'" data-toggle="dropdown">'+
                                '<i class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"/>' +
                                '</button>' +
                                '<ul class="dropdown-menu" aria-labelledby="dLabel">' +

                                    '<li><button class="btn  btn-sm send-select clickReSendValidation" '+($scope.ifAdmitReValidation(e.status)?'':'disabled')+'  data-id="' + e.id + '">'+ $scope.LSendValidation +'</button></li>';
                                if($scope.userrole=='LOGISTICS_COMPANY_ADMIN'||$scope.userrole=='LOGISTICS_COMPANY_USER')
                                {
                                     arr[9] += '</ul>' +'</div>';
                                }
                                else
                                {
                                    arr[9] +='<li><button class="btn  btn-sm send-select clickResetStatus" '+($scope.ifAdmitResetStatus(e.status)?'':'disabled')+'  data-id="' + e.id + '">'+ $scope.LResetStatus +'</button></li>'+
                                    '<li><button class="btn  btn-sm send-select clickResetOverTime" '+($scope.ifAdmitReValidation(e.status)?'':'disabled')+'  data-id="' + e.id + '">'+ $scope.LResetOverTime +'</button></li>'+

                                '</ul>' +
                             '</div>';
                                }
                                    
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
            var arg ='expressType='+expressType
                + '&expressStatus='+$scope.statusValue
                + '&takeUserPhone='+$scope.phoneValue
                + '&boxId='+$scope.pakpoboxNameValue
                + '&startTakeTime='+(beginTimeTake==''?'':beginTimeTake.format('x'))
                + '&endTakeTime='+(endTimeTake==''?'':endTimeTake.format('x'))
                + '&startStoreTime='+(beginTimeStore==''?'':beginTimeStore.format('x'))
                + '&endStoreTime='+(endTimeStore==''?'':endTimeStore.format('x'))
                + '&ecommerceCompanyIdList=' + ecommerce.join(',')
                + '&overdueFlag=' + $scope.overdueValue

                if(expressType=="COURIER_STORE")
                {
                   arg+= "&expressNumber="+$scope.numValue
                }else{
                   arg+= "&customerStoreNumber="+$scope.numValue
                }
            window.open('/cgi-bin/index/express/exportExcel?'+arg);
        }

        $('body').on('click', '.clickReSendValidation', function () {
            var id = $(this).data('id')
            $scope.confirmText = $scope.LDetailIfReSendValidation;
            $scope.apply = function () {
                var data = {
                    expressId: id
                }
                Api.resendSms(data, function (json) {
                    if(json.statusCode == 0){
                        Alert.show($scope.LDetailIfReSendSuccessfully, 'success');
                    }else{
                        Alert.show($scope.LDetailIfReSendFailed);
                    }

                })
            }
            $scope.$apply();
            $('#confirmModal').modal('show');
        })



        $('body').on('click', '.clickResetStatus', function () {
            var id = $(this).data('id');
            $scope.confirmText = $scope.LDetailIfResetStatu;
            $scope.apply = function () {
                var data = {
                    id: id,
                    status:'IN_STORE'
                }
                Api.resetExpress(data, function (json) {
                    if(json.statusCode == 0){
                        Alert.show($scope.LDetailIfDoReset, 'success');
                        $scope.confirmText = $scope.LDetailReseting;
                        $scope.$apply();
                        setTimeout(function () {
                            var confirmData = {
                                taskId : json.result.id
                            }
                            Api.getTaskInfo(confirmData,function(json){
                                if(json.result.express.status == 'IN_STORE'){
                                    $scope.confirmText = $scope.LDetailIfResetSuccessfully;
                                    Alert.show($scope.LDetailIfResetSuccessfully, 'success');
                                    $scope.onSelectPage($scope.pageNum.currentPage);
                                    return;
                                }
                                Alert.show($scope.LDetailIfResetFailed);
                            });
                        }, 500)
                    }else{
                        Alert.show($scope.LDetailIfResetFailed);
                    }

                })
            }
            $scope.$apply();
            $('#confirmModal').modal('show');
        })

        $scope.overdueTimeReset = moment().add(1, 'day').format('x');
        $('#overdueTimeReset').daterangepicker({
            "timePicker": true,
            "startDate": moment().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
            "endDate": moment().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
            "singleDatePicker": true,
            "timePicker24Hour": true,
            //"linkedCalendars": false,
            //"autoUpdateInput": false,
            "locale": {
                format: 'YYYY-MM-DD HH:mm:ss',
                separator: ' ~ ',
                applyLabel: $scope.LApply,
                cancelLabel: $scope.LCancel,
                resetLabel: $scope.LReset,
            }
        }, function(start,label) {
            $scope.overdueTimeReset = start.format('x');
            $scope.$apply();
            if(!this.startDate){
                this.element.val('');
            }else{
                this.element.val(this.startDate.format(this.locale.format));
            }
        });

        $('body').on('click', '.clickResetOverTime', function () {
            var id = $(this).data('id');
            $scope.ifShowResetTime = true;
            $scope.confirmText = '';
            $scope.apply = function () {
                var data = {
                    id: id,
                    overdueTime: $scope.overdueTimeReset
                }
                Api.resetExpress(data, function (json) {
                    if(json.statusCode == 0){
                        Alert.show($scope.LDetailIfDoReset, 'success');
                        $scope.confirmText = $scope.LDetailReseting;
                        $scope.$apply();
                        setTimeout(function () {
                            var confirmData = {
                                taskId : json.result.id
                            }
                            Api.getTaskInfo(confirmData,function(json){
                                if(json.result.express.status == 'IN_STORE'){
                                    $scope.confirmText = $scope.LDetailIfResetSuccessfully;
                                    Alert.show($scope.LDetailIfResetSuccessfully, 'success');
                                    $scope.onSelectPage($scope.pageNum.currentPage);
                                    return;
                                }
                                Alert.show($scope.LDetailIfResetFailed);
                            });
                        }, 500)
                    }else{
                        Alert.show($scope.LDetailIfResetFailed);
                    }

                })
            }
            $scope.$apply();
            $('#confirmModal').modal('show');
        })

        $('#confirmModal').on('hidden.bs.modal', function (e) {
            $scope.ifShowResetTime = false;
            $scope.$apply();
        })
        // $('#pakpoboxName').on('focus',function(e){
        //     var pakpoboxname=""
         
          var dropDown = new DropDown({
                selector: '#pakpoboxName',
                getData: function(value, callback){
                    var param = {
                        page:1,
                        maxCount:5,
                        name:value.trim()
                    }
                    Api.queryBoxInfo(param, function (json) {
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
                    $scope.pakpoboxNameValue = value;
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