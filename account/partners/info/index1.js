$(function () {
  let params = g_util.hash2params(window.location.hash);
  console.log("/account/partners/info/", params.id);
  g_data.highlightSidebar("/account/partners/", "商户详情");
  requestData(params.id);

});

function requestData(params) {
  let cb = function (data) {
    
    // 创建商户信息表格
    let partnerInfoTable = `
      <table class="table table-borderless">
        <tr class="table-secondary">
          <th colspan="2">商户信息</th>
        </tr>
        <tr>
          <td>商户名称:</td> </tr>
        <tr>
          <td>${data.data.partnerData.name}</td>
        </tr>
        <tr>
          <td>商户编号:</td> </tr>
        <tr>
          <td>${data.data.partnerData.no}</td>
        </tr>
        <tr>
          <td>状态:</td> </tr>
        <tr>
          <td><span class="badge ${data.data.partnerData.status === 1 ? "text-bg-success" : "text-bg-danger"}">${data.data.partnerData.status === 1 ? "已注册" : "未注册"
      }</span></td>
        </tr>
        <tr>
          <td>安全验证:</td> </tr>
        <tr>
          <td><!--Google验证: ${data.data.partnerData.securityVerification.google ? "已开启" : "未开启"
      } <a href="javascript:void(0)" class="btn-outline-primary d-inline">设置</a> <br>!-->
              资金密码: ${data.data.partnerData.securityVerification.fundPassword ? "已设置" : "未设置"
      } <a href="javascript:void(0)" class="btn-outline-primary d-inline">设置</a></td>
        </tr>
        <tr>
          <td>币种地址:</td> </tr>
        <tr>
          <td>TRON: <a href="javascript:void(0)" class="d-inline" onclick="g_data.viewTronAddressDetail('${data.data.partnerData.coinAddress.tron}')">${data.data.partnerData.coinAddress.tron
      }</a><br>
              YU: ${data.data.partnerData.coinAddress.yu}</td>
        </tr>
        <tr>
          <td>支付功能:</td> </tr>
        <tr>
          <td>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="paymentFunctionSwitch" ${data.data.partnerData.paymentFunction ? "checked" : ""}>
            <label class="form-check-label" for="paymentFunctionSwitch">${data.data.partnerData.paymentFunction ? "已开启" : "未开启"}</label>
          </div>
          </td>
        </tr>
        <tr>
          <td>售卖功能:</td> </tr>
        <tr>
          <td>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" role="switch" id="sellFunctionSwitch" ${data.data.partnerData.sellFunction ? "checked" : ""}>
              <label class="form-check-label" for="sellFunctionSwitch">${data.data.partnerData.sellFunction ? "已开启" : "未开启"}</label>
            </div>
          </td>
        </tr>
      </table>
    `;

    // 创建代理表格（嵌套上下级代理表格）
    let agentTable = `
      <table class="table table-borderless table-agent-list">
        <tr class="table-secondary">
          <th colspan="2">代理列表</th>
        </tr>
        <tr>
          <td colspan="2" class="p-3">
            ${data.data.partnerListData.superiorAgent && data.data.partnerListData.superiorAgent.length > 0
        ? `
              <table class="table table-borderless">
                <tr class="table-secondary">
                  <th>上级代理商名称</th>
                  <th>代理商编号</th>
                </tr>
                ${data.data.partnerListData.superiorAgent
          .map(
            (agent) => `
                  <tr>
                    <td><a href="javascript:void(0)" class="d-inline" onclick="g_data.viewAgentDetail('${agent.id}')">${agent.name}</a></td>
                    <td>${agent.no}</td>
                  </tr>
                `
          )
          .join("")}
              </table>
            `
        : ""
      }
            
            ${data.data.partnerListData.subordinateAgent && data.data.partnerListData.subordinateAgent.length > 0
        ? `
              <table class="table table-borderless table-agent-list mt-2">
                <tr class="table-secondary">
                  <th>下级代理商名称</th>
                  <th>代理商编号</th>
                </tr>
                ${data.data.partnerListData.subordinateAgent
          .map(
            (agent) => `
                  <tr>
                    <td><a href="javascript:void(0)" class="d-inline" onclick="g_data.viewAgentDetail('${agent.id}')">${agent.name}</a></td>
                    <td>${agent.no}</td>
                  </tr>
                `
          )
          .join("")}
              </table>
            `
        : ""
      }
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
          <td>${wallet.deposit || 0}</td>
          <td> <a href="javascript:void(0)" class="btn-outline-primary d-inline" onclick="g_data.walletControl('${wallet.id}')">操作</a></td>
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

    // 创建IP白名单表格
    let ipWhiteListTable = `
      <table class="table table-borderless table-ip-white-list">
        <tr class="table-secondary">
          <th>
            <div class="d-flex justify-content-between">
              <div class="d-flex text-nowrap align-items-center gap-2">
                IP白名单
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="ipWhiteListSwitch" ${data.data.ipWhiteListAvailable ? "checked" : ""}>
                <label class="form-check-label" for="ipWhiteListSwitch">${data.data.ipWhiteListAvailable ? "已开启" : "未开启"}</label>
              </div>
            </div>
          </th>
        </tr>
        <tr>
          <td colspan="2" class="p-3">
            ${data.data.ipWhiteList && data.data.ipWhiteList.length > 0
        ? `<table class="table">
                  ${data.data.ipWhiteList
          .map(
            (ip) => `
                    <tr>
                      <td>${ip}</td>
                    </tr>
                  `
          )
          .join("")}
                </table>`
        : ""
      }
          </td>
        </tr>
      </table>
    `;

    // 创建IP黑名单表格
    let ipBlackListTable = `
    <table class="table table-borderless table-ip-black-list">
      <tr class="table-secondary">
        <th>
          <div class="d-flex justify-content-between">
            <div class="d-flex text-nowrap align-items-center gap-2">
              IP黑名单
            </div>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" role="switch" id="ipBlackListSwitch" ${data.data.ipBlackListAvailable ? "checked" : ""}>
              <label class="form-check-label" for="ipBlackListSwitch">${data.data.ipBlackListAvailable ? "已开启" : "未开启"}</label>
            </div>
          </div>
        </th>
      </tr>
      <tr>
        <td colspan="2" class="p-3">
          ${data.data.ipBlackList && data.data.ipBlackList.length > 0
        ? `<table class="table">
                ${data.data.ipBlackList
          .map(
            (ip) => `
                  <tr>
                    <td>${ip}</td>
                  </tr>
                `
          )
          .join("")}
              </table>`
        : ""
      }
        </td>
      </tr>
    </table>
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
                  <input class="form-check-input" type="checkbox" role="switch" id="ipBlackListSwitch" ${data.data.ipBlackListAvailable ? "checked" : ""}>
                  <label class="form-check-label" for="ipBlackListSwitch">${data.data.ipBlackListAvailable ? "已开启" : "未开启"}</label>
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
            (ip) => `
                        <tr>
                          <td>${ip}</td>
                        </tr>`
          )
          .join("")
        : `<tr><td colspan="2" class="text-center"> <i class="bi bi-database" style="font-size: 2rem;"></i> <br>暂无数据</td></tr>`
      }
            </table>
          </td>
        </tr>
      </table>
    `;
    // 创建两个flex容器，分别包含不同的表格
    let leftDivContent = `
      <div class="d-flex  flex-column  gap-3" style="flex: 1">
        ${partnerInfoTable}
        ${agentTable}
      </div>
    `;

    let rightDivContent = `
      <div class="d-flex flex-column  gap-3" style="flex: 1">
        ${walletTable}
        ${coinIssuanceTable}
        ${ipWhiteListTable}
        ${ipBlackListTable}
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
    url: `/api/partners/detail.php`,
    type: "GET",
    data: { id : params },
    success: function(res) {
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
g_data.viewAgentDetail = function (agentID) {
  console.log("查看代理详情:", agentID);
};

