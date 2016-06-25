import Bird from '../objects/Bird'

export default class GameState extends Phaser.State {

	create() {
		this.bg = this.game.add.tileSprite(0,0,this.game.width,this.game.height,'background');//背景图,这里先不用移动，游戏开始后再动
		this.pipeGroup = this.game.add.group();//用于存放管道的组，后面会讲到
		this.pipeGroup.enableBody = true;
		this.ground = this.game.add.tileSprite(0,this.game.height-112,this.game.width,112,'ground'); //地板，这里先不用移动，游戏开始后再动

		this.bird = new Bird(this.game,50,150);

		this.game.physics.enable(this.ground,Phaser.Physics.ARCADE);//开启地面的物理系统
		this.ground.body.immovable = true; //让地面在物理环境中固定不动

		this.readyText = this.game.add.image(this.game.width/2, 40, 'ready_text'); //get ready 文字
		this.playTip = this.game.add.image(this.game.width/2,300,'play_tip'); //提示点击屏幕的图片
		this.readyText.anchor.setTo(0.5, 0);
		this.playTip.anchor.setTo(0.5, 0);

		this.soundScore = this.game.add.sound('score_sound');
		this.soundHitPipe = this.game.add.sound('hit_pipe_sound');
		this.soundHitGround = this.game.add.sound('hit_ground_sound');

		this.hasStarted = false; //游戏是否已开始
		this.game.time.events.loop(900, this.generatePipes, this); //利用时钟事件来循环产生管道
		this.game.time.events.stop(false); //先不要启动时钟
		this.game.input.onDown.addOnce(this.startGame, this); //点击屏幕后正式开始游戏
	}


	generatePipes (gap){
		gap = gap || 70; //上下管道之间的间隙宽度
		var position = (505 - 320 - gap) + Math.floor((505 - 112 - 30 - gap - 505 + 320 + gap) * Math.random());//计算出一个上下管道之间的间隙的随机位置
		var topPipeY = position-360; //上方管道的位置
		var bottomPipeY = position+gap; //下方管道的位置

		if(this.resetPipe(topPipeY,bottomPipeY)) return; //如果有出了边界的管道，则重置他们，不再制造新的管道了,达到循环利用的目的

		var topPipe = this.game.add.sprite(this.game.width, topPipeY, 'pipe', 0, this.pipeGroup); //上方的管道
		var bottomPipe = this.game.add.sprite(this.game.width, bottomPipeY, 'pipe', 1, this.pipeGroup); //下方的管道
		this.pipeGroup.setAll('checkWorldBounds',true); //边界检测
		this.pipeGroup.setAll('outOfBoundsKill',true); //出边界后自动kill
		this.pipeGroup.setAll('body.velocity.x', -this.gameSpeed); //设置管道运动的速度
	}

	resetPipe(topPipeY,bottomPipeY){
		var i = 0;
		this.pipeGroup.forEachDead(function(pipe){ //对组调用forEachDead方法来获取那些已经出了边界，也就是“死亡”了的对象
			if(pipe.y<=0){ //是上方的管道
				pipe.reset(this.game.width, topPipeY); //重置到初始位置
				pipe.hasScored = false; //重置为未得分
			}else{//是下方的管道
				pipe.reset(this.game.width, bottomPipeY); //重置到初始位置
			}
			pipe.body.velocity.x = -this.gameSpeed; //设置管道速度
			i++;
		}, this);
		return i == 2; //如果 i==2 代表有一组管道已经出了边界，可以回收这组管道了
	}

	startGame(){
		this.gameSpeed = 200; //游戏速度
		this.gameIsOver = false; //游戏是否已结束的标志
		this.hasHitGround = false; //是否已碰撞到地面的标志
		this.hasStarted = true; //游戏是否已经开始的标志
		this.show_text = true;
		this.score = 0; //初始得分
		this.bg.autoScroll(-(this.gameSpeed/10),0); //让背景开始移动
		this.ground.autoScroll(-this.gameSpeed,0); //让地面开始移动
		this.bird.body.gravity.y = 1150; //给鸟设一个重力
		this.readyText.destroy(); //去除 'get ready' 图片
		this.playTip.destroy(); //去除 '玩法提示 图片
		this.scoreText = this.game.add.bitmapText(this.game.width/2, 100, 'flappy_font', '0', 48);
		this.scoreText.anchor.x = 0.5;
		this.scoreText.anchor.y = 0.5;
		this.bird.enableInput();
		this.game.time.events.start(); //启动时钟事件，开始制造管道
	}

	checkScore(pipe){
		//负责分数的检测和更新,pipe表示待检测的管道
		//pipe.hasScored 属性用来标识该管道是否已经得过分
		//pipe.y<0是指一组管道中的上面那个管道，一组管道中我们只需要检测一个就行了
		//当管道的x坐标 加上管道的宽度小于鸟的x坐标的时候，就表示已经飞过了管道，可以得分了
		if(!pipe.hasScored && pipe.y<=0 && pipe.x<=this.bird.x-17-54){
			pipe.hasScored = true; //标识为已经得过分
			this.scoreText.text = ++this.score; //更新分数的显示
			this.soundScore.play(); //得分的音效
			return true;
		}
		return false;
	}
	hitGround(){
		if(this.hasHitGround) return; //已经撞击过地面
		this.hasHitGround = true;
		this.soundHitGround.play();
		this.gameOver(true);
	}

	hitPipe(){
		if(this.gameIsOver) return;
		this.soundHitPipe.play();
		this.gameOver(true);
	}

	stopGame(){
		this.bg.stopScroll();
		this.ground.stopScroll();
		this.pipeGroup.forEachExists(function(pipe){
			pipe.body.velocity.x = 0;
		}, this);
		this.bird.animations.stop('fly', 0);
		this.bird.die();
		this.bird.disableInput();
		this.game.time.events.stop(true);
	}

	gameOver(){
		this.gameIsOver = true;
		this.stopGame();
		if(this.show_text) this.showGameOverText();
	}

	showGameOverText(){
		this.scoreText.destroy();
		this.game.bestScore = this.game.bestScore || 0;
		if(this.score > this.game.bestScore) this.game.bestScore = this.score; //最好分数
		this.gameOverGroup = this.game.add.group(); //添加一个组
		let gameOverText = this.gameOverGroup.create(this.game.width/2,0,'game_over'); //game over 文字图片
		let scoreboard = this.gameOverGroup.create(this.game.width/2,70,'score_board'); //分数板
		let currentScoreText = this.game.add.bitmapText(this.game.width/2 + 60, 105, 'flappy_font', this.score+'', 20, this.gameOverGroup); //当前分数
		let bestScoreText = this.game.add.bitmapText(this.game.width/2 + 60, 153, 'flappy_font', this.game.bestScore+'', 20, this.gameOverGroup); //最好分数
		let replayBtn = this.game.add.button(this.game.width/2, 210, 'btn', function(){//重玩按钮
			this.game.state.start('GameState');
		}, this, null, null, null, null, this.gameOverGroup);
		gameOverText.anchor.setTo(0.5, 0);
		scoreboard.anchor.setTo(0.5, 0);
		replayBtn.anchor.setTo(0.5, 0);
		this.gameOverGroup.y = 30;
	}

	update(){
		if(!this.hasStarted) return; //游戏未开始,先不执行任何东西
		this.game.physics.arcade.collide(this.bird,this.ground, this.hitGround, null, this); //检测与地面的碰撞
		this.game.physics.arcade.overlap(this.bird, this.pipeGroup, this.hitPipe, null, this); //检测与管道的碰撞
		if(this.bird.y < 0) this.hitGround();
		if(this.bird.angle < 90) this.bird.angle += 2.5; //下降时鸟的头朝下的动画
		this.pipeGroup.forEachExists(this.checkScore,this); //分数检测和更新
	}
}
