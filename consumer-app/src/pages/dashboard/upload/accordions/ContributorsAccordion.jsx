import React, { useEffect, useState } from "react";
import axios from "axios";
import clsx from "clsx";

// components
import RoundedInput from "../../../../components/forms/RoundedInput";
import Select from "../../../../components/forms/Select";

// icons
import PlusCircleIcon from "../../../../components/icons/PlusCircleIcon";
import CloseIcon from "../../../../components/icons/CloseIcon";
import { NextButton } from "./shared";
import MyModal from "../../profile/MsgDisplayModel";
const ContributorsAccordion = ({
  index,
  contributors: parentContributors,
  onSubmit,
  onNext,
}) => {
  const [contributors, setContributors] = useState(parentContributors || []);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState("");

  const roleOptions = {
    "": "Role",
    Author: "Original Publisher",
    Talent: "Talent",
    Crew: "Crew",
  };
  const repostOptions = {
    "": "Repost available",
    yes: "Yes",
    no: "No",
  };

  const setContributorValue = (idx, key, value) => {
    const contributor = contributors[idx];
    contributor[key] = value;
    // correct thing would be to pass in a new array
    // but it is slow
    // TODO: fix
    setContributors([...contributors]);
  };
  const verifyCollaborator = async () => {
    if (contributors.length) {
      //eslint-disable-next-line
      const validEmailRegex = RegExp(
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      );

      // contributors.forEach(({ name, identity }, i) => {
      //   console.log("name", name, identity, i);
      //   if (
      //     i !== contributors.length - 1 &&
      //     contributors[index].name === name
      //   ) {
      //     console.log("nameInner", name, identity, i);
      //     alert("Collaborator Name already added");
      //     // setErrors({ name: "Collaborator Name already added", email: "" });

      //     found = true;
      //     return;
      //   }
      //   //  else if (
      //   //   i !== contributors.length - 1 &&
      //   //   contributors[index].identity === identity
      //   // ) {
      //   //   alert("Collaborator Email already added");
      //   //   // setErrors({ name: "Collaborator Email already added", email: "" });

      //   //   found = true;
      //   //   return;
      //   // }
      // });

      // if (found) return false;
      // var found = false;
      const index = contributors.length - 1;
      if (contributors[index].user.length < 3) {
        setIsOpen(true);
        setErrors("Name cannot be less than three characters");

        return;
      }
      if (!validEmailRegex.test(contributors[index].email)) {
        setIsOpen(true);
        setErrors("Not a valid Email");
        return;
      }
      if (validEmailRegex.test(contributors[index].email)) {
        await axios
          .post(
            "/api/verify-collaborator",
            { collaborator: contributors[index].user },
            {
              headers: {
                "content-type": "application/json",
                Authorization: localStorage.getItem("token"),
              },
            }
          )
          .then((res) => {
            if (res.data.success) {
              if ((contributors[index].email = res.data.email))
                contributors[index].email = res.data.email;
              contributors[index].isVerified = true;
            } else {
              setIsOpen(true);
              setErrors(
                "User dont have an account with us, please provide an email to send a verification email to collaborator!"
              );
              contributors[index].sendMail = true;
            }
          });
      }
      if (!validEmailRegex.test(contributors[index].email)) {
        setIsOpen(true);
        setErrors(
          "User dont have an account with us, please provide an email to send a verification email to collaborator!"
        );
        return false;
      }
    }
  };
  const isFormValid = () =>
    contributors.every(
      (contributor) =>
        contributor.user &&
        contributor.email &&
        contributor.role &&
        contributor.repostAvailable
    );

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (isFormValid()) {
      onSubmit(contributors);
      onNext(index + 1);
    }
  };

  const addNewContributor = async () => {
    setContributors([
      ...contributors,
      {
        _id: contributors.length + 1,
        user: "",
        email: "", // username / email
        role: "",
        repostAvailable: "",
        isVerified: false,
        sendMail: false,
      },
    ]);
  };

  const removeContributor = (idx) => {
    setContributors(contributors.filter((o) => o._id !== idx));
  };

  const formValid = isFormValid();

  useEffect(() => {
    addNewContributor();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setContributors(parentContributors);
  }, [parentContributors]);
  const onFocusInput = async () => {
    verifyCollaborator();
  };
  const closeModal = () => {
    setIsOpen(false);
    setErrors("");
  };
  return (
    <div className="py-2">
      {isOpen ? (
        <MyModal
          isOpen={isOpen}
          title="Collaborators Error"
          closeModal={closeModal}
          description={errors}
        />
      ) : (
        ""
      )}
      <p className="text-sm text-copy font-light">
        If they don’t already have an account with us, they will be sent an
        email notification to verify their role. You will automatically be
        designated as the “Publisher” so there’s no need to include yourself in
        this list.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6 mt-2">
          {contributors.map((contributor, idx) => (
            <div key={contributor._id} className="flex justify-between">
              <div
                className={clsx(
                  "w-11/12 grid gap-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
                  {
                    "border-b pb-6": idx < contributors.length - 1,
                  }
                )}
              >
                <RoundedInput
                  className="block"
                  name="contributorName"
                  id={`contributorName_${idx}`}
                  type="text"
                  // value={contributor.name}
                  placeholder="Name"
                  onChange={(e) => {
                    setContributorValue(idx, "user", e.target.value);
                  }}
                  required
                />
                <RoundedInput
                  className="block"
                  name="contributorIdentity"
                  id={`contributorIdentity_${idx}`}
                  type="text"
                  // value={contributor.identity}
                  placeholder="Username / Email"
                  onBlur={onFocusInput}
                  onChange={(e) => {
                    setContributorValue(idx, "email", e.target.value);
                  }}
                  required
                />
                <Select
                  placeholder="Role"
                  name="contributorRole"
                  id={`contributorRole_${idx}`}
                  // value={contributor.role}
                  onChange={(e) =>
                    setContributorValue(idx, "role", e.target.value)
                  }
                  options={roleOptions}
                  required
                />
                <Select
                  placeholder="Repost available"
                  name="contributorRepost"
                  id={`contributorRepost_${idx}`}
                  // value={contributor.repostAvailable}
                  onChange={(e) =>
                    setContributorValue(idx, "repostAvailable", e.target.value)
                  }
                  options={repostOptions}
                  required
                />
              </div>
              <div className="">
                <CloseIcon
                  className="text-red-500 cursor-pointer text-xs md:text-sm w-3 h-3"
                  onClick={() => removeContributor(contributor._id)}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-4 flex items-center w-auto"
          onClick={addNewContributor}
        >
          <PlusCircleIcon className="mr-1" />
          <span>Add contributor</span>
        </div>

        <div className="mt-6">
          <NextButton className="ml-auto" disabled={!formValid}>
            Next
          </NextButton>
        </div>
      </form>
    </div>
  );
};

export default ContributorsAccordion;
