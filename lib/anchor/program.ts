import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import IDL from "./idl.json"
import { PikaVault } from "./idl";
import { PROGRAM_ID } from "./config";

export const createProgram = (connection: Connection, wallet: any) => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  const programId = new PublicKey(PROGRAM_ID);
  return new Program(IDL as PikaVault, provider);
}; 