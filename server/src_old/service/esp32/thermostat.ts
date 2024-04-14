// import { THERMOSTAT } from '../../../../constant/constant';
// import { Thermostat, ThermostatMap } from '../../../../types/main';
// import SseDataStream from '../../lib/SseDataStream';
// import { getSortedObject, log } from '../../utils/general';
// import { server } from '../server';

// const path = '/api/home/thermostat';

// const stream = new SseDataStream(server, path, {} as ThermostatMap);

// function setThermostatClient(client: Thermostat) {
//     const state = stream.getState();
//     if (client === undefined) {
//         console.error(new Error('client must be defined'));
//         return;
//     }

//     if (!client.chipId) {
//         console.error(new Error('client.chipId must be defined'));
//         return;
//     }

//     const maxLen = 60;
//     const temp = Math.trunc(client.tempF);
//     let tempFHistory = state[client.chipId]?.tempFHistory || [];
//     if (tempFHistory.length < maxLen) tempFHistory.unshift(temp);
//     else tempFHistory = [temp, ...tempFHistory.slice(0, maxLen - 1)];

//     const tempAverage =
//         tempFHistory.reduce((acc, curr) => acc + curr, 0) / tempFHistory.length;

//     stream.setState(
//         getSortedObject({
//             ...state,
//             [client.chipId]: {
//                 chipId: client.chipId,
//                 // @ts-ignore
//                 chipName: THERMOSTAT[client.chipId] || client.chipName,
//                 tempF: Math.trunc(tempAverage),
//                 calibrate: client.calibrate || 0,
//                 updatedAt: new Date().toLocaleTimeString(),
//                 tempFHistory,
//             },
//         }),
//     );
// }

// server.post('/api/temperature', (req, res) => {
//     if (req.body) setThermostatClient(req.body);
//     res.status(200).send({ ...req.body, serverName: 'raspi-home-server' });
// });

// // [NOTE] must export & call this function in index.ts BEFORE server.listen()
// export function initAllThermostats() {
//     log(path, 'start');
// }

// export const thermostatMapStream = stream;
