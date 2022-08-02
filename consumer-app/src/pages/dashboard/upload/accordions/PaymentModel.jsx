import React from "react";
import RoundedInput from "../../../../components/forms/RoundedInput";
import { NextButton } from "./shared.js";
import "./../../../../tailwind.css";

// import {
//   NEXT_BUTTON_ACTIVE_CLASSNAME,
//   NEXT_BUTTON_DEFAULT_CLASSNAME,
//   NEXT_BUTTON_INACTIVE_CLASSNAME,
// } from "./shared";
const PaymentModel = ({ onNext, index, CloseModel }) => {
  const handleSubmit = (evt) => {
    evt.preventDefault();
    onNext(index + 1);
  };

  return (
    <>
      <div className="payment-outer">
        <div className="payment-container">
          <div className="payment-head">
            <h1>Payment Information</h1>
            <span className="cross_icon" onClick={() => CloseModel()}>
              <svg
                class="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </span>
          </div>
          <form onSubmit={handleSubmit}>
            <div>
              <RoundedInput
                className="block"
                name="Name"
                type="text"
                // value={title}
                placeholder="Name"
                // onChange={(e) => {
                //   setTitle(e.target.value);
                // }}
                required
              />
            </div>
            <div>
              <RoundedInput
                className="block"
                name="Email"
                type="email"
                // value={title}
                placeholder="Email"
                // onChange={(e) => {
                //   setTitle(e.target.value);
                // }}
                required
              />
            </div>
            <div>
              <RoundedInput
                className="block"
                name="Name"
                type="number"
                // value={title}
                placeholder="Card number"
                // onChange={(e) => {
                //   setTitle(e.target.value);
                // }}
                required
              />
            </div>
            <div className="flex post_input">
              <RoundedInput
                className="block"
                name="MM/YY"
                type="date"
                // value={title}
                placeholder="MM/YY"
                // onChange={(e) => {
                //   setTitle(e.target.value);
                // }}
                required
              />

              <RoundedInput
                className="block"
                name="CVC"
                type="number"
                // value={title}
                placeholder="CVC"
                // onChange={(e) => {
                //   setTitle(e.target.value);
                // }}
                required
              />
            </div>
            <div className="paymet-submint">
              <div className="submint_btn">
                <NextButton
                  className="ml-auto"
                  // disabled={!platform}
                  // onClick={() => onNext(index + 1)}
                >
                  Varify
                </NextButton>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="payment-overlay"></div>
    </>
  );
};
export default PaymentModel;
