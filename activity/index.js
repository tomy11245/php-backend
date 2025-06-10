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
    data = [
      {
        id: "e388c3a8-ff14-11ef-855e-7962625f6c6f",
        title: "新注册完成kyc送200",
        startDate: "2025/03/12 15:40:00",
        endDate: "2025/03/13 23:59:59",
        type: "完成身份认证",
        status: "进行中",
      },
      {
        id: "1f6312e1-a0a0-11ef-8539-7962625f6c6f",
        title: "買10送200",
        startDate: "2024/11/12 10:46:00",
        endDate: "2024/11/19 23:59:59",
        type: "完成买单",
        status: "已结束",
      },
      {
        id: "1d779ce7-95c3-11ef-856e-7962625f6c6f",
        title: "測試重複",
        startDate: "2024/10/29 15:00:00",
        endDate: "2024/10/29 14:58:08",
        type: "完成买单",
        status: "已结束",
      },
      {
        id: "638e82cd-94e7-11ef-8543-7962625f6c6f",
        title: "買幣10送100",
        startDate: "2024/10/28 13:00:00",
        endDate: "2024/10/30 23:59:59",
        type: "完成买单",
        status: "已结束",
      },
      {
        id: "5bc66aa9-8db2-11ef-8540-7962625f6c6f",
        title: "扫码买100送10",
        startDate: "2024/10/19 12:00:00",
        endDate: "2024/10/24 23:59:59",
        type: "完成充值(扫码支付)",
        status: "已结束",
      },
      {
        id: "0ca20cd2-8db2-11ef-853f-7962625f6c6f",
        title: "123",
        startDate: "2024/10/19 13:59:00",
        endDate: "2024/10/19 08:36:13",
        type: "完成充值(扫码支付)",
        status: "已结束",
      },
      {
        id: "7b7c6f11-8c5d-11ef-8554-7962625f6c6f",
        title: "sell-5226-2",
        startDate: "2024/10/17 15:58:00",
        endDate: "2024/10/17 15:58:07",
        type: "完成卖单",
        status: "已结束",
      },
      {
        id: "4908336b-8c5d-11ef-8551-7962625f6c6f",
        title: "sell-5226",
        startDate: "2024/10/17 15:56:43",
        endDate: "2024/10/17 15:56:49",
        type: "完成卖单",
        status: "已结束",
      },
      {
        id: "d1bc6403-8c4c-11ef-8543-7962625f6c6f",
        title: "测试内容-用户",
        startDate: "2024/10/17 14:00:00",
        endDate: "2024/10/24 23:59:59",
        type: "完成身份认证",
        status: "已结束",
      },
      {
        id: "c67a3521-8c2d-11ef-8539-7962625f6c6f",
        title: "測試時間",
        startDate: "2024/10/24 00:00:00",
        endDate: "2024/11/16 23:59:59",
        type: "完成买单",
        status: "已结束",
      },
    ];

    tableHtml = `
      <table class="table">
        <thead>
          <tr  class="table-secondary">
            <th>活动编号</th>
            <th>活动标题</th>
            <th>活动开始日期</th>
            <th>活动结束日期</th>
            <th>活动种类</th>
            <th>活动状态</th>
          </tr>
        </thead>
         <tbody class="table-group-divider">
          ${data
        .map(
          (item) => `
            <tr>
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewOrderDetail('${item.id}')">${item.id}</a></td>
              <td>${item.title}</td>
              <td>${item.startDate}</td>
              <td>${item.endDate}</td>
              <td>${item.type}</td>
              <td> 
                <span class="badge text-bg-${item.status == "进行中" ? "primary" : "success"}">${item.status}</span>
              </td>
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
  let hash = "/activity/info/?id=" + orderId;
  window.location.hash = hash;
};
