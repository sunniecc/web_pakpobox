<?php
/**
 * @name ExpressController
 * @author pangbolike
 * @desc 快件控制器
 */

require_once(dirname(__FILE__).'/../library/config.php');

class ExpressController extends Yaf_Controller_Abstract {

	private static $statusMap = array("IMPORTED" => 1
									 ,"IN_STORE" => 2
									 ,"CUSTOMER_TAKEN" => 3
									 ,"OVER_DUE_TIME" => 4
									 ,"COURIER_TAKEN" => 5
									 ,"OPERATOR_TAKEN" => 6);

	private static $statusCodeMap = array("BASE"
										 ,"IMPORTED"
										 ,"IN_STORE"
										 ,"CUSTOMER_TAKEN"
										 ,"OVER_DUE_TIME"
										 ,"COURIER_TAKEN"
										 ,"OPERATOR_TAKEN");

	private static $mouthDayMap = array(0,31,28,31,30,31,30,31,31,30,31,30,31);

	public function init(){
        Yaf_Dispatcher::getInstance()->disableView();
        session_start();
        header("Content-type: application/json; charset=utf-8");
    }

	//查询寄件退件信息
	//index/express/query
	//Method : GET
	//operatorIdList如何表示
	public function queryAction(){

		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("page","boxName","maxCount","takeUserPhone","storeUserPhone","expressNumber"
					,"startTakeTime","endTakeTime","startStoreTime","endStoreTime"
					,"boxOrderNo","overdueFlag","boxId","expressStatus","operatorIdList"
					,"logisticsCompanyIdList","ecommerceCompanyIdList"
					,"ecommerceFlag","expressType","expressId","customerStoreNumber"));

		if (isset($paramArr["page"])){
			$paramArr["page"] = (int)$paramArr["page"] - PAGE_OFFSET;
		}

		$nowTime = time() * 1000;

		if (isset($paramArr["expressStatus"])){
			$paramArr["expressStatus"] = ExpressController::$statusCodeMap[(int)$paramArr["expressStatus"]];
		}else{
			$statusArr = array("IN_STORE"
							  ,"CUSTOMER_TAKEN"
							  ,"COURIER_TAKEN"
							  ,"OPERATOR_TAKEN");
			//当在查看详情的时候就添加未存状态
			if(!isset($paramArr["page"])){
				array_push($statusArr, "IMPORTED");
			}
			// if ($paramArr["expressType"] != "COURIER_STORE"){
				// array_push($statusArr, "IMPORTED");
			// }
			$paramArr["expressStatus"] = UtilsModel::getListStr($statusArr);
		}

		$ret = UtilsModel::get_by_curl("express/query",
			UtilsModel::getQueryStr($paramArr),array("userToken:".$token));

		$ret["count"] = count($ret["resultList"]);
		$ret["page"] = $ret["page"] + PAGE_OFFSET;

		$count = $ret["count"];

		for($i = 0 ;$i < $count;$i ++){
			$ret["resultList"][$i]["status"] = ExpressController::$statusMap[$ret["resultList"][$i]["status"]];
			if($ret["resultList"][$i]["expressType"]=="CUSTOMER_TO_STAFF"||$ret["resultList"][$i]["expressType"]=="CUSTOMER_STORE"){
				$ret["resultList"][$i]["overdueFlag"] = 0;
			}else if (isset($ret["resultList"][$i]["overdueTime"]) && ((isset($ret["resultList"][$i]["takeTime"]) && (int)$ret["resultList"][$i]["takeTime"] > (int)$ret["resultList"][$i]["overdueTime"])
				|| ($ret["resultList"][$i]["status"] == EXPRESS_STATUS_IN_STORE && (int)$ret["resultList"][$i]["overdueTime"] < $nowTime))){
				$ret["resultList"][$i]["overdueFlag"] = 1;
			}else{
				$ret["resultList"][$i]["overdueFlag"] = 0;
			}
		}

		UtilsModel::dealHttpCode($ret);
	}

	//导入寄件信息
	//index/express/staffImportCustomerStoreExpress
	//需要快递员权限
	//METHOD : POST
	public function staffImportCustomerStoreExpressAction(){
		
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$filename = UtilsModel::getUploadFilePath($authInfo);

		if ("" == $filename){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		$paramArr["path"] = $filename;
		$paramArr["userToken"] = $token;
		$paramArr["id"] = $authInfo["id"];

		$url = "http://localhost:50002/express/staffImportCustomerStoreExpress".UtilsModel::getQueryStr($paramArr);

		echo file_get_contents($url);
	}

	//导入退件信息
	//index/express/staffImportCustomerRejectExpress
	//Method : post
	public function staffImportCustomerRejectExpressAction(){
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$filename = UtilsModel::getUploadFilePath($authInfo);

		if ("" == $filename){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		$paramArr["path"] = $filename;
		$paramArr["userToken"] = $token;
		$paramArr["id"] = $authInfo["id"];

		$url = "http://localhost:50002/express/staffImportCustomerRejectExpress".UtilsModel::getQueryStr($paramArr);

		echo file_get_contents($url);
	}

	//修改快件信息
	//index/express/modifyPhoneNumber
	//需要快递员权限
	//method : post
	public function modifyPhoneNumberAction(){
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$postData = UtilsModel::getRawPostData();
		$info = json_decode($postData,true);
		if (!UtilsModel::checkParams($info,array("id","takeUserPhoneNumber","previousPhoneNumber"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		//向api server发送请求
		$ans = UtilsModel::post_by_curl("express/modifyPhoneNumber",
			$postData,array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ans);

	}

	//index/express/import
	//导入快件信息
	//method : post
	public function importAction(){
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$filename = UtilsModel::getUploadFilePath($authInfo);

		if ("" == $filename){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		$paramArr["path"] = $filename;
		$paramArr["userToken"] = $token;
		$paramArr["id"] = $authInfo["id"];

		$url = "http://localhost:50002/express/import".UtilsModel::getQueryStr($paramArr);

		echo file_get_contents($url);
	}

	//index/express/exportExcel
	//导出快件信息到excel
	//method : get
	public function exportExcelAction(){

		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("takeUserPhone","storeUserPhone","expressNumber"
					,"startTakeTime","endTakeTime","startStoreTime","endStoreTime"
					,"boxOrderNo","overdueFlag","boxId","expressStatus","language","operatorIdList"
					,"logisticsCompanyIdList","ecommerceCompanyIdList"
					,"ecommerceFlag","expressType","expressId","customerStoreNumber"));

		if (isset($paramArr["expressStatus"])){
			$paramArr["expressStatus"] = ExpressController::$statusCodeMap[(int)$paramArr["expressStatus"]];
		}else{
			$statusArr = array("IN_STORE"
							  ,"CUSTOMER_TAKEN"
							  ,"COURIER_TAKEN"
							  ,"OPERATOR_TAKEN");
			// if ($paramArr["expressType"] != "COURIER_STORE"){
			// 	array_push($statusArr, "IMPORTED");
			// }
			$paramArr["expressStatus"] = UtilsModel::getListStr($statusArr);
		}

		$token = $authInfo["token"];
		$paramArr["id"] = $authInfo["id"];
		$url = "http://localhost:50002/express/exportExcel".UtilsModel::getQueryStr($paramArr)."&userToken=".$token;
		header('Content-Type: application/vnd.ms-excel; charset=utf-8');
        header('Content-Disposition: attachment;filename="'.$authInfo["name"].time().'.xls"');
        echo file_get_contents($url);
	}

	//index/express/getDayCount
	//获取7天或者一个月快件统计数据
	//method : get
	public function getDayCountAction(){

		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}
		$param = UtilsModel::getParamsJson($this->getRequest()
				,array("endTime","timezoneOffset"));
		$token = $authInfo["token"];
		$paramArr["dayCount"] = 30;
		$paramArr["timestamp"] = $param["endTime"];
		$paramArr["zoneOffset"] = $param["timezoneOffset"];
		$result = UtilsModel::get_by_curl("statistics/express/day",
			UtilsModel::getQueryStr($paramArr),array("Content-Type:application/json","userToken:".$token), true);
		
		UtilsModel::dealHttpCode($result);

	}

	public function getImportResultFileAction(){
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}
		$fileNum = $this->getRequest()->getQuery("fileNum","");
		if ($fileNum == "" || !is_numeric($fileNum)){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}
		$filename = EXCEL_RESULT_PATH.IMPORT_RESULT_FILE_PRE.$authInfo["id"].$fileNum.".xls";
		if (!file_exists($filename)){
			//参数错误
			$ret["statusCode"] = CODE_RESOURCES_NOTFOUND;
			$ret["msg"] = "file not found";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		$handle = fopen($filename, "r");
		header('Content-Type: application/vnd.ms-excel; charset=utf-8');
		header('Content-Disposition: attachment;filename="'.$authInfo["name"].time().'.xls"');
		$contents = fread($handle, filesize($filename));
		fclose($handle);
		echo $contents;
	}

	//index/express/expressStatics
	//统计接口
	//method : get
	public function expressStaticsAction(){
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];

		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("startStoreTime","endStoreTime","method","language"));

		$paramArr["userToken"] = $token;
		$paramArr["id"] = $authInfo["id"];

		$url = "http://localhost:50002/express/getExpressStatisticsData".UtilsModel::getQueryStr($paramArr);
		if ($paramArr["method"] != "json"){
			header('Content-Type: application/vnd.ms-excel; charset=utf-8');
			header('Content-Disposition: attachment;filename="'.$authInfo["name"].time().'.xls"');
			echo file_get_contents($url);
		}else{
			$ret = json_decode(file_get_contents($url),true);
			if ($ret["statusCode"] == CODE_ACCESS_FORBIDDEN){
				echo UtilsModel::getUrlJson($ret);
				return ;
			}
			$ret["http_code"] = HTTP_CODE_SUCCESS;
			UtilsModel::dealHttpCode($ret);
		}
	}

	//重发验证码
	//index/express/resendSms
	//method : post
	public function resendSmsAction(){
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$postData = UtilsModel::getRawPostData();
		$info = json_decode($postData,true);

		//参数检验
		if (!UtilsModel::checkParams($info,array("expressId"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}

		//向api sever注册请求
		$ret = UtilsModel::post_by_curl("express/resendSms/".$info["expressId"],
			"",array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);
	}
}
