import React from "react";
import ResetPassword from "./ResetPassword";
import BackupWallet from "./BackupWallet";
import PubAnalytics from "./PubAnalytics";

//* Read me for this component
/** On mount/login, this will fetch the rememberYoutube in the DB**/
/** Then sets that to the state to update if the checkbox stays checked or not **/
/** Checking the box will POST the remember var into the DB **/
//*--Tommy
class Hamburger extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSidebarOpen: false,
    };
  }

  handleMenuButtonClick = () => {
    this.setState({ isSidebarOpen: !this.state.isSidebarOpen });
  };

  render() {
    const { isSidebarOpen } = this.state;

    return (
      <div className="ham--container">
        <div className="menu-button" onClick={this.handleMenuButtonClick}>
          <i className="fas fa-bars" style={{ color: "#2f63e3" }} />
        </div>

        {/*	Sidebar */}
        <nav className={`nav ${isSidebarOpen ? "show" : "close--nav"}`}>
          <div onClick={this.handleMenuButtonClick} className="close">
            <i className="fas fa-times" />
          </div>
          <ul className="menu-items">
            <li className="menu-list">
              <a className="menu-link">
                <PubAnalytics
                  isChecked={this.props.isChecked}
                  checkboxHandler={this.props.checkboxHandler}
                  handleClose={this.handleMenuButtonClick}
                />
              </a>
            </li>
            <li className="menu-list">
              <a className="menu-link">
                <BackupWallet handleClose={this.handleMenuButtonClick} />
              </a>
            </li>
            <li className="menu-list">
              <a className="menu-link">
                <ResetPassword handleClose={this.handleMenuButtonClick} />
              </a>
            </li>
            <li className="menu-list">
              <a className="menu-link"></a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Hamburger;
