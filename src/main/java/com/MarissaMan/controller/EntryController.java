package com.MarissaMan.controller;

import com.MarissaMan.dto.PassPort;
import com.MarissaMan.dto.Result;
import com.MarissaMan.dto.Msg;
import com.MarissaMan.entity.Sort;
import com.MarissaMan.service.SortService;
import com.alibaba.fastjson.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by saras on 2017/4/19.
 */

@Controller
//url�?/模块/资源/{id}/细分 /operation/list
//页面跳转
public class EntryController {

    @Autowired
    SortService sortService;

    @RequestMapping("/")
    public String index() {
        return "adminGoods";//WEB-INF/jsp/"list".jsp
    }

    @RequestMapping("/goodsList")
    public String goodsList() {
        return "goodsList";//WEB-INF/jsp/"list".jsp
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

    @RequestMapping(value = "/getSortList", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String getSortList() {
        System.out.println("-----获取商品类别列表--------");
        System.out.println(" before");
        Msg msg;
        Boolean isSuccess;
        List<Sort> sortList;
        try {
            sortList = sortService.getAllSort();
            if (!sortList.isEmpty()) {
                msg = new Msg("类别列表不为空");
                isSuccess = true;
            } else {
                isSuccess = false;
                msg = new Msg("类别列表为空");
            }

            System.out.println(" into");
        } catch (Exception e) {
            msg = new Msg("类别列表获取失败");
            isSuccess = false;
            System.out.println(e.getMessage());
            sortList = null;
        }
        System.out.println(" after");
        Result<List> result = new Result(isSuccess, sortList);
        return JSON.toJSONString(result);
    }

    @RequestMapping(value = "/updateSort", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String updateSort(String params) {
            System.out.println("-----更新类别名称--------");
            System.out.println(params + " before");
            Msg msg;
            Boolean isSuccess;
            try {
                Sort sort = JSON.parseObject(params, Sort.class);
                int flag = sortService.updateSort(sort);
                if (flag == 1) {
                    msg = new Msg("更新类别名称成功");
                    isSuccess = true;
                } else if (flag == 0) {
                    isSuccess = false;
                    msg = new Msg("更新类别名称失败");
                } else {
                    isSuccess = false;
                    msg = new Msg("更新类别名称发生异常");
                }

                System.out.println(params + " into");
            } catch (Exception e) {
                msg = new Msg("更新用户抛出异常");
                isSuccess = false;
                System.out.println(e.getMessage());
            }
            System.out.println(params + " after");
            Result<Msg> result = new Result(isSuccess, msg);
            return JSON.toJSONString(result);
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