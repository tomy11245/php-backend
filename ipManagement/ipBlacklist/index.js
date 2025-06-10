// 声明为全局函数，这样 sidebarOnClick 可以调用
$(function () {
  $(".paginationContent").load("/common/page/pagination/pagination.html");
  // 搜索按钮
  requestData();
});
g_data.pageCurrent = 1;
g_data.total_page = 1;
function requestData() {
  let cb = function (data) {
    data = [
      {
        ip: "1.34.224.113",
      },
    ];

    let tableHtml = `
      <table class="table">
        <thead>
          <tr class="table-secondary">
            <th>IP地址</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          ${
            data && data.length > 0
              ? data
                  .map(
                    (item) => `
            <tr>
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewIpDetail('${item.ip}')">${item.ip}</a></td>
             
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.toBlacklist('${item.ip}', true)">移出黑名单</a></td>
            </tr>
          `
                  )
                  .join("")
              : `<tr><td colspan="2" class="text-center"><i class="bi bi-database" style="font-size: 2rem;"></i><br>暂无数据</td></tr>`
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
g_data.viewIpDetail = function (ip) {
  console.log("查看IP详情:", ip);
  let hash = "/ipManagement/ipList/info/?ip=" + ip;
  window.location.hash = hash;
};
g_data.toBlacklist = function (ip, blackList) {
  if (blackList) {
    console.log("移除黑名单:", ip);
  } else {
    console.log("加入黑名单:", ip);
  }
};
g_data.addBlacklistPopup = function () {
  console.log("添加黑名单");
};
g_data.refreshIPBlacklist = function () {
  console.log("刷新IP黑名单");
  requestData();
};
