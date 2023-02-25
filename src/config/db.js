const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
module.exports = connect = async () => {
    return await mongoose.connect(
        `mongodb+srv://vivek:vivek@cluster0.zov7tys.mongodb.net/mock11?retryWrites=true&w=majority`
    );
}
