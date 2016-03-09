/**
 * @fileOverview alert警告框
 * @version 1.0.0
 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
 * @date 2015/08/15
 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
 * @see [link]
 *
 */

var tpl = require('raw!../../tpl/alert.html');

var Alert = {
    show: function (msg, type, hideDelay, hideClose) {
        $('#alert').html(tpl);
        $('#msg').html(msg);
        hideDelay = hideDelay || 3000;
        switch (type){
            case 'success':
                $('.alert')[0].className = "alert alert-success";
                break;
            case 'info':
                $('.alert')[0].className = "alert alert-info";
                break;
            case 'warning':
                $('.alert')[0].className = "alert alert-warning";
                break;
            case 'danger':
                $('.alert')[0].className = "alert alert-danger";
                break;
            default :
                $('.alert')[0].className = "alert alert-danger";
                break;
        }
        $('.alert').show();
        if(hideDelay != 'none'){
            setTimeout(function(){
                $('.alert').hide(200);
            }, hideDelay)
        }
        if(hideClose){
            $('.alert .close').hide();
        }
    }
}

module.exports = Alert;