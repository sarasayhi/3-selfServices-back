/* Copyright (C) 2017
 * This file is part of the Epiphyllum B7 System.
 *
 * filename : pay_finish
 * function :
 * action   :
 * version  : 7.1
 * author   : MarissaMan
 * date     : 2017-02-23
 * modify   :
 */

function pageInit() {
    seeInit();
    eventTrigger();
}

/**
 *  初始化 大家都在看
 */
function seeInit() {
    var params = {};
    params['action'] = 'get_hot_goods_list';
    params['market_iid'] = epm.c.market['market_iid'];

    epm.ajax(params, function(result) {

        if (result.ans != 'ok') {
            return;
        }

        // 大家都在看
        var html = '',
            goodsId, goodsName, shopId, price, imgURL;
        $.each(result.data, function(key, value) {

            if (epm.isEmpty(value)) {
                return;
            }

            goodsId = value['goods_iid'];
            goodsName = value['goods_name'];
            shopId = value['shop_iid'];
            price = value['price1'];
            imgURL = epm.v.imageURLPrefix + value['image_url'];

            html += '<li class="cm-grid-goods">'
                + '<a href="goods_detail.html?shopiid=' + shopId + '&goodsiid=' + goodsId + '"><img src="' + imgURL + '">'
                + '<p class="cm-grid-goods-name">' + goodsName + '</p>'
                + '<p class="cm-grid-goods-price">￥' + price + '</p></a></li>';

        });

        var contWidth = result.data.length / 4 * $('.cm-grid-md').width();
        $('.cm-grid').find('ul').css({width: contWidth}).append(html);
        if (result.data.length < 5) {
            $('.cm-grid-md').siblings().css('color', 'rgb(221, 221, 221)');
        }
        scroll();
    });

}

function eventTrigger() {
    // 点击跳转
    $('.bill-check').click(function() {
        window.location.href = 'order_detail.html?sid=' + epm.getUrlParam('out_trade_no');
    });
    $('.shopping').click(function() {
        window.location.href = 'index.html';
    });
}

function scroll() {
    var visualWidth = 1000,
        gridCur = 0,
        time = 500,
        $grid = $('.cm-grid-md ul');
    if ($grid.width() > visualWidth) {
        var gridMaxScroll = $grid.width() - visualWidth;

        $('.cm-grid-left').on({
            click: function() {
                if (gridCur >= -visualWidth && 0 > gridCur) {
                    gridCur = 0;
                    $grid.stop().animate({left: gridCur}, time);
                } else if (0 > gridCur) {
                    $grid.stop().animate({left: gridCur += visualWidth}, time);
                }

                $('.cm-grid-left,.cm-grid-right').css({color: "#82a542"});

                if (gridCur == 0) {
                    $('.cm-grid-left').css({color: "#ddd"});
                } else if (gridCur == -gridMaxScroll) {
                    $('.cm-grid-right').css({color: "#ddd"});
                }
            }
        });

        $('.cm-grid-right').on({
            click: function() {
                if (gridCur >= visualWidth - gridMaxScroll) {
                    $grid.stop().animate({left: gridCur -= visualWidth}, time);
                } else {
                    gridCur = -gridMaxScroll;
                    $grid.stop().animate({left: gridCur}, time);
                }

                $('.cm-grid-left,.cm-grid-right').css({color: "#82a542"});

                if (gridCur == 0) {
                    $('.cm-grid-left').css({color: "#ddd"});
                } else if (gridCur == -gridMaxScroll) {
                    $('.cm-grid-right').css({color: "#ddd"});
                }
            }
        });
    }

}
