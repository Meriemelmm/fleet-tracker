import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import  auth from './src/middlewares/auth.js'
import authorize from './src/middlewares/authorize.js';
import connectDB from './src/config/database.js';
import camionRoute from './src/routes/CamionRoute.js';
import remorqueRoute from './src/routes/RemorqueRoute.js'
import AdminRoute from './src/routes/AdminRoute.js'
import AuthRoute from './src/routes/AuthRoute.js'
import PneuRoute from './src/routes/PneuRoute.js';
import TrajetRoute from './src/routes/TrajetRoute.js';
dotenv.config();


const app = express();
import createTransporter from "./src/config/emailConfig.js";

createTransporter().verify((err, success) => {
  if (err) {
    console.log(" SMTP ERROR :", err);
  } else {
    console.log(" SMTP CONNECTED");
  }
});


connectDB();

app.use(cors());
app.use(express.json());
// routes:
// app.use('/camions',auth,authorize('admin'),camionRoute);
app.use('/camions',camionRoute);
// app.use('/remorques',auth,authorize('admin'), remorqueRoute);
app.use('/remorques', remorqueRoute);
// app.use('/admin',auth,authorize('admin'),AdminRoute);

app.use('/admin',AdminRoute);
app.use('/auth',AuthRoute);
app.use('/pneus',auth,authorize('admin'),PneuRoute);
app.use('/trajets', TrajetRoute);


app.get('/', (req, res) => {
  res.json({ message: 'Fleet Tracker API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
