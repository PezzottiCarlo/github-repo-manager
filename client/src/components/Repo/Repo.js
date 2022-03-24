import "./Repo.css";
import { useEffect,useState} from "react";
import { MdRecycling,MdOutlineDownloading,MdOutlineBuildCircle} from 'react-icons/md';
import {CgGitPull} from 'react-icons/cg';
import Utility from "./Utility";

const Repo = (props) => {

    const [repoBuild, setRepoBuild] = useState(props.repo.canBuild);
    const [repoAutoUpdate, setAutoUpdate] = useState(props.repo.keepUpdate);

    useEffect(() => {
        console.log(props.repo.keepUpdate);
    },[])

    const clickAutoUpdate = async (e) => {
        let result = await Utility.autoUpdate(props.repo.name,!repoAutoUpdate);
        console.log(result);
        if(result.statusCode === 0){
            setAutoUpdate(!repoAutoUpdate);
        }
    }
    const clickDownload= async (e) => {
    }
    const clickPull = async (e) => {
    }
    const clickBuild = async (e) => {
    }

    

    return (
        <div className="repo">
            <div className="repo-name">
                <a className="repo-link" href={props.repo.html_url}>{props.repo.name}</a>
            </div>
            <div className="repo-action">
                <MdRecycling className={`repo-icon ${(repoAutoUpdate)?"keepUpdate":"inactive"}`} onClick={clickAutoUpdate}/>
                <MdOutlineDownloading className="repo-icon download" onClick={clickDownload}/>
                <CgGitPull className="repo-icon update" onClick={clickPull}/>
                {(repoBuild)? <MdOutlineBuildCircle className="repo-icon build" onClick={clickBuild}/>:null}
            </div>
        </div>
    );
}

export default Repo;