const fs = require('fs');
const shell = require('shelljs')

class Utility {
    static getKeepUpdate() {
        return JSON.parse(fs.readFileSync('./config/keepUpdated.json', 'utf-8'));
    }
    static setKeepUpdate(data) {
        fs.writeFileSync('./config/keepUpdated.json', JSON.stringify(data))
    }
    static buildRepo(build) {
        for (let step of build.commands) {
            let { stdout, stderr, code } =shell.exec("pwd", { silent: true })
            console.log(stdout);
            if (step.includes('cd')) shell.cd(step.split("cd ")[1], { silent: true })
            else shell.exec(step, { silent: true })
        }
    }
}

module.exports = Utility;