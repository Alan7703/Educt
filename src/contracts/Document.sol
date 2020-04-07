pragma solidity 0.5.0;

// Smart Contract 

contract Document{
	string hashValue;

	//Write  
	function set(string memory _hashValue) public {
		hashValue = _hashValue; 
	}

	//Read
	function get() public view returns (string memory) {
		return hashValue;
	}
}