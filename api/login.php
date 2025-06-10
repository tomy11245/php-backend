<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();
header("Content-Type: application/json");
require_once "../db.php";


$data = json_decode(file_get_contents("php://input"), true);
$username = $data["username"];
$password = $data["password"];

$stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user["password"])) {
    $_SESSION["admin_id"] = $user["id"];
    $_SESSION["username"] = $user["username"];

    // 寫入登入日誌
    $ip = $_SERVER["REMOTE_ADDR"];
    $log = $pdo->prepare("INSERT INTO admin_logs (admin_id, action, ip_address) VALUES (?, 'login', ?)");
    $log->execute([$user["id"], $ip]);

    echo json_encode(["success" => true, "message" => "登入成功"]);
} else {
    echo json_encode(["success" => false, "message" => "帳號或密碼錯誤"]);
}
?>
