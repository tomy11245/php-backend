<?php
require_once '../../db.php';
header('Content-Type: application/json');

$wallet_id = $_POST['wallet_id'] ?? null;
$amount = $_POST['amount'] ?? null;
$action = $_POST['action_type'] ?? null;
$coin = $_POST['coin'] ?? null;

if (!$wallet_id || !$amount || !$action || !$coin) {
  echo json_encode(['success' => false, 'message' => '缺少參數']);
  exit;
}

$amount = floatval($amount);
if ($amount <= 0) {
  echo json_encode(['success' => false, 'message' => '金額需大於 0']);
  exit;
}

$stmt = $pdo->prepare("SELECT * FROM partner_wallets WHERE id = ?");
$stmt->execute([$wallet_id]);
$wallet = $stmt->fetch();

if (!$wallet) {
  echo json_encode(['success' => false, 'message' => '錢包不存在']);
  exit;
}

try {
  $pdo->beginTransaction();

  switch ($action) {
    case 'increase_balance':
      $sql = "UPDATE partner_wallets SET available = available + ? WHERE id = ?";
      break;
    case 'decrease_balance':
      if ($wallet['available'] < $amount) throw new Exception('可用餘額不足');
      $sql = "UPDATE partner_wallets SET available = available - ? WHERE id = ?";
      break;
    case 'increase_frozen':
      $sql = "UPDATE partner_wallets SET frozen = frozen + ? WHERE id = ?";
      break;
    case 'decrease_frozen':
      if ($wallet['frozen'] < $amount) throw new Exception('凍結金額不足');
      $sql = "UPDATE partner_wallets SET frozen = frozen - ? WHERE id = ?";
      break;
    case 'increase_deposit':
      $sql = "UPDATE partner_wallets SET guarantee = guarantee + ? WHERE id = ?";
      break;
    case 'decrease_deposit':
      if ($wallet['guarantee'] < $amount) throw new Exception('保證金不足');
      $sql = "UPDATE partner_wallets SET guarantee = guarantee - ? WHERE id = ?";
      break;
    default:
      throw new Exception('未知操作類型');
  }

  $stmt = $pdo->prepare($sql);
  $stmt->execute([$amount, $wallet_id]);

  $pdo->commit();
  echo json_encode(['success' => true]);
} catch (Exception $e) {
  $pdo->rollBack();
  echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
