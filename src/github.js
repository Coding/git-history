import netlify from "netlify-auth-providers";
import { Base64 } from "js-base64";
const TOKEN_KEY = "github-token";


function getHeaders() {
  const token = window.localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `bearer ${token}` } : {};
}

export function isLoggedIn() {
  return !!window.localStorage.getItem(TOKEN_KEY);
}



async function getContent(repo, sha, path) {
  const contentResponse = await fetch(
    `/api/user/codingcorp/project/${repo.split('/')[1]}/git/blob/${sha}${encodeURIComponent(path)}`,
    { headers: getHeaders(),credentials: 'include' }
  );

  if (!contentResponse.ok) {
    throw contentResponse;
  }
  const contentJson = await contentResponse.json();
    return { content:contentJson.data.file.data, url: '' };

}

export async function getCommits(repo, sha, path, top = 10) {

  const commitsResponse = await fetch(
    `/api/user/codingcorp/project/${repo.split('/')[1]}/git/commits/${sha}${path}?page=1&pageSize=${top}`,
    { headers: getHeaders(), credentials: 'include' }
  );


  if (!commitsResponse.ok) {
    throw commitsResponse;
  }
  const commitsJson = await commitsResponse.json();


    const commits = commitsJson.data.commits.list.slice(0,top).map(commit=>({
        sha:commit.commitId,
        date: new Date(commit.commitTime),
        author:{
            login:commit.committer.name,
            avatar:commit.committer.avatar,
        },
        message:commit.rawMessage,
    })).sort(function(a, b) {
        return a.date - b.date;
      });


  await Promise.all(
    commits.map(async commit => {
      const info = await getContent(repo, commit.sha, path);
      commit.content = info.content;
      commit.fileUrl = info.url;
    })
  );

  return commits;
}

export function auth() {
  return new Promise((resolve, reject) => {
    var authenticator = new netlify({
      site_id: "ccf3a0e2-ac06-4f37-9b17-df1dd41fb1a6"
    });
    authenticator.authenticate({ provider: "github", scope: "repo" }, function(
      err,
      data
    ) {
      if (err) {
        reject(err);
      }
      window.localStorage.setItem(TOKEN_KEY, data.token);
      resolve(data);
    });
  });
}
