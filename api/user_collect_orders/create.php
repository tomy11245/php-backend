<?php
require_once '../../db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$order_no = $data['order_no'] ?? '';
$user_id = intval($data['user_id'] ?? 0);
$amount = floatval($data['amount'] ?? 0);
$note = $data['note'] ?? '';

if (!$order_no || !$user_id || $amount <= 0) {
    echo json_encode(["success" => false, "message" => "參數錯誤"]);
    exit;
}

$stmt = $pdo->prepare("INSERT INTO user_collect_orders (order_no, user_id, amount, status, note) VALUES (?, ?, ?, 0, ?)");
$result = $stmt->execute([$order_no, $user_id, $amount, $note]);

echo json_encode(["success" => $result]);
?>
