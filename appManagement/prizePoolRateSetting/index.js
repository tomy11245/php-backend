$(function () {
  console.log("prizePoolRateSetting");
  requestData();
});
g_data.pageCurrent = 1;
g_data.total_page = 5;
function requestData() {
  let prizePoolRateOld;
  let cb = function (data) {
    data = {
      status: "success",
      data: {
        prizePoolRate: "80"
      },
    };
    prizePoolRateOld = data.data.prizePoolRate;
    $("#prizePoolRate").val(prizePoolRateOld);
    // $("#prizePoolRate").trigger("change");
    $("#updateBtn").attr("disabled", true);
  };


  $("#prizePoolRate").on("input change", function () {
    let prizePoolRate = $(this).val();
    if (prizePoolRate != prizePoolRateOld) {
      $("#updateBtn").attr("disabled", false);
    } else {
      $("#updateBtn").attr("disabled", true);
    }
  });

  $("#updateBtn").on("click", function () {
    let prizePoolRate = $("#prizePoolRate").val();
    console.log(prizePoolRate);
  });

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

