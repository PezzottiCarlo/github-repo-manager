
class Utility{

    static autoUpdate = async (repoName,flag) => {
        let res = await fetch(`autoUpdate/${repoName}/${flag}`);
        let data = await res.json();
        return data;
    } 
}

export default Utility;