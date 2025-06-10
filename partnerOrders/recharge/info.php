<?php
require_once '../../db.php';
header('Content-Type: application/json');

$id = $_GET['id'] ?? '';
if (!$id) {
  echo json_encode(["error" => "缺少訂單 ID"]);
  exit;
}

try {
  $stmt = $pdo->prepare("SELECT * FROM partner_recharge_orders WHERE id = ?");
  $stmt->execute([$id]);
  $order = $stmt->fetch();
  if (!$order) {
    echo json_encode(["error" => "查無資料"]);
    exit;
  }
  echo json_encode($order);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(["error" => "查詢失敗"]);
}
?>
