require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db.js');

const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route.js');
const userRoutes = require('./routes/user.route.js');
const companyRoutes = require('./routes/company.route.js');
const transactionRoutes = require('./routes/transaction.route.js');
const adminRoutes = require('./routes/admin.routes.js');
const analysisRoutes = require('./routes/analysis.route.js');


const PORT = process.env.PORT;

const app = express();
connectDB();

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
}));

app.use(express.json()); 
app.use(cookieParser())


app.use('/api/auth',authRoutes);
app.use('/api/company',companyRoutes);
app.use('/api/user',userRoutes);
app.use('/api/surveys',transactionRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/analysis',analysisRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
