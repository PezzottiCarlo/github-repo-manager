const fs = require('fs');
const shell = require('shelljs')

class Utility {
    static getKeepUpdate() {
        return JSON.parse(fs.readFileSync('./config/keepUpdated.json', 'utf-8'));
    }
    static setKeepUpdate(data) {
        fs.writeFileSync('./config/keepUpdated.json', JSON.stringify(data))
    }
    static buildRepo(build){
        for(let step of build){
            console.log(step);
            const { stdout, stderr, code } = shell.exec(step,{silent:true});
            if(code!==0){
                console.log(stderr);
                return false;
            }
        }
    }
}

module.exports = Utility;