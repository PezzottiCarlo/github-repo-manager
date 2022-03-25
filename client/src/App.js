import './App.css';

import { useEffect, useState } from 'react';
import Repo from './components/Repo/Repo';
import { Bars } from 'react-loader-spinner'
import LoadingBar from 'react-top-loading-bar'
const App = () => {

  const [reposStatus, setReposStatus] = useState(0);
  const [repos, setRepos] = useState([]);
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      let response = await fetch('getList');
      if (response.status === 200) {
        let data = await response.json();
        let tmp = 0;
        for (let item of data.items) {
          tmp += (100 / data.items.length);
          setProgress(tmp)
          setProgressMessage(`${item.name} is being fetched`)
          response = await fetch(`getInfo/${item.name}`);
          let info = await response.json();
          item.buildInfo = info.buildInfo;
          item.keepUpdate = info.keepUpdate;
          item.updated = info.updated;
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
      <LoadingBar
        color='#0892d0'
        progress={progress}
      />
      {(reposStatus === 1) ? (
        <div className="repo-list">
          {repos.items.map(repo => (
            <Repo className="repo" key={repo.id} repo={repo} />
          ))}
        </div>) : (
        (reposStatus === 2) ? <h1>Error</h1> :
          <div className='loading'>
            <h2 className='loading-message'>{progressMessage}</h2>
            <Bars height="40" width="40" color='rgba(255,255,255,0.3)' />
          </div>
      )
      }
    </div>
  );
}

export default App;
