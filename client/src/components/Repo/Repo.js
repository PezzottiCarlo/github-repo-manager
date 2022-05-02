import "./Repo.css";
import { useEffect, useState } from "react";
import { FiTool, FiGithub,FiDownload,FiDownloadCloud,FiRefreshCcw} from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Utility from "./Utility";

const Repo = ({repo}) => {

    const [repoKeepUpdate, setKeepUpdate] = useState(repo.keepUpdate);
    const [repoDownloaded, setRepoDownloaded] = useState(repo.downloaded);

    const clickKeepUpdate = async (e) => {
        let promise = new Promise(async (resolve, reject) => {
            let result = await Utility.keepUpdate(repo.name, !repoKeepUpdate);
            if (!result.success) {
                reject(result.message);
            } else {
                setKeepUpdate(!repoKeepUpdate);
                resolve();
            }
        })
        toast.promise(promise,
            {
                pending: `${repo.name} ${repoKeepUpdate ? "disabling" : "enabling"} sync`,
                success: `successfully`,
                error: (error) => `failed: ${error}`,
            })
    }
    const clickDownload = async (e) => {
        let promise = new Promise(async (resolve, reject) => {
            let result = await Utility.download(repo.name);
            if (!result.success) {
                reject(result.message);
            } else {
                setRepoDownloaded(true);
                resolve();
            }
        })
        toast.promise(promise,
            {
                pending: `${repo.name} is downloading...`,
                success: `${repo.name} is downloaded`,
                error: (error) => `${repo.name} download failed: ${error}`,
            })
    }
    const clickPull = async (e) => {
        let promise = new Promise(async (resolve, reject) => {
            let result = await Utility.pull(repo.name);
            if (!result.success) {
                reject(result.message);
            } else {
                resolve();
            }
        })
        toast.promise(promise,
            {
                pending: `${repo.name} is updating...`,
                success: `${repo.name} is updated`,
                error: (error) => `${repo.name} is failed to update: ${error}`,
            })
    }
    const clickBuild = async (e) => {
        console.log(repo.name);
        let promise = new Promise(async (resolve, reject) => {
            let result = await Utility.build(repo.name);
            console.log(result);
            if (!result.success) {
                reject(result.message);
            } else {
                resolve();
            }
        })
        console.log("pota");
        toast.promise(promise,
            {
                pending: `${repo.name} building`,
                success: `${repo.name} built`,
                error: (error) => `${repo.name} build failed: ${error}`,
            })
    }



    return (
        <div>
            <div className="repo">
                <div className="repo-name">
                    <FiGithub />
                    <a className="repo-link" href={repo.html_url}>{repo.name}</a>
                </div>
                <div className="repo-action">
                    <FiTool className="repo-icon build" onClick={clickBuild} />
                    <FiRefreshCcw className={`repo-icon ${(repoKeepUpdate) ? "keepUpdate" : "inactive"}`} onClick={clickKeepUpdate} />
                    {(repoDownloaded) ? <FiDownloadCloud className="repo-icon update" onClick={clickPull} /> : <FiDownload className="repo-icon download" onClick={clickDownload} />}
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