import "./Repo.css";
import { useEffect,useState} from "react";
import { MdRecycling,MdOutlineDownloading,MdOutlineBuildCircle,MdUpdate} from 'react-icons/md';
import {CgGitPull} from 'react-icons/cg';
import {FaGithub} from 'react-icons/fa';
import Utility from "./Utility";

const Repo = (props) => {

    const [repoKeepUpdate, setKeepUpdate] = useState(props.repo.keepUpdate);

    useEffect(() => {
    },[])

    const clickKeepUpdate = async (e) => {
        let result = await Utility.keepUpdate(props.repo.name,!repoKeepUpdate);
        console.log(result);
        if(result.statusCode === 0){
            setKeepUpdate(!repoKeepUpdate);
        }
    }
    const clickDownload= async (e) => {
        let result = await Utility.download(props.repo.name);
        if(!result.success) alert(result.message);
    }
    const clickPull = async (e) => {
        let result = await Utility.pull(props.repo.name);
        if(!result.success) alert(result.message);
    }
    const clickBuild = async (e) => {
    }

    

    return (
        <div className="repo">
            <div className="repo-name">
                <FaGithub />
                <a className="repo-link" href={props.repo.html_url}>{props.repo.name}</a>
                {(!props.repo.updated)?<MdUpdate className="repo-out-of-date"/>:null}
            </div>
            <div className="repo-action">
                <MdRecycling className={`repo-icon ${(repoKeepUpdate)?"keepUpdate":"inactive"}`} onClick={clickKeepUpdate}/>
                <MdOutlineDownloading className="repo-icon download" onClick={clickDownload}/>
                <CgGitPull className="repo-icon update" onClick={clickPull}/>
                {(Object.keys(props.repo.buildInfo).length === 0)?null:<MdOutlineBuildCircle className="repo-icon build" onClick={clickBuild}/>}
            </div>
        </div>
    );
}

export default Repo;