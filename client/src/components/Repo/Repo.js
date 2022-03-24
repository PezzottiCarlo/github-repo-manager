import "./Repo.css";

const Repo = (props) => {
    return (
        <div className="repo">
            <div className="repo-name">
                <a href={props.repo.html_url}>{props.name}</a>
            </div>
            <div className="repo-action">
                <button onClick={() => props.onClick(props.id)}>Clone</button>
                <button onClick={() => props.onClick(props.id)}>Pull</button>
            </div>
        </div>
    );
}

export default Repo;