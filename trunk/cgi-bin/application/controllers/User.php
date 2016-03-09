<?php
/**
 * @name UserController
 * @author pangbolike
 * @desc 用户控制器
 */

require_once(dirname(__FILE__).'/../library/config.php');

class UserController extends Yaf_Controller_Abstract {

	public function init(){
        Yaf_Dispatcher::getInstance()->disableView();
        session_start();
        header("Content-type: application/json; charset=utf-8");
    }

    //登陆
    //index/user/login
	public function loginAction() {
		$userInfo = UtilsModel::getPostJson();
		$password = $userInfo["password"];
		//用户登录密码的加密
		// $userInfo["password"] = hash('sha256',$password."_SALT_PAKPOBOX");
		$userInfo["password"] = $password;
		//参数检验
		if (!UtilsModel::checkParams($userInfo,array("loginName","password"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		//向api sever请求登陆
		$loginInfo = UtilsModel::post_by_curl("user/login",
			json_encode($userInfo),array("Content-Type:application/json"));
		
		if (HTTP_CODE_SUCCESS == $loginInfo["http_code"] 
			&& UtilsModel::checkParams($loginInfo,array("id","role","token"))){
			//登陆成功，向session存储数据
			$_SESSION["userName"] = $userInfo["loginName"];
			$_SESSION["password"] = $password;
			foreach ($loginInfo as $key => $value) {
				$_SESSION[$key] = $value;
			}
			$ret["result"]["name"] = $_SESSION["name"];
			$ret["result"]["role"] = $_SESSION["role"];
			$ret["statusCode"] = CODE_SUCCESS;
			echo UtilsModel::getUrlJson($ret);
		}else if (HTTP_CODE_UNAUTH == $loginInfo["http_code"]){
			//用户名或密码错误
			$ret["statusCode"] = CODE_ACCESS_FORBIDDEN;
			$ret["msg"] = "user name or passwd error";
			echo UtilsModel::getUrlJson($ret);
		}else{
			//系统错误
			$ret["statusCode"] = CODE_SYSTEM_ERROR;
			$ret["msg"] = "system error";
			echo UtilsModel::getUrlJson($ret);
		}

	}

	//获取登录用户登录信息
	//index/user/userInfo
	public function userInfoAction(){
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}
		//unset($authInfo["userName"]);
		unset($authInfo["password"]);
		unset($authInfo["token"]);
		$authInfo["http_code"] = HTTP_CODE_SUCCESS;
		UtilsModel::dealHttpCode($authInfo);
	}

	//注销
	//index/user/logout
	public function logoutAction() {
		session_unset();
		session_destroy();
		$ret["statusCode"] = CODE_SUCCESS;
		echo UtilsModel::getUrlJson($ret);
	}

	//用户注册
	//index/user/createStaff
	public function createStaffAction(){
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$postData = UtilsModel::getRawPostData();
		$userInfo = json_decode($postData,true);

		//参数检验
		if (!UtilsModel::checkParams($userInfo,array("phoneNumber","loginName"
			,"name","password"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		//向api sever注册请求
		$regInfo = UtilsModel::post_by_curl("user/createStaff",
			$postData,array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($regInfo);
	}

	//修改人员信息
	//index/user/updateStaff
	//Method : POST
	public function updateStaffAction(){
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$postData = UtilsModel::getRawPostData();
		$userInfo = json_decode($postData,true);

		//参数检验
		if (!UtilsModel::checkParams($userInfo,array("id","loginName"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		//向api sever注册请求
		$ret = UtilsModel::post_by_curl("user/updateStaff",
			$postData,array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);
	}

	//查询人员信息
	//index/user/queryStaff
	//method : GET
	public function queryStaffAction(){
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("companyId","loginName","name","phoneNumber"
					,"role","page","maxCount","companyFuzzyName"));
		
		if (isset($paramArr["page"])){
			$paramArr["page"] = (int)$paramArr["page"] - PAGE_OFFSET;
		}
		$ret = UtilsModel::get_by_curl("user/queryStaff",
			UtilsModel::getQueryStr($paramArr),array("Content-Type:application/json","userToken:".$token));
		$ret["count"] = count($ret["resultList"]);
		$ret["page"] = $ret["page"] + PAGE_OFFSET;
		UtilsModel::dealHttpCode($ret);
	}

	//用户登录名是否存在
	//user/check/loginnameExist
	//用户手机号码是否存在
	//user/check/phoneExist

	//删除人员信息
	//index/user/deleteStaff
	//Method : POST
	public function deleteStaffAction(){
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$postData = UtilsModel::getRawPostData();
		$userInfo = json_decode($postData,true);
		//参数检验
		if (!UtilsModel::checkParams($userInfo,array("id"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		//向api sever注册请求
		$ret = UtilsModel::post_by_curl("user/deleteStaff",
			$postData,array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);
	}

	//查询单个人员信息
	//index/user/info/
	//METHOD : get
	public function infoAction(){
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("id"));

		//参数检验
		if (!UtilsModel::checkParams($paramArr,array("id"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		$ret = UtilsModel::get_by_curl("user/info/",
			$paramArr["id"],array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);
	}

	//修改当前用户密码
	//index/user/updatePassword
	//method : post
	public function updatePasswordAction(){
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$postData = UtilsModel::getRawPostData();
		$userInfo = json_decode($postData,true);

		//参数检验
		if (!UtilsModel::checkParams($userInfo,array("oldPassword","newPassword"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		//向api sever注册请求
		$ret = UtilsModel::post_by_curl("user/updatePassword",
			$postData,array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);
	}

	//index/user/forgetPassword
	//忘记密码：发送验证码
	//method : get
	public function forgetPasswordAction(){

		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("phoneNumber"));

		//参数检验
		if (!UtilsModel::checkParams($paramArr,array("phoneNumber"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		$ret = UtilsModel::get_by_curl("user/forgetPassword/",
			$paramArr["phoneNumber"],null);

		UtilsModel::dealHttpCode($ret);
	}

	//index/user/checkValidateCode
	//验证验证码
	//method : get
	public function checkValidateCodeAction(){
		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("phoneNumber","validateCode"));

		//参数检验
		if (!UtilsModel::checkParams($paramArr,array("phoneNumber","validateCode"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		$ret = UtilsModel::get_by_curl("user/checkValidateCode/",
			$paramArr["phoneNumber"]."/".$paramArr["validateCode"],null);

		UtilsModel::dealHttpCode($ret);
	}

	//检测用户名是否已经使用
	//index/user/loginNameExist
	//method : get
	public function loginnameExistAction(){
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("loginName"));

		if (!UtilsModel::checkParams($paramArr,array("loginName"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			return ;
		}

		$ret = UtilsModel::get_by_curl("user/check/loginNameExist",
			UtilsModel::getQueryStr($paramArr),
			array("Content-Type:application/json","userToken:".$token));
		UtilsModel::dealHttpCode($ret);

	}

	//检测用户电话号码是否已经使用
	//index/user/phoneExist
	//method : get
	public function phoneExistAction(){
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("phoneNumber"));

		if (!UtilsModel::checkParams($paramArr,array("phoneNumber"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			return ;
		}

		$ret = UtilsModel::get_by_curl("user/check/phoneNumberExist",
			UtilsModel::getQueryStr($paramArr),
			array("Content-Type:application/json","userToken:".$token));
		UtilsModel::dealHttpCode($ret);

	}

}