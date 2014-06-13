/**
 * @requires:  raphael.js
 *
 *
 */
var fabricateSvgStepNavigation = function () {

	var ANIMATION_TIME=150;
	var EASING='elastic';

	//new
	var _raphaelPaper;
	var _paperHeight;
	var _paperWidth;
	var _currentStep = 0;
	var _currentSubNavStep = 0;
	var _totalCurrentSubnavSteps;
	var _radius=10;
	var _stepsArray;
	var _viewObjectsArray=[];
	var _totalSteps;
	var _lineObj;
	var _statusColorHash = {
		active: 'blue',
		error: 'red', 
		done: 'green', 
		upcoming: 'grey'
	}

	// private view helpers
	function initializeView() {
		addLineToView();
		addStepsToView();
		
	}
	function addStepsToView() {
		var stepWidth = (_paperWidth/_totalSteps)-(_paperWidth/_totalSteps)/_totalSteps;
		for (var i=0;i<_totalSteps;i++) {
			// Creates circle at x = 50, y = 40, with radius 10
			var circle = _raphaelPaper.circle(stepWidth*(i+1), _paperHeight/2, 10);
			// Sets the fill attribute of the circle to red (#f00)
			circle.attr("fill", _statusColorHash[_stepsArray[i]['status']]);
			// Sets the stroke attribute of the circle to white
			circle.attr("stroke", "none");

			_viewObjectsArray.push(circle);
			if (_stepsArray[i]['callback']) {

				//{0: circle, node: circle, id: 2, matrix: o, realPath: null, paper: C…}
				circle.click(_stepsArray[i]['callback']);
			}
		}
	}
	function addLineToView() {
		// startx starty endx endy
		var x = (_paperWidth/_totalSteps)-(_paperWidth/_totalSteps)/_totalSteps;
		var y = _paperHeight/2;
		var endX = x * _totalSteps;

		// @see: http://raphaeljs.com/reference.html#Paper.path
		_lineObj = _raphaelPaper.path("M"+x+" "+y+"L"+endX+" "+y);
	}
	function popCircle(circleObj) {
		
		circleObj.animate({r:_radius*1.20},ANIMATION_TIME,EASING);
	}
	function pumpCircle(circleObj) {
		
		circleObj.animate({r:_radius*1.20},ANIMATION_TIME/2,EASING,function(){
            this.animate( { r:_radius } , ANIMATION_TIME/2 );
        });
	}
	function normalizeCircle(circleObj) {
		circleObj.animate({r:_radius},ANIMATION_TIME,EASING);
	}


	//function setStatusView
	
    return {
		// for the outside
		init: function(raphaelPaper,stepsArray,radius) {
			_raphaelPaper = raphaelPaper;
			_paperWidth = raphaelPaper.width;
			_paperHeight = raphaelPaper.height;
			_stepsArray = stepsArray;
			_totalSteps = stepsArray.length;
			if (radius)
				_radius=radius;
			initializeView();
		},
		next: function(error) {
			// TODO: add subnav logic
			if (!!!error) {
				
				if (_currentStep<_totalSteps) {
					SvgStepNavigation.setStatus(_currentStep,'done');

					_currentStep++;
					if (_currentStep<_totalSteps)
						SvgStepNavigation.setStatus(_currentStep,'active');
				}
			} else {
				SvgStepNavigation.setStatus(_currentStep,'error');
			}
		},
		prev: function() {
			// grey or green out depending on current validation??
		},
		to: function(stepNo) {
			
		},
		// active, error, done, upcoming
		setStatus: function (stepNo,newStatus) {
			_stepsArray[stepNo]['status'] = newStatus;
			var vst=_viewObjectsArray[stepNo];
			// animations ? 
			if (vst) {
				if (newStatus=='error') {
					vst.attr('fill', _statusColorHash['error']);
					pumpCircle(vst);
				} else if (newStatus=='done') {
					vst.attr('fill', _statusColorHash['done']);
					normalizeCircle(vst)
				} else if (newStatus=='active') {
					vst.attr('fill', _statusColorHash['active']);
					popCircle(vst);
				}
				else if (newStatus=='upcoming') {
					vst.attr('fill', _statusColorHash['upcoming']);
				}
			}

		},
		addSubnav: function (toStep) {
			console.log('adding subnavigation to step: '+ toStep);
			// move sourrounding to side
			// spread subnav dots
			// add callbacks
			// next prev logic?? stuff it into ::next()

		}

		
    };
};

var SvgStepNavigation=fabricateSvgStepNavigation();
