import React from "react";
import "./wallet.css";
import moment from "moment";
export default function Transetion({ AllTransactions }) {
  return (
    <>
      <div className="transection-outer">
        <div className="transection-header bg-white">
          <div className="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Remaining</th>
                </tr>
              </thead>
              <tbody>
                {AllTransactions &&
                  AllTransactions.map((trans, i) => {
                    if (trans.type === "wallets") {
                      return (
                        <tr key={i}>
                          <td>
                            <span class="blue-bg"></span>Deposit
                          </td>
                          <td>{moment(trans.date).format("ll")}</td>
                          <td>${trans.amount}</td>
                          <td>${trans.remaining}</td>
                        </tr>
                      );
                    } else {
                      console.log("yes");
                      return (
                        <tr>
                          <td>
                            <span className="brown-bg"></span>Pay content
                            creators
                          </td>
                          <td>{moment(trans.date).format("ll")}</td>
                          <td>-${trans.amount}</td>
                          <td>${trans.remaining}</td>
                        </tr>
                      );
                    }
                  })}

                {/* <tr>
                  <td>
                    <span className="blue-bg"></span>Initial Deposit
                  </td>
                  <td>Nov 01, 2021</td>
                  <td>$10,000</td>
                  <td>$10,000.00</td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
