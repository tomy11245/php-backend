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
          address: "TA9qAoaMp4Mar8Xsyn5qmd7sGD8FhJV8X1",
          usdt: "101,432.000001",
          trx: "9,735.273410",
          operation: "手动发送"
        }
      ]
    };

    // 生成表格HTML
    let tableHtml = '<table class="table table-borderless"><thead><tr class="table-secondary"><th>地址</th><th>USDT</th><th>TRX</th><th>操作</th></tr></thead><tbody class="table-group-divider">';
    data.data.forEach(function (item, index) {
      tableHtml += `
        <tr>
          <td><a href="javascript:void(0)" class="text-primary" onclick="viewTronAddressDetail('${item.address}')">${item.address}</a></td>
          <td>${item.usdt}</td>
          <td>${item.trx}</td>
          <td><a href="javascript:void(0)" class="text-primary" onclick="manualOperation('${item.address}', '${item.usdt}', '${item.trx}')">${item.operation}</a></td>
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
function viewTronAddressDetail(address) {
  let hash = "/wallet/official/hot/detail/?address=" + address;
  window.location.hash = hash;
}

function manualOperation(address, usdt, trx) {
  console.log(address);
  console.log(usdt);
  console.log(trx);
}
