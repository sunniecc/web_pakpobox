package common;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by lenovo on 2015/10/2.
 */
public class Utils {

    public static long mTimeStamp = System.currentTimeMillis();

    public synchronized static void printTimeLog(String tag){
        long now = System.currentTimeMillis();
        Utils.log("Time Log Tag = " + tag + ", time cost = " + (now - mTimeStamp) / 1000.0
                + " s.");
        mTimeStamp = now;
    }

    public static boolean isEmpty(String str){
        return str == null || "".equals(str);
    }

    public static String getExcelPath(){
        String path = Config.FILE_PATH_WIN;
        if (System.getProperty("os.name").toLowerCase().startsWith("windows")) {
            path = Config.FILE_PATH_WIN;
        } else {
            path = Config.FILE_PATH_LINUX;
        };
        return path;
    }

    public static String getDateStr(long time){
        String times="0";
        if(time==0L||time==-1L)
        {
            times= "--";
        }
        else
        {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            times = sdf.format(new Date(time));
        }
        return times;
    }

    public static void log(String log){
        System.out.println("LogTime = " + getDateStr(System.currentTimeMillis()));
        if (log != null && log.length() > 10000)
            log = log.substring(0,10000);
        System.out.println(log);
    }

}
