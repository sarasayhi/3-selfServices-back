package com.MarissaMan.service.impl;

import com.MarissaMan.dao.UserDao;
import com.MarissaMan.entity.User;
import com.MarissaMan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by saras on 2017/4/20.
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserDao userDao;

    public int addUser(User user) {
        return userDao.insert(user);
    }

    public int deleteUserById(Integer id) {
        return userDao.deleteByPrimaryKey(id);
    }

    public int updateUser(User user) {
        return userDao.updateByPrimaryKeySelective(user);
    }

    public User getUserById(Integer id) {
        return userDao.selectByPrimaryKey(id);
    }

    public User getUserByName(String name) {
        return userDao.selectByName(name);
    }

    public User getUserByMoney(Double money) {
        return userDao.selectByMoney(money);
    }

    public List<User> getAllUser() {
        return userDao.selectAllUser();
    }
}
