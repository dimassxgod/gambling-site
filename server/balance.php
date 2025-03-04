<?php
require 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    die("Вы не авторизованы.");
}

$stmt = $pdo->prepare("SELECT balance FROM users WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$balance = $stmt->fetchColumn();

echo "Ваш баланс: $balance кредитов";
?>
