import "./Repo.css";
import { useEffect,useState} from "react";
import { MdRecycling,MdOutlineDownloading,MdOutlineBuildCircle,MdUpdate} from 'react-icons/md';
import {CgGitPull} from 'react-icons/cg';
import {FaGithub} from 'react-icons/fa';
import Utility from "./Utility";

const Repo = (props) => {

    const [repoKeepUpdate, setKeepUpdate] = useState(props.repo.keepUpdate);
    const [htmlUrl, setHtmlUrl] = useState(props.repo.htmlUrl);
    const [repoName, setRepoName] = useState(props.repo.name);
    const [repoUpdated, setRepoUpdated] = useState(props.repo.updated);
    const [repoDownloaded, setRepoDownloaded] = useState(props.repo.downloaded);
    const [repoBuildInfo, setRepoBuildInfo] = useState(props.repo.buildInfo);


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
        else {setRepoDownloaded(true);setRepoUpdated(true);}
    }
    const clickPull = async (e) => {
        let result = await Utility.pull(props.repo.name);
        if(!result.success) alert(result.message);
        else {setRepoUpdated(true);setRepoDownloaded(true);}
    }
    const clickBuild = async (e) => {
    }

    

    return (
        <div className="repo">
            <div className="repo-name">
                <FaGithub />
                <a className="repo-link" href={htmlUrl}>{repoName}</a>
                {(!repoUpdated)?<MdUpdate className="repo-out-of-date"/>:null}
            </div>
            <div className="repo-action">
                {(Object.keys(repoBuildInfo).length === 0)?null:<MdOutlineBuildCircle className="repo-icon build" onClick={clickBuild}/>}
                <MdRecycling className={`repo-icon ${(repoKeepUpdate)?"keepUpdate":"inactive"}`} onClick={clickKeepUpdate}/>
                {(repoDownloaded)?<CgGitPull className="repo-icon update" onClick={clickPull}/>:<MdOutlineDownloading className="repo-icon download" onClick={clickDownload}/>}   
            </div>
        </div>
    );
}

export default Repo;