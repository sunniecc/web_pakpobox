package models;

/**
 * Author : pangbolike.
 * Date : 2015/10/18.
 */
public class ImportExpModel {

    public String key;

    public String value;

    public String logisticsCompany;

    public String ecommerceCompany;

    public String chargeType;

    public String recipientName;

    public String recipientUserPhoneNumber;

    public String takeUserMail;

    public String endAddress;

    public String designationSize;

    public static ImportExpModel obtain(String key,String value){
        ImportExpModel ret = new ImportExpModel();
        ret.key = key;
        ret.value = value;
        return ret;
    }
}
