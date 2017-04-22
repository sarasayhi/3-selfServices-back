package com.MarissaMan.service.impl;

import com.MarissaMan.dao.SortDao;
import com.MarissaMan.dao.UserDao;
import com.MarissaMan.entity.Sort;
import com.MarissaMan.entity.User;
import com.MarissaMan.service.SortService;
import com.MarissaMan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by saras on 2017/4/20.
 */
@Service
public class SortServiceImpl implements SortService {

    @Autowired
    SortDao sortDao;

    public int updateSort(Sort sort) {
        return sortDao.updateByPrimaryKeySelective(sort);
    }

    public List<Sort> getAllSort() {
        return sortDao.selectAllSort();
    }
}
