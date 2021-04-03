const {Schema, model, Types} = require('mongoose')
const schema = new Schema({
    name: {type: String, required: true},
    wholeSalePrice: {type: Number, required: true},
    retailPrice: {type: Number, required: true},
    description: {type: String, required: true},
    orderContents: [{ type: Types.ObjectId, ref: 'OrderContent'}]
})
module.exports = model('Product', schema)