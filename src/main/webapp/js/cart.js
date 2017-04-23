/* Copyright (C) 2016
 * This file is part of the Epiphyllum B7 System.
 *
 * filename : cart
 * function :
 * action   :
 * version  : 7.1
 * author   : lindan
 * date     : 2017-01-11
 * modify   : MarissaMan
 */

var ORDER_GOODS_PRICE = 0;
var POST_PRICE = 0;

function pageInit() {
    initCartList();
    // eventTrigger();

    $('#settlement').on({
        click:function () {
            window.location.href='orderConfirm';
        }
    });
}

/**
 * 初始化购物车数据
 */
function initCartList() {
    var boolValue = false;
    var cartList = epm.c.cartList;
    if (epm.isEmpty(cartList)) {
        $('.ct-cont').hide().siblings('.cm-empty').show();
        return;
    }
    var html = '';
    var sortId, sortName;
    var cartId, goodsId,
        goodsName, amount, price, subtotal,
        stockAmount, spec, attr1, imgURL,
        isBuyerLike, likeIcon;
    $.each(cartList, function (goodsId, item) {
        // {"10253":{"amount":50,"cartId":5,"goodsId":10253,"name":"GRACO葛莱汽车儿童安全座椅增高垫4-12岁","price":438},
        //     "10254":{"amount":50,"cartId":7,"goodsId":10254,"name":"宝宝汽车儿童安全座椅","price":1980}}
        sortId = '101';
        sortName = 'yingliao';

        html += '<div class="ct-ground"><div class="ct-stall">'
            + '<input class="check-all check-normal" type="checkbox" title="全选" name="checkShop">'
            + '<a href="shop_detail.html?shopiid=' + sortId + '">' + sortName + '</a></div>';

        cartId = item['cartId'];
        goodsId = item['goodsId'];
        goodsName = item['name'];
        amount = item['amount'];
        price = item['price'];
        subtotal = epm.getMoney(price * amount);
        stockAmount = 50;
        spec = '规格 : ';
        attr1 =  '属性 : ';
        imgURL = epm.v.imageURLPrefix+'appleJuice.jpg';
        isBuyerLike = 1;
        likeIcon = isBuyerLike == 1 ? '&#xe606;' : '&#xe624;';

        html += '<ul class="ct-list ct-cn-list"  data-stock-amount="' + stockAmount
            + '" data-cartiid="' + cartId + '" data-shopiid="' + sortId
            + '" data-goodsiid="' + goodsId + '"><li class="ct-goods-img">'
            + '<input class="check-item '
            + (boolValue ? 'check-selected' : 'check-normal')
            + '" type="checkbox" name="checkItem"'
            + (boolValue ? 'checked="checked"' : "")
            + ' >'
            + '<a href="goods_detail.html?shopiid=' + sortId + '&goodsiid=' + goodsId + '"><img src="' + imgURL + '"></a></li>'
            + '<li class="ct-goods-info"><p class="ct-goods-name">'
            + '<a href="goods_detail.html?shopiid=' + sortId + '&goodsiid=' + goodsId + '">' + goodsName + '</a></p>'
            + '<p class="ct-goods-size">' + spec + '</p><p class="ct-goods-size">' + attr1 + '</p></li>'
            + '<li class="ct-price">￥<span class="unit-price">' + price + '</span></li>'
            + '<li class="cm-alter ct-alter"><div class="cm-num-alter"><span class="cm-less">-</span>'
            + '<input class="cm-num-input" type="text" name="goodsNum" title="数量" disabled="true" value="' + amount + '">'
            + '<span class="cm-add">+</span></div></li>'
            + '<li class="ct-count"><p class="ct-count-red">￥<span class="subtotal">' + subtotal + '</span></p></li>'
            + '<li class="ct-operate"><span class="cm-collect-success">收藏成功</span>'
            + '<i class="iconfont i-ct-like" data-isbuyerlike=' + isBuyerLike + '>' + likeIcon + '</i>'
            + '<i class="iconfont i-ct-delete">&#xe71f;</i></li></ul>';
        boolValue = false;

        html += '</div>';

        $('.ct-content').empty().append(html);
        updateState();
    });

}

/*
 *  删除单件商品事件
 */
function deleteClick() {

    var $cmShade = $('.cm-shade'),
        index,
        $addrDeleteModal = $(".one-delete-modal");

    //删除单件商品弹框
    $('.ct-content').on('click', '.i-ct-delete', function (e) {
        e.preventDefault();
        index = $(this).parents('.ct-cn-list').index();
        $('#oneConfirmBtn').data('cartiid', $(this).parents('.ct-cn-list').data('cartiid'));
        $cmShade.fadeIn('100');
        $addrDeleteModal.slideDown(200);
    });
    //确定删除单件商品按钮事件
    $('#oneConfirmBtn').on('click', function (e) {
        e.preventDefault();
        var params = {};
        params['action'] = 'remove_cart';
        params['cart_iid'] = $(this).data('cartiid');
        // epm.ajax(params, function(data) {
        //     window.location.reload();
        // });
    });
    //取消删除单件商品
    $('#oneCancelBtn').on('click', function (e) {
        e.preventDefault();
        $cmShade.fadeOut(100);
        $addrDeleteModal.slideUp(200);
        index = '';
    });

}

/**
 * 事件绑定
 */
function eventTrigger() {

    //结算按钮悬浮效果
    var $cont = $('.ct-content');
    var $ctTotal = $('.ct-total');

    if ($cont.offset().top + $cont.height() > $(window).height()) {
        $ctTotal.addClass('ct-total-fixed');
    }

    $(window).scroll(function () {
        var scrollValue = $(document).scrollTop(),
            fixHeight = $cont.offset().top + $cont.height() - $(window).height();

        scrollValue < fixHeight ? $ctTotal.addClass('ct-total-fixed') : $ctTotal.removeClass('ct-total-fixed');
    });

    // 全选
    $('.check-all').on({
        click: function () {

            var $target = $('input[name=checkItem]');

            if ($(this).hasClass('check-selected')) {

                $target.addClass('check-normal').removeClass('check-selected').prop('checked', false).removeAttr('checked');

            } else if ($(this).hasClass('check-normal')) {

                $target.addClass('check-selected').removeClass('check-normal').prop('checked', true).attr('checked', 'checked');

            }

            updateState();

        }
    });

    var $cmShade = $('.cm-shade'),
        $batchDeleteModal = $('.batch-delete-modal');
    // 批量删除
    $('.ct-batch-delete').on({
        click: function (e) {
            e.preventDefault();

            var cartIds = [];

            $('input[name=checkItem][checked=checked]').each(function () {
                var cartId = $(this).parents('.ct-list').attr('data-cartiid');
                cartIds.push(cartId);
            });

            if (!epm.isEmpty(cartIds)) {

                $cmShade.fadeIn('100');
                $batchDeleteModal.slideDown(200);

                $('#batchConfirmBtn').on('click', function () {
                    epm.b.removeCarts(cartIds, function () {
                        $('input[name=checkItem][checked=checked]').parents('.ct-list').each(function () {
                            $(this).remove();
                        });
                        updateState();
                    });
                    $cmShade.fadeOut('100');
                    $batchDeleteModal.slideUp(200);
                });

                $('#batchCancelBtn').on('click', function () {
                    $cmShade.fadeOut('100');
                    $batchDeleteModal.slideUp(200);
                });

            } else {
                alert('请选择需要删除的商品');
            }

        }
    });

    // 结算按钮
    $('.ct-pay-total-btn').on({
        click: function () {
            if (!$(this).hasClass('ct-pay-total-btn')) {
                return;
            }
            var market = epm.c.market;
            var begin_time = market['begin_time'];
            var end_time = market['end_time'];
            var now_time = new Date().getHours() * 60 + new Date().getMinutes();
            if (begin_time > now_time || end_time < now_time) {
                alert('市场已停止营业，请明天再下单');
                return;
            }
            var cartIds = [];
            $('input[name=checkItem][checked=checked]').each(function () {
                var cartId = $(this).parents('.ct-list').attr('data-cartiid');
                cartIds.push(cartId);
            });
            var params = {};
            params.action = 'pay_before';
            params.market_iid = epm.c.market['market_iid'];
            params.cart = cartIds;
            params.address_row_iid = '';
            params.used_ticket_sid = '';
            epm.ajax(params, function (result) {
                if (result.ans == 'ok') {
                    if (result['time_range'].length == undefined || result['time_range'].length == 0) {
                        alert('市场即将休息，请明天再下单');
                        return;
                    } else {
                        if ($(this).hasClass('must-not-click')) {
                            return;
                        }
                        if (!epm.isEmpty(cartIds)) {
                            window.location.href = 'order_submit.html?cartiid=' + cartIds;
                        } else {
                            alert('请选中需要结算的商品~');
                        }
                    }
                } else {
                    return;
                }
            });
        }
    });

    //删除单件商品事件绑定
    deleteClick();

    // 减少商品购物车数量
    $('.ct-content').on('click', '.cm-less', function () {
        var $target = $(this).parents('.ct-list');
        var shopId = $target.attr('data-shopiid');
        var goodsId = $target.attr('data-goodsiid');
        var unitPrice = epm.getMoney($target.find('.unit-price').text());
        var amount = parseInt($target.find('.cm-num-input').val()) - 1;
        var subtotal = epm.getMoney(unitPrice * amount);
        if (amount > 0) {
            epm.b.subCart(shopId, goodsId, function (result) {
                $target.find('.cm-num-input').val(amount);
                $target.find('.subtotal').text(subtotal);
                updateState();
            });
        }
    });
    // 增加商品购物车数量
    $('.ct-content').on('click', '.cm-add', function () {
        var $target = $(this).parents('.ct-list');
        var shopId = $target.attr('data-shopiid');
        var goodsId = $target.attr('data-goodsiid');
        var max = $target.attr('data-stock-amount');
        var unitPrice = epm.getMoney($target.find('.unit-price').text());
        var amount = parseInt($target.find('.cm-num-input').val()) + 1;
        var subtotal = epm.getMoney(unitPrice * amount);
        if (amount < max || max == -1) {
            epm.b.addCart(shopId, goodsId, 1, function (result) {
                $target.find('.cm-num-input').val(amount);
                $target.find('.subtotal').text(subtotal);
                updateState();
            });
        }
    });

    // 选中商品
    $('.ct-content').on('click', 'input[name=checkItem]', function () {
        var cartIID = $(this).parents('.ct-cn-list').attr('data-cartiid');
        if ($(this).hasClass('check-normal')) {//选中
            $(this).removeClass('check-normal').addClass('check-selected').prop('checked', true).attr('checked', 'checked');
            epm.b.addSelectedCart(parseInt(cartIID));
        } else if ($(this).hasClass('check-selected')) {//取消选中
            $('input[name=checkAll]').prop('checked', false);
            $(this).removeClass('check-selected').addClass('check-normal').prop('checked', false).attr('checked', false).removeAttr('checked');
            epm.b.removeSelectedCart(parseInt(cartIID));
        }
        updateState();
    });

    // 档口全选
    $('.ct-content').on('click', 'input[name=checkShop]', function () {
        var $target = $(this).parents('.ct-ground').find('input[name=checkItem]');
        if ($(this).hasClass('check-normal')) {
            $target.removeClass('check-normal').addClass('check-selected').prop('checked', true).attr('checked', 'checked');
        } else if ($(this).hasClass('check-selected')) {
            $target.removeClass('check-selected').addClass('check-normal').prop('checked', false).removeAttr('checked');
        }
        updateState();
    });

    // 收藏商品
    $('.ct-content').on('click', '.i-ct-like', function () {
        var $target = $(this).parents('.ct-list');
        var shopId = $target.attr('data-shopiid');
        var goodsId = $target.attr('data-goodsiid');
        var $tips = $target.find('.cm-collect-success');
        var state = $target.find('.i-ct-like').attr('data-isbuyerlike');
        if (state == 0) {
            epm.b.addGoodsLike(shopId, goodsId, function () {
                $tips.text('收藏成功').show().delay(500).fadeOut(300);
                $target.find('.i-ct-like').html('&#xe606;').attr('data-isbuyerlike', 1);
            });
        } else {
            epm.b.removeGoodsLike(shopId, goodsId, function () {
                $tips.text('取消收藏').show().delay(500).fadeOut(300);
                $target.find('.i-ct-like').html('&#xe624;').attr('data-isbuyerlike', 0);
            });
        }
    });
}

/**
 * 修改购物车金额、数量等数据信息
 */
function updateState() {

    var $cont = $('.ct-content');
    var $selected = $('input[name=checkItem][checked=checked]');
    var cnt = 0;
    var total = 0;
    var length = $('input[name=checkItem]').length;
    var i;

    if (length == 0) {
        $cont.html('');
    } else {
        // 清除无商品的档口
        for (i = 0; i < $('.ct-ground').length;) {

            length = $('.ct-ground').eq(i).find('input[name=checkItem]').length;
            if (length == 0) {
                $cont.find('.ct-ground').eq(i).remove();
            } else {
                i++;
            }
        }

    }

    // 空白页显示
    if ($cont.html() == '') {
        $('.ct-cont').hide().siblings('.cm-empty').fadeIn('100').slideDown(200);
    }

    // 更新状态
    if (!epm.isEmpty($selected)) {
        for (i = 0; i < $selected.length; i++) {
            cnt += parseInt($selected.eq(i).parent('.ct-goods-img').nextAll('.cm-alter').find('.cm-num-input').val());
        }

        // 更新全选按钮
        if ($('input[name=checkItem][checked!=checked]').length == 0) {//未选数量
            $('input[name=checkAll]').removeClass('check-normal').addClass('check-selected').attr('checked', 'checked').prop('checked', true);
            $('input[name=checkSelected]').removeClass('check-normal').addClass('check-selected').attr('checked', 'checked').prop('checked', true);

        } else if (cnt > 0) {
            $('input[name=checkAll]').removeClass('check-selected').addClass('check-normal').prop('checked', false).removeAttr('checked');
            $('input[name=checkSelected]').removeClass('check-normal').addClass('check-selected').attr('checked', 'checked').prop('checked', true);
        } else {
            $('input[name=checkAll]').removeClass('check-selected').addClass('check-normal').prop('checked', false).removeAttr('checked');
            $('input[name=checkSelected]').removeClass('check-selected').addClass('check-normal').prop('checked', false).removeAttr('checked');
        }

        // 档口选中
        $('input[name=checkShop]').each(function () {

            var len = $(this).parents('.ct-ground').find('input[name=checkItem][checked!=checked]').length;
            if (len == 0) {
                $(this).removeClass('check-normal').addClass('check-selected').attr('checked', 'checked').prop('checked', true);

            } else {
                $(this).removeClass('check-selected').addClass('check-normal').removeAttr('checked').prop('checked', false);
            }
        });

        // 算总金额
        $selected.each(function () {
            total += epm.getMoney($(this).parents('.ct-list').find('.subtotal').text());
        });

    }
    $('#total').text(epm.getMoney(total));
    $('.selected-count').text(cnt);

    if (total > ORDER_GOODS_PRICE) {
        $('.post-price').html('免费配送');
    } else {
        $('.post-price').html(ORDER_GOODS_PRICE + '元以下加收' + POST_PRICE + '元配送费');
    }
}