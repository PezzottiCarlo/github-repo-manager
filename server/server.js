const Github = require('./github.js');
const config = require('./config.json');
const express = require('express');
const app = express();
const cors = require('cors');

const HOME_DIR = require('os').homedir();
const REPOS_PATH = `${HOME_DIR}/Documents/Projects/`;
let username = config.username;

const github = new Github(config.username,config.token,REPOS_PATH);

app.use(cors());

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
})

app.get('/getList', async (req, res) => {
    let repos = await github.getReposList();
    res.send(repos);
})