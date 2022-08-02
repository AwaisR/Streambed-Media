import react from "react";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
const Button = (props) => {
  const { name, className, handleClick, nextArrow } = props;
  return (
    <button onClick={handleClick} className={className}>
      {name}
      {nextArrow ? <FontAwesomeIcon icon={faChevronRight} /> : null}
    </button>
  );
};
export default Button;
