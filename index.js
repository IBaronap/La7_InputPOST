import { express, Server, cors, os } from './dependencies.js'
const PORT = 5050; // No cambiar
// '192.168.80.31'; // Cambiar por la IP del computador
const IPaddress = "172.30.191.106";
const SERVER_IP = IPaddress;

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use('/app', express.static('public-app'));

const httpServer = app.listen(PORT, () => {
    console.log(`Server is running, host http://${SERVER_IP}:${PORT}/`);
    console.table({ 
        'Client Endpoint' : `http://${SERVER_IP}:${PORT}/app`})
});
// Run on terminal: ngrok http 5050;

const io = new Server(httpServer, { path: '/real-time' });

//Io connection
io.on('connection', socket => {
    console.log(socket.id);

    socket.on('userData', userData => {
        console.log(userData);
    })
});

//POST user Info
app.get('/Forms-Array', (request, response) => {
    response.send(UserInfo);
});

let UserInfo = [];

app.post('/Forms-Array', (request, response) => {
    const {Name, Email, Phone, Birth_Date, Location, Submit_Date, Interaction_Time, Submit_Time, Duration, DeviceType} = request.body;
    UserInfo.push({ Name, Email, Phone, Birth_Date, Location, Submit_Date, Interaction_Time, Submit_Time, Duration, DeviceType});
    console.log("User Info:", UserInfo);
    response.json({ received: request.body });
});
