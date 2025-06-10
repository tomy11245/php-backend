// 声明为全局函数，这样 sidebarOnClick 可以调用

$(function () {
  $(".paginationContent").load("/common/page/pagination/pagination.html");
  let params = g_util.hash2params(window.location.hash);
  let address = params.address;
  console.log("/wallet/official/hot/detail/", address);
  g_data.highlightSidebar("/wallet/official/hot/", "出款池详情");
  requestData(address);
});
g_data.pageCurrent = 1;
g_data.total_page = 3;
function requestData(address) {
  let cb = function (data) {
    data = {
      status: 1,

      detailData: {
        address: "TA9qAoaMp4Mar8Xsyn5qmd7sGD8FhJV8X1",
        amount: "9735.27341 TRX",
        usdt: "101432.000001 USDT"
      },
      data: [
        {
          block: "55191290",
          txid: "3ebc44b9bf25c7933ca416f0bfb276a07d50f6ee33ed90d0c62e560bea08b076",
          type: "归集",
          coin: "USDT",
          user: "UID331534873",
          address: "TAE39JVzqacpxtFAFntGMu6yyNcHaL3dYR",
          amount: "746.666667",
          fee: "0.000000"
        },
        {
          block: "51652999",
          txid: "95d85e6383003f580d861e2f706d897d7ae86ff90790167058b7712449a787b1",
          type: "补Trx",
          coin: "TRX",
          user: "UID331534873",
          address: "TAE39JVzqacpxtFAFntGMu6yyNcHaL3dYR",
          amount: "10.000000",
          fee: "0.000000"
        },
        {
          block: "51652999",
          txid: "95d85e6383003f580d861e2f706d897d7ae86ff90790167058b7712449a787b1",
          type: "提币",
          coin: "TRX",
          user: null,
          address: "TL6MKcGWFsbAgLQrmqKU4xPSRu3KGdLgce",
          amount: "10.000000",
          fee: "2.723870"
        },
        {
          block: "51652171",
          txid: "5ed6c481b3a96fba018916001a558f41ce73dcfc485703d9ea576e695d6a824d",
          type: "提币",
          coin: "USDT",
          user: null,
          address: "TU1cTHAD2DJND6RZndURNEuXuLDhgyTaC6",
          amount: "120.000000",
          fee: "2.767380"
        },
        {
          block: "51513389",
          txid: "39a67c6de68352404a21f4c32d7b37ed76394556b131a519e8eca7b6bad53fc3",
          type: "提币",
          coin: "USDT",
          user: null,
          address: "TU1cTHAD2DJND6RZndURNEuXuLDhgyTaC6",
          amount: "120.000000",
          fee: "2.767380"
        },
        {
          block: "51486277",
          txid: "248c79c537afb944ce2201d4edc5b17a1feba64219f1fd758305e0d3f21ce14f",
          type: "补Trx",
          coin: "TRX",
          user: "VanyaTest2",
          address: "TPBA4gCTeyr4BKW5C8ZsSt76rJQeywobes",
          amount: "10.000000",
          fee: "0.000000"
        },
        {
          block: "51486277",
          txid: "248c79c537afb944ce2201d4edc5b17a1feba64219f1fd758305e0d3f21ce14f",
          type: "提币",
          coin: "TRX",
          user: null,
          address: "TL6MKcGWFsbAgLQrmqKU4xPSRu3KGdLgce",
          amount: "10.000000",
          fee: "7.973870"
        },
        {
          block: "51486257",
          txid: "1f6a40cdd2f3f9c7734b7b96c4710e7210f00b253aa1832b60fd40100ba48067",
          type: "补Trx",
          coin: "TRX",
          user: "UID331534873",
          address: "TAE39JVzqacpxtFAFntGMu6yyNcHaL3dYR",
          amount: "10.000000",
          fee: "0.000000"
        },
        {
          block: "51486257",
          txid: "1f6a40cdd2f3f9c7734b7b96c4710e7210f00b253aa1832b60fd40100ba48067",
          type: "提币",
          coin: "TRX",
          user: null,
          address: "TL6MKcGWFsbAgLQrmqKU4xPSRu3KGdLgce",
          amount: "10.000000",
          fee: "2.723870"
        },
        {
          block: "51486228",
          txid: "adfda303f5b190ece6c2a0b30daf5edb6ed3dcfaa80fffa0fae2a95e72205d4c",
          type: "补Trx",
          coin: "TRX",
          user: "UID331534873",
          address: "TAE39JVzqacpxtFAFntGMu6yyNcHaL3dYR",
          amount: "10.000000",
          fee: "0.000000"
        }
      ]


    };
    // 根据detailData数据生成详细资讯
    let detailHtml = `  
    <table class="table table-borderless">
        <thead>
          <tr class="table-secondary">
            <th>详细资讯</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              地址
            </td>
          </tr>
          <tr>
            <td>
              <a href="javascript:void(0)" class="text-primary" onclick="g_data.viewTronAddressDetail('${data.detailData.address}')">${data.detailData.address}</a>
            </td>
          </tr>
          <tr>
            <td>
              数量
            </td>
          </tr>
          <tr>
            <td>
              ${data.detailData.amount}
            </td>
          </tr>
          <tr>
            <td>
              ${data.detailData.usdt}
            </td>
          </tr>
        </tbody>
      </table>
          `;
    $(".detailContent").html(detailHtml);


    // 生成表格HTML
    let tableHtml = `
      <table class="table ">
        <thead>
          <tr class="table-secondary">
            <th>区块</th>
            <th>交易序号(TxID)</th>
            <th>转账类型</th>
            <th>币种</th>
            <th>用户号/商户名称</th>
            <th>发送方/接收方</th>
            <th>收入/支出</th>
            <th>矿工费</th>
          </tr>
        </thead>
        <tbody class="">
          ${data.data.map(item => `
            <tr>
              <td>${item.block}</td>
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewTronTransactionDetail('${item.txid}')">${item.txid}</a></td>
              <td>${item.type}</td>
              <td>${item.coin}</td>
              <td>${item.user ? `<a href="javascript:void(0)" class="text-primary" onclick="g_data.viewUserDetail('${item.user}')">${item.user}</a>` : "-"}</td>
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewTronAddressDetail('${item.address}')">${item.address}</a></td>
              <td>${item.amount}</td>
              <td>${item.fee}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

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


function manualOperation(address, usdt, trx) {
  console.log(address);
  console.log(usdt);
  console.log(trx);
}
