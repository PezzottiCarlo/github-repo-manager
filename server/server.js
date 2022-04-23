const express = require('express');
const cors = require('cors');

const Github = require('./utility/github.js');
const Utility = require('./utility/utility.js');
const config = require('./config/config.js');
let keepUpdateTmp = Utility.getKeepUpdate();


const app = express();


const github = new Github(config.username, config.token, config.repos_path);

app.use(express.json())
app.use(cors());
app.use("/", express.static("../build"))

app.listen(config.port, async () => {
    github.cloneRepo("wabba-screensaver")
    console.log(`Server running on port ${config.port}`);
})

app.get('/getList', async (req, res) => {
    let repos = await github.getReposList();
    res.send(repos);
})

app.get('/isBuildable/:repo', async (req, res) => {
    let repoName = req.params.repo;
    res.send(await github.isBuildable(repoName));
})

app.get('/getInfo/:repo', async (req, res) => {
    let repoName = req.params.repo;
    let downloaded = await github.isRepoDownloaded(repoName);
    let updated = await github.isLocalRepoUpdated(repoName);
    let buildable = await github.isBuildable(repoName);
    let keepUpdate = (keepUpdateTmp[repoName] === undefined) ? false : keepUpdateTmp[repoName].state;
    res.send({ downloaded, updated, buildable, keepUpdate });
})

app.get('/pull/:repo', async (req, res) => {
    let repoName = req.params.repo;
    console.log("Pulling repo: " + repoName);
    if (github.isRepoDownloaded(repoName)) {
        if (await github.pullRepo(repoName))
            res.send({ success: true });
        else
            res.send({ success: false, message: "Error while pulling repo" });
    }
    else res.send({ success: false, message: "Repo not downloaded" });
})

app.get('/download/:repo', async (req, res) => {
    let repoName = req.params.repo;
    if (!github.isRepoDownloaded(repoName)) {
        console.log("Downloading repo: " + repoName);
        if (await github.cloneRepo(repoName))
            res.send({ success: true });
        else
            res.send({ success: false, message: "Error while downloading repo" });
    }
    else res.send({ success: false, message: "Repo already downloaded" });
})

app.get('/build/:repo', async (req, res) => {
    let repoName = req.params.repo;
    console.log("Building repo: " + repoName);
    if (github.isRepoDownloaded(repoName)) {
        if (await github.isBuildable(pushedInfo.repository.name)) {
            if (await github.buildRepo(repoName))
                res.send({ success: true });
            else
                res.send({ success: false, message: "Error while building repo" });
        }
    }
    else res.send({ success: false, message: "Repo not downloaded" });
})

app.get('/keepUpdate/:repo/:flag', async (req, res) => {
    let hook;
    let kUFlag = req.params.flag === 'true';
    if (!keepUpdateTmp[req.params.repo]) {
        hook = await github.setWebhook(req.params.repo, config.payloadUrl, kUFlag, config.token);
        if (hook.errors) {
            console.log(hook.errors);
            res.json({ success: false, message: "Error while setting webhook" });
            return
        } else {
            keepUpdateTmp[req.params.repo] = {};
            let tmp = {
                state: kUFlag,
                hookId: hook.id
            }
            keepUpdateTmp[req.params.repo] = tmp;
        }
    } else {
        keepUpdateTmp[req.params.repo].state = kUFlag;
    }
    Utility.setKeepUpdate(keepUpdateTmp);
    res.json({ success: true });
})


//TO DO: check whether the signature on the request is correct
app.post('/github', async (req, res) => {
    const hmac = req.headers['x-hub-signature-256'];
    const verified = github.verifySignature(JSON.stringify(req.body), hmac);
    if (verified) {
        let pushedInfo = req.body
        if (pushedInfo && pushedInfo.repository) {
            if (keepUpdateTmp[pushedInfo.repository.name] && keepUpdateTmp[pushedInfo.repository.name].state) {
                console.log("Updating...", pushedInfo.repository.name);
                await github.pullRepo(pushedInfo.repository.name);
                console.log("Search a build configuration...");
                if (await github.isBuildable(pushedInfo.repository.name)) {
                    if (await github.buildRepo(pushedInfo.repository.name))
                        console.log("Build successfull");
                    else {
                        console.log("Build failed");
                        res.sendStatus(500);
                        return;
                    }
                } else {
                    console.log('Not buildable');
                }
                console.log("Updated");
            }
        } else {
            console.log("No repository info");
        }
        res.sendStatus(200);
    } else {
        console.log("Signature not verified");
        res.sendStatus(403);
    }
})

