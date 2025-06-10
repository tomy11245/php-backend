<?php
require_once __DIR__ . '../../../db.php';
header('Content-Type: application/json');

$orderType = $_GET['orderType'] ?? '';
$keyword = $_GET['keyword'] ?? '';
$encryptedNetwork = $_GET['encryptedNetwork'] ?? '';
$startDate = $_GET['startDate'] ?? '';
$endDate = $_GET['endDate'] ?? '';
$amountMin = $_GET['amountMin'] ?? '';
$amountMax = $_GET['amountMax'] ?? '';
$page = max(1, intval($_GET['page'] ?? 1));
$limit = max(1, intval($_GET['limit'] ?? 10));
$offset = ($page - 1) * $limit;

$where = 'WHERE 1=1';
$params = [];


if ($keyword !== '') {
    switch ($orderType) {
        case '1': $where .= " AND id LIKE :keyword"; break;
        case '2': $where .= " AND txId LIKE :keyword"; break;
        case '3': $where .= " AND partnerName LIKE :keyword"; break;
        case '4': $where .= " AND sender LIKE :keyword"; break;
    }
    $params[':keyword'] = "%$keyword%";
}

if ($encryptedNetwork !== '' && ($encryptedNetwork === '0' || $encryptedNetwork === '1')) {
    //$where .= " AND status = :status";
    //$params[':encryptedNetwork'] = $status;
}

if ($startDate !== '') {
    $where .= " AND createTime >= :startDate";
    $params[':startDate'] = $startDate;
}

if ($endDate !== '') {
    $where .= " AND createTime <= :endDate";
    $params[':endDate'] = $endDate;
}

if ($amountMin !== '') {
    $where .= " AND amount >= :amountMin";
    $params[':amountMin'] = $startDate;
}

if ($amountMax !== '') {
    $where .= " AND amount <= :amountMax";
    $params[':amountMax'] = $amountMax;
}

//$whereSql = $where ? "WHERE " . implode(" AND ", $where) : "";

try {
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM partner_withdraw_orders $where");
    $countStmt->execute($params);
    $totalCount = $countStmt->fetchColumn();
    $totalPage = ceil($totalCount / $limit);

    $stmt = $pdo->prepare("SELECT * FROM partner_withdraw_orders $where ORDER BY time DESC LIMIT :offset, :limit");
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
    echo json_encode(["error" => "查詢失敗"]);
}
?>
