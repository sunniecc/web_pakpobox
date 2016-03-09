<?php
/**
 * @name BoxController
 * @author pangbolike
 * @desc 柜子控制器
 */

require_once(dirname(__FILE__).'/../library/config.php');

class BoxController extends Yaf_Controller_Abstract {

	public function init(){
        Yaf_Dispatcher::getInstance()->disableView();
        session_start();
        header("Content-type: application/json; charset=utf-8");
    }

    //查询柜子信息
    //index/box/query
    //Method : GET
    public function queryAction(){

    	//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("page","maxCount","operatorId","name","operatorName"
						,"boxOrderNo","status"));

		if (isset($paramArr["page"])){
			$paramArr["page"] = (int)$paramArr["page"] - PAGE_OFFSET;
		}

		$ret = UtilsModel::get_by_curl("box/query",
			UtilsModel::getQueryStr($paramArr),
			array("Content-Type:application/json","userToken:".$token));
		$ret["count"] = count($ret["resultList"]);
		$ret["page"] = $ret["page"] + PAGE_OFFSET;
		UtilsModel::dealHttpCode($ret);
    }

    //新增柜子信息
    //index/box/create
    //method : post
    public function createAction(){

    	//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$postData = UtilsModel::getRawPostData();
		$boxInfo = json_decode($postData,true);

		//参数检验
		if (!UtilsModel::checkParams($boxInfo,array("operator","currencyUnit"
			,"name","orderNo","overdueType","smsAccount"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		//向api sever注册请求
		$ret = UtilsModel::post_by_curl("box/create",
			$postData,array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);



    }

    //修改柜子信息
    //index/box/update
    //Method : POST
    public function updateAction(){

    	//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$postData = UtilsModel::getRawPostData();
		$boxInfo = json_decode($postData,true);

		//参数检验
		if (!UtilsModel::checkParams($boxInfo,array("id","operator","currencyUnit"
								,"name","orderNo","overdueType","smsAccount"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		//向api sever注册请求
		$ret = UtilsModel::post_by_curl("box/update",
			$postData,array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);
    }

    //查询快递柜格口剩余数量和每个格口的状态
    //index/box/querySurplusMouth
    //method : get
    public function querySurplusMouthAction(){
    	//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("orderNo"));

		//参数检验
		if (!UtilsModel::checkParams($paramArr,array("orderNo"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		$ret = UtilsModel::get_by_curl("box/querySurplusMouth",
			UtilsModel::getQueryStr($paramArr),array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);

    }

    //index/box/info
    //查询派宝箱详情
    //method : get
    public function infoAction(){
    	//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("boxId"));

		//参数检验
		if (!UtilsModel::checkParams($paramArr,array("boxId"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		$ret = UtilsModel::get_by_curl("box/info/",$paramArr["boxId"]
			,array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);
    }
}