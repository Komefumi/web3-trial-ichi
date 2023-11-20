import "dotenv/config";
import { Web3, HttpProvider } from "web3";

const web3 = new Web3(new HttpProvider(process.env.PROVIDER_HTTP as string));

const data = await web3.eth.getBlock("latest");
console.log({ data, config: web3.config });
