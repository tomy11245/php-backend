$(function () {

  /*
  // 如果进入后台页， 并且没有登录， 则跳转到登录页
  if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "/login/index.html";
  }

  // 退出登录
  $("#logoutBtn").on("click", function () {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login/index.html";
  });

  */
  $(window).on("popstate", function (e) {
    handleHashRoute();
  });
  // 首次加载时检查hash
  handleHashRoute();
});

// hash路由处理函数
function handleHashRoute() {
  // 获取当前hash（去掉#号）
  const hash = window.location.hash.replace("#", "");
  if (!hash) {
    // 没有hash时加载默认页面
    window.location.hash = "/default/";
    return;
  }
  let container = $("#content .container-fluid");
  // 清理当前页面资源

  container.empty();
  // 加载新页面
  container.load(hash, function () {
    
    const queryStr = hash.includes("?") ? hash.split("?")[1] : "";
    const params = new URLSearchParams(queryStr);
    id = params.get("id");

    
    let element = $(`[id="${id}"]`);
    if (element.length > 0) {
      document.title = element.text();
      //sidebar 选中状态
      $(".sidebar-active").removeClass("sidebar-active");
      $(element).addClass("sidebar-active");
      let accordionItem = $(element).closest(".accordion-item");
      if (accordionItem.length > 0) {
        accordionItem.find("h2 a").addClass("sidebar-active");
      }
    }
  });
}
// 高亮侧边栏 隐藏info页面 需要高亮其他按钮
g_data.highlightSidebar = function (elementID, titleText) {
  let element = $(`[id="${elementID}"]`);
  if (element.length > 0) {
    document.title = titleText;
    //sidebar 选中状态
    $(".sidebar-active").removeClass("sidebar-active");
    $(element).addClass("sidebar-active");
    let accordionItem = $(element).closest(".accordion-item");
    if (accordionItem.length > 0) {
      accordionItem.find("h2 a").addClass("sidebar-active");
    }
  }
};
// 点击 用户号
g_data.viewUserDetail = function (userId) {
  console.log("查看用户详情:", userId);
  let hash = "/account/users/info/?id=" + userId;
  window.location.hash = hash;
};
// 点击 Tron 地址 
g_data.viewTronAddressDetail = function (address) {
  console.log("查看Tron交易详情:", address);
  window.open(g_data.tron_address_url + address, "_blank");
};
// 点击 Tron 交易
g_data.viewTronTransactionDetail = function (txId) {
  console.log("查看Tron交易详情:", txId);
  window.open(g_data.tron_transaction_url + txId, "_blank");
};
// 点击 商户名称
g_data.viewPartnersDetail = function (partnersName) {
  console.log("查看商户名称详情:", partnersName);
  let hash = "/account/partners/info/?id=" + partnersName;
  window.location.hash = hash;
};
// 点击 代理商名称
g_data.viewAffiliateDetail = function (affiliateName) {
  console.log("查看代理商名称详情:", affiliateName);
  let hash = "/account/affiliates/info/?id=" + affiliateName;
  window.location.hash = hash;
};
// 点击来源订单号
g_data.viewSourceOrderDetail = function (orderId) {
  console.log("查看来源订单详情:", orderId);
  let hash = "/c2cOrders/buy/info/?id=" + orderId;
  window.location.hash = hash;
};
// 点击 交易订单号
g_data.viewTransactionDetail = function (transactionId) {
  console.log("查看交易详情:", transactionId);
  let hash = "/c2cOrders/sell/info/?id=" + transactionId;
  window.location.hash = hash;
};

// 查看视频
g_data.viewVideo = function (videoUrl) {
  let id = "#exampleModal";
  console.log("查看视频:", videoUrl);
  // 设置 Modal 标题
  $("#exampleModalLabel").text("查看视频");
  // 插入视频
  $(id).find(".modal-content").html(`
    <div class="modal-header">
      <h1 class="modal-title fs-5" id="exampleModalLabel">查看视频</h1>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <video 
        src="${videoUrl}" 
        controls 
        style="width: 100%; height: 100%; object-fit: contain;">
      </video>
    </div>
  `);



  $(id).find("video").get(0).autoplay = true;
  // 显示 Modal
  $(id).modal("show");
  $(id)
    .off("hidden.bs.modal")
    .on("hidden.bs.modal", function () {
      let video = $(this).find("video").get(0);
      if (video) {
        video.pause();
        video.src = "";
      }
      $(this).find(".modal-content").empty();
    });
};

// 查看图片
g_data.viewImage = function (imageUrl) {
  let id = "#exampleModal";
  console.log("查看图片:", imageUrl);
  $(id).find(".modal-content").html(`
    <div class="modal-header">
      <h1 class="modal-title fs-5" id="exampleModalLabel">查看图片</h1>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <img src="${imageUrl}" alt="图片" style="width: 100%; height: 100%; object-fit: contain;">
    </div>
  `);
  $(id).modal("show");
};
