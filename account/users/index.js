
$(function () {
  $(".paginationContent").load("/common/page/pagination/pagination.html");

  $("#searchBtn").on("click", function () {
    requestData();
  });
  $("#resetBtn").click(function () {
    $("#userNo").val("1");
    $("#userNoInput").val("");
    $("#quantityNumMin").val("");
    $("#quantityNumMax").val("");
    $("#userRole").val("1");
    requestData();
  });

  requestData();
});

g_data.pageCurrent = 1;
g_data.api_url = "/api/users/list.php";

function requestData() {
  let keyword = $("#userNoInput").val();
  let roleVal = $("#userRole").val();
  let role = roleVal == "2" ? "一般用戶" : "";
  let min_amount = $("#quantityNumMin").val();
  let max_amount = $("#quantityNumMax").val();

  $.get(g_data.api_url, {
    keyword,
    role,
    min_amount,
    max_amount,
    page: g_data.pageCurrent,
  }).done(function (res) {
    if (res.code !== 0) return console.error("API Error:", res);
    const data = res.data.list;
    const total = res.data.total;

    let html = `<table class="table">
      <thead><tr class="table-secondary">
        <th>用户号</th>
        <th>帐号</th>
        <th>用户角色</th>
        <th>YU币可用余额</th>
      </tr></thead><tbody class="table-group-divider">`;

    data.forEach((item) => {
      html += `<tr>
        <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewUserDetail('${item.uid}')">${item.uid}</a></td>
        <td>${item.account}</td>
        <td><span class="border border-secondary px-2 py-1 rounded">${item.role}</span></td>
        <td>${parseFloat(item.yu_balance).toLocaleString()}</td>
      </tr>`;
    });

    html += "</tbody></table>";
    $(".dataContent").html(html);

    g_data.total_page = Math.ceil(total / 20);
    window._set_pagination(g_data.pageCurrent, g_data.total_page, function (page) {
      g_data.pageCurrent = page;
      requestData();
    });
  });
}

g_data.viewUserDetail = function (userId) {
  console.log("查看用户详情:", userId);
  /*
  sidebarOnClick("/account/users/info/index.html?id=" + userId, document.getElementById("sidebarBtn-users-account-users"), {
    id: userId,
  });
  */
  let hash = "/account/users/info/index.html?id=" + userId;
  window.location.hash = hash;
};

