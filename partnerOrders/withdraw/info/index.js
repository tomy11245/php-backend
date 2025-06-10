$(function () {
  let params = g_util.hash2params(window.location.hash);
  let orderId = params.id;
  console.log("/partnerOrders/withdraw/info/", orderId);
  g_data.highlightSidebar("/partnerOrders/withdraw/", "订单详情");
  requestData(orderId);
  // 获取URL参数
});

function requestData(params) {
  let cb = function (data) {
    data = {
      status: "success",
      data: {
        // 提币订单资讯
        withdrawData: {
          orderType: "提币",
          systemOrderNo: "white24110600674848661236",
          partnersNo: "WHOP_395125515",
          partnersName: "white",
          fromCurrency: "USDT",
          network: "TRC20",
          fromAddress: "TU1cTHAD2DJND6RZndURNEuXuLDhgyTaC6",
          fromAmount: "150.00",
          toAmount: "20.000000",
          toCurrency: "USDT",
          rate: "0.133333",
          createTime: "2024/11/06 12:31:24 (发起)",
          completeTime: "2024/11/06 12:31:24 (完成)",
          status: "审核中",
          txId: "a1234567890a1234567890a1234567890",
        },
        // 发币审核
        coinIssuanceData: {
          status: "审核中",
          todayTotalAmount: "0",
          todayTotalCurrency: "YU币",
          merchantName: "white",
          auditNotes: "已阅 通过",
        },
      },
    };
    //  提币订单资讯
    let withdrawTableHtml = `
    <table class="table table-borderless">
      <tr class="table-secondary">
        <th>订单资料</th>
      </tr>
      <tr>
        <td>订单种类:</td>
      </tr>
      <tr>
        <td>${data.data.withdrawData.orderType}</td>
      </tr>
      <tr>
        <td>系统订单号:</td>
      </tr>
      <tr>
        <td>${data.data.withdrawData.systemOrderNo}</td>
      </tr>
      <tr>
        <td>商户/代理商编号:</td>
      </tr>
      <tr>
        <td>${data.data.withdrawData.partnersNo}</td>
      </tr>
      <tr>
        <td>商户/代理商名称:</td>
      </tr>
      <tr>
        <td><a href="javascript:void(0)" onclick="g_data.viewPartnersDetail('${data.data.withdrawData.partnersName}')">${data.data.withdrawData.partnersName}</a></td>
      </tr>
      <tr>
        <td>币种:</td>
      </tr>
      <tr>
        <td>${data.data.withdrawData.fromCurrency}</td>
      </tr>
      <tr>
        <td>加密网络:</td>
      </tr>
      <tr>
        <td>${data.data.withdrawData.network}</td>
      </tr>
      <tr>
        <td>发送方:</td>
      </tr>
      <tr>
        <td>${data.data.withdrawData.fromAddress}</td>
      </tr>
      <tr>
        <td>转入数量 (${data.data.withdrawData.fromCurrency}):</td>
      </tr>
      <tr>
        <td>${data.data.withdrawData.fromAmount}</td>
      </tr>
      <tr>
        <td>获得数量 (${data.data.withdrawData.toCurrency}):</td>
      </tr>
      <tr>
        <td>${data.data.withdrawData.toAmount}</td>
      </tr>
      <tr>
        <td>汇率 (${data.data.withdrawData.fromCurrency}/${data.data.withdrawData.toCurrency}):</td>
      </tr>
      <tr>
        <td>${data.data.withdrawData.rate}</td>
      </tr>
      <tr>
        <td>时间:</td>
      </tr>
      <tr>
        <td>${data.data.withdrawData.createTime}</td>
      </tr>
      <tr>
        <td>交易序号(TxID):</td>
      </tr>
      <tr>
        <td><a href="javascript:void(0)" onclick="g_data.viewTronTransactionDetail('${data.data.withdrawData.txId}')">${data.data.withdrawData.txId}</a></td>
      </tr>
      
    </table>
  `;
    let coinIssuanceTableHtml = `
    <table class="table table-borderless">
      <tr class="table-secondary">
        <th>
          <div class="d-flex justify-content-between">
            <div >
              发币审核
            </div>
            <div >
              <span >${data.data.coinIssuanceData.status}</span>
            </div>
          </div>
        </th>
      </tr>
      <tr>
        <td>本日累计发币:</td>
      </tr>
      <tr>
        <td>${data.data.coinIssuanceData.todayTotalAmount} ${data.data.coinIssuanceData.todayTotalCurrency}</td>
      </tr>
      <tr>
        <td>商户/代理商名称:</td>
      </tr>
      <tr>
        <td><a href="javascript:void(0)" onclick="g_data.viewPartnersDetail('${data.data.coinIssuanceData.merchantName}')">${data.data.coinIssuanceData.merchantName
      }</a></td>
      </tr>
      <tr>
        <td>审核批注:
</td>
      </tr>
      <tr>
        <td>${data.data.coinIssuanceData.auditNotes || "-"}</td>
      </tr>
      ${data.data.coinIssuanceData.status === "审核中" ? `
      <tr>
        <td class="text-end border-top border-dark">
          <button class="btn btn-outline-dark">审核判定</button>
        </td>
      </tr>
      ` : ""}
    </table>
  `;
    // 创建两个flex容器，分别包含不同的表格
    let leftDivContent = `
      <div class="d-flex  flex-column  gap-3" style="flex: 1">
        ${withdrawTableHtml}
      </div>
    `;

    let rightDivContent = `
      <div class="d-flex flex-column  gap-3" style="flex: 1">
        ${coinIssuanceTableHtml}
      </div>
    `;

    // 将两个容器放在一个flex横向布局的容器中，但在小屏幕时改为纵向排列
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

g_data.walletControl = function (walletID) {
  console.log("操作币种钱包:", walletID);
};
g_data.viewAgentDetail = function (agentID) {
  console.log("查看代理详情:", agentID);
};
