const {Schema, model, Types} = require('mongoose')
const schema = new Schema({
    date:{ type: Date, required: true, default: Date.now},
    client: { type: Types.ObjectId, ref: 'Client'},
    content: [{type: Types.ObjectId, res: 'OrderContent'}]
})
module.exports = model('Order', schema)