package com.MarissaMan.dto;

/**
 * Created by saras on 2017/4/23.
 */
public class CartItem {

    private int cartId;

    private int goodsId;

    private String name;

    private int amount;

    private double price;

    public CartItem() {
    }

    public CartItem(int cartId, int goodsId, String name, int amount, double price) {
        this.cartId = cartId;
        this.goodsId = goodsId;
        this.name = name;
        this.amount = amount;
        this.price = price;
    }

    public int getCartId() {
        return cartId;
    }

    public void setCartId(int cartId) {
        this.cartId = cartId;
    }

    public int getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(int goodsId) {
        this.goodsId = goodsId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
