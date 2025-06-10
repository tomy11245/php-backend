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
g_data.total_page = 5;
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
        operator: "hugo",
        startTime: "2024/10/29 14:24:03",
        endTime: "2024/10/29 14:26:57",
        operationType: "增加可用余额",
        amount: 60000.0,
        target: "JBP",
        startIp: "34.92.4.123",
        endIp: "34.92.4.123",
        status: "审核通過",
        reviewer: "admin",
        reviewInfo: "test",
      },
      {
        operator: "adminwhite",
        startTime: "2024/10/29 14:19:27",
        endTime: "2024/10/29 14:19:45",
        operationType: "增加可用余额",
        amount: 10000000000.0,
        target: "white",
        startIp: "34.92.173.0",
        endIp: "34.92.173.0",
        status: "审核通過",
        reviewer: "admin",
        reviewInfo: "test",
      },
      {
        operator: "admin",
        startTime: "2024/10/28 12:54:29",
        endTime: "2024/10/29 10:40:40",
        operationType: "增加可用余额",
        amount: 10.0,
        target: "UID868192007",
        startIp: "34.92.4.123",
        endIp: "34.92.4.123",
        status: "审核通過",
        reviewer: "adminwhite",
        reviewInfo: "test",
      },
      {
        operator: "admin",
        startTime: "2024/10/28 11:55:17",
        endTime: "2024/10/28 12:19:47",
        operationType: "增加可用余额",
        amount: 10000000000.0,
        target: "YuBiTest1",
        startIp: "34.92.173.0",
        endIp: "34.92.173.0",
        status: "審核通過",
        reviewer: "adminwhite",
        reviewInfo: "test",
      },
      {
        operator: "admin",
        startTime: "2024/10/21 16:10:58",
        endTime: "2024/10/21 16:31:59",
        operationType: "增加可用余额",
        amount: 1000.0,
        target: "YUBITEST",
        startIp: "34.92.4.123",
        endIp: "34.92.173.0",
        status: "審核通過",
        reviewer: "adminwhite",
        reviewInfo: "test",
      },
      {
        operator: "admin",
        startTime: "2024/10/21 16:10:37",
        endTime: null,
        operationType: "追加保证金",
        amount: 5000.0,
        target: "YUBITEST",
        startIp: "34.92.4.123",
        endIp: null,
        status: null,
        reviewer: null,
        reviewInfo: null,
      },
      {
        operator: "admin",
        startTime: "2024/10/21 16:10:25",
        endTime: null,
        operationType: "解除冻结",
        amount: 2222.0,
        target: "YUBITEST",
        startIp: "34.92.4.123",
        endIp: null,
        status: null,
        reviewer: null,
        reviewInfo: null,
      },
      {
        operator: "admin",
        startTime: "2024/10/21 16:05:52",
        endTime: null,
        operationType: "追加冻结",
        amount: 2222.0,
        target: "YUBITEST",
        startIp: "34.92.173.0",
        endIp: null,
        status: null,
        reviewer: null,
        reviewInfo: null,
      },
      {
        operator: "admin",
        startTime: "2024/10/21 15:38:03",
        endTime: "2024/10/29 15:24:26",
        operationType: "增加可用余额",
        amount: 11.0,
        target: "denny",
        startIp: "34.92.173.0",
        endIp: "34.92.173.0",
        status: "審核通過",
        reviewer: "adminwhite",
        reviewInfo: "test",
      },
      {
        operator: "admin",
        startTime: "2024/10/21 11:06:34",
        endTime: "2024/10/29 15:24:30",
        operationType: "减少可用余额",
        amount: 50.0,
        target: "UID100000001",
        startIp: "34.92.173.0",
        endIp: "34.92.173.0",
        status: "審核通過",
        reviewer: "adminwhite",
        reviewInfo: "test",
      },
    ];

    // 在 data 数组定义后添加一个映射来存储数据
    g_data.reviewItems = {};

    let tableHtml = `
      <table class="table">
        <thead>
          <tr class="table-secondary">
            <th>操作人员</th>
            <th>操作时间</th>
            <th>操作类型</th>
            <th>操作数量 (YU币)</th>
            <th>用户号/商户名称/代理商名称</th>
            <th>操作IP地址</th>
            <th>审核</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          ${data
        .map((item, index) => {
          // 保存每个项到引用映射
          g_data.reviewItems[index] = item;
          return `
                <tr>
                  <td>${item.operator}</td>
                  <td>
                    ${item.startTime} (发起)<br>
                    ${item.endTime ? `${item.endTime} (已审核)` : ""}
                  </td>
                  <td>${item.operationType}</td>
                  <td>${item.amount.toLocaleString()}</td>
                  <td>
                   <a href="javascript:void(0)" onclick="g_data.viewPartnersDetail('${item.target}')" class="text-primary">${item.target}</a>
                  </td>
                  <td>
                    ${item.startIp} (发起)<br>
                    ${item.endIp ? `${item.endIp} (已审核)` : ""}
                  </td>
                  <td>
                    ${item.status
              ? `${item.status} (${item.reviewer})<br> <a href="javascript:void(0)" onclick="g_data.viewReviewDetail(${index})">查看申请信息</a>)`
              : "-"
            }
                  </td>
                </tr>
              `;
        })
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
// requestData();
// 检查日期格式
function isValidDateFormat(dateStr) {
  // 检查日期格式是否为 YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  // 检查日期是否有效
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
}

g_data.viewReviewDetail = function (index) {
  const item = g_data.reviewItems[index];
  // console.log(item);
  console.log("查看申请信息:", item.operationType + " " + item.amount + " " + item.reviewInfo);
};
