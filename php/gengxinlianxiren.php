<?php
$mysqli = new mysqli("localhost","root","","test");
$sql = "UPDATE `lianxiren` SET `name`='{$_GET['name']}',`phone`='{$_GET['phone']}',`beizhu`='{$_GET['beizhu']}' WHERE `id` = {$_GET['id']}";
$mysqli->query($sql);
echo 'success'; 
?>