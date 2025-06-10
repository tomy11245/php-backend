<?php
header('Content-Type: application/json');
require_once '../../db.php';

$sql = "SELECT u.uid, u.account, i.id_number
        FROM users u
        LEFT JOIN user_identity i ON u.uid = i.uid
        WHERE u.blacklist = 1
        ORDER BY u.created_at DESC";

$stmt = $pdo->query($sql);
$list = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
  'code' => 0,
  'data' => $list
]);
