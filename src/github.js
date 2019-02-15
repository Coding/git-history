import obj2EncodeQueryString from './utils/obj-to-encode-query-string';
import { getOAuthURL, getOAuthAccessTokenURL } from './utils/oauth';
import joinPath from 'join-path';

const TOKEN_KEY = 'github-token';

const CLIENT_ID = process.env.CLIENT_ID || 'ae1a676844d6257f82faa0713fb52e08';
const CLIENT_SECRET =
  process.env.CLIENT_SECRET || '2f4f508ff8750bde7462da52565ac4b493b23448';

export function isLoggedIn() {
  return !!window.localStorage.getItem(TOKEN_KEY);
}

async function getContent(username, repo, sha, path) {
  const token = window.localStorage.getItem(TOKEN_KEY);
  const contentResponse = await fetch(
    `/api/user/${username}/project/${
    repo.split('/')[1]
    }/git/blob/${sha}${encodeURIComponent(path)}?access_token=${token}`,
  );

  if (!contentResponse.ok) {
    throw contentResponse;
  }
  const contentJson = await contentResponse.json();
  return { content: contentJson.data.file.data, url: '' };
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
  );

  if (!commitsResponse.ok) {
    throw commitsResponse;
  }
  const commitsJson = await commitsResponse.json();
  if (commitsJson.code !== 0) {
    if (commitsJson.code === 1400 || commitsJson.code === 3016) {
      return { status: 404 };
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
    .sort(function (a, b) {
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
  const oauthParams = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
  };
  const oauthReponse = await fetch(
    joinPath(getOAuthAccessTokenURL(), obj2EncodeQueryString(oauthParams))
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
  return new Promise(() => {
    const redirect_uri = window.location.href;
    window.localStorage.setItem('redirect_uri', window.location.href);

    const oauthParams = {
      scope: 'all',
      redirect_uri,
      response_type: 'code',
      client_id: CLIENT_ID,
    };

    console.info(
      joinPath(getOAuthURL(), obj2EncodeQueryString(oauthParams)))
    // window.location.href = joinPath(getOAuthURL(), obj2EncodeQueryString(oauthParams));
  });
}
