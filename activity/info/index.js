$(function () {
  let params = g_util.hash2params(window.location.hash);
  let orderId = params.id;
  console.log("/activity/info/", orderId);
  g_data.highlightSidebar("/activity/", "活动详情");
  requestData(orderId);
});

function requestData(orderId) {
  let cb = function (data) {
    data = {
      status: "success",
      data: [
        {
          title: "新注册完成kyc送200",
          content: "新注册完成kyc送200",
          startDate: "2025/03/12 15:40:00",
          endDate: "2025/03/13 23:59:59",
          type: "完成身份认证",
          targetVips: "VIP 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
          condition: "完成身份认证",
          reward: "送 200.00 YU币",
          rewardTimes: "单次",
          rewardTiming: "条件达成后",
          images: ["/test-data/202503111011453145.png", "/test-data/splitfiction.png"],
          participants: "0",
          totalReward: "0.00 YU币",
          status: "进行中",
        },
      ],
    };

    // 获取单个活动数据
    let item = data.data[0];

    tableHtml = `
      <table class="table table-borderless">
        <tr class="table-secondary">
          <th>
          <div class="d-flex justify-content-between">
              <div class="d-flex text-nowrap align-items-center gap-2">
                活动详情
                
              </div>
           <div class="d-flex text-nowrap align-items-center gap-2">
                <button class="btn btn-outline-dark">编辑活动</button>

                 <button class="btn btn-outline-dark">立即结束</button>
              </div>
            </div>
          
          </th>
        </tr>
        <tr>
          <td>活动标题:</td>
        </tr>
        <tr>
          <td>${item.title}</td>
        </tr>
        <tr>
          <td>活动内容:</td>
        </tr>
        <tr>
          <td>${item.content}</td>
        </tr>
        <tr>
          <td>活动开始日期:</td>
        </tr>
        <tr>
          <td>${item.startDate}</td>
        </tr>
        <tr>
          <td>活动结束日期:</td>
        </tr>
        <tr>
          <td>${item.endDate}</td>
        </tr>
        <tr>
          <td>活动种类:</td>
        </tr>
        <tr>
          <td>${item.type}</td>
        </tr>
        <tr>
          <td>奖励对象:</td>
        </tr>
        <tr>
          <td>${item.targetVips}</td>
        </tr>
        <tr>
          <td>触发条件:</td>
        </tr>
        <tr>
          <td>${item.condition}</td>
        </tr>
        <tr>
          <td>奖励数值:</td>
        </tr>
        <tr>
          <td>${item.reward}</td>
        </tr>
        <tr>
          <td>奖励发放次数:</td>
        </tr>
        <tr>
          <td>${item.rewardTimes}</td>
        </tr>
        <tr>
          <td>何时发放奖励:</td>
        </tr>
        <tr>
          <td>${item.rewardTiming}</td>
        </tr>
        <tr>
          <td>活动照片:</td>
        </tr>
               <tr>
          <td>
            ${item.images
              .map(
                (url) => `
              <a href="javascript:void(0)" onclick="g_data.viewImage('${url}')">
                ${url.split("/").pop()}
              </a><br>
            `
              )
              .join("")}
          </td>
        </tr>
        <tr>
          <td>参与人数:</td>
        </tr>
        <tr>
          <td>${item.participants}</td>
        </tr>
        <tr>
          <td>活动发放总奖励:</td>
        </tr>
        <tr>
          <td>${item.totalReward}</td>
        </tr>
        <tr>
          <td>活动状态:</td>
        </tr>
        <tr>
          <td>
            <span class="badge text-bg-${item.status == "进行中" ? "primary" : "success"}">${item.status}</span>
          </td>
        </tr>
      </table>
    `;

    // 插入表格到指定位置
    $(".dataContent").html(tableHtml);
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
