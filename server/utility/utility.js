const fs = require('fs');
const shell = require('shelljs')

class Utility {
    static getKeepUpdate() {
        if (fs.existsSync('./config/keepUpdated.json')) {
            let data = fs.readFileSync('./config/keepUpdated.json');
            try {
                return JSON.parse(data);
            } catch (e) {
                return {};
            }
        }
        else
            return {};
    }
    static setKeepUpdate(data) {
        fs.writeFileSync('./config/keepUpdated.json', JSON.stringify(data))
    }
}

module.exports = Utility;