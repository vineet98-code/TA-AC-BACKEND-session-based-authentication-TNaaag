var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title : { type: String, required: true },
    description :{ type: String, required: true },
    likes: { type: Number, default: 0 },
    author: String,
    // keep track of all comments id made on this specific article
    // Any time we store ObjectId of any other document, which belongs to some other models, we are going to use Schema.Types.ObjectId
 
    remarks : [{
        // whatever objectId is store here belongs to which model
        type: Schema.Types.ObjectId, ref: 'Remarks'
    }],
    slug: {}

}, {timestamps: true });

articleSchema.pre('save', function(next) {
    if(this.title && this.isModified('title')) {
        console.log(this, 'before slug')
      bcrypt.hash(this.title, 10, (err, hashed) => { // take the plain password
        // second argument takes a salt round, it basically a random string(secret) which is used to hash the password
        if (err) return next(err);
        this.title = hashed;
        console.log(this, 'after slug');
        next();
      }); 
    } else {
      next();//call next because excution doesn't hold on presave hooks 
    }
  });

// This Book is used to perform the crud operation and capture it in router book.js
module.exports = mongoose.model('Article', articleSchema); // model is equivalent to colletions