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
g_data.total_page = 3;
function requestData() {
  let orderNo = $("#orderNo").val();
  let orderNoInput = $("#orderNoInput").val();
  let status = $("#status").val();
  let duringDateStart = $("#duringDateStart").val();
  let duringDateEnd = $("#duringDateEnd").val();
  let quantityNumMin = $("#quantityNumMin").val();
  let quantityNumMax = $("#quantityNumMax").val();
  if (duringDateStart && !isValidDateFormat(duringDateStart)) console.log("起始日期格式错误，请使用 YYYY-MM-DD 格式");
  if (duringDateEnd && !isValidDateFormat(duringDateEnd)) console.log("结束日期格式错误，请使用 YYYY-MM-DD 格式");
  if (quantityNumMin && typeof quantityNumMin != "number") console.log("最小数量格式错误，请输入数字");
  if (quantityNumMax && typeof quantityNumMax != "number") console.log("最大数量格式错误，请输入数字");

  let cb = function (data) {
    g_data.pageCurrent = data.page;
    g_data.total_page = data.total_page;

    data = data.data || [];

    const statusMap = {
      1: { text: "挂单中", class: "secondary" },
      2: { text: "付款中", class: "info" },
      3: { text: "待放币", class: "warning" },
      4: { text: "交易完成", class: "success" },
      5: { text: "交易取消", class: "danger" },
      6: { text: "取消中", class: "warning" },
      7: { text: "修改中", class: "warning" },
      8: { text: "申诉中", class: "secondary" },
    };
    

    tableHtml = `
      <table class="table">
        <thead>
          <tr class="table-secondary">
            <th>系统订单号</th>
            <th>状态</th>
            <th>购买方</th>
            <th>出售方</th>
            <th>币种</th>
            <th>交易数量</th>
            <th>出售服务费</th>
            <th>代理分润</th>
            <th>创建时间</th>
            <th>付款时间</th>
            <th>完成时间</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          ${data
            .map((item) => {
              const status = statusMap[item.status] || { text: "未知", class: "secondary" };
              return `
            <tr>
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewOrderDetail('${item.id}')">${item.id}</a></td>
              <td>
                <span class="badge text-bg-${status.class}">
                    ${status.text}
                  </span>
              </td>
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewUserDetail('${item.buyer}')">${item.buyer}</a></td>
              <td>${
                item.seller ? `<a href="javascript:void(0)" class="text-primary" onclick="g_data.viewUserDetail('${item.seller}')">${item.seller}</a>` : "-"
              }</td>
              <td>${item.currency}</td>
              <td>${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td>${item.service_fee || "-"}</td>
              <td>${item.agent_profit || "-"}</td>
              <td>${item.create_time}</td>
              <td>${item.pay_time || "-"}</td>
              <td>${item.complete_time || "-"}</td>
            </tr>
          `;
            })
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
    url: "/c2cOrders/buy/list.php",
    type: "GET",
    data: {
      keyword: orderNoInput,
      orderType: orderNo,
      status: status,
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
  let hash = "/c2cOrders/buy/info/?id=" + orderId;
  window.location.hash = hash;
};
