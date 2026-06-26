const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const port = process.env.PORT || 2000;

(
    async () => {
        try {
            console.log('trying to Connect to <whosapp> database');
            await mongoose.connect(DB);
            console.log('Database connected successfully...');
        } catch (err) {
            console.log('Error connecting to database...');
            console.log(err.message);
            process.exit(1);
        }
        app.listen(port, () => {
            console.log(`App running on port ${port}...`);
        });
    }
)();


