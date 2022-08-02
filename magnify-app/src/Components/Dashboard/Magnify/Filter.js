import React from "react";
import { Dropdown, DropdownToggle, Row, Col } from "react-bootstrap";
export default function Filter({ dropdownName, handlefilter, handleDeleted }) {
  return (
    <div className="box-selector">
      <Dropdown>
        <Dropdown.Toggle
          variant="success"
          id="dropdown-basic"
          className="graph-btn"
        >
          {dropdownName ? dropdownName : "Filter"}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handlefilter("Company Videos")}>
            Company Videos
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handlefilter("YouTube")}>
            YouTube
          </Dropdown.Item>
          {/* <Dropdown.Item onClick={() => handlefilter("Company Favourites")}>
            Company Favourites
          </Dropdown.Item> */}
          <Dropdown.Item onClick={() => handlefilter("Show favourite")}>
            Show favourites
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handlefilter("Show Deleted")}>
            Show Deleted
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handlefilter("Show Paid Videos")}>
            Show Paid Videos
          </Dropdown.Item>
          {/* <Dropdown.Item onClick={() => handlefilter("Company PaidVideos")}>
            Company Paid Videos
          </Dropdown.Item> */}
          {/* <Dropdown.Item onClick={() => handlefilter("YouTube Favourites")}>
            YouTube Favourites
          </Dropdown.Item> */}
          {/* <Dropdown.Item onClick={() => handlefilter("YouTube PaidVidoes")}>
            YouTube Paid Vidoes
          </Dropdown.Item> */}
          {/* <Dropdown.Item onClick={() => handlefilter("Show Company Deleted")}>
            Show Company Deleted
          </Dropdown.Item> */}
          {/* <Dropdown.Item onClick={() => handlefilter("Show Youtube Deleted")}>
            Show Youtube Deleted
          </Dropdown.Item> */}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
