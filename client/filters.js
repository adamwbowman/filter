
Session.setDefault('query-category', 'Cat1');
Session.setDefault('sort', {name: 1});

var arrColors = ['green', 'brown', 'yellow', 'red'];
var arrProducts = ['prodA', 'prodB', 'prodC', 'prodD'];
Session.setDefault('query-color', arrColors);
Session.setDefault('query-product', arrProducts);

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* categories
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.categories.helpers({
	category: function () {
		return Categories.find({}).fetch();
	}
});

// Events
Template.categories.events({
	'click .category': function () {
		Session.set('query-category', this.name);
	}
});

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* records
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.records.helpers({
	record: function () {
		var arrProducts = Session.get('query-product');
		var arrColors = Session.get('query-color');
		var recordsColl = Records.find( 
			{ $and: [ 
				{ category: Session.get('query-category') },
				{ product: { $in: arrProducts } }, 
				{ color: { $in: arrColors } } ] }, 
			{ sort: Session.get('sort') } )
		.fetch();
	
		Session.set('recordsColl', recordsColl);
		return recordsColl;
	}
});

// Events
Template.records.events({
	'click .idUp': function () {
		Session.set('sort', {_id: 1})
	},
	'click .idDn': function () {
		Session.set('sort', {_id: -1});
	},
	'click .nameUp': function () {
		Session.set('sort', {name: 1})
	},
	'click .nameDn': function () {
		Session.set('sort', {name: -1});
	},
	'click .productUp': function () {
		Session.set('sort', {product: 1})
	},
	'click .productDn': function () {
		Session.set('sort', {product: -1});
	},
	'click .colorUp': function () {
		Session.set('sort', {color: 1})
	},
	'click .colorDn': function () {
		Session.set('sort', {color: -1});
	},
	'click .categoryUp': function () {
		Session.set('sort', {category: 1})
	},
	'click .categoryDn': function () {
		Session.set('sort', {category: -1});
	},
	'click .dateUp': function () {
		Session.set('sort', {date: 1})
	},
	'click .dateDn': function () {
		Session.set('sort', {date: -1});
	}
});

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* filters
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Helpers 
Template.products.helpers({
	product: function () {
		var recordsColl = Records.find({category: Session.get('query-category') }).fetch();
		var productColl = _.chain(recordsColl).pluck('product').uniq().sort().value();
		return productColl;
	}
});

Template.colors.helpers({
	color: function () {
		var recordsColl = Records.find({category: Session.get('query-category') }).fetch();
		var colorColl = _.chain(recordsColl).pluck('color').uniq().sort().value();
		return colorColl;
	}
});

// Events
Template.products.events({
	'change .product': function (event, template) {
		var selected = template.findAll("input[type=checkbox]:checked");
		var array = [];
		_.each(selected, function (item) {
			array.push(item.defaultValue);
		});
		Session.set('query-product', array);
	},
	'click .toggle-product': function (event, template) {
		var checkboxes = document.getElementsByName('filter-product');
		for(var i=0, n=checkboxes.length; i<n; i++) {
			if (checkboxes[i].checked) {
				checkboxes[i].checked = false;				
			} else {
				checkboxes[i].checked = true;
			}

		}
	}
});

Template.colors.events({
	'change .color': function (event, template) {
		var selected = template.findAll("input[type=checkbox]:checked");
		var array = [];
		_.each(selected, function (item) {
			array.push(item.defaultValue);
		});
		Session.set('query-color', array);
	}
});

Template.registerHelper('formatDate', function (date) {
	return moment.unix(date).format("MM/DD/YYYY HH:mm");
});