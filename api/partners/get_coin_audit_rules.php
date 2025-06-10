<?php
require_once '../../db.php';
header('Content-Type: application/json');

$partner_id = $_GET['partner_id'] ?? null;

if (!$partner_id) {
  echo json_encode(['success' => false, 'message' => '缺少 partner_id']);
  exit;
}

try {
  $stmt = $pdo->prepare("SELECT coin, amount_limit, daily_limit FROM partner_coin_audit_rules WHERE partner_id = ?");
  $stmt->execute([$partner_id]);
  $rules = $stmt->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode([
    'success' => true,
    'data' => $rules
  ]);
} catch (Exception $e) {
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
