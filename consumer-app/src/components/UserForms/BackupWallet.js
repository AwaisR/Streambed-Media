import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const BackupWallet = (props) => {
  //****************************************SweetAlert modal */
  const MySwal = withReactContent(Swal);
  //**********************************************************************/
  //********This will fetch the encrypted mnemonic from the Db if pw is correct */
  //********It will decrypt and show to user, telling them to write it down */
  //**********************************************************************/

  const getWallet = async (data, result) => {
    let response = await fetch("/users/backup-wallet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
        result,
      }),
    });

    const resJson = await response.json();

    return resJson.plaintext;
  };
  const backupWallet = () => {
    const token = window.localStorage.getItem("token");
    // props.handleClose();
    MySwal.mixin({
      input: "password",
      confirmButtonText: "Submit",
      showCancelButton: true,
    })
      .queue(["Enter Password"])
      .then((result) => {
        if (result.dismiss) {
          return;
        }
        if (!result.value[0]) {
          Swal.fire({
            title: "Fields cannot be blank",
          });
          console.log(result);
        } else {
          console.log(result);
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
            .then(async (data) => {
              if (data.success) {
                let plaintext = await getWallet(data, result);
                Swal.fire({
                  title: "Write this mnemonic down",
                  text: plaintext,
                  footer: "<strong>Don't lose it, Don't share it</strong>",
                });
              } else {
                Swal.fire({
                  title: data.msg,
                });
              }
            })
            .catch(function (error) {
              console.log("Request failed", error);
            });
        }
      });
  };
  //****************************************SweetAlert modal end */
  return (
    <button
      id="deactivate-tab"
      className="nav-link "
      role="presentation reset--pw"
      onClick={() => backupWallet()}
    >
      Backup Account
      <div className="radio_tab" />
    </button>
  );
};

export default BackupWallet;
