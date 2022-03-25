const fs = require('fs');

class Utility {
    static getKeepUpdate(){
        return JSON.parse(fs.readFileSync('./config/keepUpdated.json', 'utf-8'));
    }
}

module.exports = Utility;