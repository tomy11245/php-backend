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
        case '1': $where .= " AND system_id LIKE :keyword"; break;
        case '2': $where .= " AND buyer LIKE :keyword"; break;
        case '3': $where .= " AND seller LIKE :keyword"; break;
    }
    $params[':keyword'] = "%$keyword%";
}

if ($status !== '') {
    $where .= " AND status = :status";
    $params[':status'] = $status;
}

try {
    // 總筆數
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM partner_c2c_orders_appealing $where");
    $countStmt->execute($params);
    $totalCount = $countStmt->fetchColumn();
    $totalPage = ceil($totalCount / $limit);

    // 分頁資料
    $stmt = $pdo->prepare("SELECT * FROM partner_c2c_orders_appealing $where ORDER BY create_time DESC LIMIT :offset, :limit");
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
