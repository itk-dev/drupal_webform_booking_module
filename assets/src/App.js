import './app.css';
import Calendar from "./components/calendar";
import Userpanel from "./components/userpanel/userpanel";
import Resourceview from "./components/resourceView/resourceView";
import { useEffect, useState } from "react";

function App() {
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('calendar');
  const [page, setPage] = useState('calendar');

  useEffect(() => {
    setPage("calendar");
  }, []);

  const onCalendarChange = (param) => {
    console.log("onCalendarChange", param);
  }

  const onBtnClick = (e) => {
    if (e && e.target.getAttribute('goto') === "resourceview") {
      setPage("Resourceview");
      setLocation("Resourceview")
    } else {
      if (page === "calendar") {
        setPage("Userpanel");
        setLocation("Userpanel")
      } else {
        setPage("calendar");
        setLocation("calendar");
      }
    }

  }
  return (
    <div className="App">
      <div className="d-block">
        <button onClick={onBtnClick} className='page-switcher'>switch to {page === 'calendar' ? 'Userpanel' : 'Calendar'}</button>
        <button onClick={(e => onBtnClick(e))} goto='resourceview' className='page-switcher'>switch to resource view</button>
      </div>
      {/* <input value={email} onChange={({target}) => setEmail(target.value)} />
      <input value={location} onChange={({target}) => setLocation(target.value)} />
      
      <div>EMAIL: {email}</div> */}
      {page === 'Resourceview' && (
        <Resourceview location={location} />
      )}
      {page === 'calendar' && (
        <Calendar location={location} onCalendarChange={onCalendarChange} />
      )}
      {page === 'Userpanel' && (
        <Userpanel location={location} />
      )}
    </div>
  );
}

export default App;
