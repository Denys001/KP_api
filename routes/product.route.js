const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const Product = require('../models/Product')
const router = Router()

// api/product/store  --- create
router.post('/store', 
    [
        check('name', 'name is required').exists(),
        check('description', 'description is required').exists(),
        check('wholeSalePrice', 'wholeSalePrice is required').exists(),
        check('wholeSalePrice', 'wholeSalePrice is must be number').isNumeric(),
        check('retailPrice', 'retailPrice is required').exists(),
        check('retailPrice', 'retailPrice is must be number').isNumeric()
        
    ], 
    async (req, res) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                'errors': errors.array()
            })
        }
        const {name, description, wholeSalePrice, retailPrice} = req.body
        const product = new Product({
            name, description, wholeSalePrice, retailPrice
        })
        await product.save()
            res.status(201).json({ 'message': "Product was created" })
    }
    catch(e){
        res.status(500).json({
            'Message': 'Server erorr...'
        })
    }
})
//api/product/    --- index
router.get('/', async (req, res) => {
    try{
        var result = await Product.find({})
        res.status(200).json(result)
    }catch(e){
        res.status(400).json({
            'Messaage': 'Anuthing was found'
        })
    }
})
//api/product/:id  --- show
router.get('/:id', async (req, res) => {
    try{
        const result = await Product.findById(req.params.id)
        res.status(200).json(result)
    }catch(e){
        res.status(400).json({
            'Message' : 'Anything was found'
        })
    }
})
//api/product/:id --- delete
router.delete('/:id', async (req, res) => {
    try{
        await Product.deleteOne({'_id':req.params.id}, () => {
            return res.status(200).json({
                'Message': 'Product was deleted'
            })
        })
    }
    catch(e){
        res.status(400).json({
            'Message': 'Product wasn\'t found'
        })
    }
})
module.exports = router