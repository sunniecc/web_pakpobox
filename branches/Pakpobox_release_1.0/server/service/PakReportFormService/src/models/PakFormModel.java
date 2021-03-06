package models;

import common.Utils;

import java.util.HashMap;

/**
 * Author : pangbolike.
 * Date : 2015/10/21.
 */
public class PakFormModel {

    public String id = "";
    public String name = "";
    public int mCount = 0;
    public int sCount = 0;
    public int miniCount = 0;
    public int lCount = 0;
    public int xlCount = 0;
    public int xxlCount = 0;
    public int takeDay1 = 0;
    public int takeDay2 = 0;
    public int takeDay3 = 0;
    public int takeOver = 0;
    public int takeOther = 0;

    public static PakFormModel obtain(String id,String name){
        PakFormModel ans = new PakFormModel();
        ans.id = id;
        ans.name = name;
        return ans;
    }

    public int getTotalCount(){
        return mCount + sCount + miniCount + lCount + xlCount + xxlCount;
    }

    public int getDayCount(){
        return takeDay1 + takeDay2 + takeDay3 + takeOver + takeOther;
    }

    public int getM(){
        return mCount;
    }

    public int getS(){
        return sCount;
    }

    public int getMINI(){
        return miniCount;
    }

    public int getL(){
        return lCount;
    }

    public int getXL(){
        return xlCount;
    }

    public int getXXL(){
        return xxlCount;
    }

    public double getD1(){
        return takeDay1 * 1.0 / getDayCount();
    }

    public double getD2(){
        return takeDay2 * 1.0 / getDayCount();
    }

    public double getD3(){
        return takeDay3 * 1.0 / getDayCount();
    }

    public double getDO(){
        return takeOver * 1.0 / getDayCount();
    }

    public void add(ExpressModel exp){
        try {
            if (exp.mMouthType != null) {
                String name = exp.mMouthType.getString("name");
                if ("M".equalsIgnoreCase(name)){
                    mCount ++;
                }else if ("S".equalsIgnoreCase(name)){
                    sCount ++;
                }else if ("MINI".equalsIgnoreCase(name)){
                    miniCount ++;
                }else if ("L".equalsIgnoreCase(name)){
                    lCount ++;
                }else if ("XL".equalsIgnoreCase(name)){
                    xlCount ++;
                }
                else if ("XXL".equalsIgnoreCase(name)){
                    xxlCount ++;
                }
            }

            if (exp.mTakeTime >= 0){
                int day = (int)((28800000 + exp.mTakeTime) / 86400000) - (int)((28800000 + exp.mStoreTime) / 86400000);

                if (exp.mDueTime >= 0 && exp.mDueTime < exp.mTakeTime){
                    takeOver ++ ;
                }
                else if (day < 1){
                    takeDay1 ++;
                }else if (day < 2){
                    takeDay2 ++;
                }
                else if (day < 3){
                    takeDay3 ++;
                }
                else{
                    takeOther ++;
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
