import React from "react";
import ReleaseNotes from "./ReleaseNotes";
import "../styles/Card.css";
/**
 * Stateless component that renders repo information.
 * @param props - Contains repo information
 */
const Card = (props) => {
  var createdDate, repoNotes;

  if (props.data[0].published_at !== undefined) {
    createdDate = props.data[0].published_at.substring(
      0,
      props.data[0].published_at.indexOf("T") // at location 'T' relevant repo information begins.
    );
    repoNotes = props.data[0].body;
  } else {
    createdDate = props.data[0].commit.author.date.substring(
      0,
      props.data[0].commit.author.date.indexOf("T")
    );
    repoNotes = props.data[0].commit.message;
  }

  return (
    <div className="card-wrapper">
      {props.edit ? (
        <div className="edit-box">
          <button
            className="delete-button"
            onClick={() => {
              props.deleteRepo(props.repo); 
            }}
          >
            Delete
          </button>
        </div>
      ) : null}
      <div
        className={props.edit ? "card edit-select" : "card"}
        onClick={() => {
          props.openReleaseNotes(props.repo);
        }}
      >
        <div className="repo-name">
          <h2>{props.org}</h2>
          <h3>{props.repo}</h3>
        </div>
        {props.data.length > 0 && (
          <div className="release">
            {props.seen ? null : <p>New</p>}
            <div className="release-num">
              <p>{createdDate}</p>
              <p>
                {props.data && props.data.length > 0
                  ? props.data[0].tag_name
                  : null}
              </p>
            </div>
          </div>
        )}
        {props.openNotes && props.data.length > 0 ? (
          <div className="release-notes">
            <ReleaseNotes notes={repoNotes} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Card;
