<?php
header('Content-Type: application/json');
require_once '../../db.php';

$uid = $_POST['uid'] ?? '';
$blacklist = isset($_POST['blacklist']) ? intval($_POST['blacklist']) : 0;

if (!$uid) {
  echo json_encode(['code' => 1, 'message' => '缺少 UID']);
  exit;
}

$stmt = $pdo->prepare("UPDATE users SET blacklist = ? WHERE uid = ?");
$stmt->execute([$blacklist, $uid]);

if ($stmt->rowCount() > 0) {
  echo json_encode(['code' => 0, 'message' => '更新成功']);
} else {
  echo json_encode(['code' => 1, 'message' => 'UID 不存在或已是該狀態']);
}

