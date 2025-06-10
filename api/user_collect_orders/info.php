<?php
require_once "../../db.php";
header("Content-Type: application/json");

if (!isset($_GET['id'])) {
    echo json_encode(["success" => false, "message" => "缺少參數 id"]);
    exit;
}

$orderNo = $_GET['id'];
$stmt = $pdo->prepare("SELECT * FROM user_collect_orders WHERE order_no = ?");
$stmt->execute([$orderNo]);
$data = $stmt->fetch(PDO::FETCH_ASSOC);

if ($data) {
    echo json_encode(["success" => true, "data" => $data]);
} else {
    echo json_encode(["success" => false, "message" => "未找到資料"]);
}
?>
