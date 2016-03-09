<?php
/**
 * @name CompanyController
 * @author pangbolike
 * @desc 机构控制器
 */

require_once(dirname(__FILE__).'/../library/config.php');

class CompanyController extends Yaf_Controller_Abstract {

	public function init(){
        Yaf_Dispatcher::getInstance()->disableView();
        session_start();
        header("Content-type: application/json; charset=utf-8");
    }

    //查询机构信息
    //index/company/query
    //Method : GET
    //使用parentId当作公司id使用,返回所有子公司数据
    public function queryAction(){

    	//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("page","maxCount","companyType","parentId","id","level","companyFuzzyName"));

		if (isset($paramArr["page"])){
			$paramArr["page"] = (int)$paramArr["page"] - PAGE_OFFSET;
		}

		$ret = UtilsModel::get_by_curl("company/query",
			UtilsModel::getQueryStr($paramArr),
			array("Content-Type:application/json","userToken:".$token));
		$ret["count"] = count($ret["resultList"]);
		$ret["page"] = $ret["page"] + PAGE_OFFSET;
		UtilsModel::dealHttpCode($ret);
    }

    //新增机构信息
    //index/company/create
    //Method : POST
    //id参数后台生成，所以这里不需要？
    public function createAction(){

    	//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$postData = UtilsModel::getRawPostData();
		$comInfo = json_decode($postData,true);

		//参数检验
		if (!UtilsModel::checkParams($comInfo,array("name","companyType"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		//向api sever注册请求
		$ret = UtilsModel::post_by_curl("company/create",
			$postData,array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);
    }

    //修改机构信息
    //index/company/update
    //Method : POST
    public function updateAction(){

    	//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$postData = UtilsModel::getRawPostData();
		$comInfo = json_decode($postData,true);

		//参数检验
		if (!UtilsModel::checkParams($comInfo,array("id"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		//向api sever注册请求
		$ret = UtilsModel::post_by_curl("company/update",
			$postData,array("Content-Type:application/json","userToken:".$token));
		
		UtilsModel::dealHttpCode($ret);
    }

    //获取指定机构信息
    //index/company/info
    //必须带参数companyId
    //Method : GET
    public function infoAction(){
    	//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("companyId"));
		
		//参数检验
		if (!UtilsModel::checkParams($paramArr,array("companyId"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		$ret = UtilsModel::get_by_curl("company/info/",$paramArr["companyId"],
			array("Content-Type:application/json","userToken:".$token));
		UtilsModel::dealHttpCode($ret);
    }

}