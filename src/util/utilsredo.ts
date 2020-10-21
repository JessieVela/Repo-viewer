import Axios from "axios";

interface RepoList {
  list: [
    {
      repo: string,
      org: string,
      seen: boolean
    }
  ]
}

export const parseUrl = (url: string) => {
  let org, repo, newUrl;
  if (url.includes("https://github.com/")) {
    newUrl = url.replace("https://github.com/", "");
    org = newUrl.substring(0, newUrl.indexOf("/"));
    repo = newUrl.substring(newUrl.indexOf("/") + 1, newUrl.length);
    return { org, repo };
  } else {
    return null;
  }
};

export const fetchRepoRelease = async (org: string, repo: string) => {
  let response;

  try {
    await Axios.get(
      `https://api.github.com/repos/${org}/${repo}/releases`
    ).then((resp) => {
      response = resp.data;
    });
    return response;
  } catch (error) {
    console.log("Error getting repo!");
  }
};