import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ResetPassword = (props) => {
  const token = window.localStorage.getItem("token");
  //****************************************SweetAlert modal */
  const MySwal = withReactContent(Swal);
  //**********************************************************************/
  //********This will fetch the encrypted mnemonic from the Db */
  //********It will then decrypt and re-encrypt with the new pw */
  //********Then it sends the newly encrypted mnemonic and pw back to the server to be saved */
  //********Server never knows mnemonic */
  //**********************************************************************/
  const handleFetch = (pwArr) => {
    fetch("/users/getmnemonic", {
      method: "GET",
      headers: {
        authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then(async (data) => {
        let resetpassword = await fetch("/users/password-reset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data,
            pwArr,
          }),
        });

        const resJson = await resetpassword.json();
        console.log("resetpassword", resJson);
        fetch("/users/reset", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
          body: JSON.stringify({
            password: pwArr[1],
            encryption: resJson.encryption,
          }),
        });
      });
  };

  const handleResetPassword = () => {
    MySwal.mixin({
      input: "password",
      confirmButtonText: "Next &rarr;",
      showCancelButton: true,
      progressSteps: ["1", "2", "3"],
    })
      .queue(["Enter Old Password", "Enter New Password", "Re-enter Password"])
      .then((result) => {
        if (result.dismiss) {
          return;
        }
        if (!result.value[1] || !result.value[0] || !result.value[2]) {
          Swal.fire({
            title: "Fields cannot be blank",
          });
        } else if (result.value[1] !== result.value[2]) {
          Swal.fire({
            title: "Please enter matching passwords",
          });
        } else {
          fetch("/users/comparepw", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `${token}`,
            },
            body: JSON.stringify({
              password: result.value[0],
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) handleFetch(result.value); //If the passwords match, it will fire handleFetch
              Swal.fire({
                title: data.msg,
              });
            });
        }
      });
  };
  //****************************************SweetAlert modal end */
  return (
    <button
      className="nav-link "
      role="presentation reset--pw"
      onClick={() => handleResetPassword()}
    >
      Reset Password
      <div className="radio_tab" />
    </button>
  );
};

export default ResetPassword;
