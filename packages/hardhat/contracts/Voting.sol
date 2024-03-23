// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Voting {
    uint256 private current_protocol;
    mapping(address => Protocol) public protocols;
    mapping(uint256 => Proposal[]) public proposals; //if doesnt work use mapping
    mapping(uint256 => Vote[]) public votes;

    enum OPTION{
        AGREE,
        ABSTAIN,
        DISAGREE
    }

    struct Protocol {
        uint256 id; // used to find proposals
        uint256 proposal_amount;
        uint256 proposal_time;
    }

    struct Proposal {
        uint256 id; // used to find the voters
        string title;
        string description;
        uint256 amount_of_votes;
    }

    struct Vote {
        address voter;
        OPTION vote;
    }

    constructor() {
        current_protocol = 0;
    }

    function addProtocol(
        address governance,  
        uint256 proposal_time
    ) external {
        protocols[governance] = Protocol(current_protocol, 0, proposal_time);
    }

    function makeProposal(
        address governance,
        string memory title,
        string memory description
    ) external {
        Protocol storage protocol = protocols[governance];
        proposals[protocols[governance].id].push(
            Proposal(
                protocol.proposal_amount++,
                title,
                description,
                0
            )
        );
    }
    
    function voteForProposal(OPTION vote) external {
        			
    }
}
