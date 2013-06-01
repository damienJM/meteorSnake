
var scope = new paper.PaperScope();

snake = new Meteor.Collection("snake");
windows = new Meteor.Collection("windows");
Session.setDefault("window","1");
//Session.set("window","1");


  Template.wrapper.greeting = function () {
   return "Welcome to snake.";
  };
  Template.wrapper.dots = function(){
   //return dots.find({window:Session.get("window")});
  };
  
  Template.wrapper.events({
  	/*
	'click input.add_win1': function(){
		dots.insert({name:"dot1",window:'1',score:"0"});
	},
	'click input.add_win2': function(){
		dots.insert({name:"dot2",window:'2',score:"0"});
	},
	
	'click input.win1': function(){
		Session.set("window","1");
	},
	'click input.win2': function(){
		Session.set("window","2");
	}
	*/
		
	});
Meteor.startup(function(){
	sent = 0;
	points = 10;
 	lineSize = 1;
	scope.setup('myCanvas');
	
	//path1 = new scope.Path.Rectangle(new scope.Point(350,350), new scope.Size(50,50));
	//path1.fillColor = 'black'; 
 	 path2 = new scope.Path({
			strokeColor: '#e4141b',
			strokeWidth: 2,
			strokeCap: 'round'	 		
	 		});
	 path = new scope.Path({
			strokeColor: '#e4141b',
			strokeWidth: 2,
			strokeCap: 'round'	 		
	 		});   
    direction = [-lineSize,0];
	var start=[0,0];
	var next = [0,0];
	start[0]=paper.view.center.x;
	start[1]=paper.view.center.y;
	
	
	console.log(start);
	
	path.add(new scope.Point(start));
	for (var i = 0; i<points; i++){
		var next = start[0]+i*lineSize;
		path.add([next,start[1]]);
		
		
	}
	
	sendtoDB(path,'set');
	
	})
Template.canvas.rendered = function(){
   
	//var snakesvg = path.exportSVG(); 
	//var snakesvg = JSON.stringify(path); 
	//console.log(snakesvg);	
	
	//console.log(new scope.Point(lineSize,0));
	//scope.view.draw();
scope.tool.onKeyUp = function(event){
		switch(event.key) {
          case 'up':
            if (direction[1] != lineSize) { // not down
              direction = [0, -lineSize];
            }
            break;
          case 'down':
            if (direction[1] != -lineSize) {
              direction = [0, lineSize];
            }
            break;
          case 'left':
            if (direction[0] != lineSize) {
              direction = [-lineSize, 0];
            }
            break;
          case 'right':
            if (direction[0] != -lineSize) {
              direction = [lineSize, 0];
            }
            break;
        }	
	}
//console.log(path);
//console.log(path.segments[20]);
path.onFrame = function(event){
	//path1.rotate(4);
	if(collision()){
		//console.log('collision');
		}
	else{
	moveSnake();
	sendtoDB(path,'update');
	getSnake();
	//console.log(event.count)
}	
	}

};

Template.canvas.events({
	
	'mousedown':function(){
		//path.fullySelected = true;
		sendtoDB(path);
		path.strokeColor = '#e08285';
		
	},
	'mouseup':function(){
		path.fullySelected = false;
		path.strokeColor = '#e4141b';
	},
	
	'mousemove': function (event){
	 	scope.tool.onMouseMove = function(event){
		
		}
	
	},
	'keyup': function(){
		
		console.log('test');		
		
	}

});

function sendtoDB(path,method){
	
	//var snakepath = EJSON.fromJSONValue(path);
	var p = path.exportSVG();
			
			d = $(p).attr('points');
			//var id = path.__id;
//console.log(d);
			var bounds = path.bounds;

			var values = {
				points:d	
			}
	if(method == 'set'){		
			var id = snake.insert(values, function(err){

					if(err){console.log(err)}
					
				});
//console.log(id);
			Session.set("snakeID",id);				
	}
	if(method == 'update'){
		snake.update({'_id':Session.get("snakeID")},{$set:{points:d}}, function(err){			

					if(err){console.log(err)}
				});
		//console.log('updated');	
		//console.log(id);	
		}

	}
	
function moveSnake() {
  var previousPoint = new scope.Point(path.segments[0].point);
  
  path.segments[0].point.x = path.segments[0].point.x + direction[0];
  path.segments[0].point.y = path.segments[0].point.y + direction[1];
  for (var i = 1; i < points+1; i++) {
    var tempPoint = new scope.Point(path.segments[i].point);
    path.segments[i].point = new scope.Point(previousPoint.x, previousPoint.y);
    previousPoint = tempPoint;
    
  }
}

function collision() {
  var nextPoint = new scope.Point(path.segments[0].point.x + direction[0],path.segments[0].point.y + direction[1]);
  
  for (var i = 0; i < points-1; i++) {
  	
    if ((nextPoint.x == path.segments[i].point.x && nextPoint.y == path.segments[i].point.y)|| nextPoint.x < 0 || nextPoint.x > scope.view.bounds.width || nextPoint.y < 0 || nextPoint.y > scope.view.bounds.height) {
		            
      return true;
    }
    
  }
  return false;
}

function getSnake() {

	 
	var snakes = snake.find().fetch()[0];
	var newPoints = new Array();
	var snakeSegments = snakes.points.split(" ");
	for(var i=0; i<snakeSegments.length; i++){
		var temp = snakeSegments[i].split(",");
		newPoints[i]=temp;
		//newPoints[i][1] = temp[1];
			
			
		
		}
		//console.log(newPoints[0][0]);
	var segments = path2.removeSegments();
	path2.add = newPoints;
	//path.segments = [[20, 20], [80, 80], [140, 20]];
	//console.log(newPoints);	
	
	}