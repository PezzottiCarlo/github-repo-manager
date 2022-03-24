import './App.css';
import { useEffect, useState } from 'react';
import Repo from './components/Repo/Repo';

const App = () => {

  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let response = await fetch('getList');
      let data = await response.json();
      for(let item of data.items){
        response = await fetch(`getInfo/${item.name}`);
        let info = await response.json();
        console.log(info);
        item.canBuild = info.buildinfo !== -1;
        item.keepUpdate = info.keepUpdate;
      } 
      setRepos(data);
    };
    fetchData();
  }, [])

  return (
    <div className="App">
    { (repos.items && repos.items.length > 0) ? (
      <div className="repo-list">
        {repos.items.map(repo => (
          <Repo className="repo" key={repo.id} repo={repo} />
        ))}
      </div>) : (
        <h1>Errore</h1>
      )
    }
    </div>
  );
}

export default App;
