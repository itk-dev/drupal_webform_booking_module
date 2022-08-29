import './app.css';
import Calendar from "./components/calendar";
import {useEffect, useState} from "react";

function App() {
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('DOKK1');
  const [page, setPage] = useState('fisk');

  useEffect(() => {
    setPage("calendar");
  }, []);

  const onCalendarChange = (param) => {
    console.log("onCalendarChange", param);
  }

  return (
    <div className="App">
      <input value={email} onChange={({target}) => setEmail(target.value)} />
      <input value={location} onChange={({target}) => setLocation(target.value)} />

      <div>EMAIL: {email}</div>
      {page === 'calendar' && (
        <Calendar location={location} onCalendarChange={onCalendarChange} />
      )}
      {page === 'fisk' && (
        <div>FISK</div>
      )}
    </div>
  );
}

export default App;
