$(function () {
  let params = g_util.hash2params(window.location.hash);
  let orderId = params.id;
  console.log("/partnerOrders/payout/info/", orderId);
  g_data.highlightSidebar("/partnerOrders/payout/", "订单详情");
  requestData(orderId);
});

function requestData(params) {
  let cb = function (data) {
    data = {
      status: "success",
      data: [
        {
          orderType: "代付",
          systemOrderNo: "JBP24111800162983976053",
          merchantOrderId: "76384F9A7F824F318C534580B709BF",
          merchantNo: "JBPP_711695392",
          merchantName: "JBP",
          userNo: "UID100000004",
          account: "dave",
          currency: "YU币",
          amount: "100.00",
          serviceFee: "10.00",
          agentProfit: "2.00",
          createTime: "2024/11/18 15:51:38",
          status: 1
        }
      ]
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
          <td>商户订单号:</td>
        </tr>
        <tr>
          <td>${item.merchantOrderId}</td>
        </tr>
        <tr>
          <td>商户编号:</td>
        </tr>
        <tr>
          <td>${item.merchantNo}</td>
        </tr>
        <tr>
          <td>商户名称:</td>
        </tr>
        <tr>
          <td><a href="javascript:void(0)" onclick="g_data.viewPartnersDetail('${item.merchantName}')">${item.merchantName}</a></td>
        </tr>
        <tr>
          <td>用户号:</td>
        </tr>
        <tr>
          <td><a href="javascript:void(0)" onclick="g_data.viewUserDetail('${item.userNo}')">${item.userNo}</a></td>
        </tr>
        <tr>
          <td>用户帐号:</td>
        </tr>
        <tr>
          <td>${item.account}</td>
        </tr>
        <tr>
          <td>币种:</td>
        </tr>
        <tr>
          <td>${item.currency}</td>
        </tr>
        <tr>
          <td>数量:</td>
        </tr>
        <tr>
          <td>${item.amount}</td>
        </tr>
        <tr>
          <td>服务费:</td>
        </tr>
        <tr>
          <td>${item.serviceFee}</td>
        </tr>
        <tr>
          <td>代理分润:</td>
        </tr>
        <tr>
          <td>${item.agentProfit}</td>
        </tr>
        <tr>
          <td>时间:</td>
        </tr>
        <tr>
          <td>发起：${item.createTime}</td>
        </tr>
        <tr>
          <td>状态:</td>
        </tr>
        <tr>
          <td><span class="badge ${item.status === 1 ? "text-bg-success" : "text-bg-warning"}">${item.status === 1 ? "成功" : "未完成"}</span></td>
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
