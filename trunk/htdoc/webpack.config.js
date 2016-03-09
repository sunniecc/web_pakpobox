/**
 * @fileOverview webpack配置文件
 * @version 1.0.0
 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
 * @date 2015/08/15
 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
 * @see [link]
 * @example
 *
 * pakpobox.addPage(..., ..)  增加页面，在文件尾部添加
 * pakpobox.addCommon(...) 增加common公共模块
 *
 */
var webpack = require('webpack');
var path = require('path');

var project_dir = path.resolve(__dirname, './');

var pakpobox = {
    name: 'pakpobox',
    context: path.resolve(project_dir, './src/js/'),
    entry: {},
    output: {
        path: path.resolve(project_dir, './assets/js/'),
        filename: '[name].js',
        //hotUpdateChunkFilename: './hotupdate/[id].[hash].hot-update.js',
        //hotUpdateMainFilename: './hotupdate/[hash].hot-update.json'
    },
    module: {
        loaders: [
            //{ test: /\.coffee$/, loader: 'coffee-loader' },
            //{ test: /\.jsx$/, loader: 'jsx-loader' },
            //{ test: /\.ejs$/, loader: 'ejs-compiled-loader' },
            //{ test: /\.less$/, loader: "style!css!less" }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.coffee', 'jsx']
    },
    plugins: [
         //new webpack.optimize.CommonsChunkPlugin('common.js'),
         new webpack.optimize.OccurenceOrderPlugin()
        // new webpack.optimize.UglifyJsPlugin()
    ],
    addPage: function(name, extensions){
        this.entry[name] = name + '.' + extensions;
    },
    addCommon: function(path){
        this.common.push(path);
    }
};

// pakpobox.addCommon('./common/util.js');
// pakpobox.addCommon('./common/table_box.jsx');

pakpobox.addPage('./index', 'js');
pakpobox.addPage('./login', 'js');
pakpobox.addPage('./passwd', 'js');
pakpobox.addPage('./validation', 'js');
pakpobox.addPage('./operators', 'js');
pakpobox.addPage('./express', 'js');
pakpobox.addPage('./operator_edit', 'js');
pakpobox.addPage('./operator_user', 'js');
pakpobox.addPage('./courier', 'js');
pakpobox.addPage('./express_info', 'js');
pakpobox.addPage('./logistics', 'js');
pakpobox.addPage('./logistics_info', 'js');
pakpobox.addPage('./courier_info', 'js');
pakpobox.addPage('./operators_info', 'js');
//
pakpobox.addPage('./box_edit', 'js');
pakpobox.addPage('./box_info', 'js');
//
pakpobox.addPage('./expressSend', 'js');
pakpobox.addPage('./expressSend_info', 'js');
pakpobox.addPage('./expressReturn', 'js');
pakpobox.addPage('./expressImport', 'js');
pakpobox.addPage('./pakpoboxList', 'js');
pakpobox.addPage('./logistics_edit', 'js');
pakpobox.addPage('./logistics_user', 'js');
pakpobox.addPage('./courier_edit', 'js');
pakpobox.addPage('./sms', 'js');
pakpobox.addPage('./statistics', 'js');
pakpobox.addPage('./business', 'js');
pakpobox.addPage('./advertisementList','js');


module.exports = pakpobox;