import Axios from "axios";

interface Repo {
  repo: string;
  org: string;
  seen: false;
}

interface State {
  repoList: Repo[];
}

export const parseUrl = (url: string) => {
  let org, repo, newUrl;
  if (url.includes("https://github.com/")) {
    newUrl = url.replace("https://github.com/", "");
    org = newUrl.substring(0, newUrl.indexOf("/"));
    repo = newUrl.substring(newUrl.indexOf("/") + 1, newUrl.length);
    return [org, repo];
  } else {
    return null;
  }
};

export const fetchRepoRelease = async (org: string, repo: Repo) => {
  let response;

  try {
    await Axios.get(
      `https://api.github.com/repos/${org}/${repo}/releases`
    ).then((resp) => {
      response = resp.data;
    });
    return response;
  } catch (error) {
    alert("Repo not found!");
  }
};

export const fetchRepoCommit = async (org: string, repo: Repo) => {
  let response;

  try {
    await Axios.get(`https://api.github.com/repos/${org}/${repo}/commits`).then(
      (resp) => {
        response = resp.data;
      }
    );
    return response;
  } catch (error) {
    console.log("No commits found");
  }
};

export const saveToLocalStorage = (repoList: State) => {
  localStorage.setItem("RepoTracking", JSON.stringify(repoList));
};
