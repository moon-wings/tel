<?php
$mysqli = new mysqli("localhost","root","","test");
$query = "SELECT * FROM lianxiren ORDER by ID";
$result = $mysqli->query($query);
$row = $result->fetch_all(MYSQLI_ASSOC);
echo json_encode($row)
?>