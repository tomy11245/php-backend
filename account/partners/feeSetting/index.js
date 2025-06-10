// 声明为全局函数，这样 sidebarOnClick 可以调用
$(function () {
  $(".paginationContent").load("/common/page/pagination/pagination.html");


  // 搜索按钮
  $("#searchBtn").on("click", function () {
    requestData();
  });
  // 重置按钮
  $("#resetBtn").click(function () {
    $("#orderNo").val("1");
    $("#orderNoInput").val("");
    $("#encryptedNetwork").val("1");
    $("#duringDateStart").val("");
    $("#duringDateEnd").val("");
    $("#quantityNumMin").val("");
    $("#quantityNumMax").val("");
  });
  // 导出按钮
  $("#exportBtn").click(function () {
    console.log("导出");
  });
  requestData();
});
g_data.pageCurrent = 1;
g_data.total_page = 1;
function requestData() {
  let cb = function (data) {
    data = [
      {
        username: "Alicecorp",
        currency: "YU币",
        minDeposit: "3.00",
        payoutRange: "0.10 ~ 10,000.00",
        minWithdraw: "0.100000",
      },
      {
        username: "AlicecorpGa",
        currency: "YU币",
        minDeposit: "3.00",
        payoutRange: "0.10 ~ 10,000.00",
        minWithdraw: "0.100000",
      },
      {
        username: "denny",
        currency: "YU币",
        minDeposit: "2.00",
        payoutRange: "2.00 ~ 2,222,222.00",
        minWithdraw: "3.000000",
      },
      {
        username: "VanyaTest",
        currency: "YU币",
        minDeposit: "20.00",
        payoutRange: "1.00 ~ 200.00",
        minWithdraw: "20.000000",
      },
      {
        username: "VanyaTest2",
        currency: "YU币",
        minDeposit: "20.00",
        payoutRange: "1.00 ~ 200.00",
        minWithdraw: "100.000000",
      },
      {
        username: "BillPartner",
        currency: "YU币",
        minDeposit: "100.00",
        payoutRange: "10.00 ~ 10,000.00",
        minWithdraw: "100.000000",
      },
      {
        username: "VanyaTest3",
        currency: "YU币",
        minDeposit: "20.00",
        payoutRange: "1.00 ~ 200.00",
        minWithdraw: "200.000000",
      },
      {
        username: "white",
        currency: "YU币",
        minDeposit: "1.00",
        payoutRange: "1.00 ~ 1,020,000.00",
        minWithdraw: "10.000000",
      },
      {
        username: "Dazzle",
        currency: "YU币",
        minDeposit: "0.10",
        payoutRange: "0.10 ~ 1,000.00",
        minWithdraw: "0.100000",
      },
      {
        username: "white1",
        currency: "YU币",
        minDeposit: "1.00",
        payoutRange: "1.00 ~ 1,000,000.00",
        minWithdraw: "10.000000",
      },
    ];

    // 保存商户数据到全局变量
    g_data.merchantList = data;

    let tableHtml = `
      <table class="table">
        <thead>
          <tr class="table-secondary">
            <th>商户名称</th>
            <th>币种</th>
            <th>最小充值数量</th>
            <th>代付范围</th>
            <th>最小提币数量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          ${data.map(
      (item, index) => `
              <tr>
                <td>${item.username}</td>
                <td>${item.currency}</td>
                <td>${item.minDeposit}</td>
                <td>${item.payoutRange}</td>
                <td>${item.minWithdraw}</td>
                <td><a href="javascript:void(0)" class="text-primary" onclick="g_data.editFeeSetting(${index})">编辑</a></td>
              </tr>
            `
    ).join("")}
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

// 修改编辑函数，通过索引获取商户数据
g_data.editFeeSetting = function (index) {
  const merchantData = g_data.merchantList[index];
  console.log("编辑费率设置:", merchantData.username);

  let id = "#exampleModal";

  // 提取代付范围的最小值和最大值
  const payoutRangeParts = merchantData.payoutRange.split(' ~ ');
  const minPayout = payoutRangeParts[0];
  const maxPayout = payoutRangeParts[1].replace(/,/g, '');

  // 生成模态框的header内容
  const modalHeader = `
    <div class="modal-header">
      <h1 class="modal-title fs-5" id="exampleModalLabel">编辑费率设置</h1>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
  `;

  // 生成模态框的body内容
  const modalBody = `
    <div class="modal-body">
      <table class="table table-borderless w-100">
        <thead>
          <tr style="height: 40px;">
            <th class="fw-normal" colspan="2">商户信息：</th>
          </tr>
        </thead>
        <tbody>
          <tr style="line-height: 30px;">
            <td style="width: 150px; text-align: right;">商户名：</td>
            <td>${merchantData.username}</td>
          </tr>
        </tbody>
      </table>
      <hr class="my-3">
      <table class="table table-borderless w-100">
        <thead>
          <tr style="height: 40px;">
            <th class="fw-normal" colspan="2">官方收取费率设定(每笔):</th>
          </tr>
        </thead>
        <tbody>
          <tr style="line-height: 30px;">
            <td style="width: 150px; text-align: right;">币种:</td>
            <td>${merchantData.currency}</td>
          </tr>
          <tr>
            <td style="width: 150px; text-align: right;">最小充值数量:</td>
            <td>
              <div class="input-group">
                <input type="number" class="form-control" id="minDeposit" value="${parseFloat(merchantData.minDeposit)}" placeholder="最小充值数量">
                <span class="input-group-text">${merchantData.currency}</span>
              </div>
            </td>
          </tr>
          <!-- 代付范围 -->
          <tr style="line-height: 30px;">
            <td style="width: 150px; text-align: right;">代付范围:</td>
            <td>
              <div class="input-group">
                <input type="number" class="form-control" id="minPayout" value="${minPayout}" placeholder="最小代付数量">
                <span class="input-group-text">～</span>
                <input type="number" class="form-control" id="maxPayout" value="${maxPayout}" placeholder="最大代付数量">
                <span class="input-group-text">${merchantData.currency}</span>
              </div>
            </td>
          </tr>
          <tr style="line-height: 30px;">
            <td style="width: 150px; text-align: right;">最小提币数量:</td>
            <td>
              <div class="input-group">
                <input type="number" class="form-control" id="minWithdraw" value="${parseFloat(merchantData.minWithdraw)}" placeholder="最小提币数量">
                <span class="input-group-text">${merchantData.currency}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  // 使用数据索引传递给保存函数
  const modalFooter = `
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
      <button type="button" class="btn btn-primary" onclick="g_data.saveFeeSetting(${index})">保存</button>
    </div>
  `;

  // 组装完整的模态框内容
  const modalContent = modalHeader + modalBody + modalFooter;

  // 将内容添加到模态框
  $(id).find(".modal-content").html(modalContent);
  $(id).modal("show");
};

// 修改保存函数，通过索引获取商户数据
g_data.saveFeeSetting = function (index) {
  const merchantData = g_data.merchantList[index];

  // 获取表单数据
  const minDeposit = $("#minDeposit").val();
  const minPayout = $("#minPayout").val();
  const maxPayout = $("#maxPayout").val();
  const minWithdraw = $("#minWithdraw").val();

  // 格式化最大代付数量（添加千位分隔符）
  const formattedMaxPayout = Number(maxPayout).toLocaleString();

  console.log("保存费率设置:", {
    username: merchantData.username,
    minDeposit,
    payoutRange: `${minPayout} ~ ${formattedMaxPayout}`,
    minWithdraw
  });

  // 这里应该添加AJAX请求，将数据提交到服务器
  /*
  $.ajax({
    url: '/api/partners/updateFeeSetting',
    type: 'POST',
    data: {
      username: merchantData.username,
      minDeposit: minDeposit,
      minPayout: minPayout,
      maxPayout: maxPayout,
      minWithdraw: minWithdraw
    },
    success: function(response) {
      if (response.success) {
        // 更新本地数据
        merchantData.minDeposit = minDeposit;
        merchantData.payoutRange = `${minPayout} ~ ${formattedMaxPayout}`;
        merchantData.minWithdraw = minWithdraw;
        
        // 显示成功提示
        alert('保存成功！');
        
        // 关闭模态框并刷新数据
        $("#exampleModal").modal("hide");
        requestData();
      } else {
        // 显示错误信息
        alert('保存失败：' + response.message);
      }
    },
    error: function(err) {
      console.error('保存失败:', err);
      alert('网络错误，请稍后再试');
    }
  });
  */

  // 临时处理：更新数据并关闭模态框
  merchantData.minDeposit = minDeposit;
  merchantData.payoutRange = `${minPayout} ~ ${formattedMaxPayout}`;
  merchantData.minWithdraw = minWithdraw;

  $("#exampleModal").modal("hide");

  // 刷新表格
  requestData();
};
