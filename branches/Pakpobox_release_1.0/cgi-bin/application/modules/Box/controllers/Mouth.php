<?php
/**
 * @name MouthController
 * @author pangbolike
 * @desc 隔口控制器
 */

require_once(dirname(__FILE__).'/../../../library/config.php');

class MouthController extends Yaf_Controller_Abstract {

	public function init(){
        Yaf_Dispatcher::getInstance()->disableView();
        session_start();
        header("Content-type: application/json; charset=utf-8");
    }

    //box/mouth/status
    //查询剩余格口数量
    //method : get
    //400
    public function statusAction(){
    	//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("boxOrderNo"));

		$ret = UtilsModel::get_by_curl("box/mouth/status",
			UtilsModel::getQueryStr($paramArr),array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);
    }

    //box/mouth/update
    //修改格口状态
    //method : post
    public function updateAction(){
    	//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$postData = UtilsModel::getRawPostData();
		$info = json_decode($postData,true);

		//参数检验
		if (!UtilsModel::checkParams($info,array("id","status"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		//向api sever注册请求
		$ret = UtilsModel::post_by_curl("box/mouth/update",
			$postData,array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);
    }

    //box/mouth/type
    //查询快递柜格口类型
    //method : get
    public function typeAction(){
    	//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];

		$ret = UtilsModel::get_by_curl("box/mouth/type",
			"",array("Content-Type:application/json","userToken:".$token),true);


		$list = $ret["result"];
		unset($ret["result"]);
		$ret["list"] = $list;

		UtilsModel::dealHttpCode($ret);
    }

}