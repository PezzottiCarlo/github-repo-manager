const fetch = require('node-fetch');
const shell = require('shelljs')
const fs = require('fs');


const API_BASE_LINK = 'https://api.github.com';
const GITHUB_BASE_LINK = 'https://github.com';


class Github {
    constructor(username, token, reposPath) {
        this.username = username;
        this.token = token;
        this.reposPath = reposPath;
        if(!fs.existsSync(reposPath)) {
            shell.mkdir(reposPath);
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
        shell.cd(this.reposPath);
        const { stdout, stderr, code } = shell.exec(`git clone ${link}`, { silent: true })
        if(code !== 0) {
            console.log(stderr);
            return false;
        }
        return true;
    }

    async pullRepo(repoName) {
        shell.cd(`${this.reposPath}${repoName}`);
        const { stdout, stderr, code } = shell.exec(`git pull`, { silent: true })
        if(code !== 0) {
            console.log(stderr);
            return false;
        }
        return true;
    }

    async getLocalRepoInfo(repoName) {
        shell.cd(`${this.reposPath}${repoName}`);
        const { stdout, stderr, code } = shell.exec(`git status -s`, { silent: true })
    }

    async getBuildingInfo(repoName){
        let config = {};
        if(fs.existsSync(`${this.reposPath}${repoName}/build.json`)) {
            config = require(`${this.reposPath}${repoName}/build.json`);
            return config;
        }
        return -1;
    }

    
}

module.exports = Github;