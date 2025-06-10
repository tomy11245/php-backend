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
  let encryptedNetwork = $("#encryptedNetwork").val();
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
      1: { text: "成功", class: "success" },
      2: { text: "处理中", class: "primary" },
      3: { text: "审核中", class: "info" },
      4: { text: "待审核", class: "warning" },
      5: { text: "审核拒绝", class: "danger" },
      0: { text: "未通过", class: "secondary" },
    };
    
    let tableHtml = `
      <table class="table">
        <thead>
          <tr class="table-secondary">
            <th>系统订单号</th>
            <th>商户/代理商名称</th>
            <th>接收方</th>
            <th>发送数量 (YU币)</th>
            <th>到账数量 (USDT)</th>
            <th>汇率 (YU币/USDT)</th>
            <th>时间</th>
            <th>状态</th>
            <th>交易序号(TxID)</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          ${data
            .map((item) => {
              const status = statusMap[item.status] || { text: "未知", class: "secondary" };
              return `
                <tr>
                  <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewOrderDetail('${item.id}')">${item.id}</a></td>
                  <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewPartnersDetail('${item.partnerName}')">${item.partnerName}</a></td>
                  <td>${item.receiver}</td>
                  <td>${item.outAmount}</td>
                  <td>${item.inAmount}</td>
                  <td>${item.rate}</td>
                  <td>${item.time}</td>
                  <td>
                    <span class="badge text-bg-${status.class}">
                      ${status.text}
                    </span>
                  </td>
                  <td>${item.txId ? `<a href="javascript:void(0)" class="text-primary" onclick="g_data.viewTronTransactionDetail('${item.txId}')">${item.txId}</a>` : ""}</td>
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
    url: "/partnerOrders/withdraw/list.php",
    type: "GET",
    data: {
      keyword: orderNoInput,
      orderType: orderNo,
      status: encryptedNetwork,
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
  let hash = "/partnerOrders/withdraw/info/?id=" + orderId;
  window.location.hash = hash;
};
