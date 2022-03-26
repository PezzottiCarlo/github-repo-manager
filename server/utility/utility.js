const fs = require('fs');
const shell = require('shelljs')

class Utility {
    static getKeepUpdate() {
        return JSON.parse(fs.readFileSync('./config/keepUpdated.json', 'utf-8'));
    }
    static setKeepUpdate(data) {
        fs.writeFileSync('./config/keepUpdated.json', JSON.stringify(data))
    } 
}

module.exports = Utility;