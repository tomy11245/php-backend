// 声明为全局函数，这样 sidebarOnClick 可以调用
$(function () {
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
g_data.pageCurrent = 2;
g_data.total_page = 2;
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
        username: "WhiteAffiliate",
        affiliateId: "AFF_235668244",
        balance: "999,009,367.80",
        frozen: "0.00",
        credit: "0.00",
        status: "已注册",
      },
      {
        username: "AliceAffiliateGa",
        affiliateId: "AFF_100000012",
        balance: "191,498.03",
        frozen: "0.00",
        credit: "0.00",
        status: "已注册",
      },
      {
        username: "DazzleAffiliate",
        affiliateId: "AFF_938939920",
        balance: "6,904.00",
        frozen: "0.00",
        credit: "0.00",
        status: "已注册",
      },
      {
        username: "DazzleAffiliate2",
        affiliateId: "AFF_153171482",
        balance: "3,000.00",
        frozen: "0.00",
        credit: "0.00",
        status: "已注册",
      },
      {
        username: "DennyAffiliate",
        affiliateId: "AFF_727730456",
        balance: "2,385.00",
        frozen: "0.00",
        credit: "0.00",
        status: "已注册",
      },
      {
        username: "AliceAffiliate",
        affiliateId: "AFF_100000011",
        balance: "1,444.23",
        frozen: "0.00",
        credit: "0.00",
        status: "已注册",
      },
      {
        username: "VanyaTestAffiliate",
        affiliateId: "AFF_646429187",
        balance: "991.89",
        frozen: "0.00",
        credit: "0.00",
        status: "已注册",
      },
      {
        username: "SELINA",
        affiliateId: "AFF_675781916",
        balance: "24.45",
        frozen: "0.00",
        credit: "0.00",
        status: "已注册",
      },
      {
        username: "VanyaTestAffiliate2",
        affiliateId: "AFF_433365252",
        balance: "2.11",
        frozen: "0.00",
        credit: "0.00",
        status: "已注册",
      },
      {
        username: "BillAgent",
        affiliateId: "AFF_987058184",
        balance: "0.34",
        frozen: "0.00",
        credit: "0.00",
        status: "已注册",
      },
    ];

    let tableHtml = `
      <table class="table">
        <thead>
          <tr class="table-secondary">
            <th>代理商名称</th>
            <th>代理商编号</th>
            <th>YU币可用余额</th>
            <th>YU币冻结数量</th>
            <th>YU币已缴保证金</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          ${data
            .map(
              (item) => `
            <tr>
              <td><a href="javascript:void(0)" onclick="g_data.viewAffiliateDetail('${item.username}')" class="text-primary">${item.username}</a></td>
              <td>${item.affiliateId}</td>
              <td>${item.balance}</td>
              <td>${item.frozen}</td>
              <td>${item.credit}</td>
              <td><span class="badge text-bg-success">${item.status}</span></td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    // 插入表格到指定位置
    $(".dataContent").html(tableHtml);

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
g_data.passwordResetRequest = function () {
  console.log("重设密码要求");
  // 实现重设密码要求逻辑
  let hash = "/account/partners/passwordResetRequest/";
  window.location.hash = hash;
};
