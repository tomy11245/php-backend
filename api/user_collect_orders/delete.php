<?php
require_once '../../db.php';
header('Content-Type: application/json');

$id = intval($_GET['id'] ?? 0);

if (!$id) {
    echo json_encode(["success" => false, "message" => "缺少ID"]);
    exit;
}

$stmt = $pdo->prepare("DELETE FROM user_collect_orders WHERE id = ?");
$result = $stmt->execute([$id]);

echo json_encode(["success" => $result]);
?>
