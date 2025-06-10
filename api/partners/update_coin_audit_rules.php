<?php
require_once '../../db.php';
header('Content-Type: application/json');

$partner_id = $_POST['partner_id'] ?? null;
$coin = $_POST['coin'] ?? null;
$amount_limit = $_POST['amount_limit'] ?? null;
$daily_limit = $_POST['daily_limit'] ?? null;

if (!$partner_id || !$coin || $amount_limit === null || $daily_limit === null) {
  echo json_encode(['success' => false, 'message' => '缺少參數']);
  exit;
}

try {
  $stmt = $pdo->prepare("SELECT id FROM partner_coin_audit_rules WHERE partner_id = ? AND coin = ?");
  $stmt->execute([$partner_id, $coin]);
  $exists = $stmt->fetchColumn();

  if ($exists) {
    $stmt = $pdo->prepare("UPDATE partner_coin_audit_rules SET amount_limit = ?, daily_limit = ? WHERE partner_id = ? AND coin = ?");
    $stmt->execute([$amount_limit, $daily_limit, $partner_id, $coin]);
  } else {
    $stmt = $pdo->prepare("INSERT INTO partner_coin_audit_rules (partner_id, coin, amount_limit, daily_limit) VALUES (?, ?, ?, ?)");
    $stmt->execute([$partner_id, $coin, $amount_limit, $daily_limit]);
  }

  echo json_encode(['success' => true]);
} catch (Exception $e) {
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
