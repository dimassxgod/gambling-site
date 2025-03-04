<?php
require 'db.php';

$sql = file_get_contents("database/schema.sql");
$pdo->exec($sql);

echo "База данных и таблицы созданы!";
?>
