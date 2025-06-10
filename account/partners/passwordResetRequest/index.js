// 声明为全局函数，这样 sidebarOnClick 可以调用
$(function () {
  g_data.highlightSidebar("/account/partners/", "重设密码要求");
  $(".paginationContent").load("/common/page/pagination/pagination.html");

  // 搜索按钮
  $("#searchBtn").on("click", function () {
    requestData();
  });
  // 重置按钮
  $("#resetBtn").click(function () {
    $("#orderNo").val("1");
    $("#orderNoInput").val("");
    $("#encryptedNetwork").val("1");
    $("#duringDateStart").val("");
    $("#duringDateEnd").val("");
    $("#quantityNumMin").val("");
    $("#quantityNumMax").val("");
  });
  // 导出按钮
  $("#exportBtn").click(function () {
    console.log("导出");
  });
  requestData();
});
g_data.pageCurrent = 1;
g_data.total_page = 1;
function requestData() {
  // let orderNo = $("#orderNo").val();
  // let orderNoInput = $("#orderNoInput").val();
  // let encryptedNetwork = $("#encryptedNetwork").val();
  // let duringDateStart = $("#duringDateStart").val();
  // let duringDateEnd = $("#duringDateEnd").val();
  // let quantityNumMin = $("#quantityNumMin").val();
  // let quantityNumMax = $("#quantityNumMax").val();
  // if (duringDateStart && !isValidDateFormat(duringDateStart)) console.log("起始日期格式错误，请使用 YYYY-MM-DD 格式");
  // if (duringDateEnd && !isValidDateFormat(duringDateEnd)) console.log("结束日期格式错误，请使用 YYYY-MM-DD 格式");
  // if (quantityNumMin && typeof quantityNumMin != "number") console.log("最小数量格式错误，请输入数字");
  // if (quantityNumMax && typeof quantityNumMax != "number") console.log("最大数量格式错误，请输入数字");

  let cb = function (data) {
    data = [
      {
        username: "adminVanyaTest",
        email: "rlai@aetheras.io",
        requestTime: "2024/11/12 14:23:45",
      },
      {
        username: "adminIvy",
        email: "aliu@aetheras.io",
        requestTime: "2024/11/10 09:17:32",
      },
      {
        username: "admintest",
        email: "yubi_test4@outlook.com",
        requestTime: "2024/11/08 16:45:22",
      },
      {
        username: "adminDenny",
        email: "dennyching@aetheras.io",
        requestTime: "2024/11/05 11:30:08",
      },
      {
        username: "Selina",
        email: "silvia.c.work@gmail.com",
        requestTime: "2024/11/01 08:12:53",
      },
    ];

    let tableHtml = `
      <table class="table">
        <thead>
          <tr class="table-secondary">
            <th>后台用户名称</th>
            <th>邮箱地址</th>
            <th>要求时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          ${data
            .map(
              (item) => `
            <tr>
              <td>${item.username}</td>
              <td>${item.email}</td>
              <td>${item.requestTime}</td>
              <td>
                <button class="btn btn-sm btn-success me-2" onclick="approveRequest('${item.username}')">
                  <i class="bi bi-check-circle me-1"></i>批准
                </button>
                <button class="btn btn-sm btn-danger" onclick="rejectRequest('${item.username}')">
                  <i class="bi bi-x-circle me-1"></i>拒绝
                </button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    // 添加角色样式
    let roleStyle = `
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

    // 插入表格到指定位置，并添加样式
    $(".dataContent").html(roleStyle + tableHtml);

    // 更新分页
    window._set_pagination(g_data.pageCurrent, g_data.total_page, function (page) {
      g_data.pageCurrent = page;
      requestData();
    });
  };
  $.ajax({
    url: g_data.api_url,
    type: "GET",
    success: function (res) {
      cb(res);
    },
    error: function (err) {
      console.log(err);
    },
  });
}

g_data.approveRequest = function (username) {
  console.log("批准密码重置请求:", username);
  // 实现批准请求的逻辑
};
g_data.rejectRequest = function (username) {
  console.log("拒绝密码重置请求:", username);
  // 实现拒绝请求的逻辑
};
