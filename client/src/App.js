import './App.css';
import { useEffect, useState } from 'react';
import Repo from './components/Repo/Repo';

const App = () => {

  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:8081/getList');
      const data = await response.json();
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
