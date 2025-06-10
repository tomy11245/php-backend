$(function () {
  let params = g_util.hash2params(window.location.hash);
  let orderId = params.id;
  console.log("/c2cOrders/sell/info/", orderId);
  g_data.highlightSidebar("/c2cOrders/sell/", "订单详情");
  requestData(orderId);
});

function requestData(params) {
  let cb = function (data) {
    data = {
      status: "success",
      data: {
        orderInfo: {
          systemOrderNo: "S24120400132614885882",
          transactionOrderNo: ["B24120400134600299454", "B24120400132814965982"],
          status: "交易取消",
          createTime: "2024/12/04 19:54:21",
          completeTime: "2025/03/07 23:41:03",
        },
        paymentMethod: {
          buyerPaymentMethod: [
            {
              type: "微信",
              name: "100000004",
              phone: "4444440",
              qrCode: "https://www.wechat.com",
            },
            {
              type: "微信",
              name: "100000004",
              phone: "4444440",
              qrCode: "https://www.wechat.com",
            },
          ],
        },
        transactionManagement: {
          seller: "UID100000004",
          currency: "YU币",
          totalAmount: "2,000.00",
          minDealAmount: "100.00",
          dealedAmount: "1,000.00",
          inTradeAmount: "0.00",
          leftAmount: "0.00",
          returnedAmount: "1,000.00",
          estimatedFee: "-",
          actualFee: "-",
          agentProfit: "-",
          price: "1.00",
          priceCurrency: "CNY",
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
          <td>交易订单:</td>
        </tr>
        <tr>
          <td>
            ${data.data.orderInfo.transactionOrderNo
              .map(
                (orderId) => `
              <a href="javascript:void(0)" onclick="g_data.viewSourceOrderDetail('${orderId}')">${orderId}</a><br>
            `
              )
              .join("")}
          </td>
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
          <td>完成时间:</td>
        </tr>
        <tr>
          <td>${data.data.orderInfo.completeTime}</td>
        </tr>
      </table>
    `;

    let paymentMethodHtml = `
      <table class="table table-borderless">
        <tr class="table-secondary">
          <th>收付款方式</th>
        </tr>
        ${data.data.paymentMethod.buyerPaymentMethod
          .map(
            (method, index) => `
          <tr>
            <td>买方付款方式${index + 1}:</td>
          </tr>
          <tr>
            <td>
              类型: ${method.type}<br>
              姓名: ${method.name}<br>
              手机: ${method.phone}<br>
              二维码: <a href="javascript:void(0)" onclick="g_data.viewImage('${method.qrCode}')">查看</a>
            </td>
          </tr>
        `
          )
          .join("")}
      </table>
    `;

    let transactionHtml = `
      <table class="table table-borderless">
        <tr class="table-secondary">
          <th>交易管理</th>
        </tr>
        <tr>
          <td>出售方:</td>
        </tr>
        <tr>
          <td><a href="javascript:void(0)" onclick="g_data.viewUserDetail('${data.data.transactionManagement.seller}')">${data.data.transactionManagement.seller}</a></td>
        </tr>
        <tr>
          <td>币种:</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.currency}</td>
        </tr>
        <tr>
          <td>挂单总数量:</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.totalAmount}</td>
        </tr>
        <tr>
          <td>单笔最低成交:</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.minDealAmount}</td>
        </tr>
        <tr>
          <td>已成交数量:</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.dealedAmount}</td>
        </tr>
        <tr>
          <td>交易中数量:</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.inTradeAmount}</td>
        </tr>
        <tr>
          <td>剩余数量:</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.leftAmount}</td>
        </tr>
        <tr>
          <td>已退还数量:</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.returnedAmount}</td>
        </tr>
        <tr>
          <td>预扣服务费:</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.estimatedFee}</td>
        </tr>
        <tr>
          <td>实扣服务费:</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.actualFee}</td>
        </tr>
        <tr>
          <td>代理分润:</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.agentProfit}</td>
        </tr>
        <tr>
          <td>单价(${data.data.transactionManagement.priceCurrency}):</td>
        </tr>
        <tr>
          <td>${data.data.transactionManagement.price}</td>
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
