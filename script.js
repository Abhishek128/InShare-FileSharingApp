const connectDB = require('./config/db')
const File = require('./models/file')
const fs = require('fs')

connectDB()

// Get all records older than 24 hours 
async function fetchData() {
    const files = await File.find({ createdAt : { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000)} })
    if(files.length) {
        for (const file of files) {
            fs.unlinkSync(file.path)
            await file.remove()
        }
    }
}

fetchData().then(process.exit);