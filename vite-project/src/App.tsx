import { useState,useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Wallet, ArrowRightLeft, PieChart, Settings } from 'lucide-react'
import { PublicKey, SystemProgram,LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWallet,useConnection,useAnchorWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import "@solana/wallet-adapter-react-ui/styles.css"
import { AnchorProvider, Program, web3 } from '@project-serum/anchor'
import idl from './idl.json' 

export default function App() {
  const {publicKey}=useWallet()
  const {connection}= useConnection()
  const anchorwallet=useAnchorWallet()
  const programId = new PublicKey("Hne55wytgfHCuSx2DVv4EFMwGwT7gnwX31Y4zWb11qB9")
  const [Pda,setPda]=useState('')
  const liquidity_pool= new PublicKey("D5Ag4tPuh21aSUVr6BJRDWJyfDxV4RLjEmZHnysYCCf3")
  const owner=new PublicKey("89v7pPTSVsVScNnLjGPNsKPewz5kANRPgaLnHCds4Dph")

  const [balance,setbalance]=useState(0)


  useEffect(()=>{
    if(anchorwallet){
      try 
      {
          const [pda,bump]=PublicKey.findProgramAddressSync(
            [Buffer.from("ackee"),anchorwallet?.publicKey.toBuffer()],programId
          )
        async function pdaexists(){
          const accountinfo = await connection.getAccountInfo(pda)
          if(accountinfo){
              console.log("pda exists")
              setPda(pda.toString())

            const getbalance=await connection.getBalance(pda)
               setbalance(getbalance/LAMPORTS_PER_SOL)
          }else{
                 console.log("pda does not exist")
          }
      }
      pdaexists()
    }
     catch (error) {
      console.error("Connection failed", error)
    }
    }
    else{
      setPda('')
      setbalance(0)
    }
  },[anchorwallet && publicKey])


const cardGeneration=async()=>{
  //console.log(publicKey?.toString())
  if(anchorwallet && !Pda){
  try {
    const provider = new AnchorProvider(connection,anchorwallet, { preflightCommitment: 'processed' })
    const program = new Program(idl, programId, provider)

    console.log("program:",program)

    const [pda,bump]=PublicKey.findProgramAddressSync(
      [Buffer.from("ackee"),anchorwallet?.publicKey.toBuffer()],programId
    )
    console.log("pda:",pda.toString())
    console.log("bump",bump)
    
   const tx = await program.methods
   .initializeTransfer()
   .accounts({
    pdaAccount1:liquidity_pool,
    pdaAccount2:pda,
    sender:owner,
    receiver:anchorwallet.publicKey,
    SystemProgram:web3.SystemProgram.programId
   })
   .rpc() ;

   console.log("transaction signature:",tx)

    setPda(pda.toString())
  } catch (error) {
    console.log("error:",error)
  }
}
}

  return (
      <div className="min-h-screen bg-black text-white p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-400">Web3 Credit System</h1>

          <WalletMultiButton />
        </header>


      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-green-800">
            <PieChart className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="cards" className="data-[state=active]:bg-green-800">
            <CreditCard className="mr-2 h-4 w-4" />
            Cards
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-green-800">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-green-800">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gray-900 border-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <Wallet className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{balance} SOL</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credit Limit</CardTitle>
                <CreditCard className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">2 SOL</div>
                <p className="text-xs text-gray-400">50% utilized</p>
              </CardContent>
            </Card>
            {/* Add more dashboard cards here */}
          </div>
        </TabsContent>

        <TabsContent value="cards">
          <Card className="bg-gray-900 border-green-500">
            <CardHeader>
              <CardTitle>Your Card</CardTitle>
              <CardDescription>Manage your Web3 credit card</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Add card management UI here */}
              <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                <CreditCard className="h-8 w-8 text-green-400" />
                <div>
                  <p className="font-medium">Web3 Rewards Card</p>
                  <p className="text-sm text-gray-400">{Pda}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-green-500 hover:bg-green-400 text-white" onClick={cardGeneration}>Add New Card</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="bg-gray-900 border-green-500">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest credit card activity</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add transaction list here */}
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <div>
                      <p className="font-medium">Transaction {i}</p>
                      <p className="text-sm text-gray-400">Merchant Name</p>
                    </div>
                    <div className="text-green-400">$XX.XX</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-gray-900 border-green-500">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your Web3 credit account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="John Doe" className="bg-gray-800 border-green-500 text-white" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="johndoe@example.com" className="bg-gray-800 border-green-500 text-white" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-green-500 hover:bg-green-400 text-white">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}