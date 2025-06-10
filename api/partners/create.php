<?php
require_once '../../db.php';
header('Content-Type: application/json');

$name = $_POST['name'] ?? null;
$code = $_POST['code'] ?? null;
$account = $_POST['account'] ?? null;
$inviter = $_POST['inviter'] ?? null;
$min_recharge = $_POST['min_recharge'] ?? 0;
$payout_min = $_POST['payout_min'] ?? 0;
$payout_max = $_POST['payout_max'] ?? 0;
$min_withdraw = $_POST['min_withdraw'] ?? 0;

if (!$name || !$code || !$account) {
  echo json_encode(['success' => false, 'message' => '缺少必要欄位']);
  exit;
}

try {
  $stmt = $pdo->prepare("INSERT INTO partners (
    name, code, account, inviter,
    min_recharge, payout_min, payout_max, min_withdraw,
    created_at, status, google_verified, fund_password_set,
    payment_function, sell_function
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), '啟用', 0, 0, 1, 1)");

  $stmt->execute([
    $name, $code, $account, $inviter,
    $min_recharge, $payout_min, $payout_max, $min_withdraw
  ]);

  echo json_encode(['success' => true]);
} catch (Exception $e) {
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}