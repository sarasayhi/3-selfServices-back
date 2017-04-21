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

(function() {
    // 私有变量
    var TITLE = '膳品宅送',
        PRECISION_QTY = 0,
        PRECISION_MONEY = 2,
        API_URL = {
        'addUser':'user/addUser'
        },
        IM_USER_KEY = '491ef3323f36b63e49a631e821c14b97';

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
        },
        get im_user_key() {
            return IM_USER_KEY;
        }
    };

    // 配置项
    epm.c = {
        set userToken(value) {
            epm.setLocalItem(epm.k.USER_TOKEN, value);
        },
        get userToken() {
            return epm.getLocalItem(epm.k.USER_TOKEN);
        },

        set address(value) {
            if (typeof value !== 'string') {
                value = JSON.stringify(value);
            }

            epm.setLocalItem(epm.k.ADDRESS, value);
        },
        get address() {
            var value = epm.getLocalItem(epm.k.ADDRESS);

            try {
                return JSON.parse(value);
            } catch (err) {
                return null;
            }
        },

        set addressList(value) {
            if (typeof value !== 'string') {
                value = JSON.stringify(value);
            }

            epm.setSessionItem(epm.k.ADDRESS_LIST, value);
        },
        get addressList() {
            var value = epm.getSessionItem(epm.k.ADDRESS_LIST);

            try {
                return JSON.parse(value);
            } catch (err) {
                return value;
            }
        },

        set goodsClassList(value) {
            if (typeof value !== 'string') {
                value = JSON.stringify(value);
            }

            epm.setSessionItem(epm.k.GOODS_CLASS_LIST, value);
        },
        get goodsClassList() {
            var value = epm.getSessionItem(epm.k.GOODS_CLASS_LIST);

            try {
                return JSON.parse(value);
            } catch (err) {
                return value;
            }
        },

        set buyer(value) {
            if (typeof value !== 'string') {
                value = JSON.stringify(value);
            }

            epm.setSessionItem(epm.k.BUYER, value);
        },
        get buyer() {
            var value = epm.getSessionItem(epm.k.BUYER);

            try {
                return JSON.parse(value);
            } catch (err) {
                return value;
            }
        }
    };

    // 键
    epm.k = {
        SEARCH_KEYWORDS: 'SEARCH_KEYWORDS',
        USER_TOKEN: 'USER_TOKEN',
        CURRENT_CITY: 'CURRENT_CITY',
        LOCATION_ADDRESS: 'LOCATION_ADDRESS',
        ADDRESS: 'ADDRESS',
        ADDRESS_LIST: 'ADDRESS_LIST',
        MARKET: 'MARKET',
        MARKET_LIST: 'MARKET_LIST',
        GOODS_CLASS_LIST: 'GOODS_CLASS_LIST',
        BUYER: 'BUYER',
        SELECTED_CART: 'SELECTED_CART'
    };

    // 业务相关
    epm.b = {
        isLogin: function() {
            var user_token = epm.getLocalItem(epm.k.USER_TOKEN);
            return !epm.isEmpty(user_token);
        },
        logOut: function() {
            var params = {};
            params['action'] = 'clear_session';
            epm.ajax(params, function(data) {
                epm.removeLocalItem(epm.k.USER_TOKEN);
                epm.removeSessionItem(epm.k.BUYER);
                epm.removeSessionItem(epm.k.ADDRESS_LIST);

                window.location.href = 'index.html';
                // var locationUrl = window.location.pathname;
                // var checkList = ['index', 'shop_list', 'shop_detail', 'goods_list', 'goods_detail', 'about', 'download'];
                // for (var i = 0; i < checkList.length; i++) {
                //     if (locationUrl.indexOf(checkList[i]) >= 0) {
                //         window.location.reload();
                //         break;
                //     } else {
                //         window.location.href = 'index.html';
                //     }
                // }

            });
        },

        addSearchKeywords: function(value, type) {
            var item;

            var keys = epm.getLocalItem(epm.k.SEARCH_KEYWORDS);
            if (!keys) {
                keys = [];
            } else {
                keys = JSON.parse(keys);
            }

            var isExist = false;
            $.each(keys, function(i, v) {
                if (v['text'] == value) {
                    isExist = true;
                    v['times'] = parseInt(v['times']) + 1;
                    return false;
                }
            });
            if (!isExist) {
                item = {};
                item['text'] = value;
                item['times'] = 1;
                item['type'] = type;
                keys.push(item);
            }

            epm.setLocalItem(epm.k.SEARCH_KEYWORDS, JSON.stringify(keys));
        },
        getSearchKeywords: function() {
            var value = epm.getLocalItem(epm.k.SEARCH_KEYWORDS);

            try {
                value = JSON.parse(value);
            } catch (err) {
                return null;
            }

            if (!value) {
                return null;
            }

            // 排序
            value.sort(function(a, b) {
                if (a['times'] > b['times']) {
                    return -1;
                }

                return 1;
            });

            // var ret = [];
            // var len = value.length > 5 ? 5 : value.length;
            // for (var i = 0; i < len; i++) {
            //     ret.push(value[i]['text']);
            // }
            return value;
        },

        setCart: function(shopIID, goodsIID, goodsAmount, callBack) {
            if (!epm.b.isLogin()) {
                window.location.href = 'login.html';
                return;
            }

            try {
                goodsAmount = parseInt(goodsAmount);
            } catch (err) {
                goodsAmount = 1;
            }

            var params = {};
            params['action'] = 'set_cart';
            params['shop_iid'] = shopIID;
            params['goods_iid'] = goodsIID;
            params['goods_amount'] = goodsAmount;

            epm.ajax(params, function(data) {
                spInitCartAmount(function() {
                    if ($.isFunction(callBack)) {
                        callBack(data);
                    }
                });
            });
        },
        addCart: function(shopIID, goodsIID, amount, callBack) {
            if (!epm.b.isLogin()) {
                window.location.href = 'login.html';
                return;
            }

            var params = {};
            params['action'] = 'add_cart';
            params['shop_iid'] = shopIID;
            params['goods_iid'] = goodsIID;
            params['goods_amount'] = amount;

            epm.ajax(params, function(data) {
                spInitCartAmount(function() {
                    if ($.isFunction(callBack)) {
                        callBack(data);
                    }
                });
            });
        },
        subCart: function(shopIID, goodsIID, callBack) {
            if (!epm.b.isLogin()) {
                window.location.href = 'login.html';
                return;
            }

            var params = {};
            params['action'] = 'sub_cart';
            params['shop_iid'] = shopIID;
            params['goods_iid'] = goodsIID;
            params['goods_amount'] = 1;

            epm.ajax(params, function(data) {
                spInitCartAmount(function() {
                    if ($.isFunction(callBack)) {
                        callBack(data);
                    }
                });
            });
        },
        removeCart: function(cartIID, callBack) {
            if (!epm.b.isLogin()) {
                window.location.href = 'login.html';
                return;
            }

            var params = {};
            params['action'] = 'remove_cart';
            params['cart_iid'] = cartIID;

            epm.ajax(params, function(data) {
                spInitCartAmount(function() {
                    if ($.isFunction(callBack)) {
                        callBack(data);
                    }
                });
            });
        },
        removeCarts: function(cartIIDs, callBack) {
            if (!epm.b.isLogin()) {
                window.location.href = 'login.html';
                return;
            }

            if (!epm.isArray(cartIIDs)) {
                alert('无效的购物车商品 ');
                return;
            }

            var params = {};
            params['action'] = 'remove_carts';
            params['cart_iids'] = cartIIDs;

            epm.ajax(params, function(data) {
                spInitCartAmount(function() {
                    if ($.isFunction(callBack)) {
                        callBack(data);
                    }
                });
            });
        },

        addGoodsLike: function(shopIID, goodsIID, callBack) {
            if (!epm.b.isLogin()) {
                window.location.href = 'login.html';
                return;
            }

            var params = {};
            params['action'] = 'add_goods_like';
            params['shop_iid'] = shopIID;
            params['goods_iid'] = goodsIID;

            epm.ajax(params, callBack);
        },
        addShopLike: function(shopIID, callBack) {
            if (!epm.b.isLogin()) {
                window.location.href = 'login.html';
                return;
            }

            var params = {};
            params['action'] = 'add_shop_like';
            params['shop_iid'] = shopIID;

            epm.ajax(params, callBack);
        },
        removeGoodsLike: function(shopIID, goodsIID, callBack) {
            if (!epm.b.isLogin()) {
                window.location.href = 'login.html';
                return;
            }

            var params = {};
            params['action'] = 'remove_goods_like';
            params['shop_iid'] = shopIID;
            params['goods_iid'] = goodsIID;

            epm.ajax(params, callBack);
        },
        removeShopLike: function(shopIID, callBack) {
            if (!epm.b.isLogin()) {
                window.location.href = 'login.html';
                return;
            }

            var params = {};
            params['action'] = 'remove_shop_like';
            params['shop_iid'] = shopIID;

            epm.ajax(params, callBack);
        },
        addSelectedCart: function(cartIID) {
            var cartArray = [];
            cartArray = JSON.parse(epm.getLocalItem(epm.k.SELECTED_CART));
            if (null != cartArray && cartArray.length > 0) {
                if ($.inArray(cartIID, cartArray) >= 0) {
                    return;
                }
            } else {
                cartArray = [];
            }
            cartArray.push(cartIID);
            epm.setLocalItem(epm.k.SELECTED_CART, JSON.stringify(cartArray));
        },
        getSelectedCart: function() {
            return JSON.parse(epm.getLocalItem(epm.k.SELECTED_CART));
        },
        removeSelectedCart: function(cartIID) {
            var cartArray = JSON.parse(epm.getLocalItem(epm.k.SELECTED_CART));
            if (null == cartArray) return;
            var _index = $.inArray(cartIID, cartArray);
            if (_index >= 0) {
                cartArray.splice(_index, 1);
                epm.removeLocalItem(epm.k.SELECTED_CART);
                epm.setLocalItem(epm.k.SELECTED_CART, JSON.stringify(cartArray));
            }
        }
    };

    epm.setSessionItem = function(key, value) {
        if (window.sessionStorage) {
            sessionStorage.setItem(key, value);
        } else {
            //后备方案
            setCookie(key, value);
        }
    };

    epm.getSessionItem = function(key) {
        if (window.sessionStorage) {
            return sessionStorage.getItem(key);
        } else {
            //后备方案
            return getCookie(key);
        }
    };

    epm.removeSessionItem = function(key) {
        if (window.sessionStorage) {
            sessionStorage.removeItem(key);
        } else {
            //后备方案
            removeCookie(key);
        }
    };

    epm.setLocalItem = function(key, value) {
        if (window.localStorage) {
            localStorage.setItem(key, value);
        } else {
            //后备方案
            setCookie(key, value);
        }
    };

    epm.getLocalItem = function(key) {
        if (window.localStorage) {
            return localStorage.getItem(key);
        } else {
            //后备方案
            return getCookie(key);
        }
    };

    epm.removeLocalItem = function(key) {
        if (window.localStorage) {
            localStorage.removeItem(key);
        } else {
            //后备方案
            removeCookie(key);
        }
    };

    epm.getNumber = function(num) {
        if (isNaN(num) || num === null || num === '') {
            return num;
        }

        return num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    };

    epm.getDateTime = function(o) {
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

    epm.getDate = function(o) {
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

    epm.getFloat = function(o) {
        var ret = parseFloat(o);

        return isNaN(ret) ? 0 : ret;
    };

    epm.getQty = function(o) {
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

    epm.getMoney = function(o) {
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

    epm.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }

        return null;
    };

    epm.isEmpty = function(o) {
        if (o === undefined) {
            return true;
        }

        if (o == null) {
            return true;
        }

        return $.trim(o.toString()) == '';
    };

    epm.isArray = function(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };

    epm.ajax = function(operation,params, success, successError, fail, always) {
        // if (!epm.isEmpty(params)
        //     && !epm.isEmpty(epm.c.userToken)) {
        //     params['user_token'] = epm.c.userToken;
        // }
        alert(API_URL[operation]);
        $.ajax(API_URL[operation], {
            params: JSON.stringify(params)
        }).done(function(data, status, xhr) {
            if (data == undefined || data == null || data.length == 0) {
                alert('服务器繁忙');
                return;
            }

            if (typeof data !== 'object') {
                data = JSON.parse(data);
            }

            // if (data['ans'] != 'ok') {
            //
            //     if (data['ans'] == '用户不存在') {
            //         epm.b.logOut();
            //     } else {
            //         if ($.isFunction(successError)) {
            //             successError(data);
            //         } else {
            //             alert(data['ans']);
            //         }
            //     }
            //
            //     return;
            // }

            // if (!epm.isEmpty(data['new_user_token'])) {
            //     var newUserToken = data['new_user_token'];
            //     if (newUserToken !== epm.c.userToken) {
            //         epm.c.userToken = newUserToken;
            //     }
            // }

            if ($.isFunction(success)) {
                success(data);
            }

        }).fail(function(jqXHR, textStatus, errorThrown) {
            if ($.isFunction(fail)) {
                fail();
            } else {
                var msg = '\r\nstatus: ' + jqXHR.status + ', textStatus: ' + textStatus + ',errorThrown: ' + errorThrown;
                alert('服务器繁忙，请稍候重试' + msg);
            }

        }).always(function() {
            if ($.isFunction(always)) {
                always();
            }
        });
    };



    window.epm = epm;
})();

$(document).ready(function() {

    //
    // spCommonInit();

    //
    if ($.isFunction(window.pageInit)) {
        pageInit();
    }
});

// 初始化公共部分
function spCommonInit() {

    // 设置页面标题
    // document.title = epm.v.title;

    //判断是否在地址页 不明白什么业务 暂时屏蔽
    var pathName = window.location.pathname;
    if (pathName.indexOf('location_index') > -1
        || pathName.indexOf('about') > -1
        || pathName.indexOf('login') > -1) {
        return;
    }

    // 初始访问(没有地址信息),不管哪个页面.都必须转向location.html
    var isIndexPage = pathName.indexOf('/index') > -1
        || document.URL == "http://www.3pzs.com/"
        || document.URL == "https://www.3pzs.com/"
        || document.URL == "http://3pzs.com/"
        || document.URL == "https://3pzs.com/"
        || document.URL == "http://t-www.3pzs.com/"
        || document.URL == "https://t-www.3pzs.com/";

    if (epm.c.address == null && isIndexPage && !epm.b.isLogin()) {
        window.location.href = 'location_index.html';
        return;
    }

    //
    spInitStaticResource();
    spInitGoodsClass();

    if (!epm.b.isLogin()) {
        // 未登录,以位置页定位地址去获取市场
        spInitAddress();
        spInitMarketList();
    } else {
        // 已登录,获取用户及默认地址去获取市场
        spInitUser();
    }

    //判断是否初始化客服
    if (pathName.indexOf('shop_detail') == -1 && pathName.indexOf('goods_detail') == -1
        && pathName.indexOf('order_detail') == -1) {
        _ud.initUD('客服在线', '客服离线', '.service', []);
    }
}

// 初始化静态资源
function spInitStaticResource() {
    var html = '';
    html += '<p class="hd-top-item"><a href="order_list.html">我的订单</a></p>';
    html += '<p class="hd-top-item"><a href="address_list.html">我的地址</a></p>';
    html += '<p class="hd-top-item"><a href="wallet.html">我的钱包</a></p>';
    html += '<p class="hd-top-item"><a href="#" onclick="epm.b.logOut()">退出登录</a></p>';
    $('#menu').html(html);

    // 输入词出现搜索相关内容下拉框
    $('#search').on('input', function() {
        var searchText = $('#searchSelect').val();

        $('.hd-search-list').show();

        if (searchText == '商品') {
            getSearchKeyList(0);
        } else if (searchText == '档口') {
            getSearchKeyList(1);
        }
    }).on('keydown', function(e) {
        if (e.keyCode == 13) {
            $('#btnSearch').click();
        }
    });

    $('#searchSelect').on('click', function() {
        $('.hd-search-list').hide();
    });

    if (epm.getUrlParam('iskey') == 1) {
        if (epm.isEmpty(epm.getUrlParam('stall_key'))) {
            epm.b.addSearchKeywords(unescape(epm.getUrlParam('key')), 1);
        } else {
            epm.b.addSearchKeywords(unescape(epm.getUrlParam('stall_key')), 2);
        }
    }

    // 点击搜索按钮
    $('#btnSearch').on('click', function() {
        var keyword = replaceIllegalStr($('#search').val());
        var searchText = $('#searchSelect').val();
        if (!epm.isEmpty(keyword)) {
            // epm.b.addSearchKeywords(keyword);
            if (searchText == '商品') {
                window.location.href = 'goods_list.html?key=' + escape(keyword) + '&iskey=2';
            } else if (searchText == '档口') {
                window.location.href = 'shop_list.html?stall_key=' + escape(keyword) + '&iskey=2';
            }
        }

    });

    var searchKeywords = epm.b.getSearchKeywords();
    if (searchKeywords) {
        var len = searchKeywords.length;

        var url;
        html = '';
        for (var i = 0; i < len; i++) {

            var key = searchKeywords[i];

            if (key['type'] == '1') {
                url = 'goods_list.html?key=' + escape(key['text']) + '&iskey=1';
            } else {
                url = 'shop_list.html?stall_key=' + escape(key['text']) + '&iskey=1';
            }

            html += '<a href="' + url + '">' + key['text'] + '</a>';
            if (i < len - 1) {
                html += '<i class="hot-separator">/</i>';
            }
        }
        $('#hotWords').html(html);
    }

    // 点击底部的用户反馈
    $('#feedBack').on('click', function() {
        if (epm.b.isLogin()) {
            window.location.href = 'feedback.html';
        } else {
            window.location.href = 'login.html';
        }
    });

    // 点击购物车按钮
    $('.hd-cart').click(function() {
        if (epm.b.isLogin()) {
            window.location.href = 'cart.html';
        } else {
            window.location.href = 'login.html';
        }
    });

    // 点击回到顶部
    $('#goTop').click(function() {
        $('body,html').animate({scrollTop: 0}, 500);
    });

    //
    $(window).scroll(function() {
        var scrollValue = $(document).scrollTop();

        // 右悬浮区域按钮显示或隐藏
        var $goToTop = $('.go-top');
        var max = $('footer').offset().top - 880;

        if (scrollValue > 880 && scrollValue < max) {
            $goToTop.css('display', 'block');
        } else {
            $goToTop.css('display', 'none');
        }

        // 悬浮导航显示或隐藏
        var $hdNav = $('.hd-nav');
        var $hdFixedCenter = $('.hd-fixed-center');
        var $hdFixedRight = $('.hd-fixed-right');
        if (scrollValue >= 300) {
            $hdNav.addClass('hd-fixed-nav');
            $hdFixedCenter.addClass('sp-container');
            $hdFixedRight.show();
        } else {
            $hdNav.removeClass('hd-fixed-nav');
            $hdFixedCenter.removeClass('sp-container');
            $hdFixedRight.hide();
        }
    });
}

// 热词搜索
function getSearchKeyList(search_type) {
    var htmlSearch = '';
    var params = {};
    params['action'] = 'get_search_key_list';
    params['market_iid'] = epm.c.market['market_iid'];
    params['search_type'] = search_type;
    params['search_key'] = $('#search').val();

    epm.ajax(params, function(result) {
        if (result.ans != 'ok') {
            return;
        }

        $.each(result['data'], function(key, value) {
            if ($('#searchSelect').val() == '商品') {

                htmlSearch += '<li class="hd-search-item">'
                    + '<a href="goods_list.html?key=' + escape(value['goods_name']) + '&iskey=1">' + value['goods_name'] + '</a>'
                    + '</li>';
            } else {

                htmlSearch += '<li class="hd-search-item">'
                    + '<a href="shop_list.html?stall_key=' + escape(value['shop_name']) + '&iskey=1">' + value['shop_name'] + '</a>'
                    + '</li>';
            }
        });
        $('.hd-search-list').html(htmlSearch);

    });

}

// 初始化商品分类
function spInitGoodsClass() {

    var classList = epm.c.goodsClassList;
    if (classList) {
        initFinish(classList);

    } else {
        var params = {};
        params['action'] = 'get_class_list';

        epm.ajax(params, function(data) {
            data = data['data'];
            epm.c.goodsClassList = data;

            initFinish(data);
        });
    }

    function initFinish(data) {
        var html = '<li><a href="index.html">首页</a></li>';

        $.each(data, function(index, value) {
            html += '<li id="' + value['goods_class_sid'] + '">'
                + '<a href="goods_list.html?sid=' + value['goods_class_sid'] + '">' + value['goods_class_name'] + '</a>'
                + '<div class="hd-subnav-items">'
                + '<ul class="sp-container">'
                + '<li><a href="goods_list.html?sid=' + value['goods_class_sid'] + '">全部</a></li>';

            $.each(value['details'], function(index, value) {
                html += '<li>'
                    + '<a href="goods_list.html?sid=' + value['goods_class_sid'] + '">' + value['goods_class_name'] + '</a>'
                    + '</li>';
            });

            html += '</ul></div></li>';
        });

        var $target = $('.hd-nav-items');
        $target.html(html);

        //
        var classId = epm.getUrlParam('sid');
        var url = window.location.href;
        if (classId != null && classId.toString().length > 1) {
            $target.find('li').removeClass('hd-active');
            $('#' + classId.substring(0, 3)).addClass('hd-active');
            document.title = '膳品宅送-' + $('#' + classId.substring(0, 3)).find('a').html();
        } else if (url.indexOf('goods_list') >= 0) {
            $target.find('li').eq(0).addClass('hd-active');
            document.title = '膳品宅送-人气商品';
        }
    }

}

// 初始化用户信息
function spInitUser() {
    var $loginIn = $('.hd-login-in');
    var $hdUser = $('.hd-user');

    var buyer = epm.c.buyer;
    if (buyer) {
        initFinish(buyer);

    } else {
        var params = {};
        params['action'] = 'get_buyer_info';
        epm.ajax(params, function(data) {
            buyer = data['data'];
            epm.c.buyer = buyer;
            initFinish(buyer);
        });
    }

    function initFinish(data) {
        var $target = $hdUser.find('.hd-top-txt');
        $target.text('欢迎，' + data['buyer_name']);
        $target.attr('buyer_iid', data['buyer_iid']);

        $loginIn.hide();
        $hdUser.show();

        // 根据用户初始化地址列表
        spInitAddressList();
    }
}

// 初始化用户地址列表
function spInitAddressList() {
    var buyerAddressList = epm.c.addressList;
    if (buyerAddressList) {
        initFinish(buyerAddressList);

    } else {
        var params = {};
        params['action'] = 'get_address_list';
        epm.ajax(params, function(data) {
            buyerAddressList = data['data'];

            epm.c.addressList = buyerAddressList;
            if (buyerAddressList.length > 0) {
                epm.c.address = buyerAddressList[0];
            }

            initFinish(buyerAddressList);
        });
    }

    function initFinish(data) {
        var $target = $('#addressList');

        var html = '';
        $.each(data, function(index, value) {

            var address = epm.isEmpty(value['address_desc']) ? value['address'] : value['address_desc'];

            html += '<p class="hd-top-item" longitude="' + value['lng'] + '" latitude="' + value['lat'] + '">'
                + '<a href="javascript:void();">' + address + '</a></p>';
        });
        if (!epm.isEmpty(html)) {
            html += '<p class="hd-top-item"><a href="location_index.html">[ 切换新地址 ]</a></p>';
        }
        $target.html(html);

        $target.find('p:not(:last-child)').click(function() {
            var selectedIndex = $(this).index();
            var longitude = $(this).attr('longitude');
            var latitude = $(this).attr('latitude');
            epm.b.getMarketList($(this).attr('longitude'), $(this).attr('latitude'),
                function setMarketList(data) {
                    if ('ok' == data.ans) {
                        data = data['data'];
                        if (data.length > 0) {

                            // 送货地址
                            var curAddress = {};
                            curAddress['address'] = data[0]['market_name'];
                            curAddress['longitude'] = longitude;
                            curAddress['latitude'] = latitude;

                            epm.c.locationAddress = curAddress;
                            epm.c.address = curAddress;

                            // 缓存附近市场列表
                            epm.c.marketList = data;

                            // 缓存当前市场,默认为第一个
                            epm.c.market = data[0];

                            curAddress = epm.c.addressList[selectedIndex];

                            if (curAddress) {

                                epm.c.address = curAddress;

                                epm.removeSessionItem(epm.k.MARKET);
                                epm.removeSessionItem(epm.k.MARKET_LIST);

                                // window.location.reload();
                                window.location.href = 'index.html';
                            }
                        }
                    }
                });

        });

        //
        spInitAddress();
        spInitMarketList();
    }

    function setMarketList(data) {
        if ('ok' == data.ans) {
            data = data['data'];
            if (data.length > 0) {
                // 送货地址
                var curAddress = {};
                curAddress['address'] = $text.val();
                curAddress['longitude'] = longitude;
                curAddress['latitude'] = latitude;

                epm.c.locationAddress = curAddress;
                epm.c.address = curAddress;

                // 缓存附近市场列表
                epm.c.marketList = data;

                // 缓存当前市场,默认为第一个
                epm.c.market = data[0];
            }
        }
    }
}

// 初始化地址
function spInitAddress() {

    var curAddress = epm.c.address;
    if (curAddress) {
        var address = curAddress['address_desc'];
        if (epm.isEmpty(address)) {
            address = curAddress['address'];
        }

        $('.address').text(address);
    }
}

// 获取购物车数量
function spInitCartAmount(callBack) {
    if (!epm.b.isLogin()) {
        $('.hd-shop-num,.hd-cart-total b').text(0);
        return;
    }

    var params = {};
    params['action'] = 'get_cart_amount';
    params['market_iid'] = epm.c.market['market_iid'];
    epm.ajax(params, function(data) {

        var amount = 0;
        try {
            amount = parseInt(data['data']);
        } catch (err) {
            console.error('spInitCartAmount ERROR : ' + data['data']);
        }

        $('.hd-shop-num,.hd-cart-total b').text(amount);

        if ($.isFunction(callBack)) {
            callBack();
        }
    });
}

// 用户头像和用户名
function initHeadImg() {
    $('#returnUrl').val(document.URL);
    var actionUrl = '//t-web.3pzs.com/app/pc5.php';
    var params = {};
    params['action'] = 'get_buyer_info';

    epm.ajax(params, function(data) {
        var userName = data['data']['buyer_name'];
        var imgURL = epm.isEmpty(data['data']['image_url']) ? 'img/userpic_2.png' : epm.v.imageURLPrefix + data['data']['image_url'];
        $('.user-name').text(userName);
        $('.user-img').attr('src', imgURL);
        $('.user-img-upload').html('<img src="' + imgURL + '" alt="" />');
    });

    var $cmShade = $('.cm-shade');
    var $userNameModal = $('.user-name-modal');
    var $userImgModal = $('.user-img-modal');
    // 打开修改头像弹窗
    $('.user-shade').on({
        click: function() {
            $cmShade.fadeIn('100');
            $userImgModal.slideDown(200);
            var imgURL = $('.user-img').attr('src');
            $('.user-img-upload').html('<img src="' + imgURL + '" alt="" />');
        }
    });

    // 关闭修改头像弹窗
    $('.close-userimg-modify').on({
        click: function() {
            $cmShade.fadeOut(100);
            $userImgModal.slideUp(200);
        }
    });

    // 上传头像
    $('#imgUpload').on({
        click: function() {
            if ($(this).hasClass('cm-btn-active')) {
                $cmShade.fadeOut(100);
                $userImgModal.slideUp(200);
                $(this).removeClass('cm-btn-active');
                $('#imgForm').attr('action', actionUrl);
                $('#imgForm').submit();
            }
        }
    });

    // 打开修改用户名弹窗
    $('.user-name').on({
        click: function() {
            $cmShade.fadeIn('100');
            $userNameModal.slideDown(200);
        }
    });

    // 关闭修改用户名弹窗
    $('.close-username-modify').on({
        click: function() {
            $('.btn-special').removeClass('cm-btn-active');
            $cmShade.fadeOut(100);
            $userNameModal.slideUp(200);
        }
    });

    // 修改用户名输入框
    $('.username-modify').on({
        click: function(e) {
            $(this).addClass('username-modify-active');
            e.stopPropagation();
        },
        input: function() {
            var $btn = $('.btn-special');
            $btn.addClass('cm-btn-active');

            if (epm.isEmpty($('.username-modify').val())) {
                $btn.removeClass('cm-btn-active');
            }
        }
    });
    // 确认修改用户名
    $('.btn-special').on({
        click: function() {
            if ($(this).hasClass('cm-btn-active')) {
                var userName = replaceIllegalStr($('.username-modify').val());

                var params = {};
                params['action'] = 'update_buyer_info';
                params['buyer_name'] = userName;

                epm.ajax(params, function() {

                    $cmShade.fadeOut(100);
                    $userNameModal.slideUp(200);

                    $('.user-name').text(userName);
                    $('.btn-special').removeClass('cm-btn-active');

                    var data = [];
                    data['buyer_name'] = userName;
                    data['buyer_iid'] = epm.c.buyer.buyer_iid;

                    epm.removeSessionItem(epm.k.BUYER);
                    spInitUser();
                });

            }

        }
    });
}

/**
 * 替换非法字符
 * @param str
 * @returns {*}
 */
function replaceIllegalStr(str) {
    var reg;
    var illegal_list = ["/", "\\",
        "[", "]",
        "{", "}",
        "<", ">",
        "＜", "＞",
        "「", "」",
        "：", "；",
        "、", "•",
        "^", "'", "\"",
        "\r", "\r\n", "\\n", "\n"];
    for (var i = 0; i < illegal_list.length; i++) {
        if (str.indexOf(illegal_list[i]) >= 0) {
            if (illegal_list[i] == '\\' || illegal_list[i] == '[') {
                reg = new RegExp('\\' + illegal_list[i], "g");
            } else {
                reg = new RegExp(illegal_list[i], "g");
            }
            str = str.replace(reg, '');
        }
    }
    return str.trim();
}
