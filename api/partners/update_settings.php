<?php
require_once '../../db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$partner_id = isset($data['id']) ? intval($data['id']) : 0;
if ($partner_id <= 0) {
    echo json_encode(['code' => 1, 'message' => 'Missing or invalid partner ID']);
    exit;
}

// 欄位過濾
$fields = [
    'name', 'status', 'google_verified', 'fund_password_set',
    'payment_function', 'sell_function', 'tron_address', 'yu_address'
];

$updates = [];
$params = [];
foreach ($fields as $field) {
    if (isset($data[$field])) {
        $updates[] = "$field = :$field";
        $params[":$field"] = $data[$field];
    }
}
$params[':id'] = $partner_id;

if (empty($updates)) {
    echo json_encode(['code' => 1, 'message' => 'No data to update']);
    exit;
}

$sql = "UPDATE partners SET " . implode(", ", $updates) . " WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);

if ($stmt->rowCount() > 0) {
    echo json_encode(['code' => 0, 'message' => 'Update successful']);
} else {
    echo json_encode(['code' => 1, 'message' => 'No changes made']);
}
