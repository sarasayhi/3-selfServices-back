/* Copyright (C) 2016
 * This file is part of the Epiphyllum B7 System.
 *
 * filename : goods_list.js
 * function :
 * action   :
 * version  : 7.1
 * author   : MarissaMan
 * date     : 2017-01-12
 * modify   :
 */
function pageInit() {
    // initMenu();
    // initDataList();
    // alert();

    getGoodsList();

    // eventTrigger();
}

/**
 *  初始化商品类别
 */
function initMenu() {

    var params = {};
    params['action'] = 'get_class_list';

    epm.ajax(params, function (result) {
        console.log(JSON.stringify(result));
        if (result.ans != 'ok') {
            return;
        }

        if (epm.isEmpty(CLASS_ID)) {
            return;
        }

        var html = '<a href="goods_list.html?sid=' + CLASS_ID.substr(0, 3) + '">全部</a>';

        $.each(result['data'], function (index, value) {

            if (value['goods_class_sid'] != CLASS_ID.substr(0, 3)) {
                return;
            }

            var goodsClassSid, goodsClassName;
            $.each(value['details'], function (index, value) {

                goodsClassSid = value['goods_class_sid'];
                goodsClassName = value['goods_class_name'];
                html += '<a href="goods_list.html?sid=' + goodsClassSid + '">' + goodsClassName + '</a>';

            });
            $('.subdivision-left').html(html);
        });

    });

}

/**
 *  获取商品列表
 */
function getSortName(sortId) {
    var goodsSortList = epm.c.goodsSortList;
    $.each(goodsSortList, function (id, name) {
        console.log(goodsSortList);
        var te;
        console.log(name + typeof name);
        if (id == sortId) {

            te = name;
        }
        return te;
    })
}

function getGoodsList() {

    var sortId = epm.getSessionItem('turnToSort');
    $('li[id="' + sortId + '"]').addClass('hd-active');

    var url = 'goods/getGoodsList/' + sortId;
    $.post(url, function (result) {
        var resultObject = JSON.parse(result);
        if (resultObject['success'] == false) {
            alert("暂无商品");
            return;
        }

        var $dataList = $('.cm-list'),
            $dataItem = $('.cm-col-5');

        var html = '';
        var goodsId, goodsName, price, stockAmount, imgURL, sortId, sortName, cartId, cartAmount;
        var imgPrefix = 'images/all/';
        var imgSuffix = '.jpg';
        $.each(resultObject['data'], function (key, goods) {
            goodsId = goods['goodsId'];
            goodsName = goods['name'];
            price = goods['price'];
            stockAmount = goods['stock'];
            imgURL = imgPrefix + goods['url'] + imgSuffix;
            sortId = goods['sort'];
            var goodsSortList = epm.c.goodsSortList;
            $.each(goodsSortList, function (id, name) {
                if (id == goods['sort']) {
                    sortName = name;
                }
            });

            var cartList = epm.c.cartList;
            if (cartList !== null && cartList[goodsId] !== undefined) {
                var item = cartList[goodsId];
                // {"amount":50,"cartId":5,"goodsId":10253,
                //     "name":"GRACO葛莱汽车儿童安全座椅增高垫4-12岁","price":438}
                cartId = item['cartId'];
                cartAmount = item['amount'];
            } else {
                cartId = 0;
                cartAmount = 0;
            }

            html += '<li class="cm-col-5">'
                + '<a href="goods_detail.html?shopiid=' + sortId + '&goodsiid=' + goodsId + '">'
                + '<img src="' + imgURL + '">'
                + '<div class="cm-col-5-info">'
                + '<h3 class="cm-col-5-info-name">' + goodsName + '</h3>'
                + '<p class="cm-col-5-stall">' + sortName + '</p>'
                + '<p class="cm-col-5-goods-price">￥' + price + '</p></div></a>'

                + '<span class="cm-col-5-cart">'
                + '<span class="cart-num-null"'
                + (cartAmount == 0 ? ' style="display:none" ' : '')
                + '>'
                + '<i class="cm-col-5-cart-minus iconfont">&#xe629;</i>'
                + '<i class="cm-col-5-cart-num" sortid="' + sortId + '" goodsid="'
                + goodsId + '" stock-amount="' + stockAmount
                + '" cart-amount="' + cartAmount + '" cartid="' + cartId + '" goods-name="' + goodsName + '" price="' + price + '">' + cartAmount + '</i></span>'
                + '<i class="cm-col-5-cart-plus iconfont">&#xe623;</i></span>'
                + '</li>';
        });

        var dataItemHeight = $dataItem.outerHeight(true);

        $dataList.append(html).height(dataItemHeight * Math.ceil($dataList.find('li').length / 5));


        // 增加商品数量
        $('.cm-col-5-cart-plus').on({
            click: function () {
                if (epm.getLocalItem(epm.k.USER_NAME) !== null) {
                    var $target = $(this).parents('.cm-col-5-cart').find('.cm-col-5-cart-num'),
                        $targetShow = $(this).siblings('.cart-num-null'),
                        max = $target.attr('stock-amount'),
                        cartId = $target.attr('cartid'), amount, url;
                    if (cartId == 0) {
                        url = "cart/addCart";
                        amount = 1;
                    } else {
                        url = 'cart/updateCart';
                        amount = parseInt($target.text()) + 1;
                    }

                    console.log(parseInt($target.text()));
                    if (amount <= max || max == -1) {
                        var goodsId = $target.attr('goodsid'),
                            goodsName = $target.attr('goods-name'),
                            price = $target.attr('price');
                        var token = JSON.parse(epm.getLocalItem(epm.k.USER_NAME));
                        var params = {};
                        params['cartId'] = cartId;
                        params['goodsId'] = goodsId;
                        params['name'] = goodsName;
                        params['amount'] = amount;
                        params['price'] = price;
                        params['userId'] = token['userId'];

                        $.post(url, {params: JSON.stringify(params)}, function (result) {
                            // alert('返回结果： ' + result);
                            // {"data":{"msg":"添加购物车成功"},"success":true}
                            var resultObject = JSON.parse(result);
                            var msg = "商品加入购物车失败";
                            var res = false;
                            if (resultObject['success'] == true) {
                                msg = "商品加入购物车成功";
                                $target.html(amount);
                                $targetShow.show();
                            }

                            confirmResult(msg);
                        });

                    } else {
                        alert('该商品库存不足，请选购其他商品');
                    }
                } else {
                    alert('您还没有登录，请登录购物');
                    // window.location.href='userLogin';
                }
            }
        });

        // 减少商品数量
        $('.cm-col-5-cart-minus').on({
            click: function () {
                if (epm.getLocalItem(epm.k.USER_NAME) !== null) {
                    var $target = $(this).parents('.cm-col-5-cart').find('.cm-col-5-cart-num'),
                        $targetShow = $(this).siblings('.cart-num-null'),
                        max = $target.attr('stock-amount'),
                        cartId = $target.attr('cartid'), amount, url;
                    if (amount == 0) {
                        url = "cart/removeCart";
                        amount = 0;
                    } else {
                        url = 'cart/updateCart';
                        amount = parseInt($target.text()) - 1;
                    }

                    console.log(parseInt($target.text()));
                    if (amount <= max || max == -1) {
                        var goodsId = $target.attr('goodsid'),
                            goodsName = $target.attr('goods-name'),
                            price = $target.attr('price');
                        var token = JSON.parse(epm.getLocalItem(epm.k.USER_NAME));
                        var params = {};
                        params['cartId'] = cartId;
                        params['goodsId'] = goodsId;
                        params['name'] = goodsName;
                        params['amount'] = amount;
                        params['price'] = price;
                        params['userId'] = token['userId'];

                        $.post(url, {params: JSON.stringify(params)}, function (result) {
                            // alert('返回结果： ' + result);
                            // {"data":{"msg":"添加购物车成功"},"success":true}
                            var resultObject = JSON.parse(result);
                            var msg = "商品加入购物车失败";
                            var res = false;
                            if (resultObject['success'] == true) {
                                msg = "商品加入购物车成功";
                                $target.html(amount);
                                $targetShow.show();
                            }

                            confirmResult(msg);
                        });

                    } else {
                        alert('该商品库存不足，请选购其他商品');
                    }
                } else {
                    alert('您还没有登录，请登录购物');
                    // window.location.href='userLogin';
                }
            }
        });

    });


}
function confirmResult(msg) {
    var r = confirm(msg);
    if (r == true) {
        window.location.reload();
    }
}
function initDataList() {

    // epm.ajax(params, function(result) {

    var $dataList = $('.cm-list'),
        $load = $('.load-text'),
        $dataItem = $('.cm-col-5');

    var html = '';
    var shopId, goodsId, goodsName, goodsSpec, shopName, price, cartId, cartAmount,
        stockAmount, imgURL, isBuyerLike, likeIcon, star, score, starHtml, goodsAttr;
    // $.each(result['data'], function(index, value) {


    shopId = 'shop_iid';
    goodsId = 'goods_iid';
    goodsName = 'goods_name';
    goodsSpec = "500g";
    goodsAttr = 5898;
    shopName = 101;
    price = 52.0;
    cartId = 2225;
    cartAmount = 2;
    stockAmount = 5;
    imgURL = 1;
    isBuyerLike = 1;
    likeIcon = isBuyerLike == '&#xe606;';

    star = 5;
    score = 7;
    starHtml = '';
    while (star > 0) {
        if (score > 0) {
            starHtml += '<i class="iconfont star">&#xe615;</i>';
            score--;
        } else {
            starHtml += '<i class="iconfont star">&#xe62c;</i>';
        }
        star--;
    }

    html += '<li class="cm-col-5">'
        + '<a href="goods_detail.html?shopiid=' + shopId + '&goodsiid=' + goodsId + '">'
        + '<img src="' + imgURL + '">'
        + '<div class="cm-col-5-info">'
        + '<h3 class="cm-col-5-info-name">' + goodsName + '</h3>'
        + '<div class="clearfix">'
        + '<p class="cm-col-5-stall goods-spec">' + goodsSpec + '</p>'
        + ( epm.isEmpty(goodsAttr) ? '' : '<p class="cm-col-5-stall goods-attr">' + goodsAttr + '</p>')
        + '</div>'
        + '<p class="cm-col-5-stall">' + shopName + '</p>'
        + '<p class="cm-col-5-goods-price">￥' + price + '</p></div></a>'

        + '<span class="cm-col-5-cart">'
        + '<span class="cart-num-null"'
        + (cartAmount == 0 ? ' style="display:none" ' : '')
        + '>'
        + '<i class="cm-col-5-cart-minus iconfont">&#xe629;</i>'
        + '<i class="cm-col-5-cart-num" shopiid="' + shopId + '" goodsiid="'
        + goodsId + '" stock-amount="' + stockAmount
        + '" cart-amount="' + cartAmount + '" cartiid="' + cartId + '">' + cartAmount + '</i></span>'
        + '<i class="cm-col-5-cart-plus iconfont">&#xe623;</i></span>'

        + '<div class="cm-col-5-goods-top">'
        + '<div class="cm-bar"><span>' + starHtml + '</span>'
        + '<span class="cm-collect">'
        + '<span class="cm-collect-success">收藏成功</span>'
        + '<i class="iconfont cm-collect-icon star" data-is-like=' + isBuyerLike + '>' + likeIcon + '</i>'
        + '</span></div></div></li>';
    // });

    var dataItemHeight = $dataItem.outerHeight(true);

    $dataList.append(html).height(dataItemHeight * Math.ceil($dataList.find('li').length / 5)).find('li').hover(
        function () {
            $(this).find('.cm-col-5-goods-top').show();
        },
        function () {
            $(this).find('.cm-col-5-goods-top').hide();
        }
    );

    // // 减少商品数量
    // $('.cm-col-5-cart-minus').on({
    //     click: function() {
    //         var $target = $(this).siblings('.cm-col-5-cart-num'),
    //             $targetNull = $(this).parent(),
    //             amount = parseInt($target.text()) - 1,
    //             cartId = $target.attr('cartiid');
    //
    //         if (amount == 0 && cartId != 0) {
    //             epm.b.removeCart(cartId, function(data) {
    //                 $target.text(amount).attr('cartiid', 0);
    //                 $targetNull.hide();
    //                 epm.b.removeSelectedCart(parseInt(cartId));
    //             });
    //         } else if (amount > 0) {
    //             var shopId = $target.attr('shopiid'),
    //                 goodsId = $target.attr('goodsiid');
    //             epm.b.setCart(shopId, goodsId, amount, function(data) {
    //                 $target.text(amount).attr('cartiid', data['data']);
    //                 epm.b.addSelectedCart(parseInt(data['data']));
    //             });
    //         }
    //
    //     }
    // });
    //  });

}

