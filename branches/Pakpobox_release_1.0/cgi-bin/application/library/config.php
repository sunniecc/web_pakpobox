<?php
	define("HOST_IP","203.88.175.188");
	define("HOST_PORT",8080);
	define("REQUEST_URI_PRE","http://".HOST_IP.":".HOST_PORT."/ebox/api/v1/");
	define("EXCEL_UPLOAD_PATH","/data/excel/upload/");
	define("EXCEL_RESULT_PATH","/data/excel/");

	define("IMPORT_RESULT_FILE_PRE","IRFP_");

	
	//error code
	define("CODE_SUCCESS",0); //成功
	define("CODE_PARAM_ERROR",-1); //参数错误
	define("CODE_ACCESS_FORBIDDEN",-2);//禁止访问，没有权限 
	define("CODE_UNKOWN_ERROR",-3);//未知错误
	define("CODE_SYSTEM_ERROR",-4);//系统错误
	define("CODE_USER_INFO_TIMEOUT",-5);//登录超时
	define("CODE_RESOURCES_NOTFOUND",-6);//没有找到资源

	define("PAGE_OFFSET",1);

	
	//http code
	define("HTTP_CODE_SUCCESS",200);
	define("HTTP_CODE_REQUEST_ERROR",400);
	define("HTTP_CODE_UNAUTH",401);
	define("HTTP_CODE_FORBIDDEN",403);
	define("HTTP_CODE_NOTFOUND",404);


	//roles
	define("ROLE_COURIER","LOGISTICS_COMPANY_USER");
	define("ROLE_COURIER_ADMIN","LOGISTICS_COMPANY_ADMIN");
	define("ROLE_OPEARTOR","OPERATOR_USER");
	define("ROLE_OPEARTOR_ADMIN","OPERATOR_ADMIN");
	define("ROLE_ROOT","ROOT");


	//default valus
	define("DEFAULT_VALUE_MAX_COUNT",10);

	//express status
	define("EXPRESS_STATUS_IMPORTED",1);
	define("EXPRESS_STATUS_IN_STORE",2);
	define("EXPRESS_STATUS_CUSTOMER_TAKEN",3);
	define("EXPRESS_STATUS_OVER_DUE_TIME",4);
	define("EXPRESS_STATUS_COURIER_TAKEN",5);
	define("EXPRESS_STATUS_OPERATOR_TAKEN",6);




