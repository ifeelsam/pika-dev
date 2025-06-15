import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { getProvider, getProgram } from "./config";

export const useAnchorProgram = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (!wallet.publicKey) return null;
    return getProvider(wallet);
  }, [wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    return getProgram(provider);
  }, [provider]);

  return {
    program,
    provider,
    wallet,
    connection,
  };
};

// Example of how to use the program:
/*
const { program, wallet } = useAnchorProgram();

// Example function to call a program instruction
const callProgramInstruction = async () => {
  if (!program || !wallet.publicKey) return;

  try {
    const tx = await program.methods
      .yourInstructionName()
      .accounts({
        // Add your account constraints here
      })
      .rpc();
    
    console.log("Transaction signature:", tx);
  } catch (error) {
    console.error("Error calling program:", error);
  }
};
*/ 