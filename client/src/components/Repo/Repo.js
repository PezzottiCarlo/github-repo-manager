import "./Repo.css";

const Repo = (props) => {
    console.log(props);
    return (
        <div className="repo">
            <div className="repo-name">
                <a className="repo-link" href={props.repo.html_url}>{props.repo.name}</a>
            </div>
            <div className="repo-action">
                <button onClick={() => props.onClick(props.repo.id)}>Clone</button>
                <button onClick={() => props.onClick(props.repo.id)}>Pull</button>
            </div>
        </div>
    );
}

export default Repo;