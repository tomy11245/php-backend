<?php
require_once '../../db.php';

header("Content-Type: application/json");

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;

if ($id === 0) {
  echo json_encode(["success" => false, "message" => "無效的ID"]);
  exit;
}

$stmt = $pdo->prepare("DELETE FROM admins WHERE id = ?");
$success = $stmt->execute([$id]);

echo json_encode([
  "success" => $success,
  "message" => $success ? "用戶已刪除" : "刪除失敗"
]);
?>
