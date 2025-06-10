document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
      alert("請輸入帳號與密碼");
      return;
    }

    fetch("../../api/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("登入成功！");
          window.location.href = "../";
        } else {
          alert("登入失敗：" + data.message);
        }
      })
      .catch((err) => {
        alert("發生錯誤：" + err);
      });
  });
});
