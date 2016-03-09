<?php
/**
 * @name ExpressController
 * @author pangbolike
 * @desc 上传文件
 */
require_once (dirname ( __FILE__ ) . '/../library/config.php');
class UploadController extends Yaf_Controller_Abstract {
	public function init() {
		Yaf_Dispatcher::getInstance ()->disableView ();
		session_start ();
		header ( "Content-type: application/json; charset=utf-8" );
	}
	
	// METHOD : POST
	public function uploadAction() {
		$ch = curl_init ();
		// 先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight ())) {
			// 没有权限
			return;
		}
		
		$token = $authInfo ["token"];
		
		$url = REQUEST_URI_PRE."file/upload";
		$user_agent = "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)";
		
		$filename = EXCEL_UPLOAD_PATH . time () . $_FILES ["file"] ["name"];
		$mimeType = $_FILES ["file"]['type'];
		$allow_mimes = array(
				'image/png' => '.png',
				'image/x-png' => '.png',
				'image/gif' => '.gif',
				'image/jpeg' => '.jpg',
				'image/pjpeg' => '.jpg'
		);
		
		if (! move_uploaded_file ( $_FILES ["file"] ["tmp_name"], $filename )) {
			echo "empty file";
		}
		
		$fields = array ();
				
		$fields["md5"]='d471d800246c436a867ecb6a82ae0587';
		
		$name = "file";
		//open file
		$handle = fopen($filename, "r");
        $fileBody = fread($handle, filesize ($filename));
        fclose($handle);
        
        $headers =  array();
        $headers ['userToken'] = $token;
		
		$response = self::multipartPost ($url, $fields, $name, $filename, $fileBody, $mimeType,  $headers);
		echo $response;
	}
	static function multipartPost($url, $fields, $name, $fileName, $fileBody, $mimeType , array $headers = array()) {
		$data = array ();
		$mimeBoundary = md5 ( microtime () );
		foreach ( $fields as $key => $val ) {
			array_push ( $data, '--' . $mimeBoundary );
			array_push ( $data, "Content-Disposition: form-data; name=\"$key\"" );
			array_push ( $data, '' );
			array_push ( $data, $val );
		}
		array_push ( $data, '--' . $mimeBoundary );
		$mimeType = empty ( $mimeType ) ? 'application/octet-stream' : $mimeType;
		$fileName = self::escapeQuotes ( $fileName );
		array_push ( $data, "Content-Disposition: form-data; name=\"$name\"; filename=\"$fileName\"" );
		array_push ( $data, "Content-Type: $mimeType" );
		array_push ( $data, '' );
		array_push ( $data, $fileBody );
		array_push ( $data, '--' . $mimeBoundary . '--' );
		array_push ( $data, '' );
		$body = implode ( "\r\n", $data );
		$contentType = 'multipart/form-data; boundary=' . $mimeBoundary;
		$headers ['Content-Type'] = $contentType;
		return self::sendRequest ($url, $headers,  $body);
	}
	
	private static function sendRequest($url, $request_headers, $request_body)
	{
		$t1 = microtime(true);
		$ch = curl_init();
		$options = array(
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_SSL_VERIFYPEER => false,
				CURLOPT_SSL_VERIFYHOST => false,
				CURLOPT_HEADER => true,
				CURLOPT_NOBODY => false,
				CURLOPT_CUSTOMREQUEST  => 'POST',
				CURLOPT_URL => $url
		);
		// Handle open_basedir & safe mode
		if (!ini_get('safe_mode') && !ini_get('open_basedir')) {
			$options[CURLOPT_FOLLOWLOCATION] = true;
		}
		if (!empty($request_headers)) {
			$headers = array();
			foreach ($request_headers as $key => $val) {
				array_push($headers, "$key: $val");
			}
			$options[CURLOPT_HTTPHEADER] = $headers;
		}
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Expect:'));
		if (!empty($request_body)) {
			$options[CURLOPT_POSTFIELDS] = $request_body;
		}
		curl_setopt_array($ch, $options);
		$result = curl_exec($ch);
		$t2 = microtime(true);
		$duration = round($t2-$t1, 3);
		$ret = curl_errno($ch);
		if ($ret !== 0) {
			$r = "error in upload";
			curl_close($ch);
			return $r;
		}
		$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
// 		$headers = self::parseHeaders(substr($result, 0, $header_size));
		$body = substr($result, $header_size);
		curl_close($ch);
		return $body;
	}
	
	private static function parseHeaders($raw)
	{
		$headers = array();
		$headerLines = explode("\r\n", $raw);
		foreach ($headerLines as $line) {
			$headerLine = trim($line);
			$kv = explode(':', $headerLine);
			if (count($kv) >1) {
				$headers[$kv[0]] = trim($kv[1]);
			}
		}
		return $headers;
	}
	private static function escapeQuotes($str)
	{
		$find = array("\\", "\"");
		$replace = array("\\\\", "\\\"");
		return str_replace($find, $replace, $str);
	}

	//发布广告
	public function uploadImgInfoAction()
	{
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}


		$token = $authInfo["token"];
		$postData = UtilsModel::getRawPostData();
		$ADInfo = json_decode($postData,true);

		//参数检验
		if (!UtilsModel::checkParams($ADInfo,array("company","position"
			,"doc"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}
		//向api sever注册请求
		$ret = UtilsModel::post_by_curl("advert/add",
			$postData,array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);

	}

	//刪除广告中的某一张图片
	public function deleteImgAction()
	{
		//先检验登陆态
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}
		$token = $authInfo["token"];
		$postData = UtilsModel::getRawPostData();
		$ADInfo = json_decode($postData,true);

		//参数检验
		if (!UtilsModel::checkParams($ADInfo,array("id"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			echo UtilsModel::getUrlJson($ret);
			return ;
		}
		//向api sever注册请求
		$ret = UtilsModel::post_by_curl("advert/delete",
			$postData,array("Content-Type:application/json","userToken:".$token));

		UtilsModel::dealHttpCode($ret);
	}
	//查询广告信息
	public function queryADInfoAction()
	{
		if (null == ($authInfo = UtilsModel::authRight())){
			//没有权限
			return ;
		}

		$token = $authInfo["token"];
		$paramArr = UtilsModel::getParamsJson($this->getRequest()
				,array("companyId"));

		if (!UtilsModel::checkParams($paramArr,array("companyId"))){
			//参数错误
			$ret["statusCode"] = CODE_PARAM_ERROR;
			$ret["msg"] = "params error";
			return ;
		}

		$ret = UtilsModel::get_by_curl("advert/query",
			UtilsModel::getQueryStr($paramArr),
			array("Content-Type:application/json","userToken:".$token));
		UtilsModel::dealHttpCode($ret);

	}

}
