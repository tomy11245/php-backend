// 声明为全局函数，这样 sidebarOnClick 可以调用
$(function () {
  $(".paginationContent").load("/common/page/pagination/pagination.html");

  // 搜索按钮
  $("#searchBtn").on("click", function () {
    requestData();
  });
  // 重置按钮
  // $("#resetBtn").click(function () {
  //   $("#orderNo").val("1");
  //   $("#orderNoInput").val("");
  //   $("#encryptedNetwork").val("1");
  //   $("#duringDateStart").val("");
  //   $("#duringDateEnd").val("");
  //   $("#quantityNumMin").val("");
  //   $("#quantityNumMax").val("");
  // });

  requestData();
});
g_data.pageCurrent = 1;
g_data.total_page = 1;
function requestData() {
  let cb = function (data) {
    data = [
      {
        username: "Alicecorp",
        currency: "YU币",
        minDeposit: "3.00",
        payoutRange: "0.10 ~ 10,000.00",
        minWithdraw: "0.100000",
      },
      {
        username: "AlicecorpGa",
        currency: "YU币",
        minDeposit: "3.00",
        payoutRange: "0.10 ~ 10,000.00",
        minWithdraw: "0.100000",
      },
      {
        username: "denny",
        currency: "YU币",
        minDeposit: "2.00",
        payoutRange: "2.00 ~ 2,222,222.00",
        minWithdraw: "3.000000",
      },
      {
        username: "VanyaTest",
        currency: "YU币",
        minDeposit: "20.00",
        payoutRange: "1.00 ~ 200.00",
        minWithdraw: "20.000000",
      },
      {
        username: "VanyaTest2",
        currency: "YU币",
        minDeposit: "20.00",
        payoutRange: "1.00 ~ 200.00",
        minWithdraw: "100.000000",
      },
      {
        username: "BillPartner",
        currency: "YU币",
        minDeposit: "100.00",
        payoutRange: "10.00 ~ 10,000.00",
        minWithdraw: "100.000000",
      },
      {
        username: "VanyaTest3",
        currency: "YU币",
        minDeposit: "20.00",
        payoutRange: "1.00 ~ 200.00",
        minWithdraw: "200.000000",
      },
      {
        username: "white",
        currency: "YU币",
        minDeposit: "1.00",
        payoutRange: "1.00 ~ 1,020,000.00",
        minWithdraw: "10.000000",
      },
      {
        username: "Dazzle",
        currency: "YU币",
        minDeposit: "0.10",
        payoutRange: "0.10 ~ 1,000.00",
        minWithdraw: "0.100000",
      },
      {
        username: "white1",
        currency: "YU币",
        minDeposit: "1.00",
        payoutRange: "1.00 ~ 1,000,000.00",
        minWithdraw: "10.000000",
      },
    ];

    let tableHtml = `
      <table class="table">
        <thead>
          <tr class="table-secondary">
            <th>商户名称</th>
            <th>币种</th>
            <th>最小充值数量</th>
            <th>代付范围</th>
            <th>最小提币数量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          ${data
            .map(
              (item) => `
            <tr>
              <td>${item.username}</td>
              <td>${item.currency}</td>
              <td>${item.minDeposit}</td>
              <td>${item.payoutRange}</td>
              <td>${item.minWithdraw}</td>
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.editFeeSetting('${item.username}')">编辑</a></td>
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

g_data.editFeeSetting = function (username) {
  console.log("编辑费率设置:", username);
  // 跳转到编辑页面
};
