/**
 * Created by saras on 2017/4/21.
 */
function pageInit() {
    $('#login').on({
        click: function login() {
            var params = {};
            params['name'] = $('#adminName').val();
            params['password'] = $('#adminPassword').val();

            $.post("amdinToLogin", {params: JSON.stringify(params)}, function (result) {
                if (result != null) {
                    result = JSON.parse(result.trim());
                }
                if (result['success'] == true && result != null) {
//                        location.href("/adminIndex");
//                        window.location.href = 'adminIndex';
                    window.location.href = 'adminIndex';
                } else {
                    $('.error-text').html('用户名或密码错误，请重新输入');
                    $('.error').show();
                }
            });

        }
    });
}


