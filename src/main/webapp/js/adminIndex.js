/**
 * Created by saras on 2017/4/21.
 */
function pageInit() {
    getUserList();
    addUser();
}

function getUserList() {
    $.post("user/getUserList", function (result) {
        console.log(typeof result + ' ' + result);
        var resultObject = JSON.parse(result);
        console.log(" dfd " + typeof resultObject + " " + resultObject['success']);
        if (resultObject['success'] == false) {
            alert("暂无用户");
            return;
        }

        var html = '';
        $.each(resultObject['data'], function (key, user) {
            html += '<li class="detail-item">'
                + '<div><input class="cm-btn-sm name" type="text" value="' + user['name'] + '" orgin="' + user['name'] + '"></div>'
                + '<div><input class="cm-btn-sm password" type="text"  value="' + user['password'] + '" orgin="' + user['password'] + '"></div>'
                + '<div><input class="cm-btn-sm money" type="text" value="' + user['money'] + '" orgin="' + user['money'] + '"></div>'
//                    + '<div>' + user['password'] + '</div>'
//                    + '<div class="price-num">' + user['money'] + '</div>'
                + '<div>'
                + '<button class="cm-btn-sm pay-btn-active deleteUser" userId ="' + user['userId'] + '">删除</button>'
                + '<button class="cm-btn-sm pay-btn-active updateUser" userId ="' + user['userId'] + '">修改</button>'
                + '</div></li>';
        });
        $('#userList').html(html).find('input').attr('disabled', true).css({
            'background-color': '#fff',
            'color': '#000'
        });


        //deleteUser
        $('.deleteUser').on({
            click: function () {
                var params = {};
                params['userid'] = $(this).attr('userid');
                console.log(params['userid']);
                if (epm.isEmpty(params['userid'])) {
                    alert("请选择要删除的用户");
                    return;
                }
                console.log(JSON.stringify(params));
                $.post("user/deleteUser", {params: JSON.stringify(params)}, function (result) {
                    console.log(typeof result + ' ' + result);
                    var resultObject = JSON.parse(result);
                    console.log(" dfd " + typeof resultObject + " " + resultObject['success']);
                    if (resultObject['success'] == true) {
                        alert("用户删除成功");
                    } else {
                        alert("用户删除失败");
                    }
                    window.location.reload();
                });
            }
        });

        //updateUser
        $('.updateUser').on({
            click: function () {
                var $parent = $(this).parents('.detail-item');
                console.log($parent.find('input').attr('disabled'));
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

                if ($parent.find('.name').val() == $parent.find('.name').attr('orgin') && $parent.find('.password').val() == $parent.find('.password').attr('orgin') && $parent.find('.money').val() == $parent.find('.money').attr('orgin')) {
                    alert("没有修改用户信息");
                    return;
                }
                if (epm.isEmpty($parent.find('.name').val()) || epm.isEmpty($parent.find('.password').val()) || epm.isEmpty($parent.find('.money').val()) || epm.isEmpty($(this).attr('userid'))) {
                    alert("请填写完整修改用户信息");
                    return;
                }
                var params = {};
                params['userid'] = $(this).attr('userid');
                params['name'] = $parent.find('.name').val();
                params['password'] = $parent.find('.password').val();
                params['money'] = $parent.find('.money').val();

                console.log(JSON.stringify(params));

                $.post("user/updateUser", {params: JSON.stringify(params)}, function (result) {
                    console.log(typeof result + ' ' + result);
                    var resultObject = JSON.parse(result);
                    console.log(" dfd " + typeof resultObject + " " + resultObject['success']);
                    if (resultObject['success'] == true) {
                        alert("用户信息修改成功");
                        $parent.find('input').attr('disabled', true).css({
                            'background-color': '#fff',
                            'color': '#000'
                        });
                        window.location.reload();
                    } else {
                        alert("用户信息修改失败，请重新填写信息");
                    }
                });
            }
        });

    });
}

function addUser() {
    $('#addUser').on({
        click: function () {
            var params = {};
            params['name'] = $('#name').val();
            params['password'] = $('#password').val();
            params['money'] = $('#money').val();
            if (epm.isEmpty(params['name']) || epm.isEmpty(params['password']) || epm.isEmpty(params['money'])) {
                alert("请把数据填写完整");
                return;
            }

            console.log(JSON.stringify(params));
            $.post("user/addUser", {params: JSON.stringify(params)}, function (result) {
                console.log(typeof result + ' ' + result);
                var resultObject = JSON.parse(result);
                console.log(" dfd " + typeof resultObject + " " + resultObject['success']);
                resultObject['success'] == true ? alert("用户添加成功") : alert("用户添加失败");
                window.location.reload();
            });
        }
    });
}
