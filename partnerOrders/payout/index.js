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
    $("#orderNo").val("1");
    $("#orderNoInput").val("");
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

requestData = function () {
  let orderNo = $("#orderNo").val();
  let orderNoInput = $("#orderNoInput").val();
  let duringDateStart = $("#duringDateStart").val();
  let duringDateEnd = $("#duringDateEnd").val();
  let quantityNumMin = $("#quantityNumMin").val();
  let quantityNumMax = $("#quantityNumMax").val();
  if (duringDateStart && !isValidDateFormat(duringDateStart)) console.log("起始日期格式错误，请使用 YYYY-MM-DD 格式");
  if (duringDateEnd && !isValidDateFormat(duringDateEnd)) console.log("结束日期格式错误，请使用 YYYY-MM-DD 格式");
  if (quantityNumMin && typeof quantityNumMin != "number") console.log("最小数量格式错误，请输入数字");
  if (quantityNumMax && typeof quantityNumMax != "number") console.log("最大数量格式错误，请输入数字");

  let cb = function (data) {
    if(!data.success)return;
    g_data.pageCurrent = data.page;
    g_data.total_page = data.total_page;

    data = data.data;
    let tableHtml = `
      <table class="table">
        <thead>
          <tr class="table-secondary">
            <th>系统订单号</th>
            <th>商户订单号</th>
            <th>商户名称</th>
            <th>用户号</th>
            <th>用户帐号</th>
            <th>币种</th>
            <th>数量</th>
            <th>服务费</th>
            <th>代理分润</th>
            <th>时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          ${data
            .map(
              (item) => `
            <tr>
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewOrderDetail('${item.id}')">${item.id}</a></td>
              <td>${item.merchantOrderId}</td>
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewPartnersDetail('${item.merchantName}')">${item.merchantName}</a></td>
              <td>${
                item.userNo ? `<a href="javascript:void(0)" class="text-primary" onclick="g_data.viewUserDetail('${item.userNo}')">${item.userNo}</a>` : "-"
              }</td>
              <td>${item.account || "-"}</td>
              <td>${item.currency}</td>
              <td>${item.amount}</td>
              <td>${item.serviceFee}</td>
              <td>${item.agentProfit}</td>
              <td>
                发起：${item.createTime}<br>
                ${item.completeTime ? `完成：${item.completeTime}` : ""}
              </td>
              <td>
                <span class="badge text-bg-secondary">
                  ${item.status ? "完成" : "未完成"}
                </span>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    $(".dataContent").html(tableHtml);
    window._set_pagination(g_data.pageCurrent, g_data.total_page, function (page) {
      g_data.pageCurrent = page;
      requestData();
    });
  };
  $.ajax({
    url: "/partnerOrders/payout/list.php",
    type: "GET",
    data: {
      keyword: orderNoInput,
      orderType: orderNo,
      startDate: duringDateStart,
      endDate: duringDateEnd,
      amountMin: quantityNumMin,
      amountMax: quantityNumMax,
      page: g_data.pageCurrent
    },
    success: function (res) {
      cb(res);
    },
    error: function (err) {
      console.log(err);
    },
  });
};
requestData();
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
  let hash = "/partnerOrders/payout/info/?id=" + orderId;
  window.location.hash = hash;
};
