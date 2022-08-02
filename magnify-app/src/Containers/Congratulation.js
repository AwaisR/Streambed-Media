import react from "react";
import Logo from "./Logo";
import Button from "./Button";
import { useHistory } from "react-router-dom";
import { userActions } from "../store/signup/actions";
import { useSelector, useDispatch } from "react-redux";
const Congratulation = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const handleCencel = () => {
    dispatch(userActions.CencelFunction());
    history.push("/");
  };
  return (
    <>
      <div className="congratulations content-inner">
        <div className="congratulations-text">
          <h2>Congratulations!</h2>
          <p> Your company profile and admin user have been set up.</p>
          <p>
            We have emailed you a verification email. Please follow the prompts
            in your email to initiate your access to the Streambed Magnify
            platform.
          </p>
        </div>
        <div className="form-footer">
          <div className="next-btn">
            <Button
              name="Return "
              className="form-btn"
              handleClick={handleCencel}
              nextArrow="yes"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Congratulation;
