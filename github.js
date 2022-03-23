const fetch = require('node-fetch');
const config = require('./config.json');

class Github {
    constructor(username, token) {
        this.username = username;
        this.token = token;
    }

    async getReposList() {
        const response = await fetch(`https://api.github.com/users/${this.username}/repos`,{
            headers: {
                'Authorization': `token ${this.token}`,
                'User-Agent': 'node.js',
                'Content-Type': 'application/json'
            }
        });
        const repos = await response.json();
        return repos;
    }
}
async function main() {
    const github = new Github('PezzottiCarlo', config.token);
    const repos = await github.getReposList();
    for(let repo of repos) {
        console.log(repo.name);
    }
}
main()