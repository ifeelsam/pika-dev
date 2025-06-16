"use client"

import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui"

const CUSTOM_LABELS = {
  'change-wallet': 'Change wallet',
  connecting: 'Connecting ...',
  'copy-address': 'Copy address',
  copied: 'Copied',
  disconnect: 'Disconnect',
  'has-wallet': 'Connect',
  'no-wallet': 'Connect',
} as const;

interface CustomWalletButtonProps {
  className?: string;
}

export function CustomWalletButton({ className }: CustomWalletButtonProps) {
  return (
    <div className={className || ''}>
      <BaseWalletMultiButton labels={CUSTOM_LABELS} />
    </div>
  );
} 