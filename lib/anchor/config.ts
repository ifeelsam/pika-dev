import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import IDL from "./idl.json"
import type { PikaVault } from "./idl.ts";


export const NETWORK = "devnet";
export const RPC_URL = clusterApiUrl(NETWORK);

export const PROGRAM_ID = new PublicKey("6aLg7Q1yji5fNMoGWFxS5nhcq3ZojGpf3rVyUQyM7Eg8");

export const MARKETPLACE_ADMIN = new PublicKey("3yUkodxjCmZ5DbfmydQDcYWY3CL5idMa4WcTZpT2jkUN");
// marketplace pda -> E8bJQ9QmQevEu6Lf1XcjYojZsHvt1HAr7pPPLzGZtKp2

export const DEFAULT_MARKETPLACE_FEE = 1000;

export const connection = new Connection(RPC_URL, "confirmed");

export const getProvider = (wallet: any) => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  return provider;
};

export const getProgram = (provider: AnchorProvider) => {
  return new Program(IDL as PikaVault, provider);
}; 