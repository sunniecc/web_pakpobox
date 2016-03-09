package common;

/**
 * Created by alexpang on 2015/8/30.
 */
public class Config {
    //server
    public final static int SERVER_PORT = 50002;
    public final static int MAX_PER_GET_COUNT = 10000;
    public final static int MAX_PER_POST_COUNT = 100;
    public static int HOST_PORT = 8080;
    public static String HOST_IP = "203.88.175.188";
    public static String REQUEST_URI_PRE = "http://" + HOST_IP + ":" + HOST_PORT + "/ebox/api/v1";

    //path
    public final static String ROOT_DIR = "E:\\";
    public final static String FILE_PATH_WIN = "E:\\";
    public final static String FILE_PATH_LINUX = "/data/excel/";

    //url
    public static String PAK_EXPRESS_QUERY_URL = "http://192.168.0.240:8080/ebox/api/v1/express/query";

    //result code
    public final static int RET_FILE_NOT_FOUND = -6;
    public final static int CODE_ACCESS_FORBIDDEN = -2;

    //file pre
    public final static String IMPORT_RESULT_FILE_PRE = "IRFP_";
    public final static String EXPORT_RESULT_FILE_PRE = "ERFP_";
    public final static String STATIS_RESULT_FILE_PRE = "SRFP_";

    //import type
    public final static int TYPE_IMPORT_NORMAL = 1;
    public final static int TYPE_IMPORT_SAVE = 2;
    public final static int TYPE_IMPORT_REJECT = 3;

    //time
    public final static long TIME_FILE_TO_DEL = 10 * 60 * 1000;
}
