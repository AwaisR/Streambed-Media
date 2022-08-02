import React from "react";

function Filters({ filter }) {
  function StopEventPropagation(event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
  }
  return (
    <div
      onClick={(e) => {
        StopEventPropagation(e);
      }}
      className={`filters-wrap ${filter ? "filters-wrap-show" : null}`}
    >
      <div className="filters-inner">
        <h3>Filters</h3>
        <form>
          <div className="filters-check">
            <h4>Platforms</h4>
            <div className="form-group form-check">
              <input type="checkbox" id="link1" />
              <label htmlFor="link1">Youtube</label>
            </div>
            <div className="form-group form-check">
              <input type="checkbox" id="link2" />
              <label htmlFor="link2">Instagram</label>
            </div>
            <div className="form-group form-check">
              <input type="checkbox" id="link3" />
              <label htmlFor="link3">Twitter</label>
            </div>
            <div className="form-group form-check">
              <input type="checkbox" id="link4" />
              <label htmlFor="link4">Instagram</label>
            </div>
          </div>
          <div className="location-filter">
            <h4>Your Location</h4>
            <div className="location-row">
              <div className="map">
                <span>Interactive Map</span>
              </div>
              <div className="filter-slider">
                <h4>Distance From</h4>
                <div className="distance-slider">
                  <span>0km</span>
                  <span>50km</span>
                  <span>All</span>
                  <div className="slide-bar">
                    <span className="slide-dot"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Filters;
