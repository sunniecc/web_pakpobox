<?php
/**
 * @name ExpressController
 * @author pangbolike
 * @desc 
 */

require_once(dirname(__FILE__).'/../../../library/config.php');

class ExpressController extends Yaf_Controller_Abstract {

	public function init(){
        Yaf_Dispatcher::getInstance()->disableView();
        session_start();
        header("Content-type: application/json; charset=utf-8");
    }

    //task/express/resetExpress
	//重置快件信息
	//method : post
	public function resetExpressAction(){
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$postData = UtilsModel::getRawPostData();
		$info = json_decode($postData,true);

		//参数检验
		if (!UtilsModel::checkParams($info,array("id"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		//向api sever注册请求
		$ret = UtilsModel::post_by_curl("task/express/resetExpress",
			$postData,array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);
	}

}