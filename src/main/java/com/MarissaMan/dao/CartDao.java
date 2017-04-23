package com.MarissaMan.dao;

import com.MarissaMan.entity.Cart;
import com.MarissaMan.entity.CartQuery;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface CartDao {
    int countByExample(CartQuery example);

    int deleteByExample(CartQuery example);

    int deleteByPrimaryKey(Integer cartId);

    int insert(Cart record);

    int insertSelective(Cart record);

    List<Cart> selectByExample(CartQuery example);

    Cart selectByPrimaryKey(Integer cartId);

    int updateByExampleSelective(@Param("record") Cart record, @Param("example") CartQuery example);

    int updateByExample(@Param("record") Cart record, @Param("example") CartQuery example);

    int updateByPrimaryKeySelective(Cart record);

    int updateByPrimaryKey(Cart record);
}