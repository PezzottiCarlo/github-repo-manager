const fetch = require('node-fetch');
const shell = require('shelljs')
const fs = require('fs');
const config = require('./config.json');

const API_BASE_LINK = 'https://api.github.com';
const GITHUB_BASE_LINK = 'https://github.com';
const REPOS_PATH = '~/Documents/Projects/';

class Github {
    constructor(username, token) {
        this.username = username;
        this.token = token;
        if(!fs.existsSync(REPOS_PATH)) {
            shell.mkdir(REPOS_PATH);
        }
    }

    async getReposList() {
        const response = await fetch(`${API_BASE_LINK}/search/repositories?q=user:${this.username}`,{
            headers: {
                'Authorization': `token ${this.token}`,
                'User-Agent': 'node.js',
                'Content-Type': 'application/json'
            }
        });
        const repos = await response.json();
        return repos;
    }

    async cloneRepo(repoName) {
        let link = `${GITHUB_BASE_LINK}/${this.username}/${repoName}`;
        shell.cd(REPOS_PATH);
        const { stdout, stderr, code } = shell.exec(`git clone ${link}`, { silent: true })
        if(code !== 0) {
            console.log(stderr);
            return false;
        }
        return true;
    }
}
async function main() {
    const github = new Github('PezzottiCarlo', config.token);
    const repos = await github.getReposList();
    for(let repo of repos.items) {
        if(await github.cloneRepo(repo.name)){
            console.log(`${repo.name} cloned successfully`);
        }
    }
}
main()