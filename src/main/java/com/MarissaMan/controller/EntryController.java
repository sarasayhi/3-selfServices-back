package com.MarissaMan.controller;

import com.MarissaMan.dto.PassPort;
import com.MarissaMan.dto.Result;
import com.MarissaMan.dto.Msg;
import com.alibaba.fastjson.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by saras on 2017/4/19.
 */

@Controller
//url�?/模块/资源/{id}/细分 /operation/list
//页面跳转
public class EntryController {

    @RequestMapping("/")
    public String index() {
        return "adminIndex";//WEB-INF/jsp/"list".jsp
    }

    @RequestMapping(value = "/amdinToLogin", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String adminToLogin(String params) {
        System.out.println("-----管理员登陆信息验证--------");
        System.out.println(params + " before");
        Msg msg;
        Boolean isSuccess;
        try {
            //需要调用函数把字符串转化为对应的Bean
            PassPort passPort = JSON.parseObject(params, PassPort.class);
            System.out.println(passPort.getName());
            if (passPort.getName().equals("admin") && passPort.getPassword().equals("admin")) {
                msg = new Msg("管理员登陆成功");
                isSuccess = true;
            } else {
                msg = new Msg("管理员登陆失败");
                isSuccess = false;
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            isSuccess = false;
            msg = new Msg("管理员登陆抛出异常");
        }
        System.out.println(params + " after");
        Result<Msg> result = new Result(isSuccess, msg);
        System.out.println(params + " into");
        return JSON.toJSONString(result);
    }

    @RequestMapping("/adminLogin")
    public String adminLogin() {
        return "adminLogin";
    }

    @RequestMapping("/adminIndex")
    public String adminIndex() {
        return "adminIndex";
    }

    @RequestMapping("/adminGoods")
    public String adminGoods() {
        return "adminGoods";
    }

    @RequestMapping("/adminShelves")
    public String adminShelves() {
        return "adminShelves";
    }

    @RequestMapping("/adminSort")
    public String adminSort() {
        return "adminSort";
    }

    @RequestMapping("/adminOrderList")
    public String adminOrderList() {
        return "adminOrderList";
    }

//    @RequestMapping("/adminToLogin")
//    public String adminToLogin(@Param("adminName") String name, @Param("adminPassword") String password) {
//        if ("")
//            System.out.print(name + " " + password);
//        return "111";//WEB-INF/jsp/"list".jsp
//    }
//
//    @RequestMapping("/userRegister")
//    public String userRegister() {
//        return "userRegister";
//    }
//
//    @RequestMapping("/userLogin")
//    public String userLogin() {
//        return "userLogin";
//    }
//
//    @RequestMapping("/adminToLogin")
//    public String adminToLogin(String username, String password, Map<String, Object> map) {
//        if (username.equals("admin") && password.equals("admin")) {
//            map.put("username", username);//存放在request请求域中
//            return "adminIndex";
//        }
//        return "error";
//    }
//
//
//    @RequestMapping("/userToLogin")
//    public String userToLogin(String username, String password, Map<String, Object> map) {
//        if (username.equals("11") && password.equals("11")) {
//            map.put("username", username);//存放在request请求域中
//            return "userIndex";
//        }
//        return "error";
//    }
//
//    @RequestMapping("/userToRegister")
//    public String userToRegister(String username, String password, Map<String, Object> map) {
//        if (username.equals("22") && password.equals("22")) {
//            map.put("username", username);//存放在request请求域中
//            return "userIndex";
//        }
//        return "error";
//    }
}