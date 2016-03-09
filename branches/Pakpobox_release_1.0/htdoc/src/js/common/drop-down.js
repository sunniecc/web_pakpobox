/**
 * @fileOverview drop-down下拉列表组件
 * @version 1.0.0
 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
 * @date 2015/08/15
 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
 * @see [link]
 *
 */

var DropDown = function (option) {
    this.init(option);
};

DropDown.prototype.init = function (option) {
    this.option = option;
    var $dom = $(option.selector);
    this.$dom = $dom;

    this.getStyle();

    var html = $('<ul style="' + this.ulStyle + '" class="dropdown-menu"></ul>');
    this.$menu = html;
    $dom.after(html);
    this.bind();
}

DropDown.prototype.getStyle = function () {
    var width = this.$dom.css('width');
    var height = this.$dom.css('height');
    var fontSize = this.$dom.css('font-size');
    var lineHeight = this.$dom.css('line-height');
    var padding = this.$dom.css('padding').toString();
    console.log(padding)
    this.liStyle = 'width:'+width+';height:'+height+';font-size:'+fontSize+';line-height:'+lineHeight+';padding:'+padding+';';
    console.log(this.liStyle);

    var marginTop = '-' + this.$dom.css('margin-bottom');
    var marginLeft = this.$dom.css('margin-left');
    var marginRight = this.$dom.css('margin-right');
    var marginBottom = 0;
    this.ulStyle = 'position:absolute;top: inherit;left: inherit;margin:'+marginTop+' '+marginRight+' '+marginBottom+' '+marginLeft+';';
    console.log(this.ulStyle)

}

DropDown.prototype.bind = function () {
    var self = this;
    self.$dom.focus(function (e) {
        e.stopPropagation();
        self.updateMenu();
        self.$menu.show();
    }).on('keydown', function (e) {
        var li = self.$menu.find('li.selected');
        console.log(e.keyCode )
        if(e.keyCode == 38){
            li.prev()[0] && li .removeClass().prev().addClass('selected');
        }else if(e.keyCode == 40){
            li.next()[0] && li .removeClass().next().addClass('selected');
        }else if(e.keyCode == 13){
            self.selectItem(li);
        }else{

            self.$menu.show();
            self.updateMenu();
        }
    })

    $('body').on('click', function (e) {
        e.stopPropagation();
        if(e.target.tagName != 'LI' && e.target.id != self.$dom[0].id){
            self.$menu.hide();
        }
    })

    self.$menu.on('click', 'li', function (e) {
        e.stopPropagation();
        console.log(this);
        self.selectItem($(this));
    })
}

DropDown.prototype.updateMenu = function () {
    var self = this;
    var value = self.$dom.val()

    this.option.getData(value, function (data) {
        var html = '';
        data && data.length && data.map(function (e) {
            html += '<li style="' + self.liStyle + '" data-value="' + e.value + '" data-showvalue="' + e.showValue + '">' + e.name + '</li>'
        })
        self.$menu.html(html);
        self.$menu.find('li:first').addClass('selected');
    })

}

DropDown.prototype.selectItem = function ($item) {
    var showValue = $item.data('showvalue')
    var value = $item.data('value')
    console.log(value)
    this.$dom.val(showValue);
    this.$menu.hide();
    this.option.success(value)
    return value;
}


module.exports = DropDown;