import './app.css';
import Calendar from "./components/calendar";
import {useState} from "react";

function App() {
  const [location, setLocation] = useState('DOKK1');

  return (
    <div className="App">
      <Calendar location={location}/>
    </div>
  );
}

export default App;
