package com.MarissaMan.dto;

/**
 * Created by saras on 2017/4/20.
 */
public class Msg<T> {
    private String msg;

    private T data;

    public Msg() {
    }

    public Msg(String msg) {
        this.msg = msg;
    }

    public Msg(String msg, T data) {
        this.msg = msg;
        this.data = data;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
