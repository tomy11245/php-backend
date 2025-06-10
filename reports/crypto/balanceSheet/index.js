// 声明为全局函数，这样 sidebarOnClick 可以调用

$(function () {
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


  // 重置按钮
  $("#resetBtn").click(function () {
    $("#duringDateStart").val("");
    $("#duringDateEnd").val("");
  });
  // 导出按钮
  $("#exportBtn").click(function () {
    console.log("导出"); requestData();
  });
});
function requestData() {
  let startDate = $("#duringDateStart").val();
  let endDate = $("#duringDateEnd").val();
  if (!isValidDateFormat(startDate) || !isValidDateFormat(endDate)) {
    alert("请输入正确的日期格式");
    return;
  }
  let cb = function (data) {

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

