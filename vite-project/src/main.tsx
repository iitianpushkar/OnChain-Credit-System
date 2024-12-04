import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConnectionProvider,WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
    <WalletProvider wallets={[]}>
      <WalletModalProvider>
    <App />
    </WalletModalProvider>
    </WalletProvider>
    </ConnectionProvider>
  </StrictMode>,
)
