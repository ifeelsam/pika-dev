import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { IDL, PROGRAM_ID } from "./idl";

export const createProgram = (connection: Connection, wallet: any) => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  const programId = new PublicKey(PROGRAM_ID);
  return new Program(IDL as Idl, programId, provider);
}; 