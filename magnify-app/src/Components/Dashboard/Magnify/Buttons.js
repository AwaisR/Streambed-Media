import react, { useEffect, useState } from "react";
import "../Overview/overview.css";
import "./magnify.css";
import image from "../../../assests/images/image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { magnifyActions } from "../../../store/magnify/action";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";
import HeartButton from "./HeartButton";
import CrossButton from "./CrossButton";
export default function Buttons({
  id,
  item,
  dropdownName,
  handlePaidVideosRecord,
}) {
  let token = localStorage.getItem("token");
  const [swapButton, setSwapButton] = useState(false);
  const [active, setActive] = useState(false);
  const dispatch = useDispatch();
  const [fev, setfev] = useState();
  const [fevPostIndex, setfevPostIndex] = useState();

  const state = useSelector((state) => state.Magnify);
  const { UserPosts, Load } = state;

  const handleSwapButton = () => {
    setSwapButton(!swapButton);
  };
  const handleBuyButton = (item) => {
    setSwapButton(!swapButton);
    handlePaidVideosRecord(item);
  };
  return (
    <div>
      <div className="magnify-payment">
        <div className="magnify-pay">
          <div className="flip-btn">
            <button
              className={swapButton ? "flip-btn-inner swap" : "flip-btn-inner"}
            >
              <span
                className="flip-btn-front"
                onClick={
                  !item.delete && item.videoprice ? null : handleSwapButton
                }
              >
                {item.videoprice ? "Paid" : " Pay $5"}
              </span>
              <span
                className="flip-btn-back"
                onClick={() => !item.delete && handleBuyButton(item)}
              >
                Buy $500
              </span>
            </button>
          </div>
        </div>

        <div className="magnify-image">
          <HeartButton item={item} />
          <CrossButton item={item} dropdownName={dropdownName} />
        </div>
      </div>
    </div>
  );
}
