const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

(
    async () => {
        try {
            console.log('trying to Connect to <whosapp> database');
            await mongoose.connect(DB);
            console.log('Database connected successfully...');
        } catch (err) {
            console.log('Error connecting to database...');
            console.log(err.message);
        }
    }
)();

const port = process.env.PORT || 2000;

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

