var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var Flashcard = new Schema({
	created: {
		type: Date,
		defualt: Date.now
	},
	word: {
		type: String,
		trim: true,
		required: 'Word can not be blank'
	},
	defenition: {
		type: String,
		trim: true,
		required: 'Defenition can not be blank'
	},
	bin: {
		type: String,
		default: "bin0"
	},
	correct: Number,
	wrong: Number,
	lastSeen: {
		type: Date,
		default: Date.now
	}
});

var UserSchema = new Schema({
	firstName: String,
	lastName: String,
	username: {
		type: String,
		trim: true,
		unique: true,
		required: 'Username is required'
	},
	password: {
		type: String,
		validate: [
			function(password){
				return password && password.length > 3;
			},
			'Password needs to have a length of at least 4'
		]
	},
	salt: {
    type: String
  	},
  	provider: {
    	type: String,
    	required: 'Provider is required'
  	},
	bin0: [Flashcard],
	bin1: [Flashcard],
	bin2: [Flashcard],
	bin3: [Flashcard],
	bin4: [Flashcard],
	bin5: [Flashcard],
	bin6: [Flashcard],
	bin7: [Flashcard],
	bin8: [Flashcard],
	bin9: [Flashcard],
	bin10: [Flashcard],
	bin11: [Flashcard],
	binHardToRemember: [Flashcard],
	binCurrent: [Flashcard],
	created: {
		type: Date,
		default: Date.now
	}
});

UserSchema.pre('save', function(next){
  if (this.password){
    this.salt=new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

UserSchema.methods.hashPassword = function(password){
  return crypto.pbkdf2Sync(password, this.salt, 10000,64).toString('base64');
};

UserSchema.methods.authenticate = function(password){
  return this.password === this.hashPassword(password);
};

mongoose.model('User', UserSchema);
