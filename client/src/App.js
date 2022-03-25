import './App.css';

import { useEffect, useState } from 'react';
import Repo from './components/Repo/Repo';
import { TailSpin } from 'react-loader-spinner'
const App = () => {

  const [reposStatus, setReposStatus] = useState(0);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let response = await fetch('getList');
      if (response.status === 200) {
        let data = await response.json();
        for (let item of data.items) {
          response = await fetch(`getInfo/${item.name}`);
          let info = await response.json();
          item.canBuild = info.buildinfo !== -1;
          item.keepUpdate = info.keepUpdate;
        }
        setRepos(data);
        setReposStatus(1);
      } else {
        setReposStatus(2);
      }
    };
    fetchData();
  }, [])

  return (
    <div className={(reposStatus === 1) ? "App" : "App-center"}>
      {(reposStatus === 1) ? (
        <div className="repo-list">
          {repos.items.map(repo => (
            <Repo className="repo" key={repo.id} repo={repo} />
          ))}
        </div>) : (
        (reposStatus === 2) ? <h1>Error</h1> : <div className='loading'><h1>Loading</h1><TailSpin height="40" width="40" color='rgba(255,255,255,0.3)' /></div>
      )
      }
    </div>
  );
}

export default App;
