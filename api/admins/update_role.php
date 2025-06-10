<?php
require_once '../../db.php';

header("Content-Type: application/json");

$username = $_POST['username'];
$role = $_POST['role'];

$stmt = $pdo->prepare("UPDATE admins SET role = ? WHERE username = ?");
$success = $stmt->execute([$role, $username]);

echo json_encode([
  "success" => $success,
  "message" => $success ? "角色已更新" : "更新失敗"
]);
?>
