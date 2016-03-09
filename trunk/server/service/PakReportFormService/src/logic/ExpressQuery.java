package logic;

import common.Config;
import common.Utils;
import exception.UnauthException;
import http.HttpUtils;
import models.BaseModel;
import models.ExpressModel;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.protocol.HTTP;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

/**
 * Created by lenovo on 2015/10/2.
 */
public class ExpressQuery {
    public static List<BaseModel> getAllExpress(String userToken,HashMap<String,String> params,int mark) throws UnauthException{
        List<BaseModel> list = new ArrayList<>();
        int count = 0;
        int totalCount = 0;
        int page = 0;
        Utils.printTimeLog("get Request start");
        HashMap<String,String> headers = new HashMap<>();
        params.put("maxCount", "" + Config.MAX_PER_GET_COUNT);
        if(mark==2){
            params.put("expressStatus","CUSTOMER_TAKEN,COURIER_TAKEN,OPERATOR_TAKEN,ROOT_TAKEN");
        }
        headers.put("userToken",userToken);
        do{
            params.put("page","" + (page++));
            HttpResponse httpResponse = HttpUtils.sendGet(Config.PAK_EXPRESS_QUERY_URL, params, headers);
            try{
                if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_UNAUTHORIZED){
                    throw new UnauthException();
                }
                JSONObject obj = new JSONObject(HttpUtils.getHttpResultStr(httpResponse));
                JSONArray arr = obj.getJSONArray("resultList");
                int j=0;
                for(int i=0;i<arr.length();i++){
//                    System.out.println("---takeTime:" + ExpressModel.createFrom(arr.getJSONObject(i)).mTakeTime + "----storeTime:" + ExpressModel.createFrom(arr.getJSONObject(i)).mStoreTime + "----dueTime:" + ExpressModel.createFrom(arr.getJSONObject(i)).mDueTime + "----pakpoboxNmae:" + ExpressModel.createFrom(arr.getJSONObject(i)).mPakpoboxName + "----" + ExpressModel.createFrom(arr.getJSONObject(i)) + "----");
                    list.add(ExpressModel.createFrom(arr.getJSONObject(i),mark));
                }
                count += arr.length();
                totalCount = obj.getInt("totalCount");
                Utils.log("" + count);
            }catch (Exception e){
                e.printStackTrace();
                if (e instanceof UnauthException)
                    throw (UnauthException)e;

            }

        }while(count < totalCount);
        Utils.printTimeLog("get Request ok");
        return list;
    }
}
