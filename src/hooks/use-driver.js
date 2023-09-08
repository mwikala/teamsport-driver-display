import { useEffect, useState } from 'react';
import { useWebSocket } from '../providers/websocket-provider';

const TRACK_CLIENT_KEY = 'teamsportleeds';

const message = {
    $type: 'BcStart',
    ClientKey: TRACK_CLIENT_KEY,
    ResourceId: '19476', // ? Figure out what this represents
    Timing: true,
    Notifications: false,
    Security: 'THIRD PARTY TV'
};

export const useDriver = (personId) => {
    const [driver, setDriver] = useState(null);
    const [session, setSession] = useState(null);
    const ws = useWebSocket(JSON.stringify(message));

    useEffect(() => {
        if (ws) {
            ws.onmessage = ({ data }) => {
                const json = JSON.parse(data);
                setSession(json);
                const ourDriver = personId
                    ? json.Drivers.find((d) => d.PersonId == personId)
                    : json.Drivers[0];
                setDriver(ourDriver);
            };
        }
    }, [ws, personId]);

    return { driver, session };
}

export default useDriver;
