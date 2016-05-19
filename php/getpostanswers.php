<?php
/**
 * @author:
 * @date: 2016-05-05 01:55:36
 * @version: v1.0.0
 */

$time = $_GET['time'];
$type = $_GET['type'];



$url = "http://api.kanzhihu.com/getpostanswers/".$time."/".$type;



$handle = fopen($url,"rb");
$content = "";
while (!feof($handle)) {
	$content .= fread($handle, 10000);
}
fclose($handle);


echo $content;


?>
