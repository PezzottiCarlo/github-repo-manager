import "./Repo.css";
import { MdRecycling,MdOutlineDownloading} from 'react-icons/md';
import {CgGitPull} from 'react-icons/cg';

const Repo = (props) => {
    console.log(props);
    return (
        <div className="repo">
            <div className="repo-name">
                <a className="repo-link" href={props.repo.html_url}>{props.repo.name}</a>
            </div>
            <div className="repo-action">
                <MdRecycling className="repo-icon keepUpdate" />
                <MdOutlineDownloading className="repo-icon download" />
                <CgGitPull className="repo-icon update" />
            </div>
        </div>
    );
}

export default Repo;