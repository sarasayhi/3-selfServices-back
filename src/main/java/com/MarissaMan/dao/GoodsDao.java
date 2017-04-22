package com.MarissaMan.dao;

import com.MarissaMan.entity.Goods;
import com.MarissaMan.entity.GoodsQuery;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface GoodsDao {
    int countByExample(GoodsQuery example);

    int deleteByExample(GoodsQuery example);

    int deleteByPrimaryKey(Integer goodsId);

    int insert(Goods record);

    int insertSelective(Goods record);

    List<Goods> selectByExample(GoodsQuery example);

    List<Goods> selectAllGoods();

    List<Goods> selectBySort(Integer sort);

    List<Goods> selectByStatus(Integer status);

    Goods selectByPrimaryKey(Integer goodsId);

    Goods selectByName(String name);

    int updateByExampleSelective(@Param("record") Goods record, @Param("example") GoodsQuery example);

    int updateByExample(@Param("record") Goods record, @Param("example") GoodsQuery example);

    int updateByPrimaryKeySelective(Goods record);

    int updateByPrimaryKey(Goods record);
}