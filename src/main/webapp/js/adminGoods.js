/**
 * Created by saras on 2017/4/21.
 */
function pageInit() {
    var sortList = epm.c.goodsSortList;
    var html = '';
    $.each(sortList, function (id, name) {
            html += '<option value="' + id + '">' + name + '</option>';
    });
    $('#sort').html(html);
    getGoodsList();
    addGoods();
}

function getGoodsList() {
    $.post("goods/getGoodsList", function (result) {
        var resultObject = JSON.parse(result);
        if (resultObject['success'] == false) {
            alert("暂无商品");
            return;
        }

        var html = '';
        $.each(resultObject['data'], function (key, goods) {
            html += '<li class="detail-item">'
                + '<div><input class="cm-btn-sm name" type="text" value="' + goods['name'] + '" orgin="' + goods['name'] + '"></div>'
                + '<div><input class="cm-btn-sm price" type="text"  value="' + goods['price'] + '" orgin="' + goods['price'] + '"></div>'
                + '<div><input class="cm-btn-sm stock" type="text" value="' + goods['stock'] + '" orgin="' + goods['stock'] + '"></div>'
                + '<div><input class="cm-btn-sm url" type="text" value="' + goods['url'] + '" orgin="' + goods['url'] + '"></div>'
                + '<div><select  class="cm-btn-sm sort">';
            var sortList = epm.c.goodsSortList;
            $.each(sortList, function (id, name) {
                if (goods['sort'] == id) {
                    html += '<option selected="selected" value="' + id + '">' + name + '</option>';
                } else {
                    html += '<option value="' + id + '">' + name + '</option>';
                }
            });
            html += '</select></div>'
                + '<div style="width: 200px;">'
                + '<button style="margin: 5px;" class="cm-btn-sm pay-btn-active deleteGoods" goodsId ="' + goods['goodsId'] + '">删除</button>'
                + '<button style="margin: 5px;" class="cm-btn-sm pay-btn-active updateGoods" goodsId ="' + goods['goodsId'] + '" status="' + goods['status'] + '">修改</button>'
                + '</div></li>';
        });

        var $goodList = $('#goodList');
        $goodList.html(html);
        $goodList.find('input').attr('disabled', true).css({
            'background-color': '#fff',
            'color': '#000'
        });
        $goodList.find('select').attr('disabled',true);

        //deleteGoods
        $('.deleteGoods').on({
            click: function () {
                var params = {};
                params['goodsId'] = $(this).attr('goodsId');
                if (epm.isEmpty(params['goodsId'])) {
                    alert("请选择要删除的商品");
                    return;
                }
                $.post("goods/deleteGoods", {params: JSON.stringify(params)}, function (result) {
                    var resultObject = JSON.parse(result);
                    if (resultObject['success'] == true) {
                        alert("商品删除成功");
                    } else {
                        alert("商品删除失败");
                    }
                    window.location.reload();
                });
            }
        });

        //updateGoods
        $('.updateGoods').on({
            click: function () {
                var $parent = $(this).parents('.detail-item');
                if ($parent.find('input').attr('disabled') == 'disabled') {
                    $parent.find('input').removeAttr('disabled').css({
                        'background-color': '#bebebe',
                        'color': '#fff'
                    });
                    $parent.find('select').removeAttr('disabled').css({
                        'background-color': '#bebebe',
                        'color': '#fff'
                    });
                    $(this).html('确定');
                    $parent.find('input').on({
                        input: function () {
                            $(this).attr({'value': $(this).val()});
                        }
                    });

                    return;
                }

                if ($parent.find('.name').val() == $parent.find('.name').attr('orgin') && $parent.find('.price').val() == $parent.find('.price').attr('orgin')
                    && $parent.find('.stock').val() == $parent.find('.stock').attr('orgin') && $parent.find('.url').val() == $parent.find('.url').attr('orgin')
                    && $parent.find('.sort').val() == $parent.find('.sort').attr('orgin')) {
                    alert("没有修改商品信息");
                    return;
                }

                if (epm.isEmpty($parent.find('.name').val()) || epm.isEmpty($parent.find('.price').val())
                    || epm.isEmpty($parent.find('.stock').val()) || epm.isEmpty($parent.find('.url').val())
                    || epm.isEmpty($parent.find('.sort').val())) {
                    alert("请填写完整修改商品信息");
                    return;
                }
                var params = {};
                params['goodsId'] = $(this).attr('goodsId');
                params['name'] = $parent.find('.name').val();
                params['price'] = $parent.find('.price').val();
                params['stock'] = $parent.find('.stock').val();
                params['url'] = $parent.find('.url').val();
                params['sort'] = $parent.find('.sort').val();
                params['status'] = $(this).attr('status');


                $.post("goods/updateGoods", {params: JSON.stringify(params)}, function (result) {
                    var resultObject = JSON.parse(result);
                    if (resultObject['success'] == true) {
                        alert("商品信息修改成功");
                        window.location.reload();
                    } else {
                        alert("商品信息修改失败，请重新填写信息");
                    }
                });
            }
        });

    });
}

function addGoods() {
    $('#addGoods').on({
        click: function () {
            var params = {};
            params['name'] = $('#name').val();
            params['price'] = $('#price').val();
            params['stock'] = $('#stock').val();
            params['url'] = $('#url').val();
            params['sort'] = $('#sort').val();
            params['status'] = 0;
            if (epm.isEmpty(params['name']) || epm.isEmpty(params['price']) || epm.isEmpty(params['stock'])
                || epm.isEmpty(params['url']) || epm.isEmpty(params['sort'])) {
                alert("请把数据填写完整");
                return;
            }

            $.post("goods/addGoods", {params: JSON.stringify(params)}, function (result) {
                var resultObject = JSON.parse(result);
                resultObject['success'] == true ? alert("商品添加成功") : alert("商品添加失败");
                window.location.reload();
            });
        }
    });
}
