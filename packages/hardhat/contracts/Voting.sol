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
        uint256 start_time;
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
        address _governance,  
        uint256 _proposalTime
    ) external {
        protocols[_governance] = Protocol(current_protocol++, 0, _proposalTime);
    }

    function makeProposal(
        address _governance,
        string memory _title,
        string memory _description
    ) external {
        Protocol storage protocol = protocols[_governance];
        proposals[protocols[_governance].id].push(
            Proposal(
                protocol.proposal_amount++,
                _title,
                _description,
                0,
                block.timestamp
            )
        );
    }
    
    function voteForProposal(
        address _protocol_address, 
        uint256 _proposal, 
        OPTION _vote
    ) external {
        Protocol storage protocol = protocols[_protocol_address];
        Proposal storage proposal = proposals[protocol.id][_proposal];
        if(block.timestamp <= proposal.start_time + protocol.proposal_time) {
            votes[_proposal].push(
                Vote(
                    msg.sender,
                    _vote
                )
            );
        }

        			
    }
}
