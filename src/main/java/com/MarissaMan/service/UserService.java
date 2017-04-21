package com.MarissaMan.service;

import com.MarissaMan.entity.User;

import java.util.List;

/**
 * Created by saras on 2017/4/19.
 */
public interface UserService {

    int addUser(User user);

    int deleteUserById(Integer id);

    int updateUser(User user);

    User getUserById(Integer id);

    User getUserByName(String name);

    User getUserByMoney(Double money);

    List<User> getAllUser();
}
