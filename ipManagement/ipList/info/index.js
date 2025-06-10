$(function () {
  let params = g_util.hash2params(window.location.hash);
  console.log("/ipManagement/ipList/info/", params.ip);
  g_data.highlightSidebar("/ipManagement/ipList/", "IP详情");
  requestData(params.ip);
});
g_data.pageCurrent = 1;
g_data.total_page = 4;
function requestData(params) {
  let cb = function (data) {
    data = {
      status: "success",
      data: {
        // IP信息
        ipData: {
          ip: "1.34.224.113",
          userCount: "34",
          blackList: true,
        },
        // 登陆用户列表
        userListData: {
          // 用户号/商户名称/代理商名称
          userList: [
            {
              id: "UID100000003",
            },
            {
              id: "WhiteAffiliate",
            },
            {
              id: "UID331534873",
            },
            {
              id: "UID868192007",
            },
            {
              id: "UID100000005",
            },
            {
              id: "DennyAffiliate",
            },
            {
              id: "UID100000010",
            },
            {
              id: "UID100000002",
            },
            {
              id: "UID123560718",
            },
            {
              id: "UID100000006",
            },
          ],
        },
      },
    };

    // 创建IP信息表格
    let ipInfoTable = `
      <table class="table table-borderless">
        <tr class="table-secondary">
          <th colspan="2">IP信息</th>
        </tr>
        <tr>
          <td>IP地址:</td> </tr>
        <tr>
          <td>${data.data.ipData.ip}</td>
        </tr>
        <tr>
          <td>使用该IP的用户数:</td> </tr>
        <tr>
          <td>${data.data.ipData.userCount}</td>
        </tr>
        <tr>
          <td>黑名单:</td> </tr>
        <tr>
          <td>
          <div class="d-flex gap-2 align-items-center">
          ${data.data.ipData.blackList ? "异常地址" : "正常地址"}
          <a href="javascript:void(0)" class="btn btn-outline-dark" onclick="g_data.toBlacklist('${data.data.ipData.ip}',${data.data.ipData.blackList})">${
      data.data.ipData.blackList ? "移除黑名单" : "加入黑名单"
    }</a>
          </div>
          </td>
        </tr>
      </table>
    `;

    // 创建用户列表表格
    let userListTable = `
      <table class="table table-borderless">
        <tr class="table-secondary">
          <th>
            <div class="d-flex justify-content-between">
              <div class="d-flex text-nowrap align-items-center gap-2">
                登录用户列表
              </div>
              <div class="d-flex gap-2 align-items-center">
                
              </div>
            </div>
          </th>
        </tr>
        <tr>
          <td colspan="2" class="p-3">
            <table class="table table-borderless table-user-list mt-2">
              <tr class="table-secondary">
                <th>用户号/商户名称/代理商名称</th>
              </tr>
              ${
                data.data.userListData.userList && data.data.userListData.userList.length > 0
                  ? `
                    ${data.data.userListData.userList
                      .map(
                        (user) => `
                      <tr>
                        <td><a href="javascript:void(0)" class="d-inline" onclick="g_data.viewAffiliateDetail('${user.id}')">${user.id}</a></td>
                      </tr>
                    `
                      )
                      .join("")}
                  `
                  : "<tr><td>-</td><td>-</td></tr>"
              }
            </table>
          </td>
          </tr>
          <tr>
            <td class="d-flex justify-content-end">
              <div class="paginationContent"></div>
            </td>
          </tr>
       
      </table>
    `;

    // 创建两个flex容器，分别包含不同的表格
    let leftDivContent = `
      <div class="d-flex flex-column gap-3" style="flex: 1">
        ${ipInfoTable}
      </div>
    `;

    let rightDivContent = `
      <div class="d-flex flex-column gap-3" style="flex: 1">
        ${userListTable}
      </div>
    `;

    // 将两个容器放在一个flex横向布局的容器中，但在小屏幕时改为纵向排列
    let contentHtml = `
      <div class="d-flex flex-column flex-lg-row gap-3">
        ${leftDivContent}
        ${rightDivContent}
      </div>
    `;

    $(".dataContent").html(contentHtml);
    // 下线分页
    $(".paginationContent").load("/common/page/pagination/pagination.html", function () {
      window._set_pagination(g_data.pageCurrent, g_data.total_page, function (page) {
        g_data.pageCurrent = page;
        requestLoginUserListData();
      });
    });
    // 请求登陆用户列表 用户号/商户名称/代理商名称
    function requestLoginUserListData() {
      window._set_pagination(g_data.pageCurrent, g_data.total_page, function (page) {
        g_data.pageCurrent = page;
        requestLoginUserListData();
      });
      let subordinateCB = function (data) {
        console.log("请求登陆用户列表 用户号/商户名称/代理商名称", g_data.pageCurrent);
        data = [
          {
            id: "UID100000003" + g_data.pageCurrent,
          },
          {
            id: "WhiteAffiliate",
          },
          {
            id: "UID331534873",
          },
          {
            id: "UID868192007",
          },
          {
            id: "UID100000005",
          },
          {
            id: "DennyAffiliate",
          },
          {
            id: "UID100000010",
          },
          {
            id: "UID100000002",
          },
          {
            id: "UID123560718",
          },
          {
            id: "UID100000006",
          },
        ];

        let subordinateAgentHtml = `
       <table class="table table-borderless table-user-list mt-2">
              <tr class="table-secondary">
                <th>用户号/商户名称/代理商名称</th>
              </tr>
              ${
                data && data.length > 0
                  ? `
                    ${data
                      .map(
                        (user) => `
                      <tr>
                        <td><a href="javascript:void(0)" class="d-inline" onclick="g_data.viewUserDetail('${user.id}')">${user.id}</a></td>
                      </tr>
                    `
                      )
                      .join("")}
                  `
                  : "<tr><td>-</td><td>-</td></tr>"
              }
            </table>
    `;
        let $elements = $(".table-user-list");
        if ($elements.length >= 1) {
          let $secondElement = $elements.eq(0);
          // 4. 替换该元素的子元素
          $secondElement.html(subordinateAgentHtml);
        }
      };
      subordinateCB();
    }
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
g_data.toBlacklist = function (ip, blackList) {
  if (blackList) {
    console.log("移除黑名单:", ip);
  } else {
    console.log("加入黑名单:", ip);
  }
};
