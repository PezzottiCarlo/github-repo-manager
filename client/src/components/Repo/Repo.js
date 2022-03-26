import "./Repo.css";
import { useEffect, useState } from "react";
import { MdOutlineBuildCircle, MdUpdate } from 'react-icons/md';
import { RiDownloadCloudFill } from 'react-icons/ri';
import { FaGithub } from 'react-icons/fa';
import { AiOutlineCloudSync } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Utility from "./Utility";

const Repo = (props) => {

    const [repoKeepUpdate, setKeepUpdate] = useState(props.repo.keepUpdate);
    const [htmlUrl, setHtmlUrl] = useState(props.repo.htmlUrl);
    const [repoName, setRepoName] = useState(props.repo.name);
    const [repoUpdated, setRepoUpdated] = useState(props.repo.updated);
    const [repoDownloaded, setRepoDownloaded] = useState(props.repo.downloaded);
    const [repoIsBuildable, setBuildable] = useState(props.repo.buildable);


    useEffect(() => {
    }, [])

    const clickKeepUpdate = async (e) => {
        let result = await Utility.keepUpdate(repoName, !repoKeepUpdate);
        console.log(result);
        if (result.statusCode === 0) {
            setKeepUpdate(!repoKeepUpdate);
        }
    }
    const clickDownload = async (e) => {
        let result = await Utility.download(repoName);
        if (!result.success) alert(result.message);
        else { setRepoDownloaded(true); setRepoUpdated(true); toast(`${repoName} downloaded`, { type: 'success' }); }
    }
    const clickPull = async (e) => {
        let result = await Utility.pull(repoName);
        if (!result.success) alert(result.message);
        else { setRepoUpdated(true); setRepoDownloaded(true); toast(`${repoName} pulled`, { type: 'success' }); }
    }
    const clickBuild = async (e) => {
        let promise = new Promise(async (resolve, reject) => {
            let result = await Utility.build(repoName);
            if (!result.success) {
                reject(result.message);
            } else {
                resolve();
            }
        })
        toast.promise(promise,
            {
                pending: `${repoName} building`,
                success: `${repoName} built`,
                error: (error) => `${repoName} build failed: ${error}`,
            })
    }



    return (
        <div>
            <div className="repo">
                <div className="repo-name">
                    <FaGithub />
                    <a className="repo-link" href={htmlUrl}>{repoName}</a>
                    {(!repoUpdated) ? <MdUpdate className="repo-out-of-date" /> : null}
                </div>
                <div className="repo-action">
                    {(repoIsBuildable) ? <MdOutlineBuildCircle className="repo-icon build" onClick={clickBuild} /> : null}
                    <AiOutlineCloudSync className={`repo-icon ${(repoKeepUpdate) ? "keepUpdate" : "inactive"}`} onClick={clickKeepUpdate} />
                    {(repoDownloaded) ? <MdUpdate className="repo-icon update" onClick={clickPull} /> : <RiDownloadCloudFill className="repo-icon download" onClick={clickDownload} />}
                </div>
            </div>
            <ToastContainer
                theme="dark"
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}

export default Repo;