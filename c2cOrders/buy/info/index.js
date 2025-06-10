$(function () {
  let params = g_util.hash2params(window.location.hash);
  let orderId = params.id;
  console.log("/c2cOrders/buy/info/", orderId);
  g_data.highlightSidebar("/c2cOrders/buy/", "订单详情");
  requestData(orderId);
});

function requestData(params) {
  let cb = function (data) {
    data = {
      status: "success",
      data: {
        orderInfo: {
          systemOrderNo: "B24110800483945370823",
          sourceOrderNo: "S24110800476085929247",
          status: "交易完成",
          createTime: "2024/11/08 14:46:34",
          matchTime: "2024/11/08 14:46:34",
          payTime: "2024/11/08 14:47:10",
          completeTime: "2024/11/08 14:47:36",
        },
        paymentMethod: {
          buyerPaymentMethod: {
            type: "银行卡",
            name: "Ivy Carter",
            bank: "Bank of Yubi",
            branch: "Yubi Branch",
            accountNumber: "1234567890",
          },
          sellerPaymentMethod: {
            type: "银行卡",
            name: "Alice Ritchie",
            bank: "Bank of Yubi",
            branch: "Yubi Branch",
            accountNumber: "1234567890",
          },
        },
        transactionManagement: {
          buyer: "UID100000009",
          seller: "UID100000001",
          amount: "10,000.00",
          currency: "YU币",
          price: "10,000.00",
          priceCurrency: "CNY",
          priceRate: "1.00",
          sellerFee: "-",
          agentProfit: "-",
          buyerVoucher: [
            "/test-data/splitfiction.png",
            "/test-data/202503111011453145.png",
            "/test-data/splitfiction.png",
            "/test-data/splitfiction.png",
            "/test-data/splitfiction.png",
            "/test-data/splitfiction.png",
          ],
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
            银行: ${data.data.paymentMethod.buyerPaymentMethod.bank}<br>
            支行: ${data.data.paymentMethod.buyerPaymentMethod.branch}<br>
            账号: ${data.data.paymentMethod.buyerPaymentMethod.accountNumber}
          </td>
        </tr>
        <tr>
          <td>卖方收款方式: ${data.data.paymentMethod.sellerPaymentMethod.type}</td>
        </tr>
        <tr>
          <td>
            姓名: ${data.data.paymentMethod.sellerPaymentMethod.name}<br>
            银行: ${data.data.paymentMethod.sellerPaymentMethod.bank}<br>
            支行: ${data.data.paymentMethod.sellerPaymentMethod.branch}<br>
            账号: ${data.data.paymentMethod.sellerPaymentMethod.accountNumber}
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
          <td>
            ${data.data.transactionManagement.buyerVoucher
              .map(
                (url) => `
              <a href="javascript:void(0)" onclick="g_data.viewImage('${url}')">
                ${url.split("/").pop()}
              </a><br>
            `
              )
              .join("")}
          </td>
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
