package logic;

import common.Config;
import common.Utils;
import exception.UnauthException;
import http.HttpUtils;
import models.BaseModel;
import models.ExpressModel;
import models.FileDelModel;
import models.PakFormModel;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Author : pangbolike.
 * Date : 2015/10/19.
 */
public class GetExpressStatisticsData {

    public final static int SHEET1_BASE_ROW = 9;

    public final static int SHEET2_BASE_ROW = 8;

    /**
     * 导出excel
     * @param parms
     * @return
     */
    public static InputStream exportExcel(Map<String, String> parms){
        try {
            List<BaseModel> list = ExpressQuery.getAllExpress(parms.get("userToken"), HttpUtils.getHashMap(parms),1);
            HashMap<String, PakFormModel> info = new HashMap<>();
            dealData(info, list);
            return getExcelTpl(getExcelTpl(parms), info, parms.get("id"),parms);
        }catch (UnauthException e){

        }
        return null;
    }

    /**
     * 导出json
     * @param parms
     * @return
     */
    public static String exportJson(Map<String, String> parms) throws UnauthException{
        try {
            List<BaseModel> list = ExpressQuery.getAllExpress(parms.get("userToken"), HttpUtils.getHashMap(parms),2);
            HashMap<String, PakFormModel> info = new HashMap<>();
            Utils.printTimeLog("exportJson start");
            dealData(info, list);
            Set<String> keys = info.keySet();
            try {
                JSONArray arr1 = new JSONArray();
                JSONArray arr2 = new JSONArray();
                for (String key : keys) {
                    arr1.put(getTypeCountJson(info.get(key)));
                    arr2.put(getDayPerJson(info.get(key)));
                }
                JSONObject ans = new JSONObject();
                ans.put("type_list", arr1);
                ans.put("day_list", arr2);
                Utils.printTimeLog("exportJson end");
                return ans.toString();
            } catch (Exception e) {
                e.printStackTrace();
            }
            return "";
        }catch (Exception e){
            e.printStackTrace();
            if (e instanceof UnauthException){
                e.printStackTrace();
                throw e;
            }
        }
        return "";
    }

    /**
     * 读取模板
     * @param wb
     * @return
     */
    public static InputStream getExcelTpl(HSSFWorkbook wb,HashMap<String,PakFormModel> info,String id,Map<String, String> parms){
        if (wb == null || Utils.isEmpty(id))
            return null;


        HSSFSheet sheet1 = wb.getSheetAt(0);
        HSSFSheet sheet2 = wb.getSheetAt(1);

        /**
         *填写时间
         */

        sheet1.getRow(3).createCell(2).setCellValue(Utils.getDateStr(System.currentTimeMillis()));
        sheet2.getRow(3).createCell(2).setCellValue(Utils.getDateStr(System.currentTimeMillis()));

        if (!Utils.isEmpty(parms.get("startStoreTime"))){
            long startTime = Long.parseLong(parms.get("startStoreTime"));
            sheet1.getRow(5).createCell(2).setCellValue(Utils.getDateStr(startTime));
            sheet2.getRow(5).createCell(2).setCellValue(Utils.getDateStr(startTime));
        }

        if (!Utils.isEmpty(parms.get("endStoreTime"))){
            long endTime = Long.parseLong(parms.get("endStoreTime"));
            sheet1.getRow(5).createCell(4).setCellValue(Utils.getDateStr(endTime));
            sheet2.getRow(5).createCell(4).setCellValue(Utils.getDateStr(endTime));
        }

        /**
         *
         */

        Set<String> keys = info.keySet();

        int count = 0;
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);

        for(String key : keys){

            HSSFRow sr1 = sheet1.createRow(SHEET1_BASE_ROW + count);
            HSSFRow sr2 = sheet2.createRow(SHEET2_BASE_ROW + count);
            PakFormModel item = info.get(key);

            sr1.createCell(1).setCellValue(item.name);
            sr1.getCell(1).setCellStyle(style);
            sr1.createCell(2).setCellValue(item.id);
            sr1.getCell(2).setCellStyle(style);
            sr1.createCell(3).setCellValue(item.miniCount);
            sr1.getCell(3).setCellStyle(style);
            sr1.createCell(4).setCellValue(item.sCount);
            sr1.getCell(4).setCellStyle(style);
            sr1.createCell(5).setCellValue(item.mCount);
            sr1.getCell(5).setCellStyle(style);
            sr1.createCell(6).setCellValue(item.lCount);
            sr1.getCell(6).setCellStyle(style);
            sr1.createCell(7).setCellValue(item.xlCount);
            sr1.getCell(7).setCellStyle(style);
            sr1.createCell(8).setCellValue(item.xxlCount);
            sr1.getCell(8).setCellStyle(style);
            sr1.createCell(9).setCellValue(item.getTotalCount());
            sr1.getCell(9).setCellStyle(style);

            sr2.createCell(1).setCellValue(item.name);
            sr2.getCell(1).setCellStyle(style);
            sr2.createCell(2).setCellValue(item.id);
            sr2.getCell(2).setCellStyle(style);
            sr2.createCell(3).setCellValue(item.takeDay1);
            sr2.getCell(3).setCellStyle(style);
            sr2.createCell(4).setCellValue(getP2Num(item.getD1()));
            sr2.getCell(4).setCellStyle(style);
            sr2.createCell(5).setCellValue(item.takeDay2);
            sr2.getCell(5).setCellStyle(style);
            sr2.createCell(6).setCellValue(getP2Num(item.getD2()));
            sr2.getCell(6).setCellStyle(style);
            sr2.createCell(7).setCellValue(item.takeDay3);
            sr2.getCell(7).setCellStyle(style);
            sr2.createCell(8).setCellValue(getP2Num(item.getD3()));
            sr2.getCell(8).setCellStyle(style);
            sr2.createCell(9).setCellValue(item.takeOver);
            sr2.getCell(9).setCellStyle(style);
            sr2.createCell(10).setCellValue(getP2Num(item.getDO()));
            sr2.getCell(10).setCellStyle(style);
            count++;
        }

        /**
         * 生成文件
         */
        String fileName = Utils.getExcelPath() + Config.STATIS_RESULT_FILE_PRE + id + System.currentTimeMillis() + ".xls";

        try {
            FileOutputStream fout = new FileOutputStream(fileName);
            wb.write(fout);
            fout.close();
            wb.close();
            FileCleanService.getInstance().add(FileDelModel.obtain(fileName));
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            Utils.printTimeLog("prepare result ok");
            return new FileInputStream(fileName);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 获取类型统计json
     * @param item
     * @return
     */
    public static JSONObject getTypeCountJson(PakFormModel item){
        try{
            JSONObject obj = new JSONObject();
            obj.put("id",item.id);
            obj.put("name",item.name);
            obj.put("M",item.getM());
            obj.put("S",item.getS());
            obj.put("MINI",item.getMINI());
            obj.put("L",item.getL());
            obj.put("XL",item.getXL());
            obj.put("XXL",item.getXXL());
            obj.put("total", item.getTotalCount());
            return obj;
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 获取天数统计json
     * @param item
     * @return
     */
    public static JSONObject getDayPerJson(PakFormModel item){
        try{
            JSONObject obj = new JSONObject();
            obj.put("id",item.id);
            obj.put("name",item.name);
            obj.put("day1",item.takeDay1);
            obj.put("day2",item.takeDay2);
            obj.put("day3",item.takeDay3);
            obj.put("dayOver",item.takeOver);
            obj.put("day1Per",item.getD1());
            obj.put("day2Per",item.getD2());
            obj.put("day3Per",item.getD3());
            obj.put("dayOPer",item.getDO());
            return obj;
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 生成结果
     * @param info
     * @param list
     */
    public static void dealData(HashMap<String,PakFormModel> info,List<BaseModel> list){
        for (BaseModel item : list){
            if (item instanceof ExpressModel){
                String id = ((ExpressModel) item).mPakpoboxNumber;
                if (!Utils.isEmpty(id)){
                    PakFormModel pak = info.get(id);
                    if (pak == null){
                        pak = PakFormModel.obtain(id,((ExpressModel) item).mPakpoboxName);
                        info.put(id,pak);
                    }
                    pak.add((ExpressModel) item);
                }
            }
        }
    }

    /**
     * 获取excel模板
     * @return
     */
    public static HSSFWorkbook getExcelTpl(Map<String, String> parms){
        String path = Config.FILE_PATH_WIN;
        if (System.getProperty("os.name").toLowerCase().startsWith("windows")) {
            path = Config.FILE_PATH_WIN + "tpl\\";
        } else {
            path = Config.FILE_PATH_LINUX + "tpl/";
        }

        if (parms != null && "en".equals(parms.get("language"))){
            path += "pakbox_en.xls";
        }else{
            path += "pakbox.xls";
        }

        try{
            FileInputStream in = new FileInputStream(path);
            HSSFWorkbook workbook = new HSSFWorkbook(in);
            return workbook;
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    public static String getP2Num(double num){
        DecimalFormat decimalFormat = new DecimalFormat("0.00");
        return decimalFormat.format(num);
    }
}
