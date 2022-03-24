import './App.css';
import { useEffect, useState } from 'react';
import Repo from './components/Repo/Repo';

const App = () => {

  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetch('getList')
      .then(response => response.json())
      .then(data => setRepos(data));
  }, [])

  return (
    <div className="App">
    { (repos.length > 0) ? (
      <div className="repo-list">
        {repos.map(repo => (
          <Repo key={repo.id} repo={repo} />
        ))}
      </div>) : (
        <h1>Errore</h1>
      )
    }
    </div>
  );
}

export default App;
