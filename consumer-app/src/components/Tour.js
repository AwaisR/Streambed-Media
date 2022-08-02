// tour.js

import React, { useReducer, useEffect } from "react";
import JoyRide, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useHistory } from "react-router-dom";

import { useDispatch } from "react-redux";
// Initial state for the tour component
import { setVideoStep, setUplaodProgress } from "../actions/index";
import axios from "axios";
import { useState } from "react";

// Tour steps
const TOUR_STEPS = [
  {
    target: "#dash-board-tour",
    content:
      "Here you can see all the updates on your post activity. Select the Analytics tab to see information about your contents’ individual performance.",
    disableBeacon: true,
    placement: "left-start",
  },
  {
    target: "#header-profile-tour",
    content:
      "Here you can view your profile and linked accounts. Select either edit button to go to your settings page.",
    placement: "left-start",
  },
  {
    target: "#video-upload-tour",
    content: "Select the browse button to find content on your computer.",
    placement: "left",
  },
  {
    target: "#video-upload-success",
    content: "You can see how it’s performing on your dashboard.",
    placement: "left-end",
  },
];
const INITIAL_STATE = {
  key: new Date(), // This field makes the tour to re-render when we restart the tour
  run: false,
  continuous: true, // Show next button
  loading: false,
  stepIndex: 0, // Make the component controlled
  steps: TOUR_STEPS,
};

// Reducer will manage updating the local state
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // start the tour
    case "START":
      return { ...state, run: true };
    // Reset to 0th step
    case "RESET":
      return { ...state, stepIndex: 0 };
    // Stop the tour
    case "STOP":
      return { ...state, run: false };
    // Update the steps for next / back button click
    case "NEXT_OR_PREV": {
      return { ...state, ...action.payload };
    }
    // Restart the tour - reset go to 1st step, restart create new tour
    case "RESTART":
      return {
        ...state,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date(),
      };
    default:
      return state;
  }
};

// Tour component
const Tour = () => {
  var history = useHistory();
  const usedispatch = useDispatch();
  // Tour state is the state which control the JoyRide component
  const [tourState, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [training, setTraining] = useState(false);

  const isTrained = async () => {
    try {
      const res = await axios.get("/users/get-training", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      return res;
    } catch (error) {
      console.log("isTrained, error");
    }
  };
  useEffect(() => {
    isTrained().then((res) => {
      if (res?.data?.training) {
        setTraining(res.data.training);
        dispatch({ type: "START" });
      }
    });
  }, []);

  // Listen to callback and dispatch state changes
  const callback = (data) => {
    const { action, index, type, status } = data;

    if (
      // If close button clicked then close the tour
      action === ACTIONS.CLOSE ||
      // If skipped or end tour, then close the tour
      (status === STATUS.SKIPPED && tourState.run) ||
      status === STATUS.FINISHED
    ) {
      localStorage.setItem("tour", true);
      axios.get("/users/set-training", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      dispatch({ type: "STOP" });
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      const payload = { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) };
      switch (payload.stepIndex) {
        case 1:
          history.push("/profile");
          break;
        case 2:
          history.push("/video-upload");

          //   window.location = "/profile";
          //   location.push("/profile");

          break;
        case 3:
          usedispatch(setVideoStep(2));
          usedispatch(setUplaodProgress(33.3));

          break;

        default:
          break;
      }
      // Check whether next or back button click and update the step
      dispatch({
        type: "NEXT_OR_PREV",
        payload: payload,
      });
    }
  };

  // Call startTour to start the tour
  const startTour = () => {
    // Start the tour manually
    dispatch({ type: "RESTART" });
  };

  return (
    <>
      <li className="items-center tour-link" onClick={startTour}>
        <button className="text-gray-800 hover:text-gray-600 text-xs uppercase py-3 font-bold block">
          <i className="fas fa-fingerprint text-gray-500 mr-2 text-sm"></i>{" "}
          Start tour
        </button>
      </li>
      {training ? (
        <JoyRide
          {...tourState}
          callback={callback}
          showSkipButton={true}
          showProgress={true}
          styles={{
            options: {
              arrowColor: "#0099cd",
              backgroundColor: "#ffffff",
              primaryColor: "#0099cd",
              textColor: "#0099cd",
              zIndex: 1000,
              borderRadius: "30px",
              width: "100%",
              maxWidth: 575,
              height: 307,
            },
            buttonClose: {
              display: "none",
            },
            overlay: {
              backgroundColor: "transparent",
            },
            spotlight: {
              backgroundColor: "transparent",
            },
            floater: {
              position: "fixed",
              left: "50%",
              top: "50% ",
              transform: "translate(-50%, -50%)",
              width: "100%",
              maxWidth: "575px",
              boxShadow: "0px 3px 6px #0000029",
              border: "2px solid #0099cd",
              borderRadius: "20px",
              opacity: "1 ",
              padding: "35px 25px",
              overflow: "hidden",
              backgroundColor: "#fff",
            },

            beacon: {
              display: "inline-block",
              height: "20px",
              position: "relative",
              width: "200px",
              zIndex: "222",
            },
            tooltip: {
              padding: "0",
            },
            tooltipContainer: {
              textAlign: "left",
              backgroundColor: "#FFFFFF",
              borderRadius: "30px",
              width: "100%",
              height: "100%",
            },
            buttonBack: {
              marginRight: 10,
              display: "none",
            },
            buttonSkip: {
              backgroundColor: "#FFF",
              color: "#0099CD",
              width: 164,
              height: 40,
              borderRadius: 20,
              fontSize: 20,
              fontWeight: "700",
              border: "2px solid #0099CD",
            },
            buttonNext: {
              width: 164,
              height: 40,
              backgroundImage: `linear-gradient(
                to right,
                #5bc3b2,
                #37babb,
                #00b0c4,
                #00a5ca,
                #0099cd
              )`,
              borderRadius: 20,
              fontSize: 20,
              fontWeight: "700",
              color: "#ffffff",
            },
            tooltipFooter: {
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              marginTop: 15,
              maxWidth: 400,
              margin: "0 auto",
            },
          }}
          locale={{
            last: "End tour",
          }}
        />
      ) : null}
    </>
  );
};

export default Tour;
