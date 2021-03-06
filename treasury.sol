// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import "./Interfaces/Itreasury.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
contract Treasury is Itreasury {

using Counters for Counters.Counter;

Counters.Counter private number_of_Appeals;
Counters.Counter private Denied_Appeals;
Counters.Counter private Approved_Appeals;

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
            uint8 totalVotes;
            bytes purpose;
            Status status;
            mapping(address => bool) isCasted;
        }
        //number of appeals
        // uint number_of_Appeals=0;

        //mapping to save each address Appeal
        mapping(address => uint[]) private user_Appeals;

        //mappin to save All Appeals
        mapping(uint => Appeal) private appeals;

        //addresses of signers
        mapping(address => bool) private signers;

        //allocated funds
        mapping(address => uint) private allocatedAmount;

        //history of funds used by adress
        mapping(address => uint[]) private fundHistory;

    //event for applying Appeal
    // event AppealforFund(Appeal _appeal);
    constructor(){
        signers[msg.sender] = true;
        signers[0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2] = true;
        signers[0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db] = true;
        signers[0x617F2E2fD72FD9D5503197092aC168c91465E7f2] = true;
        signers[0x17F6AD8Ef982297579C203069C1DbfFE4348c372] = true;
        signers[0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678] = true;
        signers[0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C] = true;
        console.log("hello");

    }
    // function Appeal() public {}
    function appealforFund(uint _amount,string memory _purpose) external onlySigners{

        bytes memory data = string_tobytes(_purpose);
        number_of_Appeals.increment();
        Appeal storage a = appeals[number_of_Appeals.current()];
        a.ad = msg.sender;
        a.amount = _amount;
        a.positive_votes = 0;
        a.negative_votes = 0;
        a.totalVotes = 0;
        a.purpose = data;
        a.status = Status.INPROGRESS;
        user_Appeals[msg.sender].push(number_of_Appeals.current());
        // appeals[number_of_Appeals] =  Appeal(msg.sender,_amount,0,0,0,data,Status.INPROGRESS);
        // emit AppealforFund( appeals[number_of_Appeals]);
    }
    
    //fetch appeals according to numbers
    function fetchAppeal(uint i ) public view returns( address ad,
            uint amount,
            uint8 positive_votes,
            uint8 negative_votes,
            uint8 totalVotes,
            bytes memory purpose,
            Status status){
        return (appeals[i].ad,appeals[i].amount,appeals[i].positive_votes,appeals[i].negative_votes,appeals[i].totalVotes,appeals[i].purpose,appeals[i].status);
    }


    //function to convert string into bytes array
    function string_tobytes( string memory _purpose) public pure returns (bytes memory){
        bytes memory result = bytes(_purpose);
        return result;
    }


    //cast votes
    function AllocationVote(uint i) external onlySigners {
        require(appeals[i].status == Status.INPROGRESS,"Appeal is Already Rejected");
        require(appeals[i].isCasted[msg.sender] == false,"Vote is Already Casted");
        appeals[i].positive_votes++;
        appeals[i].totalVotes++;
        appeals[i].isCasted[msg.sender] = true;
        finalize(i);
    }


    //cast votes
    function denyVote(uint i) external onlySigners {
        require(appeals[i].status == Status.INPROGRESS,"Appeal is Already Rejected");
        require(appeals[i].isCasted[msg.sender] == false,"Vote is Already Casted");
        appeals[i].negative_votes++;
        appeals[i].totalVotes++;
        appeals[i].isCasted[msg.sender] = true;
        finalize(i);

    }

    //finalize the auction
    function finalize(uint i) internal onlySigners {
        if(appeals[i].positive_votes >=5){
            appeals[i].status = Status.ACCEPTED;
            Denied_Appeals.increment();
        }
        if(appeals[i].negative_votes >=3){
            appeals[i].status = Status.REJECTED;
            Approved_Appeals.increment(); 
        }
    }

    //fetch user appeals
    function UserAppeals(address _ad) public view returns(uint[] memory){
        return user_Appeals[_ad];
    }

    //active Appeals
    function ActiveAppeals() public view returns(uint[] memory){
        uint[] memory active = new uint[](number_of_Appeals.current() - Denied_Appeals.current() - Approved_Appeals.current());
        uint counter = 0;
        for(uint i=1;i<=number_of_Appeals.current();i++){
            if(appeals[i].status == Status.INPROGRESS){
                active[counter] = i;
                counter++;
            }
        }
        return active;
    }

     //rejected Appeals
    function rejectedAppeals() public view returns(uint[] memory){
        uint[] memory active = new uint[](number_of_Appeals.current() - Denied_Appeals.current() - Approved_Appeals.current());
        uint counter = 0;
        for(uint i=1;i<=number_of_Appeals.current();i++){
            if(appeals[i].status == Status.REJECTED){
                active[counter] = i;
                counter++;
            }
        }
        return active;
    }

       //rejected Appeals
    function ApprovedAppeals() public view returns(uint[] memory){
        uint[] memory active = new uint[](number_of_Appeals.current() - Denied_Appeals.current() - Approved_Appeals.current());
        uint counter = 0;
        for(uint i=1;i<=number_of_Appeals.current();i++){
            if(appeals[i].status == Status.ACCEPTED){
                active[counter] = i;
                counter++;
            }
        }
        return active;
    }

    //check address allocations
    function allocatedFund(address _ad) public view returns(uint){
        return allocatedAmount[_ad];
    }

    //check consumed funds
    function ConsumedFunds(address _ad) external view returns(uint[] memory){
        return fundHistory[_ad];
    }

    // modifier to check the transaction
    modifier onlySigners{
        require(signers[msg.sender],"caller is not signer");
        _;
    }

    // Function to receive Awax. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}