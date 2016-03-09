/**
 * @fileOverview box-selector箱子选择组件
 * @version 1.0.0
 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
 * @date 2015/08/15
 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
 * @see [link]
 *
 */
var startX, startY;
var typeMap = {
    MINI: 'fa8211cb082f11e5a29a0242ac110001',
    S: 'fa820f16082f11e5a29a0242ac110001',
    M: 'fa820ca9082f11e5a29a0242ac110001',
    L: 'fa8212d6082f11e5a29a0242ac110001',
    XL: 'fa821384082f11e5a29a0242ac110001',
    XXL: 'fa82143d082f11e5a29a0242ac110001',
}
var typeReMap = {
    'fa8211cb082f11e5a29a0242ac110001': 'MINI',
    'fa820f16082f11e5a29a0242ac110001': 'S',
    'fa820ca9082f11e5a29a0242ac110001': 'M',
    'fa8212d6082f11e5a29a0242ac110001': 'L',
    'fa821384082f11e5a29a0242ac110001': 'XL',
    'fa82143d082f11e5a29a0242ac110001': 'XXL',
}
var statusMap = ['ENABLE', 'USED', 'LOCKED']

var expressStatusMap = {
    'IMPORTED':	'导入件',
    'IN_STORE':	'存储件',
    'CUSTOMER_TAKEN':	'顾客取走',
    'COURIER_TAKEN':	'快递员取走',
    'OPERATOR_TAKEN':	'运营商工作人员取走',
}

var BoxSelector = function () {


}

BoxSelector.prototype.init = function (data, size_1, size_2) {
    var self = this;
    setTimeout(function() {
        self.resetBox(data, size_1, size_2);
    }, 200);
}

BoxSelector.prototype.resetBox = function (data, size_1, size_2) {
    // size1代表列, size2代表行
    var self = this;
    size_1 = (size_1 && size_1 > 10) ? size_1: 10;
    size_2 = size_2 || 10;

    $('#size_1').val(size_1);
    $('#size_2').val(size_2);

    data = data || self.getAll();
    this.data = data;
    var html = '';
    for (var i = 0; i < size_1; i++) {
        html += '<button class="btn btn-sm btn-primary box-colcope" data-index="'+ i +'">复制整列</button>';
    }
    $('.box-buttons').html(html);
    html = '';
    var map = data.map(function () {
        return 0
    });
    var boxData = [];
    data.map(function (item, ii) {
        if(item.deleteFlag != 1){
            var mouthsresult = [];
            item.mouths.map(function (item2, iii) {
                if(item2.deleteFlag != 1){
                    mouthsresult.push(item2);;
                }
            })
            if(mouthsresult.length){
                boxData.push({
                    id: item.id,
                    number: item.number,
                    deleteFlag: item.deleteFlag,
                    mouths: mouthsresult
                })
            }

        }
    })

    for (var i = 0; i < size_2; i++) {
        var mouths = [], colids = [];



        boxData.map(function (item, ii) {
            if (item.mouths && item.mouths[map[ii]]) {
                if(item.mouths[map[ii]] && item.mouths[map[ii]].deleteFlag != 1){
                    mouths[ii] = item.mouths[map[ii]];
                    colids.push(item.id || '');
                    map[ii]++;
                }
            }
        })
        //console.log(mouths)
        html += '<tr data-index="' + i + '">';

        for (var j = 0; j < size_1; j++) {
            var id = '', del = 0, number = '', type = '', status = '',
                express = '';
            if (mouths && mouths[j] && mouths[j].deleteFlag != 1) {
                id = mouths[j].id || '';
                del = mouths[j].deleteFlag || 0;
                number = mouths[j].number;
                status = statusMap.indexOf(mouths[j].status) || 0;
                type = typeReMap[mouths[j].mouthType.id];
                if(mouths[j].express){
                    var expressInfo = {
                        expressNumber : mouths[j].express.expressNumber || '',
                        storeTime : mouths[j].express.storeTime || '',
                        takeTime : mouths[j].express.takeTime || '',
                        validateCode : mouths[j].express.validateCode || '',
                        storeUserName : mouths[j].express.storeUser.name || '',
                        storeUserPhoneNumber : mouths[j].express.storeUser.phoneNumber || '',
                        takeUserPhoneNumber : mouths[j].express.takeUserPhoneNumber || '',
                        expressstatus : mouths[j].express.status || '',
                    }
                    for(x in expressInfo){
                        express += 'data-' + x + '="' + expressInfo[x] + '" '
                    }
                }
            }
            var showType = type, showNumber = number;
            if(del){
                showType = '', showNumber = '';
            }
            html += '<td class="box-type-' + showType + '" data-colid="' + (colids[j] || '') + '" data-id="' + id + '" data-del="' + del + '" data-number="' + number + '" data-status="' + status + '" data-type="' + type + '" data-index="' + j + '" ' + express + ' draggable="true">\
                            <div class="box-number" data-number="' + number + '">' + showNumber + '</div>\
                            <div class="box-type" data-number="' + number + '">' + showType + '</div>\
                            <div class="box-info" data-number="' + number + '"><i class="glyphicon glyphicon-info-sign"></i></div>\
                            <div class="box-op">\
                                <button class="btn btn-sm btn-primary box-cope">\
                                    <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>\
                                </button>\
                                <button class="btn btn-sm btn-primary box-del">\
                                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>\
                                </button>\
                            </div>\
                        </td>'

        }
        html += '</tr>';
    }

    $('.box-table tbody').html(html);
    resetNumber();
    $('.box-table tr td').css({

        width: (830 / size_1) + 'px',
        height: (600 / size_1) + 'px'
    })
    $('.box-colcope').css({
        width: (820 / size_1) + 'px'
        //height: (600 / size_2) + 'px'
    })
}
//获取选中目标的number
BoxSelector.prototype.getSelected = function () {
    var result = [];
    $('.box-table td.selected').each(function (i, e) {
        result.push({
            number: $(e).data('number'),
            id: $(e).data('id')
        });
    })
    return result;

}

//获取所有的number
BoxSelector.prototype.getAll = function () {
    var result = [];
    var len = $('.box-table tr:first td').length;
    var n = 0;
    for(var i = 0; i < len; i++){
        $('.box-table tr').each(function (k, e) {
            var td =  $(e).find('td:eq('+ i +')');
            if(!!td.data('type')){
                if(!result[n]){
                    result[n] = {
                        number: i + 1,
                        mouths: []
                    };
                    td.data('colid') && (result[n].id = td.data('colid'));
                }
                var mouth = {
                    number: td.data('number'),
                    numberInCabinet: k + 1,
                    mouthType: {
                        id: typeMap[td.data('type')]
                    },
                    deleteFlag: td.data('del')
                }
                //if(td.data('del')){
                //    mouth = {
                //        number: td.data('number'),
                //        numberInCabinet: k + 1,
                //        mouthType: {
                //            id: typeMap[td.data('typeback')]
                //        },
                //        deleteFlag: td.data('del')
                //    }
                //}
                td.data('id') && (mouth.id = td.data('id'));

                result[n].mouths.push(mouth);
            }
        })
        n ++;
    }
    var resNumber = 1;
    var res = result.map(function (e) {
        var deleteFlag = 1;
        e.mouths.map(function (ee) {
            if(ee.deleteFlag != 1){
                deleteFlag = 0;
                return false;
            }
        })
        e.deleteFlag = deleteFlag;
        e.number = resNumber;
        if(!deleteFlag){
            resNumber++;
        }
        return e;
    })
    return res;
}

BoxSelector.prototype.edit = function () {
    var self = this;
    setTimeout(function(){
        $('.box-symbol_type').show();
        $('.edit-content').show();
        self.drag();
        self.cope();
    }, 400)
}

//拖拽
BoxSelector.prototype.drag = function () {
    var self = this;
    $('#size_1, #size_2').attr('disabled', false).off('change', null).on('change', function () {
        var size_1 = $('#size_1').val();
        var size_2 = $('#size_2').val();
        self.resetBox(null, size_1, size_2);
        self.drag();
        self.cope();
    })
    var typeRecord;
    $('.box-symbol_tag').css('cursor', 'move').off('dragstart', null).on('dragstart', function (e) {
        //e.originalEvent.dataTransfer.setData("Type", $(e.target).data('type'));
        typeRecord = $(e.target).data('type');
    })

    $('.box-table td').css('cursor', 'move').off('dragstart', null).on('dragstart', function (e) {
        $(this).find('.box-op').hide();
        //e.originalEvent.dataTransfer.setData("Type", $(e.target).data('type'));
        typeRecord = $(e.target).data('type');
    }).off('drop', null).on('drop', function (e) {
        //var number = e.originalEvent.dataTransfer.getData("Number");
        //var status = e.originalEvent.dataTransfer.getData("Status");
        //var type = e.originalEvent.dataTransfer.getData("Type");
        var type = typeRecord;
        var t = $(e.target);
        if(t[0].tagName != 'TD'){
            t = t.parent();
        }
        t.data('type', type).data('del', '0');
        t.removeClass('box-type-MINI').removeClass('box-type-S').removeClass('box-type-M').removeClass('box-type-L').removeClass('box-type-XL').removeClass('box-type-XXL').addClass('box-type-' + type);
        //t.removeClass('box-status-0').removeClass('box-status-1').removeClass('box-status-2').addClass('box-status-' + status);
        //t.find('.box-number').text(number).data('number', number);
        t.find('.box-type').text(type);
        //$('.box-table td:first').trigger('dragstart');
        resetNumber();
        e.preventDefault();
    }).off('dragover', null).on('dragover', function (e) {
        e.preventDefault();
    })
}

BoxSelector.prototype.cope = function () {

    //复制整列
    $('.box-table td').off('mouseover', null).on('mouseover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if(!!$(this).data('type')){
            if(!parseInt($(this).data('del'))){
                //已删除的不显示左侧操作
                $(this).find('.box-op').show();
            }
            var index = $(this).data('index');
            $('.box-colcope[data-index="' + index + '"]').css('visibility', 'visible');
        }
    }).off('mouseout', null).on('mouseout', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).find('.box-op').hide();
        var index = $(this).data('index');
        $('.box-colcope[data-index="' + index + '"]').css('visibility', 'hidden');
    })
    $('.box-colcope').off('mouseover', null).on('mouseover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).css('visibility', 'visible');
    })
    $('.box-colcope').off('mouseout', null).on('mouseout', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).css('visibility', 'hidden');
    })
    $('.box-colcope').off('click', null).on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var index = $(this).data('index');
        var tdIndex = 1;
        $('.box-table tr:first td').each(function (ii, item2) {
            if(!$(item2).data('type')){
                tdIndex = ii;
                return false;
            }
        })

        $('.box-table tr').each(function (i, item) {
            var itemTd = $(item).find('td:eq('+ index +')');
            $(item).find('td:gt('+ index +')').each(function (ii, item2) {
                if($(item2).data('index') == tdIndex && !parseInt(itemTd.data('del'))){
                    //var number = itemTd.data('number');
                    //var status = itemTd.data('status');
                    var type = itemTd.data('type');
                    //$(item2).data('status', status).data('type', type).removeClass('box-status-0').removeClass('box-status-1').removeClass('box-status-2').addClass('box-status-' + status);
                    $(item2).data('type', type).data('del', '0');
                    $(item2).removeClass('box-type-MINI').removeClass('box-type-S').removeClass('box-type-M').removeClass('box-type-L').removeClass('box-type-XL').removeClass('box-type-XXL').addClass('box-type-' + type);
                    //$(item2).removeClass('box-status-0').removeClass('box-status-1').removeClass('box-status-2').addClass('box-status-' + status);
                    $(item2).find('.box-type').text(type);
                    return false;
                }
            })
        })
        resetNumber();
    })

    //复制此列
    $('.box-table td .box-cope ').off('click', null).on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var trIndex = $(this).parent().parent().parent().data('index');
        var tdIndex = $(this).parent().parent().data('index');
        var copeArr = [];
        var num = 0;
        $('.box-table tr').each(function (i, item) {
            var itemTd = $(item).find('td:eq('+ tdIndex +')');
            if($(item).data('index') <= trIndex){
                copeArr.push({
                    //number: itemTd.data('number'),
                    //status: itemTd.data('status'),
                    type: itemTd.data('type'),
                });
            }else{
                if(!copeArr[num]){
                    return false;
                }
                if(!itemTd.data('type') || parseInt(itemTd.data('del'))){
                    //var number = copeArr[num].number;
                    //var status = copeArr[num].status;
                    var type = copeArr[num].type;
                    itemTd.data('type', type).data('del', '0');
                    itemTd.removeClass('box-type-MINI').removeClass('box-type-S').removeClass('box-type-M').removeClass('box-type-L').removeClass('box-type-XL').removeClass('box-type-XXL').addClass('box-type-' + type);
                    //itemTd.data('status', status).data('type', type).removeClass('box-status-0').removeClass('box-status-1').removeClass('box-status-2').addClass('box-status-' + status);
                    itemTd.find('.box-type').text(type);
                    num ++;
                }
            }
        })
        resetNumber();
    })

    //删除此项
    $('.box-table td .box-del ').off('click', null).on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var itemTd = $(this).parent().parent();
        if(!itemTd.data('id')){
            itemTd.data('type', '')
        }else{
            itemTd.data('del', '1');
        }
        //itemTd.data('typeback', itemTd.data('type')).data('type', '').data('del', '1');

        itemTd.removeClass('box-type-MINI').removeClass('box-type-S').removeClass('box-type-M').removeClass('box-type-L').removeClass('box-type-XL').removeClass('box-type-XXL');
        //itemTd.data('status', status).data('type', type).removeClass('box-status-0').removeClass('box-status-1').removeClass('box-status-2').addClass('box-status-' + status);
        itemTd.find('.box-type').text('');
        itemTd.find('.box-number').text('');
        itemTd.find('.box-op').hide();
        resetNumber();
    })

}

BoxSelector.prototype.setStatus = function (arr, status) {
    var numberArr = arr.map(function (e) {
        return e.number;
    })
    $('.box-table td').each(function (i, e) {
        if($.inArray($(e).data('number'), numberArr) != -1 && !parseInt($(e).data('del'))){
            $(e).data('status', status).removeClass('box-status-0').removeClass('box-status-1').removeClass('box-status-2').addClass('box-status-' + status);
        }
    })
}

BoxSelector.prototype.changeColorToStatus = function () {
    $('.box-table td').each(function (i, e) {
        if(!parseInt($(e).data('del'))){
            if($(e).data('status')){
                $(e).removeClass().addClass('box-status-' + $(e).data('status'));
            }else if($(e).data('number')){
                $(e).removeClass().addClass('box-status-0');
            }
        }
    })
}

BoxSelector.prototype.showInfo = function () {
    $('.box-info i').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $info = $(this).parent().parent();
        if($info.data('expressnumber')){
            $('#boxInfoModal #mouthId').text($info.data('id'));
            $('#boxInfoModal #expressNumber').text($info.data('expressnumber'));
            $('#boxInfoModal #storeTime').text(moment($info.data('storetime')).format('YYYY-MM-DD HH:mm'));
            $('#boxInfoModal #takeTime').text(moment($info.data('taketime')).format('YYYY-MM-DD HH:mm'));
            $('#boxInfoModal #validateCode').text($info.data('validatecode'));
            $('#boxInfoModal #storeUserName').text($info.data('storeusername'));
            $('#boxInfoModal #storeUserPhoneNumber').text($info.data('storeuserphonenumber'));
            $('#boxInfoModal #takeUserPhoneNumber').text($info.data('takeuserphonenumber'));
            $('#boxInfoModal #expressStatus').text(expressStatusMap[$info.data('expressstatus')] + '（' + $info.data('expressstatus') + '）');
            $('#boxInfoModal #expressDetail').attr('href', 'express_info.html?expressNumber=' + $info.data('expressnumber'));
        }
        $('#boxInfoModal').modal('show');
    })

}

//框选
BoxSelector.prototype.region = function(){
    var self = this;
    setTimeout(function () {
        $('.box-symbol_status').show();
        $('#remainMouths').parent().show();
        self.changeColorToStatus();
        self.showInfo();
        $('.box-table td').on('mouseover', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if($(this).data('expressnumber')){
                $(this).find('.box-info').show();
            }
        }).on('mouseout', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).find('.box-info').hide();
        })
    }, 200)

    var moveFlag = 0;

    $('body').on('mousedown', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if(e.target.tagName == 'A' || e.target.tagName == 'BUTTON' || e.target.tagName == 'I'){
            return;
        }

        moveFlag = 1;

        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        startX = e.clientX + scrollX;
        startY = e.clientY + scrollY;

        //初始化矩形
        if(!$('#rect').length){
            $('body').append($('<div id="rect"></div>'));
        }
        $('#rect').css({
            left: startX + 'px',
            top: startY + 'px',
            width: 0 + 'px',
            height: 0 + 'px'
        })


    })
    $('body').on('mousemove', function (ee) {
        if(!moveFlag){
            return;
        }
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        var x = ee.clientX + scrollX;
        var y = ee.clientY + scrollY;

        //改变矩形
        if(x >= startX){
            $('#rect').css({
                left: startX + 'px',
                width:  x - startX + 'px'
            });
        }else{
            $('#rect').css({
                left: x + 'px',
                width: startX - x + 'px'
            })
        }

        if(y >= startY){
            $('#rect').css({
                top: startY + 'px',
                height:  y - startY + 'px'
            });
        }else{
            $('#rect').css({
                top: y + 'px',
                height: startY - y + 'px'
            })
        }

        //选中元素
        $('.box-table td').each(function (i, item) {
            if(!$(item).data('number')){
                return;
            }
            var itemX = $(item).offset().left;
            var itemY = $(item).offset().top;

            $(item).removeClass('choose');
            if(checkBoxSelected(itemX, itemY, startX, startY, x, y) && $(item).data('number') && !parseInt($(item).data('del'))){
                $(item).addClass('choose');
            }
        })
    })
    $('body').on('mouseup', function (ee) {
        if(!moveFlag){
            return;
        }

        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        var x = ee.clientX  + scrollX;
        var y = ee.clientY  + scrollY;

        $('#rect').remove();
        var selectedNum = 0;
        //确认元素
        $('.box-table td').each(function (i, item) {
            if(!$(item).data('number') || parseInt($(item).data('del'))){
                return;
            }

            var itemX = $(item).offset().left;
            var itemY = $(item).offset().top;

            $(item).removeClass('choose');
            if(checkBoxSelected(itemX, itemY, startX, startY, x, y)){
                if($(item).hasClass('selected')){
                    $(item).removeClass('selected');
                }else{
                    //if($(item).data('status') != 1){
                        $(item).addClass('selected');
                    //}
                }
                selectedNum ++;
            }
        })
        if(selectedNum == 0){
            $('.box-table td').removeClass('selected');
        }
        //$('body').off('mousemove', null);
        //$('body').off('mouseup', null);
        moveFlag = 0;
    })
}

var checkBoxSelected = function(itemX, itemY, startX, startY, x, y){
    //两个矩形的左上角和右下角点坐标
    var Xa1 = startX, Xa2 = x, Xb1 = itemX, Xb2 = itemX + 77;
    var Ya1 = startY, Ya2 = y, Yb1 = itemY, Yb2 = itemY + 60;

    //两个矩形的宽高
    var Wa = Math.abs(Xa2 - Xa1), Ha = Math.abs(Ya2 - Ya1);
    var Wb = Math.abs(Xb2 - Xb1), Hb = Math.abs(Yb2 - Yb1);

    //两个矩形的中心点
    var Xac = (Xa1 + Xa2) / 2, Xbc = (Xb1 + Xb2) / 2;
    var Yac = (Ya1 + Ya2) / 2, Ybc = (Yb1 + Yb2) / 2;

    //两个矩形中心点的距离
    var XcL = Math.abs(Xbc - Xac), YcL = Math.abs(Ybc - Yac);

    //console.log(XcL, YcL)
    if(XcL <= (Wa/2 + Wb/2) && YcL <= (Ha/2 + Hb/2)){
        return true;
    }
    return false;
}

var resetNumber = function () {
    var number = 1;
    var len = $('.box-table tr:first td').length;
    for(var i = 0; i < len; i++){
        $('.box-table tr').each(function (k, e) {
            var td =  $(e).find('td:eq('+ i +')');
            if(!!td.data('type') && !parseInt(td.data('del'))){
                td.data('number', number);
                td.find('.box-number').text(number);
                td.find('div').data('number', number);
                number ++;
            }else{
                if(!parseInt(td.data('del'))){
                    td.data('number', '');
                    td.find('div').data('number', '');
                }
                td.find('.box-number').text('');

            }
        })
    }

}



module.exports = BoxSelector;