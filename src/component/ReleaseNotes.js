import React, { Fragment } from "react";
import "../styles/ReleaseNotes.css";

const ReleaseNotes = (props) => {
  return (
    <Fragment>
      <h2>Release Notes</h2>
      <p>{props.notes ? props.notes : "No Release Notes"}</p>
    </Fragment>
  );
};

export default ReleaseNotes;
