const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const Client = require('../models/Client')
const Product = require('../models/Product')
const Order = require('../models/Order')
const OrderContent = require('../models/OrderContent')
const router = Router()
// api/order/store  --- create
router.post('/store',
    [
        check('client_id', 'client is required').exists(),
        check('content', 'content is required').exists()
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    'errors': errors.array()
                })
            }

            const { client_id, content } = req.body

            try {
                let client = await Client.findById(client_id)
            } catch (e) {
                return res.status(400).json({
                    'message': 'Client wasn\'t found'
                })
            }
            const order = new Order({
                client: client_id
            })
            // content validate
            try {
                if (content.length == 0) {
                    throw new Error('Content is empty')
                }
            } catch (e) {
                return res.status(400).json({
                    'message': "Error" + e.message
                })
            }
            await Promise.all(content.map(async (element) => {
                try {
                    if (element.product_id == undefined) {
                        throw new Error('Product_id is absent')
                    }
                    if (element.count == undefined) {
                        throw new Error('count is absent')
                    }
                    const product = await Product.findById(element.product_id)
                } catch (e) {
                    return res.status(400).json({
                        'message': 'Product wasn\'t found. ' + e.message
                    })
                }
            }))
            await order.save()
            content.forEach(async element => {
                const orderContent = new OrderContent({
                    order: order._id,
                    product: element.product_id,
                    count: element.count
                })
                await orderContent.save()
            });
            return res.status(200).json({
                'message': 'Order was formed'
            })
        } catch (e) {
            res.status(500).json({
                'message': 'Server error ' + e.message
            })
        }
    })
// api/order/  --- index
router.get('/', async (req, res) => {
    try {
        const result = await Order.find({});
        const r = []
        await Promise.all(result.map(
            async el => {
                const client = await Client.findById(el.client)
                r.push({
                    "_id": el._id,
                    "client": client.surname + " " + client.name,
                    "client_id": el.client,
                    "date": el.date
                })
            }
        ))
        res.status(200).json(r)
    } catch (e) {
        res.status(400).json({
            'message': 'Anything was found ' + e.message
        })
    }
})
// api/order/client/:id
router.get('/client/:id', async (req, res) => {
    try {
        const result = await Order.find({ client: req.params.id });
        const r = []
        await Promise.all(result.map(
            async el => {
                const client = await Client.findById(el.client)
                r.push({
                    "_id": el._id,
                    "client": client.surname + " " + client.name,
                    "client_id": el.client,
                    "date": el.date
                })
            }
        ))
        res.status(200).json(r)
    } catch (e) {
        res.status(400).json({
            'message': 'Anything was found ' + e.message
        })
    }
})
// api/order/:id  --- show
router.get('/:id', async (req, res) => {
    try {
        const result = await Order.findById(req.params.id);
        const content = await OrderContent.find({ order: req.params.id })
        const client = await Client.findById(result.client)
        let sum_with_sale = 0;
        let sum = 0;
        let content_to = [];
        await Promise.all(content.map(async el => {
            const product = await Product.findById(el.product)
            if (el.count >= 5) {
                sum += parseFloat(product.retailPrice) * parseFloat(el.count);
                content_to.push({
                    "name": product.name,
                    "count": el.count,
                    "price": product.retailPrice
                })
            } else {
                sum += parseFloat(product.wholeSalePrice) * parseFloat(el.count);
                content_to.push({
                    "name": product.name,
                    "count": el.count,
                    "price": product.wholeSalePrice
                })
            }

        }))
        if (sum >= 10000) {
            sum_with_sale = sum - sum * 0.1
        } else {
            sum_with_sale = sum
        }
        if( result == null){
            throw new Error();
        }
        res.status(200).json({
            'order': result,
            'content': content_to,
            "AllPrice": sum,
            "PriceWithSale": sum_with_sale,
            "client": client.surname + " " + client.name
        })
    } catch (e) {
        res.status(400).json({
            'message': 'Anything was found ' + e.message
        })
    }
})
//api/order/:id
router.delete('/:id', async (req, res) => {
    try {
        await OrderContent.deleteMany({ order: req.params.id },async () => {
            await Order.deleteOne({ _id: req.params.id },  () => {
                return res.status(200).json({
                    'Message': "Order was deleted"
                })
            })
        })
    }
    catch (e) {
        res.status(400).json({ 'Message': "Client wasn't found..." })
    }
})
//api/order/sum
router.post('/calculateSum', (req, res) => {
    try {
        const {content} = req.body
        //console.log(content)
        let sum_with_sale = 0;
        let sum = 0;
        content.forEach( el => {
            console.log(el)
            if (el.count >= 5) {
                sum += parseFloat(el.productRetailPrice) * parseFloat(el.count);
            } else {
                sum += parseFloat(el.productWholeSalePrice) * parseFloat(el.count);
            }
        })
        if (sum >= 10000) {
            sum_with_sale = sum - sum * 0.1
        } else {
            sum_with_sale = sum
        }
        res.status(200).json({
            "AllPrice": sum,
            "PriceWithSale": sum_with_sale
        })
    }
    catch (e) {
        res.status(400).json({ 'Message': "Client wasn't found..." })
    }
})
module.exports = router