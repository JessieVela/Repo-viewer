import Axios from "axios";

interface Repo {
  repo: string;
  org: string;
  seen: false;
}

interface State {
  repoList: Repo[];
}

/**
 * Checks if the URL is a valid URL. It must contain 'https://github.com/' to be valid.
 * @param url
 */
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

/**
 * Async function that retrieves the release information for a specific repo.
 * @param org
 * @param repo
 */
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

/**
 * Repos that don't have a release version we retrieve the last commit date for that repo
 * @param org
 * @param repo
 */
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

/**
 * Save to local storage the repo list.
 * @param repoList
 */
export const saveToLocalStorage = (repoList: State) => {
  localStorage.setItem("RepoTracking", JSON.stringify(repoList));
};
