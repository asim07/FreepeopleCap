// // SPDX-License-Identifier: MIT
// pragma solidity >=0.8.0;
// import "./Interfaces/Itreasury.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "hardhat/console.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// contract TreasuryV2 {
//     using Counters for Counters.Counter;

//     address private admin;
//     Counters.Counter private number_of_Appeals;
//     Counters.Counter private Denied_Appeals;
//     Counters.Counter private Approved_Appeals;

//     enum Status {
//         INPROGRESS,
//         ACCEPTED,
//         REJECTED
//     }

//     //struct holds the
//     struct Appeal {
//         uint256 amount;
//         uint8 positive_votes;
//         uint8 negative_votes;
//         uint8 totalVotes;
//         bytes purpose;
//         Status status;
//         mapping(address => bool) isCasted;
//     }

//        //restriction of funds to consume
//         struct fundAllocation {
//             uint amount;
//             uint timestamp;
//         }


//     //addresses of signers
//     mapping(address => bool) private signers;

//     //Dai
//     IERC20 public Dai;

//     //mapping to save All Appeals
//     mapping(uint256 => Appeal) private appeals;

//     //mapping to check active Appeals
//     mapping(address => uint) private inProgress;

//     //check allocated funds
//     mapping(uint => fundAllocation) private allocatedAmount;

//     //history of funds used by adress
//     mapping(address => uint[]) private fundHistory;

//     //setting the addresses of the signers and 
//     constructor(address[] memory _ad,address _dai) {
//         admin = msg.sender;
//         for (uint8 i = 0; i < _ad.length; i++) {
//             signers[_ad[i]] = true;
//         }
//         Dai = IERC20(_dai);
//     }

//       // function Appeal() public {}
//     function appealforFund(uint _amount,bytes memory _purpose) external  onlyAdmin returns(bool){
//         require(inProgress[msg.sender]==0,"Appeal In progress");
//         number_of_Appeals.increment();
//         Appeal storage a = appeals[number_of_Appeals.current()];
//         a.amount = _amount;
//         a.positive_votes = 0;
//         a.negative_votes = 0;
//         a.totalVotes = 0;
//         a.purpose = _purpose;
//         a.status = Status.INPROGRESS;
//         inProgress[msg.sender] = number_of_Appeals.current();
//         return true;
//     }


//     //cast vote to accept
//     function AllocationVote(uint i) external onlySigners {
//         require(appeals[i].status == Status.INPROGRESS,"Appeal finished");
//         require(appeals[i].isCasted[msg.sender] == false,"Vote is Already Casted");
//         require(admin!= msg.sender,"cant vote yourself");
//         appeals[i].positive_votes++;
//         appeals[i].isCasted[msg.sender] = true;
//         finalize(i);
//     }


//     //cast vote to deny
//     function denyVote(uint i) external onlySigners {
//         require(appeals[i].status == Status.INPROGRESS,"Appeal finished");
//         require(appeals[i].isCasted[msg.sender] == false,"Vote is Already Casted");
//         require(admin != msg.sender,"cant vote yourself");

//         appeals[i].negative_votes++;
//         appeals[i].isCasted[msg.sender] = true;
//         finalize(i);

//     }

//     //finalize the auction
//     function finalize(uint i) internal onlySigners {
//         if(appeals[i].positive_votes >4){
//             appeals[i].status = Status.ACCEPTED;
//             Approved_Appeals.increment();
//             allocatedAmount[i].amount =  allocatedAmount[i].amount + appeals[i].amount;
//             allocatedAmount[i].timestamp = block.timestamp + 10 minutes;
//             delete inProgress[admin];
//         } else
//         if(appeals[i].negative_votes >2){
//             appeals[i].status = Status.REJECTED;
//             Denied_Appeals.increment();
//             delete inProgress[admin];
//         }
//     }

//     //show Appeals
//        function fetchAppeal(uint i) public view returns(
//             uint amount,
//             uint8 positive_votes,
//             uint8 negative_votes,
//             bytes memory purpose,
//             Status status){
//                 require(i>0,"invalid Appeal");
//         return (appeals[i].amount,appeals[i].positive_votes,appeals[i].negative_votes,appeals[i].purpose,appeals[i].status);
//     }

//     //withdraw funds
//     function withdrawFunds(uint i ,uint _amount) public onlyAdmin returns(bool){
//         require(allocatedAmount[i].amount > 0,"no funds");
//         require(block.timestamp > allocatedAmount[i].timestamp,"fund Locked");
//         require(_amount <= allocatedAmount[i].amount,"no funds");
        
//         // uint timestamp = allocatedAmount[msg.sender].timestamp;
//         // require(block.timestamp >= timestamp,"funds locked");
//         // uint availableFunds = allocatedAmount[msg.sender].amount;
//         // require(availableFunds > 0 && _amount <= availableFunds,"No funds..");
//         // require(TreasuryAvailableFudns() >= _amount,"Funds not available");
//         // allocatedAmount[msg.sender].amount =  allocatedAmount[msg.sender].amount - _amount;
//         // fundHistory[msg.sender].push(_amount);
//         // Dai.transfer(_ad,_amount);
//         return true;
//     }

//       //check allocated fund against each appeal
//     function allocatedFund(uint i) public view returns(uint){
//         return allocatedAmount[i].amount;
//     }

//      //remaining time to consume funds from specific appeal
//     function remainingTime(uint i) public view returns(uint){
//         return allocatedAmount[i].timestamp;
//     }

//         //check consumed funds
//     function ConsumedFunds(address _ad) external view returns(uint[] memory){
//         return fundHistory[_ad];
//     }

//     //fetch active appeal
//     function activeAppeal() public view returns(uint){
//         return inProgress[admin];
//     }

//    //available funds
//     function availableFunds() public view returns(uint){
//         return Dai.balanceOf(address(this));
//     }

//     // modifier to check the admin address
//     modifier onlyAdmin{
//         require(admin == msg.sender,"caller is not admin");
//         _;
//     }
//       // modifier to check the transaction
//     modifier onlySigners{
//         require(signers[msg.sender] ,"caller is not signer");
//         _;
//     }
//       // Function to receive Awax. msg.data must be empty
//     receive() external payable {
//         revert("cant recieve awax");
//     }

//     // Fallback function is called when msg.data is not empty
//     fallback() external payable {
//         revert("cant recieve awax");
//     }

// }
// //["0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db","0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB","0x617F2E2fD72FD9D5503197092aC168c91465E7f2","0x17F6AD8Ef982297579C203069C1DbfFE4348c372","0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678"]