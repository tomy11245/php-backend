$(function () {
  // 初始化数据
  requestData();
  // 存储原始数据，用于检测变更
});
g_data.originalData = {};



function requestData() {
  let cb = function (response) {
    // 模拟数据，实际应用中从服务器获取
    const data = {
      success: true,
      data: {
        0: {
          sellCount: 0,
          sellAmount: 0,
          flashAmount: 0
        },
        1: {
          sellCount: 1,
          sellAmount: 10,
          flashAmount: 1
        },
        2: {
          sellCount: 2,
          sellAmount: 200,
          flashAmount: 200
        },
        3: {
          sellCount: 3,
          sellAmount: 300,
          flashAmount: 300
        },
        4: {
          sellCount: 4,
          sellAmount: 400,
          flashAmount: 400
        },
        5: {
          sellCount: 5,
          sellAmount: 500,
          flashAmount: 500
        },
        6: {
          sellCount: 6,
          sellAmount: 600,
          flashAmount: 600
        },
        7: {
          sellCount: 7,
          sellAmount: 700,
          flashAmount: 700
        },
        8: {
          sellCount: 8,
          sellAmount: 800,
          flashAmount: 800
        },
        9: {
          sellCount: 9,
          sellAmount: 900,
          flashAmount: 900
        },
        10: {
          sellCount: 10,
          sellAmount: 1000,
          flashAmount: 1000
        }
      }
    };

    // 保存原始数据供后续比较
    if (response && response.success) {
      Object.assign(g_data.originalData, response.data);
    } else {
      Object.assign(g_data.originalData, data.data);
    }

    // 生成VIP等级设置表格内容
    let tableHtml = `
      <div class="d-flex flex-column gap-3" style="max-width: 600px;">
        <table class="table table-borderless table-agent-list">
          <tbody>
            <tr class="table-secondary">
              <th colspan="2">用户发币审核条件</th>
            </tr>`;

    // 循环生成10个VIP等级的设置
    for (let i = 0; i <= 10; i++) {
      tableHtml += `
            <tr>
              <td class="fs-6 fw-semibold">VIP等级 ${i}</td>
            </tr>
            <tr>
              <td>卖单笔数</td>
            </tr>
            <tr>
              <td>
                <div class="input-group input-group-sm" style="max-width: 300px;">
                  <input type="text" class="form-control vip-input" id="sellCount_${i}" data-vip="${i}" data-field="sellCount" value="${data.data[i].sellCount}" aria-label="卖单笔数" autocomplete="off" required>
                </div>
              </td>
            </tr>
            <tr>
              <td>卖单数量</td>
            </tr>
            <tr>
              <td>
                <div class="input-group input-group-sm" style="max-width: 300px;">
                  <input type="text" class="form-control vip-input" id="sellAmount_${i}" data-vip="${i}" data-field="sellAmount" value="${data.data[i].sellAmount}" aria-label="卖单数量" autocomplete="off" required>
                </div>
              </td>
            </tr>
            <tr>
              <td>闪兑数量</td>
            </tr>
            <tr>
              <td>
                <div class="input-group input-group-sm" style="max-width: 300px;">
                  <input type="text" class="form-control vip-input" id="flashAmount_${i}" data-vip="${i}" data-field="flashAmount" value="${data.data[i].flashAmount}" aria-label="闪兑数量" autocomplete="off" required>
                </div>
              </td>
            </tr>`;
    }

    tableHtml += `
            <tr>
              <td><button type="button" id="vipUpdateBtn" class="btn btn-outline-dark" style="margin-left: auto" disabled>更新</button></td>
            </tr>
          </tbody>
        </table>
      </div>`;

    $('.dataContent').html(tableHtml);

    // 设置输入框变更监听
    setupInputChangeListeners();
  };

  $.ajax({
    url: g_data.api_url || "/api/vipSetting",
    type: "GET",
    success: function (res) {
      cb(res);
    },
    error: function (err) {
      console.log("API请求错误：", err);
      // 使用模拟数据
      cb(null);
    }
  });
}

// 设置输入框变更监听
function setupInputChangeListeners() {
  // 监听所有VIP输入框变更
  $('.vip-input').on('input', function () {
    checkInputChanges();
  });

  // 设置更新按钮点击事件
  $('#vipUpdateBtn').on('click', function () {
    if (!$(this).prop('disabled')) {
      updateVipSettings();
    }
  });
}

// 检查所有输入是否有变更
function checkInputChanges() {
  let hasChanges = false;

  // 检查每个输入框的值是否与原始数据不同
  $('.vip-input').each(function () {
    const $input = $(this);
    const vipLevel = $input.data('vip');
    const fieldName = $input.data('field');
    const currentValue = $input.val();

    // 转换为相同类型进行比较（确保字符串"10"和数字10被视为相同）
    const originalValue = String(g_data.originalData[vipLevel][fieldName]);

    if (currentValue !== originalValue) {
      hasChanges = true;
      return false; // 跳出each循环
    }
  });

  // 根据是否有变更启用或禁用更新按钮
  $('#vipUpdateBtn').prop('disabled', !hasChanges);
}

// 更新VIP设置
function updateVipSettings() {
  // 收集所有更新后的数据
  const updatedData = {};

  // 循环处理所有VIP等级
  for (let i = 0; i <= 10; i++) {
    updatedData[i] = {
      sellCount: $('#sellCount_' + i).val(),
      sellAmount: $('#sellAmount_' + i).val(),
      flashAmount: $('#flashAmount_' + i).val()
    };
  }

  // 发送更新请求
  sendUpdateRequest('/api/updateVipSettings', updatedData, function (success) {
    if (success) {
      // 更新成功，更新原始数据
      Object.assign(g_data.originalData, updatedData);
      $('#vipUpdateBtn').prop('disabled', true);
      alert('VIP设置更新成功');
    }
  });
}

// 发送更新请求
function sendUpdateRequest(url, data, callback) {
  // 模拟API请求
  console.log("发送更新请求:", url, data);

  // 实际应用中应该使用$.ajax发送请求
  setTimeout(function () {
    console.log("更新成功");
    callback(true);
  }, 500);

  // 实际的AJAX请求代码:
  /*
  $.ajax({
    url: url,
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function(res) {
      if (res.success) {
        callback(true);
      } else {
        alert("更新失败: " + res.message);
        callback(false);
      }
    },
    error: function(err) {
      console.log(err);
      alert("更新请求失败，请重试");
      callback(false);
    }
  });
  */
}




