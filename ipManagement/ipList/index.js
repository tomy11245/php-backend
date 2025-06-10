// 声明为全局函数，这样 sidebarOnClick 可以调用
$(function () {
  $(".paginationContent").load("/common/page/pagination/pagination.html");
  // 搜索按钮
  $("#searchBtn").on("click", function () {
    requestData();
  });
  requestData();
});
g_data.pageCurrent = 1;
g_data.total_page = 5;
function requestData() {
  let cb = function (data) {
    data = [
      {
        ip: "1.34.224.113",
        userCount: "34",
        blackList: true,
      },
      {
        ip: "111.82.160.166",
        userCount: "7",
        blackList: false,
      },
      {
        ip: "1.200.77.210",
        userCount: "7",
        blackList: true,
      },
      {
        ip: "111.250.44.62",
        userCount: "4",
        blackList: true,
      },
      {
        ip: "1.171.245.186",
        userCount: "3",
        blackList: true,
      },
      {
        ip: "114.24.90.214",
        userCount: "3",
        blackList: true,
      },
      {
        ip: "125.228.55.172",
        userCount: "3",
        blackList: true,
      },
      {
        ip: "20.239.86.59",
        userCount: "2",
        blackList: true,
      },
      {
        ip: "184.22.230.208",
        userCount: "2",
        blackList: true,
      },
      {
        ip: "1.162.43.61",
        userCount: "2",
        blackList: true,
      },
    ];

    let tableHtml = `
      <table class="table">
        <thead>
          <tr class="table-secondary">
            <th>IP地址</th>
            <th>使用该IP的用户数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          ${data
            .map(
              (item) => `
            <tr>
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.viewIpDetail('${item.ip}')">${item.ip}</a></td>
              <td>${item.userCount}</td>
              <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.toBlacklist('${item.ip}',${item.blackList})">${
                item.blackList ? "移除黑名单" : "加入黑名单"
              }</a></td>
            </tr>
          `
            )
            .join("")}
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
