/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Sessions
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
Session.setDefault('sort', {name: 1});
Session.setDefault('showRecordDetail', false);
Session.setDefault('currentRecord', null);


var arrClient = ['All', 'CSG Biller'];
var arrRequesting = ['CSG Event Notification', 'Event Notification'];
var arrImpacting = ['Centric Interfaces', 'SmartLink BOS'];
var arrRequired = [true, false];
var arrInternal = [true, false];
Session.setDefault('query-client', arrClient);
Session.setDefault('query-requesting', arrRequesting);
Session.setDefault('query-impacting', arrImpacting);
Session.setDefault('query-required', arrRequired);
Session.setDefault('query-internal', arrInternal);
Session.setDefault('query-startDate', '');
Session.setDefault('query-endDate', '');



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Body
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helper
Template.body.helpers({
	count: function () {
		recordsColl = Session.get('recordsColl');
		if (recordsColl.length == 0) {
			return 'No matches'
		} else {
			if (recordsColl.length == 1) {
				return '1 match'
			}
			return recordsColl.length + ' matches' 
		}
	}
});

// Events
Template.body.events({
	'change #startDate': function (event, template) {
		var selected = template.findAll("input#startDate");
		Session.set('query-startDate', selected[0].value);
	},
	'change #endDate': function (event, template) {
		var selected = template.findAll("input#endDate");
		Session.set('query-endDate', selected[0].value);
	}
});

// Rendered
Template.body.rendered = function() {
	$('#startDate').datepicker({
		autoclose: true,
	    todayHighlight: true    	
	});
	$('#endDate').datepicker({
		autoclose: true,
	    todayHighlight: true    	
	});
	// $('.sidebar-nav').affix();
}



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Modals
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.modals.helpers({
	showRecordDetail: function () {
		return Session.get('showRecordDetail');
	}
});


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Show Detail
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers
Template.show_detail.helpers({
	detail: function () {
		var currentId = Session.get('currentRecord');
		return Records.find({_id: currentId}).fetch();
	}
});

// Events
Template.show_detail.events({
	'click .hide-modal': function () {
		Session.set('showRecordDetail', false);
	}
});

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Records
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.records.helpers({
	record: function () {
		var numStartDate = dateToUnix(Session.get('query-startDate'));
		var numEndDate = dateToUnix(Session.get('query-endDate'));
		var arrClient = Session.get('query-client');
		var arrRequesting = Session.get('query-requesting');
		var arrImpacting = Session.get('query-impacting');
		var arrRequired = Session.get('query-required');
		var arrInternal = Session.get('query-internal');
		// console.log(arrRequired)
		var recordsColl = Records.find( 
			{ $and: [ 
				  { date: {$gte: numStartDate, $lte: numEndDate}}
				, { client: {$in: arrClient } }
				, { requesting: {$in: arrRequesting } }
				, { impacting: {$in: arrImpacting } }
				, { required: {$in: arrRequired } }
				, { internal: {$in: arrInternal } }
			] }, 
			{ sort: Session.get('sort') } )
		.fetch();
		Session.set('recordsColl', recordsColl);
		return recordsColl;
	},
	// formatImpacting: function (list) {
	// var array = [];
	// _.each(list, function (item) {
	// 	array.push('! '+item+' !');
	// });	
	// return array;
	// }
});

// Events
Template.records.events({
	'click .nameUp': function () {
		Session.set('sort', {name: 1})
	},
	'click .nameDn': function () {
		Session.set('sort', {name: -1});
	},
	'click .clientUp': function () {
		Session.set('sort', {client: 1})
	},
	'click .clientDn': function () {
		Session.set('sort', {client: -1});
	},
	'click .requestingUp': function () {
		Session.set('sort', {requesting: 1})
	},
	'click .requestingDn': function () {
		Session.set('sort', {requesting: -1});
	},
	'click .impactingUp': function () {
		Session.set('sort', {impacting: 1})
	},
	'click .impactingDn': function () {
		Session.set('sort', {impacting: -1});
	},
	'click .record': function () {
		Session.set('currentRecord', this._id);
		Session.set('showRecordDetail', true);
	}
});



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* All Filters
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.clients.helpers({
	client: function () {
		var recordsColl = Records.find({ date: {$gte: dateToUnix(Session.get('query-startDate')), $lte: dateToUnix(Session.get('query-endDate'))}}).fetch();
		var clientColl = _.chain(recordsColl).pluck('client').uniq().sort().value();
		return clientColl;
	}
});

Template.required.helpers({
	required: function () {
		return Records.find({ date: {$gte: dateToUnix(Session.get('query-startDate')), $lte: dateToUnix(Session.get('query-endDate'))}}).fetch();
	}
});

Template.internal.helpers({
	internal: function () {
		return Records.find({ date: {$gte: dateToUnix(Session.get('query-startDate')), $lte: dateToUnix(Session.get('query-endDate'))}}).fetch();
	}
});

Template.requestings.helpers({
	requesting: function () {
		var recordsColl = Records.find({ date: {$gte: dateToUnix(Session.get('query-startDate')), $lte: dateToUnix(Session.get('query-endDate'))}}).fetch();
		var requestingColl = _.chain(recordsColl).pluck('requesting').uniq().sort().value();
		return requestingColl;
	}
});

Template.impactings.helpers({
	impacting: function () {
		var recordsColl = Records.find({ date: {$gte: dateToUnix(Session.get('query-startDate')), $lte: dateToUnix(Session.get('query-endDate'))}}).fetch();
		var impactingColl = _.chain(recordsColl).pluck('impacting').flatten().uniq().sort().value();
		return impactingColl;
	}
});

// Events
Template.clients.events({
	'change .client': function (event, template) {
		var selected = template.findAll("input[type=checkbox]:checked");
		var array = createList(selected);
		Session.set('query-client', array);
	},
	'click .toggle-client': function (event, template) {
		var checkboxes = document.getElementsByName('filter-client');
		var master = document.getElementsByName('toggle-client');
		for(var i=0, n=checkboxes.length; i<n; i++) {
			if (master[0].checked) {
				checkboxes[i].checked = false;				
			} else {
				checkboxes[i].checked = true;
			}
		}
		var selected = template.findAll("input[type=checkbox]:checked");
		var array = createList(selected);
		Session.set('query-client', array);
	}
});

Template.required.events({
	'change .required': function (event, template) {
		var selected = template.findAll("input[type=checkbox]:checked");
		var array = createList(selected);
		Session.set('query-required', array);
	},
	'click .toggle-required': function (event, template) {
		var checkboxes = document.getElementsByName('filter-required');
		var master = document.getElementsByName('toggle-required');
		for(var i=0, n=checkboxes.length; i<n; i++) {
			if (master[0].checked) {
				checkboxes[i].checked = false;				
			} else {
				checkboxes[i].checked = true;
			}
		}
		var selected = template.findAll("input[type=checkbox]:checked");
		var array = createList(selected);
		Session.set('query-required', array);
	}
});

Template.internal.events({
	'change .internal': function (event, template) {
		var selected = template.findAll("input[type=checkbox]:checked");
		var array = createList(selected);
		Session.set('query-internal', array);
	},
	'click .toggle-internal': function (event, template) {
		var checkboxes = document.getElementsByName('filter-internal');
		var master = document.getElementsByName('toggle-internal');
		for(var i=0, n=checkboxes.length; i<n; i++) {
			if (master[0].checked) {
				checkboxes[i].checked = false;				
			} else {
				checkboxes[i].checked = true;
			}
		}
		var selected = template.findAll("input[type=checkbox]:checked");
		var array = createList(selected);
		Session.set('query-internal', array);
	}
});

Template.requestings.events({
	'change .requesting': function (event, template) {
		var selected = template.findAll("input[type=checkbox]:checked");
		var array = createList(selected);
		Session.set('query-requesting', array);
	},
	'click .toggle-requesting': function (event, template) {
		var checkboxes = document.getElementsByName('filter-requesting');
		var master = document.getElementsByName('toggle-requesting');
		for(var i=0, n=checkboxes.length; i<n; i++) {
			if (master[0].checked) {
				checkboxes[i].checked = false;				
			} else {
				checkboxes[i].checked = true;
			}
		}
		var selected = template.findAll("input[type=checkbox]:checked");
		var array = createList(selected);
		Session.set('query-requesting', array);
	}
});

Template.impactings.events({
	'change .impacting': function (event, template) {
		var selected = template.findAll("input[type=checkbox]:checked");
		var array = createList(selected);
		Session.set('query-impacting', array);
	},
	'click .toggle-impacting': function (event, template) {
		var checkboxes = document.getElementsByName('filter-impacting');
		var master = document.getElementsByName('toggle-impacting');
		for(var i=0, n=checkboxes.length; i<n; i++) {
			if (master[0].checked) {
				checkboxes[i].checked = false;				
			} else {
				checkboxes[i].checked = true;
			}
		}
		var selected = template.findAll("input[type=checkbox]:checked");
		var array = createList(selected);
		Session.set('query-impacting', array);
	}
});



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Register Helpers
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

Template.registerHelper('formatDate', function (date) {
	return moment.unix(date).format("MM/DD/YYYY");
});



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* Functions
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

var dateToUnix = function (date) {
	if (date != '') {
		return moment(date).unix();
	}
}

var createList = function (list) {
	var array = [];
	_.each(list, function (item) {
		if (item.defaultValue === "true") {
			array.push(true);
		} else if (item.defaultValue === "false") {
			array.push(false);
		} else {
			array.push(item.defaultValue);			
		}
	});	
	console.log(array);
	return array;
}
