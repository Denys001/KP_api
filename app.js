const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
var cors = require('cors')

const app = express()
app.use(express.json({extended: true}))
app.use(cors())

app.use('/api/client', require('./routes/client.routes'))
app.use('/api/product', require('./routes/product.route'))
app.use('/api/order', require('./routes/order.route'))
const PORT = config.get('port') || 5000

async function start() {
    try{
        
        await mongoose.connect(config.get('MongoUrl'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

    }catch(e){
        console.log("Server error...." , e.message)
        process.exit(1);
    }
}
start()
app.listen(PORT, ()=>{
    console.log(`Server has been started on PORT ${PORT}...`)
})