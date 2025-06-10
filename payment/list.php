<?php
require_once '../db.php';
header('Content-Type: application/json');

$sql = "SELECT * FROM merchant_payment_orders ORDER BY created_at DESC";
$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>