/* Copyright (C) 2016
 * This file is part of the Epiphyllum B7 System.
 *
 * filename : order_submit
 * function :
 * action   :
 * version  : 7.1
 * author   : lindan
 * date     : 2017-02-07
 * modify   : 
 */
function pageInit() {
    // eventTrigger();
    initOrderList();

    $('.ct-pay-btn').on({
        click: function () {
            window.location.href='orderFinish';
        }
    });
}

/**
 * 初始化订单列表
 */
function initOrderList() {

    var html = '';

    html
        = '<div class="od-ground"><div class="od-stall">value[shop_name]</div>'
        + '<ul class="od-list od-cn-list">'
        + '<li class="od-goods-img"><img src="epm.v.imageURLPrefix + valueimage_ur"></li>'
        + '<li class="od-goods-info">goodsname</li>'
        + '<li>goods_spec</li>'
        + '<li>￥valuprice1</li><li>value[goods_amount]</li>'
        + '<li>￥Math.round(value[price1] * value[goods_amoun] * 100) / 100</li></ul></div>';

    $('.od-content').append(html);

    $('#goodsAmount').html('goodsAmount');
    $("#goodsTotal").html('goodsTotal');
    $('.od-should-pay').html('￥ should');
    $('#postPrice').html('￥postPrice');
    $('.od-free-delivery').html('免费配送');

}

/**
 * 已有订单编号 获取订单详情
 */
function getOrderPayInfo() {
    var html = '';
    var params = {};
    params['action'] = 'get_order_info';
    params['order_sid'] = epm.getUrlParam('order_sid');
    epm.ajax(params, function (result) {
        if (result.ans == 'ok') {

            // 获取订单的商品列表
            var shopArr = [];
            var shopIids = [];

            $.each(result.data['goods'], function (key, value) {
                if ('' == PAY_TITLE) {
                    PAY_TITLE = value['goods_name'];
                }
                if (shopIids.indexOf(value['shop_iid']) == -1) {
                    shopIids.push(value['shop_iid']);
                    shopArr['shop_iid_' + value['shop_iid']]
                        = '<div class="od-ground"><div class="od-stall">' + value['shop_name'] + '</div>'
                        + '<ul class="od-list od-cn-list">'
                        + '<li class="od-goods-img"><img src="' + epm.v.imageURLPrefix + value['image_url'] + '"></li>'
                        + '<li class="od-goods-info">' + value['goods_name'] + '</li>'
                        + '<li>' + value['goods_spec'] + (null == value['goods_attr1'] ? '' : ' / ' + value['goods_attr1'] ) + '</li>'
                        + '<li>￥' + epm.getMoney(value['goods_price'] / value['goods_amount']) + '</li><li>' + value['goods_amount'] + '</li>'
                        + '<li>￥' + epm.getMoney(value['goods_price']) + '</li></ul></div>';
                } else {
                    shopArr['shop_iid_' + value['shop_iid']]
                        += '<ul class="od-list od-cn-list">'
                        + '<li class="od-goods-img"><img src="' + epm.v.imageURLPrefix + value['image_url'] + '"></li>'
                        + '<li class="od-goods-info">' + value['goods_name'] + '</li>'
                        + '<li>' + value['goods_spec'] + '</li>'
                        + '<li>￥' + epm.getMoney(value['goods_price'] / value['goods_amount']) + '</li>'
                        + '<li>' + value['goods_amount'] + '</li>'
                        + '<li>￥' + epm.getMoney(value['goods_price']) + '</li></ul></div>';
                }
            });
            $.each(shopIids, function (key, value) {
                html += shopArr['shop_iid_' + value];
            });
            $('.od-content').append(html);


            //    留言
            $('.leave-word-input').attr('disabled', true).val(epm.isEmpty(result.data['buyer_remark']) ? '无' : '留言：' + result.data['buyer_remark']);

            //    使用代金券 总计等
            if (epm.isEmpty(result.data['used_ticket_name'])) {
                $("#discountTips").remove();
                $('.discount-price').html(0);
            } else {
                USED_TICKET_SID = result.data['used_ticket_sid'];
                $('.discount-price').html(result.data['used_ticket_price']);
                $('#discountTips').html(result.data['used_ticket_name']);
            }

            ORDER_PRICE = result.data['order_price'];
            $('#goodsAmount').html(result.data['goods_amount']);
            $('#goodsTotal').html('￥' + result.data['goods_price']);
            $('#postPrice').html('￥' + result.data['post_price']);
            $('.od-free-delivery').html(result.data['post_price'] == 0 ? '免费配送' : result.data['post_price'] + '元配送费');

            $('.od-should-pay').html('￥' + ORDER_PRICE);
            $('.wallet-price span').html('￥' + ORDER_PRICE);

        }
    });
}

/**
 *  触发事件
 */
function eventTrigger() {

    var $cmShade = $('.cm-shade'),
        $addrReviseModalAdd = $('.addr-add-modal'),
        $changeModal = $('.change-modal'),
        $walletModal = $(".wallet-window"),
        $wechatModal = $('.wechat-pay-code');


    //内容变动
    $('.revise-input').on('input propertychange', function () {
        $('.save-btn').addClass('cm-btn-active');
    });

    $('.wallet-password').on('input propertychange', function () {
        if ($('.wallet-password').val().length == 0) {
            $('.wallet-submit-btn').removeClass('cm-btn-active');
        } else {
            $('.wallet-submit-btn').addClass('cm-btn-active');
        }
    });

    // 支付方式选择
    $('.case-pay').click(function () {
        if ($(this).hasClass('case-must-not')) {
            return;
        }
        $('.case-pay').removeClass('case-selected');
        $(this).addClass('case-selected');
    });

    //钱包支付 ---确认支付
    $('.wallet-submit-btn').click(function () {
        var params = {};
        if ($(this).hasClass('cm-btn-active')) {
            //校验密码
            params['action'] = 'check_pay_pwd';
            params['buyer_pay_pwd'] = $('.wallet-password').val();
            epm.ajax(params, function (result) {
                if ('ok' == result.ans) {

                    if (epm.isEmpty(epm.getUrlParam('cartiid'))) {
                        //完成订单 已有订单编号
                        var params = {};
                        params['action'] = 'pay_finish';
                        params['order_sid'] = epm.getUrlParam('order_sid');
                        params['pay_way'] = 4;
                        params['pay_sid'] = epm.getUrlParam('order_sid');
                        params['pay_price'] = ORDER_PRICE;
                        epm.ajax(params, function (result_info) {
                            if ('ok' == result_info.ans) {
                                window.location.href = 'pay_finish.html?out_trade_no=' + epm.getUrlParam('order_sid');
                            }
                        });
                    } else {
                        // 判断 还没有生成支付订单
                        var params = payAfter(4);
                        epm.ajax(params, function (result) {
                            if ('ok' == result.ans) {
                                params['action'] = 'pay_finish';
                                params['order_sid'] = result.order_sid;
                                params['pay_way'] = 4;
                                params['pay_sid'] = result.order_sid;
                                params['pay_price'] = ORDER_PRICE;
                                epm.ajax(params, function (result_info) {
                                    if ('ok' == result_info.ans) {
                                        window.location.href = 'pay_finish.html?out_trade_no=' + result.order_sid;
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });

    //去支付
    $('.ct-pay-btn').click(function () {

        if (IS_ALLOW_ISSUE == 0
            && $('.delivery-method').find('.case-selected').attr('data-value') == 0) {
            alert('当前地址不在配送范围内');
            return;
        }

        var cls = $('.delivery-pay').find('.case-selected').find('i');
        if (cls.hasClass('i-wallet')) {
            //我的钱包
            //输入密码框弹窗
            $cmShade.fadeIn(200);
            $walletModal.slideDown(200);
            $('.wallet-info span').html('￥' + ORDER_PRICE);
        } else if (cls.hasClass('i-alipay')) {
            //支付宝
            if (epm.isEmpty(epm.getUrlParam('cartiid'))) {
                // 判断已有订单编号
                var payParams = {};
                payParams['action'] = 'pc_pay';
                payParams['mode'] = 'alipay';
                payParams['order_sid'] = epm.getUrlParam('order_sid');
                payParams['pay_price'] = ORDER_PRICE;
                payParams['pay_title'] = PAY_TITLE;
                payParams['pay_style'] = 'pay';
                epm.ajax(payParams, function (result) {
                    if ('ok' == result.ans) {
                        window.location.href = result.pay_url;
                    }
                })
            } else {
                // 首次生成订单
                var params = payAfter(2);
                epm.ajax(params, function (result) {
                    if ('ok' == result.ans) {
                        //发起支付
                        var payParams = {};
                        payParams['action'] = 'pc_pay';
                        payParams['mode'] = 'alipay';
                        payParams['order_sid'] = result.order_sid;
                        payParams['pay_price'] = ORDER_PRICE;
                        payParams['pay_title'] = PAY_TITLE;
                        payParams['pay_style'] = 'pay';
                        epm.ajax(payParams, function (result) {
                            if ('ok' == result.ans) {
                                window.location.href = result.pay_url;
                            }
                        })
                    }
                });
            }

        } else if (cls.hasClass('i-wechat')) {
            //微信支付
            if (epm.isEmpty(epm.getUrlParam('cartiid'))) {
                // 已有订单编号
                $("#wechat-code").attr('src', 'http://t-web.3pzs.com/app/wechat_code_url.php?pay_title=' + PAY_TITLE
                    + "&order_sid=" + epm.getUrlParam('order_sid') + "&pay_price=" + ORDER_PRICE + "&goods_iid=1&attach=pay");
                $cmShade.fadeIn(200);
                $wechatModal.slideDown(200);
                TIMER = setInterval(function () {
                    getWxPayResult(epm.getUrlParam('order_sid'));
                }, 3000);
            } else {
                // 首次生成订单
                var params = payAfter(1);
                epm.ajax(params, function (result) {
                    if ('ok' == result.ans) {

                        $("#wechat-code").attr('src', 'http://t-web.3pzs.com/app/wechat_code_url.php?pay_title=' + PAY_TITLE
                            + "&order_sid=" + result.order_sid + "&pay_price=" + ORDER_PRICE + "&goods_iid=1&attach=pay");
                        $cmShade.fadeIn(200);
                        $wechatModal.slideDown(200);
                        TIMER = setInterval(function () {
                            getWxPayResult(result.order_sid);
                        }, 3000);
                    }
                });
            }
        }

    });

    //关闭密码弹窗
    $('.i-close-btn').click(function () {
        $cmShade.fadeOut(200);
        $walletModal.slideUp(200);
        $('.wallet-password').val('');
        $('.wallet-submit-btn').removeClass('cm-btn-active');
        window.location.reload();
    });

}

/**
 *  拼装params，请求参数的内容
 * @param pay_way
 * @returns {{}}
 */
function payAfter(pay_way) {
    var order_sid = '';
    var params = {};
    params['action'] = 'pay_after';
    params['market_iid'] = epm.c.market['market_iid'];
    params['cart'] = epm.getUrlParam('cartiid').split(',');
    params['issue_tag'] = $('.delivery-method').find('.case-selected').attr('data-value');
    params['address_row_iid'] = $('.os-addr-list').find('.case-selected').attr('row_iid');
    params['source_tag'] = 4;
    params['pay_way'] = pay_way;
    params['issue_time_range_iid'] = $('.delivery-time-select').val();
    params['used_ticket_sid'] = USED_TICKET_SID;
    params['buyer_remark'] = replaceIllegalStr($('.leave-word-input').val());
    return params;
}


/**
 * 轮训访问数据库获取微信订单支付状态
 */
function getWxPayResult(order_sid) {
    var params = {};
    params['action'] = 'get_order_info';
    params['order_sid'] = order_sid;
    epm.ajax(params, function (result) {
        if (result.ans == 'ok' && result.data['state_tag'] > 0) {
            clearInterval(TIMER);
            window.location.href = 'pay_finish.html?out_trade_no=' + order_sid;
        }
    });
}



