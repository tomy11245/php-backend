<?php
session_start();
session_destroy();
echo json_encode(["success" => true, "message" => "已登出"]);
?>
