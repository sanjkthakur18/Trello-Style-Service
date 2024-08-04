const mongoose = require("mongoose");
const validateMongoDbId = (id, req, res) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) res.status(404).json({error: 'This id is not valid or not Found'});
};
module.exports = validateMongoDbId;