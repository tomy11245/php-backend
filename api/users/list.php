<?php
header('Content-Type: application/json');
require_once '../../db.php';

$keyword = $_GET['keyword'] ?? '';
$min_amount = $_GET['min_amount'] ?? '';
$max_amount = $_GET['max_amount'] ?? '';
$role = $_GET['role'] ?? '';
$page = max(1, intval($_GET['page'] ?? 1));
$limit = 20;
$offset = ($page - 1) * $limit;

$where = [];
$params = [];

if ($keyword) {
    $where[] = "(u.uid LIKE ? OR u.account LIKE ?)";
    $params[] = "%$keyword%";
    $params[] = "%$keyword%";
}
if ($role && $role !== '-') {
    $where[] = "u.role = ?";
    $params[] = $role;
}
if (is_numeric($min_amount)) {
    $where[] = "(SELECT SUM(available) FROM user_wallets WHERE uid = u.uid AND currency = 'YU') >= ?";
    $params[] = $min_amount;
}
if (is_numeric($max_amount)) {
    $where[] = "(SELECT SUM(available) FROM user_wallets WHERE uid = u.uid AND currency = 'YU') <= ?";
    $params[] = $max_amount;
}

$where_clause = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$sql = "SELECT u.*, COALESCE(SUM(w.available),0) AS yu_balance
        FROM users u
        LEFT JOIN user_wallets w ON u.uid = w.uid AND w.currency = 'YU'
        $where_clause
        GROUP BY u.uid
        ORDER BY u.created_at DESC
        LIMIT $limit OFFSET $offset";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$list = $stmt->fetchAll(PDO::FETCH_ASSOC);

$total_sql = "SELECT COUNT(DISTINCT u.uid)
              FROM users u
              LEFT JOIN user_wallets w ON u.uid = w.uid AND w.currency = 'YU'
              $where_clause";
$count_stmt = $pdo->prepare($total_sql);
$count_stmt->execute($params);
$total = $count_stmt->fetchColumn();

echo json_encode([
  'code' => 0,
  'data' => [
    'list' => $list,
    'total' => intval($total),
    'page' => $page
  ]
]);
