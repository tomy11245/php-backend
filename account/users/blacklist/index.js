function requestData() {
  $.get("/api/users/blacklist.php", function (res) {
    if (res.code === 0) {
      renderList(res.data);
    } else {
      alert("獲取資料失敗");
    }
  });
}

function renderList(data) {
  const tbody = $("#blacklistTable tbody");
  tbody.empty();
  if (!data.length) {
    tbody.append(`<tr><td colspan="5">暂无数据</td></tr>`);
    return;
  }
  data.forEach((row, i) => {
    tbody.append(`
      <tr>
        <td>${i + 1}</td>
        <td>${row.uid}</td>
        <td>${row.account}</td>
        <td>${row.id_number || '-'}</td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="g_data.removeBlacklist('${row.uid}')">移出</button></td>
      </tr>
    `);
  });
}

const g_data = {};
g_data.removeBlacklist = function (uid) {
  if (!confirm(`確定要將 ${uid} 移出黑名單？`)) return;
  $.post("/api/users/set_blacklist.php", {
    uid,
    blacklist: 0
  }, function (res) {
    if (res.code === 0) {
      alert("已移出黑名單");
      requestData();
    } else {
      alert("操作失敗：" + res.message);
    }
  });
};

$("#usersBlacklistAddBtn").on("click", function () {
  const uid = prompt("請輸入要加入黑名單的 UID：");
  if (!uid) return;
  $.post("/api/users/set_blacklist.php", {
    uid,
    blacklist: 1
  }, function (res) {
    if (res.code === 0) {
      alert("已加入黑名單");
      requestData();
    } else {
      alert("加入失敗：" + res.message);
    }
  });
});

$("#usersBlacklistRefreshBtn").on("click", function () {
  requestData();
});

$(document).ready(() => requestData());
