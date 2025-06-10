$(function () {
  let params = g_util.hash2params(window.location.hash);
  let orderId = params.id;
  console.log("/partnerOrders/collect/info/", orderId);
  g_data.highlightSidebar("/partnerOrders/collect/", "订单详情");
  requestData(orderId);
  // 获取URL参数
});

function requestData(params) {
  let cb = function (data) {
    data = {
      status: "success",
      data: [
        {
          orderType: "闪兑",
          systemOrderNo: "VanyaTest224102800822773662112",
          partnersNo: "VYTA_779618310",
          partnersName: "VanyaTest2",
          fromCurrency: "USDT",

          network: "TRC20",
          fromAddress: "TA9qAoaMp4Mar8Xsyn5qmd7sGD8FhJV8X1",
          fromAmount: "9.333333",
          toAmount: "74.67",
          rate: "8.00",
          createTime: "2024/10/28 10:24:37",
          txId: "d01547c1350c3f7c1df049afddae3fd1e62ea31d4cb2235de2e3c39feb72671e",
        },
      ],
    };

    // 获取单个订单数据
    let item = data.data[0];

    tableHtml = `
      <table class="table table-borderless">
        <tr class="table-secondary">
          <th>订单资料</th>
        </tr>
        <tr>
          <td>订单种类:</td>
        </tr>
        <tr>
          <td>${item.orderType}</td>
        </tr>
        <tr>
          <td>系统订单号:</td>
        </tr>
        <tr>
          <td>${item.systemOrderNo}</td>
        </tr>
        <tr>
          <td>商户/代理商编号:</td>
        </tr>
        <tr>
          <td>${item.partnersNo}</td>
        </tr>
        <tr>
          <td>商户/代理商名称:</td>
        </tr>
        <tr>
          <td><a href="javascript:void(0)" onclick="g_data.viewPartnersDetail('${item.partnersName}')">${item.partnersName}</a></td>
        </tr>
        <tr>
          <td>币种:</td>
        </tr>
        <tr>
          <td>${item.fromCurrency}</td>
        </tr>
        <tr>
          <td>加密网络:</td>
        </tr>
        <tr>
          <td>${item.network}</td>
        </tr>
        <tr>
          <td>发送方:</td>
        </tr>
        <tr>
          <td>${item.fromAddress}</td>
        </tr>
        <tr>
          <td>转入数量 (${item.fromCurrency}):</td>
        </tr>
        <tr>
          <td>${item.fromAmount}</td>
        </tr>
        <tr>
          <td>获得数量 (${item.toCurrency}):</td>
        </tr>
        <tr>
          <td>${item.toAmount}</td>
        </tr>
        <tr>
          <td>汇率 (${item.fromCurrency}/${item.toCurrency}):</td>
        </tr>
        <tr>
          <td>${item.rate}</td>
        </tr>
        <tr>
          <td>时间:</td>
        </tr>
        <tr>
          <td>${item.createTime}</td>
        </tr>
        <tr>
          <td>交易序号(TxID):</td>
        </tr>
        <tr>
          <td><a href="javascript:void(0)" onclick="g_data.viewTronTransactionDetail('${item.txId}')">${item.txId}</a></td>
        </tr>
       
      </table>
    `;

    // 插入表格到指定位置
    $(".dataContent").html(tableHtml);
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
