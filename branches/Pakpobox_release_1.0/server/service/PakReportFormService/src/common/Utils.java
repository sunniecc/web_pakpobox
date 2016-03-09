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
        System.out.println("Time Log Tag = " + tag  + ", time cost = " + (now - mTimeStamp) / 1000.0
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
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        return sdf.format(new Date(time));
    }

}
