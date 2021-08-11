const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' })

const router = express.Router();

const uri = process.env.MONGO_URI

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const imageSchema = mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    userPassword: {
        type: String,
    },
    authorPassword: {
        type: String,
        default: process.env.AUTHOR_PASSWORD
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        // setDefaultsOnInsert: true
    }
});

const images = new mongoose.model("images", imageSchema);

router.get('/', async (req, res) => {
    try {
        // let ip = requestIp.getClientIp(req)
        // console.log(ip)
        let allImages = await images.find()
        res.send(allImages.reverse())
    } catch (error) {
        console.log(error);
    }
});

router.post('/', async (req, res) => {
    try {
        if (await req.body.userPassword) {
            let newImage = new images({
                label: req.body.label,
                imageURL: req.body.imageURL,
                userPassword: req.body.userPassword,
            })

            newImage.save(function (err) {
                if (err) {
                    return res.status(400).send(err.message);
                }
                else{
                    res.status(200).send()
                }
            })
        }
        else {
            let newImage = new images({
                label: req.body.label,
                imageURL: req.body.imageURL,
                userPassword: req.body.label
            })

            newImage.save(function (err) {
                if (err) {
                    return res.status(400).send(err.message);
                }
                else {
                    res.status(200).send()
                }
            });
        }

        // res.status(200).send()
    } catch (error) {
        console.log(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await images.deleteOne({ _id: req.params.id });
        res.status(200).send();
    } catch (error) {
        console.log(error)
    }
});

module.exports = router