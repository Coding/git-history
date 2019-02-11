import React from 'react';
import History from './history';
import Landing from './landing';
import {
  getUrlParams,
  useLanguageLoader,
  useCommitsFetcher,
  useDocumentTitle,
  Loading,
  Error,
} from './app-helpers';
import {oauth} from './github';
import queryString from 'query-string';

const cli = window._CLI;

export default function App() {
  if (cli) {
    return <CliApp data={cli} />;
  }

  const [username, repo, sha, path] = getUrlParams();
  if (window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      oauth(code);
    }
  }

  if (!repo) {
    return <Landing />;
  } else {
    return <GitHubApp username={username} repo={repo} sha={sha} path={path} />;
  }
}

function CliApp({data}) {
  let {commits, path} = data;

  const fileName = path.split('/').pop();
  useDocumentTitle(`Git History - ${fileName}`);

  commits = commits.map(commit => ({...commit, date: new Date(commit.date)}));
  const [lang, loading, error] = useLanguageLoader(path);

  if (error) {
    return <Error error={error} />;
  }

  if (loading) {
    return <Loading path={path} />;
  }

  return <History commits={commits} language={lang} />;
}

function GitHubApp({username, repo, sha, path}) {
  const fileName = path.split('/').pop();
  useDocumentTitle(`Git History - ${fileName}`);

  const [lang, langLoading, langError] = useLanguageLoader(path);

  const parsed = queryString.parse(window.location.search);

  const [commits, commitsLoading, commitsError] = useCommitsFetcher({
    username,
    repo,
    sha,
    path,
    pageSize: parsed.pageSize || 10,
    page: parsed.page || 1,
  });

  const loading = langLoading || commitsLoading;
  const error = langError || commitsError;

  if (error) {
    return <Error error={error} />;
  }

  if (loading) {
    return <Loading repo={repo} path={path} />;
  }

  if (!commits.length) {
    return <Error error={{status: 404}} />;
  }

  return <History commits={commits} language={lang} />;
}
