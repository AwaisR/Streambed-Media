import React, { useState, useEffect } from "react";
import "./wallet.css";
import { walletsAction } from "../../../store/wallet/action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import Stripe from "react-stripe-checkout";
import axios from "axios";
import Profile from "Containers/Profile";
export default function Addwallat({ showWallet, hideAddWallet }) {
  var url = process.env.REACT_APP_URL;
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const state = useSelector((state) => state.Wallet);
  const { AllTransactions, Balance } = state;
  const [transaction, setTransaction] = useState([]);
  const [walletBalance, setWalletBalance] = useState("100000");
  const [fundWallet, setFundwallet] = useState("");
  const [currentBalance, setCurentBalnce] = useState(0);
  var priceInCent = fundWallet * 100;
  const handleChange = (e) => {
    setFundwallet(e.target.value);
  };
  const onToken = (token) => {
    axios({
      url: `${url}/posts/stripe-payment`,
      method: "post",
      data: {
        amount: priceInCent,
        token,
      },
    })
      .then((res) => {
        setFundwallet("");
        let data = {
          remaining: currentBalance,
          amount: fundWallet,
          type: "wallets",
          token: localStorage.getItem("token"),
        };
        dispatch(walletsAction.addDepositAmount(data));
      })
      .catch((err) => console.log("Payment Failed.", JSON.parse(err)));
  };
  useEffect(() => {
    dispatch(walletsAction.getTransaction(token));
  }, []);
  useEffect(() => {
    let balance = 0;
    let amount = 0;
    let total = 0;
    if (AllTransactions)
      AllTransactions.map((item) => {
        amount = +amount + item.amount ? item.amount : "";
        total = +item.remaining;
        setCurentBalnce(total);
      });
  }, [AllTransactions]);
  return (
    <div className="right-bar wallet-right-bar">
      <div className="graph-box">
        <div className="box-heading right-box">
          <div className="title">
            <h4>Add Funds</h4>
            <div className="back-button">
              {showWallet && (
                <FontAwesomeIcon
                  icon={faLongArrowAltLeft}
                  onClick={() => hideAddWallet(false)}
                />
              )}
            </div>
          </div>
        </div>
        <div class="boder-bottom"></div>
        <div className="current-blance">
          <p>Current Balance</p>
          <h3>${currentBalance}</h3>
          <form>
            <div class="form-group">
              <label class="title-label" for="exampleInputEmail1">
                Amount to fund wallet
              </label>
              <input
                aria-describedby="emailHelp"
                class="form-control"
                name="first_name"
                placeholder="Amount to fund wallet"
                type="number"
                onChange={handleChange}
                value={fundWallet}
              />
            </div>
          </form>
          <p>wallet balance after deposit</p>
          <h3>
            $
            {fundWallet
              ? parseInt(fundWallet) + parseInt(currentBalance)
              : currentBalance}
          </h3>
        </div>
        <div className="dislaimer">
          <h4>Disclaimer</h4>
          <p></p>
          <p>
            I love cheese, especially bavarian bergkase brie. Brie lancashire
            blue castello croque monsieur emmental cottage cheese brie cut the
            cheese. Cow bocconcini queso ricotta chalk and cheese parmesan
            pecorino cheese slices. Cheese slices.
          </p>
        </div>
        <form>
          <div className="checkbox">
            <input
              type="checkbox"
              className="form-check-input input-box"
              id="exampleCheck1"
            />
            <label className="form-check-label" for="exampleCheck1">
              I agree with this stuff
            </label>
          </div>
        </form>
        <Stripe
          label={`Add Wallat Balance $ ${fundWallet} `}
          className="like-post-btn"
          name="Streambed Magnify"
          billingAddress
          shippingAddress
          description={`Add Wallat Balance is $ ${fundWallet}`}
          panelLabel={`Add Balance to the wallats`}
          stripeKey={process.env.REACT_APP_STRIPE_PUB_KEY}
          token={fundWallet ? onToken : null}
        />
      </div>
    </div>
  );
}
