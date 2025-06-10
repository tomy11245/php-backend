// 声明为全局函数，这样 sidebarOnClick 可以调用

$(function () {
  $(".paginationContent").load("/common/page/pagination/pagination.html");
  // 日期选择器
  $(".duringDate #datepicker").datepicker({
    weekStart: 7,
    maxViewMode: 2,
    todayBtn: true,
    clearBtn: true,
    language: "zh-CN",
    orientation: "bottom auto",
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true,
    todayHighlight: true,
  });

  // 搜索按钮
  $("#searchBtn").on("click", function () {
    requestData();
  });
  // 重置按钮
  $("#resetBtn").click(function () {
    $("#orderType").val("1");
    $("#orderNoInput").val("");
    $("#encryptedNetwork").val("");
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
g_data.total_page = 3;
function requestData() {
  let orderType = $("#orderType").val();
  let orderNoInput = $("#orderNoInput").val();
  let encryptedNetwork = $("#encryptedNetwork").val();
  let duringDateStart = $("#duringDateStart").val();
  let duringDateEnd = $("#duringDateEnd").val();
  let quantityNumMin = $("#quantityNumMin").val();
  let quantityNumMax = $("#quantityNumMax").val();
  if (duringDateStart && !isValidDateFormat(duringDateStart)) console.log("起始日期格式错误，请使用 YYYY-MM-DD 格式");
  if (duringDateEnd && !isValidDateFormat(duringDateEnd)) console.log("结束日期格式错误，请使用 YYYY-MM-DD 格式");
  if (quantityNumMin && typeof quantityNumMin != "number") console.log("最小数量格式错误，请输入数字");
  if (quantityNumMax && typeof quantityNumMax != "number") console.log("最大数量格式错误，请输入数字");

  let cb = function(data) {
    g_data.pageCurrent = data.page;
    g_data.total_page = data.total_page;

    data = data.data || [];
    tableHtml = `
      <table class="table">
        <thead>
          <tr  class="table-secondary">
            <th>系统订单号</th>
            <th>用户号</th>
            <th>用户帐号</th>
            <th>发送方</th>
            <th>转入数量 (USDT)</th>
            <th>获得数量 (YU币)</th>
            <th>汇率 (USDT/YU币)</th>
            <th>时间</th>
            <th>交易序号(TxID)</th>
          </tr>
        </thead>
         <tbody class="table-group-divider">
          ${data
        .map(
          (item) => `
            <tr>
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewOrderDetail('${item.order_no}')">${item.order_no}</a></td>
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewUserDetail('${item.user_id}')">${item.user_id}</a></td>
              <td>${item.account}</td>
              <td>${item.address}</td>
              <td>${item.amount}</td>
              <td>${item.out_amount}</td>
              <td>${item.rate}</td>
              <td>${item.created_at}</td>
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewTronTransactionDetail('${item.note}')">${item.note}</a></td>
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
    url: "../../api/user_collect_orders/list.php",
    type: "GET",
    data: {
      keyword: orderNoInput,
      encryptedNetwork : encryptedNetwork,
      orderType: orderType,
      startDate: duringDateStart,
      endDate: duringDateEnd,
      amountMin: quantityNumMin,
      amountMax: quantityNumMax,
      page: g_data.pageCurrent
    },
    success: function (res) {
      if (res) {
        cb(res);
      }
    },
    error: function (err) {
      console.log(err);
    },
  });
}

// 检查日期格式
function isValidDateFormat(dateStr) {
  // 检查日期格式是否为 YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  // 检查日期是否有效
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
}
// 将函数定义移到最外层，并设为全局
g_data.viewOrderDetail = function (orderId) {
  console.log("查看订单详情:", orderId);
  // 跳转到订单详情页
  let hash = "/userOrders/collect/info/?id=" + orderId;
  window.location.hash = hash;
};


function renderTable(data) {
  let rows = data.map(row => `
    <tr>
      <td>${row.id}</td>
      <td>${row.order_no}</td>
      <td>${row.user_id}</td>
      <td>${row.amount}</td>
      <td>${row.status}</td>
      <td>${row.created_at}</td>
      <td>${row.note}</td>
    </tr>`).join("");
  $("#orderTableBody").html(rows);
}
