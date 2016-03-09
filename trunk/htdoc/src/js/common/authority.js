/**
 * @fileOverview authority权限问题
 * @version 1.0.0
 * @author <a href="mailto:lucienxu@tencent.com">lucienxu</a>
 * @date 2015/12/04
 * @copyright Copyright (c) 2014, Tencent Inc. All rights reserved.
 * @see [link]
 *
 */

var tpl = require('raw!../../tpl/alert.html');
var Api = require('./api');

var Authority = {
   companyList:function (date) {
        Api.companyQuery(data, function (json) {
          if(json.statusCode == 0){
          //将查询到的公司信息填充到companyList下拉框中
          $scope.companyList = json.result.resultList;
             if($scope.companyList.length<=0)
              {
               $("#company").val('')
              }
             $scope.$apply();                    
              }                          
        })    
   },
}

module.exports = Authority;