package com.MarissaMan.service.impl;

import com.MarissaMan.dao.CartDao;
import com.MarissaMan.dao.GoodsDao;
import com.MarissaMan.entity.Cart;
import com.MarissaMan.entity.Goods;
import com.MarissaMan.service.CartService;
import com.MarissaMan.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by saras on 2017/4/20.
 */
@Service
public class CartServiceImpl implements CartService {

    @Autowired
    CartDao cartDao;

    public int addCart(Cart cart) {
        return cartDao.insert(cart);
    }

    public int deleteCartById(Integer id) {
        return cartDao.deleteByPrimaryKey(id);
    }

    public int updateCart(Cart cart) {
        return cartDao.updateByPrimaryKeySelective(cart);
    }

    public List<Cart> getCartByUserId(Integer userId) {
        return cartDao.selectByUserId(userId);
    }
}
