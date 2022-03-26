
class Utility{

    static keepUpdate = async (repoName,flag) => {
        let res = await fetch(`keepUpdate/${repoName}/${flag}`);
        let data = await res.json();
        return data;
    } 

    static pull = async (repoName) => {
        let res = await fetch(`pull/${repoName}`);
        let data = await res.json();
        return data;
    }

    static download = async (repoName) => {
        let res = await fetch(`download/${repoName}`);
        let data = await res.json();
        return data;
    }
}

export default Utility;