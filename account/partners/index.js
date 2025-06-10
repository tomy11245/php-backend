// 声明为全局函数，这样 sidebarOnClick 可以调用
$(function () {
  $(".paginationContent").load("/common/page/pagination/pagination.html");

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
g_data.total_page = 1;
g_data.api_url = "/api/partners/list.php";

function requestData() {
  // let orderNo = $("#orderNo").val();
  // let orderNoInput = $("#orderNoInput").val();
  // let encryptedNetwork = $("#encryptedNetwork").val();
  // let duringDateStart = $("#duringDateStart").val();
  // let duringDateEnd = $("#duringDateEnd").val();
  // let quantityNumMin = $("#quantityNumMin").val();
  // let quantityNumMax = $("#quantityNumMax").val();
  // if (duringDateStart && !isValidDateFormat(duringDateStart)) console.log("起始日期格式错误，请使用 YYYY-MM-DD 格式");
  // if (duringDateEnd && !isValidDateFormat(duringDateEnd)) console.log("结束日期格式错误，请使用 YYYY-MM-DD 格式");
  // if (quantityNumMin && typeof quantityNumMin != "number") console.log("最小数量格式错误，请输入数字");
  // if (quantityNumMax && typeof quantityNumMax != "number") console.log("最大数量格式错误，请输入数字");

  let cb = function (data) {
    data = data.data
    data = data.list;
    let tableHtml = `
      <table class="table">
        <thead>
          <tr class="table-secondary">
            <th>商户名称</th>
            <th>YU币可用余额</th>
            <th>YU币冻结数量</th>
            <th>YU币已缴保证金</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          ${data
            .map(
              (item) => `
            <tr>
              <td><a href="javascript:void(0)" onclick="g_data.viewPartnersDetail('${item.id}')" class="text-primary">${item.name}</a></td>
              <td>${item.available}</td>
              <td>${item.frozen}</td>
              <td>${item.guarantee}</td>
              <td><span class="badge text-bg-success">${item.status}</span></td>
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

g_data.passwordResetRequest = function () {
  console.log("重设密码要求");
  // 实现重设密码要求逻辑
  let hash = "/account/partners/passwordResetRequest/";
  window.location.hash = hash;
};


g_data.viewPartnersDetail = function (id) {
  const hash = `/account/partners/info/?id=${id}`;
  window.location.hash = hash;
};

g_data.createPartners = function () {
  createPartnerModalInstance = new bootstrap.Modal(document.getElementById("createPartnerModal"));
  createPartnerModalInstance.show();

  $('#createPartnerModal').removeClass('show').hide();
  $('.modal-backdrop').remove();
  $('body').removeClass('modal-open').css({ 'overflow': '', 'padding-right': '' });

};

// 綁定「儲存」按鈕
$("#saveNewPartnerBtn").on("click", function () {
  const name = $("#partnerNameInput").val().trim();
  const code = $("#partnerCodeInput").val().trim();
  const account = $("#partnerAccountInput").val().trim();
  const inviter = $("#partnerInviterInput").val().trim();
  const min_recharge = $("#partnerMinRechargeInput").val().trim();
  const payout_min = $("#partnerPayoutMinInput").val().trim();
  const payout_max = $("#partnerPayoutMaxInput").val().trim();
  const min_withdraw = $("#partnerMinWithdrawInput").val().trim();

  if (!name || !code || !account) {
    alert("商戶名稱、代號與帳號為必填");
    return;
  }

  if (!/^[A-Z]{4}$/.test(code)) {
    alert("商戶代號必須是 4 個大寫英文字母");
    return;
  }

  $.post("/api/partners/create.php", {
    name,
    code,
    account,
    inviter,
    min_recharge,
    payout_min,
    payout_max,
    min_withdraw
  }, function (res) {
    if (res.success) {
      alert("新增成功");
      $("#createPartnerModal").modal("hide");
      location.reload();
    } else {
      alert("新增失敗：" + (res.message || "請稍後再試"));
    }
  });
});