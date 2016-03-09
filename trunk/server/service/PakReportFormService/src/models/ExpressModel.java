package models;

import common.Utils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by lenovo on 2015/10/2.
 */
public class ExpressModel extends BaseModel{

    static{
        titles.add("运单号");
        titles_en.add("Express Number");
        titles.add("电商名称");
        titles_en.add("Express Number");
        titles.add("取件人手机");
        titles_en.add("Take User PhoneNumber");
        titles.add("存件人姓名");
        titles_en.add("Store User Name");
        titles.add("存件人手机");
        titles_en.add("Store User PhoneNumber");
        titles.add("派宝箱编号");
        titles_en.add("Pakpobox Number");
        titles.add("派宝箱名称");
        titles_en.add("Pakpobox Name");
        titles.add("格口编号");
        titles_en.add("Port Number");
        titles.add("快件状态");
        titles_en.add("Express Staus");
        titles.add("存件时间");
        titles_en.add("Store Time");
        titles.add("取件时间");
        titles_en.add("Take Time");
        titles.add("取逾期件时间");
        titles_en.add("Over Due Time");
        titles.add("hours");
        titles_en.add("hours");
        titles.add("days");
        titles_en.add("days");
        titles.add("day count");
        titles_en.add("day count");
    }

    public String mExpressNumber;

    public String mTakeUserPhoneNumber;

    public String mStoreUserName;

    public String mStoreUserPhoneNumber;

    public String mPakpoboxNumber;

    public String mPakpoboxName;

    public int mPortNumver;

    public String mExpressStatus;

    public String mElectronicName;

    public long mStoreTime;

    public long mTakeTime;

    public long mDueTime;

    public int mHours;

    public double mDays;

    public int mDayCount;

    public JSONObject mMouthType;

    public static ExpressModel createFrom(JSONObject obj,int mark){
        ExpressModel ans = new ExpressModel();
        try{
            ans.mExpressNumber = obj.has("expressNumber") ? obj.getString("expressNumber") : (obj.has("customerStoreNumber") ? obj.getString("customerStoreNumber") : "");
            ans.mTakeUserPhoneNumber = obj.has("takeUserPhoneNumber") ? obj.getString("takeUserPhoneNumber") : "";
            ans.mStoreUserName = obj.has("storeUser") ? obj.getJSONObject("storeUser").getString("name") : "";
            ans.mStoreUserPhoneNumber = obj.has("storeUser") ? obj.getJSONObject("storeUser").getString("phoneNumber") : "";
            ans.mPakpoboxNumber = obj.has("mouth") ? obj.getJSONObject("mouth").getJSONObject("box").getString("orderNo") : "";
            ans.mPakpoboxName = obj.has("mouth") ? obj.getJSONObject("mouth").getJSONObject("box").getString("name") : "";
            ans.mPortNumver = obj.has("mouth") ? obj.getJSONObject("mouth").getInt("number") : -1;
            ans.mExpressStatus = obj.getString("status");
            ans.mElectronicName = obj.has("electronicCommerce") && obj.getJSONObject("electronicCommerce").has("name") ? obj.getJSONObject("electronicCommerce").getString("name"): "";
            ans.mStoreTime = obj.has("storeTime") ? obj.getLong("storeTime") : -1;
            ans.mTakeTime = obj.has("takeTime") ? obj.getLong("takeTime") : -1;
            ans.mDueTime = obj.has("overdueTime") ? obj.getLong("overdueTime") : -1;
            ans.mMouthType = obj.has("mouth") ? obj.getJSONObject("mouth").getJSONObject("mouthType") : null;
            long costTime = 0;
            if (mark==1) {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                long StoreTime_Day=Long.parseLong(sdf.parse(sdf.format(sdf.parse(sdf.format(ans.mStoreTime)))).getTime() + "");
                if(ans.mExpressStatus.equals("IN_STORE"))
                {
                    ans.mTakeTime =0;
                    ans.mDueTime =0;
//                    costTime = System.currentTimeMillis() - ans.mStoreTime;
                    ans.mDays =costTime/3600000/24;
                }
                else if(ans.mTakeTime<=ans.mDueTime||ans.mDueTime==-1||!obj.getString("expressType").equals("COURIER_STORE")) {
                    ans.mDueTime =0;
                    costTime = ans.mTakeTime - ans.mStoreTime;
                    long TakeTine_Day=Long.parseLong(sdf.parse(sdf.format(sdf.parse(sdf.format(ans.mTakeTime)))).getTime() + "");
                    ans.mDays=(TakeTine_Day-StoreTime_Day)/3600000/24;
                }
                else
                {
                    ans.mTakeTime =0;
                    ans.mDueTime = obj.getLong("takeTime");
                    costTime = ans.mDueTime - ans.mStoreTime;
                    long DueTime_Day=Long.parseLong(sdf.parse(sdf.format(sdf.parse(sdf.format(ans.mDueTime)))).getTime() + "");
                    ans.mDays=(DueTime_Day-StoreTime_Day)/3600000/24;
                    System.out.println("-mDueTime-"+ans.mDueTime+"-mStoreTime--"+ans.mStoreTime);
                }
                ans.mHours = (int)(costTime / 3600000);
    //            ans.mDays = ans.mHours / 24.0;
                ans.mDayCount = (int) ans.mDays;
            }else {
                if (obj.has("takeTime")){
                    costTime = ans.mTakeTime - ans.mStoreTime;
                }else{
                    costTime = System.currentTimeMillis() - ans.mStoreTime;
                }
                ans.mHours = (int)(costTime / 3600000);
                ans.mDays = ans.mHours / 24.0;
                ans.mDayCount = (int) ans.mDays;
            }
            if("COURIER_TAKEN".equalsIgnoreCase(ans.mExpressStatus))
            {
                ans.mExpressStatus="LOGISTICS_PICK";
            }
            if(ans.mExpressStatus.equalsIgnoreCase("OPERATOR_TAKEN"))
            {
                ans.mExpressStatus="OPERATORS_PICK";
            }
        }catch (Exception e){
            e.printStackTrace();
        }

        return ans;
    }

}
