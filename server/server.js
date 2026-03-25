require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db.js');

const authRoutes = require('./routes/auth.routes.js');
const userRoutes = require('./routes/user.routes.js');
const companyRoutes = require('./routes/company.route.js');
const transactionRoutes = require('./routes/transaction.route.js');


const PORT = process.env.PORT;

const app = express();
connectDB();

app.use(cors());
app.use(express.json()); // Crucial for parsing { code: "..." } from Angular


app.use('/api/auth',authRoutes);
// app.use('/api/companies',transactionRoutes);
// app.use('/api/company',companyRoutes);
// app.use('/api/user',userRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
