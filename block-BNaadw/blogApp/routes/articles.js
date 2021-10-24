var express = require('express');
var router = express.Router();

var Event = require('../models/article');
var Remark = require('../models/remark');
var User = require('../models/User');





// For rendering article and create form => GET on "/books/new"
router.get('/new', (req, res, next) => {
    res.render('addEvent');
});

// send data
router.post('/', (req, res, next) => {
  Event.create(req.body, (err, createEvent) => {
    if (err) return next(err);
    res.redirect('/events');
  });
});


// Fetch Single event
router.get('/:id', (req, res, next) => {
    var id = req.params.id;
    Event.findById(id).populate('remark').exec((err, event) => {
        console.log(event);
        
    res.render('singleEvents', { event: event })
   });
});

// Edit event operation
router.get('/:id/edit', function (req, res, next) {
  var id = req.params.id;
  Event.findById(id, (err, event) => {
    if (err) return next(err);
    res.render('eventEditForm', { event: event });
  });
});

// Delete Event operation
router.get('/:id/delete', (req, res, next) => {
    var id = req.params.id;
    Event.findByIdAndDelete(id, (err, events) => {
      if (err) return next(err);
      Event.findByIdAndUpdate(events.authorId, { $pull: { booksId: events._id }},
            (err, author) => {
                res.redirect('/events/');
            }
        );
    });
});
 

router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  Event.findByIdAndUpdate(id, req.body, (err, updateEvent) => {
    if (err) return next(err);
    res.redirect('/events/' + id);
  });
});

// increment likes
router.get('/:id/likes', (req, res, next) => {
    var id = req.params.id;
     Event.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, article) => {
      if (err) return next(err);
      res.redirect('/events/' + id);
    });
  });

//  increment dislikes
router.get('/:id/dislikes', (req, res, next) => {
    var id = req.params.id;
    Event.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, article) => {
        if (err) return next(err);
        res.redirect('/events/' + id);
    });  
});

// Remarks send
router.post('/:eventId/remark', (req, res, next) => {

  var eventId = req.params.eventId;
  console.log(req.body);
  req.body.eventId = eventId;
  Remark.create(req.body, (err, remark) => { //newly created remark
    if (err) return next(err);
    Event.findByIdAndUpdate(eventId, { $push: { remark: remark.id }}, (err, updatedEvent) => {
        if (err) return next(err);
        res.redirect('/events/' + eventId);
      });
    });
});



module.exports = router;