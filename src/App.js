import React, { Component } from "react";
import "./App.css";
import Card from "./component/Card";
import {
  parseUrl,
  fetchRepoRelease,
  fetchRepoCommit,
  saveToLocalStorage,
} from "./util/Util";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: "",
      edit: false,
    };

    if ("RepoTracking" in localStorage) {
      this.state = {
        repoList: JSON.parse(localStorage.getItem("RepoTracking")),
      };
    }
  }

  componentDidMount() {}

  componentDidUpdate(prevState) {
    if (prevState.repoList !== this.state.repoList) {
      saveToLocalStorage(this.state.repoList);
    }
  }

  //Sets the URL based on what the user is inputted.
  handleChange = (event) => {
    this.setState({ url: event.target.value });
  };

  /**
   * Opens the release notes for the clicked repo. Will search if another repo is opened and set it to close. Opening and
   * closing is based on the state.
   * @param repo
   */
  openReleaseNotes = (repo) => {
    const openIndex = this.state.repoList.findIndex(
      (element) => element.repo === repo
    );

    const closeIndex = this.state.repoList.findIndex(
      (element) => element.open === true
    );

    let newArray = [...this.state.repoList];
    newArray[openIndex] = {
      ...newArray[openIndex],
      seen: true,
      open: !this.state.repoList[openIndex].open,
    };

    if (closeIndex != -1) {
      newArray[closeIndex] = {
        ...newArray[closeIndex],
        seen: true,
        open: !this.state.repoList[closeIndex].open,
      };
    }
    this.setState({
      repoList: newArray,
    });
  };

  /**
   * When a user clicks submit the event object is passed here and the function is invoked. The function will determine if the
   * passed url is valid by using helper functions in Util.ts; if conditions passed then repo information is pulled from Github API.
   * @param event - The event object from clicking submit
   */
  addRepo = async (event) => {
    event.preventDefault();
    document.getElementById("form-list").reset();
    if (!this.state.url) return null;

    const [org, repo] = parseUrl(this.state.url);
    if (org === null || repo === null) return null;

    //Check if repo already exists in the list. If repo is in the list don't add it and alert user.
    const foundRepo =
      this.state.repoList === undefined
        ? null
        : this.state.repoList.findIndex((element) => element.repo === repo);
    if (
      (foundRepo !== -1 || foundRepo === null) &&
      this.state.repoList !== undefined
    )
      return alert("Already tracking this repo");

    let repoData = await fetchRepoRelease(org, repo);
    if (repoData === null || repoData === undefined || repoData.length === 0) {
      repoData = await fetchRepoCommit(org, repo);
    }

    if (this.state.repoList === undefined) {
      this.setState({
        url: "",
        repoList: [
          {
            repo: repo,
            org: org,
            seen: false,
            open: false,
            data: repoData,
          },
        ],
      });
    } else
      this.setState({
        url: "",
        repoList: [
          ...this.state.repoList,
          {
            repo: repo,
            org: org,
            seen: false,
            open: false,
            data: repoData,
          },
        ],
      });
  };

  //Toggle edit button to delete repos
  editRepoList = () => {
    this.setState({ ...this.state, edit: !this.state.edit });
  };

  /**
   * Deletes repo from the repo list.
   * @param repo
   */
  deleteRepo = (repo) => {
    const closeIndex = this.state.repoList.findIndex(
      (element) => element.repo === repo
    );

    let newArray = [...this.state.repoList];
    newArray.splice(closeIndex, 1);

    this.setState({
      ...this.state,
      repoList: newArray,
      edit: newArray.length === 0 ? false : true,
    });
  };

  render() {
    return (
      <div className="App">
        <div className="App-Name">
          <h1>Repo Release Viewer</h1>
        </div>
        <div className="column-sm">
          <form id="form-list" className="add-repo" onSubmit={this.addRepo}>
            <input
              type="text"
              value={this.state.value}
              onKeyUp={this.handleChange}
              placeholder="Add URL to track repository"
            />
            <input id="submit-repo" type="submit" value="Submit" />
          </form>
          {this.state.repoList && this.state.repoList.length > 0 ? (
            <div className="repo-list">
              <div className="edit">
                <button onClick={this.editRepoList}>
                  {this.state.edit ? "Done" : "Edit"}
                </button>
              </div>
              {this.state.repoList.map((list, index) => {
                if (list != undefined)
                  return (
                    <Card
                      org={list.org}
                      repo={list.repo}
                      seen={list.seen}
                      data={list.data}
                      openNotes={list.open}
                      openReleaseNotes={this.openReleaseNotes.bind(this)}
                      deleteRepo={this.deleteRepo.bind(this)}
                      edit={this.state.edit}
                      key={index}
                    />
                  );
                else return null;
              })}
            </div>
          ) : (
            <div className="no-repo">
              <h3>Not tracking any repo :(</h3>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
