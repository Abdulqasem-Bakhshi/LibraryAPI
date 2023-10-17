const utils = require('../utils/utils')
const { db } = require('../db')
const Book = db.books

// CREATE
exports.create = async (req, res) => {
    try {
        if (!req.body.title) {
            return res.status(400).send({ error: "One or all required parameters are missing." })
        }

        const createdBook = await Book.create({ title: req.body.title })
        console.log(`${req.body.title}'s auto-generated ID:", ${createdBook.id}`);

        res.status(201)
            .location(`${utils.getBaseUrl(req)}/books/${createdBook.id}`)
            .send(createdBook)
    } catch (error) {
        console.error(error)
    }
}
// READ
exports.getAll = async (req, res) => {
    try {
        const result = await Book.findAll({ attributes: ["id", "title", "description", "author", "releasedate", "language", "booklength", "price"] })
        res.send(JSON.stringify(result))
    } catch (error) {
        console.error(error)
    }
}
exports.getById = async (req, res) => {
    try {
        const { id } = req.params
        const book = await Book.findByPk(id)

        if (!book) {
            return res.status(404).send({ error: "book not found." })
        }

        res.status(200).send(book)
    } catch (error) {
        console.error(error)
    }
}
// UPDATE
exports.updateById = async (req, res) => {
    try {
        const { id } = req.params

        if (!req.body.title) {
            return res.status(400).send({ error: "One or all required parameters are missing." })
        }

        const book = await Book.findByPk(id)

        if (!book) {
            return res.status(404).send({ error: "book not found." })
        }

        const updatedBook = await Book.update(
            { title: req.body.title },
            { where: { id: book.id } }
        )

        if (updatedBook < 1) {
            return res.status(404).send({ error: "could not update book" })
        }

        if (!updatedBook) {
            return res.status(404).send({ error: "book not found." })
        }

        res.status(200)
            .location(`${utils.getBaseUrl(req)}/books/${book.id}`)
            .send("book updated successfully.")
    } catch (error) {
        console.error(error)
    }
}

// DELETE
exports.deleteOne = async (req, res) => {
    try {
        const { id } = req.params

        const book = await Book.destroy({
            where: {
                id: id
            }
        });

        if (!book) {
            return res.status(404).send({ error: "book not found." })
        }

        res.status(204).send()
    } catch (error) {
        console.error(error)
    }
}