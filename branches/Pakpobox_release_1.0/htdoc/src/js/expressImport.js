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
var WebUploader = require('./lib/webuploader/webuploader');

var Api = require('./common/api');
var userType = require('./common/usertype');
var Lang = require('./common/language');
var Header = require('raw!../tpl/Header.html');
var Nav = require('raw!../tpl/nav.html');
var Table = require('raw!../tpl/table.html');
var Alert = require('./common/alert');

(function(angular) {
    'use strict';
    angular.module('expressImport', ['ngSanitize'])
        .controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
            $.extend($scope, Lang);

            $templateCache.put('header',Header);
            $templateCache.put('nav',Nav);
            $templateCache.put('table',Table);


            $scope.originalText = 'hello';

            $scope.usertype = '';
            $scope.username = '';


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

            var uploader = WebUploader.create({
                // swf文件路径
                swf: 'assets/js/Uploader.swf',
                // 文件接收服务端。
                server: 'https://admin.pakpobox.asia/cgi-bin/index/express/import',
                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: '.searchform-filepicker',
                // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                resize: false,
                //指定上传图片的名字
                fileVal:'filename'
            });

            // 当有文件被添加进队列的时候
            uploader.on( 'fileQueued', function( file ) {
                $('#thelist').append( '<div id="' + file.id + '" class="item">' +
                    '<h4 class="info">' + file.name + '</h4>' +
                    '<p class="state">'+$scope.LWaitingUpload+'</p>' +
                    '</div>' );
            });
            // 文件上传过程中创建进度条实时显示。
            uploader.on( 'uploadProgress', function( file, percentage ) {
                var $li = $( '#'+file.id ),
                    $percent = $li.find('.progress .progress-bar');

                // 避免重复创建
                if ( !$percent.length ) {
                    $percent = $('<div class="progress progress-striped active">' +
                        '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                        '</div>' +
                        '</div>').appendTo( $li ).find('.progress-bar');
                }

                $li.find('p.state').text($scope.LUploading);

                $percent.css( 'width', percentage * 100 + '%' );
            });
            uploader.on( 'uploadSuccess', function( file, res) {
                if(res.resultCode == 0){
                    $( '#'+file.id ).find('p.state').text($scope.LUploadingComplete);
                    if(res.result.failCount > 0){
                        if(res.result.fileNum){
                            var failUrl = 'https://admin.pakpobox.asia/cgi-bin/index/express/getImportResultFile?fileNum=' + res.result.fileNum;
                        }
                        if(res.result.ALREADY_EXIST || res.result.NOT_PERMISSION || res.result.BAD_PARAMETER){
                            $scope.tableData = {
                                thead:[$scope.LUploadFailId, $scope.LUploadType],
                                tbody:[]
                            };
                            res.result.ALREADY_EXIST && res.result.ALREADY_EXIST.map(function (e) {
                                $scope.tableData.tbody.push([
                                    e,
                                    $scope.LUploadexisted
                                ])
                            })
                            res.result.NOT_PERMISSION && res.result.NOT_PERMISSION.map(function (e) {
                                $scope.tableData.tbody.push([
                                    e,
                                    $scope.LUploadNotSure
                                ])
                            })
                            res.result.BAD_PARAMETER && res.result.BAD_PARAMETER.map(function (e) {
                                $scope.tableData.tbody.push([
                                    e,
                                    $scope.LUploadArgError
                                ])
                            })

                        }

                        var html = res.result.failCount + $scope.LUploadFailCounts+'<a href="' + failUrl + '">'+$scope.LUploadFailContent+'</a>'
                        Alert.show(html, null, 'none', true);
                        $scope.pageHide = true;
                        $scope.$apply();
                    }
                }else{

                }
            });

            uploader.on( 'uploadError', function( file ) {
                $( '#'+file.id ).find('p.state').text($scope.LUploadError);
            });

            uploader.on( 'uploadComplete', function( file ) {
                $( '#'+file.id ).find('.progress').fadeOut();
            });

            $scope.typeValue = 'COURIER_STORE';
            $scope.isTypeActive=function(value){
                return $scope.typeValue == value;
            }
            $scope.exampleName = 'import-example';
            $scope.selectType = function(value){
                $scope.typeValue = value;

                switch (value){
                    case 'COURIER_STORE':
                        uploader.option('server', 'https://admin.pakpobox.asia/cgi-bin/index/express/import');
                        $scope.exampleName = 'import-example';
                        break;
                    case 'CUSTOMER_STORE':
                        uploader.option('server', 'https://admin.pakpobox.asia/cgi-bin/index/express/staffImportCustomerStoreExpress');
                        $scope.exampleName = 'import-save';
                        break;
                    case 'CUSTOMER_REJECT':
                        uploader.option('server', 'https://admin.pakpobox.asia/cgi-bin/index/express/staffImportCustomerRejectExpress');
                        $scope.exampleName = 'import-reject';
                        break;
                }

            }


            $scope.upload = function () {
                uploader.upload()
            }

        }])
        .filter('trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            }
        }]);
})(window.angular); $('body').show();