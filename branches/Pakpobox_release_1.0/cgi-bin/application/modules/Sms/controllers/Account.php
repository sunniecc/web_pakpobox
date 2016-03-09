<?php
/**
 * @name AccountController
 * @author pangbolike
 * @desc 信息模块账户管理
 */

require_once(dirname(__FILE__).'/../../../library/config.php');

class AccountController extends Yaf_Controller_Abstract {

	public function init(){
        Yaf_Dispatcher::getInstance()->disableView();
        session_start();
        header("Content-type: application/json; charset=utf-8");
    }

    //sms/account/list
    //查账户信息列表
    //METHOD : get
    public function listAction(){
    	//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];

		$ret = UtilsModel::get_by_curl("sms/account/list",
			"",array("Content-Type:application/json","userToken:".$token),true);

		$list = $ret["result"];
		unset($ret["result"]);
		$ret["list"] = $list;

		UtilsModel::dealHttpCode($ret);
    }
}