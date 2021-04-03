const { Router } = require('express')
const Client = require('../models/Client')
const { check, validationResult } = require('express-validator')
const router = Router()

//api/client/store   --- create
router.post(
    '/store',
    [
        check('phoneNumber', 'phoneNumber is required').exists(),
        check('phoneNumber', 'Length of phone number must be 10').isLength({ min: 10, max: 10 }),
        check('name', 'name is required').exists(),
        check('surname', 'surname is required').exists(),
        check('address', 'address is required').exists(),
    ],
    async (req, res) => {
        try {
            console.log(req.body)
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    'errors': errors.array(),
                    'message': 'Некоректні дані'
                })
            }
            const { address, company, name, surname, phoneNumber } = req.body
            const user = new Client({
                address, company, name, surname, phoneNumber
            })
            await user.save()
            res.status(201).json({ 'message': "Client was created" })
        } catch (e) {
            res.status(500).json({ 'Message': "Server error!..." + e.message })
        }
    })
//api/client/   --- index
router.get('/', async (req, res) => {
    try {
        var result = await Client.find({});
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({ 'Message': "Anything was found..." })
    }
})
// api/client/:id   --- show
router.get('/:id', async (req, res) => {
    try {
        var result = await Client.findById(req.params.id);
        //console.log(result)
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({ 'Message': "Client wasn't found..." })
    }
})
// api/client/:id   --- delete
router.delete('/:id', async (req, res) => {
    try {
        await Client.deleteOne({ _id: req.params.id }, () => {
            return res.status(200).json({
                'Message': "Client was deleted"
            })
        })
    }
    catch (e) {
        res.status(400).json({ 'Message': "Client wasn't found..." })
    }
})
module.exports = router