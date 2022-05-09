import React, { useEffect, useState } from "react";
import { useAddress, useNFTDrop } from "@thirdweb-dev/react";
import toast, { Toaster } from "react-hot-toast";
import CircleLoading from "../CircleLoading";
import ConnectButtons from "../ConnectButtons";

const MintPage = ({ collection }) => {
  const [claimedSupply, setClaimedSupply] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [mint_value, set_mint_value] = useState(1);
  const [mint_price, set_mint_price] = useState("");
  const [all_mint_price, set_all_mint_price] = useState("");
  const [loading, setLoading] = useState(false);
  const [minting, set_minting] = useState(false);
  const nftDrop = useNFTDrop(collection.address);
  const address = useAddress();
  const [showConnects, setSC] = useState(false);

  useEffect(() => {
    if (!address) return;
    setSC(false);
  }, [address]);

  useEffect(() => {
    set_all_mint_price(mint_price * mint_value);
  }, [mint_value, mint_price]);

  useEffect(() => {
    if (!nftDrop) return;
    const fetchClaimPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll();
      set_mint_price(claimConditions?.[0]?.currencyMetadata.displayValue);
    };

    fetchClaimPrice();
  }, [nftDrop]);

  useEffect(() => {
    if (!nftDrop) return;
    const fetchNFTDropData = async () => {
      setLoading(true);
      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.getAllUnclaimed();
      setClaimedSupply(claimed.length);
      setTotalSupply(total.length);
      setLoading(false);
    };
    fetchNFTDropData();
  }, [nftDrop, collection]);

  function increment() {
    if (mint_value < 10) {
      set_mint_value((prev) => prev + 1);
    }
  }

  function decrement() {
    if (mint_value !== 1) {
      set_mint_value((prev) => prev - 1);
    }
  }

  function mint() {
    set_minting(true);
    toast("Minting...", {
      style: {
        background: "#ffffff",
        boxShadow: "0px 0px 5px 0px #00000050",
        color: "#000000",
        padding: "15px",
        fontSize: "16px",
      },
    });
    nftDrop
      .claimTo(address, mint_value)
      .then((trx) => {
        // const receipt = trx[0].receipt;
        // const id = trx[0].id;
        // const data = trx[0].data();
        // console.log("receipt ", receipt);
        // console.log("id ", id);
        // console.log("data ", data);
        set_minting(false);
        toast("Hooray..., Successfuly claimed!", {
          style: {
            background: "green",
            color: "#ffffff",
            padding: "15px",
            fontSize: "16px",
          },
        });
        setClaimedSupply((p) => p + mint_value);
      })
      .catch((err) => {
        set_minting(false);
        toast(
          `Opps..., ${err?.message.substr(0, 32) || "something went wrong"}`,
          {
            style: {
              background: "red",
              color: "#ffffff",
              padding: "15px",
              fontSize: "16px",
            },
          }
        );
      });
  }

  return (
    <div className="mint_page">
      <Toaster position="bottom-center" />
      {showConnects && <ConnectButtons center={true} setSC={setSC} />}
      <div className="mint_content">
        <h1 className="heading_text">{collection?.pagetitle}</h1>
        <p className="heading_small">{collection?.pagedescription}</p>
        <div className="box">
          <div className="nft_image">
            <div
              style={{
                minWidth: "100%",
                height: "400px",
                display: "flex",
                alignItems: "stretch",
                background: `url(${collection?.previewImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <p className="claimed">
              {!loading &&
                claimedSupply + "/ " + (Number(totalSupply) + claimedSupply)}
            </p>
          </div>
          <div className="content">
            <h3>{collection?.title}</h3>
            <div className="buttons">
              <button onClick={decrement} className="minus_button">
                -
              </button>
              <p>{mint_value}</p>
              <button onClick={increment} className="plus_button">
                +
              </button>
            </div>
            <p className="max_mint_amount">Max Mint Amount: 10</p>
            <div className="bottom">
              <div className="total">
                <span>Total</span>
                {loading ? (
                  <small>Loading...</small>
                ) : (
                  <span>{all_mint_price} ETH + gas</span>
                )}
              </div>
              {address ? (
                <button
                  disabled={loading || minting}
                  onClick={mint}
                  className="mint_button"
                >
                  {minting ? <CircleLoading /> : "MINT"}
                </button>
              ) : (
                <button
                  onClick={() => setSC((p) => !p)}
                  className="connect_wallet_button"
                >
                  CONNECT WALLET
                </button>
              )}
            </div>
          </div>
        </div>
        <p className="contract_address">
          contract address : {collection.address}
        </p>
      </div>
    </div>
  );
};

export default MintPage;
