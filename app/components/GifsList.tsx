'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Image from 'next/image';
import {
    Program, AnchorProvider, web3, Idl
} from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { Buffer } from "buffer";
window.Buffer = Buffer;

import kp from '../../keypair.json'

type GifItem = {
    gifLink: string;
};

// @ts-ignore
function GifsList() {
    const wallet = useWallet();
    const { connection } = useConnection();

    const [inputValue, setInputValue] = useState('');
    const [gifList, setGifList] = useState<GifItem[] | null>(null);

    const TEST_GIFS = [
        'https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp',
        'https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g',
        'https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g',
        'https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp',
        'https://media1.giphy.com/media/dwyrEX7NthbwLcxcK7/giphy.gif?cid=ecf05e47ljs0xyvurno8m2owlk5qfi1xg47ohsvlcebcovpi&ep=v1_gifs_search&rid=giphy.gif&ct=g',
    ]

    const onInputChange = (event: { target: { value: any; }; }) => {
        const { value } = event.target;
        setInputValue(value);
    };

    const sendGif = async () => {
        if (inputValue.length === 0) {
            console.log("No gif link given!");
            return;
        }
        console.log('Gif link:', inputValue);
        try {
            const provider = getProvider();
            const program = await getProgram();
            if (!program) {
                throw new Error("Failed to get program");
            }
            await program.methods.addGif(inputValue)
                .accounts({
                    baseAccount: baseAccount.publicKey,
                    user: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            console.log("GIF successfully sent to program", inputValue);
            await getGifList();
        } catch (error) {
            console.log("Error sending GIF:", error);
        }
        setInputValue('');
    };




    const { SystemProgram, Keypair } = web3;

    const arr = Object.values(kp._keypair.secretKey)
    const secret = new Uint8Array(arr)
    const baseAccount = web3.Keypair.fromSecretKey(secret)

    const programID = new PublicKey('5hf2hUt5ufTg6Kki8VP1YpYUSMiYG527HjLk1fKjDAkY');

    const opts = {
        preflightCommitment: "processed"
    }


    const getProvider = () => {
        if (!wallet || !wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
            throw new Error("Wallet not connected or missing required properties");
        }

        const adaptedWallet = {
            publicKey: wallet.publicKey,
            signTransaction: wallet.signTransaction,
            signAllTransactions: wallet.signAllTransactions,
        };

        const provider = new AnchorProvider(
            connection,
            adaptedWallet,
            { preflightCommitment: "processed" }
        );


        return provider;
    };

    const getProgram = async () => {
        // Get metadata about your solana program
        const idl = await Program.fetchIdl(programID, getProvider());
        if (!idl) {
            return;
        }
        // Create a program that you can call
        return new Program(idl, programID, getProvider());
    };

    const getGifList = async () => {
        try {
            const program = await getProgram();
            if (!program) {
                throw new Error("Program is undefined");
            }

            const account = await program.account.baseAccount.fetch(baseAccount.publicKey);

            console.log("Got the account", account)
            setGifList(account.gifList)

        } catch (error) {
            console.log("Error in getGifList: ", error)
            setGifList(null);
        }
    }

    const createGifAccount = async () => {
        try {
            const provider = getProvider();
            const program = await getProgram();
            if (!program) {
                throw new Error("Program is undefined");
            }

            console.log("ping");

            // Chamada do método usando program.methods
            await program.methods.startStuffOff().accounts({
                baseAccount: baseAccount.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            }).signers([baseAccount]).rpc();

            console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString());
            await getGifList();

        } catch (error) {
            console.log("Error creating BaseAccount account:", error);
        }
    };

    const hasFetched = useRef(false);

    useEffect(() => {
        if (wallet && wallet.connected && !hasFetched.current) {
            console.log('Fetching GIF list...');
            // Call Solana program here.
            // Set state
            getGifList();

            hasFetched.current = true; // Marca que a função foi executada para esta instância da carteira
        } else if (wallet && !wallet.connected) {
            hasFetched.current = false; // Reseta a flag quando a carteira é desconectada
        }
    }, [wallet, wallet?.connected]);


    return (
        <div className='flex flex-col'>
            {wallet.publicKey ?
                (gifList === null ?
                    <div className="connected-container">
                        <button className="bg-[#512da8] hover:bg-[#1a1f2e] p-2 rounded-sm" onClick={createGifAccount}>
                            Do One-Time Initialization For GIF Program Account
                        </button>
                    </div>
                    :
                    <div className="flex flex-1 flex-col gap-4 w-full items-center">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                sendGif();
                            }}
                        >
                            <input className='text-black'
                                type="text"
                                placeholder="Enter gif link!"
                                value={inputValue}
                                onChange={onInputChange}
                            />
                            <button type="submit" className="bg-[#512da8] hover:bg-[#1a1f2e] border-t border-b border-r border-white/50 px-2 h-full">Submit</button>
                        </form>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 ">
                            {gifList.map((item, index) => (
                                <div className="flex aspect-square h-auto max-w-full rounded-lg overflow-hidden" key={index}>
                                    <Image
                                        src={item.gifLink}
                                        alt={`My GIF ${index}`}
                                        width={0}
                                        height={0}
                                        className="w-full object-cover justify-center items-center"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )
                :
                <p>
                    Connect your wallet to look your beautiful gifs :)
                </p>
            }
        </div>
    )
}

export default GifsList