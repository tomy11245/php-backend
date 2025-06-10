<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['user_id'] ?? '';
$otp = $data['otp_code'] ?? '';
$new_role = $data['new_role'] ?? '';

require_once '../../db.php';

$stmt = $pdo->prepare("SELECT * FROM admin_otp WHERE username = ? AND code = ? AND expire_time > ?");
$stmt->execute([$username, $otp, time()]);
$row = $stmt->fetch();

if (!$row) {
    echo json_encode(['code' => 1, 'message' => '驗證碼錯誤或已過期']);
    exit;
}

$stmt = $pdo->prepare("UPDATE admins SET role = ?, updated_at = NOW() WHERE username = ?");
$stmt->execute([$new_role, $username]);

$pdo->prepare("DELETE FROM admin_otp WHERE username = ?")->execute([$username]);

echo json_encode(['code' => 0, 'message' => '角色已更新']);
