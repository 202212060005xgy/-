$(function () {
  // 表单验证
  $("form").on("submit", function(event) {
      event.preventDefault(); // 阻止表单默认提交
      var username = document.querySelector('.username').value;
      var password = document.querySelector('.password').value;
      var rpassword = document.querySelector('.rpassword').value;
      var nickname = document.querySelector('.nickname').value;
      
      var $error = $(".error");
      if (!username || !password || !rpassword || !nickname) {
          $error.text("有必填项").fadeIn();
          return false;
      }
      if (password !== rpassword) {
          $error.text("两次密码不一致").fadeIn();
          return false;
      }

      // 隐藏错误信息
      $error.hide();

      // 使用axios发送注册请求
      axios.post("http://localhost:9000/users/register", {
          username: username,
          password: password,
          rpassword: rpassword,
          nickname: nickname
      })
      .then(function(response) {
          if (response.data.code === 1) {
              $error.text(response.data.message).fadeIn();
              window.location.href = "./login.html";
          } else {
              $error.text(response.data.message).fadeIn();
          }
      })
      .catch(function(error) {
          alert("请求出错: " + error.message);
      });
  });
});