import React, { useEffect, useState } from "react";
import "./stream.css";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPlateform } from "../../../src/actions/dashboard";
import { updateVideoCollaboratorsStatistics } from "../../actions/dashboard";

import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
const UserStream = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [collaboratorsFilter, setCollaboratorsFilter] = useState([]);
  const plateForm = useSelector((state) => state.dashboard.plateForm);
  const [checkAll, setCheckAll] = useState(true);
  const [itemchecked, setItemChecked] = useState([]);
  const [dropFilter, setDropFilter] = useState(false);
  const dispatch = useDispatch();
  const handlePlateFormChange = (plateform) => {
    // setPlateForm(plateform);
    dispatch(setPlateform(plateform));
  };
  const videoCollaboratorsStatistics = useSelector(
    (store) => store.dashboard.videoCollaboratorsStatistics
  );
  const [ytCollaboratorsVideoList, setYTCollVideoList] = useState([]);
  const [ytCollaboratorsVideoListFilter, setYTCollVideoListFilter] = useState(
    []
  );
  useEffect(() => {
    setCollaboratorsFilter(collaborators);
  }, [collaborators]);
  useEffect(() => {
    let link = "";
    const youtubeColl = "/api/list-collaborators";
    const twitterColl = "/api/twitter/get-collaborators";
    const linkedColl = "/api/linkedin/get-collaborators";
    if (plateForm == "youtube") {
      link = youtubeColl;
    }
    if (plateForm == "linkedin") {
      link = linkedColl;
    }
    if (plateForm == "twitter") {
      link = twitterColl;
    }

    axios
      .get(link, {
        headers: {
          authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        let checked = [];
        res.data.collaborators.forEach((item) => {
          checked.push(true);
          item.selected = true;
        });
        setCollaborators(res.data.collaborators);
        setItemChecked(checked);
      })
      .catch((error) => {
        console.log("Somethign went wrong", error);
      });
  }, [plateForm]);
  useEffect(() => {
    let checked = [];

    const coll = [...collaborators];
    videoCollaboratorsStatistics.forEach((item, i) => {
      coll.forEach((c) => {
        if (c.videoId == item.id) {
          c.selected = item.selected;
        }
      });
    });
    setCollaborators(coll);
    setItemChecked(checked);
  }, [videoCollaboratorsStatistics]);
  const handleCheckAll = () => {
    const temp = [...itemchecked];

    if (checkAll) {
      itemchecked.forEach((item, i) => {
        temp[i] = false;
        setCollSelction(false);
      });
    } else {
      itemchecked.forEach((item, i) => {
        temp[i] = true;
        setCollSelction(true);
      });
    }
    setItemChecked(temp);

    setCheckAll(!checkAll);
  };

  const setCollSelction = (select) => {
    const videoList = [...videoCollaboratorsStatistics];
    videoList.forEach((item) => {
      item.selected = select;
    });
    dispatch(updateVideoCollaboratorsStatistics(videoList));
  };

  const itemCheck = (i, videoID) => {
    const temp = [...itemchecked];
    temp[i] = !itemchecked[i];
    const selected = temp.filter((i) => i);

    const videoList = [...videoCollaboratorsStatistics];
    videoList.forEach((item) => {
      if (videoID == item.id) {
        item.selected = !item.selected;
      }
    });
    const coll = [...collaborators];
    coll.forEach((item) => {
      if (videoID == item.videoId) {
        item.selected = !item.selected;
      }
    });

    setCollaborators(coll);
    dispatch(updateVideoCollaboratorsStatistics(videoList));
    setCheckAll(selected.length == itemchecked.length);
    setItemChecked(temp);
  };

  const _filter = ({ target: { value } }) => {
    const coll = collaborators.filter((col) =>
      col.user.toLowerCase().includes(value)
    );
    setCollaboratorsFilter(coll);
  };
  return (
    <div className="height-content">
      <div className="filter-dropdown">
        <h4 className="d-none d-sm-block">Filter</h4>
        <div className="custom-dropdown">
          <ButtonDropdown
            disabled={false}
            isOpen={dropFilter}
            toggle={(e) => setDropFilter(!dropFilter)}
          >
            <DropdownToggle caret>
              {plateForm.length > 0 ? plateForm : "Select Platform Filters"}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => handlePlateFormChange("youtube")}>
                <div className="select-all d-flex">
                  <div className="mr-3">
                    <label className="checkmark-parent position-relative">
                      <input
                        type="checkbox"
                        id="youtube"
                        name="youtube"
                        onChange={() => {}}
                        checked={plateForm == "youtube"}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="content-select">
                    <img
                      alt="youtube icon"
                      src={require("../../assets/images/youtube-icon.svg")}
                    />
                    <label>Youtube</label>
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem onClick={() => handlePlateFormChange("twitter")}>
                <div className="select-all d-flex">
                  <div className="mr-3">
                    <label className="checkmark-parent position-relative">
                      <input
                        type="checkbox"
                        id="twitter"
                        onChange={() => {}}
                        checked={plateForm.toLowerCase() == "twitter"}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="content-select">
                    <img
                      alt="twitter-icon"
                      src={require("../../assets/images/twitter-icon.svg")}
                    />
                    <label>Twitter</label>
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem onClick={() => handlePlateFormChange("linkedin")}>
                <div className="select-all d-flex">
                  <div className="mr-3">
                    <label className="checkmark-parent position-relative">
                      <input
                        type="checkbox"
                        id="twitter"
                        onChange={() => {}}
                        checked={plateForm.toLowerCase() == "linkedin"}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="content-select">
                    <img
                      alt="twitter-icon"
                      src={require("../../assets/images/linkedin.svg")}
                    />
                    <label>Linkedin</label>
                  </div>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
      </div>

      <div className="new-check d-flex px-lg-3 justify-content-between flex-wrap">
        <div className="select-all d-flex">
          <div className="mr-3">
            <label className="checkmark-parent position-relative">
              <input
                type="checkbox"
                id="selectAll"
                onChange={() => handleCheckAll()}
                checked={checkAll}
              />
              <span className="checkmark"></span>
            </label>
          </div>
          <div className="content-select">
            <label>Select All</label>
          </div>
        </div>
        <div className="filter-group">
          <input
            placeholder="Filter content"
            className="filter-textbox"
            type="text"
            onChange={_filter}
          />
        </div>
      </div>
      <div className="overview-root pl-2-5 flexcroll ">
        {collaboratorsFilter.map((item, index) => (
          <div
            key={uuidv4()}
            className="content-stream-videos py-0 userStream d-flex align-items-center h-auto"
          >
            <div>
              <label className="checkmark-parent">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    itemCheck(index, item.videoId);
                  }}
                  checked={item.selected}
                />
                <span className="checkmark"></span>
              </label>
            </div>
            <div className="content-select pl-4">
              <div className="user-stream-icons">
                <img
                  className="user-stream-icon"
                  src={require("../../assets/images/icons/profile-avatar.svg")}
                />
              </div>
            </div>
            <div className="pl-3">
              <div className="video-detail">
                <h6 className="user-stream-name">{item.user.split("@")[0]}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStream;
