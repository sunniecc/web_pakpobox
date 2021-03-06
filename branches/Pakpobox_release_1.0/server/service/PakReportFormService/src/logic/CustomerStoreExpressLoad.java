package logic;

import common.Config;
import common.Utils;
import models.ImportExpModel;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;

/**
 * Author : pangbolike.
 * Date : 2015/10/18.
 */
public class CustomerStoreExpressLoad {

    public static List<ImportExpModel> load(String path,int importType) throws Exception{
        File file = new File(path);
        if (!file.exists()){
            throw new FileNotFoundException(path);
        }

        try {
            List<ImportExpModel> list = new ArrayList<>();
            FileInputStream in = new FileInputStream(file);
            HSSFWorkbook workbook = new HSSFWorkbook(in);
            HSSFSheet sheet = workbook.getSheetAt(0);
            String key,value;
            int rows = sheet.getPhysicalNumberOfRows();
            for (int i = 0 ;i < rows ; i++){
                HSSFRow r = sheet.getRow(i);
                key = getCellValue(r,0);
                value = getCellValue(r,1);
                ImportExpModel exp = ImportExpModel.obtain(key, value);
                if (Config.TYPE_IMPORT_NORMAL == importType){
                    try{
                        exp.ecommerceCompany = getCellValue(r,2);
                    }catch (Exception e){
                        e.printStackTrace();
                    }
                }
                else if (Config.TYPE_IMPORT_SAVE == importType){
                    exp.logisticsCompany = getCellValue(r,2);
                    exp.ecommerceCompany = getCellValue(r,3);
                    exp.chargeType = getCellValue(r,4);
                }else if (Config.TYPE_IMPORT_REJECT == importType){
                    exp.logisticsCompany = getCellValue(r,2);
                    exp.chargeType = getCellValue(r,3);
                }
                if (!Utils.isEmpty(exp.key.trim()))
                    list.add(exp);
            }
            file.delete();
            return list;
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    public static String getCellValue(HSSFRow r,int index){
        Cell cell = r.getCell(index);
        if (cell == null)
            return "";
        if (cell.getCellType() == Cell.CELL_TYPE_NUMERIC){
            return (long)(cell.getNumericCellValue()) + "";
        }else{
            return cell.getStringCellValue();
        }
    }
}
