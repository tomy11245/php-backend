$(function () {
  g_data.highlightSidebar("/account/managers/", "后台用户管理");
  $(".paginationContent").load("/common/page/pagination/pagination.html");

  $("#searchBtn").on("click", function () {
    requestData();
  });
  $("#resetBtn").click(function () {
    requestData(); // 清空搜索條件後重新加載
  });

  requestData();
});

g_data.pageCurrent = 1;
g_data.total_page = 1;

function requestData() {
  $.ajax({
    url: "/api/admins/list.php",
    type: "GET",
    dataType: "json",
    success: function (res) {
      if (res && res.data) renderTable(res.data);
    },
    error: function (err) {
      console.error("資料獲取失敗", err);
    },
  });
}

function renderTable(data) {
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
            <td><span class="role-badge role-admin">${item.role}</span></td>
            <td>${item.created_at}</td>
            <td>
              ${item.canEdit ? `<button class="btn btn-sm btn-outline-primary" onclick="updateUserRole('${item.username}')"><i class="bi bi-pencil-square"></i></button>` : ""}
            </td>
            <td>
              ${item.canDelete ? `<button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${item.username}')"><i class="bi bi-trash"></i></button>` : ""}
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

function updateUserRole(username) {
  let newRole = prompt("请输入新角色:");
  if (!newRole) return;

  $.post("/api/admins/update_role.php", { username, role: newRole }, function (res) {
    if (res.success) {
      alert("角色更新成功");
      requestData();
    } else {
      alert("更新失败：" + (res.message || ""));
    }
  }, "json");
}

function deleteUser(username) {
  if (!confirm("确认要删除该用户？")) return;

  $.post("/api/admins/delete.php", { username }, function (res) {
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
