import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import ConfigLoader from "./util/config-loader";
import CreateBooking from "./create-booking";
import UserPanel from "./user-panel";
import "./app.scss";

/**
 * App component.
 *
 * @returns {JSX.Element} App component.
 */
function App() {
  // App configuration and behavior.
  const [config, setConfig] = useState(null);

  // Get configuration.
  useEffect(() => {
    ConfigLoader.loadConfig().then((loadedConfig) => {
      setConfig(loadedConfig);
    });
  }, []);

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={5000} />

      {config && (
        <>
          {config.create_booking_mode && <CreateBooking config={config} />}
          {!config.create_booking_mode && <UserPanel config={config} />}
        </>
      )}
    </>
  );
}

export default App;
