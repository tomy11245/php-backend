<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['user_id'] ?? '';
$type = $data['type'] ?? '';

require_once '../../db.php';


if(!$type){
    $stmt = $pdo->prepare("SELECT email FROM admins WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user || !$user['email']) {
        echo json_encode(['code' => 1, 'message' => '使用者不存在或未設定信箱']);
        exit;
    }
}

$otp = rand(100000, 999999);
$expire_time = time() + 300;

$stmt = $pdo->prepare("REPLACE INTO admin_otp (username, code, expire_time) VALUES (?, ?, ?)");
$stmt->execute([$username, $otp, $expire_time]);

//mail($user['email'], "【系統驗證】後台角色變更 OTP", "您的驗證碼為：$otp ，5 分鐘內有效。");
//echo json_encode(['code' => 0, 'message' => '驗證碼已寄出']);
echo json_encode(['code' => 0, 'message' => '驗證碼已產生', 'otp' => $otp]);

