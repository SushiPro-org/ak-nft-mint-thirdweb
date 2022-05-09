import Head from "next/head";
import React from "react";
import Header from "../Header";
import Mint from "./Mint";

export default function MintPage({ collection, setSelected }) {
  return (
    <>
      <Head>
        <title>Mint NFT</title>
        <meta name="description" content="Generated by NFT Mint Page" />
        <link rel="icon" href="https://i.ibb.co/hWCgPFW/logo.png" />
      </Head>
      <main className="mint_page_wrapper">
        <Header setSelected={setSelected} />
        <Mint collection={collection} />
      </main>
    </>
  );
}
