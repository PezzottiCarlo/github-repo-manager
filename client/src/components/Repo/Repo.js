import "./Repo.css";
import { useEffect, useState } from "react";
import { MdOutlineBuildCircle, MdUpdate } from 'react-icons/md';
import { RiDownloadCloudFill } from 'react-icons/ri';
import { FaGithub } from 'react-icons/fa';
import { AiOutlineCloudSync } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Utility from "./Utility";

const Repo = ({repo}) => {

    const [repoKeepUpdate, setKeepUpdate] = useState(repo.keepUpdate);
    const [htmlUrl, setHtmlUrl] = useState(repo.htmlUrl);
    const [repoName, setRepoName] = useState(repo.name);
    const [repoUpdated, setRepoUpdated] = useState(repo.updated);
    const [repoDownloaded, setRepoDownloaded] = useState(repo.downloaded);
    const [repoIsBuildable, setBuildable] = useState(repo.buildable);

    const clickKeepUpdate = async (e) => {
        let promise = new Promise(async (resolve, reject) => {
            let result = await Utility.keepUpdate(repoName, !repoKeepUpdate);
            if (!result.success) {
                reject(result.message);
            } else {
                setKeepUpdate(!repoKeepUpdate);
                resolve();
            }
        })
        toast.promise(promise,
            {
                pending: `${repoName} ${repoKeepUpdate ? "disabling" : "enabling"} sync`,
                success: `successfully`,
                error: (error) => `failed: ${error}`,
            })
    }
    const clickDownload = async (e) => {
        let promise = new Promise(async (resolve, reject) => {
            let result = await Utility.download(repoName);
            if (!result.success) {
                reject(result.message);
            } else {
                setRepoDownloaded(true);
                setRepoUpdated(true)
                resolve();
            }
        })
        toast.promise(promise,
            {
                pending: `${repoName} is downloading...`,
                success: `${repoName} is downloaded`,
                error: (error) => `${repoName} download failed: ${error}`,
            })
    }
    const clickPull = async (e) => {
        let promise = new Promise(async (resolve, reject) => {
            let result = await Utility.pull(repoName);
            if (!result.success) {
                reject(result.message);
            } else {
                setRepoUpdated(true);
                resolve();
            }
        })
        toast.promise(promise,
            {
                pending: `${repoName} is updating...`,
                success: `${repoName} is updated`,
                error: (error) => `${repoName} is failed to update: ${error}`,
            })
    }
    const clickBuild = async (e) => {
        console.log(repoName);
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
                theme="light"
                position="top-right"
                autoClose={1000}
                pauseOnHover={false}
                pauseOnFocusLoss={false}
                draggable={false}
                closeButton={false}
                closeOnClick={false}
            />
        </div>
    );
}

export default Repo;