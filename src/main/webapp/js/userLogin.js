/**
 * Created by saras on 2017/4/21.
 */
function pageInit() {
    var action = epm.getSessionItem('toLogin');
    var url;
    if (action == 1) {
        $('.login-tab a').first().addClass('text-selected').siblings().removeClass('text-selected');
        $('#login').html('立即登陆');
        url = 'user/userToLogin';
    } else {
        $('.login-tab a').last().addClass('text-selected').siblings().removeClass('text-selected');
        $('#login').html('立即注册');
        url = 'user/userToRegister';
    }
    $('#login').on({
        click: function login() {
            var params = {};
            params['name'] = $('#userName').val();
            params['password'] = $('#userPassword').val();

            //userToLogin
            //userToRegister
            if (epm.isEmpty(params['name']) || epm.isEmpty(params['password'])) {
                $('.error-text').html('请把数据填写完整');
                return;
            }
            $.post(url, {params: JSON.stringify(params)}, function (result) {
                if (result != null) {
                    result = JSON.parse(result);
                }
                if (result['success'] == true && result != null) {
                    epm.setLocalItem('userName',params['name']);
                    epm.setSessionItem('turnToSort', 0);
//                        location.href("/adminIndex");
//                        window.location.href = 'adminIndex';
                    alert(result['data']['msg']);
                    window.location.href = 'goodsList';
                } else {
                    $('.error-text').html(result['data']['msg']);
                    $('.error').show();
                }
            });

        }
    });
}


