const connectDB = require('./config/db');
const File = require('./models/file');
const fs = require('fs');

connectDB();

// Get all records older than 24 hours 
async function fetchData() {
    const files = await File.find({ createdAt : { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000)} })
    if(files.length) {
        for (const file of files) {
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`Successfully deleted ${file.filename}`);
            } catch(err) {
                console.log(`Rrror while deleting file ${err} `);
            }
        }
    }
    console.log('Job Completed!');
}

fetchData().then(process.exit);