import logo from './logo.svg';
import './App.css';
import PlayField from './components/PlayField.jsx';

function App() {

  const grid = [
  	[1,1,1,1,1,1,1,1], 
  	[1,0,0,0,0,0,0,1], 
  	[1,0,1,1,2,1,0,1],
  	[1,1,1,1,1,1,1,1]  
  ];

  return (
    <div className="App">
        <PlayField grid={grid}></PlayField>
    </div>
  );
}

export default App;



