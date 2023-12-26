
import Image from 'next/image'
import { WalletMultiButton } from './components/WalletProvider'
import UseWalletComponent from '@/app/components/UseWalletComponent'
import GifsList from './components/GifsList';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');


export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="sticky left-0 top-0 flex z-10 max-w-5xl p-10 lg:mt-10 mt-0 w-full items-center justify-between font-mono text-sm lg:flex lg:flex-row gap-4 flex-col border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        <p className="flex w-full justify-center ">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="flex w-full justify-center">
          <WalletMultiButton />
        </div>

      </div>

      <div className='flex flex-col p-10'>
        <p className="flex text-center w-full justify-center my-10">🖼 GIF Portal</p>
        <GifsList />
      </div>

    </main>
  )
}
