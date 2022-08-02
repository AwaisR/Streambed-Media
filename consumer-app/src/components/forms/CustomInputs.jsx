import React from "react";
import PropTypes from "prop-types";

// const DefaultInput = styled.CustomInputs`
//   padding: 8px 12px;
//   color: #707070;
// `;

const CustomInputs = ({
  type,
  name,
  label: inputLabel,
  className,
  id,
  ...rest
}) => {
  id = id || name;
  return (
    <>
      <div class="mb-0 w-4/0 flex justify-end mr-4">
        <input
          className="shadow  appearance-none border border-primary w-1/2 h-9 rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          {...rest}
        />
      </div>
    </>
  );
};

CustomInputs.propTypes = {
  type: PropTypes.oneOf(["text", "number", "password", "tel", "search"]),
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
};

CustomInputs.defaultProps = {
  type: "text",
};

export default CustomInputs;
