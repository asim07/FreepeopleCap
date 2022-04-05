// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "./Interfaces/Itreasury.sol";

contract Treasury is Itreasury {
        
        //enum to save the cuurent 
        enum Status {
            INPROGRESS,
            ACCEPTED,
            REJECTED
        }
        
        //struct holds the 
        struct Appeal {
            address ad;
            uint amount;
            uint8 positive_votes;
            uint8 negative_votes;
            bytes purpose;
            Status status;
        }
        //number of appeals
        uint number_of_Appeals=0;

        //mapping to save each address Appeal
        mapping(address => uint[]) private appeals;


    //event for applying Appeal
    event AppealforFund(Appeal _appeal);

    // function Appeal() public {}
    function appealforFund(uint _amount,string memory _purpose) external {
        
    }


        //function to convert string into bytes aaray
       function string_tobytes( string memory _purpose) public pure returns (bytes memory){
        bytes memory result = bytes(_purpose);
        return result;
         }

    // modifier to check the transaction        
    // Function to receive Awax. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}


        function getstatus(address applier) external view override{

        }

}