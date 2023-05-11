import { Route, Routes } from 'react-router-dom';
import './App.css';
import VideoList from './components/VideoList';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' Component={VideoList}/>
      </Routes>
    </div>
  );
}

export default App;
