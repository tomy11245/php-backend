$(function () {
  let params = g_util.hash2params(window.location.hash);
  console.log("/account/affiliates/info/", params.id);
  g_data.highlightSidebar("/account/affiliates/", "代理商详情");
  requestData(params.id);
});
g_data.pageCurrent = 1;
g_data.total_page = 5;
function requestData(params) {
  let cb = function (data) {
    data = {
      status: "success",
      data: {
        // 代理商信息
        affiliateData: {
          name: "AliceAffiliate",
          no: "AFF_100000011",
          phone: "13800138000",
          securityVerification: {
            google: false,
            fundPassword: false,
          },
          coinAddress: {
            tron: "TKztmzwSqGsuFTDAmohRYquZH2seN2xu4G",
            yu: "FhxHqrXtHWTY5CNUQjMF3Jyk85zZHaGpddTWPQPB5Zeu",
          },
          paymentFunction: true,
          sellFunction: true,
        },
        // 代理列表
        affiliateListData: {
          // 上级代理
          superiorAgent: [
            {
              name: "Jerry",
              no: "Jerry123456",
            },
          ],
          // 下级代理
          subordinateAgent: [
            {
              name: "Alicecorp",
              no: "JANK_10101",
            },
            {
              name: "AlicecorpGa",
              no: "JAKK_101011",
            },
            {
              name: "VanyaTestAffiliate",
              no: "AFF_646429187",
            },
            {
              name: "BillAgent",
              no: "AFF_987058184",
            },
          ],
        },
        // 钱包数据
        walletData: [
          {
            currency: "YU币",
            balance: "1,009,992,345,588.07",
            frozen: "0.00",
            credit: "0.00",
          },
        ],
        // 发币审核条件
        coinIssuanceLimit: [
          {
            currency: "USDT",
            amountLimitPerTrans: 10,
            amountOver: 1,
            frequencyLimitPerDay: 10,
            frequencyOver: 1,
          },
          {
            currency: "YU币",
            amountLimitPerTrans: 20,
            amountOver: 2,
            frequencyLimitPerDay: 20,
            frequencyOver: 2,
          },
        ],
        // 发币免审核地址
        coinIssuanceFreeAddress: ["aaaaaaaaaaaaaaaaaaaaaaaaaaa"],
        coinIssuanceFreeAddressAvailable: true,
      },
    };

    // 创建代理商信息表格
    let affiliateInfoTable = `
      <table class="table table-borderless">
        <tr class="table-secondary">
          <th colspan="2">代理商信息</th>
        </tr>
        <tr>
          <td>代理商名称:</td>  </tr>
        <tr>
          <td>${data.data.affiliateData.name}</td>
        </tr>
        <tr>
          <td>代理商编号:</td>  </tr>
        <tr>
          <td>${data.data.affiliateData.no}</td>
        </tr>
        <tr>
          <td>手机号:</td>  </tr>
        <tr>
          <td>${data.data.affiliateData.phone}</td>
        </tr>
        <tr>
          <td>安全验证:</td>  </tr>
        <tr>
          <td>
            Google验证: ${data.data.affiliateData.securityVerification.google ? "已开启" : "未开启"
      } <a href="javascript:void(0)" class="btn-outline-primary d-inline">设置</a><br>
            资金密码: ${data.data.affiliateData.securityVerification.fundPassword ? "已设置" : "未设置"
      } <a href="javascript:void(0)" class="btn-outline-primary d-inline">设置</a>
          </td>
        </tr>
        <tr>
          <td>币种地址:</td>  </tr>
        <tr>
          <td>
            TRON: <a href="javascript:void(0)" class="d-inline" onclick="g_data.viewTronAddressDetail('${data.data.affiliateData.coinAddress.tron}')">${data.data.affiliateData.coinAddress.tron
      }</a><br>
            YU: ${data.data.affiliateData.coinAddress.yu}
          </td>
        </tr>
       
      </table>
    `;

    // 创建代理表格（嵌套上下级代理表格）
    let agentTable = `
      <table class="table table-borderless table-agent-list">
        <tr class="table-secondary">
          <th>
            <div class="d-flex justify-content-between">
              <div class="d-flex text-nowrap align-items-center gap-2">
                代理列表
              </div>
              <div class="d-flex gap-2 align-items-center">
                <div>
                  <button class="btn btn-outline-dark">添加下级</button>
                </div>
              </div>
            </div>
          </th>
        </tr>
        <tr>
          <td colspan="2" class="p-3">
            <table class="table table-borderless">
              <tr class="table-secondary">
                <th>上级代理商名称</th>
                <th>代理商编号</th>
                <th>操作</th>
              </tr>
              ${data.data.affiliateListData.superiorAgent && data.data.affiliateListData.superiorAgent.length > 0
        ? `
                    ${data.data.affiliateListData.superiorAgent
          .map(
            (agent) => `
                      <tr>
                        <td><a href="javascript:void(0)" class="d-inline" onclick="g_data.viewAffiliateDetail('${agent.name}')">${agent.name}</a></td>
                        <td>${agent.no}</td>
                        <td></td>
                      </tr>
                    `
          )
          .join("")}
                  `
        : "<tr><td>-</td><td>-</td></tr>"
      }
            </table>
            <table class="table table-borderless table-agent-list mt-2">
              <tr class="table-secondary">
                <th>下级商户/代理商名称</th>
                <th>商户/代理商编号</th>
                <th>操作</th>
              </tr>
              ${data.data.affiliateListData.subordinateAgent && data.data.affiliateListData.subordinateAgent.length > 0
        ? `
                    ${data.data.affiliateListData.subordinateAgent
          .map(
            (agent) => `
                      <tr>
                        <td><a href="javascript:void(0)" class="d-inline" onclick="g_data.viewAffiliateDetail('${agent.name}')">${agent.name}</a></td>
                        <td>${agent.no}</td>
                        <td><a href="javascript:void(0)" class="btn-outline-primary d-inline" onclick="g_data.subordinateAgentControl('${agent.name}')">移除</a></td>
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

    // 创建钱包数据表格
    let walletTable = `
      <table class="table table-borderless table-wallet">
        <tr class="table-secondary">
          <th>钱包币种</th>
          <th>可用余额</th>
          <th>冻结数量</th>
          <th>已缴保证金</th>
          <th>操作</th>
        </tr>
        ${data.data.walletData
        .map(
          (wallet) => `
          <tr>
            <td>${wallet.currency}</td>
            <td>${wallet.balance}</td>
            <td>${wallet.frozen}</td>
            <td>${wallet.credit}</td>
            <td><a href="javascript:void(0)" class="btn-outline-primary d-inline" onclick="g_data.walletControl('${wallet.currency}')">操作</a></td>
          </tr>
        `
        )
        .join("")}
      </table>
    `;

    // 创建发币审核条件表格
    let coinIssuanceTable = `
      <table class="table table-borderless table-coin-issuance">
        <tr class="table-secondary">
          <th>
            <div class="d-flex justify-content-between">
              <div class="d-flex text-nowrap align-items-center gap-2">
                发币审核条件
                <select class="form-select d-inline" aria-label="Default select example" id="coinIssuanceSelect">
                  ${data.data.coinIssuanceLimit
        .map(
          (item, index) => `
                    <option value="${index}" ${index === 0 ? "selected" : ""}>${item.currency}</option>
                  `
        )
        .join("")}
                </select>
              </div>
              <div>
                <button class="btn btn-outline-dark">编辑</button>
              </div>
            </div>
          </th>
        </tr>
        <tr>
          <th class="table-coin-issuance-th1"></th>
        </tr>
        <tr>
          <th class="table-coin-issuance-th2"></th>
        </tr>
        <tr>
          <th class="table-coin-issuance-th3"></th>
        </tr>
        <tr>
          <th class="table-coin-issuance-th4"></th>
        </tr>
      </table>
      <span class="text-muted" style="font-size: 12px">* 待审核订单不会计入笔数条件</span>
    `;

    // 创建发币免审核地址表格
    let coinIssuanceFreeAddressTable = `
      <table class="table table-borderless table-ip-black-list">
        <tr class="table-secondary">
          <th>
            <div class="d-flex justify-content-between">
              <div class="d-flex text-nowrap align-items-center gap-2">
                发币免审核地址
              </div>
              <div class="d-flex gap-2 align-items-center">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="coinIssuanceFreeAddressSwitch" ${data.data.coinIssuanceFreeAddressAvailable ? "checked" : ""
      }>
                  <label class="form-check-label" for="coinIssuanceFreeAddressSwitch">${data.data.coinIssuanceFreeAddressAvailable ? "已开启" : "未开启"
      }</label>
                </div>
                <div>
                  <button class="btn btn-outline-dark">编辑</button>
                </div>
              </div>
            </div>
          </th>
        </tr>
        <tr>
          <td colspan="2" class="p-3">
            <table class="table">
              ${data.data.coinIssuanceFreeAddress && data.data.coinIssuanceFreeAddress.length > 0
        ? data.data.coinIssuanceFreeAddress
          .map(
            (address) => `
                  <tr>
                    <td>${address}</td>
                  </tr>
                `
          )
          .join("")
        : `<tr><td colspan="2" class="text-center"><i class="bi bi-database" style="font-size: 2rem;"></i><br>暂无数据</td></tr>`
      }
            </table>
          </td>
        </tr>
      </table>
    `;

    // 创建两个flex容器，分别包含不同的表格
    let leftDivContent = `
      <div class="d-flex flex-column gap-3" style="flex: 1">
        ${affiliateInfoTable}
        ${agentTable}
      </div>
    `;

    let rightDivContent = `
      <div class="d-flex flex-column gap-3" style="flex: 1">
        ${walletTable}
        ${coinIssuanceTable}
        ${coinIssuanceFreeAddressTable}
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
            name: "Alicecorp" + g_data.pageCurrent,
            no: "JANK_10101",
          },
          {
            name: "AlicecorpGa",
            no: "JAKK_101011",
          },
          {
            name: "VanyaTestAffiliate",
            no: "AFF_646429187",
          },
          {
            name: "BillAgent",
            no: "AFF_987058184",
          },
        ];

        let subordinateAgentHtml = `
        <table class="table table-borderless table-agent-list mt-2">
        <tr class="table-secondary">
          <th>下级商户/代理商名称</th>
          <th>商户/代理商编号</th>
          <th>操作</th>
        </tr>
        ${data && data.length > 0
            ? `
              ${data
              .map(
                (agent) => `
                <tr>
                  <td><a href="javascript:void(0)" class="d-inline" onclick="g_data.viewAffiliateDetail('${agent.name}')">${agent.name}</a></td>
                  <td>${agent.no}</td>
                  <td><a href="javascript:void(0)" class="btn-outline-primary d-inline" onclick="g_data.subordinateAgentControl('${agent.name}')">移除</a></td>
                </tr>
              `
              )
              .join("")}
            `
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
    // 商户信息
    // 支付功能开关  必须在html生成之后
    $("#paymentFunctionSwitch").on("change", function () {
      $("#paymentFunctionSwitch")
        .siblings("label")
        .text($(this).prop("checked") ? "已开启" : "未开启");
      console.log("支付功能开关", $(this).prop("checked"));
    });
    // 售卖功能开关  必须在html生成之后
    $("#sellFunctionSwitch").on("change", function () {
      $("#sellFunctionSwitch")
        .siblings("label")
        .text($(this).prop("checked") ? "已开启" : "未开启");
      console.log("售卖功能开关", $(this).prop("checked"));
    });

    // 上级代理

    // 钱包币种

    // 发币审核条件
    // 显示发币审核条件
    $("#coinIssuanceSelect").on("change", function (e) {
      let index = $(this).val();
      $(".table-coin-issuance")
        .find(".table-coin-issuance-th1")
        .text("数量条件(每笔): " + data.data.coinIssuanceLimit[index].amountLimitPerTrans);
      $(".table-coin-issuance")
        .find(".table-coin-issuance-th2")
        .text("超过 " + data.data.coinIssuanceLimit[index].amountOver + " USDT");
      $(".table-coin-issuance")
        .find(".table-coin-issuance-th3")
        .text("笔数条件(每日)﹡: " + data.data.coinIssuanceLimit[index].frequencyLimitPerDay);
      $(".table-coin-issuance")
        .find(".table-coin-issuance-th4")
        .text("超过 " + data.data.coinIssuanceLimit[index].frequencyOver + " 笔");
    });
    $("#coinIssuanceSelect").trigger("change");
    // IP白名单开关
    $("#ipWhiteListSwitch").on("change", function () {
      console.log("IP白名单开关", $(this).prop("checked"));
      $("#ipWhiteListSwitch")
        .siblings("label")
        .text($(this).prop("checked") ? "已开启" : "未开启");
    });
    // IP黑名单开关
    $("#ipBlackListSwitch").on("change", function () {
      console.log("IP黑名单开关", $(this).prop("checked"));
      $("#ipBlackListSwitch")
        .siblings("label")
        .text($(this).prop("checked") ? "已开启" : "未开启");
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

g_data.walletControl = function (walletID) {
  console.log("操作币种钱包:", walletID);
};
// 移除下级代理
g_data.subordinateAgentControl = function (subordinateID) {
  console.log("移除下级代理:", subordinateID);
};
