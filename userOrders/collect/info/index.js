function renderOrderDetail() {
  const hash = window.location.hash;
  if (!hash.includes("?")) return;

  const queryStr = hash.includes("?") ? hash.split("?")[1] : "";
  const params = new URLSearchParams(queryStr);
  id = params.get("id");

  if (!id) {
    $(".detailContent").html("<p class='text-danger'>找不到訂單 ID。</p>");
    return;
  }

  $.get("../../../api/user_collect_orders/info.php?id=" + encodeURIComponent(id), function (res) {
    if (res.success) {
      const item = res.data;
      let html = `
        <h2>订单详情</h2>
        <table class="table table-bordered">
          <tr><th>系统订单号</th><td>${item.order_no}</td></tr>
          <tr><th>用户编号</th><td>${item.user_id}</td></tr>
          <tr><th>用户帐号</th><td>${item.account}</td></tr>
          <tr><th>发送方</th><td>${item.address}</td></tr>
          <tr><th>转入数量 (USDT)</th><td>${item.amount}</td></tr>
          <tr><th>获得数量 (YU币)</th><td>${item.out_amount}</td></tr>
          <tr><th>汇率</th><td>${item.rate}</td></tr>
          <tr><th>时间</th><td>${item.created_at}</td></tr>
          <tr><th>交易序号</th><td>${item.note}</td></tr>
        </table>`;
      $(".detailContent").html(html);
    } else {
      $(".detailContent").html("<p class='text-danger'>" + res.message + "</p>");
    }
  });
}

// 第一次頁面加載時也執行
window.addEventListener("load", renderOrderDetail);
// 每次 hash 改變也執行（前端切換頁）
window.addEventListener("hashchange", renderOrderDetail);
