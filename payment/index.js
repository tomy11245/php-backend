document.addEventListener("DOMContentLoaded", function () {
    fetch("./list.php")
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById("order-table-body");
            data.forEach(order => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${order.order_no}</td>
                    <td>${order.amount}</td>
                    <td>${order.status}</td>
                    <td>${order.created_at}</td>
                    <td><a href="#/payment/info?order_no=${order.order_no}">查看</a></td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(err => console.error("載入失敗：", err));
});
