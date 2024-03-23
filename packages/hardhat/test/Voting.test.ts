import { expect } from "chai";
import { ethers } from "hardhat";
import { Voting, GovToken } from "../typechain-types"; // Assume MyGovernanceToken is your ERC20
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

async function advanceTime(time: number) {
  await ethers.provider.send("evm_increaseTime", [time]);
  await ethers.provider.send("evm_mine", []);
}

describe("Governance System", function () {
  let voting: Voting;
  let governanceToken: GovToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  before(async () => {
    // create a random wallet with pk and pk
    const randomWallet = ethers.Wallet.createRandom();
    console.log(randomWallet.address);
    console.log(randomWallet.privateKey);

    [owner, addr1] = await ethers.getSigners();

    // Deploy the ERC20 Governance Token
    const TokenFactory = await ethers.getContractFactory("GovToken");
    governanceToken = await TokenFactory.deploy();
    await governanceToken.waitForDeployment();
    governanceToken.waitForDeployment();

    // Mint tokens for testing
    await governanceToken.mint(owner.address, ethers.parseUnits("1000", 18));
    await governanceToken.mint(addr1.address, ethers.parseUnits("500", 18));

    // Deploy the Voting Contract
    const VotingFactory = await ethers.getContractFactory("Voting");
    voting = await VotingFactory.deploy();
    await voting.waitForDeployment();
  });

  describe("Protocol Creation", function () {
    it("Should allow a protocol to be added", async function () {
      await voting.addProtocol(
        await governanceToken.getAddress(),
        owner.address,
        "ipfs://example",
        60 * 60, // Voting Time
        60 * 60 * 24, // Comment Time
        50,
      );

      const protocol = await voting.protocols(governanceToken.getAddress());
      expect(protocol.owner).to.equal(owner.address);
    });
  });

  describe("Proposal Creation", function () {
    it("Should allow a proposal to be made", async function () {
      const tx = await voting.makeProposal(
        governanceToken.getAddress(),
        "Test Proposal",
        "Description of the test proposal"
      );
      await tx.wait();


      const proposal = await voting.proposals(0);
      expect(proposal.title).to.equal("Test Proposal");
    });
  });

  describe("Voting on a Proposal", function () {
    it("Should allow voting and correctly tally votes", async function () {
      // Assume OPTION enums are 0 = AGREE, 1 = ABSTAIN, 2 = DISAGREE
      await voting.voteForProposal(0, 0); // Owner votes AGREE

      // Transfer some tokens to another account for varied voting power
      await governanceToken.transfer(addr1.address, ethers.parseUnits("100", 18));

      // Switch to addr1 to vote
      await voting.connect(addr1).voteForProposal(0, 2); // addr1 votes DISAGREE

      await advanceTime(60 * 60); // Advance time to end voting period

      // Settle Votes (to be done by the owner for simplicity)
      await voting.settleVotes(0);

      const proposal = await voting.proposals(0);
      expect(proposal.situation).to.equal(1); // Assuming 0 = VOTING, 1 = ACCEPTED, 2 = UNACCPETED
    });

    it("Should not allow a user to vote twice on the same proposal", async function () {
      const proposalId = 0; // Assuming this proposal ID exists from previous tests
      const voteOptionAgree = 0; // Assuming 0 corresponds to the AGREE option

      await expect(voting.voteForProposal(proposalId, voteOptionAgree)).to.be.revertedWith("Already voted");
    });
  });

  describe("Protocol Duplication", function () {
    it("Should not allow the same protocol to be added twice", async function () {
        // First attempt to add the protocol, which is expected to succeed.
        //create random gov address, you might as well deploy a new contract

        const RandomGovTokenFactory = await ethers.getContractFactory("GovToken");
        const randomGovToken = await RandomGovTokenFactory.deploy();
        await randomGovToken.waitForDeployment();

        await voting.addProtocol(
            await randomGovToken.getAddress(),
            owner.address,
            "ipfs://example",
            60 * 60, // Voting Time
            60 * 60 * 24, // Comment Time
            50 // Percentage Of Agreement
        );

        // Second attempt to add the same protocol, which should fail.
        await expect(voting.addProtocol(
            await randomGovToken.getAddress(),
            owner.address,
            "ipfs://example",
            60 * 60, // Voting Time
            60 * 60 * 24, // Comment Time
            50 // Percentage Of Agreement
        )).to.be.revertedWith("Already exists"); // Adjust the error message based on your contract's logic
    });
  });

  describe("Governance Voting System", function () {
    let voting: Voting;
    let governanceToken: GovToken;
    let owner: SignerWithAddress;
    let voter1: SignerWithAddress;
    let voter2: SignerWithAddress;
    let proposalId: number;
    
    before(async () => {
      [owner, voter1, voter2] = await ethers.getSigners();
  
      // Deploy the Governance Token
      const TokenFactory = await ethers.getContractFactory("GovToken");
      governanceToken = await TokenFactory.deploy();
      await governanceToken.waitForDeployment();
  
      // Mint tokens to simulate different voters
      await governanceToken.mint(owner.address, ethers.parseUnits("1000", 18));
      await governanceToken.mint(voter1.address, ethers.parseUnits("100", 18));
      await governanceToken.mint(voter2.address, ethers.parseUnits("100", 18));
  
      // Deploy the Voting Contract
      const VotingFactory = await ethers.getContractFactory("Voting");
      voting = await VotingFactory.deploy();
      await voting.waitForDeployment();
  
      await voting.addProtocol(
        await governanceToken.getAddress(),
        owner.address,
        "ipfs://example",
        60 * 60, // Voting Time
        60 * 60 * 24, // Comment Time
        50,
      );
  
      // Create a Proposal
      const tx = await voting.makeProposal(
        governanceToken.getAddress(),
        "Test Proposal for Accept",
        "This is a test proposal to test accept scenario"
      );
      proposalId = parseInt(tx.data[0]); // Adjust based on how your contract assigns proposal IDs
    });
  
    describe("Accept Scenario", function () {
      it("Should pass the proposal when the majority agrees", async function () {
        // Have voters vote
        await voting.connect(voter1).voteForProposal(proposalId, 0); // Assuming 0 is AGREE
        await voting.connect(voter2).voteForProposal(proposalId, 0); // Assuming 0 is AGREE

        await advanceTime(60 * 60); // Advance time to end voting period

        await voting.settleVotes(proposalId);
        console.log()
  
        const proposal = await voting.proposals(proposalId);
        expect(proposal.situation).to.equal(1); // Assuming 1 corresponds to ACCEPTED
      });
    });
  
    describe("Reject Scenario", function () {
      it("Should fail the proposal when the majority disagrees", async function () {
        //create proposal

        const tx = await voting.makeProposal(
            governanceToken.getAddress(),
            "Test Proposal for Reject",
            "This is a test proposal to test reject scenario"
        );

        

        const proposalId = await voting.currentProposal() - BigInt(1);
  
        // Have voters vote
        await voting.connect(voter1).voteForProposal(proposalId, 2); // Assuming 2 is DISAGREE
        await voting.connect(voter2).voteForProposal(proposalId, 2); // Assuming 2 is DISAGREE
  
        await advanceTime(60 * 60); // Advance time to end voting period

        await voting.settleVotes(proposalId);
  
        const proposal = await voting.proposals(proposalId);
        expect(proposal.situation).to.equal(2); // Assuming 2 corresponds to REJECTED
      });
    });
  });
});
