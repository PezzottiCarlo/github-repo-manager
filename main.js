const Github = require('./github.js');
const config = require('./config.json');
const fs = require('fs');

const HOME_DIR = require('os').homedir();
const REPOS_PATH = `${HOME_DIR}/Documents/Projects/`;

const main = async () => {
    const github = new Github("PezzottiCarlo",config.token,REPOS_PATH);
    let repos = await github.getReposList();
    for(let repo of repos.items) {
        let buildInfo = await github.getBuildingInfo(repo.name);
        if(buildInfo !== -1) {
            console.log(buildInfo)
        }
    }
}

main();