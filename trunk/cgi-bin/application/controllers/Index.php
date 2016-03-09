<?php
/**
 * @name IndexController
 * @author pangbolike
 * @desc 默认控制器
 */
class IndexController extends Yaf_Controller_Abstract {

	public function init(){
        Yaf_Dispatcher::getInstance()->disableView();
    }
	public function indexAction() {

		//
		//echo UtilsModel::getQueryStr($this->getRequest(),array("name","haha"));
		echo "Ok";
	}

	
	public function getFileAction(){
		$filepath = "/data/excel/Ceven1444527055919.xls";
		
		$handle = fopen($filepath, "r");
		header('Content-Type: application/vnd.ms-excel; charset=utf-8');
		header('Content-Disposition: attachment;filename="Ceven1444527055919.xls"');
		$contents = fread($handle, filesize ($filepath));
		fclose($handle);
		echo $contents;
	}
}
