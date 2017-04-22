/* Copyright (C) 2016
 * This file is part of the Epiphyllum B7 System.
 *
 * filename : default
 * function :
 * action   :
 * version  : 7.1
 * author   : carl
 * date     : 2016-12-07
 * modify   : 此文件如需修改,请联系carl
 */

(function () {
    // 私有变量
    var TITLE = '膳品宅送',
        PRECISION_QTY = 0,
        PRECISION_MONEY = 2,
        API_URL = {
            'addUser': 'user/addUser'
        };

    // 私有方法
    function setCookie(key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    }

    function getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }

    function removeCookie(key) {
        var expires = new Date();
        expires.setTime(expires.getTime() - (7 * 24 * 60 * 60 * 1000));
        var current = getCookie(key);
        if (current != null) {
            document.cookie = key + '= undefined;expires=' + expires.toUTCString();
        }
    }

    //
    var epm = {};

    // 变量
    epm.v = {
        get title() {
            return TITLE;
        }
    };

    // 配置项
    epm.c = {
        set goodsSortList(value) {
            if (typeof value !== 'string') {
                value = JSON.stringify(value);
            }

            epm.setLocalItem(epm.k.SORT_LIST, value);
        },
        get goodsSortList() {
            var value = epm.getLocalItem(epm.k.SORT_LIST);

            try {
                return JSON.parse(value);
            } catch (err) {
                return value;
            }
        }
    };

    // 业务相关
    epm.b = {
        isLogin: function () {
            var user_token = epm.getLocalItem('username');
            return !epm.isEmpty(user_token);
        },
        logOut: function () {

        }
    };

    epm.setSessionItem = function (key, value) {
        if (window.sessionStorage) {
            sessionStorage.setItem(key, value);
        } else {
            //后备方案
            setCookie(key, value);
        }
    };

    epm.getSessionItem = function (key) {
        if (window.sessionStorage) {
            return sessionStorage.getItem(key);
        } else {
            //后备方案
            return getCookie(key);
        }
    };

    epm.removeSessionItem = function (key) {
        if (window.sessionStorage) {
            sessionStorage.removeItem(key);
        } else {
            //后备方案
            removeCookie(key);
        }
    };

    epm.setLocalItem = function (key, value) {
        if (window.localStorage) {
            localStorage.setItem(key, value);
        } else {
            //后备方案
            setCookie(key, value);
        }
    };

    epm.getLocalItem = function (key) {
        if (window.localStorage) {
            return localStorage.getItem(key);
        } else {
            //后备方案
            return getCookie(key);
        }
    };

    epm.removeLocalItem = function (key) {
        if (window.localStorage) {
            localStorage.removeItem(key);
        } else {
            //后备方案
            removeCookie(key);
        }
    };

    epm.getNumber = function (num) {
        if (isNaN(num) || num === null || num === '') {
            return num;
        }

        return num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    };

    epm.getDateTime = function (o) {
        if (o == null || o == '') {
            return null;
        }

        var d = new Date(o);
        if (typeof  d === 'undefined') {
            o = o.substr(0, o.indexOf('.'));
            o = o.replace(/-/g, '/');
            d = new Date(o);
        }

        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();

        return d.getFullYear() + '-' + (('' + month).length < 2 ? '0' : '')
            + month + '-' + (('' + day).length < 2 ? '0' : '') + day + ' '
            + (('' + hour).length < 2 ? '0' : '') + hour + ':'
            + (('' + minute).length < 2 ? '0' : '') + minute + ':'
            + (('' + second).length < 2 ? '0' : '') + second;
    };

    epm.getDate = function (o) {
        if (o == null || o == '') {
            return null;
        }

        var d = new Date(o);
        if (typeof d === 'undefined') {
            o = o.substr(0, o.indexOf('.0'));
            o = o.replace(/-/g, '/');
            d = new Date(o);
        }

        var month = d.getMonth() + 1;
        var day = d.getDate();

        return d.getFullYear() + '-' + (('' + month).length < 2 ? '0' : '')
            + month + '-' + (('' + day).length < 2 ? '0' : '') + day;
    };

    epm.getFloat = function (o) {
        var ret = parseFloat(o);

        return isNaN(ret) ? 0 : ret;
    };

    epm.getQty = function (o) {
        var ret = this.getFloat(o);

        if (PRECISION_QTY == 0) {
            return Math.round(ret);
        } else if (PRECISION_QTY == 1) {
            return Math.round(ret * 10) / 10;
        } else if (PRECISION_QTY == 2) {
            return Math.round(ret * 100) / 100;
        } else {
            return Math.round(ret);
        }
    };

    epm.getMoney = function (o) {
        var ret = this.getFloat(o);

        if (PRECISION_MONEY == 2) {
            return Math.round(ret * 100) / 100;
        } else if (PRECISION_MONEY == 1) {
            return Math.round(ret * 10) / 10;
        } else if (PRECISION_MONEY == 2) {
            return Math.round(ret);
        } else {
            return Math.round(ret * 100) / 100;
        }
    };

    epm.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }

        return null;
    };

    epm.isEmpty = function (o) {
        if (o === undefined) {
            return true;
        }

        if (o == null) {
            return true;
        }

        return $.trim(o.toString()) == '';
    };

    epm.isArray = function (o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };

    window.epm = epm;
})();

$(document).ready(function () {
    //获取类别列表
    InitGoodsSortList();

    spInitStaticResource();

    if (epm.getLocalItem('username')) {
        // 已登录,获取用户
        var $loginIn = $('.hd-login-in');
        var $hdUser = $('.hd-user');

        var $target = $hdUser.find('.hd-top-txt');
        $target.text('欢迎，' + epm.getLocalItem('username'));

        $loginIn.hide();
        $hdUser.show();
    }

    if ($.isFunction(window.pageInit)) {
        pageInit();
    }

});

// 初始化静态资源
function spInitStaticResource() {
    var html = '';
    html += '<p class="hd-top-item"><a href="order_list.html">我的订单</a></p>';
    html += '<p class="hd-top-item"><a href="address_list.html">我的地址</a></p>';
    html += '<p class="hd-top-item"><a href="wallet.html">我的钱包</a></p>';
    html += '<p class="hd-top-item"><a href="#" onclick="epm.b.logOut()">退出登录</a></p>';
    $('#menu').html(html);
}

// 初始化商品分类
function InitGoodsSortList() {

    var sortList = epm.c.goodsSortList;
    if (sortList) {
        initFinish(sortList);
    } else {
        //获取类别列表
        $.post("getSortList", function (result) {
            var resultObject = JSON.parse(result);
            var sortList = resultObject['data'];
            var params = {};
            $.each(sortList, function (key, value) {
                var id = value['sortId'];
                params[id] = value['sortName'];
            });
            if (params !== epm.c.goodsSortList) {
                epm.c.goodsSortList = JSON.stringify(params);
            }

            initFinish(epm.c.goodsSortList);
        });
    }

    function initFinish(data) {
        var html = '<li id="0"><a href="#" sortId="0">首页</a></li>';

        $.each(data, function (id, name) {
            html += '<li id="' + id + '"><a href="#" sortId="' + id + '">' + name + '</a></li>';
        });

        var $target = $('.hd-nav-items');
        $target.html(html);

        $('.hd-nav-items a').on({
            click: function () {
                var sortId = $(this).attr('sortId');
                epm.setSessionItem("turnToSort", sortId);
                window.location.href = 'goodsList';
            }
        });

        var $login = $('.hd-login-in a');
        $login.attr('href', 'userLogin');
        $login.first().on({
            click: function () {
                epm.setSessionItem('toLogin', 1);
            }
        });
        $login.last().on({
            click: function () {
                epm.setSessionItem('toLogin', 0);
            }
        });

        //
        // var classId = epm.getUrlParam('sid');
        // var url = window.location.href;
        // if (classId != null && classId.toString().length > 1) {
        //     $target.find('li').removeClass('hd-active');
        //     $('#' + classId.substring(0, 3)).addClass('hd-active');
        //     document.title = '膳品宅送-' + $('#' + classId.substring(0, 3)).find('a').html();
        // } else if (url.indexOf('goods_list') >= 0) {
        //     $target.find('li').eq(0).addClass('hd-active');
        //     document.title = '膳品宅送-人气商品';
        // }
    }

}
