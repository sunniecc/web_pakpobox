package logic;

import common.Utils;
import models.FileDelModel;

import java.util.LinkedList;
import java.util.Queue;

/**
 * Author : pangbolike.
 * Date : 2015/10/25.
 */
public class FileCleanService {

    Queue<FileDelModel> mQueue = new LinkedList<>();

    private static FileCleanService mInstance = null;

    public synchronized static FileCleanService getInstance(){
        if (mInstance == null){
            mInstance = new FileCleanService();
        }
        return mInstance;
    }

    public synchronized void add(FileDelModel file){
        Utils.log("path = " + file.filePath);
        mQueue.offer(file);
    }

    public synchronized FileDelModel get(){
        return mQueue.peek();
    }

    public synchronized void poll(){
        mQueue.poll();
    }
}
