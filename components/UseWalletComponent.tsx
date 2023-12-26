'use client'
import { useWallet } from "@solana/wallet-adapter-react";

import React from 'react'

function UseWalletComponent() {
    const wallet = useWallet();
    console.log('Connected with Public Key:', wallet.publicKey?.toString());
    return (
        <div>
            {wallet.publicKey?.toString()}
        </div>
    )
}

export default UseWalletComponent