<?php
require_once '../../db.php';
header('Content-Type: application/json');

// 接收前端參數
$orderType = $_GET['orderType'] ?? '';
$keyword = $_GET['keyword'] ?? '';
$startDate = $_GET['startDate'] ?? '';
$endDate = $_GET['endDate'] ?? '';
$status = $_GET['status'] ?? '';
$page = max(1, intval($_GET['page'] ?? 1));
$limit = max(1, intval($_GET['limit'] ?? 10));
$offset = ($page - 1) * $limit;

$where = 'WHERE 1=1';
$params = [];

// 關鍵字查詢欄位
if ($keyword !== '') {
    switch ($orderType) {
        case '1': $where .= " AND systemId LIKE :keyword"; break;
        case '2': $where .= " AND orderId LIKE :keyword"; break;
        case '3': $where .= " AND partnerName LIKE :keyword"; break;
        case '4': $where .= " AND sender LIKE :keyword"; break;
        case '5': $where .= " AND userAccount LIKE :keyword"; break;
        case '6': $where .= " AND receiver LIKE :keyword"; break;
    }
    $params[':keyword'] = "%$keyword%";
}

// 時間範圍
if ($startDate !== '') {
    $where .= " AND time >= :startDate";
    $params[':startDate'] = $startDate;
}
if ($endDate !== '') {
    $where .= " AND time <= :endDate";
    $params[':endDate'] = $endDate;
}

if ($status !== '') {
    $where .= " AND progress = :status";
    $params[':status'] = $status;
}

try {
    // 總筆數
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM partner_recharge_orders $where");
    $countStmt->execute($params);
    $totalCount = $countStmt->fetchColumn();
    $totalPage = ceil($totalCount / $limit);

    // 分頁資料
    $stmt = $pdo->prepare("SELECT * FROM partner_recharge_orders $where ORDER BY time DESC LIMIT :offset, :limit");
    foreach ($params as $k => $v) {
        $stmt->bindValue($k, $v);
    }
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    $data = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "data" => $data,
        "total_page" => $totalPage,
        "page" => $page
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "查詢失敗", "message" => $e->getMessage()]);
}
?>
