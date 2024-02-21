const fs = require('fs')
const Book = require('../models/Book')

// Controleur de création de livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book)
  delete bookObject._Id
  delete bookObject.userId
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })

  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch(error => res.status(400).json({ error }))
}

// Controleur de récupération d'un seul livre
exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id
  })
    .then((book) => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }))
}

// Controleur de modification d'un livre
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }
  delete bookObject._userId

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé !' })
      } else {
        const filename = book.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Livre mis à jour !' }))
            .catch(error => res.status(401).json({ error }))
        })
      }
    })
    .catch(error => res.status(400).json({ error }))
}

// Controleur de suppression d'un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId !== req.auth.userId) {
        res.status(401).json({ message: 'Non-autorisé !' })
      } else {
        const filename = book.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Livre supprimé' }))
            .catch(error => res.status(401).json({ error }))
        })
      }
    })
    .catch(error => res.status(500).json({ error }))
}

// Controleur de récupération de tous les livres
exports.getAllBook = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }))
}

// Controleur de rating
exports.ratingBook = (req, res, next) => {
  Book.findByIdAndUpdate({ _id: req.params.id })
    .then((book) => {
      for (let i = 0; i < book.ratings.length; i++) {
        if (req.auth.userId === book.ratings[i].userId) {
          res.status(400).json({ message: 'Vous ne pouvez pas voter deux fois pour le même livre !' })
        }
      }
      book.ratings.push({ userId: req.auth.userId, grade: req.body.rating })
      const totalRating = book.ratings.reduce((acc, rating) => acc + rating.grade, 0)
      book.averageRating = +(totalRating / book.ratings.length).toFixed(1)
      book.save()
        .then((book) => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(400).json({ error })) 
}

// Contrôleur de best rating 
exports.topThreeBook = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trie par ordre décroissant
    .limit(3) // N'affiche que 3 résultats
    .then(topBook => res.status(200).json(topBook))
    .catch(error => res.status(400).json({ error }));
}
