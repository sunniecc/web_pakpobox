!function(e){function t(o){if(a[o])return a[o].exports;var n=a[o]={exports:{},id:o,loaded:!1};return e[o].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var a={};return t.m=e,t.c=a,t.p="",t(0)}([function(e,t,a){a(8);var o=a(12),n=a(5),s=a(9),r=a(1),i=a(3),l=a(10),p=a(2),c=a(14);!function(e){"use strict";e.module("operatorEdit",["ngSanitize"]).controller("main",["$scope","$templateCache","$filter",function(e,t,a){$.extend(e,r),t.removeAll(),t.put("header",i),t.put("nav",l),n.userInfo(function(t){0!=t.statusCode?location.href="login.html":(e.userrole=t.result.role,e.usertype=e[s[t.result.role]],e.username=t.result.name,e.$apply())}),e.logout=n.logout;var u,d=n.param("id");if(d){e.update=!0;var L={companyId:d};n.companyInfo(L,function(t){0==t.statusCode&&t.result&&(u=t.result,e.name=u.name,e.parent=u.parentCompany?u.parentCompany.name:"",e.parentValue=u.parentCompany?u.parentCompany.id:"",e.$apply())})}e.SubmitText=e.LSubmitValidate,e.submit=function(){if(!e.name)return void p.show("请输入运营商名称！");e.submitDisabled=!0,e.SubmitText=e.LSubmitValidating;var t={name:e.name,parentCompany:{id:e.parentValue},companyType:"OPERATOR"};e.parent&&(t.parentCompany={id:e.parentValue}),d?(t.id=d,n.updateCompany(t,function(t){0==t.statusCode?location.href="operator_user.html?id="+d:(e.submitDisabled=!1,e.SubmitText=e.LSubmitValidate,p.show(o[t.statusCode])),e.$apply()})):n.createCompany(t,function(t){0==t.statusCode?location.href="operator_user.html?id="+t.result.id:(e.submitDisabled=!1,e.SubmitText=e.LSubmitValidate,p.show(o[t.statusCode])),e.$apply()})};new c({selector:"#parent",getData:function(e,t){var a={page:1,maxCount:5,companyType:"OPERATOR",companyFuzzyName:e};n.companyQuery(a,function(e){var a=[];0==e.statusCode&&e.result.resultList.map(function(e){a.push({name:e.name+"("+(e.contactName||" ")+")",value:e.id,showValue:e.name})}),t(a)})},success:function(t){e.parentValue=t,e.$apply()}})}]).filter("trusted",["$sce",function(e){return function(t){return e.trustAsHtml(t)}}]).directive("placeholder",["$compile",function(t){return{restrict:"A",scope:{},link:function(a,o,n){var s=document.createElement("input"),r="placeholder"in s;if(!r){var i=e.element('<span class="placeholder">'+n.placeholder+"</span>");i.on("click",function(e){e.stopPropagation(),o.focus()}),o.before(i),t(i)(a),o.on("focus",function(){i.hide()}).on("blur",function(){""===o.val()&&i.show()})}}}}])}(window.angular),$("body").show()},function(e,t,a){if("en"==localStorage.lang)var o=a(6);else var o=a(7);console.log(o),o.localStorage=localStorage,o.location=location,o.LChooseLang=function(e){localStorage.lang=e,location.href=location.href},e.exports=o},function(e,t,a){var o=a(4),n={show:function(e,t,a,n){switch($("#alert").html(o),$("#msg").html(e),a=a||3e3,t){case"success":$(".alert")[0].className="alert alert-success";break;case"info":$(".alert")[0].className="alert alert-info";break;case"warning":$(".alert")[0].className="alert alert-warning";break;case"danger":$(".alert")[0].className="alert alert-danger";break;default:$(".alert")[0].className="alert alert-danger"}$(".alert").show(),"none"!=a&&setTimeout(function(){$(".alert").hide(200)},a),n&&$(".alert .close").hide()}};e.exports=n},function(e,t){e.exports='<header class="header">\r\n    <div class="header-box">\r\n        <div class="inner-wrapper">\r\n            <h1 class="logo">\r\n                <a href="/" title="pakbox">\r\n                    <img ng-src="assets/img/logo.png"/>\r\n                </a>\r\n            </h1>\r\n\r\n            <div class="account" ng-init="showDrop = 0" ng-mouseover="showDrop = 1" ng-mouseleave="showDrop = 0">\r\n                <div class="account-info">\r\n                    <span ng-bind="username || \'\'"></span>\r\n                </div>\r\n                <div class="account-type">\r\n                    <span ng-bind="usertype"></span>\r\n                </div>\r\n                <div class="account-dropdown" ng-style="showDrop && {\'display\': \'block\'}">\r\n                    <ul class="account-dropdown-menu">\r\n                        <li><a href="passwd.html" ng-bind="LUpdatePassword"></a></li>\r\n                        <li><a ng-click="logout()" ng-bind="LLogout"></a></li>\r\n                    </ul>\r\n                </div>\r\n\r\n            </div>\r\n\r\n\r\n\r\n            <div class="language">\r\n                <a href="javascript:;" ng-click="LChooseLang(\'zh\')" ng-class="{selectedLanguage:localStorage.lang == \'zh\'}">中文</a>\r\n                |\r\n                <a href="javascript:;" ng-click="LChooseLang(\'en\')" ng-class="{selectedLanguage:localStorage.lang == \'en\'}">English</a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</header>\r\n\r\n\r\n'},function(e,t){e.exports='<div class="alert alert-danger" role="alert" style="display: none;">\r\n    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>\r\n    <div id="msg">warning!<div>\r\n</div>'},function(e,t,a){var o=a(1),n=a(2),s="//admin.pakpobox.asia/cgi-bin/",r=function(e,t,a){$.ajax({url:s+e,type:"GET",data:t,dataType:"json",success:function(e){a(e)},error:function(e){console.log(e),n.show(o.LConnectError)}})},i=function(e,t,a){t=JSON.stringify(t),$.ajax({url:s+e,type:"POST",data:t,dataType:"json",contentType:"application/json",success:function(e){a(e)},error:function(){n.show(o.LConnectError)}})},l={param:function(e){var t=new RegExp("(^|&)"+e+"=([^&]*)(&|$)","i"),a=window.location.search.substr(1).match(t);return null!=a?decodeURIComponent(a[2]):null},login:function(e,t){var a="index/user/login",o={};$.extend(o,e),i(a,o,function(e){t(e)})},logout:function(){var e="index/user/logout",t={};i(e,t,function(e){0==e.statusCode&&(location.href="login.html")})},post:function(e){var t="index/user/post",a={};i(t,a,function(t){e(t)})},userInfo:function(e){var t="index/user/userInfo",a={};r(t,a,function(t){e(t)})},getPeopelDetails:function(e,t){var a="index/user/info",o={};$.extend(o,e),r(a,o,function(e){t(e)})},getExpress:function(e,t){var a="index/express/query",o={};$.extend(o,e),r(a,o,function(e){t(e)})},getExpressDayCount:function(e,t){var a="index/express/getDayCount",o={};$.extend(o,e),r(a,o,function(e){t(e)})},getExpressStatics:function(e,t){var a="index/express/expressStatics",o={};$.extend(o,e),r(a,o,function(e){t(e)})},companyQuery:function(e,t){var a="index/company/query",o={};$.extend(o,e),r(a,o,function(e){t(e)})},companyInfo:function(e,t){var a="index/company/info",o={};$.extend(o,e),r(a,o,function(e){t(e)})},companyUpdate:function(e,t){var a="index/company/update",o={};$.extend(o,e),i(a,o,function(e){t(e)})},courierInfo:function(e,t){var a="index/user/queryStaff",o={};$.extend(o,e),r(a,o,function(e){t(e)})},updatePassword:function(e,t){var a="index/user/updatePassword",o={};$.extend(o,e),i(a,o,function(e){t(e)})},modifyExpress:function(e,t){var a="index/express/modifyPhoneNumber",o={};$.extend(o,e),i(a,o,function(e){t(e)})},createCompany:function(e,t){var a="index/company/create",o={};$.extend(o,e),i(a,o,function(e){t(e)})},updateCompany:function(e,t){var a="index/company/update",o={};$.extend(o,e),i(a,o,function(e){t(e)})},createStaff:function(e,t){var a="index/user/createStaff",o={};$.extend(o,e),i(a,o,function(e){t(e)})},updateStaff:function(e,t){var a="index/user/updateStaff",o={};$.extend(o,e),i(a,o,function(e){t(e)})},createBox:function(e,t){var a="index/box/create",o={};$.extend(o,e),i(a,o,function(e){t(e)})},updateBox:function(e,t){var a="index/box/update",o={};$.extend(o,e),i(a,o,function(e){t(e)})},queryBoxInfo:function(e,t){var a="index/box/query",o={};$.extend(o,e),r(a,o,function(e){t(e)})},getBoxInfo:function(e,t){var a="index/box/info",o={};$.extend(o,e),r(a,o,function(e){t(e)})},querySurplusMouth:function(e,t){var a="index/box/querySurplusMouth",o={};$.extend(o,e),r(a,o,function(e){t(e)})},remoteUnlock:function(e,t){var a="task/mouth/remoteUnlock",o={};$.extend(o,e),i(a,o,function(e){t(e)})},updateMouth:function(e,t){var a="box/mouth/update",o={};$.extend(o,e),i(a,o,function(e){t(e)})},getTaskInfo:function(e,t){var a="index/task/info",o={};$.extend(o,e),r(a,o,function(e){t(e)})},getSmsInfo:function(e,t){var a="index/sms/express",o={};$.extend(o,e),r(a,o,function(e){t(e)})},resendSms:function(e,t){var a="index/express/resendSms",o={};$.extend(o,e),i(a,o,function(e){t(e)})},resetExpress:function(e,t){var a="task/express/resetExpress",o={};$.extend(o,e),i(a,o,function(e){t(e)})},getSmsList:function(e,t){var a="sms/account/list",o={};$.extend(o,e),r(a,o,function(e){t(e)})}};e.exports=l},function(e,t){var a={LTitle:"Pakpobox",LConnectError:"Server Error",LSystemError:"Systerm Error",LUsernamePlaceholer:"Email/Phone/LoginName",LUPasswordPlaceholer:"Password",LLoginSubmit:"login",LContratUs:"Connect Us",LForgetPassword:"Forget Password？",LValidation:"Validation",LResetPassword:"Reset",LValidationTips:"Please put your binding infomation for Validation：",LValitaionSubmit:"Validate",LValidationResultTips:"Validate Successfully！Please check your random in your email！",LValitaionResultButton:"Return Login",LLogout:"Logout",LUserTypeRoot:"Supper Admin",LUserTypeManager:"Manager",LUserTypeOprator:"Operator",LUserTypeLogistics:"Courier",LUserTypeOpratorAdmin:"OperatorAdmin",LUserTypeLogisticsAdmin:"CourierAdmin",LLoginname:"UserName",LUsername:"NickName",LPhoneNumber:"PhoneNumber",LCompany:"Company",LRole:"Role",LCompanyName:"Company Name",LUpdatePassword:"Password",LOldPassword:"OldPassword",LNewPassword:"NewPassword",LReNewPassword:"ReNewPassword",LPasswordInconsistent:"Password Inconsistent!",LPasswordSuccess:"Reset Successfully！Go to homepage...",LAll:"All",LLevel:"Level",LLevelOne:"Level1",LLevelTwo:"Level2",LLevelThree:"Level3",LLevelFour:"Level4",LLevelFive:"Level5",LRole:"Role",LOperatorAdmin:"Operator Admin",LOperatorUser:"Operator User",LLogisticsAdmin:"Logistics Admin",LLogisticsUser:"Logistics User",LRootUser:"Super Admin",LStatus:"Status",LStatusOn:"Open",LStatusOff:"Disable",LNumber:"Number",LName:"Name",LCompanyNumber:"Company Number",LSearch:"Query",LPhoneNum:"TakePhone",LTime:"Time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",LTimeStore:"Store Time",LTimeTake:"Take Time",LEcommerce:"Choose Ecommerce",LOperatorInfo:"Operator ",LLinkmanInfo:"Linkman ",LOperatorInfoTips:"Please confirm your company info",LOperatorNamePlaceholder:"Please type your company info",LOperatorParentPlaceholder:"Please type your parent company info",LLogisticsInfo:"Logistics Info",LLogisticsInfoTips:"Please confirm your company info",LLogisticsNamePlaceholder:"Please type your company info",LLogisticsParentPlaceholder:"Please type your parent company info",LPeopleInfo:"People Info",LPeopleType:"People Type",LPeopleInfoName:"Name",LPeopleInfoPhone:"Phone",LPeopleInfoWallets:"Wallets",LClose:"Close",LApply:"Apply",LReset:"Reset",LCancel:"Cancel",LNext:"Next",LSubmit:"Submit",LSubmitLoading:"Submit...",LSubmitValidate:"Validate",LSubmitValidating:"Validating...",LExpressInfo:"Express Info",LExpressStatuStoring:"need Store",LExpressStatuStore:"stored",LExpressStatuStored:"got",LExpressStatuTimeout:"timeout",LExpressStatuCourierPickup:"courier pick",LExpressStatuManagerPickup:"manager pick",LTableOrderSeq:"sequence",LTableOrderNumber:"number",LTableTakerPhone:"takerPhone",LTableStoreTime:"storeTime",LTableTakeTime:"takeTime",LTablePakpoboxNum:"BoxNum",LTableValidationNum:"validation",LTableExpressStatu:"Status",LTableOperator:"operator",LTableDetails:"Details",LToEdit:"To Edit",LDetailOperatorsId:"ID",LDetailOperatorsName:"NAME",LDetailLogisticsParentName:"PARENT",LDetailLogisticsParentId:"PARENT ID",LDetailOperatorsParentId:"PARENT ID",LDetailOperatorsContact:"CONTACT",LDetailOperatorsContactPhone:"PHONE",LDetailOperatorsContactMail:"MAIL",LTableOperatorsSqe:"seq",LTableOperatorsName:"Name",LTableOperatorsLevel:"Level",LTableOperatorsParent:"Parent",LDetailLogisticsInfo:"LOGISTICS COMPANY INFO",LDetailLogisticsId:"ID",LDetailLogisticsName:"NAME",LDetailLogisticsLevel:"Logistics Level",LDetailLogisticsParentName:"PARENT",LDetailLogisticsParentId:"PARENT ID",LDetailLogisticsContact:"CONTACT",LDetailLogisticsContactPhone:"PHONE",LDetailLogisticsContactMail:"MAIL",LDetailPakpoboxMouth:"Mouth Num",LDetailPakpobox:"Pakpobox Num",LDetailPakpoboxName:"Box Name",LDetailTakerName:"Taker Name",LDetailTakerPhone:"Taker phone",LDetailStoreName:"Receiver",LDetailStorePhone:"Receiver Phone",LDetailStoreTime:"Stored Time",LDetailTakeTime:"Get Time",LDetailOverTime:"Deadline",LDetailStatu:"Status",LDetailValidation:"Validation Number",LDetailModify:"Modify",LDetailSure:"Confirm",LDetailIfReSendValidation:"Whether confirm resend verification code？",LDetailIfResetStatu:"Whether Reset Statu？",LDetailIfReSendSuccessfully:"Send Validation Code Successfully",LDetailIfReSendFailed:"Send Validation Code Failed！",LDetailIfDoReset:"Reset Operator Is Send！",LDetailReseting:"Reseting。。。。",LDetailIfResetSuccessfully:"Reset Successfully！",LDetailIfResetFailed:"Reset Failed！",LDetailPeople:"Store Time",LDetailTakeTime:"Get Time",LDetailOverTime:"Overdue Time",LDetailStatu:"status",LDetailValidation:"validation",LDetailExpressMessage:"Message Infomation",LDetailMsgClick:"Please Click",LNavBaseInfomation:"Base Info",LNavOperator:"Operators",LNavLogisticsCompany:"LogisticsCompany",LNavPeople:"People Infomation",LNavCourier:"Courier",LNavAccount:"My Account",LNavPakpobox:"Pakpobox",LNavPakpoboxMaintain:"Maintain",LNavPakpoboxManagement:"Management",LNavExpressManagement:"Express",LNavAbnomalExpress:"AbnomalExpress",LNavExpressManagementAll:"courier",LNavExpressManagementSend:"Post",LNavExpressManagementBack:"Return",LNavExpressManagementImport:"Import",LNavAd:"Ad",LNavAdManagement:"Management",LNavStatic:"Static",LNavStaticExpress:"Express Static",LCourierCompany:"Company",LCourierName:"Name",LCourierPhone:"Phone",LLogisticsParentId:"Parent company ID",LLogisticsLevel:"Level",LLogisticsParent:"Parent",LLogisticsParentId:"Parent Id",LResponseEmpty:"It is empty!",LResponseError:"OCCOUR ERROR",LNewOperator:"+ Operator",LNewLogistics:"+ Logistics",LNewCourier:"+ People",LExportlist:"Export",LSendValidation:"send validation",LResetStatus:"reset",LGoto:"Goto",LPageNum:"Pages Number:",LImportExpressType:"Express Type",LImportAll:"All",LImportCourier:"Courier Express",LImportSend:"Send Express",LImportReturn:"Return Express",LImportExpress:"Import Express",LImportModelDownload:"Download Import Model",LPakpoboxOperator:"Operator Id",LPakpoboxName:"Box Name",LPakpoboxOrderNo:"OrderNo",LPakpoboxCurrencyUnit:"Unit",LPakpoboxOverdueType:"Overdue Tyte",LPakpoboxOverdueTime:"Overdue Time",LPakpoboxSmsAccount:"Sms Account",LBoxSize:"Box Size",LPakpoboxInfoTips:"Please Confirm infomation",LFormNone:"Lost Infomation！",LPakpoboxStatus:"Status",LPakpoboxRun:"RUN",LPakpoboxStop:"STOP",LPakpoboxException:"Exception",LPakpoboxOperator:"Operator Num",LPakpoboxOperatorName:"Operator Name",LPakpoboxName:"Pakpobox Name",LPakpoboxStatus:"Pakpobox Status",LPakpoboxDetail:"Pakpobox Management",LPakpoboxNew:"+New",LPakpoboxFreeNum:"Pakpobox Free Num",LPakpoboxNum:"Pakpobox Number",LPakpoBoxDetail:"Detail",LPakpoBoxColumns:"Not null columns between the two columns！",LPakpoBoxSubmitRespose:"Submit Successfullly，Wating ...！",LPakpoBoxSubmitFail:"Submmit Failed！",LPakpoBoxSubmitBack:"Confirm To Back！",LPakpoBoxModifyMouthStatus:"Modidfy Mouth Status",LPakpoBoxEmpty:"Empty",LPakpoBoxLock:"Lock",LPakpoBoxFreeMouthNum:"Free Mouth Num：",LPakpoBoxRemoteUnlock:"To confirm the following selected case mouth were unlocked remotely？",LPakpoBoxStatusModify:"To confirm for the following selected mouth state changes？",LPakpoBoxPleaseChooseAMouth:"Please Choose A Mouth",LPakpoBoxForbiddenBusyStatus:"Forbid the operator of busy mouth!",LPakpoBoxGetMouthIdFailed:"Get Mouth Id Failed!",LPakpoBoxFree:"Free",LPakpoBoxBusy:"Busy",LPakpoBoxLocked:"Locked",LChooseFile:"Choose File",LBeginUpload:"Upload",LUploadGuide:"Guide",LUploadStep1:"1.First ",LUploadStep12:"，fill in the information according to the example",LUploadStep2:"2. Click select files above, choose the file you want to import",LUploadStep3:"3. Click start uploading, you can upload your files",LWaitingUpload:"Waiting Upload....",LUploading:"Uploading....",LUploadingComplete:"Upload Conplete",LUploadFailId:"Fail Id",LUploadType:"Fail Type",LUploadexisted:"Existed",LUploadNotSure:"Not Sure",LUploadArgError:"Arg Error",LUploadFailCounts:"Records fail，",LUploadFailContent:"Click here to export the failures",LUploadError:"Upload Failed",LStatisticsNameTime:"Store Time",LStatisticsNameType:"Store Type",LStatisticsDay1:"First Day",LStatisticsDay2:"Second Day",LStatisticsDay3:"Third Day",LStatisticsDayO:"Overdue",LStatisticsPer:"%",LStatisticsMINI:"MINI",LStatisticsS:"S",LStatisticsM:"M",LStatisticsL:"L",LStatisticsXL:"XL",LStatisticsTotal:"Combine",LStatisticsExport:"Import",LPakpoboxEdit:"Adjust Pakpobox",LPakpoboxRemoteUnlock:"Remote Unlock",LPakpoboxChangeStatus:"Modify Status",LPakpoboxMouthId:"Mouth ID",LWaiting:"Wait......",LSuccess:"Successful！",LTips:"Tips",LStatusError:"forbid do this for mouth on this status",LTaskCOMMIT:"Submit Successfully",LTaskSUCCESS:"Task Successful",LTaskERROR:"Task Error",LPleaseChoose:"Please Choose",LNotEmpty:"Cannot be Empty!",LFormatError:"Format Error!",LInconformity:"Inconformity!",LMultiSelected:"Selected",LMultiSelectedAll:"All Selected",LSmsList:"Message List",LSmsStatus:"status",LSmsStatusReady:"Ready",LSmsStatusSuc:"Success",LSmsStatusFail:"Failure",LBusinessPicChoose:"Choose Pic...",LOverdueStatus:"If Overdue",LOverdueStatusYes:"Yes",LOverdueStatusNo:"No",LOverdueTimeReset:"Choose Overdue Time",LResetOverTime:"Reset Overdue Time",LElectronicCommerceName:"ElectronicCommerceName"};e.exports=a},function(e,t){var a={LTitle:"派宝箱",LConnectError:"连接服务器异常",LSystemError:"系统错误",LUsernamePlaceholer:"邮箱/手机/登录名",LUPasswordPlaceholer:"密码",LLoginSubmit:"登录",LContratUs:"联系我们",LForgetPassword:"忘记密码？",LValidation:"验证信息",LResetPassword:"重复密码",LValidationTips:"如忘记密码，请输入您的绑定信息以验证：",LValitaionSubmit:"立即验证",LValidationResultTips:"验证成功！已发送随机密码到您的邮箱！",LValitaionResultButton:"返回登录",LLogout:"退出登录",LUserTypeRoot:"超级管理员",LUserTypeManager:"管理员",LUserTypeOprator:"运营商员工",LUserTypeLogistics:"物流公司员工",LUserTypeOpratorAdmin:"运营商管理员",LUserTypeLogisticsAdmin:"物流公司管理员",LLoginname:"用户名",LUsername:"昵称",LPhoneNumber:"手机号",LCompany:"所属公司",LRole:"角色",LCompanyName:"公司名称",LUpdatePassword:"修改密码",LOldPassword:"原密码",LNewPassword:"新密码",LReNewPassword:"重复新密码",LPasswordInconsistent:"新密码输入不一致！",LPasswordSuccess:"重置密码成功！即将跳转至首页...",LAll:"全部",LLevel:"等级",LLevelOne:"一级",LLevelTwo:"二级",LLevelThree:"三级",LLevelFour:"四级",LLevelFive:"五级",LRole:"角色",LOperatorAdmin:"运营商管理员",LOperatorUser:"运营商员工",LLogisticsAdmin:"物流公司管理员",LLogisticsUser:"物流公司员工",LRootUser:"超级管理员",LStatus:"快件状态",LStatusOn:"启用",LStatusOff:"禁用",LNumber:"快件编号",LName:"名称",LCompanyNumber:"编号",LSearch:"查询",LPhoneNum:"取件手机",LTime:"时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间",LTimeStore:"存件时间",LTimeTake:"取件时间",LEcommerce:"选择电商",LOperatorInfo:"运营商信息",LLinkmanInfo:"联系人",LOperatorInfoTips:"请确认运营商信息填写无误，名称一旦确认不可再更改。",LOperatorNamePlaceholder:"输入运营商名称",LOperatorParentPlaceholder:"请输入上级运营商名称",LLogisticsInfo:"物流公司信息",LLogisticsInfoTips:"请确认物流公司信息填写无误，名称一旦确认不可更改。",LLogisticsNamePlaceholder:"输入物流公司名称",LLogisticsParentPlaceholder:"请输入上级物流公司名称",LPeopleInfo:"人员信息",LPeopleType:"人员类型",LPeopleInfoName:"人员姓名",LPeopleInfoPhone:"人员电话",LPeopleInfoWallets:"人员钱包",LClose:"关闭",LApply:"确定",LReset:"重置",LCancel:"取消",LNext:"下一步",LSubmit:"提交",LSubmitLoading:"正在提交...",LSubmitValidate:"立即验证",LSubmitValidating:"正在验证...",LExpressInfo:"快件信息",LExpressStatuStoring:"未存",LExpressStatuStore:"已存",LExpressStatuStored:"已取",LExpressStatuTimeout:"逾期",LExpressStatuCourierPickup:"快递员收",LExpressStatuManagerPickup:"管理员收",LTableOrderSeq:"序列",LTableOrderNumber:"快件编号",LTableTakerPhone:"取件人手机",LTableStoreTime:"存件时间",LTableTakeTime:"取件时间",LTablePakpoboxNum:"箱子编号",LTableValidationNum:"验证码",LTableExpressStatu:"快件状态",LTableOperator:"操作",LTableDetails:"详情",LTableOperatorsSqe:"序列",LTableOperatorsName:"运营商名称",LTableOperatorsLevel:"等级",LTableOperatorsParent:"上级运营商",LToEdit:"点此修改",LDetailOperatorsId:"运营商编号",LDetailOperatorsName:"运营商名称",LDetailOperatorsParentName:"上级运营商名称",LDetailOperatorsLevel:"运营商等级",LDetailOperatorsParentId:"上级运营商编号",LDetailOperatorsContact:"联系人",LDetailOperatorsContactPhone:"联系人手机号",LDetailOperatorsContactMail:"联系人邮箱",LDetailLogisticsInfo:"物流公司信息",LDetailLogisticsId:"物流公司编号",LDetailLogisticsName:"物流公司名称",LDetailLogisticsLevel:"物流公司等级",LDetailLogisticsParentName:"上级物流公司名称",LDetailLogisticsParentId:"上级物流公司编号",LDetailLogisticsContact:"联系人",LDetailLogisticsContactPhone:"联系人手机号",LDetailLogisticsContactMail:"联系人邮箱",LDetailPakpoboxMouth:"隔口编号",LDetailPakpobox:"派宝箱编号",LDetailPakpoboxName:"派宝箱名称",LDetailTakerName:"取件人",LDetailTakerPhone:"取件人手机",LDetailStoreName:"存件人",LDetailStorePhone:"存件人手机",LDetailStoreTime:"存件时间",LDetailTakeTime:"取件时间",LDetailOverTime:"到期时间",LDetailStatu:"快件状态",LDetailValidation:"验证码",LDetailModify:"修改",LDetailSure:"确定",LDetailIfReSendValidation:"是否确认重发验证码？",LDetailIfResetStatu:"是否确认重置？",LDetailIfReSendSuccessfully:"重发验证码成功！",LDetailIfReSendFailed:"重发验证失败！",LDetailIfDoReset:"重发已经发出！",LDetailReseting:"正在重置中。。。。",LDetailIfResetSuccessfully:"重置成功！",LDetailIfResetFailed:"重置失败！",LDetailPeople:"存件时间",LDetailTakeTime:"取件时间",LDetailOverTime:"到期时间",LDetailStatu:"快件状态",LDetailValidation:"验证码",LDetailExpressMessage:"已发短信",LDetailMsgClick:"点击查看",LNavBaseInfomation:"基础信息",LNavOperator:"运营商",LNavLogisticsCompany:"物流公司",LNavPeople:"人员信息",LNavCourier:"快递员",LNavAccount:"当前账户",LNavPakpobox:"派宝箱",LNavPakpoboxMaintain:"维护",LNavPakpoboxManagement:"综合管理",LNavExpressManagement:"快件管理",LNavAbnomalExpress:"异常逾期件维护",LNavExpressManagementAll:"快递员派件信息",LNavExpressManagementSend:"寄件信息",LNavExpressManagementBack:"退件信息",LNavExpressManagementImport:"导入",LNavAd:"广告投放",LNavAdManagement:"广告发布管理",LNavStatic:"统计信息",LNavStaticExpress:"快件统计",LCourierCompany:"公司",LCourierName:"昵称",LCourierPhone:"手机",LLogisticsCompany:"公司",LLogisticsLevel:"级别",LLogisticsParent:"上级公司",LLogisticsParentId:"上级公司ID",LResponseEmpty:"是空的哦！",LResponseError:"出错啦！",LNewOperator:"+ 新建运营商",LNewLogistics:"+ 新建物流公司",LNewCourier:"+ 新建人员信息",LExportlist:"导出列表",LSendValidation:"重发验证码",LResetStatus:"重置状态",LGoto:"前往",LPageNum:"页总数:",LImportExpressType:"快件类型",LImportAll:"全部",LImportCourier:"快递员派件",LImportSend:"寄件",LImportReturn:"退件",LImportExpress:"导入快件",LImportModelDownload:"下载导入模版",LPakpoboxOperator:"所属运营商ID",LPakpoboxName:"派宝箱名称",LPakpoboxOrderNo:"派宝箱业务编号",LPakpoboxCurrencyUnit:"派宝箱货币单位",LPakpoboxOverdueType:"逾期类型",LPakpoboxOverdueTime:"逾期时间",LPakpoboxSmsAccount:"短信运营商ID",LBoxSize:"派宝箱大小",LPakpoboxInfoTips:"请确认箱子信息填写无误。",LFormNone:"信息填写不完整！",LPakpoboxStatus:"状态",LPakpoboxRun:"启用",LPakpoboxStop:"禁用",LPakpoboxException:"异常",LPakpoboxOperator:"运营商编号",LPakpoboxName:"派宝箱名称",LPakpoboxOperatorName:"运营商名称",LPakpoboxStatus:"派宝箱状态",LPakpoboxDetail:"派宝箱管理",LPakpoboxNew:"+新增派宝箱",LPakpoboxFreeNum:"格口空闲数量",LPakpoboxNum:"派宝箱编号",LPakpoBoxDetail:"派宝箱详情",LPakpoBoxColumns:"派宝箱两列之间不能有空列！",LPakpoBoxSubmitRespose:"提交成功，页面即将跳转！",LPakpoBoxSubmitFail:"提交失败！",LPakpoBoxSubmitBack:"点击确定返回上一页编辑派宝箱信息。！",LPakpoBoxModifyMouthStatus:"修改隔口状态：",LPakpoBoxEmpty:"置空",LPakpoBoxLock:"锁定",LPakpoBoxFreeMouthNum:"剩余空闲格口数量：",LPakpoBoxRemoteUnlock:"是否确认对以下选中格口进行远程开锁？",LPakpoBoxStatusModify:"是否确认对以下选中格口状态进行修改？",LPakpoBoxPleaseChooseAMouth:"请选择一个格口",LPakpoBoxForbiddenBusyStatus:"不允许操作占用中的格口状态！",LPakpoBoxGetMouthIdFailed:"获取格口id失败！",LPakpoBoxFree:"空闲",LPakpoBoxBusy:"占用",LPakpoBoxLocked:"锁定",LChooseFile:"选择文件",LBeginUpload:"开始上传",LUploadGuide:"导入快件指引",LUploadStep1:"1. 首次使用请先",LUploadStep12:"，按照模板所示填写您的快件信息",LUploadStep2:"2. 点击上方选择文件，选择您要导入的文件",LUploadStep3:"3. 点击开始上传，即可上传您的文件",LWaitingUpload:"等待上传....",LUploading:"上传中....",LUploadingComplete:"上传结束",LUploadFailId:"失败Id",LUploadType:"失败类型",LUploadexisted:"已存在",LUploadNotSure:"存疑",LUploadArgError:"参数错误",LUploadFailCounts:"条记录上传失败，",LUploadFailContent:"点此可导出失败内容",LUploadError:"上传出错",LStatisticsNameTime:"存放时间统计表",LStatisticsNameType:"存放规格统计表",LStatisticsDay1:"第一日取件",LStatisticsDay2:"第二日取件",LStatisticsDay3:"第三日取件",LStatisticsDayO:"逾期被取",LStatisticsPer:"百分比",LStatisticsMINI:"MINI",LStatisticsS:"S",LStatisticsM:"M",LStatisticsL:"L",LStatisticsXL:"XL",LStatisticsTotal:"合计",LStatisticsExport:"导出报表",LPakpoboxEdit:">>修改派宝箱",LPakpoboxRemoteUnlock:"远程开锁",LPakpoboxChangeStatus:"修改格口状态",LPakpoboxMouthId:"格口ID",LWaiting:"请稍等......",LSuccess:"成功！",LTips:"提示",LStatusError:"该状态不允许此操作",LTaskCOMMIT:"已经提交",LTaskSUCCESS:"执行成功",LTaskERROR:"执行失败",LPleaseChoose:"请选择",LNotEmpty:"不能为空！",LFormatError:"格式有误！",LInconformity:"不一致！",LMultiSelected:"个已选",LMultiSelectedAll:"全选",LSmsList:"本快件短信列表",LSmsStatus:"状态",LSmsStatusReady:"准备发送",LSmsStatusSuc:"发送成功",LSmsStatusFail:"发送失败",LBusinessPicChoose:"选择图片...",LOverdueStatus:"是否逾期",LOverdueStatusYes:"逾期",LOverdueStatusNo:"未逾期",LOverdueTimeReset:"选择重置逾期时间",LResetOverTime:"重置逾期时间",LElectronicCommerceName:"电商名称"};e.exports=a},function(e,t){/**
	 * @license AngularJS v1.4.0-rc.2
	 * (c) 2010-2015 Google, Inc. http://angularjs.org
	 * License: MIT
	 */
!function(e,t,a){"use strict";function o(){this.$get=["$$sanitizeUri",function(e){return function(t){var a=[];return r(t,p(a,function(t,a){return!/^unsafe/.test(e(t,a))})),a.join("")}}]}function n(e){var a=[],o=p(a,t.noop);return o.chars(e),a.join("")}function s(e,a){var o,n={},s=e.split(",");for(o=0;o<s.length;o++)n[a?t.lowercase(s[o]):s[o]]=!0;return n}function r(e,a){function o(e,o,s,r){if(o=t.lowercase(o),T[o])for(;h.last()&&N[h.last()];)n("",h.last());k[o]&&h.last()==o&&n("",o),r=y[o]||!!r,r||h.push(o);var l={};s.replace(L,function(e,t,a,o,n){var s=a||o||n||"";l[t]=i(s)}),a.start&&a.start(o,l,r)}function n(e,o){var n,s=0;if(o=t.lowercase(o))for(s=h.length-1;s>=0&&h[s]!=o;s--);if(s>=0){for(n=h.length-1;n>=s;n--)a.end&&a.end(h[n]);h.length=s}}"string"!=typeof e&&(e=null===e||"undefined"==typeof e?"":""+e);var s,r,l,p,h=[],v=e;for(h.last=function(){return h[h.length-1]};e;){if(p="",r=!0,h.last()&&I[h.last()]?(e=e.replace(new RegExp("([\\W\\w]*)<\\s*\\/\\s*"+h.last()+"[^>]*>","i"),function(e,t){return t=t.replace(g,"$1").replace(b,"$1"),a.chars&&a.chars(i(t)),""}),n("",h.last())):(0===e.indexOf("<!--")?(s=e.indexOf("--",4),s>=0&&e.lastIndexOf("-->",s)===s&&(a.comment&&a.comment(e.substring(4,s)),e=e.substring(s+3),r=!1)):x.test(e)?(l=e.match(x),l&&(e=e.replace(l[0],""),r=!1)):f.test(e)?(l=e.match(d),l&&(e=e.substring(l[0].length),l[0].replace(d,n),r=!1)):m.test(e)&&(l=e.match(u),l?(l[4]&&(e=e.substring(l[0].length),l[0].replace(u,o)),r=!1):(p+="<",e=e.substring(1))),r&&(s=e.indexOf("<"),p+=0>s?e:e.substring(0,s),e=0>s?"":e.substring(s),a.chars&&a.chars(i(p)))),e==v)throw c("badparse","The sanitizer was unable to parse the following block of html: {0}",e);v=e}n()}function i(e){return e?($.innerHTML=e.replace(/</g,"&lt;"),$.textContent):""}function l(e){return e.replace(/&/g,"&amp;").replace(h,function(e){var t=e.charCodeAt(0),a=e.charCodeAt(1);return"&#"+(1024*(t-55296)+(a-56320)+65536)+";"}).replace(v,function(e){return"&#"+e.charCodeAt(0)+";"}).replace(/</g,"&lt;").replace(/>/g,"&gt;")}function p(e,a){var o=!1,n=t.bind(e,e.push);return{start:function(e,s,r){e=t.lowercase(e),!o&&I[e]&&(o=e),o||O[e]!==!0||(n("<"),n(e),t.forEach(s,function(o,s){var r=t.lowercase(s),i="img"===e&&"src"===r||"background"===r;R[r]!==!0||D[r]===!0&&!a(o,i)||(n(" "),n(s),n('="'),n(l(o)),n('"'))}),n(r?"/>":">"))},end:function(e){e=t.lowercase(e),o||O[e]!==!0||(n("</"),n(e),n(">")),e==o&&(o=!1)},chars:function(e){o||n(l(e))}}}var c=t.$$minErr("$sanitize"),u=/^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/,d=/^<\/\s*([\w:-]+)[^>]*>/,L=/([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,m=/^</,f=/^<\//,g=/<!--(.*?)-->/g,x=/<!DOCTYPE([^>]*?)>/i,b=/<!\[CDATA\[(.*?)]]>/g,h=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,v=/([^\#-~| |!])/g,y=s("area,br,col,hr,img,wbr"),S=s("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),P=s("rp,rt"),k=t.extend({},P,S),T=t.extend({},S,s("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul")),N=t.extend({},P,s("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var")),C=s("circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph,hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline,radialGradient,rect,stop,svg,switch,text,title,tspan,use"),I=s("script,style"),O=t.extend({},y,T,N,k,C),D=s("background,cite,href,longdesc,src,usemap,xlink:href"),E=s("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,target,title,type,valign,value,vspace,width"),w=s("accent-height,accumulate,additive,alphabetic,arabic-form,ascent,baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan",!0),R=t.extend({},D,w,E),$=document.createElement("pre");t.module("ngSanitize",[]).provider("$sanitize",o),t.module("ngSanitize").filter("linky",["$sanitize",function(e){var a=/((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"”’]/,o=/^mailto:/;return function(s,r){function i(e){e&&L.push(n(e))}function l(e,a){L.push("<a "),t.isDefined(r)&&L.push('target="',r,'" '),L.push('href="',e.replace(/"/g,"&quot;"),'">'),i(a),L.push("</a>")}if(!s)return s;for(var p,c,u,d=s,L=[];p=d.match(a);)c=p[0],p[2]||p[4]||(c=(p[3]?"http://":"mailto:")+c),u=p.index,i(d.substr(0,u)),l(c,p[0].replace(o,"")),d=d.substring(u+p[0].length);return i(d),e(L.join(""))}}])}(window,window.angular)},function(e,t){var a={ROOT:"LUserTypeRoot",OPERATOR_ADMIN:"LUserTypeOpratorAdmin",OPERATOR_USER:"LUserTypeOprator",LOGISTICS_COMPANY_ADMIN:"LUserTypeLogisticsAdmin",LOGISTICS_COMPANY_USER:"LUserTypeLogistics"};e.exports=a},function(e,t){e.exports='<nav class="nav">\r\n    <ul>\r\n        <li class="nav_title">\r\n            <i class="nav_icon" style="background:url(\r\n        assets/img/nav-icon.png\r\n        ) no-repeat center;">\r\n            </i>\r\n            <span ng-bind="LNavBaseInfomation"></span>\r\n        </li>\r\n\r\n        <li ng-class="{nav_item: 1, selected: location.pathname.split(\'/\').pop() == \'operators.html\'}" ng-show="userrole == \'ROOT\' ||userrole == \'OPERATOR_ADMIN\' || userrole == \'OPERATOR_USER\'">\r\n            <a href="operators.html" ng-bind="LNavOperator">运营商</a>\r\n        </li>\r\n        <li ng-class="{nav_item: 1, selected: location.pathname.split(\'/\').pop() == \'logistics.html\'}" ng-show="userrole == \'ROOT\' ||userrole == \'LOGISTICS_COMPANY_ADMIN\' || userrole == \'LOGISTICS_COMPANY_USER\'">\r\n            <a href="logistics.html" ng-bind="LNavLogisticsCompany">物流公司</a>\r\n        </li>\r\n        <li ng-class="{nav_item: 1, selected: location.pathname.split(\'/\').pop() == \'courier.html\'}">\r\n            <a href="courier.html" ng-bind="LNavPeople">人员信息</a>\r\n        </li>\r\n        <li ng-class="{nav_item: 1, selected: location.pathname.split(\'/\').pop() == \'index.html\'}">\r\n            <a href="index.html" ng-bind="LNavAccount">当前账户</a>\r\n        </li>\r\n    </ul>\r\n    <ul ng-show="userrole == \'ROOT\' ||userrole == \'OPERATOR_ADMIN\' || userrole == \'OPERATOR_USER\'">\r\n        <li class="nav_title">\r\n            <i class="nav_icon" style="background:url(\r\n        assets/img/nav-icon.png\r\n        ) no-repeat center;">\r\n            </i>\r\n            <span ng-bind="LNavPakpobox"></span>\r\n        </li>\r\n        <li class="nav_item"  ng-class="{nav_item: 1, selected: location.pathname.split(\'/\').pop() == \'pakpoboxList.html\'}">\r\n            <a href="pakpoboxList.html" ng-bind="LNavPakpoboxMaintain">维护</a>\r\n        </li>\r\n    </ul>\r\n    <ul>\r\n        <li class="nav_title">\r\n            <i class="nav_icon" style="background:url(\r\n        assets/img/nav-icon.png\r\n        ) no-repeat center;">\r\n            </i>\r\n            <span ng-bind="LNavExpressManagement"></span>\r\n        </li>\r\n\r\n        <li class="nav_item"  ng-class="{nav_item: 1, selected: location.href.split(\'/\').pop() == \'express.html?type=COURIER_STORE\'}">\r\n            <a href="express.html?type=COURIER_STORE" ng-bind="LNavExpressManagementAll">综合管理</a>\r\n        </li>\r\n\r\n        <li class="nav_item"  ng-class="{nav_item: 1, selected: location.href.split(\'/\').pop() == \'express.html?type=CUSTOMER_STORE\'}">\r\n            <a href="express.html?type=CUSTOMER_STORE" ng-bind="LNavExpressManagementSend">寄件信息</a>\r\n        </li>\r\n\r\n        <li class="nav_item"  ng-class="{nav_item: 1, selected: location.href.split(\'/\').pop() == \'express.html?type=CUSTOMER_REJECT\'}">\r\n            <a href="express.html?type=CUSTOMER_REJECT" ng-bind="LNavExpressManagementBack">退件信息</a>\r\n        </li>\r\n\r\n        <li class="nav_item"  ng-class="{nav_item: 1, selected: location.pathname.split(\'/\').pop() == \'expressImport.html\'}"  ng-show="userrole == \'ROOT\' ||userrole == \'LOGISTICS_COMPANY_ADMIN\' || userrole == \'LOGISTICS_COMPANY_USER\'">\r\n            <a href="expressImport.html" ng-bind="LNavExpressManagementImport">导入</a>\r\n        </li>\r\n    </ul>\r\n    <ul>\r\n        <li class="nav_title">\r\n            <i class="nav_icon" style="background:url(\r\n        assets/img/nav-icon.png\r\n        ) no-repeat center;">\r\n            </i>\r\n            <span ng-bind="LNavStatic"></span>\r\n        </li>\r\n        <li class="nav_item" ng-class="{nav_item: 1, selected: location.pathname.split(\'/\').pop() == \'statistics.html\'}">\r\n            <a href="statistics.html" ng-bind="LNavStaticExpress">统计信息</a>\r\n        </li>\r\n    </ul>\r\n    <ul ng-show="userrole == \'ROOT\' ||userrole == \'OPERATOR_ADMIN\' || userrole == \'OPERATOR_USER\'">\r\n        <li class="nav_title">\r\n            <i class="nav_icon" style="background:url(\r\n        assets/img/nav-icon.png\r\n        ) no-repeat center;">\r\n            </i>\r\n            <span ng-bind="LNavAd"></span>\r\n        </li>\r\n        <li class="nav_item" ng-class="{nav_item: 1, selected: location.pathname.split(\'/\').pop() == \'business.html\'}">\r\n            <a href="business.html" ng-bind="LNavAdManagement">广告发布管理</a>\r\n        </li>\r\n    </ul>\r\n</nav>'},,function(e,t){var a={0:"成功","-1":"参数错误","-2":"禁止访问，没有权限","-3":"未知错误","-4":"系统错误","-5":"登录超时","-6":"没有找到资源"};e.exports=a},,function(e,t){var a=function(e){this.init(e)};a.prototype.init=function(e){this.option=e;var t=$(e.selector);this.$dom=t,this.getStyle();var a=$('<ul style="'+this.ulStyle+'" class="dropdown-menu"></ul>');this.$menu=a,t.after(a),this.bind()},a.prototype.getStyle=function(){var e=this.$dom.css("width"),t=this.$dom.css("height"),a=this.$dom.css("font-size"),o=this.$dom.css("line-height"),n=this.$dom.css("padding").toString();console.log(n),this.liStyle="width:"+e+";height:"+t+";font-size:"+a+";line-height:"+o+";padding:"+n+";",console.log(this.liStyle);var s="-"+this.$dom.css("margin-bottom"),r=this.$dom.css("margin-left"),i=this.$dom.css("margin-right"),l=0;this.ulStyle="position:absolute;top: inherit;left: inherit;margin:"+s+" "+i+" "+l+" "+r+";",console.log(this.ulStyle)},a.prototype.bind=function(){var e=this;e.$dom.focus(function(t){t.stopPropagation(),e.updateMenu(),e.$menu.show()}).on("keydown",function(t){var a=e.$menu.find("li.selected");console.log(t.keyCode),38==t.keyCode?a.prev()[0]&&a.removeClass().prev().addClass("selected"):40==t.keyCode?a.next()[0]&&a.removeClass().next().addClass("selected"):13==t.keyCode?e.selectItem(a):(e.$menu.show(),e.updateMenu())}),$("body").on("click",function(t){t.stopPropagation(),"LI"!=t.target.tagName&&t.target.id!=e.$dom[0].id&&e.$menu.hide()}),e.$menu.on("click","li",function(t){t.stopPropagation(),console.log(this),e.selectItem($(this))})},a.prototype.updateMenu=function(){var e=this,t=e.$dom.val();this.option.getData(t,function(t){var a="";t&&t.length&&t.map(function(t){a+='<li style="'+e.liStyle+'" data-value="'+t.value+'" data-showvalue="'+t.showValue+'">'+t.name+"</li>"}),e.$menu.html(a),e.$menu.find("li:first").addClass("selected")})},a.prototype.selectItem=function(e){var t=e.data("showvalue"),a=e.data("value");return console.log(a),this.$dom.val(t),this.$menu.hide(),this.option.success(a),a},e.exports=a}]);