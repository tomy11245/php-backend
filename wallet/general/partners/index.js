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
          uid: "VanyaTest2",
          address: "TPBA4gCTeyr4BKW5C8ZsSt76rJQeywobes",
          usdt: "537.333333",
          trx: "10.000000"
        },
        {
          uid: "DennyAffiliate",
          address: "TYDvT8TCLWB5Jg4TS6MFQxoy11CgXmWpwR",
          usdt: "300.000000",
          trx: "0.000000"
        },
        {
          uid: "BillPartner",
          address: "TJb6umDYUzoS44hzUkC2QaR39A7FurJqxX",
          usdt: "50.000000",
          trx: "0.000000"
        },
        {
          uid: "VanyaTest",
          address: "TQzBH3ZFs4rt1T5nnNuB5BzqVPrUrCw1Vc",
          usdt: "0.666667",
          trx: "0.000000"
        },
        {
          uid: "denny",
          address: "TJDcqVQrgHBxMXEPbdFQEbqtSWviEgAgq5",
          usdt: "0.000000",
          trx: "10.662860"
        },
        {
          uid: "Dazzle",
          address: "TGRDr9o3gjcV12eZiXgShxkioYmT48fr28",
          usdt: "0.000000",
          trx: "12.232620"
        },
        {
          uid: "VanyaTestAffiliate",
          address: "TFWEHQ1DmqYq7cvt67MtQhv6E9Ur15LMQx",
          usdt: "0.000000",
          trx: "12.232620"
        }
      ]
    };

    // 生成表格HTML
    let tableHtml = '';
    data.data.forEach(function (item, index) {
      tableHtml += `
        <tr>
          <td>
            <div class="form-check">
              <input class="form-check-input row-checkbox" type="checkbox" value="${item.uid}" id="check${index}">
              <label class="form-check-label" for="check${index}">
             <a href="javascript:void(0)" class="text-primary" onclick="g_data.viewPartnerDetail('${item.uid}')">${item.uid}</a>

              </label>
            </div>
          </td>
          <td>
          <a href="javascript:void(0)" class="text-primary" onclick="g_data.viewTronAddressDetail('${item.address}')"> ${item.address}</a>
          </td>
          <td>${item.usdt}</td>
          <td>${item.trx}</td>
        </tr>
      `;
    });

    // 插入表格到指定位置
    $(".table-group-divider").html(tableHtml);

    // 更新按钮状态
    updateButtonStatus();

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

// 页面加载完成后绑定事件
$(function () {
  // 全选/取消全选
  $("#fromCheckAll").on("change", function () {
    const isChecked = $(this).prop("checked");
    $(".row-checkbox").prop("checked", isChecked);
    updateButtonStatus();
  });

  // 监听表格中的复选框变化
  $(document).on("change", ".row-checkbox", function () {
    updateButtonStatus();

    // 检查是否所有行都被选中，更新全选框状态
    const allChecked = $(".row-checkbox").length === $(".row-checkbox:checked").length;
    $("#fromCheckAll").prop("checked", allChecked);
  });

  // 初始禁用按钮
  $("#collectBtn, #sendTrxBtn").prop("disabled", true);
});

// 更新按钮状态的函数
function updateButtonStatus() {
  const hasChecked = $(".row-checkbox:checked").length > 0;
  $("#collectBtn, #sendTrxBtn").prop("disabled", !hasChecked);
}

