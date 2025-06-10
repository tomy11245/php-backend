<?php
require_once '../../db.php'; // 確保 db.php 中建立的是 $pdo
header('Content-Type: application/json');

$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$perPage = isset($_GET['per_page']) ? intval($_GET['per_page']) : 10;
$offset = ($page - 1) * $perPage;
$search = isset($_GET['name']) ? trim($_GET['name']) : '';

// 計算總數
$totalStmt = $pdo->prepare("
    SELECT COUNT(*) FROM partners
    WHERE name LIKE :search
");
$totalStmt->execute([':search' => "%{$search}%"]);
$total = $totalStmt->fetchColumn();

// 查詢分頁資料
$stmt = $pdo->prepare("
    SELECT 
        p.id,
        p.name,
        p.status,
        IFNULL(w.available, 0) AS available,
        IFNULL(w.frozen, 0) AS frozen,
        IFNULL(w.guarantee, 0) AS guarantee
    FROM partners p
    LEFT JOIN partner_wallets w
        ON w.partner_id = p.id AND w.currency = 'YB'
    WHERE p.name LIKE :search
    ORDER BY p.id DESC
    LIMIT :offset, :perPage
");

$stmt->bindValue(':search', "%{$search}%", PDO::PARAM_STR);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->bindValue(':perPage', $perPage, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 回傳 JSON 結果
echo json_encode([
    'code' => 0,
    'data' => [
        'list' => $rows,
        'pagination' => [
            'total' => intval($total),
            'page' => $page,
            'per_page' => $perPage
        ]
    ]
]);
