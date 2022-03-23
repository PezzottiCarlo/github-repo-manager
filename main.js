const github = require('./github.js');

const main = async () => {
    let repos = await github.getReposList();
    for(let repo of repos.items) {
        if(!fs.existsSync(`${REPOS_PATH}${repo.name}`)) {
            await github.cloneRepo(repo.name);
        }else{
            
        }
    }
}