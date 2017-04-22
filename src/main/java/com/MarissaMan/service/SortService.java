package com.MarissaMan.service;

import com.MarissaMan.entity.Sort;

import java.util.List;

/**
 * Created by saras on 2017/4/19.
 */
public interface SortService {

    int updateSort(Sort sort);

    List<Sort> getAllSort();


}
