window._set_pagination = function (current, pages, callback) {
  let pageCurrent = current;
  let total_page = pages;
  const paginationContainer = $(".pagination");
  paginationContainer.empty();
  paginationContainer.append(`
    <li class="page-item ">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `);

  let arr = getArr(pageCurrent, total_page);
  function getArr(index, total_page) {
    // 简化计算，默认显示index前后各两个
    let dis = 2;
    let start = index - dis;
    let end = index + dis;
    if (start < 1) {
      end += 1 - start;
      if (end > total_page) {
        end = total_page;
      }
      start = 1;
    }

    if (end > total_page) {
      start -= end - total_page;
      if (start < 1) {
        start = 1;
      }
      end = total_page;
    }
    let arr = [];
    for (let i = start; i <= end; i++) {
      arr.push(i);
    }
    return arr;
  }
  if (arr[0] > 3) {
    createPageLink(1, pageCurrent);
    createPageLink(false, pageCurrent);
  } else if (arr[0] > 2) {
    createPageLink(1, pageCurrent);
    createPageLink(2, pageCurrent);
  } else if (arr[0] > 1) {
    createPageLink(1, pageCurrent);
  }
  arr.forEach((i) => {
    createPageLink(i, pageCurrent);
  });
  let last = arr[arr.length - 1];
  if (total_page - last > 2) {
    createPageLink(false, pageCurrent);
    createPageLink(total_page, pageCurrent);
  } else if (total_page - last > 1) {
    createPageLink(total_page - 1, pageCurrent);
    createPageLink(total_page, pageCurrent);
  } else if (total_page - last > 0) {
    createPageLink(total_page, pageCurrent);
  }

  function createPageLink(i, pageCurrent) {
    if (!i) {
      const pageLink = $(`
        <li class="page-item" >
          <a class="page-link" href="#" style="pointer-events: none;">...</a>
        </li>
      `);
      pageLink.find("a").click(function (e) {
        e.preventDefault();
      });
      paginationContainer.append(pageLink);
      return;
    }
    const activeClass = i === pageCurrent ? "active" : "";
    const pageLink = $(`
      <li class="page-item ${activeClass}">
        <a class="page-link" href="#">${i}</a>
      </li>
    `);
    pageLink.find("a").click(function (e) {
      e.preventDefault();
      pageCurrent = i;
      callback(i);
    });
    paginationContainer.append(pageLink);
  }
  paginationContainer.append(`
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `);

  $(".page-link[aria-label='Previous']").click(function (e) {
    e.preventDefault();
    if (pageCurrent > 1) {
      callback(--pageCurrent);
    }
  });

  $(".page-link[aria-label='Next']").click(function (e) {
    e.preventDefault();
    if (pageCurrent < total_page) {
      callback(++pageCurrent);
    }
  });
};
