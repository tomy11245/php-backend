$(function () {
  $(".paginationContent").load("/common/page/pagination/pagination.html");
  requestData();
  // 获取URL参数
});

g_data.pageCurrent = 1;
g_data.total_page = 1;
function requestData(params) {
  let cb = function (data) {
    // 空数据数组
    data = [];

    tableHtml = `
      <table class="table">
        <thead>
          <tr class="table-secondary">
            <th>用户号</th>
            <th>账号</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          ${
            data.length > 0
              ? data
                  .map(
                    (item) => `
            <tr>
              <td><a href="#" class="text-primary" onclick="g_data.viewUserDetail('${item.userNo}')">${item.userNo}</a></td>
              <td>${item.account}</td>
            </tr>
          `
                  )
                  .join("")
              : `<tr><td colspan="11" class="text-center">
                    <div class="mt-4 mb-2">
                      <i class="bi bi-database" style="font-size: 2rem;"></i>
                    </div>
                    <div class="mb-4">暂无数据</div>
                  </td></tr>`
          }
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
