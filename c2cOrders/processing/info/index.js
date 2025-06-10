$(function () {
  let params = g_util.hash2params(window.location.hash);
  let orderId = params.id;
  console.log("/c2cOrders/processing/info/", orderId);
  g_data.highlightSidebar("/c2cOrders/processing/", "订单详情");
  requestData(orderId);
});

function requestData(params) {
  let cb = function (data) {
    data = {
      status: "success",
      data: {
        orderInfo: {
          systemOrderNo: "B25031100774133105848",
          sourceOrderNo: "S25030700609928848306",
          status: "付款中",
          createTime: "2025/03/11 15:16:53",
          matchTime: "2025/03/11 15:16:54",
          payTime: "-",
          completeTime: "-",
        },
        paymentMethod: {
          buyerPaymentMethod: {
            type: "支付宝",
            name: "Dave Turner",
            alipayAccount: "1255833836363",
            qrCode: "https://line.me/ti/p/SJVOab-Hys",
          },
          sellerPaymentMethod: {
            type: "支付宝",
            name: "纪晓岚",
            alipayAccount: "123123",
            qrCode: "https://line.me/ti/p/SJVOab-Hys",
          },
        },
        transactionManagement: {
          buyer: "UID100000004",
          seller: "UID459834651",
          amount: "500.00",
          currency: "YU币",
          price: "500.00",
          priceCurrency: "CNY",
          priceRate: "1.00",
          sellerFee: "-",
          agentProfit: "-",
          buyerVoucher: "-",
        },
      },
    };

    let orderInfoHtml = `
      <table class="table table-borderless">
        <tr class="table-secondary">
          <th>订单信息</th>
        </tr>
        <tr>
          <td>系统订单号:</td>
        </tr>
        <tr>
          <td>${data.data.orderInfo.systemOrderNo}</td>
        </tr>
        <tr>
          <td>来源订单:</td>
        </tr>
        <tr>
          <td><a href="javascript:void(0)" onclick="g_data.viewTransactionDetail('${data.data.orderInfo.sourceOrderNo}')">${data.data.orderInfo.sourceOrderNo}</a></td>
        </tr>
        <tr>
          <td>状态:</td>
        </tr>
        <tr>
          <td>${data.data.orderInfo.status}</td>
        </tr>
        <tr>
          <td>创建时间:</td>
        </tr>
        <tr>
          <td>${data.data.orderInfo.createTime}</td>
        </tr>
        <tr>
          <td>匹配时间:</td>
        </tr>
        <tr>
          <td>${data.data.orderInfo.matchTime}</td>
        </tr>
        <tr>
          <td>付款时间:</td>
        </tr>
        <tr>
          <td>${data.data.orderInfo.payTime}</td>
        </tr>
        <tr>
          <td>完成时间:</td>
        </tr>
        <tr>
          <td>${data.data.orderInfo.completeTime}</td>
        </tr>
        <tr>
          <td></td>
        </tr>
      </table>
    `;

    let paymentMethodHtml = `
      <table class="table table-borderless">
        <tr class="table-secondary">
          <th>收付款方式</th>
        </tr>
        <tr>
          <td>买方付款方式: ${data.data.paymentMethod.buyerPaymentMethod.type}</td>
        </tr>
        <tr>
          <td>
            姓名: ${data.data.paymentMethod.buyerPaymentMethod.name}<br>
            支付宝账号: ${data.data.paymentMethod.buyerPaymentMethod.alipayAccount}<br>
            二维码: ${data.data.paymentMethod.buyerPaymentMethod.qrCode}
          </td>
        </tr>
        <tr>
          <td>卖方收款方式: ${data.data.paymentMethod.sellerPaymentMethod.type}</td>
        </tr>
        <tr>
          <td>
            姓名: ${data.data.paymentMethod.sellerPaymentMethod.name}<br>
            支付宝账号: ${data.data.paymentMethod.sellerPaymentMethod.alipayAccount}<br>
            二维码: ${data.data.paymentMethod.sellerPaymentMethod.qrCode}
          </td>
        </tr>
      </table>
    `;

    let transactionHtml = `
      <table class="table table-borderless">
        <tr class="table-secondary">
          <th>交易管理</th>
        </tr>
        <tr>
          <td>购买方:</td>
        </tr>
        <tr>
          <td><a href="javascript:void(0)" onclick="g_data.viewUserDetail('${data.data.transactionManagement.buyer}')">${
      data.data.transactionManagement.buyer
    }</a></td>
        </tr>
        <tr>
          <td>出售方:</td>
        </tr>
        <tr>
          <td><a href="javascript:void(0)" onclick="g_data.viewUserDetail('${data.data.transactionManagement.seller}')">${
      data.data.transactionManagement.seller
    }</a></td>
        </tr>
        <tr>
          <td>交易数量(${data.data.transactionManagement.currency}):</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.amount}</td>
        </tr>
        <tr>
          <td>金额(${data.data.transactionManagement.priceCurrency}):</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.price}</td>
        </tr>
        <tr>
          <td>单价:(${data.data.transactionManagement.priceCurrency}/${data.data.transactionManagement.currency})</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.priceRate}</td>
        </tr>
        <tr>
          <td>出售服务费(YU币):</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.sellerFee}</td>
        </tr>
        <tr>
          <td>代理分润(YU币):</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.agentProfit}</td>
        </tr>
        <tr>
          <td>购买方凭证:</td>
        </tr>
        <tr>
          <td>${
            data.data.transactionManagement.buyerVoucher === "-"
              ? "-"
              : data.data.transactionManagement.buyerVoucher
                  .map(
                    (url) => `
                <a href="javascript:void(0)" onclick="g_data.viewImage('${url}')">
                  ${url.split("/").pop()}
                </a><br>
              `
                  )
                  .join("")
          }</td>
        </tr>
      </table>
    `;

    let leftDivContent = `
      <div class="d-flex flex-column gap-3" style="flex: 1">
        ${orderInfoHtml}
        ${paymentMethodHtml}
      </div>
    `;

    let rightDivContent = `
      <div class="d-flex flex-column gap-3" style="flex: 1">
        ${transactionHtml}
      </div>
    `;

    let contentHtml = `
      <div class="d-flex flex-column flex-lg-row gap-3">
        ${leftDivContent}
        ${rightDivContent}
      </div>
    `;

    $(".dataContent").html(contentHtml);
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
