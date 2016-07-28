var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var FlashcardSchema = new Schema({
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

mongoose.model('Flashcard', FlashcardSchema);