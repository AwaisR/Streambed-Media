import react from "react";
import "./index.css";
import Button from "./Button";
const InputFeild = ({
  className,
  name,
  handleChange,
  placeholder,
  type,
  labelname,
  value,
}) => {
  return (
    <>
      <div className="form-group">
        {labelname ? (
          <label htmlFor="exampleInputEmail1" className="title-label">
            {labelname}
          </label>
        ) : null}

        <input
          type={type}
          className={className}
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={handleChange}
          // value={value}
        />
      </div>
    </>
  );
};
export default InputFeild;
