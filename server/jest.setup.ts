process.env.NODE_PORT = '3010';
process.env.WSS_PORT = '3011';
jest.mock('./src/api/components/heater/wss')
