<?php
/**
 * @name TaskController
 * @author pangbolike
 * @desc 
 */

require_once(dirname(__FILE__).'/../library/config.php');

class TaskController extends Yaf_Controller_Abstract {

	public function init(){
        Yaf_Dispatcher::getInstance()->disableView();
        session_start();
        header("Content-type: application/json; charset=utf-8");
    }

    //查询远程开锁任务结果
    //index/task/info
    //method : get
    public function infoAction(){
    	//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("taskId"));

		//参数检验
		if (!UtilsModel::checkParams($paramArr,array("taskId"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		$ret = UtilsModel::get_by_curl("task/info/",$paramArr["taskId"]
			,array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);
    }
}