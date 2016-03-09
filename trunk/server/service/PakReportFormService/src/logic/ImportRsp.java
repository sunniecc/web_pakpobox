package logic;

import java.io.InputStream;

/**
 * Author : pangbolike.
 * Date : 2015/10/18.
 */
public class ImportRsp {

    public int ret = 0;

    public int successCount = 0;

    public int failCount = 0;

    public String retMsg;

    public InputStream in;

    public static ImportRsp obtain(int ret,int successCount,int failCount,String msg,InputStream in){
        ImportRsp ans = new ImportRsp();
        ans.ret = ret;
        ans.successCount = successCount;
        ans.failCount = failCount;
        ans.retMsg = msg;
        ans.in = in;
        return ans;
    }
}
