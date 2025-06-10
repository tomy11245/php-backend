<?php
require_once '../../db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$id = intval($data['id'] ?? 0);
$status = intval($data['status'] ?? -1);

if (!$id || $status < 0) {
    echo json_encode(["success" => false, "message" => "缺少參數"]);
    exit;
}

$stmt = $pdo->prepare("UPDATE user_collect_orders SET status = ?, updated_at = NOW() WHERE id = ?");
$result = $stmt->execute([$status, $id]);

echo json_encode(["success" => $result]);
?>
