package com.MarissaMan.controller;

import com.MarissaMan.dto.Msg;
import com.MarissaMan.dto.Result;
import com.MarissaMan.dto.test;
import com.MarissaMan.entity.User;
import com.MarissaMan.service.UserService;
import com.alibaba.fastjson.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.List;

/**
 * Created by saras on 2017/4/19.
 */
@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;

    @RequestMapping(value = "/addUser", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String addUser(String params) {
        System.out.println("-----添加用户--------");
        System.out.println(params + " before");
        Msg msg;
        Boolean isSuccess;
        try {
            //需要调用函数把字符串转化为对应的Bean
            User user = JSON.parseObject(params, User.class);
            int flag = userService.addUser(user);
            System.out.println(user.toString());
            if (flag == 1) {
                msg = new Msg("添加用户成功");
                isSuccess = true;
            } else if (flag == 0) {
                isSuccess = false;
                msg = new Msg("添加用户失败");
            } else {
                isSuccess = false;
                msg = new Msg("添加用户发生异常");
            }

            System.out.println(params + " into");
        } catch (Exception e) {
            msg = new Msg("添加用户抛出异常");
            isSuccess = false;
            System.out.println(e.getMessage());
        }
        System.out.println(params + " after");
        Result<Msg> result = new Result(isSuccess, msg);
        return JSON.toJSONString(result);
    }

    @RequestMapping(value = "/getUserList", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String getUserList() {
        System.out.println("-----获取用户列表--------");
        System.out.println(" before");
        Msg msg;
        Boolean isSuccess;
        List<User> users;
        try {
            users = userService.getAllUser();
            if (!users.isEmpty()) {
                msg = new Msg("用户列表不为空");
                isSuccess = true;
            } else {
                isSuccess = false;
                msg = new Msg("用户列表为空");
            }

            System.out.println(" into");
        } catch (Exception e) {
            msg = new Msg("用户列表获取失败");
            isSuccess = false;
            System.out.println(e.getMessage());
            users = null;
        }
        System.out.println(" after");
        Result<List> result = new Result(isSuccess, users);
        return JSON.toJSONString(result);
    }

    @RequestMapping(value = "/deleteUser", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String deleteUser(String params) {
        System.out.println("-----删除用户--------");
        System.out.println(params + " before");
        Msg msg;
        Boolean isSuccess;
        try {
            User user = JSON.parseObject(params, User.class);
            System.out.println(user.getUserId());
            int flag = userService.deleteUserById(user.getUserId());
            System.out.println(user.toString());
            if (flag == 1) {
                msg = new Msg("删除用户成功");
                isSuccess = true;
            } else if (flag == 0) {
                isSuccess = false;
                msg = new Msg("删除用户失败");
            } else {
                isSuccess = false;
                msg = new Msg("删除用户发生异常");
            }

            System.out.println(params + " into");
        } catch (Exception e) {
            msg = new Msg("删除用户抛出异常");
            isSuccess = false;
            System.out.println(e.getMessage());
        }
        System.out.println(params + " after");
        Result<Msg> result = new Result(isSuccess, msg);
        return JSON.toJSONString(result);
    }

    @RequestMapping(value = "/updateUser", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String updateUser(String params) {
        System.out.println("-----更新用户--------");
        System.out.println(params + " before");
        Msg msg;
        Boolean isSuccess;
        try {
            User user = JSON.parseObject(params, User.class);
            int flag = userService.updateUser(user);
            System.out.println(user.toString());
            if (flag == 1) {
                msg = new Msg("更新用户成功");
                isSuccess = true;
            } else if (flag == 0) {
                isSuccess = false;
                msg = new Msg("更新用户失败");
            } else {
                isSuccess = false;
                msg = new Msg("更新用户发生异常");
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

    @RequestMapping(value = "/userToLogin", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String userToLogin(String params) {
        System.out.println("-----用户登陆--------");
        System.out.println(params + " before");
        Msg msg;
        Boolean isSuccess;
        try {
            User user = JSON.parseObject(params, User.class);
            String name = user.getName();
            User user1 = userService.getUserByName(name);
            if (user.getPassword().equals(user1.getPassword())) {
                msg = new Msg("用户登陆成功");
                isSuccess = true;
            }else {
                isSuccess = false;
                msg = new Msg("用户密码不正确");
            }

            System.out.println(params + " into");
        } catch (Exception e) {
            msg = new Msg("该用户不存在");
            isSuccess = false;
            System.out.println(e.getMessage());
        }
        System.out.println(params + " after");
        Result<Msg> result = new Result(isSuccess, msg);
        return JSON.toJSONString(result);
    }


    @RequestMapping(value = "/userToRegister", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String userToRegister(String params) {
        System.out.println("-----用户注册--------");
        System.out.println(params + " before");
        Msg msg;
        Boolean isSuccess;
        try {
            //需要调用函数把字符串转化为对应的Bean
            User user = JSON.parseObject(params, User.class);
            user.setMoney(0.0);
            int flag = userService.addUser(user);
            System.out.println(user.toString());
            if (flag == 1) {
                msg = new Msg("用户注册成功");
                isSuccess = true;
            } else if (flag == 0) {
                isSuccess = false;
                msg = new Msg("用户注册失败");
            } else {
                isSuccess = false;
                msg = new Msg("用户注册发生异常");
            }

            System.out.println(params + " into");
        } catch (Exception e) {
            msg = new Msg("用户注册抛出异常");
            isSuccess = false;
            System.out.println(e.getMessage());
        }
        System.out.println(params + " after");
        Result<Msg> result = new Result(isSuccess, msg);
        return JSON.toJSONString(result);
    }




//    @RequestMapping(value="/{name}", method = RequestMethod.GET)
//    public @ResponseBody Shop getShopInJSON(@PathVariable String name) {
//        System.out.println("-----请求json数据--------");
//        Shop shop = new Shop();
//        shop.setName(name);
//        shop.setStaffName(new String[]{"mkyong1", "mkyong2"});
//
//        return shop;
//
//    }
//
//    @RequestMapping(value = "/time/now", method = RequestMethod.GET)
//    @ResponseBody
//    public test<Long> time() {
//        Date now = new Date();
//        return new test(true, now.getTime());
//    }
//
//    @RequestMapping(value = "/select")
//    @ResponseBody
//    public Result getShopInJSON(ModelMap lo) {
//        System.out.println("-----请求json数据--------");
//        User user2 = userService.SelectUserById(user.getUserId());
//        System.out.println("id:" + " " + lo);
//        User u = userService.getUserById(1);
//        Result<User> sr = new Result(true, u);
//        shop.setName(name);
//        shop.setStaffName(new String[]{"mkyong1", "mkyong2"});
//        return sr;
//    }
}
