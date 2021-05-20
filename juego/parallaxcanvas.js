//Parametros ( constantes )
var constants = { 

	CANVAS_WIDTH: 160,
	CANVAS_HEIGHT: 144,
	VELOCITY_SCROLL :0,
	LAYER_SPEEDS : [
		0.7,
		0.6,
		0.5,
		0.4,
		0.3,
		0.2,
		0.1
	],
	ACELERATION : 0.01,
	ZOOM : 1,
	LAYER_Y : [
		0,
		0,
		20,
		16,
		16,
		94,
		98
	],
	SPIKES_POSITION : 100,
	SPIKES_PARALLAX : 0.2,
	SPIKES_Z :7,
	LAYER_Z : [
		0, 
		0,
		5,
		4,
		3,
		5,
		12
	],
	JUMP_PARALLAX:[
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,1,1,2,2,1,1,0,0]
	],
	CAT_X : 120,
	CAT_Y : 55,
	CAT_ANIMATION_SPEED : 5,
	
	CAT_ANIMATION_RUN:[0,1,2,3,4],
	CAT_ANIMATION_JUMP:[5,6,7,8,9,10,11,12,13,14],
	
}
var salto_sonido = new Audio("juego/salto.wav");
var ouch_sonido = new Audio("juego/ouch.wav");
var intro_sonido = new Audio("juego/intro.wav");

var escene = 0;
var spikesCounter0 = 0;
var spikesCounter1 = -200;
var spikeReset = false;
var spikeWait = 0;
var virtual_camera=0;
var cat_jumping = false;
var layer_images = [];
var image_cat ;
var cat_frame = 0;
var game_start= false
var imageQueue=0;
var newSpike = true
var canvas ;
var frameCounter=0;

var ctx ;
//variables scroll
var scroll_max_speed = 7;

//variables frame gato
var muerto = false;
var cat_firstframe = 0
var cat_resetframe = 5
//variable parallax vertical
var vertical_parallax =0

//var puntos
var points_value = 0;
var bestscore = 0;

var title_frame = 0 ;


function ouch(){
	ouch_sonido.currentTime = 0; 
	ouch_sonido.play();
}


// evento al pulsar tecla
document.onkeydown = catjump;

function catjump(){
		if (escene == 1){
		if (cat_jumping == false ){
			cat_jumping = true 
			salto_sonido.currentTime = 0; 
			salto_sonido.play();
			
			cat_frame = 4;
			
	}	
		}
		if (escene == 0){
			frameCounter=0;
			constants.VELOCITY_SCROLL = 0;
			game_start = false
			scroll_max_speed = 7
			constants.ACELERATION = 0.05;
			escene = 1;
			intro_sonido.play();
		}
	}

	function onLoadImage(){
		imageQueue--;
		if(imageQueue==0){
			loopGame();
		}
	}



// evento onload
window.addEventListener('load', function(){
	
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	canvas.width = constants.CANVAS_WIDTH;
	canvas.height = constants.CANVAS_HEIGHT;
	canvas.style.width=(constants.CANVAS_WIDTH*constants.ZOOM)+'px';
	canvas.style.height=(constants.CANVAS_HEIGHT*constants.ZOOM)+'px';

	// cargar imagenes imagequeue ---> imagenes en cola 
	imageQueue=7+6;

	for(i=0; i<7; i++ ){
		layer_images[i] = new Image();
		layer_images[i].onload=onLoadImage;
		layer_images[i].src="juego/background_" + i + ".png";
	}

	image_cat = new Image();
	image_cat.onload=onLoadImage;
	image_cat.src="juego/gato_frames.png";
	
	image_spikes = new Image();
	image_spikes.onload=onLoadImage;
	image_spikes.src="juego/spikes.png";
	
	image_numbers = new Image();
	image_numbers.onload=onLoadImage;
	image_numbers.src="juego/numbers.png";
	
	image_title = new Image();
	image_title.onload=onLoadImage;
	image_title.src="juego/title.png";
	
	image_best = new Image();
	image_best.onload=onLoadImage;
	image_best.src="juego/best.png";

	image_auch = new Image();
	image_auch.onload=onLoadImage;
	image_auch.src="juego/auch.png";

	image_antoni = new Image();
	image_antoni.onload=onLoadImage;
	image_antoni.src="juego/antoni.png";
	
	
}, false);



function drawLayer(i){
	var temp=parseInt(-virtual_camera/ (constants.LAYER_SPEEDS[i]/(constants.VELOCITY_SCROLL*0.1)));
	var layer_y = parseInt ( constants.LAYER_Y[i]+ (vertical_parallax*constants.LAYER_Z[i]));
	ctx.drawImage(layer_images[i],(temp%(layer_images[i].width)),layer_y);
	ctx.drawImage(layer_images[i],(temp%(layer_images[i].width))+layer_images[i].width*1,layer_y );
	ctx.drawImage(layer_images[i],(temp%(layer_images[i].width))-layer_images[i].width*1,layer_y );
	ctx.drawImage(layer_images[i],(temp%(layer_images[i].width))-layer_images[i].width*2,layer_y );

}

function drawSpikes(){
	if (game_start == true ){
		var temp=parseInt(-spikesCounter0/ (constants.SPIKES_PARALLAX/(constants.VELOCITY_SCROLL*0.1)));
		var layer_y = parseInt ( constants.SPIKES_POSITION+ (vertical_parallax*constants.SPIKES_Z));
		//reinicio de los pinchos
		if (temp>300){
			
			resetSpikes()
			
			
			}
				
		//colision
		if (temp>200-40 && temp<220-40 && cat_jumping == false ) {
		frameCounter = 0
		// Esto es una prueva de las colisioness
		ctx.drawImage(image_auch,constants.CAT_X-12,constants.CAT_Y+16+ Math.floor(Math.random() * -5) + 5 );
		//^!
		muerto = true
		ouch();
		}
		ctx.drawImage(image_spikes,Math.trunc(temp-40),Math.trunc(layer_y ));
	
}}

function drawSpikes2(){
	if (game_start == true ){
		var temp=parseInt(-spikesCounter1/ (constants.SPIKES_PARALLAX/(constants.VELOCITY_SCROLL*0.1)));
		var layer_y = parseInt ( constants.SPIKES_POSITION+ (vertical_parallax*constants.SPIKES_Z));
		//reinicio de los pinchos
		//colision
		if (temp>190 && temp<200 && cat_jumping == false ) {
		ctx.drawImage(image_auch,constants.CAT_X-12,constants.CAT_Y+16+ Math.floor(Math.random() * -5) + 5 );
		//^!
		muerto = true
		ouch();
		}
		if (temp>300){newSpike = true}
		ctx.drawImage( image_spikes,Math.trunc(temp-40),Math.trunc(layer_y ));
	
}}

function resetSpikes (){
	
	if (spikeReset == false){
		spikeRandomWait = (Math.floor(Math.random() * (60 - 0) ) + 0);
		spikeWait = frameCounter + spikeRandomWait;
		spikeReset = true
				console.log(spikeRandomWait)
	}
	
   if (frameCounter > spikeWait){
	   console.log("nuevo pincho "+ frameCounter)
	   spikesCounter0 = 0
	   if (newSpike == true ){
	   spikesCounter1 = (Math.floor(Math.random() * (80 - 30) ) + 30);
	   console.log("nuevo pincho 2 "+ spikesCounter1)
	   newSpike = false
	   }
	   spikeWait = 0
	   spikeReset = false
   }
}


function points(){
	
	points_value =String( parseInt ((frameCounter/23 )));
	points0= String(points_value).charAt(0);
	points1= String(points_value).charAt(1);
	points2= String(points_value).charAt(2);
	points3= String(points_value).charAt(3);
	ctx.drawImage(image_numbers,points0*8,0,8,8,0+(0*8),1,8,8,8);
	
		if (points_value>9){ 
		ctx.drawImage(image_numbers,points1*8,0,8,8,0+(1*8),1,8,8,8);
		}
		if (points_value>99){ 
		ctx.drawImage(image_numbers,points2*8,0,8,8,0+(2*8),1,8,8,8);
		}
		if (points_value>999){ 
		ctx.drawImage(image_numbers,points3*8,0,8,8,0+(3*8),1,8,8,8);
		}
	
	}

function highscore(){
	
	if (points_value > bestscore){
		bestscore = parseInt(points_value)
		document.getElementById("puntos").innerHTML = "Puntuación máxima : "+points_value
	}
	points0= String(bestscore).charAt(0);
	points1= String(bestscore).charAt(1);
	points2= String(bestscore).charAt(2);
	points3= String(bestscore).charAt(3);
	ctx.drawImage(image_best,0,9);
	ctx.drawImage(image_numbers,points0*8,0,8,8,22+(0*8),9,8,8,8);
	
		if (bestscore>9){ 
		ctx.drawImage(image_numbers,points1*8,0,8,8,22+(1*8),9,8,8,8);
		}
		if (bestscore>99){ 
		ctx.drawImage(image_numbers,points2*8,0,8,8,22+(2*8),9,8,8,8);
		}
		if (bestscore>999){ 
		ctx.drawImage(image_numbers,points3*8,0,8,8,22+(3*8),9,8,8,8);
		}

}



function drawCat(){
		
	if	 (frameCounter%constants.CAT_ANIMATION_SPEED==0){
		cat_frame +=1;
		if (cat_frame == cat_resetframe){ cat_frame = cat_firstframe;}
		
	}
	ctx.drawImage(image_cat,cat_frame*36,0,36,62,constants.CAT_X,constants.CAT_Y,36,62);
		
}

function loopGame(){
	if (escene== 0){
		//scroll_max_speed = 3;
		frameCounter++;
			//cat_status()
			virtual_camera=-60;
		// limpia la escena
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// dibuja los fondos
		for ( i=0; i<6; i++){
			drawLayer(i);
		}
		title()
		drawLayer(6);
			runfield()
			window.requestAnimationFrame(loopGame);
	}
	if (escene == 1){
		frameCounter++;
			cat_status()
		virtual_camera-=.5;
		spikesCounter0-=.5;
		spikesCounter1-=.5;
		// limpia la escena
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// dibuja los fondos
		for ( i=0; i<6; i++){
			drawLayer(i);
		}
		// dibuja el gato
		
		drawCat();
		// dibuja los pinchos
		drawSpikes()
		drawSpikes2()
		//dibuja los girasoles
		drawLayer(6);
			points();
			highscore();
			runfield()
			window.requestAnimationFrame(loopGame);
}}

function cat_status(){
	if (cat_jumping == true ){
		
		if (cat_frame<9 ){
		vertical_parallax +=0.02
		
		} 
		
		if (cat_frame>9 ){
		vertical_parallax -=0.02
		
		}
		
		cat_firstframe = 5
        cat_resetframe = 15
		
			} else {
			vertical_parallax =0
			cat_firstframe = 0
			cat_resetframe = 5
		}
	if (cat_frame > 13){
		cat_jumping = false;
		vertical_parallax =0
		cat_frame = 0
	}
}

function runfield(){
	
		if (constants.VELOCITY_SCROLL < scroll_max_speed && muerto == false) {
			constants.VELOCITY_SCROLL += constants.ACELERATION
		}
		
		if (constants.VELOCITY_SCROLL > scroll_max_speed && muerto== false) {
		game_start = true;
} } 

function title(){
	if (title_frame>=1.9){ title_frame = 0 }
	title_frame +=0.05 
	ctx.drawImage(image_title,parseInt(title_frame)*200,0,200,100,-17,0,200,100);
	ctx.drawImage(image_antoni,55,98)
}

	

