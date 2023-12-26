'use client'
import React, { useEffect, useState } from 'react'
import { useWallet } from "@solana/wallet-adapter-react";
import Image from 'next/image';

function GifsList() {
    const wallet = useWallet();
    const [inputValue, setInputValue] = useState('');
    const [gifList, setGifList] = useState<string[]>([]);

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
        if (inputValue.length > 0) {
            console.log('Gif link:', inputValue);
            setGifList([...gifList, inputValue]);
            setInputValue('');
        } else {
            console.log('Empty input. Try again.');
        }
    };

    useEffect(() => {
        if (wallet) {
            console.log('Fetching GIF list...');
            // Call Solana program here.
            // Set state
            setGifList(TEST_GIFS);
        }
    }, [wallet]);

    return (
        <div className='flex flex-col'>
            {wallet.publicKey ?
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
                        {TEST_GIFS.map(gif => (
                            <div className="flex aspect-square h-auto max-w-full rounded-lg overflow-hidden" key={gif}>
                                <Image
                                    src={gif}
                                    alt={gif}
                                    width={0}
                                    height={0}
                                    className="w-full object-cover justify-center items-center"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                :
                <p>
                    Connect your wallet to look your beautiful gifs :)
                </p>
            }
        </div>
    )
}

export default GifsList