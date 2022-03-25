
class Utility{

    static keepUpdate = async (repoName,flag) => {
        let res = await fetch(`keepUpdate/${repoName}/${flag}`);
        let data = await res.json();
        return data;
    } 
}

export default Utility;