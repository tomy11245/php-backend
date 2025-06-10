// 声明为全局函数，这样 sidebarOnClick 可以调用

$(function () {
  $(".paginationContent").load("/common/page/pagination/pagination.html");
  requestData();
});
g_data.pageCurrent = 1;
g_data.total_page = 3;
function requestData() {

  let cb = function (data) {
    data = {
      status: 1,
      data: [
        {
          block: "55191290",
          txid: "3ebc44b9bf25c7933ca416f0bfb276a07d50f6ee33ed90d0c62e560bea08b076",
          type: "手动归集",
          currency: "USDT",
          fromAddress: "TAE39JVzqacpxtFAFntGMu6yyNcHaL3dYR",
          toAddress: "TA9qAoaMp4Mar8Xsyn5qmd7sGD8FhJV8X1",
          amount: "746.666667",
          fee: "2.767380"
        },
        {
          block: "51376856",
          txid: "4928ab66e906aaae1a38959b7a60041aaa1d0afd9dce60a7907084fa6ec8889f",
          type: "手动归集",
          currency: "USDT",
          fromAddress: "TJDcqVQrgHBxMXEPbdFQEbqtSWviEgAgq5",
          toAddress: "TA9qAoaMp4Mar8Xsyn5qmd7sGD8FhJV8X1",
          amount: "135.000000",
          fee: "3.112380"
        },
        {
          block: "51376855",
          txid: "77771b9af03b821ac0d434f28b11affeb2875df3be4c2bc79a7617f75a806937",
          type: "手动归集",
          currency: "USDT",
          fromAddress: "TGRDr9o3gjcV12eZiXgShxkioYmT48fr28",
          toAddress: "TA9qAoaMp4Mar8Xsyn5qmd7sGD8FhJV8X1",
          amount: "300.000000",
          fee: "2.767380"
        },
        {
          block: "51376854",
          txid: "37e2844b847e843425e06e13834ab36e45d99fb05a82bcb56259b3f54f4e4c61",
          type: "手动归集",
          currency: "USDT",
          fromAddress: "TFWEHQ1DmqYq7cvt67MtQhv6E9Ur15LMQx",
          toAddress: "TA9qAoaMp4Mar8Xsyn5qmd7sGD8FhJV8X1",
          amount: "152.000000",
          fee: "2.767380"
        },
        {
          block: "51375164",
          txid: "14c0afb396218de719d60fdb920c0b679180d70a4194416972298c93d493a649",
          type: "手动归集",
          currency: "USDT",
          fromAddress: "TJDcqVQrgHBxMXEPbdFQEbqtSWviEgAgq5",
          toAddress: "TA9qAoaMp4Mar8Xsyn5qmd7sGD8FhJV8X1",
          amount: "95.000000",
          fee: "3.112380"
        },
        {
          block: "51374722",
          txid: "eadf6e907b3ca418adff71bcbebe019ead466a69af85cbee2ed6cc08cea3aa1d",
          type: "手动归集",
          currency: "USDT",
          fromAddress: "TJDcqVQrgHBxMXEPbdFQEbqtSWviEgAgq5",
          toAddress: "TA9qAoaMp4Mar8Xsyn5qmd7sGD8FhJV8X1",
          amount: "78.000000",
          fee: "3.112380"
        },
        {
          block: "51374623",
          txid: "a2c51fed4c9c434341b9fde0ea4968f2279770477e0a5d5a2770d5ccff8b7f74",
          type: "手动归集",
          currency: "TRX",
          fromAddress: "TJDcqVQrgHBxMXEPbdFQEbqtSWviEgAgq5",
          toAddress: "TA9qAoaMp4Mar8Xsyn5qmd7sGD8FhJV8X1",
          amount: "16.96462",
          fee: "0.000000"
        },
        {
          block: "51373249",
          txid: "1f22e656aaf631ffc591df78ff2a949ac866d46a13b17a49211d3259f41209cf",
          type: "手动归集",
          currency: "USDT",
          fromAddress: "TJDcqVQrgHBxMXEPbdFQEbqtSWviEgAgq5",
          toAddress: "TA9qAoaMp4Mar8Xsyn5qmd7sGD8FhJV8X1",
          amount: "200.000000",
          fee: "2.767380"
        },
        {
          block: "51182887",
          txid: "0e4a5c54926cd6259ec69b7182283ab1e01a6ddbfd40062c23ef79d1aed21f59",
          type: "手动归集",
          currency: "TRX",
          fromAddress: "TJDcqVQrgHBxMXEPbdFQEbqtSWviEgAgq5",
          toAddress: "TA9qAoaMp4Mar8Xsyn5qmd7sGD8FhJV8X1",
          amount: "26.23262",
          fee: "0.268000"
        },
        {
          block: "51182876",
          txid: "7950fc61381288e9f555ccd2d6eb8286153296d2a67abc7de165050178cf92bc",
          type: "手动归集",
          currency: "TRX",
          fromAddress: "TNCuGQ6sTdQGJMUVCwD8zCmZZUAcMyKx5K",
          toAddress: "TA9qAoaMp4Mar8Xsyn5qmd7sGD8FhJV8X1",
          amount: "26.96462",
          fee: "0.268000"
        }
      ]
    };

    // 生成表格HTML
    let tableHtml = '<table class="table"><thead><tr class="table-secondary"><th>区块</th><th>交易序号(TxID)</th><th>转账类型</th><th>币种</th><th>用户/商户地址</th><th>资金池地址</th><th>数量</th><th>矿工费</th></tr></thead><tbody class="table-group-divider">';
    data.data.forEach(function (item) {
      tableHtml += `
        <tr>
          <td>${item.block}</td>
          <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewTronTransactionDetail('${item.txid}')">${item.txid}</a></td>
          <td>${item.type}</td>
          <td>${item.currency}</td>
          <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewTronAddressDetail('${item.fromAddress}')">${item.fromAddress}</a></td>
          <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewTronAddressDetail('${item.toAddress}')">${item.toAddress}</a></td>
          <td>${item.amount}</td>
          <td>${item.fee}</td>
        </tr>
      `;
    });
    tableHtml += '</tbody></table>';

    // 插入表格到指定位置
    $(".dataContent").html(tableHtml);



    // 更新分页
    window._set_pagination(g_data.pageCurrent, g_data.total_page, function (page) {
      g_data.pageCurrent = page;
      requestData();
    });
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

