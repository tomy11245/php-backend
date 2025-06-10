// 全局数据
window.g_data = {
  api_url: "https://jsonplaceholder.typicode.com/posts",
  // api_url: "https://dev.api.yubiservices.com",
  tron_transaction_url: "https://nile.tronscan.org/#/transaction/",
  tron_address_url: "https://nile.tronscan.org/#/address/",
  pageCurrent: 1,
  total_page: 1,
};
// 全局工具
window.g_util = {};
window.g_util.hash2params = function (hash) {
  return hash
    .split("?")[1]
    .split("&")
    .reduce((acc, param) => {
      const [key, value] = param.split("=");
      acc[key] = value;
      return acc;
    }, {});
};
