package nanohttpd;

import common.Config;
import common.Utils;
import exception.UnauthException;
import http.HttpUtils;
import logic.ExcelExport;
import logic.ExpressQuery;
import logic.GetExpressStatisticsData;
import logic.ImportExpress;
import org.json.JSONObject;

import java.util.Map;

/**
 * Created by alexpang on 2015/7/23.
 */
public class ReportFormHttpServer extends NanoHTTPD{

    public ReportFormHttpServer(int port) {
        this(null, port);
    }

    public ReportFormHttpServer(String hostname, int port) {
        super(hostname, port);
    }

    /**
     * 业务逻辑主要在这里
     * @param uri
     * @param method
     * @param headers
     * @param parms
     * @param files
     * @return
     */
    @Override
    public Response serve(String uri, Method method, Map<String, String> headers, Map<String, String> parms,
                          Map<String, String> files){
        if ("GET".equalsIgnoreCase(method.toString())) {
            System.out.println("uri = " + uri);
            switch (uri){
                case "/express/exportExcel":
                    return handleExportExcel(parms);
                case "/express/staffImportCustomerStoreExpress":
                case "/express/staffImportCustomerRejectExpress":
                case "/express/import":
                    return handleImportExpress(parms,uri);
                case "/express/getExpressStatisticsData":
                    return handleGetExpressStatisticsData(parms,uri);
            }
        }else if ("POST".equalsIgnoreCase(method.toString())){
            System.out.println(parms.get(NanoHTTPD.QUERY_STRING_PARAMETER));
        }
        return new Response("NOT FOUND");
    }

    /**
     * 获取统计信息
     * @param parms
     * @param uri
     * @return
     */
    private Response handleGetExpressStatisticsData(Map<String, String> parms,String uri){
        if ("json".equalsIgnoreCase(parms.get("method"))){
            try{
                return new Response(Response.Status.OK,"application/json",GetExpressStatisticsData.exportJson(parms));
            }catch (UnauthException e){
                try {
                    System.out.println("UNAUTHORIZED");
                    JSONObject obj = new JSONObject();
                    obj.put("statusCode", Config.CODE_ACCESS_FORBIDDEN);
                    obj.put("msg","forbidden");
                    return new Response(Response.Status.OK,"application/json",obj.toString());
                }catch (Exception e1){
                    e1.printStackTrace();
                    return new Response("error");
                }
            }
        }else{
            return new Response(Response.Status.OK, "application/vnd.ms-excel; charset=utf-8", GetExpressStatisticsData.exportExcel(parms));
        }
    }

    /**
     * 导入快件件信息
     * @param parms
     * @param uri
     * @return
     */
    private Response handleImportExpress(Map<String, String> parms,String uri){
        System.out.println(parms.get("path"));
        System.out.println(parms.get("userToken"));
        System.out.println(parms.get("id"));
        return new Response(Response.Status.OK,"application/json", ImportExpress.importExpress(parms.get("path"),uri,parms.get("id"), parms.get("userToken")));
    }

    /**
     * 导出excel
     * @param parms
     * @return
     */
    private Response handleExportExcel(Map<String, String> parms){
        Utils.printTimeLog("handleExportExcel Start");
        String path = Config.FILE_PATH_WIN;
        if (System.getProperty("os.name").toLowerCase().startsWith("windows")) {
            path = Config.FILE_PATH_WIN;
        } else {
            path = Config.FILE_PATH_LINUX;
        }
        String language = parms.get("language");
        if (language == null) {
            language = "cn";
        }
        String userToken = parms.get("userToken");
        String id = parms.get("id");
        Utils.printTimeLog("get Params ok");
        try{
            return new Response(Response.Status.OK, "application/vnd.ms-excel; charset=utf-8", ExcelExport.exportExpressExcel(id, path, ExpressQuery.getAllExpress(userToken, HttpUtils.getHashMap(parms)), language,parms));
        }catch (Exception e){
            if (e instanceof UnauthException){
                e.printStackTrace();
            }
        }
        return new Response("error");
    }

}
