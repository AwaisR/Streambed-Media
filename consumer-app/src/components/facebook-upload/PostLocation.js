import React from "react";
import "./postLocation.css";
import { FormGroup, Label, Input } from "reactstrap";
function PostLocation({ pages, groups, onChange }) {
  const [selected, setSelected] = React.useState({ id: "", target: "" });
  const setTargetSelection = (e, target) => {
    setSelected({ id: e.target.id, target: target });
  };

  const nextHandler = () => {
    onChange(selected);
  };
  return (
    <div className="fb-post-location-wrap">
      <div className="page-top-header">
        <h3>Select Facebook Page or Group</h3>
      </div>
      <div className="page-list-content">
        <p>
          Streambed can post to Facebook pages or groups via your account. For
          personal timeline posts, locate your PostCard in the Content Stream on
          the Dashboard and create an index page.
        </p>
      </div>

      <div className="pages-list-contaier">
        <div className="pages-list">
          <div className="page-list-header">
            <i className="fa fa-users icon-blue" aria-hidden="true"></i>{" "}
            <span> Your Groups</span>
          </div>
          <div className="options">
            {groups &&
              groups.map((item, i) => {
                return (
                  <div key={i}>
                    <FormGroup tag="fieldset">
                      <FormGroup>
                        <Label>
                          <div className="option-item">
                            <img
                              src="https://img.icons8.com/2266EE/search"
                              alt="iconsimg"
                            />
                            <Input
                              className="page-radio"
                              type="radio"
                              name="radio1"
                              id={item.id}
                              onChange={(e) => {
                                setTargetSelection(e, "groups");
                              }}
                            />{" "}
                            {item.name}
                          </div>
                        </Label>
                      </FormGroup>
                    </FormGroup>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="pages-list">
          <div className="page-list-header">
            <i className="" />
            <i className="fa fa-flag icon-blue" aria-hidden="true"></i>{" "}
            <span> Your pages</span>
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
                              alt="iconImg"
                            />
                            <Input
                              key={i}
                              className="page-radio"
                              type="radio"
                              name="radio1"
                              id={item.page_id}
                              onChange={(e) => {
                                setTargetSelection(e, "pages");
                              }}
                            />{" "}
                            {item.name}
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
