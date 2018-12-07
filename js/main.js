const rand = (n) => {return Math.floor(Math.random()*n)};

const space = 32;
const arrowLeft = 37;
const arrowRight = 39;
var enter = 13;
var shift = 16;
var xDelta = 0;
var speedBoost = 1;
var start = false;
var reload = true;
var shooting = false;
var points = 0;
var gameStarted = false;
var movement = 0;
var respawn = true;
var resetTime = 2000;
var time = 0;
var waveSize = 2;
const explosionSound = new Audio('sounds/sound1.wav');
const loseSound = new Audio('sounds/sound2.mp3');
const warningSound = new Audio('sounds/sound3.wav');
const missSound = new Audio('sounds/sound4.wav');
const damageSound = new Audio('sounds/sound5.mp3');
const music = new Audio('sounds/doomrip.mp3');
const bossSound = new Audio('sounds/bossSound.wav');
var bossComing = false;
var boss1 = false;
var bossDelta = 5;
var bossAlive = false;
var life = 100;
var bossLife = 150;
var killCount = 0;

$(document).keydown(function(e) {
	if(e.keyCode == arrowRight){
		xDelta = 7;
	}
	if(e.keyCode == arrowLeft){
		xDelta = -7;
	}
	if(e.keyCode == shift){
		speedBoost = 2;
	}
	if(e.keyCode == space){
		shooting = true;
	}
	if(e.keyCode == enter && !gameStarted){
		$("#startGame").trigger('click');
		gameStarted = true;
	}
});

$(document).keyup(function(e) {
	if(e.keyCode == arrowRight|| e.keyCode == arrowLeft){
		xDelta = 0;
	}
	if(e.keyCode == space){
		shooting = false;
	}
	if(e.keyCode == shift){
		speedBoost = 1;
	}
});

const reloadReset = () => {reload = true};
const respawnReset = () => {respawn = true};

const shoot = () => {
	if(start && reload && shooting){
		let div = $("<div class='bullet'></div>");
		div.css({
			left: `${$("#tank").position().left + 24}px`,
			top: `${$("#tank").position().top - 20}px`
		});
		div.appendTo('#road');
		reload = false;
		setTimeout(reloadReset, 100);
	}
}

const wave = () => {
	let waveLocation = rand($("#road").width()-400);
	let locationHelper = waveLocation;
	let waveHelper = waveSize;
	let top = 0;
	let div = $("<div class='warning'></div>");
	div.css({left: `${waveLocation}px`, top: `${top}px`});
	div.appendTo('#road');
	warningSound.play();
	setTimeout(function(){
		div.remove();
		for(let i = 0; i < waveSize; i++){
			for(let j = 0; j < waveHelper; j++){
				let div = $("<div class='enemy wave'></div>");
				div.css({left: `${locationHelper}px`, top: `${top}px`});
				div.appendTo('#road');
				locationHelper += 35;
			}
			waveHelper--;
			waveLocation += 17.5;
			locationHelper = waveLocation;
			top += 35;
		}
	}, 1000)	
}

const boss = () => {
	bossSound.play();
	bossComing = true;
	bossAlive = true;
	for(let i = 0; i < 6; i++){
		$("#boss").fadeToggle(650);
	}
	setTimeout(function(){
		let div = $("<div class='boss'></div>");
		div.appendTo('#road');
		bossFight();
		int2 = setInterval(bossShoot, 800);
		$("#bossLifeDiv").show();
		$("#bossLife").show();
		waveSize+=3;
	 	int3 = setInterval(function(){if(time%15 == 4 || time%15 == 9) wave()}, 1000);
	}, 4000)
}

const bossFight = () => {
	$(".boss").css({left: `+=${bossDelta}px`, top: `+=0.05px`});
 	$(".bossBullet").css({top: `+=10px`});


	if($(".boss").position().left+200 > $("#road").width()){
		bossDelta = -bossDelta;
	}

	if($(".boss").position().left < 0){
		bossDelta = -bossDelta;
	}

	$(".bossBullet").each(function() {
		if($(this).position().top+50 > $("#road").height()){
			this.remove();
		}
		if($(this).position().top < $("#tank").position().top+70 &&
		   $(this).position().left+15 > $("#tank").position().left &&
		   $(this).position().top+32 > $("#tank").position().top &&
		   $(this).position().left < $("#tank").position().left + 70){
			let div = $("<div class='explosion'></div>");
			div.css({left: `${$("#tank").position().left}px`, top: `${$("#tank").position().top}px`});
			div.appendTo('#road');
			$(this).remove();
			setTimeout(function(){div.remove()}, 500);
			damageSound.pause();
			damageSound.currentTime = 0;
			damageSound.play();
			life -= 10;
		}
	})

	if(bossLife > 0){
		$(".bullet").each(function() {
			if($(this).position().top < $(".boss").position().top+200 &&
			   $(this).position().left > $(".boss").position().left+50 &&
			   $(this).position().top+32 > $(".boss").position().top &&
			   $(this).position().left < $(".boss").position().left+150){
				let div = $("<div class='explosion'></div>");
				div.css({left: `${$(".boss").position().left + 75}px`, top: `${$(".boss").position().top + 65}px`});
				div.appendTo('#road');
				$(this).remove();
				setTimeout(function(){div.remove()}, 500);
				explosionSound.pause();
				explosionSound.currentTime = 0;
				explosionSound.play();
				bossLife -= 1.5;
				points++;
			}
		});
	}
	$("#bossLife").css({
		width: `${bossLife}px`
	});
	$("#bossLifeDiv").css({
		top: `${$(".boss").position().top+220}px`,
		left: `${$(".boss").position().left+35}px`
	});
	console.log($(".boss").position().top+220)
	if(bossLife <= 0){
		bossAlive = false;
		$("#bossLifeDiv").fadeToggle(3000);
		$("#bossLife").fadeToggle(3000);
		setTimeout(function() {
			$(".boss").remove();
			$(".bossExplosion").each(function(){$(this).remove()});
			bossComing = false;	
		}, 3000)
		for(let i = 0; i < 2000; i+=200){
			setTimeout(function(){
				explosionSound.pause();
				explosionSound.currentTime = 0;
				explosionSound.play();
				let div = $("<div class='bossExplosion'></div>");
				div.css({left: `${$(".boss").position().left + rand(100)}px`, top: `${$(".boss").position().top + rand(100)}px`});
				div.appendTo('#road');
			}, i);
		};
		life += 5;
		$(".bossBullet").each(function() {
			$(this).remove();
		})
		killCount++;
		clearInterval(int3);
		resetTime = 1750;
		waveSize--;
	}

	if(bossAlive){
		requestAnimationFrame(bossFight);
	} else {
		clearInterval(int2);
	}
}

const bossShoot = () => {
	bossShooting();
	setTimeout(bossShooting, 100);
	setTimeout(bossShooting, 200);
	setTimeout(bossShooting, 300);
	setTimeout(bossShooting, 400);
}

const bossShooting = () => {
	if(bossAlive){
		let div = $("<div class='bossBullet'></div>");
		div.css({
			left: `${$(".boss").position().left + 80}px`,
			top: `${$(".boss").position().top + 150}px`
		});
		div.appendTo('#road');
	}
}

const move = () => {
	movement = xDelta*speedBoost;

	$("#tank").css({
		left: `+=${movement}px`
	});

	if($("#tank").position().left+90 > $("#road").width()){
		$("#tank").css({
			left: `-=${movement}px`
		});
	}

	if($("#tank").position().left < 0){
		$("#tank").css({
			left: `-=${movement}px`
		});
	}


	$(".bullet").css({
		top: `-=30px`
	});

	$(".wave").css({
		top: `-=1.5px`
	});

	$(".enemy").css({
		top: `+=3px`
	});
}

const lose = () => {
	$("#startGame").parent().fadeIn(3000);
	setTimeout(restart, 3000);
};

const restart = () => {location.reload()};

const loop = () => {
	$(".enemy").each(function() {
		if($(this).position().top+70 > $("#road").height()){
			life -= 31;
			let div = $("<div class='explosion'></div>");
			div.css({left: `${$(this).position().left}px`, top: `${$(this).position().top}px`});
			div.appendTo('#road');
			$(this).remove();
			setTimeout(function(){div.remove()}, 500);
			damageSound.pause();
			damageSound.currentTime = 0;
			damageSound.play();
		}

		var thisEnemy = $(this);

		$(".bullet").each(function() {
			if($(this).position().top < thisEnemy.position().top+70 &&
			   $(this).position().left+15 > thisEnemy.position().left &&
			   $(this).position().top+32 > thisEnemy.position().top &&
			   $(this).position().left < thisEnemy.position().left + 70){
				let div = $("<div class='explosion'></div>");
				div.css({left: `${thisEnemy.position().left}px`, top: `${thisEnemy.position().top}px`});
				div.appendTo('#road');
				$(this).remove();
				thisEnemy.remove();
				points += 3;
				killCount++;
				life += 5;
				setTimeout(function(){div.remove()}, 500);
				explosionSound.pause();
				explosionSound.currentTime = 0;
				explosionSound.play();
			}
		});
	});
	$(".bullet").each(function() {
		if($(this).position().top < 0){
			points > 0 && points--;
			missSound.pause();
			missSound.currentTime = 0;
			missSound.volume = 0.1;
			missSound.play();
			this.remove();
		}
	})
	move();
	shoot();
	if(respawn && !bossComing){
		enemy();
		respawn = false;
		setTimeout(respawnReset, resetTime);
	}
	$("#points").html(points);
	if(life > 100) {life = 100}
	$("#life").css({
		width: `${life}px`
	});
	$("#lifeDiv").css({
		top: `${$("#tank").position().top + 66}px`,
		left: `${$("#tank").position().left - 10}px`
	})
	if(life <= 0){
		loseSound.play();
		music.pause();
		start = false;
		document.getElementById("startGame").disabled = true;
		clearInterval(int1);
		for(let i = 0; i < 2000; i+=200){
			setTimeout(function(){
				damageSound.pause();
				damageSound.currentTime = 0;
				damageSound.play();
				let div = $("<div class='explosion'></div>");
				div.css({left: `${$("#tank").position().left-25 + rand(50)}px`, top: `${$("#tank").position().top-25 + rand(50)}px`});
				div.appendTo('#road');
			}, i);
		}
		setTimeout(lose, 3000);
	}
	
	if(killCount == 30 && !bossComing){
		boss();
	}
	if(start){
		requestAnimationFrame(loop);
	}
}

const enemy = () => {
	let div = $("<div class='enemy'></div>");
	div.css({left: `${rand($("#road").width()-70)}px`});
	div.appendTo('#road');
}

$("#startGame").click(function(){
	music.loop = true;
	music.play();
	music.volume = 0.5;
	$("#boss").hide();
	$(this).parent().hide();
	$("#bossLifeDiv").hide();
	$("#bossLife").hide();
	start = true;
	loop();
	int1 = setInterval(function(){
		time++;
		$("#time").html(time);
		if(time%15 == 14){wave()};
	}, 1000);
})