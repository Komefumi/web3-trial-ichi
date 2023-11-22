import "dotenv/config";
import { ethers, parseUnits, parseEther } from "ethers";

const provider = new ethers.JsonRpcProvider(
  process.env.PROVIDER_HTTP as string
);

const contractAddress = process.env.CONTRACT_ADDRESS as string;
const walletAddress = process.env.WALLET_ADDRESS as string;
const walletPrivateKey = process.env.WALLET_PRIVATE_KEY as string;

const wallet = new ethers.Wallet(walletPrivateKey, provider);

// Below consists of test code - to test and ensure the network works
/*
const network = await provider.getNetwork();
console.log("Connected to network:", network);

// Retrieve the block number
const blockNumber = await provider.getBlockNumber();
console.log("Current block number:", blockNumber);

// Retrieve the Ethereum balance of a known address (replace with your address)
const balance = await provider.getBalance(walletAddress);
console.log("Balance:", formatEther(balance), "ETH");
*/

const contractInstance = new ethers.Contract(
  contractAddress,
  [
    {
      constant: false,
      inputs: [
        {
          name: "_address",
          type: "address",
        },
        {
          name: "_payload",
          type: "bytes",
        },
      ],
      name: "transferFunds",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  wallet
);

const coder = ethers.AbiCoder.defaultAbiCoder();
const transferPayload = coder.encode(["uint256"], [parseEther("1")]);
(async () => {
  const gasEstimate = await wallet.estimateGas({
    to: contractAddress,
    data: contractInstance.interface.encodeFunctionData("transferFunds", [
      walletAddress,
      transferPayload,
    ]),
  });

  const transaction = await contractInstance.transferFunds!(
    walletAddress,
    transferPayload,
    {
      gasLimit: gasEstimate, // Adding some margin
      gasPrice: parseUnits("50", "gwei"), // Replace with your desired gas price
    }
  );

  const receipt = await transaction.wait();
  console.log("Transaction mined:", receipt);
})();
