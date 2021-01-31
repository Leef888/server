const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const checkAuth = require('../middleware/check-auth');

// const validation = (req, files, )

const DetSchema = require('../models/detLot');

router.get('/', (req, res, next) => {
    DetSchema.find()
        .select('_id p_1 p_2 p_3 p_4 desc')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                detLots: docs
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', checkAuth, (req, res, next) => {

    const file = req.files.detLotImage;

    if (file.length < 4) {
        return res.status(400).json({
            message: '4 images is required'
        });
    }
    
    const nameOne = Date.now() + '_' + file[0].name;
    const pathOne = '/uploads/detImages/' + nameOne;
    file[0].mv('./uploads/detImages/' + nameOne, (err) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        }
    });
    
    const nameTwo = Date.now() + '_' + file[1].name;
    const pathTwo = '/uploads/detImages/' + nameTwo;
    file[1].mv('./uploads/detImages/' + nameTwo, (err) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        }
    });
    
    const nameThree = Date.now() + '_' + file[2].name;
    const pathThree = '/uploads/detImages/' + nameThree;
    file[2].mv('./uploads/detImages/' + nameThree, (err) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        }
    });
    
    const nameFour = Date.now() + '_' + file[3].name;
    const pathFour = '/uploads/detImages/' + nameFour;
    file[3].mv('./uploads/detImages/' + nameFour, (err) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        }
    });

    const stLot = new DetSchema({
        _id: new mongoose.Types.ObjectId(),
        p_1: pathOne,
        p_2: pathTwo,
        p_3: pathThree,
        p_4: pathFour,
        desc: req.body.desc
    });
    stLot
        .save()
        .then(result => {
        res.status(201).json({
            message: 'Handling POST requests to /detLots',
            createdStLot: result
        });
        })
        .catch(err => {
        res.status(500).json({
            error: err
        });
    });

});

router.get('/:detLotId', (req, res, next) => {
    const id = req.params.detLotId;
    DetSchema.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({message: 'No valide entry found for provided ID'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete('/:detLotId', checkAuth, (req, res, next) => {
    const id = req.params.detLotId;
    DetSchema.findById(id)
        .exec()
        .then(doc => {
            fs.unlink('.' + doc.p_1, (err) => {
                console.log(err)
            });
            fs.unlink('.' + doc.p_2, (err) => {
                console.log(err)
            });
            fs.unlink('.' + doc.p_3, (err) => {
                console.log(err)
            });
            fs.unlink('.' + doc.p_4, (err) => {
                console.log(err)
            });
            DetSchema.remove({_id: id})
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Lot deleted'
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;