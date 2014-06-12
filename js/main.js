
var canvas = Raphael(document.getElementById("canvas"), 600, 100);
// Creates circle at x = 50, y = 40, with radius 10
//var circle = canvas.circle(50, 40, 10);
// Sets the fill attribute of the circle to red (#f00)
//circle.attr("fill", "#f00");

// Sets the stroke attribute of the circle to white
//circle.attr("stroke", "none");

// active, error, done, upcoming
var exampleStepsArray = [
	{
		label: 'some text',
		status: 'active',
		callback: function(event){console.log(exampleStepsArray[0].label);}
	},
	{
		label: 'some other text',
		status: 'upcoming',
		callback: function(event){console.log(exampleStepsArray[1].label);}
	},
	{
		label: 'some text',
		status: 'upcoming',
	},
	{
		label: 'some text',
		status: 'upcoming',
	},
	{
		label: 'some text',
		status: 'upcoming',
	},
	{
		label: 'some text',
		status: 'upcoming',
	},
	{
		label: 'some text',
		status: 'upcoming',
	},
	{
		label: 'some text',
		status: 'upcoming',
	},
	{
		label: 'some text',
		status: 'upcoming',
	}
];


SvgStepNavigation.init(canvas,exampleStepsArray);
