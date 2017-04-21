package com.MarissaMan.dto;

/**
 * Created by saras on 2017/4/20.
 */
public class PassPort {
    private String name;
    private String password;

    public PassPort() {
    }

    public PassPort(String name, String password) {
        this.name = name;
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
