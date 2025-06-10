$(function () {
  // 初始化数据
  requestData();

  // 设置表单变更监听
  setupFormChangeListeners();
});

// 存储原始数据，用于检测变更
g_data.originalData = {
  user: {},
  merchant: {},
  agent: {},
  fee: {}
};

function requestData() {
  let cb = function (response) {
    // 模拟数据，实际应用中从服务器获取
    const data = {
      status: "success",
      data: {
        user: {
          flashExchangeRate: "6.8"
        },
        merchant: {
          flashExchangeRate: "6.9",
          withdrawRate: "7.0",
          withdrawEnabled: true,
          transferEnabled: true
        },
        agent: {
          flashExchangeRate: "7.0",
          withdrawRate: "7.1",
          withdrawEnabled: true,
          transferEnabled: true
        },
        fee: {
          paymentFeeRate: "0.5",
          paymentCommissionRateAgent: "60",
          paymentCommissionRateSuperAgent: "20",
          rechargeFeeRate: "0.3",
          rechargeCommissionRateAgent: "50",
          rechargeCommissionRateSuperAgent: "25",
          sellOrderFeeRate: "0.6",
          sellOrderCommissionRateAgent: "55",
          sellOrderCommissionRateSuperAgent: "15"
        }
      }
    };

    if (response && response.status === "success") {
      // 使用API返回的数据
      populateFormData(response.data);
    } else {
      // 使用模拟数据
      populateFormData(data.data);
    }
  };

  $.ajax({
    url: g_data.api_url || "/api/c2cFeeSetting",
    type: "GET",
    success: function (res) {
      cb(res);
    },
    error: function (err) {
      console.log("API请求错误：", err);
      // 使用模拟数据
      cb(null);
    }
  });
}

// 填充表单数据
function populateFormData(data) {
  // 保存原始数据以便检测变更
  Object.assign(g_data.originalData.user, data.user);
  Object.assign(g_data.originalData.merchant, data.merchant);
  Object.assign(g_data.originalData.agent, data.agent);
  Object.assign(g_data.originalData.fee, data.fee);

  // 用户汇率
  $("#userFlashExchangeRate").val(data.user.flashExchangeRate);

  // 商户汇率
  $("#merchantFlashExchangeRate").val(data.merchant.flashExchangeRate);
  $("#merchantWithdrawRate").val(data.merchant.withdrawRate);
  $("#merchantWithdrawSwitch").prop("checked", data.merchant.withdrawEnabled);
  $("#merchantTransferSwitch").prop("checked", data.merchant.transferEnabled);

  // 代理商汇率
  $("#agentFlashExchangeRate").val(data.agent.flashExchangeRate);
  $("#agentWithdrawRate").val(data.agent.withdrawRate);
  $("#agentWithdrawSwitch").prop("checked", data.agent.withdrawEnabled);
  $("#agentTransferSwitch").prop("checked", data.agent.transferEnabled);

  // 商户费率
  $("#paymentFeeRate").val(data.fee.paymentFeeRate);
  $("#paymentCommissionRateAgent").val(data.fee.paymentCommissionRateAgent);
  $("#paymentCommissionRateSuperAgent").val(data.fee.paymentCommissionRateSuperAgent);
  $("#rechargeFeeRate").val(data.fee.rechargeFeeRate);
  $("#rechargeCommissionRateAgent").val(data.fee.rechargeCommissionRateAgent);
  $("#rechargeCommissionRateSuperAgent").val(data.fee.rechargeCommissionRateSuperAgent);
  $("#sellOrderFeeRate").val(data.fee.sellOrderFeeRate);
  $("#sellOrderCommissionRateAgent").val(data.fee.sellOrderCommissionRateAgent);
  $("#sellOrderCommissionRateSuperAgent").val(data.fee.sellOrderCommissionRateSuperAgent);

  // 更新开关标签文本
  updateSwitchLabels();
}

// 根据开关状态更新标签文本
function updateSwitchLabels() {
  $(".form-check-input[type='checkbox']").each(function () {
    const isChecked = $(this).prop("checked");
    $(this).next("label").text(isChecked ? "已开启" : "已关闭");
  });
}

// 设置表单变更监听
function setupFormChangeListeners() {
  // 用户汇率变更
  $("#userFlashExchangeRate").on("input", function () {
    const isChanged = $(this).val() !== g_data.originalData.user.flashExchangeRate;
    $("#userRateUpdateBtn").prop("disabled", !isChanged);
  });

  // 商户汇率变更
  $("#merchantFlashExchangeRate, #merchantWithdrawRate").on("input", function () {
    checkMerchantRateChanges();
  });

  $("#merchantWithdrawSwitch, #merchantTransferSwitch").on("change", function () {
    $(this).next("label").text($(this).prop("checked") ? "已开启" : "已关闭");
    checkMerchantRateChanges();
  });

  // 代理商汇率变更
  $("#agentFlashExchangeRate, #agentWithdrawRate").on("input", function () {
    checkAgentRateChanges();
  });

  $("#agentWithdrawSwitch, #agentTransferSwitch").on("change", function () {
    $(this).next("label").text($(this).prop("checked") ? "已开启" : "已关闭");
    checkAgentRateChanges();
  });

  // 商户费率变更 - 修改为监听所有相关字段
  $("#paymentFeeRate, #paymentCommissionRateAgent, #paymentCommissionRateSuperAgent, " +
    "#rechargeFeeRate, #rechargeCommissionRateAgent, #rechargeCommissionRateSuperAgent, " +
    "#sellOrderFeeRate, #sellOrderCommissionRateAgent, #sellOrderCommissionRateSuperAgent").on("input", function () {
      checkMerchantFeeChanges();
    });

  // 设置更新按钮点击事件
  $("#userRateUpdateBtn").on("click", function () {
    if (!$(this).prop("disabled")) {
      updateUserRate();
    }
  });

  $("#merchantRateUpdateBtn").on("click", function () {
    if (!$(this).prop("disabled")) {
      updateMerchantRate();
    }
  });

  $("#agentRateUpdateBtn").on("click", function () {
    if (!$(this).prop("disabled")) {
      updateAgentRate();
    }
  });

  $("#merchantFeeUpdateBtn").on("click", function () {
    if (!$(this).prop("disabled")) {
      updateMerchantFee();
    }
  });
}

// 检查商户汇率是否有变更
function checkMerchantRateChanges() {
  const flashRateChanged = $("#merchantFlashExchangeRate").val() !== g_data.originalData.merchant.flashExchangeRate;
  const withdrawRateChanged = $("#merchantWithdrawRate").val() !== g_data.originalData.merchant.withdrawRate;
  const withdrawSwitchChanged = $("#merchantWithdrawSwitch").prop("checked") !== g_data.originalData.merchant.withdrawEnabled;
  const transferSwitchChanged = $("#merchantTransferSwitch").prop("checked") !== g_data.originalData.merchant.transferEnabled;

  $("#merchantRateUpdateBtn").prop("disabled", !(flashRateChanged || withdrawRateChanged || withdrawSwitchChanged || transferSwitchChanged));
}

// 检查代理商汇率是否有变更
function checkAgentRateChanges() {
  const flashRateChanged = $("#agentFlashExchangeRate").val() !== g_data.originalData.agent.flashExchangeRate;
  const withdrawRateChanged = $("#agentWithdrawRate").val() !== g_data.originalData.agent.withdrawRate;
  const withdrawSwitchChanged = $("#agentWithdrawSwitch").prop("checked") !== g_data.originalData.agent.withdrawEnabled;
  const transferSwitchChanged = $("#agentTransferSwitch").prop("checked") !== g_data.originalData.agent.transferEnabled;

  $("#agentRateUpdateBtn").prop("disabled", !(flashRateChanged || withdrawRateChanged || withdrawSwitchChanged || transferSwitchChanged));
}

// 检查商户费率是否有变更
function checkMerchantFeeChanges() {
  // 检查所有商户费率字段是否有变更
  const paymentFeeChanged = $("#paymentFeeRate").val() !== g_data.originalData.fee.paymentFeeRate;
  const paymentCommissionAgentChanged = $("#paymentCommissionRateAgent").val() !== g_data.originalData.fee.paymentCommissionRateAgent;
  const paymentCommissionSuperAgentChanged = $("#paymentCommissionRateSuperAgent").val() !== g_data.originalData.fee.paymentCommissionRateSuperAgent;
  const rechargeFeeChanged = $("#rechargeFeeRate").val() !== g_data.originalData.fee.rechargeFeeRate;
  const rechargeCommissionAgentChanged = $("#rechargeCommissionRateAgent").val() !== g_data.originalData.fee.rechargeCommissionRateAgent;
  const rechargeCommissionSuperAgentChanged = $("#rechargeCommissionRateSuperAgent").val() !== g_data.originalData.fee.rechargeCommissionRateSuperAgent;
  const sellOrderFeeChanged = $("#sellOrderFeeRate").val() !== g_data.originalData.fee.sellOrderFeeRate;
  const sellOrderCommissionAgentChanged = $("#sellOrderCommissionRateAgent").val() !== g_data.originalData.fee.sellOrderCommissionRateAgent;
  const sellOrderCommissionSuperAgentChanged = $("#sellOrderCommissionRateSuperAgent").val() !== g_data.originalData.fee.sellOrderCommissionRateSuperAgent;

  // 如果任意字段有变更，启用更新按钮
  $("#merchantFeeUpdateBtn").prop("disabled", !(
    paymentFeeChanged ||
    paymentCommissionAgentChanged ||
    paymentCommissionSuperAgentChanged ||
    rechargeFeeChanged ||
    rechargeCommissionAgentChanged ||
    rechargeCommissionSuperAgentChanged ||
    sellOrderFeeChanged ||
    sellOrderCommissionAgentChanged ||
    sellOrderCommissionSuperAgentChanged
  ));
}

// 更新用户汇率
function updateUserRate() {
  const updatedData = {
    flashExchangeRate: $("#userFlashExchangeRate").val()
  };

  sendUpdateRequest("/api/updateUserRate", updatedData, function (success) {
    if (success) {
      // 更新成功，更新原始数据
      g_data.originalData.user.flashExchangeRate = updatedData.flashExchangeRate;
      $("#userRateUpdateBtn").prop("disabled", true);
      alert("用户汇率更新成功");
    }
  });
}

// 更新商户汇率
function updateMerchantRate() {
  const updatedData = {
    flashExchangeRate: $("#merchantFlashExchangeRate").val(),
    withdrawRate: $("#merchantWithdrawRate").val(),
    withdrawEnabled: $("#merchantWithdrawSwitch").prop("checked"),
    transferEnabled: $("#merchantTransferSwitch").prop("checked")
  };

  sendUpdateRequest("/api/updateMerchantRate", updatedData, function (success) {
    if (success) {
      // 更新成功，更新原始数据
      Object.assign(g_data.originalData.merchant, updatedData);
      $("#merchantRateUpdateBtn").prop("disabled", true);
      alert("商户汇率更新成功");
    }
  });
}

// 更新代理商汇率
function updateAgentRate() {
  const updatedData = {
    flashExchangeRate: $("#agentFlashExchangeRate").val(),
    withdrawRate: $("#agentWithdrawRate").val(),
    withdrawEnabled: $("#agentWithdrawSwitch").prop("checked"),
    transferEnabled: $("#agentTransferSwitch").prop("checked")
  };

  sendUpdateRequest("/api/updateAgentRate", updatedData, function (success) {
    if (success) {
      // 更新成功，更新原始数据
      Object.assign(g_data.originalData.agent, updatedData);
      $("#agentRateUpdateBtn").prop("disabled", true);
      alert("代理商汇率更新成功");
    }
  });
}

// 更新商户费率
function updateMerchantFee() {
  const updatedData = {
    paymentFeeRate: $("#paymentFeeRate").val(),
    paymentCommissionRateAgent: $("#paymentCommissionRateAgent").val(),
    paymentCommissionRateSuperAgent: $("#paymentCommissionRateSuperAgent").val(),
    rechargeFeeRate: $("#rechargeFeeRate").val(),
    rechargeCommissionRateAgent: $("#rechargeCommissionRateAgent").val(),
    rechargeCommissionRateSuperAgent: $("#rechargeCommissionRateSuperAgent").val(),
    sellOrderFeeRate: $("#sellOrderFeeRate").val(),
    sellOrderCommissionRateAgent: $("#sellOrderCommissionRateAgent").val(),
    sellOrderCommissionRateSuperAgent: $("#sellOrderCommissionRateSuperAgent").val()
  };

  sendUpdateRequest("/api/updateMerchantFee", updatedData, function (success) {
    if (success) {
      // 更新成功，更新原始数据
      Object.assign(g_data.originalData.fee, updatedData);
      $("#merchantFeeUpdateBtn").prop("disabled", true);
      alert("商户费率更新成功");
    }
  });
}

// 发送更新请求
function sendUpdateRequest(url, data, callback) {
  // 模拟API请求
  console.log("发送更新请求:", url, data);

  // 实际应用中应该使用$.ajax发送请求
  setTimeout(function () {
    console.log("更新成功");
    callback(true);
  }, 500);

  // 实际的AJAX请求代码:
  /*
  $.ajax({
    url: url,
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function(res) {
      if (res.status === "success") {
        callback(true);
      } else {
        alert("更新失败: " + res.message);
        callback(false);
      }
    },
    error: function(err) {
      console.log(err);
      alert("更新请求失败，请重试");
      callback(false);
    }
  });
  */
}

