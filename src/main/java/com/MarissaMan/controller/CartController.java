package com.MarissaMan.controller;

import com.MarissaMan.dto.CartItem;
import com.MarissaMan.dto.Msg;
import com.MarissaMan.dto.Result;
import com.MarissaMan.entity.Cart;
import com.MarissaMan.entity.User;
import com.MarissaMan.service.CartService;
import com.MarissaMan.service.UserService;
import com.alibaba.fastjson.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by saras on 2017/4/19.
 */
@Controller
@RequestMapping("/cart")
public class CartController {

    @Autowired
    CartService cartService;

    @RequestMapping(value = "/addCart", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String addCart(String params) {
        System.out.println("-----添加购物车--------");
        Msg msg;
        Boolean isSuccess;
        try {
            //需要调用函数把字符串转化为对应的Bean
            Cart cart = JSON.parseObject(params, Cart.class);
            int flag = cartService.addCart(cart);
            if (flag == 1) {
                msg = new Msg("添加购物车成功");
                isSuccess = true;
            } else if (flag == 0) {
                isSuccess = false;
                msg = new Msg("添加购物车失败");
            } else {
                isSuccess = false;
                msg = new Msg("添加购物车发生异常");
            }
        } catch (Exception e) {
            msg = new Msg("添加用户抛出异常");
            isSuccess = false;
            System.out.println(e.getMessage());
        }
        Result<Msg> result = new Result(isSuccess, msg);
        return JSON.toJSONString(result);
    }

    @RequestMapping(value = "/getCartList/{userId}", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String getCartListByUserId(@PathVariable("userId") Integer userId) {
        System.out.println("-----获取购物车列表--------");
        Msg<List<CartItem>> msg;
        Boolean isSuccess;
        List<Cart> cartList;
        List<CartItem> cartItemList = new ArrayList<CartItem>();
        try {
            cartList = cartService.getCartByUserId(userId);
            if (!cartList.isEmpty()) {
                for(Cart c : cartList){
                    CartItem cartItem = new CartItem(c.getCartId(),c.getGoodsId(),c.getName(),c.getAmount(),c.getPrice());
                    cartItemList.add(cartItem);
                }
                msg = new Msg("购物车不为空",cartItemList);
                isSuccess = true;
            } else {
                isSuccess = false;
                msg = new Msg("购物车为空",null);
            }
        } catch (Exception e) {
            msg = new Msg("购物车获取失败");
            isSuccess = false;
            System.out.println(e.getMessage());
        }
        System.out.println(" after");
        Result<List> result = new Result(isSuccess, msg);
        return JSON.toJSONString(result);
    }

    @RequestMapping(value = "/updateCart", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String updateGoods(String params) {
        System.out.println("-----更新购物车商品数量--------");
        Msg msg;
        Boolean isSuccess;
        try {
            Cart cart = JSON.parseObject(params, Cart.class);
            int flag = cartService.updateCart(cart);
            if (flag == 1) {
                msg = new Msg("更新购物车商品数量成功");
                isSuccess = true;
            } else if (flag == 0) {
                isSuccess = false;
                msg = new Msg("更新购物车商品数量失败");
            } else {
                isSuccess = false;
                msg = new Msg("更新购物车商品数量发生异常");
            }

        } catch (Exception e) {
            msg = new Msg("更新购物车商品数量抛出异常");
            isSuccess = false;
            System.out.println(e.getMessage());
        }
        Result<Msg> result = new Result(isSuccess, msg);
        return JSON.toJSONString(result);
    }
//
//    @RequestMapping(value = "/getUserList", produces = {"application/text;charset=UTF-8"})
//    @ResponseBody
//    public String getUserList() {
//        System.out.println("-----获取用户列表--------");
//        System.out.println(" before");
//        Msg msg;
//        Boolean isSuccess;
//        List<User> users;
//        try {
//            users = userService.getAllUser();
//            if (!users.isEmpty()) {
//                msg = new Msg("用户列表不为空");
//                isSuccess = true;
//            } else {
//                isSuccess = false;
//                msg = new Msg("用户列表为空");
//            }
//
//            System.out.println(" into");
//        } catch (Exception e) {
//            msg = new Msg("用户列表获取失败");
//            isSuccess = false;
//            System.out.println(e.getMessage());
//            users = null;
//        }
//        System.out.println(" after");
//        Result<List> result = new Result(isSuccess, users);
//        return JSON.toJSONString(result);
//    }
//
//    @RequestMapping(value = "/deleteUser", produces = {"application/text;charset=UTF-8"})
//    @ResponseBody
//    public String deleteUser(String params) {
//        System.out.println("-----删除用户--------");
//        System.out.println(params + " before");
//        Msg msg;
//        Boolean isSuccess;
//        try {
//            User user = JSON.parseObject(params, User.class);
//            System.out.println(user.getUserId());
//            int flag = userService.deleteUserById(user.getUserId());
//            System.out.println(user.toString());
//            if (flag == 1) {
//                msg = new Msg("删除用户成功");
//                isSuccess = true;
//            } else if (flag == 0) {
//                isSuccess = false;
//                msg = new Msg("删除用户失败");
//            } else {
//                isSuccess = false;
//                msg = new Msg("删除用户发生异常");
//            }
//
//            System.out.println(params + " into");
//        } catch (Exception e) {
//            msg = new Msg("删除用户抛出异常");
//            isSuccess = false;
//            System.out.println(e.getMessage());
//        }
//        System.out.println(params + " after");
//        Result<Msg> result = new Result(isSuccess, msg);
//        return JSON.toJSONString(result);
//    }
//
//    @RequestMapping(value = "/updateUser", produces = {"application/text;charset=UTF-8"})
//    @ResponseBody
//    public String updateUser(String params) {
//        System.out.println("-----更新用户--------");
//        System.out.println(params + " before");
//        Msg msg;
//        Boolean isSuccess;
//        try {
//            User user = JSON.parseObject(params, User.class);
//            int flag = userService.updateUser(user);
//            System.out.println(user.toString());
//            if (flag == 1) {
//                msg = new Msg("更新用户成功");
//                isSuccess = true;
//            } else if (flag == 0) {
//                isSuccess = false;
//                msg = new Msg("更新用户失败");
//            } else {
//                isSuccess = false;
//                msg = new Msg("更新用户发生异常");
//            }
//
//            System.out.println(params + " into");
//        } catch (Exception e) {
//            msg = new Msg("更新用户抛出异常");
//            isSuccess = false;
//            System.out.println(e.getMessage());
//        }
//        System.out.println(params + " after");
//        Result<Msg> result = new Result(isSuccess, msg);
//        return JSON.toJSONString(result);
//    }
//
//    @RequestMapping(value = "/userToLogin", produces = {"application/text;charset=UTF-8"})
//    @ResponseBody
//    public String userToLogin(String params) {
//        System.out.println("-----用户登陆--------");
//        System.out.println(params + " before");
//        Msg<User> msg;
//        Boolean isSuccess;
//        User user = JSON.parseObject(params, User.class);
//        String name = user.getName();
//        try {
//            User user1 = userService.getUserByName(name);
//            if (user.getPassword().equals(user1.getPassword())) {
//                msg = new Msg("用户登陆成功", user1);
//                isSuccess = true;
//            } else {
//                isSuccess = false;
//                msg = new Msg("用户密码不正确", user);
//            }
//
//            System.out.println(params + " into");
//        } catch (Exception e) {
//            msg = new Msg("该用户不存在", user);
//            isSuccess = false;
//            System.out.println(e.getMessage());
//        }
//        System.out.println(params + " after");
//        Result<Msg> result = new Result(isSuccess, msg);
//        return JSON.toJSONString(result);
//    }
//
//
//    @RequestMapping(value = "/userToRegister", produces = {"application/text;charset=UTF-8"})
//    @ResponseBody
//    public String userToRegister(String params) {
//        System.out.println("-----用户注册--------");
//        System.out.println(params + " before");
//        Msg<User> msg;
//        Boolean isSuccess;
//        //需要调用函数把字符串转化为对应的Bean
//        User user = JSON.parseObject(params, User.class);
//        user.setMoney(0.0);
//        try {
//            int flag = userService.addUser(user);
//            if (flag == 1) {
//                User user1 = userService.getUserByName(user.getName());
//                msg = new Msg("用户注册成功", user1);
//                isSuccess = true;
//            } else if (flag == 0) {
//                isSuccess = false;
//                msg = new Msg("用户注册失败", user);
//            } else {
//                isSuccess = false;
//                msg = new Msg("用户注册发生异常", user);
//            }
//
//            System.out.println(params + " into");
//        } catch (Exception e) {
//            msg = new Msg("用户注册抛出异常", user);
//            isSuccess = false;
//            System.out.println(e.getMessage());
//        }
//        System.out.println(params + " after");
//        Result<Msg> result = new Result(isSuccess, msg);
//        return JSON.toJSONString(result);
//    }
}
