var mongoose = require('mongoose'),
	Flashcard = mongoose.model('Flashcard'),
	User = mongoose.model('User');

var getErrorMessage = function(err){
	if (err.errors) {
		for (var errName in err.errors){
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Unknown server error';
	}
};

exports.renderCreate = function(req, res, next) {
  // if (!req.user) {
  //   res.render('flashcard',{
  //     title: 'Create Flashcard',
  //     messages: req.flash('error')
  //   });
  // } else {
  //  return res.redirect('/flashcard');
     res.render('flashcard',{
       title: 'Create Flashcard'
    //  // user: JSON.stringify(req.user)
   	 });
  //}
};

exports.create = function(req, res){
	var flashcard = new Flashcard(req.body);
	flashcard.creator = req.user;
	flashcard.bin = "bin0";
	flashcard.lastSeen = new Date();


	flashcard.save(function(err){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			User.findOneAndUpdate({
				_id: req.user._id
			}, { $push: {bin0: flashcard} 
			}, function(err, user){
				if(err){
					res.send("Error");	
				}else{
					res.redirect("/");
					//res.json(flashcard);
				}
			});
			//res.json(flashcard);
		}
	});
};

exports.list = function(req, res) {

	//change the find to find by user from req
	Flashcard.find().sort('-created').populate('creator').
	exec(function(err, flashcards){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(flashcards);
		}
	});
};

exports.delete = function(req, res){
	var flashcard = req.flashcard;

	flashcard.remove(function(err){
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(flashcard);
		}
	});
};