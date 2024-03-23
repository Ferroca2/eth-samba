// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Voting {
    uint256 private currentProtocol;
    uint256 private currentProposal;
    mapping(address => Protocol) public protocols;
    mapping(address => uint256[]) public proposalsIds; // (protocolAddress => proposalId[])
    mapping(uint256 => Proposal) public proposals; // (proposalId => Proposal)
    mapping(uint256 => Vote[]) public votes; // (proposalId => Vote[])
    mapping(uint256 => mapping(address => bool)) public voted; // (proposalId => userAddress => bool

    enum SITUATION{
        VOTING, 
        ACCEPTED,
        UNACCPETED
    }

    enum OPTION{
        AGREE,
        ABSTAIN,
        DISAGREE
    }
    
    struct Protocol {
        address owner;
        string descriptionIpfsHash;
        uint256 votingTime;
        uint256 commentTime;
        uint256 percentageOfAgreement;
    }

    struct Proposal {
        uint256 id; // used to find the voters
        address protocolAddress;
        string title;
        string proposal;
        uint256 startTime;
        uint256 amountOfVotes;
        SITUATION situation;
    }

    struct Vote {
        address voter;
        OPTION vote;
    }

    constructor() {
        currentProtocol = 0;
    }

    function addProtocol(
        address _governance,
        address _owner,
        string memory _descriptionIpfsHash,
        uint256 _proposalTime,
        uint256 _votingTime,
        uint256 _commentTime,
        uint256 _percentageOfAgreement
    ) external {
        protocols[_governance] = Protocol(
            currentProtocol++,
            _owner,
            _descriptionIpfsHash,
            _votingTime,
            _commentTime,
            _percentageOfAgreement
        );
    }

    function makeProposal(
        address _governance,
        string memory _title,
        string memory _description
    ) external {
        Protocol storage protocol = protocols[_governance];
        proposalsIds[protocol.id].push(++currentProposal);

        proposals[currentProposal] = Proposal(
            currentProposal,
            protocol.id,
            _title,
            _description,
            block.timestamp,
            0,
            SITUATION.VOTING
        );
    }
    
    function voteForProposal(
        uint256 _proposalId,
        OPTION _vote
    ) external hasVoted(_proposalId) {
        Proposal storage proposal = proposals[_proposalId];
        Protocol storage protocol = protocols[proposal.protocolAddress];

        require(_vote == OPTION.AGREE || _vote == OPTION.ABSTAIN || _vote == OPTION.DISAGREE, "Invalid vote");
        require(proposal.startTime + protocol.proposal_time >= block.timestamp, "Time ended");

        votes[_proposalId].push(
            Vote(
                msg.sender,
                _vote
            )
        );
        voted[_proposalId][msg.sender] = true;
    }

    function settleVotes(
        uint256 _proposalId
    ) external {
        Proposal storage proposal = proposals[_proposalId];
        Protocol storage protocol = protocols[proposal.protocolAddress];
        uint256 agree = 0;
        uint256 disagree = 0;
        uint256 abstein = 0;

        for (uint256 i = 0; i < votes[_proposal].length; i++) {
            Vote storage vote = votes[_proposal][i];

            uint256 voterBalance = ERC20(proposal.protocolAddress).balanceOf(vote.voter);

            if (vote.vote == OPTION.AGREE) {
                agree += voterBalance;
            } else if (vote.vote == OPTION.DISAGREE) {
                disagree += voterBalance;
            }
        }

        if(agree * 1e18 / (agree + disagree) >= protocol.percentageOfAgreement) {
            proposal.situation = SITUATION.ACCEPTED;
        } else {
            proposal.situation = SITUATION.UNACCPETED;
        }
    }

    modifier hasVoted(uint256 _proposalId) {
        require(voted[_proposalId][msg.sender], "You have already voted");
        _;
    }
}
