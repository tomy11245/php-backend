document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.hash.split('?')[1]);
  const orderNo = params.get("system_order_no");

  if (!orderNo) {
    document.getElementById("order-details").innerText = "查無訂單編號。";
    return;
  }

  fetch(`./info.php?system_order_no=${orderNo}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("order-details");
      if (data.error) {
        container.innerText = data.error;
        return;
      }
      container.innerHTML = `
        <p><strong>系統訂單號：</strong> ${data.system_order_no}</p>
        <p><strong>商戶訂單號：</strong> ${data.merchant_order_no}</p>
        <p><strong>商戶名稱：</strong> ${data.merchant_name}</p>
        <p><strong>用戶號：</strong> ${data.user_code}</p>
        <p><strong>用戶帳號：</strong> ${data.user_account}</p>
        <p><strong>幣種：</strong> ${data.coin_type}</p>
        <p><strong>數量：</strong> ${data.amount}</p>
        <p><strong>服務費：</strong> ${data.fee}</p>
        <p><strong>建立時間：</strong> ${data.created_at}</p>
      `;
    })
    .catch(err => {
      document.getElementById("order-details").innerText = "載入錯誤：" + err;
    });
});
