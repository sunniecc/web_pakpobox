
import common.Config;
import common.Utils;
import logic.FileCleanService;
import logic.FileDelTimer;
import models.FileDelModel;
import nanohttpd.ReportFormHttpServer;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.TimerTask;

/**
 * Created by alexpang on 2015/8/30.
 */
public class Main {
    public static void main(String args[]){

        try {
            //读配置
            FileReader fr = new FileReader("/data/service/service.conf");
            BufferedReader br = new BufferedReader(fr);
            String ip = null;
            if ((ip = br.readLine()) != null){
                String ans[] = ip.split(":");
                if (ans.length == 2) {
                    Config.HOST_IP = ans[0];
                    Config.HOST_PORT = Integer.parseInt(ans[1]);
                    Config.REQUEST_URI_PRE = "http://" + Config.HOST_IP + ":" + Config.HOST_PORT + "/ebox/api/v1";
                    Config.PAK_EXPRESS_QUERY_URL = Config.REQUEST_URI_PRE + "/express/query";
                    Utils.log(Config.HOST_IP);
                    Utils.log(Config.HOST_PORT + "");
                    Utils.log(Config.REQUEST_URI_PRE);
                    Utils.log(Config.PAK_EXPRESS_QUERY_URL);
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        //初始化文件删除定时器
        FileDelTimer fileDelTimer = new FileDelTimer();
        fileDelTimer.schedule(new TimerTask() {
            @Override
            public void run() {

                FileDelModel fileDelModel = null;
                Utils.log("Delete Task Start");

                while((fileDelModel = FileCleanService.getInstance().get()) != null){
                    Utils.log("ready path = " + fileDelModel.filePath + " time = " + fileDelModel.time);
                    if (fileDelModel.time + Config.TIME_FILE_TO_DEL > System.currentTimeMillis())
                        break;
                    FileCleanService.getInstance().poll();
                    File file = new File(fileDelModel.filePath);
                    if (file.exists()) {
                        Utils.log("del file path = " + file.getAbsolutePath());
                        file.delete();
                    }
                }
            }
        },0,60 * 1000);

        Utils.log("start time ok");

        //初始化httpsever
        try {
            new ReportFormHttpServer(Config.SERVER_PORT).start();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
