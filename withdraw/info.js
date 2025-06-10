document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.hash.split("?")[1]);
    const orderNo = params.get("order_no");
    if (!orderNo) {
        document.getElementById("order-details").innerText = "找不到訂單編號。";
        return;
    }

    fetch(`./info.php?order_no=${orderNo}`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("order-details");
            if (data.error) {
                container.innerText = data.error;
                return;
            }
            container.innerHTML = `
                <p><strong>訂單號：</strong> ${data.order_no}</p>
                <p><strong>金額：</strong> ${data.amount}</p>
                <p><strong>狀態：</strong> ${data.status}</p>
                <p><strong>建立時間：</strong> ${data.created_at}</p>
                <p><strong>備註：</strong> ${data.note || ''}</p>
            `;
        })
        .catch(err => {
            document.getElementById("order-details").innerText = "載入失敗：" + err;
        });
});
