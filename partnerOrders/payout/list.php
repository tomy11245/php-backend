<?php
header('Content-Type: application/json');
require_once '../../db.php';

$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 10;
$offset = ($page - 1) * $limit;

$orderType = $_GET['orderType'] ?? '';
$keyword = trim($_GET['keyword'] ?? '');
$dateStart = $_GET['duringDateStart'] ?? '';
$dateEnd = $_GET['duringDateEnd'] ?? '';
$quantityMin = $_GET['quantityNumMin'] ?? '';
$quantityMax = $_GET['quantityNumMax'] ?? '';

$where = 'WHERE 1=1';
$params = [];

// 訂單號搜尋條件
if ($keyword !== '') {
    switch ($orderType) {
        case '1': $where .= " AND id LIKE :keyword"; break;
        case '2': $where .= " AND merchantOrderId LIKE :keyword"; break;
        case '3': $where .= " AND merchantName LIKE :keyword"; break;
        case '4': $where .= " AND userNo LIKE :keyword"; break;
        case '5': $where .= " AND account LIKE :keyword"; break;
    }
    $params[':keyword'] = "%$keyword%";
}

// 日期範圍
if ($dateStart !== '') {
    $where .= " AND createTime >= :startDate";
    $params[':startDate'] = $dateStart;
}
if ($dateEnd !== '') {
    $where .= " AND createTime <= :endDate";
    $params[':endDate'] = $dateEnd;
}

// 數量範圍
if (is_numeric($quantityMin)) {
    $where .= " AND amount >= :amountMin";
    $params[':amountMin'] = $quantityMin;
}
if (is_numeric($quantityMax)) {
    $where .= " AND amount <= :amountMax";
    $params[':amountMax'] = $quantityMax;
}

// 取得總筆數
$countSql = "SELECT COUNT(*) FROM partner_payout_orders $where";
$countStmt = $pdo->prepare($countSql);
$countStmt->execute($params);
$totalCount = $countStmt->fetchColumn();
$totalPage = ceil($totalCount / $limit);

// 取得資料
$dataSql = "SELECT * FROM partner_payout_orders $where ORDER BY createTime DESC LIMIT :offset, :limit";
$dataStmt = $pdo->prepare($dataSql);
foreach ($params as $key => $val) {
    $dataStmt->bindValue($key, $val);
}
$dataStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$dataStmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$dataStmt->execute();
$data = $dataStmt->fetchAll();

echo json_encode([
    "success" => true,
    "data" => $data,
    "page" => $page,
    "total_page" => $totalPage
]);
