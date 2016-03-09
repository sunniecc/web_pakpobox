/**
 * @fileOverview api接口
 * @version 1.0.0
 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
 * @date 2015/08/15
 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
 * @see [link]
 *
 */

var Lang = require('./language');
var Alert = require('./alert');

var urlHead = '/cgi-bin/';
var getData = function (url, data, callback) {
    $.ajax({
        url: urlHead + url,
        type: 'GET',
        data: data,
        dataType: 'json',
        success: function (json) {
            callback(json);
        },
        error: function (err) {
            console.log(err)
            Alert.show(Lang.LConnectError);
        }
    })
}

var postData = function (url, data, callback) {
    data = JSON.stringify(data);
    $.ajax({
        url: urlHead + url,
        type: 'POST',
        data: data,
        dataType: 'json',
        contentType: 'application/json',
        success: function (json) {
            callback(json);
        },
        error: function () {
            Alert.show(Lang.LConnectError);
        }
    })
}

var Api = {
    param: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    },
    login: function (param, callback) {
        var url = 'index/user/login',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
    logout: function () {
        var url = 'index/user/logout',
            data = {}
        postData(url, data, function (json) {
            if(json.statusCode == 0){
                location.href = 'login.html';
            }
        })
    },
    post: function (callback) {
        var url = 'index/user/post',
            data = {}
        postData(url, data, function (json) {
            callback(json);
        })
    },
    userInfo: function (callback) {
        var url = 'index/user/userInfo',
            data = {}
        getData(url, data, function (json) {
            callback(json);
        })
    },
    getPeopelDetails: function (param, callback) {
        var url = 'index/user/info',
            data = {}
        $.extend(data, param);
        getData(url, data, function (json) {
            callback(json);
        })
    },
    loginNameExist: function (param,callback){
        var url = 'index/user/loginNameExist',
            data = {}
        $.extend(data, param);
        getData(url,data,function(json){
            callback(json);
        })

    },
    phoneExist: function (param,callback){
        var url = 'index/user/phoneExist',
            data = {}
        $.extend(data, param);
        getData(url,data,function(json){
            callback(json);
        })

    },
    getExpress: function (param, callback) {
        var url = 'index/express/query',
            data = {}
        $.extend(data, param);
        getData(url, data, function (json) {
            callback(json);
        })
    },
    getExpressDayCount: function (param, callback) {
        var url = 'index/express/getDayCount',
            data = {}
        $.extend(data, param);
        getData(url, data, function (json) {
            callback(json);
        })
    },
    getExpressStatics: function (param, callback) {
        var url = 'index/express/expressStatics',
            data = {}
        $.extend(data, param);
        getData(url, data, function (json) {
            callback(json);
        })
    },
    companyQuery: function(param, callback){
        var url = 'index/company/query',
            data = {}
        $.extend(data, param);
        getData(url, data, function (json) {
            callback(json);
        })
    },
    companyInfo: function(param, callback){
        var url = 'index/company/info',
            data = {}
        $.extend(data, param);
        getData(url, data, function (json) {
            callback(json);
        })
    },
    companyUpdate: function(param, callback){
        var url = 'index/company/update',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
    companyDelete: function(param, callback){
        var url = 'index/company/delete',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
    courierInfo: function(param, callback){
        var url = 'index/user/queryStaff',
            data = {}
        $.extend(data, param);
        getData(url, data, function (json) {
            callback(json);
        })
    },
    updatePassword: function (param, callback) {
        var url = 'index/user/updatePassword',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
    delectUser: function (param, callback) {
        var url = 'index/user/deleteStaff',
            data = {}
        $.extend(data, param);
         postData(url, data, function (json) {
            callback(json);
            })
    },
    modifyExpress: function (param, callback) {
        var url = 'index/express/modifyPhoneNumber',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
    createCompany: function (param, callback) {
        var url = 'index/company/create',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
    updateCompany: function (param, callback) {
        var url = 'index/company/update',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
    createStaff: function (param, callback) {
        var url = 'index/user/createStaff',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
    updateStaff: function (param, callback) {
        var url = 'index/user/updateStaff',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
    queryBoxType: function (callback) {
        var url = 'box/mouth/type',
            data = {}
        postData(url, data, function (json) {
            callback(json);
        })
    },
    updateBox: function (param, callback) {
        var url = 'index/box/update',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
     rebuildBox: function (param, callback) {
        var url = 'index/box/rebuild',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
    queryBoxInfo: function (param, callback) {
        var url = 'index/box/query',
            data = {}
        $.extend(data, param);
        getData(url, data, function (json) {
            callback(json);
        })
    },
    queryBoxName: function (param, callback){
        var url = 'index/box/queryBoxName',
            data = {}
        $.extend(data, param);
        getData(url, data, function (json) {
            callback(json);
        })
    },
    getBoxInfo: function (param, callback) {
        var url = 'index/box/info',
            data = {}
        $.extend(data, param);
        getData(url, data, function (json) {
            callback(json);
        })
    },
    querySurplusMouth: function (param, callback) {
        var url = 'index/box/querySurplusMouth',
            data = {}
        $.extend(data, param);
        getData(url, data, function (json) {
            callback(json);
        })
    },
    remoteUnlock: function (param, callback) {
        var url = 'task/mouth/remoteUnlock',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
    updateMouth: function (param, callback) {
        var url = 'box/mouth/update',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
    getTaskInfo: function (param, callback) {
        var url = 'index/task/info',
            data = {}
        $.extend(data, param);
        getData(url, data, function (json) {
            callback(json);
        })
    },
    getSmsInfo: function (param, callback) {
        var url = 'index/sms/express',
            data = {}
        $.extend(data, param);
        getData(url, data, function (json) {
            callback(json);
        })
    },
    resendSms: function (param, callback) {
        var url = 'index/express/resendSms',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
    resetExpress: function (param, callback) {
        var url = 'task/express/resetExpress',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
    getSmsList: function (param, callback) {
        var url = 'sms/account/list',
            data = {}
        $.extend(data, param);
        getData(url, data, function (json) {
            callback(json);
        })
    },
    uploadImgInfo: function (param, callback) {
        var url = 'index/upload/uploadImgInfo',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },
    deleteImg: function (param, callback) {
        var url = 'index/upload/deleteImg',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },

    queryADInfo: function (param, callback){
        var url = 'index/upload/queryADInfo',
            data = {}
        $.extend(data, param);
        getData(url, data, function (json) {
            callback(json);
        })
    },

    updateBoxStatus: function(param, callback){
        var url = 'index/box/updateBoxStatus',
            data = {}
        $.extend(data, param);
        postData(url, data, function (json) {
            callback(json);
        })
    },

}

module.exports = Api;