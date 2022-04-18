// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "./Interfaces/Itreasury.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TreasuryV2 {
    using Counters for Counters.Counter;

    address private admin;
    Counters.Counter private number_of_Appeals;
    Counters.Counter private Denied_Appeals;
    Counters.Counter private Approved_Appeals;

    enum Status {
        INPROGRESS,
        ACCEPTED,
        REJECTED
    }

    //struct holds the
    struct Appeal {
        uint256 amount;
        uint8 positive_votes;
        uint8 negative_votes;
        uint8 totalVotes;
        bytes purpose;
        Status status;
        mapping(address => bool) isCasted;
    }
    //addresses of signers
    mapping(address => bool) private signers;

    //Dai
    IERC20 public Dai;

    //mappin to save All Appeals
    mapping(uint256 => Appeal) private appeals;

    constructor(address[] memory _ad,address _dai) {
        admin = msg.sender;
        for (uint8 i = 0; i < _ad.length; i++) {
            signers[_ad[i]] = true;
        }
        Dai = IERC20(_dai);
    }

      // function Appeal() public {}
    function appealforFund(uint _amount,bytes memory _purpose) external  onlyAdmin returns(bool){
        number_of_Appeals.increment();
        Appeal storage a = appeals[number_of_Appeals.current()];
        a.amount = _amount;
        a.positive_votes = 0;
        a.negative_votes = 0;
        a.totalVotes = 0;
        a.purpose = _purpose;
        a.status = Status.INPROGRESS;
        return true;
    }

   //available funds
    function availableFunds() public view returns(uint){
        return Dai.balanceOf(address(this));
    }

    // modifier to check the admin address
    modifier onlyAdmin{
        require(admin == msg.sender,"caller is not admin");
        _;
    }
      // modifier to check the transaction
    modifier onlySigners{
        require(signers[msg.sender] ,"caller is not signer");
        _;
    }


}
