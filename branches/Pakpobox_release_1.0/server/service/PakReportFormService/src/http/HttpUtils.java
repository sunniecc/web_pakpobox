/**
 * Created by alexpang on 2015/2/13.
 */
package http;


import java.io.*;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import nanohttpd.NanoHTTPD;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;

public class HttpUtils {

    private final static String TAG = "HttpUtils";


    private final static HashMap<Boolean, HttpClient> mHttpClientCache = new HashMap<Boolean, HttpClient>();

    public static String chinaToUnicode(String str){
        String result="";
        for (int i = 0; i < str.length(); i++){
            int chr1 = (char) str.charAt(i);
            if(chr1>=19968&&chr1<=171941){
                result+="\\u" + Integer.toHexString(chr1);
            }else{
                result+=str.charAt(i);
            }
        }
        return result;
    }

    public static HttpResponse sendPost(String url,String postData, HashMap<String,String> params,HashMap<String,String> headers) {
        HttpClient httpClient = getHttpClient(url.startsWith("https"));
        try {
            String urlWithParams = url + "?" + getParamsStr(params);
            System.out.println("url = " + urlWithParams);
            HttpPost httpPost = new HttpPost(urlWithParams);
            if (headers != null){
                for(String key : headers.keySet()){
                    httpPost.addHeader(key,headers.get(key));
                }
            }
            StringEntity postEntity = new StringEntity(postData,"UTF-8");
            postEntity.setContentType("application/json");
            postEntity.setContentEncoding("UTF-8");
            httpPost.setEntity(postEntity);
            HttpResponse httpResponse = httpClient.execute(httpPost);
            return httpResponse;

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public static HttpResponse sendGet(String url, HashMap<String,String> params,HashMap<String,String> headers) {
        HttpClient httpClient = getHttpClient(url.startsWith("https"));
        try {
            String urlWithParams = url + "?" + getParamsStr(params);
            System.out.println("url = " + urlWithParams);
            HttpGet httpGet = new HttpGet(urlWithParams);
            if (headers != null){
                for(String key : headers.keySet()){
                    httpGet.addHeader(key,headers.get(key));
                }
            }
            HttpResponse httpResponse = httpClient.execute(httpGet);
            return httpResponse;
        } catch (Exception e) {
            e.printStackTrace();

        }
        return null;
    }

    public synchronized static HttpClient getHttpClient(boolean isHttps) {
        //目前不需要https
        return new DefaultHttpClient();
    }

    public static String getHttpResultStr(HttpResponse httpResponse) {
        String result = "";
        try {
            HttpEntity httpEntity = httpResponse.getEntity();
            if (httpEntity != null) {
                BufferedReader br = new BufferedReader(new InputStreamReader(httpEntity.getContent()));
                String line = null;
                while ((line = br.readLine()) != null) {
                    result += line;
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return result;
    }

    public static String getParamsStr(HashMap<String,String> params){
        if (params == null) return "";
        String result = "";
        Iterator it = params.keySet().iterator();
        while(it.hasNext()){
            String key = (String)it.next();
            String value = params.get(key);
            result += key + "=" + value;
            if (it.hasNext()) result += "&";
        }
        return result;
    }

    public static HashMap<String,String> getHashMap(Map<String,String> mp){
        if (mp == null) return null;
        HashMap<String,String> result = new HashMap<String,String>();
        Iterator it = mp.keySet().iterator();
        while(it.hasNext()){
            String key = (String)it.next();
            if (!NanoHTTPD.QUERY_STRING_PARAMETER.equalsIgnoreCase(key)) {
                String value = mp.get(key);
                result.put(key, value);
                System.out.println(key + " = " + value);
            }
        }
        return result;
    }

}
