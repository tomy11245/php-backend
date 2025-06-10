
$(function () {
  g_data.highlightSidebar("/account/managers/", "后台用户管理");
  $(".paginationContent").load("/common/page/pagination/pagination.html");

  $("#searchBtn").on("click", function () {
    requestData();
  });
  $("#resetBtn").click(function () {
    $("#finduser").val("");
    requestData(); // 清空搜索條件後重新加載
  });

  requestData();
});

g_data.pageCurrent = 1;
g_data.total_page = 1;

function requestData() {
  let finduser = $("#finduser").val();

  $.ajax({
    url: "/api/admins/list.php",
    type: "GET",
    dataType: "json",
    data: {
      username: finduser,
    },
    success: function (res) {
      if (res && res.data) renderTable(res.data);
    },
    error: function (err) {
      console.error("資料獲取失敗", err);
    },
  });
}

function renderTable(data) {
  const roleMap = {
    "superadmin" : "超級管理員",
    "manager" : "經理" ,
    "finance" : "財務" ,
    "support" : "客服" 
  };
  

  let tableHtml = `
    <table class="table">
      <thead>
        <tr class="table-secondary">
          <th>后台用户名称</th>
          <th>邮箱地址</th>
          <th>后台用户角色</th>
          <th>创建时间</th>
          <th>更新角色</th>
          <th>删除</th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        ${data.map(item => `
          <tr>
            <td>${item.username}</td>
            <td>${item.email}</td>
            <td><span class="role-badge role-admin">${roleMap[item.role]}</span></td>
            <td>${item.created_at}</td>
            <td>
              ${item.canEdit ? `<button class="btn btn-sm btn-outline-primary" onclick="showOtpRoleModal('${item.username}', '${item.email}')"><i class="bi bi-pencil-square"></i></button>` : ""}
            </td>
            <td>
              ${item.canDelete ? `<button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${item.id}')"><i class="bi bi-trash"></i></button>` : ""}
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <style>
      .role-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.85rem;
      }
      .role-admin {
        background-color: #e6f7ff;
        border: 1px solid #1890ff;
        color: #1890ff;
      }
    </style>
  `;

  $(".dataContent").html(tableHtml);

  window._set_pagination(g_data.pageCurrent, g_data.total_page, function (page) {
    g_data.pageCurrent = page;
    requestData();
  });
}

function showOtpRoleModal(username, email) {
  const modalHtml = `
    <div id="otpRoleModal" class="modal" style="display:flex;position:fixed;z-index:9999;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.5);align-items:center;justify-content:center;">
      <div style="background:#fff;padding:20px;border-radius:8px;width:400px;">
        <h5>OTP 驗證</h5>
        <div class="mb-2">後台用戶角色：</div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="newRole" value="超級管理員" id="role1">
          <label class="form-check-label" for="role1">超級管理員</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="newRole" value="經理" id="role2">
          <label class="form-check-label" for="role2">經理</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="newRole" value="財務" id="role3">
          <label class="form-check-label" for="role3">財務</label>
        </div>
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="newRole" value="客服" id="role4">
          <label class="form-check-label" for="role4">客服</label>
        </div>

        <div class="mt-3">郵箱地址：<strong>${email}</strong></div>
        <div class="input-group mt-2">
          <input type="text" class="form-control" id="otpCodeInput" placeholder="郵箱驗證碼">
          <button class="btn btn-outline-secondary" onclick="sendOtp('${username}')">發送驗證碼</button>
        </div>

        <div class="mt-4 d-flex justify-content-end gap-2">
          <button class="btn btn-secondary" onclick="$('#otpRoleModal').remove()">取消</button>
          <button class="btn btn-primary" onclick="submitOtpAndUpdate('${username}')">確認</button>
        </div>
      </div>
    </div>
  `;
  $("body").append(modalHtml);
}

function sendOtp(username) {
  fetch('/api/admins/send_otp.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: username })
  }).then(res => res.json())
    .then(res => {
      if (res.code === 0) {
        alert('驗證碼已發送');
      } else {
        alert('發送失敗：' + res.message);
      }
    });
}

function submitOtpAndUpdate(username) {
  
  const roleMap = {
    "超級管理員": "superadmin",
    "經理": "manager",
    "財務": "finance",
    "客服": "support"
  };
  const role = $("input[name='newRole']:checked").val();
  const code = $("#otpCodeInput").val().trim();
  const backendRole = roleMap[role];

  if (!role) return alert("請選擇角色");
  if (code.length !== 6) return alert("請輸入6位數驗證碼");


  fetch('/api/admins/verify_otp_and_update.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: username,
      otp_code: code,
      new_role: backendRole
    })
  }).then(res => res.json())
    .then(res => {
      if (res.code === 0) {
        alert('角色更新成功');
        $("#otpRoleModal").remove();
        requestData();
      } else {
        alert('更新失敗：' + res.message);
      }
    });
}

function deleteUser(id) {
  if (!confirm("确认要删除该用户？")) return;

  $.post("/api/admins/delete.php", { id }, function (res) {
    if (res.success) {
      alert("用户删除成功");
      requestData();
    } else {
      alert("删除失败：" + (res.message || ""));
    }
  }, "json");
}

g_data.passwordResetRequest = function () {
  window.location.hash = "/account/managers/passwordResetRequest/";
};



$(function () {
  $("#addBackstageUser").on("click", function () {
    const modal = `
      <div id="createAdminModal" class="modal" style="display:flex;position:fixed;z-index:9999;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.5);align-items:center;justify-content:center;">
        <div style="background:#fff;padding:20px;border-radius:8px;width:450px;">
          <h5>新增后台用户</h5>
          <div class="form-group mb-2">
            <label>后台用户名：</label>
            <input class="form-control" id="new_username" />
          </div>
          <div class="form-group mb-2">
            <label>邮箱地址：</label>
            <input class="form-control" id="new_email" />
          </div>
          <div class="form-group mb-2">
            <label>密码：</label>
            <input type="password" class="form-control" id="new_password" />
          </div>
          <div class="form-group mb-2">
            <label>确认密码：</label>
            <input type="password" class="form-control" id="new_confirm" />
          </div>
          <div class="form-group mb-2">
            <label>后台用户角色：</label><br/>
            <label><input type="radio" name="new_role" value="superadmin" /> 超级管理员</label>
            <label><input type="radio" name="new_role" value="manager" /> 经理</label>
            <label><input type="radio" name="new_role" value="finance" /> 财务</label>
            <label><input type="radio" name="new_role" value="support" /> 客服</label>
          </div>
          <div class="form-group input-group mb-2">
            <input class="form-control" id="new_otp_code" placeholder="请输入验证码" />
            <button class="btn btn-outline-secondary" onclick="sendOtpToEmail(1)">发送验证码</button>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-secondary" onclick="$('#createAdminModal').remove()">取消</button>
            <button class="btn btn-primary" onclick="submitNewAdminUser()">保存</button>
          </div>
        </div>
      </div>`;
    $("body").append(modal);
  });
});

function sendOtpToEmail(type=0) {
  const email = $("#new_email").val().trim();
  if (!email) return alert("請先填寫郵箱");
  fetch('/api/admins/send_otp.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: email,type : type })
  }).then(res => res.json())
    .then(res => {
      if (res.code === 0) alert("驗證碼已發送");
      else alert("發送失敗：" + res.message);
    });
}

function submitNewAdminUser() {
  const username = $("#new_username").val().trim();
  const email = $("#new_email").val().trim();
  const password = $("#new_password").val();
  const confirm = $("#new_confirm").val();
  const role = $("input[name='new_role']:checked").val();
  const otp_code = $("#new_otp_code").val().trim();

  if (!username || !email || !password || !confirm || !role || !otp_code) {
    alert("請填寫所有欄位");
    return;
  }

  fetch('/api/admins/create.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, confirm, role, otp_code })
  }).then(res => res.json())
    .then(res => {
      if (res.code === 0) {
        alert("帳號建立成功");
        $('#createAdminModal').remove();
        requestData();
      } else {
        alert("建立失敗：" + res.message);
      }
    });
}
