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

            var getData = function(){
                var data = {
                    endTime: moment('2015-08-11').format('x')
                }
                data.method = 'day';
                Api.getExpressDayCount(data, function (json) {
                    var dayMap = ['周一','周二','周三','周四','周五','周六','周日'];
                    var dataList = [], xDataList = [];
                    json.result.resultList.map(function (e) {
                        dataList.push(e.count);
                        xDataList.push(moment(e.timestamp).format('MM-DD ') + dayMap[moment(e.timestamp).format('E') - 1])
                        return e.count;
                    })
                    var option = {
                        tooltip: {
                            //show: true,
                            trigger: 'axis'
                        },
                        legend: {
                            data:['快递员派件数']
                        },
                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                data : xDataList
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
                                name:'快递员派件数',
                                type:'bar',
                                data:dataList
                            }
                        ]
                    };

                    // 为echarts对象加载数据
                    myChartLeft.setOption(option);
                })
                data.method = 'month';
                Api.getExpressDayCount(data, function (json) {
                    var dataList = [], xDataList = [];
                    json.result.resultList.map(function (e) {
                        xDataList.push(moment(e.timestamp).format('YYYY-MM-DD'))
                        dataList.push(e.count);
                        return e.count;
                    })
                    var option = {
                        tooltip: {
                            //show: true,
                            trigger: 'axis'
                        },
                        legend: {
                            data:['快递员派件数']
                        },
                        //calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                data : xDataList
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
                                name:'快递员派件数',
                                type:'line',
                                data:dataList
                            }
                        ]
                    };

                    // 为echarts对象加载数据
                    myChartRight.setOption(option);
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