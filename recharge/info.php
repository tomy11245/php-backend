<?php
require_once '../db.php';
header('Content-Type: application/json');

$order_no = $_GET['order_no'] ?? '';
if (!$order_no) {
    echo json_encode(['error' => '缺少 order_no']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM merchant_recharge_orders WHERE order_no = ?");
$stmt->bind_param("s", $order_no);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(['error' => '找不到訂單']);
}
?>