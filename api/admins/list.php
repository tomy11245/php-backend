<?php
require_once '../../db.php';

header("Content-Type: application/json");

$username = isset($_GET['username']) ? trim($_GET['username']) : '';
$sql = "SELECT id, username, role, created_at, email,created_at,canEdit,canDelete FROM admins";
$params = [];

if ($username !== '') {
    $sql .= " WHERE username LIKE ?";
    $params[] = "%$username%";
}

$sql .= " ORDER BY id DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "data" => $data]);
?>
