import "dotenv/config";
import { ethers, JsonRpcProvider, hexlify, formatEther } from "ethers";

const provider = new JsonRpcProvider(process.env.PROVIDER_HTTP as string);

const contractAddress = process.env.CONTRACT_ADDRESS as string;
const walletAddress = process.env.WALLET_ADDRESS as string;
const walletPrivateKey = process.env.WALLET_PRIVATE_KEY as string;

const wallet = new ethers.Wallet(walletPrivateKey, provider);

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

const transferPayload = hexlify(new Uint8Array());

(async () => {
  const contractBalance = await provider.getBalance(contractAddress);
  console.log("Contract Balance:", formatEther(contractBalance), "ETH");

  const gasEstimate = await provider.estimateGas({
    from: contractAddress,
    to: walletAddress,
    value: contractBalance,
    data: contractInstance.interface.encodeFunctionData("transferFunds", [
      walletAddress,
      transferPayload,
    ]),
  });

  console.log("Gas Estimate:", gasEstimate.toString());

  const transaction = await contractInstance.transferFunds(
    walletAddress,
    transferPayload,
    {
      gasLimit: gasEstimate * 50n, // Adding some margin
      value: contractBalance,
    }
  );

  await transaction.wait();
  console.log("Transaction mined");
})();
