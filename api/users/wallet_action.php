<?php
header('Content-Type: application/json');
require_once '../../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$uid = $data['uid'] ?? '';
$currency = $data['currency'] ?? '';
$amount = floatval($data['amount'] ?? 0);
$action = $data['action'] ?? '';

if (!$uid || !$currency || !$amount || !in_array($action, ['increase', 'decrease'])) {
  echo json_encode(['code' => 1, 'message' => '參數錯誤']);
  exit;
}

// 先檢查該使用者該幣種錢包是否存在
$stmt = $pdo->prepare("SELECT * FROM user_wallets WHERE uid = ? AND currency = ? LIMIT 1");
$stmt->execute([$uid, $currency]);
$wallet = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$wallet) {
  echo json_encode(['code' => 1, 'message' => '找不到該幣種錢包']);
  exit;
}

// 更新可用餘額
if ($action === 'increase') {
  $sql = "UPDATE user_wallets SET available = available + ? WHERE uid = ? AND currency = ?";
} elseif ($action === 'decrease') {
  if ($wallet['available'] < $amount) {
    echo json_encode(['code' => 1, 'message' => '可用餘額不足']);
    exit;
  }
  $sql = "UPDATE user_wallets SET available = available - ? WHERE uid = ? AND currency = ?";
}

$pdo->prepare($sql)->execute([$amount, $uid, $currency]);

echo json_encode(['code' => 0, 'message' => '操作成功']);
