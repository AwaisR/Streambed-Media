import react from "react";
const Label = ({ labelname }) => {
  return (
    <>
      <label htmlFor="exampleInputEmail1" className="title-label">
        {labelname}
      </label>
    </>
  );
};
export default Label;
