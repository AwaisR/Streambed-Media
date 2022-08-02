import React from "react";
import "./postLocation.css";
import { FormGroup, Label, Input } from "reactstrap";
function PostLocation({ pages, onChange }) {
  const [selected, setSelected] = React.useState({ id: "", target: "" });
  const setTargetSelection = (e, target) => {
    setSelected({ id: e.target.id, target: target });
  };

  const nextHandler = () => {
    if (selected.id) {
      onChange(selected);
    }
  };
  return (
    <div className="fb-post-location-wrap">
      <div className="page-top-header">
        <h3>Select Linkedin Page </h3>
      </div>
      <div className="page-list-content">
        <p>
          Streambed can post to Linkedin pages via your account.
          {/* For
          personal timeline posts, locate your PostCard in the Content Stream on
          the Dashboard and create an index page. */}
        </p>
      </div>

      <div className="pages-list-contaier ">
        <div className="pages-list">
          <div className="page-list-header">
            <i className="" />
            <i className="fa fa-flag icon-blue" aria-hidden="true"></i>{" "}
            <span> Your Company pages</span>
          </div>
          <div className="options">
            {pages &&
              pages.map((item, i) => {
                return (
                  <div key={i}>
                    <FormGroup tag="fieldset">
                      <FormGroup>
                        <Label>
                          <div className="option-item">
                            <img
                              src="https://img.icons8.com/2266EE/search"
                              alt="iconsImage"
                            />
                            <Input
                              key={i}
                              className="page-radio"
                              type="radio"
                              name="radio1"
                              id={item.organaization_id}
                              onChange={(e) => {
                                setTargetSelection(e, "pages");
                              }}
                            />{" "}
                            {item.organaization_name}
                          </div>
                        </Label>
                      </FormGroup>
                    </FormGroup>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="footer-btn">
        <button
          onClick={() => {
            console.log("go back");
          }}
        >
          Back
        </button>
        <button onClick={() => nextHandler()}>Next</button>
      </div>
    </div>
  );
}

export default PostLocation;
