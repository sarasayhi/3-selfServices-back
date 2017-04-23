/* Copyright (C) 2016
 * This file is part of the Epiphyllum B7 System.
 *
 * filename : order_detail
 * function :
 * action   :
 * version  : 7.1
 * author   : xx
 * date     : 2017-02-08
 * modify   :
 */

var ORDER_SID;//订单编号

function pageInit() {
    // ORDER_SID = epm.getUrlParam('sid');
    // initOrder(ORDER_SID);
    // initUdService();
    // initHeadImg();

}

/**
 * 初始化ud
 */
function initUdService() {
    var data = [];
    data['c_cf_订单编号'] = ORDER_SID;
    _ud.initUD('客服在线', '客服不在线', '.service', data);
}

/**
 * 再来一单
 * @param sid
 */
function rebuy() {
    var params = {};
    params['action'] = 'get_order_info';
    params['order_sid'] = ORDER_SID;
    //校验市场
    epm.ajax(params, function(result) {
        if (result.ans == 'ok') {
            var market_iid = result.data['market_iid'];
            if (epm.c.market['market_iid'] != market_iid) {
                alert('订单所在市场与当前市场不一致，请切换市场。');
                return;
            }
        }
        params = {};
        params['action'] = 'rebuy_order';
        params['order_sid'] = ORDER_SID;
        epm.ajax(params, function(result) {
            if ('ok' == result.ans) {
                var cardiids = '';
                $.each(result.data, function(key, value) {
                    cardiids += value['cart_iid'] + ',';
                    epm.b.addSelectedCart(value['cart_iid']);
                });
                window.location.href = 'cart.html?data-cartiid=' + cardiids.substr(0, cardiids.length - 1);
            }
        });
    })
}

/**
 * 去支付
 * @param orderSid 订单编号
 */
function pay(orderSid) {
    var params = {};
    params['action'] = 'check_order';
    params['order_sid'] = orderSid;
    epm.ajax(params, function(result) {
        if ('ok' == result.ans) {

            window.location.href = 'order_submit.html?order_sid=' + orderSid;
        }
    });

}

/**
 * 取消订单
 * @param orderSid
 */
function cancelOrder(orderSid) {
    //获取订单商品数据
    var params = {};
    params['action'] = 'cancel_order';
    params['order_sid'] = orderSid;
    epm.ajax(params, function(result) {
        if ('ok' == result.ans) {
            window.location.reload();
        }
    });
}

/**
 * 退货
 * @param returnSid
 */
function salesReturn(returnSid) {
    var params = {};
    params['action'] = 'apply_back';
    params['order_sid'] = returnSid;
    epm.ajax(params, function(result) {
        if (result.ans == 'ok') {
            window.location.reload();
        }
    });
}

/**
 * 获取订单明细
 * @param orderSid
 */
function initOrder(orderSid) {
    $('#orderSid').html(orderSid);

    var params = {};
    params['action'] = 'get_order_info';
    params['order_sid'] = orderSid;
    document.title = '订单管理-订单号' + orderSid;
    epm.ajax(params, function(result) {

        if (result.ans != 'ok') {
            return;
        }
        document.title = '订单管理-订单号' + orderSid;
        var orderData = result.data,
            $cmBuyerRemark = $('.cm-buyer-remark');
        //初始化订单信息
        if (epm.isEmpty(orderData['buyer_remark'])) {
            $cmBuyerRemark.html('无');
        } else {
            $cmBuyerRemark.html(orderData['buyer_remark']);
        }
        $('.order-id').html('订单号：' + orderSid);
        $('.order-time').html('下单时间：' + epm.getDateTime(orderData['create_time']));
        $('.order-state').html(getState(orderData['state_tag'], orderData['back_tag']));
        $('.cm-buyer-name').html(orderData['buyer_name']);
        $('.cm-buyer-mobile').html(orderData['buyer_mobile']);
        $('.cm-buyer-address').html(orderData['buyer_address']);
        $('.cm-issue-tag').html(orderData['issue_tag'] == 1 ? '自提' : '送货上门');
        $('.cm-issue-time').html(orderData['issue_time_range_name']);
        $('.goods-amount').html(orderData['goods_amount']);
        $('.goods-price').html('￥' + orderData['goods_price']);
        $('.post-price').html('￥' + (orderData['post_price'] > 0 ? orderData['post_price'] : 0));
        $('.distinct-price').html('￥' + (orderData['used_ticket_price'] > 0 ? orderData['used_ticket_price'] : 0));
        $('.od-should-pay').html('￥' + orderData['order_price']);
        $('#pickedUpAddr').html(orderData['issue_address']);
        $('#pickedLinkPhone').html(orderData['issue_mobile']);

        if (orderData['issue_tag'] == 1) {
            $('.od-picked-up').show();
            $('.od-receipt').hide();
        } else {
            $('.od-receipt').show();
            $('.od-picked-up').hide();
        }

        getAction(orderData['state_tag'], orderData['state_tag2'], orderData['back_tag'], orderData['is_allow_comment']);

        var i = 0,
            shopIids = '',
            arr = {},
            goodsList = orderData.goods,
            goodsHtml = '';

        /**
         * 初始化商品信息
         * 根据门店分组
         */
        for (i = 0; i < goodsList.length; i++) {
            if (shopIids.indexOf(goodsList[i]['shop_iid']) == -1) {
                arr[goodsList[i]['shop_iid']] = '<div class="od-ground">'
                    + '<div class="od-stall"><a href="shop_detail.html?shopiid=' + goodsList[i]['shop_iid']
                    + '">' + goodsList[i]['shop_name'] + '</a></div>'
                    + '<ul class="od-list od-cn-list od-details-list">'
                    + '<li class="od-goods-img">'
                    + '<a href="goods_detail.html?shopiid=' + goodsList[i]['shop_iid'] + '&goodsiid=' + goodsList[i]['goods_iid'] + '">'
                    + '<img src="' + epm.v.imageURLPrefix + goodsList[i]['image_url'] + '"></a>'
                    + '</li>'

                    + '<li class="od-goods-info">'
                    + '<a href="goods_detail.html?shopiid=' + goodsList[i]['shop_iid'] + '&goodsiid=' + goodsList[i]['goods_iid'] + '">'
                    + goodsList[i]['goods_name'] + '</a>'
                    + '<br>'
                    + goodsList[i]['goods_spec']
                    + (epm.isEmpty(goodsList[i]['goods_attr1']) ? '' : '/' + goodsList[i]['goods_attr1'])
                    + '<li>'
                    + '￥'
                    + goodsList[i]['goods_price'] / goodsList[i]['goods_amount']
                    + '</li>'
                    + '<li>'
                    + goodsList[i]['goods_amount']
                    + '</li>'
                    + '<li>'
                    + '￥'
                    + goodsList[i]['goods_price']
                    + '</li>'
                    + '</ul>';
                shopIids += goodsList[i]['shop_iid'] + ',';
            } else {
                arr[goodsList[i]['shop_iid']] += '<ul class="od-list od-cn-list od-details-list">'
                    + '<li class="od-goods-img">'
                    + '<img src="' + epm.v.imageURLPrefix + goodsList[i]['image_url'] + '">'
                    + '</li>'
                    + '<li class="od-goods-info">'
                    + goodsList[i]['goods_name']
                    + '<br>'
                    + goodsList[i]['goods_spec']
                    + (epm.isEmpty(goodsList[i]['goods_attr1']) ? '' : '/' + goodsList[i]['goods_attr1'])
                    + '</li>'
                    + '<li>'
                    + '￥'
                    + goodsList[i]['goods_price'] / goodsList[i]['goods_amount']
                    + '</li>'
                    + '<li>'
                    + goodsList[i]['goods_amount']
                    + '</li>'
                    + '<li>'
                    + '￥'
                    + goodsList[i]['goods_price']
                    + '</li>'
                    + '</ul>';
            }
        }

        var shopArr = shopIids.substr(0, shopIids.length - 1).split(',');
        for (i = 0; i < shopArr.length; i++) {
            arr[shopArr[i]] += '</div>';
            goodsHtml += arr[shopArr[i]];
        }
        $('.od-content').html(goodsHtml);
    });
}

/**
 * 转换订单状态
 * @param stateTag 订单状态
 * @param backTag 退货状态
 * @returns {string}
 */
function getState(stateTag, backTag) {
    var ret = '';
    switch (stateTag) {
        case 0:
            ret = '待付款';
            break;
        case 1:
            if (backTag == 0) {
                ret = '已付款';
            } else if (backTag == 1) {
                ret = '正在申请退货';
            } else if (backTag == 2) {
                ret = '退货成功';
            } else if (backTag == 3) {
                ret = '退货失败';
            }
            break;
        case 2:
            ret = '配送中';
            break;
        case 3:
        case 4:
            ret = '已完成';
            break;
        case 5:
            ret = '已取消';
            break;
        default:
            ret = '未知';
            break;
    }
    return ret;
}

/**
 *  显示状态按钮
 * @param stateTag 订单状态
 * @param stateTag2 stateTag2==0还未扯标签前退货按钮显示
 * @param backTag 退货状态
 * @param isAllowComment 是否允许评价
 */
function getAction(stateTag, stateTag2, backTag, isAllowComment) {
    var ret = '';
    switch (stateTag) {
        case 0:
            ret += '<a href="javascript:void(0);" onclick="pay(\'' + ORDER_SID + '\')">去支付</a>'
                + '<a href="javascript:void(0);" onclick="cancelOrder(\'' + ORDER_SID + '\')">取消订单</a>';
            break;
        case 1:
            // 显示退货按钮
            if (stateTag2 == 0 && backTag == 0) {
                ret += '<a href="javascript:void(0);" onclick="salesReturn(\'' + ORDER_SID + '\')">退货</a>';
            } else {
                ret += '<a href="javascript:void(0);" onclick="rebuy(\'' + ORDER_SID + '\')">再来一单</a>';
            }
            break;
        case 2:
        case 5:
            ret += '<a href="javascript:void(0);" onclick="rebuy()">再来一单</a>';
            break;
        case 3:
            ret += '<a href="comment.html?sid=' + ORDER_SID + '">评价</a>'
                + '<a href="javascript:void(0);" onclick="rebuy(\'' + ORDER_SID + '\')">再来一单</a>';
            break;
        case 4:
            if (isAllowComment == 1) {
                ret += '<a href="comment.html?sid=' + ORDER_SID + '">评价</a>'
                    + '<a href="javascript:void(0);" onclick="rebuy(\'' + ORDER_SID + '\')">再来一单</a>';
            } else if (isAllowComment == 0) {
                ret += '<a href="javascript:void(0);" onclick="rebuy(\'' + ORDER_SID + '\')">再来一单</a>';
            }

            break;
        default:
            break;
    }
    $('.od-status-r').html(ret);

}