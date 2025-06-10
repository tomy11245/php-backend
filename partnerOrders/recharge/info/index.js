$(function () {
  let params = g_util.hash2params(window.location.hash);
  let orderId = params.id;
  console.log("/partnerOrders/recharge/info/", orderId);
  g_data.highlightSidebar("/partnerOrders/recharge/", "订单详情");
  requestData(orderId);
});

function requestData(params) {
  
  let cb = function (resData) {
    data = {
      status: "success",
      data: [
        resData
      ],
    };

    // 获取单个订单数据
    let item = data.data[0];

    tableHtml = `
      <table class="table table-borderless ">
        <tr class="table-secondary">
          <th>订单资料</th>
        </tr>
        <tr>
          <td>订单种类:</td>
        </tr>
        <tr>
          <td>充值</td>
        </tr>
        <tr>
          <td>系统订单号:</td>
        </tr>
        <tr>
          <td>${item.id}</td>
        </tr>
        <tr>
          <td>商户订单号:</td>
        </tr>
        <tr>
          <td>${item.partnersOrderId}</td>
        </tr>
        <tr>
          <td>商户编号:</td>
        </tr>
        <tr>
          <td>${item.partnersNo}</td>
        </tr>
        <tr>
          <td>商户名称:</td>
        </tr>
        <tr>
          <td><a href="javascript:void(0)" onclick="g_data.viewPartnersDetail('${item.partnersName}')">${item.partnersName}</a></td>
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
          <td>${item.createTime} (发起)<br>${item.completeTime} (完成)</td>
        </tr>
        <tr>
          <td>状态:</td>
        </tr>
        <tr>
          <td><span class="badge ${item.status === 1 ? "text-bg-success" : "text-bg-warning"}">${item.status === 1 ? "完成" : "未完成"}</span></td>
        </tr>
      </table>
    `;
    // display: inline-block; width: auto;
    // 插入表格到指定位置
    $(".dataContent").html(tableHtml);
  };

  $.ajax({
    url: "partnerOrders/recharge/info.php?id="+params,
    type: "GET",
    success: function (res) {
      cb(res);
    },
    error: function (err) {
      console.log(err);
    },
  });
}
