package com.MarissaMan.dao;

import com.MarissaMan.entity.Sort;
import com.MarissaMan.entity.SortQuery;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface SortDao {
    int countByExample(SortQuery example);

    int deleteByExample(SortQuery example);

    int deleteByPrimaryKey(Integer sortId);

    int insert(Sort record);

    int insertSelective(Sort record);

    List<Sort> selectByExample(SortQuery example);

    Sort selectByPrimaryKey(Integer sortId);

    int updateByExampleSelective(@Param("record") Sort record, @Param("example") SortQuery example);

    int updateByExample(@Param("record") Sort record, @Param("example") SortQuery example);

    int updateByPrimaryKeySelective(Sort record);

    int updateByPrimaryKey(Sort record);
}