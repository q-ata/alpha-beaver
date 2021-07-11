import React from "react";
import PropTypes from "prop-types";

const BoldElement = (props) => {
  return (<b {...props.attributes}>{props.children}</b>);
};

BoldElement.propTypes = {
  attributes: PropTypes.array,
  children: PropTypes.array
};

export default BoldElement;