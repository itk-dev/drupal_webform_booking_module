import './app.css';
import Calendar from "./components/calendar";
import {useEffect, useState} from "react";

function App() {
  const [config, setConfig] = useState(null);
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('DOKK1');
  const [page, setPage] = useState('fisk');

  useEffect(() => {
    setPage("calendar");

    if (window?.drupalSettings?.booking_app?.booking) {
      setConfig(window.drupalSettings.booking_app.booking);

      console.log("Booking config set", window.drupalSettings.booking_app.booking);
    }
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
