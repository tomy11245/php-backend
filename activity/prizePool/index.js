$(function () {
  requestData();
});
g_data.pageCurrent = 1;
g_data.total_page = 5;
function requestData() {
  let cb = function (data) {
    data = {
      status: "success",
      data: {
        // 奖金池信息
        prizePoolData: {
          currentPrize: "0.00",
          settlementTime: "2025/03/14 02:00:00",

        },
        // 参加者列表
        participantList: {
          // 商户参加者列表
          partnerList: [
            {
              partnerName: "AliceAffiliate",
              currentIntegral: "2.00",
              expectedBonus: "0.00"
            },
            {
              partnerName: "AliceAffiliateGa",
              currentIntegral: "10,011.00",
              expectedBonus: "0.00"
            },
            {
              partnerName: "WhiteAffiliate",
              currentIntegral: "100,110.00",
              expectedBonus: "0.00"
            },
            {
              partnerName: "VanyaTestAffiliate2",
              currentIntegral: "7.00",
              expectedBonus: "0.00"
            },
            {
              partnerName: "VanyaTestAffiliate",
              currentIntegral: "20.70",
              expectedBonus: "0.00"
            },
            {
              partnerName: "DazzleAffiliate",
              currentIntegral: "10.00",
              expectedBonus: "0.00"
            },
          ],
        },
      },
    };

    // 奖金池信息
    let prizePoolDataTable = `
      <table class="table table-borderless">
        <tr class="table-secondary">
          <th colspan="2">奖金池信息</th>
        </tr>
        <tr>
          <td>当前总奖金 (YU币):</td>  </tr>
        <tr>
          <td>${data.data.prizePoolData.currentPrize}</td>
        </tr>
        <tr>
          <td>奖金结算时间:</td> 
          </tr>
        <tr>
          <td>${data.data.prizePoolData.settlementTime}</td>
        </tr>
       
      </table>
    `;

    // 参加者列表
    let participantListTable = `
      <table class="table table-borderless table-agent-list">
        <tr class="table-secondary">
          <th>
            <div class="d-flex justify-content-between">
              <div class="d-flex text-nowrap align-items-center gap-2">
                参加者列表
              </div>
              <div class="d-flex gap-2 align-items-center">
                
              </div>
            </div>
          </th>
        </tr>
        <tr>
          <td colspan="2" class="p-3">
            <table class="table table-borderless table-agent-list mt-2">
              <tr class="table-secondary">
                <th>商户名称/代理商名称</th>
                <th>当前积分点数</th>
                <th>预计获得奖金</th>
              </tr>
              ${data.data.participantList.partnerList && data.data.participantList.partnerList.length > 0
        ? `${data.data.participantList.partnerList
          .map(
            (partner) => `
                          <tr>
                            <td>
                              <a href="javascript:void(0)" class="d-inline" onclick="g_data.viewAffiliateDetail('${partner.partnerName}')">
                                ${partner.partnerName}
                              </a>
                            </td>
                            <td>${partner.currentIntegral}</td>
                            <td>${partner.expectedBonus}</td>
                          </tr>
                        `
          )
          .join("")}`
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
      <div class="d-flex flex-column gap-3" style="flex: 1; max-width:800px;">
        ${prizePoolDataTable}
        ${participantListTable}
      </div>
    `;


    // 将两个容器放在一个flex横向布局的容器中，但在小屏幕时改为纵向排列
    let contentHtml = `
      <div class="d-flex flex-column flex-lg-row gap-3">
        ${leftDivContent}

      </div>
    `;

    $(".dataContent").html(contentHtml);
    // 下线分页
    $(".paginationContent").load("/common/page/pagination/pagination.html", function () {
      window._set_pagination(g_data.pageCurrent, g_data.total_page, function (page) {
        g_data.pageCurrent = page;
        requestSubordinateAgentData();
      });
    });
    // 请求下级代理数据
    function requestSubordinateAgentData() {
      window._set_pagination(g_data.pageCurrent, g_data.total_page, function (page) {
        g_data.pageCurrent = page;
        requestSubordinateAgentData();
      });
      let subordinateCB = function (data) {
        console.log("请求下级代理数据", g_data.pageCurrent);
        data = [
          {
            partnerName: "a",
            currentIntegral: "2.00",
            expectedBonus: "0.00"
          },
          {
            partnerName: "b",
            currentIntegral: "10,011.00",
            expectedBonus: "0.00"
          },
          {
            partnerName: "c",
            currentIntegral: "100,110.00",
            expectedBonus: "0.00"
          },
          {
            partnerName: "d",
            currentIntegral: "7.00",
            expectedBonus: "0.00"
          },
          {
            partnerName: "r",
            currentIntegral: "20.70",
            expectedBonus: "0.00"
          },
          {
            partnerName: "f",
            currentIntegral: "10.00",
            expectedBonus: "0.00"
          },
        ];

        let subordinateAgentHtml = `
        <table class="table table-borderless table-agent-list mt-2">
              <tr class="table-secondary">
                <th>商户名称/代理商名称</th>
                <th>当前积分点数</th>
                <th>预计获得奖金</th>
              </tr>
              ${data && data.length > 0
            ? `${data
              .map(
                (partner) => `
                          <tr>
                            <td>
                              <a href="javascript:void(0)" class="d-inline" onclick="g_data.viewAffiliateDetail('${partner.partnerName}')">
                                ${partner.partnerName}
                              </a>
                            </td>
                            <td>${partner.currentIntegral}</td>
                            <td>${partner.expectedBonus}</td>
                          </tr>
                        `
              )
              .join("")}`
            : "<tr><td>-</td><td>-</td></tr>"
          }
            </table>
    `;
        let $elements = $(".table-agent-list");
        if ($elements.length >= 2) {
          let $secondElement = $elements.eq(1);
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

