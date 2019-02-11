import {Query} from './utils';
import {Base64} from 'js-base64';
const TOKEN_KEY = 'github-token';

const baseUrl = 'https://coding.net';
const CODING_URL = {
  oauth: baseUrl + '/oauth_authorize.html',
  access_token: baseUrl + '/api/oauth/access_token',
  base: baseUrl,
  client_id: 'ae1a676844d6257f82faa0713fb52e08',
  client_secret: '2f4f508ff8750bde7462da52565ac4b493b23448',
};
const REDIRECT_URI = 'http://127.0.0.1:3000';

function getHeaders() {
  const token = window.localStorage.getItem(TOKEN_KEY);
  return token ? {Authorization: `bearer ${token}`} : {};
}

export function isLoggedIn() {
  return !!window.localStorage.getItem(TOKEN_KEY);
}

async function getContent(username, repo, sha, path) {
  const token = window.localStorage.getItem(TOKEN_KEY);
  const contentResponse = await fetch(
    `/api/user/${username}/project/${
      repo.split('/')[1]
    }/git/blob/${sha}${encodeURIComponent(path)}?access_token=${token}`,
    {headers: getHeaders(), credentials: 'include'},
  );

  if (!contentResponse.ok) {
    throw contentResponse;
  }
  const contentJson = await contentResponse.json();
  return {content: contentJson.data.file.data, url: ''};
}

export async function getCommits(
  username,
  repo,
  sha,
  path,
  page = 1,
  pageSize = 10,
) {
  const token = window.localStorage.getItem(TOKEN_KEY);
  const commitsResponse = await fetch(
    `/api/user/${username}/project/${
      repo.split('/')[1]
    }/git/commits/${sha}${path}?page=${page}&pageSize=${pageSize}&access_token=${token}`,
    {headers: getHeaders(), credentials: 'include'},
  );

  if (!commitsResponse.ok) {
    throw commitsResponse;
  }
  const commitsJson = await commitsResponse.json();
  if (commitsJson.code !== 0) {
    if (commitsJson.code === 1400 || commitsJson.code === 3016) {
      return {status: 404};
    }
  }

  const commits = commitsJson.data.commits.list
    .slice(0, pageSize)
    .map(commit => ({
      sha: commit.commitId,
      date: new Date(commit.commitTime),
      author: {
        login: commit.committer.name,
        avatar: commit.committer.avatar,
      },
      message: commit.rawMessage,
    }))
    .sort(function(a, b) {
      return a.date - b.date;
    });

  await Promise.all(
    commits.map(async commit => {
      const info = await getContent(username, repo, commit.sha, path);
      commit.content = info.content;
      commit.fileUrl = info.url;
    }),
  );

  return commits;
}

export async function oauth(code) {
  const oauthParams = Object.assign({
    client_id: CODING_URL.client_id,
    client_secret: CODING_URL.client_secret,
    grant_type: 'authorization_code',
    code,
  });
  const oauthReponse = await fetch(
    `${baseUrl}/api/oauth/access_token${Query.stringify(oauthParams)}`,
  );
  if (!oauthReponse.ok) {
    throw oauthReponse;
  }
  const oauthJson = await oauthReponse.json();
  const accessToken = oauthJson.access_token;
  console.log('accessToken', accessToken);
  window.localStorage.setItem(TOKEN_KEY, accessToken);
  const redirect_uri = window.localStorage.getItem('redirect_uri');
  if (redirect_uri) {
    window.localStorage.removeItem('redirect_uri');
    window.location.href = redirect_uri;
  }
}

export function auth() {
  return new Promise((resolve, reject) => {
    const oauthUri = CODING_URL.oauth;
    const redirect_uri = REDIRECT_URI || window.location.href;
    window.localStorage.setItem('redirect_uri', window.location.href);

    const oauthParams = Object.assign({
      scope: 'all',
      redirect_uri,
      response_type: 'code',
      client_id: CODING_URL.client_id,
    });

    const url = `${oauthUri}${Query.stringify(oauthParams)}`;
    window.location.href = url;
  });
}
