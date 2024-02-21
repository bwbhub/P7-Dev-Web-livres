const express = require('express')

const router = express.Router()
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')

const bookCtrl = require('../controllers/books')

router.get('/', bookCtrl.getAllBook)
router.post('/', auth, multer, bookCtrl.createBook)
router.get('/bestrating', bookCtrl.topThreeBook)
router.get('/:id', bookCtrl.getOneBook)
router.put('/:id', auth, multer, bookCtrl.modifyBook)
router.delete('/:id', auth, multer, bookCtrl.deleteBook)
router.post('/:id/rating', auth, bookCtrl.ratingBook)

module.exports = router