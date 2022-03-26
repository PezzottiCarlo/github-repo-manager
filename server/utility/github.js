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
        if (!fs.existsSync(reposPath)) {
            shell.mkdir(reposPath);
        }
    }

    async getReposList() {
        const response = await fetch(`${API_BASE_LINK}/search/repositories?q=user:${this.username}`, {
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
        let current = shell.pwd();
        let link = `${GITHUB_BASE_LINK}/${this.username}/${repoName}`;
        shell.cd(this.reposPath);
        const { stdout, stderr, code } = shell.exec(`git clone ${link}`, { silent: true })
        shell.cd(current);
        if (code !== 0) {
            console.log(stderr);
            return false;
        }
        return true;
    }

    async pullRepo(repoName) {
        let current = shell.pwd();
        shell.cd(`${this.reposPath}${repoName}`);
        const { stdout, stderr, code } = shell.exec(`git pull`, { silent: true })
        shell.cd(current);
        if (code !== 0) {
            console.log(stderr);
            return false;
        }
        return true;
    }

    async isLocalRepoUpdated(repoName) {
        let current = shell.pwd();
        if (fs.existsSync(`${this.reposPath}${repoName}`)) {
            shell.cd(`${this.reposPath}${repoName}`);
            const { stdout, stderr, code } = shell.exec(`git remote show origin | grep "out of date" | wc -l`, { silent: true })
            shell.cd(current);
            return Number(stdout.trim()) === 0;
        }
        return false;
    }

    async isBuildable(repoName) {
        const response = await fetch(`${API_BASE_LINK}/repos/${this.username}/${repoName}/contents/build.json`, {
            headers: {
                'Authorization': `token ${this.token}`,
                'User-Agent': 'node.js',
                'Content-Type': 'application/json'
            }
        });
        const buildinfo = await response.json();
        return buildinfo.download_url !== undefined;
    }

    async getBuildingInfo(repoName) {
        const response = await fetch(`${API_BASE_LINK}/repos/${this.username}/${repoName}/contents/build.json`, {
            headers: {
                'Authorization': `token ${this.token}`,
                'User-Agent': 'node.js',
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 200) {
            return {};
        } else {
            const buildinfo = await response.json();
            const res = await fetch(buildinfo.download_url, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'User-Agent': 'node.js',
                    'Content-Type': 'application/json'
                }
            });
            return await res.json();
        }
    }

    async updateWebhook(repoName,id, payloadUrl, state) {
        const response = await fetch(`${API_BASE_LINK}/repos/${this.username}/${repoName}/hooks/${id}/config`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${this.token}`,
                'User-Agent': 'node.js',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'web',
                active: state,
                events: ['push'],
                config: {
                    url: payloadUrl,
                    content_type: 'json'
                }
            })
        });
        return await response.json();
    }

    async setWebhook(repoName, payloadUrl, state) {
        const response = await fetch(`${API_BASE_LINK}/repos/${this.username}/${repoName}/hooks`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${this.token}`,
                'User-Agent': 'node.js',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'web',
                active: state,
                events: ['push'],
                config: {
                    url: payloadUrl,
                    content_type: 'json'
                }
            })
        });
        return await response.json();
    }

    async getWebhook(repoName) {
        const response = await fetch(`${API_BASE_LINK}/repos/${this.username}/${repoName}/hooks`, {
            headers: {
                'Authorization': `token ${this.token}`,
                'User-Agent': 'node.js',
                'Content-Type': 'application/json'
            }
        });
        const hooks = await response.json();
        return hooks.find(hook => hook.name === 'web');
    }

    isRepoDownloaded(repoName) {
        let repos = fs.readdirSync(this.reposPath);
        return repos.includes(repoName);
    }

    async buildRepo(repoName) {
        if (fs.existsSync(`${this.reposPath}${repoName}`)){
            shell.cd(`${this.reposPath}${repoName}`);
            let buildInfo = await this.getBuildingInfo(repoName);
            for (let step of buildInfo.commands) {
                if (step.includes('cd')) {
                    let { stderr, stdout, code } = shell.cd(step.split("cd ")[1], { silent: true })
                    if (code != 0){
                        return false;
                    }
                }
                else {
                    let { stderr, stdout, code } = shell.exec(step, { silent: true })
                    if (code != 0){
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }
}

module.exports = Github;

