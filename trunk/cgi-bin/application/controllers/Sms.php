<?php
/**
 * @name SmsController
 * @author pangbolike
 * @desc 信息模块
 */

require_once(dirname(__FILE__).'/../library/config.php');

class SmsController extends Yaf_Controller_Abstract {

	public function init(){
        Yaf_Dispatcher::getInstance()->disableView();
        session_start();
        header("Content-type: application/json; charset=utf-8");
    }

    //index/sms/express
    //查快递信息列表
    //METHOD : get
    public function expressAction(){
    	//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("expressId"));

		//参数检验
		if (!UtilsModel::checkParams($paramArr,array("expressId"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		$ret = UtilsModel::get_by_curl("sms/express/".$paramArr["expressId"],
			"",array("Content-Type:application/json","userToken:".$token),true);

		$list = $ret["result"];
		unset($ret["result"]);
		$ret["list"] = $list;

		UtilsModel::dealHttpCode($ret);
    }
}