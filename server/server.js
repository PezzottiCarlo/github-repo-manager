const Github = require('./github.js');
const config = require('./config.json');
let auto = [];
const express = require('express');
const app = express();
const cors = require('cors');

const HOME_DIR = require('os').homedir();
const REPOS_PATH = `${HOME_DIR}/Documents/Projects/`;
let username = config.username;

const github = new Github(config.username, config.token, REPOS_PATH);


app.use(cors());
app.use("/", express.static("../build"))

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
})

app.get('/getList', async (req, res) => {
    let repos = await github.getReposList();
    res.send(repos);
})

app.get('/getInfo/:repo', async (req, res) => {
    let repoName = req.params.repo;
    let updated = await github.isLocalRepoUpdated(repoName);
    let buildInfo = await github.getBuildingInfo(repoName);
    let keepUpdate = auto[repoName] || false;
    res.send({ updated, buildInfo,keepUpdate });
})

app.get('/autoUpdate/:repo/:flag', async (req, res) => {
    auto[req.params.repo] = req.params.flag==='true';
    console.log(auto);
    res.json({ statusCode: 0,status:auto[req.params.repo]});
})

app.post('/payload', async (req, res) => {
    let push = JSON.parse(req.body.read)
    console.log(push);
})