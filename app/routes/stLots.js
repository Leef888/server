const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const checkAuth = require('../middleware/check-auth');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/stImages/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '_' + file.originalname);
//     }
// });

// const upload = multer({ storage: storage }).array('stLotImage', 4);

const StSchema = require('../models/stLot');

router.get('/', (req, res, next) => {
    StSchema.find()
        .select('_id p_1 p_2 p_3 p_4 desc')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                stLots: docs
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

    const file = req.files.stLotImage;

    if (file.length < 4 || file.length > 4) {
        return res.status(400).json({
            message: '4 images is required'
        });
    }
    
    const nameOne = Date.now() + '_' + file[0].name;
    const pathOne = '/uploads/stImages/' + nameOne;
    file[0].mv('./uploads/stImages/' + nameOne, (err) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        }
    });
    
    const nameTwo = Date.now() + '_' + file[1].name;
    const pathTwo = '/uploads/stImages/' + nameTwo;
    file[1].mv('./uploads/stImages/' + nameTwo, (err) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        }
    });
    
    const nameThree = Date.now() + '_' + file[2].name;
    const pathThree = '/uploads/stImages/' + nameThree;
    file[2].mv('./uploads/stImages/' + nameThree, (err) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        }
    });
    
    const nameFour = Date.now() + '_' + file[3].name;
    const pathFour = '/uploads/stImages/' + nameFour;
    file[3].mv('./uploads/stImages/' + nameFour, (err) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        }
    });

    const stLot = new StSchema({
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
            message: 'Handling POST requests to /stLots',
            createdStLot: result
        });
        })
        .catch(err => {
        res.status(500).json({
            error: err
        });
    });

    // console.log(req.files.stLotImage)
    // const file = req.files.stLotImage;

    // file.map((el) => {
    //     const filename = Date.now() + '_' + el.name;
    //     el.mv('./uploads/stImages/' + filename, (err) => {
    //         if (err) {
    //             res.status(500).json({
    //                 error: err
    //             });
    //         }
    //     })
    // })

    /*upload(req, res, (err) => {
        if (req.files.length < 4) {
            res.status(400).json({
                message: '4 images is required'
            });
        }

        //console.log(req.files.length);

        
            const stLot = new StSchema({
                _id: new mongoose.Types.ObjectId(),
                p_1: req.files[0].path,
                p_2: req.files[1].path,
                p_3: req.files[2].path,
                p_4: req.files[3].path,
                desc: req.body.desc
            });
            stLot
                .save()
                .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'Handling POST requests to /stLots',
                    createdStLot: result
                });
                })
                .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        
    })*/

});

router.get('/:stLotId', (req, res, next) => {
    const id = req.params.stLotId;
    StSchema.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'No valide entry found for provided ID' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.delete('/:stLotId', checkAuth, (req, res, next) => {
    const id = req.params.stLotId;
    StSchema.findById(id)
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
            StSchema.remove({ _id: id })
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