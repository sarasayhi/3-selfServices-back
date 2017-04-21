package com.MarissaMan.service;

import com.MarissaMan.entity.Goods;
import com.MarissaMan.entity.User;

import java.util.List;

/**
 * Created by saras on 2017/4/19.
 */
public interface GoodsService {

    int addGoods(Goods goods);

    int deleteGoodsById(Integer id);

    int updateGoods(Goods goods);

    User getGoodsById(Integer id);

    User getGoodsByName(String name);

    User getGoodsByMoney(Double money);

    List<Goods> getAllGoods();
}
