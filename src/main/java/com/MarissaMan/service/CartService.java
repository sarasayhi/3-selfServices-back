package com.MarissaMan.service;

import com.MarissaMan.entity.Cart;

import java.util.List;

/**
 * Created by saras on 2017/4/23.
 */
public interface CartService {

    int addCart(Cart cart);

    int deleteCartById(Integer id);

    int updateCart(Cart cart);

    List<Cart> getCartByUserId(Integer userId);
}
