<?php
$mysqli = new mysqli("localhost","root","","test");
$sql = "INSERT INTO `lianxiren` (`name`,`phone`,`beizhu`) VALUES ('{$_GET['name']}','{$_GET['phone']}','{$_GET['beizhu']}')";
$mysqli->query($sql);
echo $mysqli->insert_id; 
?>