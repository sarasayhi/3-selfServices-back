/**
 * Created by saras on 2017/4/21.
 */
function pageInit() {
    var html = '';
    var sortList = epm.c.goodsSortList;
    $.each(sortList, function (id, name) {
        html += '<li class="detail-item">'
            + '<div>' + id + '</div>'
            + '<div><input class="cm-btn-sm name" type="text" value="' + name + '" orgin="' + name + '"></div>'
            + '<div>'
            + '<button style="margin:5px;" class="cm-btn-sm pay-btn-active updateSort" sortId="' + id + '">修改</button>'
            + '</div></li>';
    });
    $('#sortList').html(html).find('input').attr('disabled', true).css({
        'background-color': '#fff',
        'color': '#000'
    });

    //updateSort
    $('.updateSort').on({
        click: function () {
            var $parent = $(this).parents('.detail-item');
            if ($parent.find('input').attr('disabled') == 'disabled') {
                $parent.find('input').removeAttr('disabled').css({
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

            if ($parent.find('.name').val() == $parent.find('.name').attr('orgin')){
                alert("没有修改类别名称");
                return;
            }
            if (epm.isEmpty($parent.find('.name').val())){
                alert("请填写要修改类别名称");
                return;
            }
            var params = {};
            params['sortId'] = $(this).attr('sortId');
            params['sortName'] = $parent.find('.name').val();

            $.post("updateSort", {params: JSON.stringify(params)}, function (result) {
                var resultObject = JSON.parse(result);
                if (resultObject['success'] == true) {
                    alert("类别名称修改成功");
                    window.location.reload();
                } else {
                    alert("类别名称修改失败，请重新填写信息");
                }
            });
        }
    });

}