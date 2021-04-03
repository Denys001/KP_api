const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    product: { type: Types.ObjectId, ref:'Product'},
    order: { type: Types.ObjectId, ref: 'Order'},
    count: { type: Number, required: true}
})
module.exports = model('OrderContent', schema)