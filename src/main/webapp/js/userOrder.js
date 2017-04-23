/* Copyright (C) 2016
 * This file is part of the Epiphyllum B7 System.
 *
 * filename : order_list
 * function :
 * action   :
 * version  : 7.1
 * author   : xx
 * date     : 2017-03-06
 * modify   :
 */
var ORDER_TAG = -1;      // 待付款已付款等所在位置
var THIS_OFFSET = 0;
var THIS_ROWS = 10;

function pageInit() {
    //获取所有订单
    // getOrder(-1, 0, 10, '');
    // initHeadImg();
}

/**
 * 翻页
 * @param action
 */
function flip(action) {
    if ('pre' == action) {
        //上一页
        if (THIS_OFFSET == 0) {
            return;
        }
        THIS_OFFSET -= 10;
    } else if ('next' == action) {
        //下一页
        THIS_OFFSET += 10;
    }
    getOrder(ORDER_TAG, THIS_OFFSET, THIS_ROWS);
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
 * 获取商品图片
 * @param goodList 获取商品列表
 * @param sid
 * @returns {string}
 */
function getGoodsImg(goodList, sid) {
    var returnHtml = '';
    var length = goodList.length > 2 ? 3 : goodList.length;
    for (var i = 0; i < length; i++) {
        returnHtml += '<a href="order_detail.html?sid=' + sid + '">'
            + '<img src="' + epm.v.imageURLPrefix + goodList[i]['image_url'] + '">'
            + '</a>';
    }
    return returnHtml;
}

/**
 * 再来一单
 * @param sid：订单号
 */
function rebuy(sid) {
    var params = {};
    params['action'] = 'get_order_info';
    params['order_sid'] = sid;
    //校验市场
    epm.ajax(params, function(result) {
        if (result.ans == 'ok') {
            var market_iid = result.data['market_iid'];
            if (epm.c.market['market_iid'] != market_iid) {
                alert('订单所在市场与当前市场不一致，请切换市场。');
                return;
            }
            //再来一单接口调用
            params = {};
            params['action'] = 'rebuy_order';
            params['order_sid'] = sid;
            epm.ajax(params, function(result) {
                if ('ok' == result.ans) {
                    var cardiids = '';
                    $.each(result.data, function(key, value) {
                        cardiids += value['cart_iid'] + ',';
                        epm.b.addSelectedCart(value['cart_iid']);
                    });
                    window.location.href = 'cart.html?cartiid=' + cardiids.substr(0, cardiids.length - 1);
                }
            });
        }
    });
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
        if ('ok' == result.ans) {
            window.location.reload();
        }
    });
}

/**
 * 显示状态按钮
 * @param stateTag 订单状态
 * @param stateTag2 stateTag2==0还未扯标签前退货按钮显示
 * @param backTag 退货状态
 * @param orderSid 订单编号
 *  @param isAllowComment 是否允许评价
 * @returns {string}
 */
function getAction(stateTag, stateTag2, backTag, orderSid, isAllowComment) {
    var ret = '';
    switch (stateTag) {
        case 0:
            ret += '<a href="javascript:void(0);" onclick="pay(\'' + orderSid + '\')">去支付</a>'
                + '<a href="javascript:void(0);" onclick="cancelOrder(\'' + orderSid + '\')">取消订单</a>';
            break;
        case 1:
            if (stateTag2 == 0 && backTag == 0) {
                ret += '<a href="javascript:void(0);" onclick="salesReturn(\'' + orderSid + '\')">退货</a>';
            } else {
                ret += '<a href="javascript:void(0);" onclick="rebuy(\'' + orderSid + '\')">再来一单</a>';
            }
            break;
        case 2:
        case 5:
            ret += '<a href="javascript:void(0);" onclick="rebuy(\'' + orderSid + '\')">再来一单</a>';
            break;
        case 3:
            ret += '<a href="comment.html?sid=' + orderSid + '">评价</a>'
                + '<a href="javascript:void(0);" onclick="rebuy(\'' + orderSid + '\')">再来一单</a>';
            break;
        case 4:
            if (isAllowComment == 1) {
                ret += '<a href="comment.html?sid=' + orderSid + '">评价</a>'
                    + '<a href="javascript:void(0);" onclick="rebuy(\'' + orderSid + '\')">再来一单</a>';
            } else if (isAllowComment == 0) {
                ret += '<a href="javascript:void(0);" onclick="rebuy(\'' + orderSid + '\')">再来一单</a>';

            }

            break;
        default:
            break;
    }
    return ret;
}

/**
 * 获取订单列表
 * @param state 订单状态
 * @param offset
 * @param rows
 * @param orderSid
 * @param action
 */
function getOrder(state, offset, rows, orderSid, action) {

    ORDER_TAG = state;
    THIS_OFFSET = offset;
    $('.om-status-item').removeClass('om-status-selected');
    $('.state' + state).addClass('om-status-selected');
    var html = '',
        params = {};
    params['action'] = 'get_order_list';
    params['state_tag'] = state;
    params['offset'] = offset;
    params['rows'] = rows;
    if ('' != orderSid) {
        params['order_sid'] = orderSid;
    }
    epm.ajax(params, function(result) {

        if (result.ans != 'ok') {
            return;
        }

        //无数据是展示提示
        if (epm.isEmpty(result['data'][0])) {
            if (action == 'search') {
                $('.cm-list').html('');
                $('.search-empty').show();
            } else {
                if (offset > 0) {
                    THIS_OFFSET -= 10;
                    return;
                }
                $('.cm-list').html('');
                $('.state-empty').show();
            }
            return;
        } else {
            $('.cm-empty').hide();
        }
        $('.cm-list').html('');

        $.each(result['data'], function(index, value) {
            html += '<div class="om-status-cont">'
                + '<div class="om-group">'
                + '<div class="om-num-title">'
                + '<span class="om-num-time">下单时间：'
                + epm.getDateTime(value['create_time'])
                + '</span>'
                + '<a class="om-num" href="order_detail.html?sid=' + value['order_sid'] + '">订单号：'
                + value['order_sid']
                + '</a>'
                + '<a class="om-num-detail" href="order_detail.html?sid=' + value['order_sid'] + '">查看详情</a>'
                + '</div>'
                + '<ul class="om-num-row">'
                + '<li class="om-img-item">'
                + '<div class="om-img-box">'
                //获取商品图片
                + getGoodsImg(value['goods'], value['order_sid'])
                + '</div>'
                + '<p class="om-piece">共' + value['goods_amount'] + '件商品</p>'
                + '</li>'
                + '<li>'
                + '<p class="om-num-prices">￥'
                + value['order_price']
                + '</p>'
                + '</li>'
                + '<li class="om-status-cont-item">'
                + '<p class="om-num-status">'
                //获取订单状态
                + getState(value['state_tag'], value['back_tag'])
                + '</p>'
                + '</li>'
                + '<li class="om-btn-item">'
                + '<div class="om-btn-tow">'

                + getAction(value['state_tag'], value['state_tag2'], value['back_tag'], value['order_sid'], value['is_allow_comment'])

                + '</div></li></ul></div>';
        });
        $('.cm-list').append(html);
    });
}

/**
 * 搜索
 */
$('.order-search').on({
    input: function() {
        var searchLength = replaceIllegalStr($('.order-search').val()).length;
        if (searchLength > 0) {
            $('.order-search-btn').addClass('order-search-active');
        } else {
            $('.order-search-btn').removeClass('order-search-active');

        }
    },
    keydown: function(e) {
        if (e.keyCode == 13) {
            $('.order-search-btn').click();
        }
    }

});

$('.order-search-btn').on('click', function() {
    var searchContent = $('.order-search').val();
    if (searchContent == '') {
        alert('请输入订单号');
        return;
    }
    getOrder(-1, 0, 10, searchContent, 'search');
});

