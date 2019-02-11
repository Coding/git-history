import netlify from "netlify-auth-providers";
import { Base64 } from "js-base64";
const TOKEN_KEY = "github-token";

const mockCommits = {
    "code": 0,
    "data": {
        "path": "scripts/start.js",
        "ref": "master",
        "commits": {
            "list": [
                {
                    "fullMessage": "add login demo\n",
                    "shortMessage": "add login demo\n",
                    "allMessage": "",
                    "commitId": "61a800b45d126c1b17dbf5ea4cd4811a1794fae8",
                    "commitTime": 1535289374000,
                    "committer": {
                        "name": "陈信州",
                        "email": "chenxinzhou@coding.net",
                        "avatar": "https://dn-coding-net-production-static.codehub.cn/85c8f5f8-0855-4b28-99d5-20f766d4a0d0.jpg?imageMogr2/auto-orient/format/jpeg/crop/!378x378a82a0",
                        "link": "/u/chenxinzhou"
                    },
                    "notesCount": 0,
                    "rawMessage": "add login demo\n",
                    "marks": []
                },
                {
                    "fullMessage": "add basic folder\n",
                    "shortMessage": "add basic folder\n",
                    "allMessage": "",
                    "commitId": "ea19f3588960f289ebfea0edc1971d7a86e1606b",
                    "commitTime": 1535207396000,
                    "committer": {
                        "name": "陈信州",
                        "email": "chenxinzhou@coding.net",
                        "avatar": "https://dn-coding-net-production-static.codehub.cn/85c8f5f8-0855-4b28-99d5-20f766d4a0d0.jpg?imageMogr2/auto-orient/format/jpeg/crop/!378x378a82a0",
                        "link": "/u/chenxinzhou"
                    },
                    "notesCount": 0,
                    "rawMessage": "add basic folder\n",
                    "marks": []
                },
                {
                    "fullMessage": "fix prettier & tslint conflict ,then reformatt code\n",
                    "shortMessage": "fix prettier & tslint conflict ,then reformatt code\n",
                    "allMessage": "",
                    "commitId": "8d4e4e33c997fe645c17e8a80a9c06fc0ce5baad",
                    "commitTime": 1535187391000,
                    "committer": {
                        "name": "陈信州",
                        "email": "chenxinzhou@coding.net",
                        "avatar": "https://dn-coding-net-production-static.codehub.cn/85c8f5f8-0855-4b28-99d5-20f766d4a0d0.jpg?imageMogr2/auto-orient/format/jpeg/crop/!378x378a82a0",
                        "link": "/u/chenxinzhou"
                    },
                    "notesCount": 0,
                    "rawMessage": "fix prettier & tslint conflict ,then reformatt code\n",
                    "marks": []
                },
                {
                    "fullMessage": "add hunksy,prettier,lint staged for formatting code automatically\n",
                    "shortMessage": "add hunksy,prettier,lint staged for formatting code automatically\n",
                    "allMessage": "",
                    "commitId": "020db33633b21bfe75387e8635aaf9f6a4bcc112",
                    "commitTime": 1535125125000,
                    "committer": {
                        "name": "陈信州",
                        "email": "chenxinzhou@coding.net",
                        "avatar": "https://dn-coding-net-production-static.codehub.cn/85c8f5f8-0855-4b28-99d5-20f766d4a0d0.jpg?imageMogr2/auto-orient/format/jpeg/crop/!378x378a82a0",
                        "link": "/u/chenxinzhou"
                    },
                    "notesCount": 0,
                    "rawMessage": "add hunksy,prettier,lint staged for formatting code automatically\n",
                    "marks": []
                },
                {
                    "fullMessage": "init\n",
                    "shortMessage": "init\n",
                    "allMessage": "",
                    "commitId": "5f5d8688ebd68760f50afdb4d866bd05680f8a61",
                    "commitTime": 1535115931000,
                    "committer": {
                        "name": "陈信州",
                        "email": "chenxinzhou@coding.net",
                        "avatar": "https://dn-coding-net-production-static.codehub.cn/85c8f5f8-0855-4b28-99d5-20f766d4a0d0.jpg?imageMogr2/auto-orient/format/jpeg/crop/!378x378a82a0",
                        "link": "/u/chenxinzhou"
                    },
                    "notesCount": 0,
                    "rawMessage": "init\n",
                    "marks": []
                }
            ],
            "page": 1,
            "pageSize": 10,
            "totalPage": 0,
            "totalRow": 0
        }
    }
}

const contentMock = {
    "code": 0,
    "data": {
        "ref": "61a800b45d126c1b17dbf5ea4cd4811a1794fae8",
        "file": {
            "data": "'use strict';\n\n// Do this as the first thing so that any code reading it knows the right env.\nprocess.env.BABEL_ENV = 'development';\nprocess.env.NODE_ENV = 'development';\n\n// Makes the script crash on unhandled rejections instead of silently\n// ignoring them. In the future, promise rejections that are not handled will\n// terminate the Node.js process with a non-zero exit code.\nprocess.on('unhandledRejection', err => {\n    throw err;\n});\n\n// Ensure environment variables are read.\nrequire('../config/env');\n\nconst fs = require('fs');\nconst chalk = require('chalk');\nconst webpack = require('webpack');\nconst WebpackDevServer = require('webpack-dev-server');\nconst clearConsole = require('react-dev-utils/clearConsole');\nconst checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');\nconst {\n    choosePort,\n    createCompiler,\n    prepareProxy,\n    prepareUrls,\n} = require('react-dev-utils/WebpackDevServerUtils');\nconst openBrowser = require('react-dev-utils/openBrowser');\nconst paths = require('../config/paths');\nconst config = require('../config/webpack.config.dev');\nconst createDevServerConfig = require('../config/webpackDevServer.config');\n\nconst useYarn = fs.existsSync(paths.yarnLockFile);\nconst isInteractive = process.stdout.isTTY;\n\n// Warn and crash if required files are missing\nif (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {\n    process.exit(1);\n}\n\n// Tools like Cloud9 rely on this.\nconst DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;\nconst HOST = process.env.HOST || '0.0.0.0';\nconst API_HOST = process.env.API_HOST || 'http://127.0.0.1:8080';\n\nif (process.env.HOST) {\n    console.log(\n        chalk.cyan(\n            `Attempting to bind to HOST environment variable: ${chalk.yellow(\n                chalk.bold(process.env.HOST),\n            )}`,\n        ),\n    );\n    console.log(\n        `If this was unintentional, check that you haven't mistakenly set it in your shell.`,\n    );\n    console.log(`Learn more here: ${chalk.yellow('http://bit.ly/2mwWSwH')}`);\n    console.log();\n}\n\n// We attempt to use the default port but if it is busy, we offer the user to\n// run on a different port. `choosePort()` Promise resolves to the next free port.\nchoosePort(HOST, DEFAULT_PORT)\n    .then(port => {\n        if (port == null) {\n            // We have not found a port.\n            return;\n        }\n        const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';\n        const appName = require(paths.appPackageJson).name;\n        const urls = prepareUrls(protocol, HOST, port);\n        // Create a webpack compiler that is configured with custom messages.\n        const compiler = createCompiler(webpack, config, appName, urls, useYarn);\n        // Load proxy config\n        // const proxySetting = require(paths.appPackageJson).proxy;\n        const host = API_HOST.split('://')[1];\n        const proxySetting = host && {\n            '/api': {\n                target: API_HOST,\n                changeOrigin: true,\n                secure: false,\n            },\n        };\n        const proxyConfig = prepareProxy(proxySetting, paths.appPublic);\n        // Serve webpack assets generated by the compiler over a web sever.\n        const serverConfig = createDevServerConfig(proxyConfig, urls.lanUrlForConfig);\n        const devServer = new WebpackDevServer(compiler, serverConfig);\n        // Launch WebpackDevServer.\n        devServer.listen(port, HOST, err => {\n            if (err) {\n                return console.log(err);\n            }\n            if (isInteractive) {\n                clearConsole();\n            }\n            console.log(chalk.cyan('Starting the development server...\\n'));\n            openBrowser(urls.localUrlForBrowser);\n        });\n\n        ['SIGINT', 'SIGTERM'].forEach(function(sig) {\n            process.on(sig, function() {\n                devServer.close();\n                process.exit();\n            });\n        });\n    })\n    .catch(err => {\n        if (err && err.message) {\n            console.log(err.message);\n        }\n        process.exit(1);\n    });\n",
            "lang": "javascript",
            "size": 4053,
            "previewed": false,
            "lastCommitMessage": "add login demo\n",
            "lastCommitDate": 1535289374000,
            "lastAuthorDate": 1535289374000,
            "lastCommitId": "61a800b45d126c1b17dbf5ea4cd4811a1794fae8",
            "lastCommitter": {
                "name": "陈信州",
                "email": "chenxinzhou@coding.net",
                "avatar": "https://dn-coding-net-production-static.codehub.cn/85c8f5f8-0855-4b28-99d5-20f766d4a0d0.jpg?imageMogr2/auto-orient/format/jpeg/crop/!378x378a82a0",
                "link": "/u/chenxinzhou"
            },
            "mode": "file",
            "path": "scripts/start.js",
            "name": "scripts/start.js"
        },
        "isHead": false,
        "can_edit": false
    }
}

function getHeaders() {
  const token = window.localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `bearer ${token}` } : {};
}

export function isLoggedIn() {
  return !!window.localStorage.getItem(TOKEN_KEY);
}



async function getContent(repo, sha, path) {
//   const contentResponse = await fetch(
//     `https://codingcorp.coding.net/api/user/codingcorp/project/${repo.split('/')[1]}/git/blob/${sha}${encodeURIComponent(path)}`,
//     { headers: getHeaders() }
//   );

//   if (!contentResponse.ok) {
//     throw contentResponse;
//   }
//   const contentJson = await contentResponse.json();
//  return { content:contentJson.data.file.data, url: '' };

  return { content:contentMock.data.file.data, url: '' };
}

export async function getCommits(repo, sha, path, top = 10) {

// https://codingcorp.coding.net/api/user/codingcorp/project/coding-frontend/git/commits/master/README.md?page=1

// https://codingcorp.coding.net/api/user/codingcorp/project/${repo.split('/')[1]}/git/commits/${sha}/${path}?page=1

//   const commitsResponse = await fetch(
//     `https://codingcorp.coding.net/api/user/codingcorp/project/${repo.split('/')[1]}/git/commits/${sha}${path}?page=1`,
//     { headers: getHeaders() }
//   );
//   if (!commitsResponse.ok) {
//     throw commitsResponse;
//   }
//   const commitsJson = await commitsResponse.json();

    const commits = mockCommits.data.commits.list.slice(0,top).map(commit=>({
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



//   const commits = commitsJson
//     .slice(0, top)
//     .map(commit => ({
//       sha: commit.sha,
//       date: new Date(commit.commit.author.date),
//       author: {
//         login: commit.author ? commit.author.login : commit.commit.author.name,
//         avatar: commit.author
//           ? commit.author.avatar_url
//           : "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
//       },
//       commitUrl: commit.html_url,
//       message: commit.commit.message
//     }))
//     .sort(function(a, b) {
//       return a.date - b.date;
//     });

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
