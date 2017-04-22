package com.MarissaMan.service.impl;

import com.MarissaMan.dao.GoodsDao;
import com.MarissaMan.entity.Goods;
import com.MarissaMan.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by saras on 2017/4/20.
 */
@Service
public class GoodsServiceImpl implements GoodsService {

    @Autowired
    GoodsDao goodsDao;

    public int addGoods(Goods goods) {
        return goodsDao.insert(goods);
    }

    public int deleteGoodsById(Integer id) {
        return goodsDao.deleteByPrimaryKey(id);
    }

    public int updateGoods(Goods goods) {
        return goodsDao.updateByPrimaryKeySelective(goods);
    }

    public Goods getGoodsById(Integer id) {
        return goodsDao.selectByPrimaryKey(id);
    }

    public Goods getGoodsByName(String name) {
        return goodsDao.selectByName(name);
    }

    public List<Goods> getAllGoods() {
        return goodsDao.selectAllGoods();
    }

    public List<Goods> getGoodsBySort(Integer sort) {
        return goodsDao.selectBySort(sort);
    }

    public List<Goods> getGoodsByStatus(Integer status) {
        return goodsDao.selectByStatus(status);
    }
}
