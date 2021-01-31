const mongoose = require('mongoose');

const stLotsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    p_1: { type: String, required: true },
    p_2: { type: String, required: true },
    p_3: { type: String, required: true },
    p_4: { type: String, required: true },
    desc: { type: String }
});

module.exports = mongoose.model('StSchema', stLotsSchema);