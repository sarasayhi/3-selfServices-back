package com.MarissaMan.dto;

import java.util.List;

/**
 * Created by saras on 2017/4/21.
 */
public class UserId {

    //userid
    private String key;

    //userid value
    private Integer value;

    public UserId() {
    }

    public UserId(String key, Integer value) {
        this.key = key;
        this.value = value;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "UserId{" +
                "key='" + key + '\'' +
                ", value=" + value +
                '}';
    }
}
