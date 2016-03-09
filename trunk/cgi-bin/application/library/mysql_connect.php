<?php
	class mysql_data
	{
		private $conn;

		public function __construct($url,$dbname,$user,$passwd){
			$dsn = "mysql:host=".$url.";dbname=".$dbname;
			$this->conn = new PDO($dsn,$user,$passwd);
		}
		function query($sql,$params)
		{ 
			$rs = $this->conn->prepare($sql);
			if ($rs->execute($params))
				return $rs->fetchAll();
			return null;
		}
		function execute($sql,$params)
		{ 
			$rs = $this->conn->prepare($sql);
			return $rs->execute($params);
		}
		function __destruct(){
			$this->conn = null;
		}
	}

?>
