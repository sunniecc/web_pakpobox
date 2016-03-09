<?php
/**
 * @name Utils
 * @desc Utils数据获取类, 可以访问数据库，文件，其它系统等
 * @author pangbolike
 */

require_once(dirname(__FILE__).'/../library/config.php');
require_once(dirname(__FILE__).'/../library/mysql_connect.php');

class UtilsModel {

    public function __construct() {
        
    }
    //上传文件
    public static function getUploadFilePath($authInfo,$fileType = "application/vnd.ms-excel"){
        if ($_FILES["filename"]["type"] != $fileType && "application/keyset" == $fileType){
            return "";
        }
        $filename = EXCEL_UPLOAD_PATH.$authInfo["id"].time().".xls";
        if (!move_uploaded_file($_FILES["filename"]["tmp_name"],$filename)){
            return "";
        }
        return $filename;
    }

    //输出本地文件内容
    public static function echoFileContent($filename){
        $handle = fopen($filename, "r");
        $contents = fread($handle, filesize ($filename));
        fclose($handle);
        echo $contents;
    }

    //增加callback函数
    public static function addCallBack($fun,$str)
  	{
      	if (!$fun || $fun == "") return $str;
      	return $fun."(".$str.")";
  	}


    //生成queryStr
    public static function getQueryStr($json){
        $ans = "?";
        $flag = false;
        foreach ($json as $key => $val) {
            if ($flag)
                $ans = $ans."&";
            else
                $flag = true;
            $ans = $ans.$key."=".urlencode($val);
        }
        return $ans;
    }

    //生成参数json
    public static function getParamsJson($request,$paramArr){
        $ans = array();
        foreach ($paramArr as $key) {
            $val = $request->getQuery($key);
            if (null != $val){
                $ans[$key] = $val;
            }
        }
        return $ans;
    }

    //检查json内的参数是否存在
    public static function checkParams($json,$arr){
        foreach ($arr as $key) {
            if (!isset($json[$key]))
                return false;
        }
        return true;
    }
    
    public static function getHeader($token){
        $header = array();
        $header[] = "Content-Type:application/json";
        $header[] = "userToken:".$token;
        return $header;
    }

    //使用curl发送post请求
    public static function post_by_curl($action,$post_string,$header,$needCreate = false){
      	$ch = curl_init();
      	curl_setopt($ch,CURLOPT_URL,REQUEST_URI_PRE.$action);
        if ($header != null){
            curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        }
      	curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,FALSE);
      	curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,FALSE);
      	curl_setopt($ch,CURLOPT_POST,1);
      	curl_setopt($ch,CURLOPT_POSTFIELDS,$post_string);
      	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
        if ($needCreate)
           	$data["result"] = json_decode(curl_exec($ch),true);
        else
            $data = json_decode(curl_exec($ch),true);
        $data["http_code"] = curl_getinfo($ch, CURLINFO_HTTP_CODE);
      	curl_close($ch);
      	return $data;
  	}

    //使用curl发送get请求
    public static function get_by_curl($action,$query_string,$header,$needCreate = false){
        $ch = curl_init();
        curl_setopt($ch,CURLOPT_URL,REQUEST_URI_PRE.$action.$query_string);
        // echo REQUEST_URI_PRE.$action.$query_string;
        if ($header != null){
            curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        }
        curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,FALSE);
        curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,FALSE);
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
        if ($needCreate)
            $data["result"] = json_decode(curl_exec($ch),true);
        else
            $data = json_decode(curl_exec($ch),true);
        $data["http_code"] = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return $data;
    }

    //对json进行编码
    public static function getUrlJson($arr)
    {
        return addcslashes(urldecode(json_encode(self::_urlencode($arr))),"\r\n");
    }

    public static function _urlencode($elem)
    {
        if(is_array($elem))
      {
        $na = array();
        foreach($elem as $k=>$v)
        {
            $na[self::_urlencode($k)] = self::_urlencode($v);
        }
        return $na;
      }
      return is_numeric($elem) ? $elem :urlencode($elem);
    }

    public static function getRawPostData(){
        return $GLOBALS['HTTP_RAW_POST_DATA'];
    }

    public static function getPostJson(){
        return json_decode($GLOBALS['HTTP_RAW_POST_DATA'],true);
    }

    //处理返回码公共逻辑
    public static function dealHttpCode($ans){
        if (HTTP_CODE_SUCCESS == $ans["http_code"]){
            $ret["statusCode"] = CODE_SUCCESS;
            $ret["result"] = $ans;
            echo UtilsModel::getUrlJson($ret);

        }else if (HTTP_CODE_FORBIDDEN == $ans["http_code"]){
            //没有权限
            $ret["statusCode"] = CODE_ACCESS_FORBIDDEN;
            $ret["msg"] = $ans;
            echo UtilsModel::getUrlJson($ret);
        }else if (HTTP_CODE_UNAUTH == $ans["http_code"]){
            //需要登录
            $ret["statusCode"] = CODE_USER_INFO_TIMEOUT;
            $ret["msg"] = $ans;
            echo UtilsModel::getUrlJson($ret);
        }
        else if (HTTP_CODE_REQUEST_ERROR == $ans["http_code"]){
            //参数错误
            $ret["statusCode"] = CODE_PARAM_ERROR;
            $ret["msg"] = $ans;
            echo UtilsModel::getUrlJson($ret);

        }
        else if (HTTP_CODE_NOTFOUND == $ans["http_code"]){
            //没有找到资源
            $ret["statusCode"] = CODE_RESOURCES_NOTFOUND;
            $ret["msg"] = $ans;
            echo UtilsModel::getUrlJson($ret);
        }
        else{
            //系统错误
            $ret["statusCode"] = CODE_SYSTEM_ERROR;
            $ret["msg"] = $ans;
            echo UtilsModel::getUrlJson($ret);
        }
    }

    //鉴权
    public static function authRight($role){
        $token = $_SESSION["token"];
        if ($token == null || $token == ""){
            $ret["statusCode"] = CODE_USER_INFO_TIMEOUT;
            $ret["msg"] = "have not right,please login";
            echo UtilsModel::getUrlJson($ret);
            return null;
        }
        if (null != $role && !isset($role[$_SESSION["role"]])){
            $ret["statusCode"] = HTTP_CODE_FORBIDDEN;
            $ret["msg"] = "you don't have right";
            echo UtilsModel::getUrlJson($ret);
            return null;
        }
        $ret = array();
        $ret["userName"] = $_SESSION["userName"];
        $ret["password"] = $_SESSION["password"];
        $ret["token"] = $token;
        $ret["id"] = $_SESSION["id"];
        $ret["company"] = $_SESSION["company"];
        $ret["name"] = $_SESSION["name"];
        $ret["role"] = $_SESSION["role"];
        $ret["http_code"] = HTTP_CODE_SUCCESS;
        return $ret;
    }

    //生成后台需要的数组样式
    public static function getListStr($json){
        $firstTime = true;
        $ret = "";
        foreach ($json as $item) {
            if (!$firstTime){
                $ret = $ret.",";
            }else{
                $firstTime = false;
            }
            $ret = $ret . $item;
        }
        return $ret;
    }
    
}
