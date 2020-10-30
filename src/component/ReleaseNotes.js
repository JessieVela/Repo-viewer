import React, { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import "../styles/ReleaseNotes.css";

const ReleaseNotes = (props) => {
  return (
    <Fragment>
      <h2>Release Notes</h2>
      <ReactMarkdown>
        {props.notes ? props.notes : "No Release Notes"}
      </ReactMarkdown>
    </Fragment>
  );
};

export default ReleaseNotes;
