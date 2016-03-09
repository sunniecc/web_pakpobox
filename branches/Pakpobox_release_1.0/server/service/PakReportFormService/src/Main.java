
import common.Config;
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
                    System.out.println(Config.HOST_IP);
                    System.out.println(Config.HOST_PORT);
                    System.out.println(Config.REQUEST_URI_PRE);
                    System.out.println(Config.PAK_EXPRESS_QUERY_URL);
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
                System.out.println("Task Start");

                while((fileDelModel = FileCleanService.getInstance().get()) != null){
                    System.out.println("ready path = " + fileDelModel.filePath + " time = " + fileDelModel.time);
                    if (fileDelModel.time + Config.TIME_FILE_TO_DEL > System.currentTimeMillis())
                        break;
                    FileCleanService.getInstance().poll();
                    File file = new File(fileDelModel.filePath);
                    if (file.exists()) {
                        System.out.println("del file path = " + file.getAbsolutePath());
                        file.delete();
                    }
                }
            }
        },0,60 * 1000);

        System.out.println("start time ok");

        //初始化httpsever
        try {
            new ReportFormHttpServer(Config.SERVER_PORT).start();
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
