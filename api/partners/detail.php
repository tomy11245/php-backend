<?php
require_once '../../db.php';
header('Content-Type: application/json');

$partner_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($partner_id <= 0) {
  echo json_encode(['code' => 1, 'message' => 'Missing partner ID']);
  exit;
}

// 查詢商戶資料
$stmt = $pdo->prepare("SELECT id, name, code AS no, status, google_verified, fund_password_set, tron_address, yu_address, payment_function, sell_function FROM partners WHERE id = ?");
$stmt->execute([$partner_id]);
$partner = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$partner) {
  echo json_encode(['code' => 1, 'message' => 'Partner not found']);
  exit;
}

// 上下級代理
$stmt = $pdo->prepare("SELECT affiliate_name AS name, affiliate_code AS no FROM partner_affiliates WHERE partner_id = ?");
$stmt->execute([$partner_id]);
$superior = $stmt->fetchAll(PDO::FETCH_ASSOC);

$stmt = $pdo->prepare("SELECT name, code AS no FROM partners WHERE id IN (SELECT partner_id FROM partner_affiliates WHERE affiliate_code = ?)");
$stmt->execute([$partner['no']]);
$subordinates = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 錢包
$stmt = $pdo->prepare("SELECT id, currency, available AS balance, frozen, guarantee AS deposit FROM partner_wallets WHERE partner_id = ?");
$stmt->execute([$partner_id]);
$wallets = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 發幣限制條件
$stmt = $pdo->prepare("SELECT currency, amount_limit_per_trans AS amountLimitPerTrans, amount_over AS amountOver, frequency_limit_per_day AS frequencyLimitPerDay, frequency_over AS frequencyOver FROM partner_settings WHERE partner_id = ?");
$stmt->execute([$partner_id]);
$issuance_limits = $stmt->fetchAll(PDO::FETCH_ASSOC);

// IP 白名單 / 黑名單
$stmt = $pdo->prepare("SELECT ip_address FROM partner_ip_whitelist WHERE partner_id = ? AND enabled = 1");
$stmt->execute([$partner_id]);
$ipWhiteList = $stmt->fetchAll(PDO::FETCH_COLUMN);

$stmt = $pdo->prepare("SELECT ip_address FROM partner_ip_blacklist WHERE partner_id = ? AND enabled = 1");
$stmt->execute([$partner_id]);
$ipBlackList = $stmt->fetchAll(PDO::FETCH_COLUMN);

// 發幣免審核地址
$stmt = $pdo->prepare("SELECT wallet_address FROM partner_bypass_list WHERE partner_id = ? AND enabled = 1");
$stmt->execute([$partner_id]);
$freeAddrs = $stmt->fetchAll(PDO::FETCH_COLUMN);

// 輸出
echo json_encode([
  'code' => 0,
  'data' => [
    'partnerData' => [
      'name' => $partner['name'],
      'no' => $partner['no'],
      'status' => intval($partner['status']),
      'securityVerification' => [
        'google' => boolval($partner['google_verified']),
        'fundPassword' => boolval($partner['fund_password_set'])
      ],
      'coinAddress' => [
        'tron' => $partner['tron_address'],
        'yu' => $partner['yu_address']
      ],
      'paymentFunction' => boolval($partner['payment_function']),
      'sellFunction' => boolval($partner['sell_function'])
    ],
    'partnerListData' => [
      'superiorAgent' => $superior,
      'subordinateAgent' => $subordinates
    ],
    'walletData' => $wallets,
    'coinIssuanceLimit' => $issuance_limits,
    'ipWhiteList' => $ipWhiteList,
    'ipWhiteListAvailable' => true,
    'ipBlackList' => $ipBlackList,
    'ipBlackListAvailable' => true,
    'coinIssuanceFreeAddress' => $freeAddrs,
    'coinIssuanceFreeAddressAvailable' => true
  ]
]);
