const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    name : {type: String, required: true},
    surname : {type: String, required: true},
    phoneNumber : {type: String, required: true},
    company : {type: String},
    address : {type: String, required: true},
    orders : [{type: Types.ObjectId, ref:'Order'}]
})
module.exports = model('Client', schema)