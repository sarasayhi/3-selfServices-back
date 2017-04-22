package com.MarissaMan.controller;

import com.MarissaMan.dto.Msg;
import com.MarissaMan.dto.Result;
import com.MarissaMan.entity.Goods;
import com.MarissaMan.service.GoodsService;
import com.alibaba.fastjson.JSON;
import com.sun.org.apache.xpath.internal.operations.Mod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by saras on 2017/4/19.
 */
@Controller
@RequestMapping("/goods")
public class GoodsController {

    @Autowired
    GoodsService goodsService;

    @RequestMapping(value = "/addGoods", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String addGoods(String params) {
        System.out.println("-----添加商品--------");
        System.out.println(params + " before");
        Msg msg;
        Boolean isSuccess;
        try {
            //需要调用函数把字符串转化为对应的Bean
            Goods goods = JSON.parseObject(params, Goods.class);
            int flag = goodsService.addGoods(goods);
            System.out.println(goods.toString());
            if (flag == 1) {
                msg = new Msg("添加商品成功");
                isSuccess = true;
            } else if (flag == 0) {
                isSuccess = false;
                msg = new Msg("添加商品失败");
            } else {
                isSuccess = false;
                msg = new Msg("添加商品发生异常");
            }

            System.out.println(params + " into");
        } catch (Exception e) {
            msg = new Msg("添加商品抛出异常");
            isSuccess = false;
            System.out.println(e.getMessage());
        }
        System.out.println(params + " after");
        Result<Msg> result = new Result(isSuccess, msg);
        return JSON.toJSONString(result);
    }

    @RequestMapping(value = "/getGoodsList", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String getGoodsList() {
        System.out.println("-----获取商品列表--------");
        System.out.println(" before");
        Msg msg;
        Boolean isSuccess;
        List<Goods> goodsList;
        try {
            goodsList = goodsService.getAllGoods();
            if (!goodsList.isEmpty()) {
                msg = new Msg("商品列表不为空");
                isSuccess = true;
            } else {
                isSuccess = false;
                msg = new Msg("商品列表为空");
            }

            System.out.println(" into");
        } catch (Exception e) {
            msg = new Msg("商品列表获取失败");
            isSuccess = false;
            System.out.println(e.getMessage());
            goodsList = null;
        }
        System.out.println(" after");
        Result<List> result = new Result(isSuccess, goodsList);
        return JSON.toJSONString(result);
    }

    @RequestMapping(value = "/getGoodsList/{sortId}", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String getGoodsListBySort(@PathVariable("sortId") Integer sortId) {
        System.out.println("-----获取对应类别商品列表--------");
        System.out.println(" before" + sortId);
        Msg msg;
        Boolean isSuccess;
        List<Goods> goodsList;
        try {
            if(sortId == 0){
                goodsList = goodsService.getAllGoods();
            } else {
                System.out.print(sortId);
                goodsList = goodsService.getGoodsBySort(sortId);
            }
            if (!goodsList.isEmpty()) {
                msg = new Msg("对应类别商品列表不为空");
                isSuccess = true;
            } else {
                isSuccess = false;
                msg = new Msg("对应类别商品列表为空");
            }

            System.out.println(" into");
        } catch (Exception e) {
            msg = new Msg("对应类别商品列表获取失败");
            isSuccess = false;
            System.out.println(e.getMessage());
            goodsList = null;
        }
        System.out.println(" after");
        Result<List> result = new Result(isSuccess, goodsList);
        return JSON.toJSONString(result);
    }

    @RequestMapping(value = "/deleteGoods", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String deleteGoods(String params) {
        System.out.println("-----删除商品--------");
        System.out.println(params + " before");
        Msg msg;
        Boolean isSuccess;
        try {
            Goods goods = JSON.parseObject(params, Goods.class);
            System.out.println(goods.getGoodsId());
            int flag = goodsService.deleteGoodsById(goods.getGoodsId());
            System.out.println(goods.toString());
            if (flag == 1) {
                msg = new Msg("删除商品成功");
                isSuccess = true;
            } else if (flag == 0) {
                isSuccess = false;
                msg = new Msg("删除商品失败");
            } else {
                isSuccess = false;
                msg = new Msg("删除商品发生异常");
            }

            System.out.println(params + " into");
        } catch (Exception e) {
            msg = new Msg("删除商品抛出异常");
            isSuccess = false;
            System.out.println(e.getMessage());
        }
        System.out.println(params + " after");
        Result<Msg> result = new Result(isSuccess, msg);
        return JSON.toJSONString(result);
    }

    @RequestMapping(value = "/updateGoods", produces = {"application/text;charset=UTF-8"})
    @ResponseBody
    public String updateGoods(String params) {
        System.out.println("-----更新商品--------");
        System.out.println(params + " before");
        Msg msg;
        Boolean isSuccess;
        try {
            Goods goods = JSON.parseObject(params, Goods.class);
            int flag = goodsService.updateGoods(goods);
            System.out.println(goods.toString());
            if (flag == 1) {
                msg = new Msg("更新商品成功");
                isSuccess = true;
            } else if (flag == 0) {
                isSuccess = false;
                msg = new Msg("更新商品失败");
            } else {
                isSuccess = false;
                msg = new Msg("更新商品发生异常");
            }

            System.out.println(params + " into");
        } catch (Exception e) {
            msg = new Msg("更新商品抛出异常");
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
