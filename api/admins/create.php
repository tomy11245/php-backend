<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);

$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$confirm = $data['confirm'] ?? '';
$role = $data['role'] ?? '';
$otp = $data['otp_code'] ?? '';

if (!$username || !$email || !$password || !$confirm || !$role || !$otp) {
    echo json_encode(['code' => 1, 'message' => '請填寫所有欄位']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['code' => 1, 'message' => 'Email 格式錯誤']);
    exit;
}

if ($password !== $confirm) {
    echo json_encode(['code' => 1, 'message' => '密碼與確認密碼不一致']);
    exit;
}

require_once '../../db.php';

// 驗證 OTP
$stmt = $pdo->prepare("SELECT * FROM admin_otp WHERE username = ? AND code = ? AND expire_time > ?");
$stmt->execute([$email, $otp, time()]);
if (!$stmt->fetch()) {
    echo json_encode(['code' => 1, 'message' => '驗證碼錯誤或已過期']);
    exit;
}

// 檢查帳號或信箱是否存在
$check = $pdo->prepare("SELECT 1 FROM admins WHERE username = ? OR email = ? LIMIT 1");
$check->execute([$username, $email]);
if ($check->fetch()) {
    echo json_encode(['code' => 1, 'message' => '帳號或信箱已存在']);
    exit;
}

$hashed = password_hash($password, PASSWORD_BCRYPT);
$pdo->prepare("INSERT INTO admins (username, email, password, role, canEdit, canDelete, created_at) VALUES (?, ?, ?, ?, 1, 1, NOW())")
    ->execute([$username, $email, $hashed, $role]);

$pdo->prepare("DELETE FROM admin_otp WHERE username = ?")->execute([$email]);

echo json_encode(['code' => 0, 'message' => '帳號已建立']);
