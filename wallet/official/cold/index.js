// 声明为全局函数，这样 sidebarOnClick 可以调用

$(function () {
  $(".paginationContent").load("/common/page/pagination/pagination.html");
  requestData();
});
g_data.pageCurrent = 1;
g_data.total_page = 1;
function requestData() {
  let cb = function (data) {
    data = {
      status: 1,
      data: [
        {
          address: "TB9JgyFni8gdVKEfVZHRQA1UTTwCsQQSgR",
        }
      ]
    };

    // 生成表格HTML
    let tableHtml = `
      <table class="table table-borderless">
        <thead>
          <tr class="table-secondary">
            <th>冷钱包地址</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          ${data.data.map(item => `
            <tr>
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewTronAddressDetail('${item.address}')">${item.address}</a></td>
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
