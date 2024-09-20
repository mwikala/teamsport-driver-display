import { useEffect, useMemo, useState } from "react";
import ordinal from "./utils/get-ordinal";
import { toSecondsOrMinutes } from "./utils/to-seconds";
import useDriver from "./hooks/use-driver";

const App = () => {
  const [driverPersonId, setDriverPersonId] = useState(null);
  const { driver, session } = useDriver(driverPersonId);
  const [drivers, setDrivers] = useState([]);
  const [lastDriver, setLastDriver] = useState(null);

  useEffect(() => {
    if (session?.Drivers) {
      const orderedDrivers = session.Drivers.sort((a, b) => a.StartPosition - b.StartPosition);
      setDrivers(orderedDrivers);
    }
  }, [session?.Drivers]);

  const handleDriverChange = (e) => {
    setDriverPersonId(e.target.value);
  }

  const bestTimeClass = useMemo(() => {
    // check if driver.BestTimeMs is the quickest of all in Session.Drivers
    const bestTime = driver?.BestTimeMs;
    const bestTimeInSession = session?.Drivers.reduce((acc, curr) => {
      if (curr.BestTimeMs < acc) {
        return curr.BestTimeMs;
      }
      return acc;
    }, Infinity);

    if (bestTime === bestTimeInSession) {
      return "text-purple-500";
    }

    return "text-gray-500";
  }, [driver])

  const differenceClass = useMemo(() => {
    const difference = driver?.DifferencePreviousLapMs;
    if (difference > 0) {
      return "text-green-500";
    }
    if (difference < 0) {
      return "text-red-500";
    }

    return "text-gray-500";
  }, [driver])

  useEffect(() => {
    if (!driver || !driver.LastTimeMs) return;

    if (lastDriver && lastDriver.LastTimeMs === driver.LastTimeMs) {
      return;
    }

    const seconds = Math.floor(driver.LastTimeMs / 1000);
    const milliseconds = driver.LastTimeMs % 1000;
    const millisecondsString = milliseconds.toString().padStart(3, '0').split('').join(' ');
    const timeString = `${seconds} point ${millisecondsString}`;

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PLAY_AUDIO',
        text: timeString
      });
    } else {
      const utterance = new SpeechSynthesisUtterance(timeString);
      window.speechSynthesis.speak(utterance);
    }

    setLastDriver(driver);

  }, [driver?.LastTimeMs]);

  return (
    <div className="bg-gray-800 h-screen w-screen max-h-screen text-gray-100 flex flex-col justify-center items-center">

      {drivers.length > 1 && (
        <div className="max-w-sm w-full px-5 mb-5">
          <select defaultValue={driver.PersonId} onChange={handleDriverChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option disabled>Choose a driver</option>
            {drivers.map(({ PersonId, Alias, Kart: { Name: KartNumber }}) => (
              <option key={PersonId} value={PersonId}>{Alias} (Kart #{KartNumber})</option>
            ))}
          </select>
        </div>
      )}

      {driver && (
        <div className="flex flex-col items-center gap-y-2 font-bold">
          <p className="text-2xl">{ driver.Position }{ordinal(driver.Position)}</p>

          <p className={`text-7xl lg:text-9xl ${differenceClass}`}>{ toSecondsOrMinutes(driver.LastTimeMs ?? 0) }</p>
          <p className={`text-3xl lg:text-4xl ${bestTimeClass}`}>{toSecondsOrMinutes(driver.BestTimeMs ?? 0)}</p>

          <p className="text-lg lg:text-xl uppercase">{session.ClockAsText} ({session.Laps || 0 } laps)</p>

          <ProgressIndicator progress={driver.LapProgress} />
        </div>
      )}
      {!driver && (
        <p className="text-2xl text-center font-bold uppercase text-red-400 max-w-lg">Either a session is not running or we could not establish a connection</p>
      )}
    </div>
  );
}

const ProgressIndicator = ({ progress }) => {
  return (
    <div className="w-full bg-gray-700 mt-5 rounded-full h-2.5">
      <div className="bg-blue-600 h-2.5 max-w-full rounded-full transition-all duration-500" style={{ width: progress + '%' }}></div>
    </div>
  );
}

export default App;
