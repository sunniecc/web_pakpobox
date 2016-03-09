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
var Alert = require('./common/alert');
var errorCode = require('./common/errorCode');
var Api = require('./common/api');
var userType = require('./common/usertype');
var Lang = require('./common/language');
var Header = require('raw!../tpl/Header.html');
var Nav = require('raw!../tpl/nav.html');
var Table = require('raw!../tpl/table.html');
var DropDown = require('./common/drop-down');
var Api = require('./common/api');

(function (angular) {
    'use strict';
    angular.module('business', ['ngSanitize'])
        .controller('main', ['$scope', '$templateCache', '$filter', function($scope, $templateCache, $filter) {
            $.extend($scope, Lang);

            $templateCache.removeAll();
            $templateCache.put('header', Header);
            $templateCache.put('nav', Nav);
            $templateCache.put('table', Table);
            var imgList =[];
            var ADList =[];
            var selectFile = false;
            Api.userInfo(function (json) {
                if (json.statusCode != 0) {
                    location.href = 'login.html';
                } else {
                    $scope.userrole = json.result.role, $scope.usertype = $scope[userType[json.result.role]];
                    $scope.username = json.result.name;
                    $scope.$apply();
                }
            })
            $scope.logout = Api.logout;
            // 初始化Web Uploader
            var uploader = WebUploader.create({

                // 选完文件后，是否自动上传。
                auto: true,

                // swf文件路径
                swf:'assets/js/Uploader.swf',

                // 文件接收服务端。
                server: '/cgi-bin/index/upload/upload',

                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: '.filePicker',
                 //指定上传图片的名字
                fileVal:'file',

                // 只允许选择图片文件。
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/*'
                }

            });

            // 当有文件添加进来的时候
            uploader.on( 'fileQueued', function( file ) {
                selectFile = true;
                var $li = $(
                        '<div id="' + file.id + '" class="file-item thumbnail">' +
                            '<img>' +
                            '<div class="info">' + file.name + '</div>' +
                        '</div>'
                        ),
                    $img = $li.find('img');

                uploader.md5File( file );
                console.log(uploader.md5File( file ));
                // $list为容器jQuery实例
                $('#fileList').append( $li );
                // 创建缩略图
                // 如果为非图片文件，可以不用调用此方法。
                // thumbnailWidth x thumbnailHeight 为 100 x 100
                uploader.makeThumb( file, function( error, src ) {
                    if ( error ) {
                        $img.replaceWith('<span>不能预览</span>');
                        return;
                    }

                    $img.attr( 'src', src );
                }, 150,150 );
            });

            // 文件上传过程中创建进度条实时显示。
            uploader.on( 'uploadProgress', function( file, percentage ) {
                var $li = $( '#'+file.id ),
                    $percent = $li.find('.progress span');

                // 避免重复创建
                if ( !$percent.length ) {
                    $percent = $('<p class="progress"><span></span></p>')
                            .appendTo( $li )
                            .find('span');
                }
                $percent.css( 'width', percentage * 100 + '%' );
            });

            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            uploader.on( 'uploadSuccess', function( file ,res) {
                imgList.push(res.id);
                Alert.show($scope.LUploadImgSuccess,'success');
                $( '#'+file.id ).addClass('upload-state-done');
                $( '#'+file.id ).val(res.id);
                console.log(file.id);

            });

            // 文件上传失败，显示上传出错。
            uploader.on( 'uploadError', function( file ) {
                var $li = $( '#'+file.id ),
                    $error = $li.find('div.error');

                // 避免重复创建
                if ( !$error.length ) {
                    $error = $('<div class="error"></div>').appendTo( $li );
                }

                $error.text('上传失败');
            });

            // 完成上传完了，成功或者失败，先删除进度条。
            uploader.on( 'uploadComplete', function( file ) {
                console.log("删除进度条");
                $( '#'+file.id ).find('.progress').remove();
            });




            $scope.imgList = [
                {
                    name: 'business_1.jpg',
                    url: 'assets/img/business_1.jpg'
                },
            ]


            $scope.submit = function () {
                if(!selectFile){
                    Alert.show($scope.LPleaseChooseFile);
                    return;
                }else if($scope.position==""||$scope.position==undefined){
                    Alert.show($scope.LPleaseChooseADLocationInfo);
                    return;
                }else if($scope.companyValue==""||$scope.companyValue==undefined){
                    Alert.show($scope.LPleaseChooseOprator);
                    return;
                }else{
                    // uploader.upload()    
                    for (var i = imgList.length - 1; i >= 0; i--) {
                        console.log(imgList[i]);
                    };
                    var data = {
                    "company":{
                    "id": $scope.companyValue
                    },
                    "doc":{
                    "id": imgList[0]
                    },
                    position:$scope.position
                    }
                    Api.uploadImgInfo(data,function(json){
                        if(json.statusCode==0){
                            ADList.push(json.result.id);
                            Alert.show($scope.LUploadADInfoSuccess,'success');
                        }else{
                            Alert.show(json.msg.errorMessage);
                        }
                         // setTimeout(function() {
                         // window.location.reload();
                         // }, 2000);

                    });
                }
                
            }

            var dropDown = new DropDown({
            selector: '#company',
            getData: function(value, callback){
                var param = {
                    page:1,
                    maxCount:5,
                    companyFuzzyName: value,
                    startLevel: $scope.usercompanylevel,
                    companyType: 'OPERATOR'
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
                $scope.companyValue = value;
                $scope.$apply();
            }
        })
        }])
        .filter('trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            }
        }]).directive('placeholder', ['$compile', function ($compile) {
            return {
                restrict: 'A',
                scope: {},
                link: function (scope, ele, attr) {
                    var input = document.createElement('input');
                    var isSupportPlaceholder = 'placeholder' in input;
                    if (!isSupportPlaceholder) {
                        var fakePlaceholder = angular.element(
                            '<span class="placeholder">' + attr['placeholder'] + '</span>');
                        fakePlaceholder.on('click', function (e) {
                            e.stopPropagation();
                            ele.focus();
                        });
                        ele.before(fakePlaceholder);
                        $compile(fakePlaceholder)(scope);
                        ele.on('focus', function () {
                            fakePlaceholder.hide();
                        }).on('blur', function () {
                            if (ele.val() === '') {
                                fakePlaceholder.show();
                            }
                        });
                    }
                }
            };
        }]);
    ;
})(window.angular); $('body').show();