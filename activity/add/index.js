// 声明为全局函数，这样 sidebarOnClick 可以调用

$(function () {
  // "所有顾客"复选框联动
  $("#checkAll").on("change", function () {
    const isChecked = $(this).prop("checked");
    $('input[type="checkbox"][value^="vip"]').prop("checked", isChecked);
  });

  // VIP复选框联动
  $('input[type="checkbox"][value^="vip"]').on("change", function () {
    updateCheckAllStatus();
    // 任何VIP选中时移除错误标记
    if ($('input[type="checkbox"][value^="vip"]:checked').length > 0) {
      $("#checkAll").removeClass("is-invalid");
    }
  });

  // 为所有必填字段添加change事件，当值改变时移除is-invalid类
  $("input[required], select[required], textarea[required]").on("input change", function () {
    if ($(this).val()) {
      $(this).removeClass("is-invalid");
    }
  });

  // 添加日期和时间输入框的change事件
  $("#startDate, #startTime, #endDate, #endTime").on("change", function () {
    validateDateTimeRange();
  });

  // 点击新增按钮事件处理
  $("#submitBtn").on("click", function (e) {
    e.preventDefault(); // 阻止表单默认提交行为

    // 表单验证
    let isValid = validateForm();

    if (isValid) {
      // 表单验证通过，执行提交
      submitForm();
    }
    // 如果验证失败，不执行任何操作
  });
});

// 验证日期时间范围
function validateDateTimeRange() {
  const startDate = $("#startDate").val();
  const startTime = $("#startTime").val();
  const endDate = $("#endDate").val();
  const endTime = $("#endTime").val();

  if (startDate && startTime && endDate && endTime) {
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (startDateTime > endDateTime) {
      $("#startDate, #startTime, #endDate, #endTime").addClass("is-invalid");
      return false;
    } else {
      $("#startDate, #startTime, #endDate, #endTime").removeClass("is-invalid");
      return true;
    }
  }
  return true; // 如果没有完整的日期和时间，暂不验证
}

// 表单验证函数
function validateForm() {
  let isValid = true;

  // 验证所有带required属性的输入元素
  $("input[required], select[required], textarea[required]").each(function () {
    if (!$(this).val()) {
      $(this).addClass("is-invalid");
      isValid = false;
    }
  });

  // 验证日期和时间
  if (!validateDateTimeRange()) {
    alert("活动开始时间不能晚于结束时间");
    isValid = false;
  }

  return isValid;
}

// 更新"所有顾客"复选框状态
function updateCheckAllStatus() {
  const allVipCheckboxes = $('input[type="checkbox"][value^="vip"]');
  const checkedVipCheckboxes = allVipCheckboxes.filter(":checked");

  if (checkedVipCheckboxes.length === 0) {
    // 如果没有VIP复选框被选中，取消选择"所有顾客"
    $("#checkAll").prop("checked", false);
    $("#checkAll").prop("indeterminate", false);
  } else if (checkedVipCheckboxes.length === allVipCheckboxes.length) {
    // 如果所有VIP复选框都被选中，选中"所有顾客"
    $("#checkAll").prop("checked", true);
    $("#checkAll").prop("indeterminate", false);
  } else {
    // 如果部分VIP复选框被选中，"所有顾客"设为不确定状态
    $("#checkAll").prop("checked", false);
    $("#checkAll").prop("indeterminate", true);
  }
}

function submitForm() {
  // 收集表单数据
  const formData = new FormData($("#activityForm")[0]);

  // 收集选中的VIP级别
  const selectedVips = $('input[type="checkbox"][value^="vip"]:checked')
    .map(function () {
      return $(this).val();
    })
    .get();
  formData.append("targetUsers", JSON.stringify(selectedVips));

  console.log("提交表单数据");

  // 实际提交数据
  $.ajax({
    url: g_data.api_url || "/api/activity/add",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (res) {
      alert("活动创建成功!");
      // 重置表单
      $("#activityForm")[0].reset();
      // 移除所有验证标记
      $(".is-invalid").removeClass("is-invalid");
    },
    error: function (err) {
      console.log(err);
      alert("活动创建失败，请重试");
    },
  });
}

function requestData() {
  let cb = function (data) {};
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
