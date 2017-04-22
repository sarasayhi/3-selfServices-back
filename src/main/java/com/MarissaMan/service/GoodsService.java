package com.MarissaMan.service;

import com.MarissaMan.entity.Goods;

import java.util.List;

/**
 * Created by saras on 2017/4/19.
 */
public interface GoodsService {

    int addGoods(Goods goods);

    int deleteGoodsById(Integer id);

    int updateGoods(Goods goods);

    Goods getGoodsById(Integer id);

    Goods getGoodsByName(String name);

    List<Goods> getAllGoods();

    List<Goods> getGoodsBySort(Integer sort);

    List<Goods> getGoodsByStatus(Integer status);
}
