$(function() {
	var userInfo = {
		id: JSON.parse(sessionStorage.getItem("user")).id,
		token: sessionStorage.getItem("token"),
	};
  var verifyPassword = function(value) {
      return value ? true : '请填写密码';
  };

  // 监听表单提交事件
  $('form').on('submit', function(e) {
      e.preventDefault(); // 阻止表单默认提交行为

      var $form = $(this);
      var oldpassword = $form.find('input[name="oldpassword"]').val();
      var newpassword = $form.find('input[name="newpassword"]').val();
      var rnewpassword = $form.find('input[name="rnewpassword"]').val();

      // 密码验证
      if (!verifyPassword(oldpassword) || !verifyPassword(newpassword) || !verifyPassword(rnewpassword)) {
          alert('请填写必填项');
          return false;
      }

      if (newpassword !== rnewpassword) {
          alert('两次新密码输入不一致');
          return false;
      }

      axios.post(`http://localhost:9000/users/rpwd`, {
          id: userInfo.id,
          oldPassword: oldpassword,
          newPassword: newpassword,
          rNewPassword: rnewpassword
      }, {
        //Authorization' 头常常与基于令牌的身份验证一起使用。在这里，客户端发送一个包含用户令牌的请求（token）到服务器，以证明它有权访问特定的资源或执行特定的操作。
          headers: {
              'Authorization': userInfo.token
          }
      })
      .then(function(response) {
          if (response.data.code === 1) {
              alert(response.data.message);
              sessionStorage.clear(); 
              window.location.href = './login.html'; // 重定向到登录页面
          }
      })
      .catch(function(error) {
          // 展示错误消息
          alert('更新密码失败: ' + error.message);
      });
  });
});