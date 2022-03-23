const Github = require('./github.js');
const config = require('./config.json');
const fs = require('fs');


const REPOS_PATH = '~/Documents/Projects/';
const main = async () => {
    const github = new Github("PezzottiCarlo",config.token,REPOS_PATH);
    let repos = await github.getReposList();
    for(let repo of repos.items) {
        if(fs.existsSync(`${REPOS_PATH}${repo.name}`)) {
            if(await github.pullRepo(repo.name)){
                console.log(`${repo.name} pulled`);
            }
        }else{
            if(await github.cloneRepo(repo.name)){
                console.log(`${repo.name} cloned`);
            }
        }
    }
}

main();