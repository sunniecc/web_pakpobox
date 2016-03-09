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
//require('./lib/echarts/echarts-custom');
var Api = require('./common/api');
var userType = require('./common/usertype');
var Lang = require('./common/language');
var Header = require('raw!../tpl/Header.html');
var Nav = require('raw!../tpl/nav.html');
var Table = require('raw!../tpl/table.html');

(function(angular) {
    'use strict';
    angular.module('index', ['ngSanitize'])
        .controller('main',['$scope', '$templateCache', '$filter',  function($scope, $templateCache, $filter) {
            $.extend($scope, Lang);

            $templateCache.put('header',Header);
            $templateCache.put('nav',Nav);
            $templateCache.put('table',Table);


            $scope.originalText = 'hello';

            $scope.usertype = '';
            $scope.username = '';

            var scope = $scope;

            Api.userInfo(function(json){
                if(json.statusCode != 0){
                    location.href = 'login.html';
                }else{
                    $scope.userrole = json.result.role, $scope.usertype = $scope[userType[json.result.role]];
                    $scope.username = json.result.name;
                    $scope.company = json.result.company.name;
                    $scope.loginname = json.result.userName;
                    $scope.$apply();
                }
            })
            $scope.logout = Api.logout;

            var myChartLeft = echarts.init($('.index-charts-left')[0]);
            var myChartRight = echarts.init($('.index-charts-right')[0]);
            // 得到本地(系统)时区
            var timezoneOffset = new Date().getTimezoneOffset() / 60 * - 1;
            var getData = function(){
                var data = {
                    endTime: moment().format('x'),
                    timezoneOffset: timezoneOffset
                }
                data.method = 'day';
                Api.getExpressDayCount(data, function (json) {
                    var dayMap = [$scope.LMonday,$scope.LTuesday,$scope.LWednesday,$scope.LThursday,$scope.LFriday,$scope.LSaturday,$scope.LSunday];
                    var day_dataList = [], day_xDataList = [];
                    var j = 0;
                    for (var i = 6; i >= 0; i--) {
                        day_dataList[j]=json.result.result[i].count;
                        day_xDataList[j]=(moment(parseInt(json.result.result[i].day)).format('MM-DD ') + dayMap[moment(parseInt(json.result.result[i].day)).format('E') - 1])
                        j++;
                    };
                    var day_option = {
                        tooltip: {
                            //show: true,
                            trigger: 'axis'
                        },
                        legend: {
                            data:[$scope.LExpressNumber]
                        },
                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                data : day_xDataList
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                splitArea : {show : true}
                            }
                        ],
                        series : [
                            {
                                name:$scope.LExpressNumber,
                                type:'bar',
                                data:day_dataList
                            }
                        ]
                    };
                    // 为echarts对象加载数据
                    myChartLeft.setOption(day_option);
                })
                data.method = 'month';
                Api.getExpressDayCount(data, function (json) {
                    var month_dataList = [], month_xDataList = [];
                    var j = 0;
                    for (var i = json.result.result.length - 1; i >= 0; i--) {
                        month_dataList[j]=json.result.result[i].count;
                        month_xDataList[j]=moment(json.result.result[i].day).format('YYYY-MM-DD');
                        j++;
                    };
                    var month_option = {
                        tooltip: {
                            //show: true,
                            trigger: 'axis'
                        },
                        legend: {
                            data:[$scope.LExpressNumber]
                        },
                        //calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                data : month_xDataList
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                splitArea : {show : true}
                            }
                        ],
                        series : [
                            {
                                name:$scope.LExpressNumber,
                                type:'line',
                                data:month_dataList
                            }
                        ]
                    };
                    // 为echarts对象加载数据
                    myChartRight.setOption(month_option);
                })
            }
            getData();

        }])
        .filter('trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            }
        }]);
})(window.angular); $('body').show();