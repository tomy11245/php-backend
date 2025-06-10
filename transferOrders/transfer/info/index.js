$(function () {
  let params = g_util.hash2params(window.location.hash);
  let orderId = params.id;
  console.log("/transferOrders/transfer/info/", orderId);
  g_data.highlightSidebar("/transferOrders/transfer/", "订单详情");
  requestData(orderId);
  // 获取URL参数
});

function requestData(params) {
  let cb = function (data) {
    data = {
      status: "success",
      data: [
        {
          orderType: "互转",
          systemOrderNo: "TR24110600813248814464",
          senderName: "white",
          receiverName: "denny",
          currency: "YU币",
          amount: "200.00",
          createTime: "2024/11/06 16:22:04",
          finishTime: "2024/11/06 16:22:04",
          status: 1,
        },
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
          <td>${item.orderType}</td>
        </tr>
        <tr>
          <td>系统订单号:</td>
        </tr>
        <tr>
          <td>${item.systemOrderNo}</td>
        </tr>
        <tr>
          <td>发送方商户/代理商名称:</td>
        </tr>
        <tr>
          <td><a href="javascript:void(0)" onclick="g_data.viewPartnersDetail('${item.senderName}')">${item.senderName}</a></td>
        </tr>
        <tr>
          <td>接收方商户/代理商名称:</td>
        </tr>
        <tr>
          <td><a href="javascript:void(0)" onclick="g_data.viewPartnersDetail('${item.receiverName}')">${item.receiverName}</a></td>
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
          <td>时间:</td>
        </tr>
        <tr>
          <td>${item.createTime} (发起) <br>${item.finishTime} (完成)</td>
        </tr>
        <tr>
          <td>状态:</td>
        </tr>
        <tr>
          <td><span class="badge ${item.status === 1 ? "text-bg-success" : "text-bg-warning"}">${item.status === 1 ? "成功" : "未成功"}</span></td>
        </tr>
      </table>
    `;
    // display: inline-block; width: auto;
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
