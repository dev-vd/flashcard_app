var User = require('mongoose').model('User'),
	Flashcard = require('mongoose').model('Flashcard'),
	passport = require('passport');

var getErrorMessage = function(err){
  var message = '';

  if (err.code){
    switch (err.code){
      case 11000:
      case 11001:
        message = 'Username already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  return message;
};

exports.renderSignin = function(req, res, next){
  if (!req.user) {
    res.render('signin',{
      title: 'Sign-in Form',
      messages: req.flash('error') || req.flash('info')
    });
  } else {
    return res.redirect('/');
  }
};

exports.renderSignup = function(req, res, next) {
  if (!req.user) {
    res.render('signup',{
      title: 'Sign-up Form',
      messages: req.flash('error')
    });
  } else {
    return res.redirect('/');
  }
};

exports.signup = function(req, res, next) {
  if (!req.user) {
    var user = new User(req.body);
    var message = null;

    user.provider='local';

    user.save(function(err){
      if (err){
        var message = getErrorMessage(err);

        req.flash('error', message);
        return res.redirect('/signup');
      }
      req.login(user, function(err){
        if (err) return next(err);
        return res.redirect('/');
      });
    });
  } else {
    return res.redirect('/');
  }
};

exports.signout = function(req, res){
  req.logout();
  res.redirect('/');
};

exports.create = function(req,res,next){
   var user = new User(req.body);
   user.save(function(err){
      if(err) {
         return next(err);
      } else {
         res.json(user);
      }
   });
};

var tempDone = function(req,res){
  res.json(new Flashcard({word:"You are temporarily done;", defenition:" please come back later to review more words."}));
}

var permDone = function(req, res){
  res.json(new Flashcard({word:"You have no more words to review", defenition:" you are permanently done."}));
}


var addToCurrent = function(req, res){
    var user=req.user;
    var bin0 = user.bin0;
    var bin1 = user.bin1;
    var bin2 = user.bin2;
    var bin3 = user.bin3;
    var bin4 = user.bin4;
    var bin5 = user.bin5;
    var bin6 = user.bin6;
    var bin7 = user.bin7;
    var bin8 = user.bin8;
    var bin9 = user.bin9;
    var bin10 = user.bin10;
    var binCurrent = user.binCurrent;
    var date = new Date().getTime();
    while(bin10.length>0){
      var difference = date-new Date(bin10[0].lastSeen).getTime();
      if(difference>10510000000){
        binCurrent.push(bin10.shift());
      }else{break;}
    }
    while(bin9.length>0){
      var difference = date-new Date(bin9[0].lastSeen).getTime();
      if(difference>2160000000){
        binCurrent.push(bin9.shift());
      }else{break;}
    }
    while(bin8.length>0){
      var difference = date-new Date(bin8[0].lastSeen).getTime();
      if(difference>432000000){
        binCurrent.push(bin8.shift());
      }else{break;}
    }
    while(bin7.length>0){
      var difference = date-new Date(bin7[0].lastSeen).getTime();
      if(difference>86400000){
        binCurrent.push(bin7.shift());
      }else{break;}
    }
    while(bin6.length>0){
      var difference = date-new Date(bin6[0].lastSeen).getTime();
      if(difference>18000000){
        binCurrent.push(bin6.shift());
      }else{break;}
    }
    while(bin5.length>0){
      var difference = date-new Date(bin5[0].lastSeen).getTime();
      if(difference>3600000){
        binCurrent.push(bin5.shift());
      }else{break;}
    }
    while(bin4.length>0){
      var difference = date-new Date(bin4[0].lastSeen).getTime();
      if(difference>600000){
        binCurrent.push(bin4.shift());
      }else{break;}
    }
    while(bin3.length>0){
      var difference = date-new Date(bin3[0].lastSeen).getTime();
      if(difference>120000){
        binCurrent.push(bin3.shift());
      }else{break;}
    }
    while(bin2.length>0){
      var difference = date-new Date(bin2[0].lastSeen).getTime();
    //  console.log("the difference is " +bin2[0].lastSeen);
     // console.log("the bin is "+Flashcard.find(bin2[0]).bin);
      if(difference>25000){
        binCurrent.push(bin2.shift());
      }else{break;}
    }
    while(bin1.length>0){
      var difference = date-new Date(bin1[0].lastSeen).getTime();
      if(difference>5000){
        binCurrent.push(bin1.shift());
      }else{break;}
    }
    while(bin0.length>0){
        binCurrent.push(bin0.shift());
    }
    user.bin0=bin0;
    user.bin1=bin1;
    user.bin2=bin2;
    user.bin3=bin3;
    user.bin4=bin4;
    user.bin5=bin5;
    user.bin6=bin6;
    user.bin7=bin7;
    user.bin8=bin8;
    user.bin9=bin9;
    user.bin10=bin10;
    user.binCurrent=binCurrent;

    //var difference=date.getTime()-new Date(user.binCurrent[0].lastSeen).getTime();
    //console.log("The date is "+date.getTime());
   // console.log("last seen is "+user.binCurrent[0].lastSeen);
   // console.log("date differnce "+difference);
    user.save(function(err){
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err)
        });
      } else {

        if(binCurrent.length==0){
          var wordsLeft=bin0.length+bin1.length+bin2.length;
          wordsLeft=wordsLeft+bin3.length+bin4.length+bin5.length;
          wordsLeft=wordsLeft+bin6.length+bin7.length+bin8.length;
          wordsLeft=wordsLeft+bin9.length+bin10.length;
          if(wordsLeft==0){
            return permDone(req, res);
          }else{
            return tempDone(req, res);
          }
        }else{
          res.json(new Flashcard(user.binCurrent[0]));
        }
      }
    });
}

var wordsLeft = function(user){
    var bin0 = user.bin0;
    var bin1 = user.bin1;
    var bin2 = user.bin2;
    var bin3 = user.bin3;
    var bin4 = user.bin4;
    var bin5 = user.bin5;
    var bin6 = user.bin6;
    var bin7 = user.bin7;
    var bin8 = user.bin8;
    var bin9 = user.bin9;
    var bin10 = user.bin10;
    var binCurrent = user.binCurrent;
    var wordsLeft=bin0.length+bin1.length+bin2.length;
    wordsLeft=wordsLeft+bin3.length+bin4.length+bin5.length;
    wordsLeft=wordsLeft+bin6.length+bin7.length+bin8.length;
    wordsLeft=wordsLeft+bin9.length+bin10.length;
    return wordsLeft;
}

var getNextBinGotIt = function(bin){
  if(bin=="bin0"){return "bin1";}
  if(bin=="bin1"){return "bin2";}
  if(bin=="bin2"){return "bin3";}
  if(bin=="bin3"){return "bin4";}
  if(bin=="bin4"){return "bin5";}
  if(bin=="bin5"){return "bin6";}
  if(bin=="bin6"){return "bin7";}
  if(bin=="bin7"){return "bin8";}
  if(bin=="bin8"){return "bin9";}
  if(bin=="bin9"){return "bin10";}
  if(bin=="bin10"){return "bin11"};
}

var getNextBinNotGotIt = function(bin, wrong){
    if(wrong==10){return "binHardToRemember";}
    if(bin=="bin0"){return "bin1";}
    if(bin=="bin1"){return "bin1";}
    if(bin=="bin2"){return "bin1";}
    if(bin=="bin3"){return "bin2";}
    if(bin=="bin4"){return "bin3";}
    if(bin=="bin5"){return "bin4";}
    if(bin=="bin6"){return "bin5";}
    if(bin=="bin7"){return "bin6";}
    if(bin=="bin8"){return "bin7";}
    if(bin=="bin9"){return "bin8";}
    if(bin=="bin10"){return "bin9";}

}

exports.next = function(req, res){
  req.gotIt="next"
  sendNextFlashcard(req, res);
}

exports.GotIt = function(req, res){
  req.gotIt="gotit";
  var user=req.user;
  //if(wordsLeft(req.user)==0){return permDone(req, res);}
  if(req.user.binCurrent==0){return addToCurrent(req, res);}
  var flashcard = user.binCurrent[0];
  console.log("got it flashcard is"+flashcard);
  var corr=flashcard.correct;
  var bin=getNextBinGotIt(flashcard.bin);
  var binCurrent=user.binCurrent;
  var binTmp=user[bin];
  corr=corr+1;
  flashcard.correct=corr;
  flashcard.bin=bin;
  flashcard.lastSeen=Date();
  user.binCurrent[0]=flashcard;
  binTmp.push(binCurrent.shift());
  user.binCurrent=binCurrent;
  user[bin]=binTmp;
  user.save(function(err){
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err)
        });
      } else {
            return sendNextFlashcard(req, res);
      }
    });
}

exports.NotGotIt = function(req, res){
  req.gotIt="notgotit";
  var user=req.user;
  //if(wordsLeft(req.user)==0){return permDone(req, res);}
  if(req.user.binCurrent==0){return addToCurrent(req, res);}
  var flashcard = user.binCurrent[0];
  var wrong = flashcard.wrong;
  var bin=getNextBinNotGotIt(flashcard.bin);
  var binCurrent=user.binCurrent;
  wrong=wrong+1;
  if(wrong>=10){bin="binHardToRemember";}
  var binTmp=user[bin];
  flashcard.wrong=wrong;
  flashcard.bin=bin;
  flashcard.lastSeen=Date();
  user.binCurrent[0]=flashcard;
  binTmp.push(binCurrent.shift());
  user.binCurrent=binCurrent;
  user[bin]=binTmp;
  user.save(function(err){
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err)
        });
      } else {
            return sendNextFlashcard(req, res);
      }
    });
}

var sendNextFlashcard = function(req, res){
  var user = req.user;
  if(user.binCurrent.length>0){
    res.json(user.binCurrent[0]);
  }else{
    return addToCurrent(req, res);
  }
}

exports.requiresLogin = function(req, res, next){
  if(!req.isAuthenticated()){
    return res.status(401).send({
      message: 'User is not logged in'
    });
  }

  next();
};

exports.renderCreate = function(req, res, next) {
     res.render('flashcard',{
       title: 'Create Flashcard'
     });
};

exports.createFlashcard = function(req, res){
   var flashcard = new Flashcard(req.body);
   flashcard.creator = req.user;
   flashcard.bin = "bin0";
   flashcard.lastSeen = new Date();
   flashcard.correct=0;
   flashcard.wrong=0;
   console.log("The create Flashcard function was called");
   console.log("The flashcard is"+flashcard);
   var user=req.user;
   user.bin0.push(flashcard);
   user.save(function(err){
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err)
        });
      } else {
        res.redirect("/");
      }
    });
};


exports.listFlashcards = function(req, res) {
  var user = req.user;
  var fcs = user.bin0;
  fcs = fcs.concat(user.bin1,user.bin2,user.bin3,user.bin4);
  fcs = fcs.concat(user.bin5, user.bin6, user.bin7, user.bin8);
  fcs = fcs.concat(user.bin9, user.bin10, user.bin11, user.binCurrent);
  fcs = fcs.concat(user.binHardToRemember);
  res.render('flashcardslist',{
      title: 'List of Flashcards',
      flashcards: fcs
    });
};