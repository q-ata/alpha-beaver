import React from "react";
import PropTypes from "prop-types";

const TextElement = (props) => {
  return (<p {...props.attributes}>{props.children}</p>);
};

TextElement.propTypes = {
  attributes: PropTypes.array,
  children: PropTypes.array
};

export default TextElement;