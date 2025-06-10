<?php
header('Content-Type: application/json');
require_once '../../db.php';

$uid = $_GET['id'] ?? '';
if (!$uid) {
    echo json_encode(['code' => 1, 'message' => '缺少 UID']);
    exit;
}

$sql = "SELECT u.*, i.status AS identity_status, i.country, i.first_name, i.last_name, i.id_number,
               i.id_photo_front, i.id_photo_back, i.hidden_text, i.video_url
        FROM users u
        LEFT JOIN user_identity i ON u.uid = i.uid
        WHERE u.uid = ? LIMIT 1";
$stmt = $pdo->prepare($sql);
$stmt->execute([$uid]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['code' => 1, 'message' => '找不到用戶']);
    exit;
}

$wallet_sql = "SELECT uid , currency, address, available, frozen, guarantee
               FROM user_wallets WHERE uid = ?";
$wallet_stmt = $pdo->prepare($wallet_sql);
$wallet_stmt->execute([$uid]);
$wallets = $wallet_stmt->fetchAll(PDO::FETCH_ASSOC);

$user['wallets'] = $wallets;

echo json_encode(['code' => 0, 'data' => $user]);
