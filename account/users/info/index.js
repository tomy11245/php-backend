$(function () {
  let params = g_util.hash2params(window.location.hash);
  let userId = params.id;
  console.log("userId", userId);
  requestData(userId);
  // 获取URL参数
  g_data.highlightSidebar("/account/users/", "用户详情");
});
function requestData(uid) {
  $.ajax({
    url: `/api/users/detail.php?id=${encodeURIComponent(uid)}`,
    type: "GET",
    success: function (res) {
      if (res.code === 0) {
        renderUserDetail(res.data);
      } else {
        $(".dataContent").html(`<div class="text-danger">查無此用戶</div>`);
      }
    },
    error: function () {
      $(".dataContent").html(`<div class="text-danger">請求失敗</div>`);
    },
  });
}
function renderUserDetail(data) {
  let tableHtml = `<div class="table-box">`;

  // 用戶資訊
  tableHtml += `
    <table class="table-item table table-borderless">
      <thead class="table-secondary"><tr><td>用户信息</td></tr></thead>
      <tbody>
        <tr><td>用户号:</td></tr>
        <tr><td>${data.uid} <button class="btn btn-sm btn-outline-dark">重置用户密码</button></td></tr>
        <tr><td>账号:</td></tr>
        <tr><td>${data.account}</td></tr>
        <tr><td>用户角色:</td></tr>
        <tr><td>${data.role || "未知"}</td></tr>
        <tr><td>VIP等级:</td></tr>
        <tr><td>VIP ${data.vip_level || 0}</td></tr>
        <tr><td>安全验证:</td></tr>
        <tr><td>资金密码-${data.security_verified ? "已设定" : "未设定"}</td></tr>
        <tr><td>收币地址:</td></tr>
        <tr><td>
          Tron: ${getWallet(data.wallets, 'Tron')}<br>
          YUff: ${getWallet(data.wallets, 'YU')}
        </td></tr>
        <tr><td>状态:</td></tr>
        <tr><td><div class="form-check form-switch"><input class="form-check-input" type="checkbox" role="switch" id="statusSwitch" ${data.status === '正常' ? 'checked' : ''}></div></td></tr>
        <tr><td>黑名单:</td></tr>
        <tr><td>${data.blacklist === 1 ? "正常用户" : "黑名单用户"}</td></tr>
        <tr><td>创建时间:</td></tr>
        <tr><td>${data.created_at}</td></tr>
      </tbody>
    </table>
  `;

  // 身份認證
  tableHtml += `
    <table class="table-item table table-borderless">
      <thead class="table-secondary"><tr><td>身份认证审核</td></tr></thead>
      <tbody>
        <tr><td>状态:</td></tr>
        <tr><td>${data.identity_status || '未知'}</td></tr>
        <tr><td>国家/地区:</td></tr>
        <tr><td>${data.country || '-'}</td></tr>
        <tr><td>姓:</td></tr>
        <tr><td>${data.last_name || '-'}</td></tr>
        <tr><td>名:</td></tr>
        <tr><td>${data.first_name || '-'}</td></tr>
        <tr><td>身份证号:</td></tr>
        <tr><td>${data.id_number || '-'}</td></tr>
        <tr><td>身份证照片:</td></tr>
        <tr><td>
          <a href="javascript:void(0)" onclick="g_data.viewImage('${data.id_photo_front}')">正面</a>
          <a href="javascript:void(0)" onclick="g_data.viewImage('${data.id_photo_back}')">反面</a>
        </td></tr>
        <tr><td>隐藏内容:</td></tr>
        <tr><td>${data.hidden_text || '-'}</td></tr>
        <tr><td>视频:</td></tr>
        <tr><td><a href="javascript:void(0)" onclick="g_data.viewVideo('${data.video_url}')">查看视频</a></td></tr>
      </tbody>
    </table>
  `;

  // 錢包資料
  tableHtml += `
    <table class="table-item table table-borderless">
      <thead class="table-secondary"><tr>
        <th>币种</th><th>可用余额</th><th>冻结</th><th>保证金</th><th>操作</th>
      </tr></thead><tbody>
  `;

  if (data.wallets.length) {
    data.wallets.forEach(w => {
      tableHtml += `
        <tr>
          <td>${w.currency}</td>
          <td>${w.available}</td>
          <td>${w.frozen}</td>
          <td>${w.guarantee}</td>
          <td><a href="javascript:void(0)" onclick="g_data.openWalletActionModal('${w.currency}', '${w.uid}')">操作</a></td>
        </tr>
      `;
    });
  } else {
    tableHtml += `<tr><td colspan="5">暂无钱包数据</td></tr>`;
  }

  tableHtml += `</tbody></table></div>`;
  $(".dataContent").html(tableHtml);
}

g_data.submitWalletAction = function (uid, currency) {
  const amount = parseFloat($("#walletAmount").val());
  const action = $("#walletActionType").val();

  if (!amount || !action) {
    alert("請選擇操作與輸入數量");
    return;
  }

  fetch("/api/users/wallet_action.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, amount, action, currency })
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 0) {
        alert("操作成功");
        $("#walletModal").remove();
        requestData(uid); // 重新查詢
      } else {
        alert("操作失敗：" + res.message);
      }
    });
};



g_data.openWalletActionModal = function (currency, uid) {
  const modal = `
  <div class="modal" id="walletModal" style="position:fixed;z-index:9999;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);">
    <div style="background:#fff;padding:20px;border-radius:8px;width:460px;">
      <h5 class="mb-3">操作商户币</h5>
      <div class="mb-3 d-flex align-items-center gap-2">
        <label class="mb-0">数量：</label>
        <select class="form-select w-auto" id="walletActionType">
          <option value="">- 选择操作 -</option>
          <option value="increase">增加可用余额</option>
          <option value="decrease">减少可用余额</option>
        </select>
        <input type="number" class="form-control w-25" id="walletAmount" placeholder="请输入数额" />
        <span>${currency}</span>
      </div>
      <div class="d-flex justify-content-end gap-2 mt-4">
        <button class="btn btn-secondary" onclick="$('#walletModal').remove()">取消</button>
        <button class="btn btn-primary" onclick="g_data.submitWalletAction('${uid}', '${currency}')">保存</button>
      </div>
    </div>
  </div>`;
  $("body").append(modal);
};


// 根據幣種取地址
function getWallet(wallets, currency) {
  let wallet = wallets.find(w => w.currency === currency);
  return wallet ? wallet.address : "-";
}

// g_data.viewTxDetail = function (txId) {
//   console.log("查看交易详情:", txId);
//   window.open("https://nile.tronscan.org/#/transaction/" + txId, "_blank");
// };
// // 查看视频
// g_data.viewVideo = function (id, videoUrl) {
//   console.log("查看视频:", videoUrl);
//   // 设置 Modal 标题
//   $("#exampleModalLabel").text("查看视频");
//   // 插入视频
//   $(id).find(".modal-body").html(`<video src="${videoUrl}" controls></video>`);
//   $(id).find("video").get(0).autoplay = true;
//   // 显示 Modal
//   $(id).modal("show");
//   $(id)
//     .off("hidden.bs.modal")
//     .on("hidden.bs.modal", function () {
//       let video = $(this).find("video").get(0);
//       if (video) {
//         video.pause();
//         video.src = "";
//       }
//       $(this).find(".modal-body").empty();
//     });
// };

// // 查看图片
// g_data.viewImage = function (id, imageUrl) {
//   console.log("查看图片:", imageUrl);
//   $("#exampleModalLabel").text("查看图片");
//   $(id).find(".modal-body").html(`<img src="${imageUrl}" alt="图片">`);
//   $(id).modal("show");
// };
