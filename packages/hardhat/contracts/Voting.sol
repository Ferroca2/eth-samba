// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Voting {
    uint256 public currentProtocol;
    uint256 public currentProposal;
    mapping(address => Protocol) public protocols;
    mapping(uint256 => Proposal) public proposals; // (proposalId => Proposal)
    mapping(uint256 => Vote[]) public votes; // (proposalId => Vote[])
    mapping(uint256 => mapping(address => bool)) public voted; // (proposalId => userAddress => bool

    event ProtocolAdded(
        address indexed governance,
        address indexed owner,
        string descriptionIpfsHash,
        uint256 votingTime,
        uint256 commentTime,
        uint256 percentageOfAgreement
    );

    event ProposalMade(
        uint256 indexed proposalId,
        address indexed governance,
        string title,
        string proposalIpfsHash,
        uint256 startTime,
        uint256 amountOfVotes,
        SITUATION situation
    );

    event VotedForProposal(
        uint256 indexed proposalId,
        address indexed voter,
        OPTION vote
    );

    event VotesSettled(
        uint256 indexed proposalId,
        SITUATION situation
    );

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
        currentProposal = 0;
    }

    function addProtocol(
        address _governance,
        address _owner,
        string memory _descriptionIpfsHash,
        uint256 _votingTime,
        uint256 _commentTime,
        uint256 _percentageOfAgreement
    ) external alreadyExists(_governance){
        protocols[_governance] = Protocol(
            _owner,
            _descriptionIpfsHash,
            _votingTime,
            _commentTime,
            _percentageOfAgreement
        );

        emit ProtocolAdded(
            _governance,
            _owner,
            _descriptionIpfsHash,
            _votingTime,
            _commentTime,
            _percentageOfAgreement
        );
    }

    function makeProposal(
        address _governance,
        uint256 _id,
        string memory _title,
        string memory _description
    ) external {
        proposals[_id] = Proposal(
            _id,
            _governance,
            _title,
            _description,
            block.timestamp,
            0,
            SITUATION.VOTING
        );

        emit ProposalMade(
            _id,
            _governance,
            _title,
            _description,
            block.timestamp,
            0,
            SITUATION.VOTING
        );
        
        currentProposal++;
    }
    
    function voteForProposal(
        uint256 _proposalId,
        OPTION _vote
    ) external hasVoted(_proposalId) {
        Proposal storage proposal = proposals[_proposalId];
        Protocol storage protocol = protocols[proposal.protocolAddress];

        require(_vote == OPTION.AGREE || _vote == OPTION.ABSTAIN || _vote == OPTION.DISAGREE, "Invalid vote");
        require(proposal.startTime + protocol.votingTime >= block.timestamp, "Time ended");

        votes[_proposalId].push(
            Vote(
                msg.sender,
                _vote
            )
        );
        voted[_proposalId][msg.sender] = true;

        emit VotedForProposal(
            _proposalId,
            msg.sender,
            _vote
        );
    }

    function settleVotes(
        uint256 _proposalId
    ) external {
        require(
            proposals[_proposalId].situation == SITUATION.VOTING &&
            block.timestamp >= proposals[_proposalId].startTime + protocols[proposals[_proposalId].protocolAddress].votingTime,
            "Voting not ended"
        );
        Proposal storage proposal = proposals[_proposalId];
        Protocol storage protocol = protocols[proposal.protocolAddress];
        uint256 agree = 0;
        uint256 disagree = 0;

        for (uint256 i = 0; i < votes[_proposalId].length; i++) {
            Vote storage vote = votes[_proposalId][i];

            uint256 voterBalance = IERC20(proposal.protocolAddress).balanceOf(vote.voter);

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

        emit VotesSettled(
            _proposalId,
            proposal.situation
        );
    }

    modifier hasVoted(uint256 _proposalId) {
        require(!voted[_proposalId][msg.sender], "Already voted");
        _;
    }
    
    modifier alreadyExists(address _governance) {
        require(protocols[_governance].owner == address(0), "Already exists");
        _;
    }
}
