
export default class GameState extends Phaser.State {

	create() {
		this.bg = this.game.add.tileSprite(0,0,this.game.width,this.game.height,'background');//背景图,这里先不用移动，游戏开始后再动
		this.pipeGroup = this.game.add.group();//用于存放管道的组，后面会讲到
		this.pipeGroup.enableBody = true;
		this.ground = this.game.add.tileSprite(0,this.game.height-112,this.game.width,112,'ground'); //地板，这里先不用移动，游戏开始后再动
		this.bird = this.game.add.sprite(50,150,'bird'); //鸟
		this.bird.animations.add('fly');//添加动画
		this.bird.animations.play('fly',12,true);//播放动画
		this.bird.anchor.setTo(0.5, 0.5); //设置中心点
		this.game.physics.enable(this.bird,Phaser.Physics.ARCADE); //开启鸟的物理系统
		this.bird.body.gravity.y = 0; //鸟的重力,未开始游戏，先让重力为0，不然鸟会掉下来
		this.game.physics.enable(this.ground,Phaser.Physics.ARCADE);//开启地面的物理系统
		this.ground.body.immovable = true; //让地面在物理环境中固定不动

		this.readyText = this.game.add.image(this.game.width/2, 40, 'ready_text'); //get ready 文字
		this.playTip = this.game.add.image(this.game.width/2,300,'play_tip'); //提示点击屏幕的图片
		this.readyText.anchor.setTo(0.5, 0);
		this.playTip.anchor.setTo(0.5, 0);

		this.scoreText = this.game.add.bitmapText(100, 100, 'flappy_font', '0', 64);
		this.scoreText.anchor.x = 0.5;
		this.scoreText.anchor.y = 0.5;

		this.hasStarted = false; //游戏是否已开始
		this.game.time.events.loop(900, this.generatePipes, this); //利用时钟事件来循环产生管道
		this.game.time.events.stop(false); //先不要启动时钟
		this.game.input.onDown.addOnce(this.startGame, this); //点击屏幕后正式开始游戏
	}


	generatePipes (gap){
		gap = gap || 100; //上下管道之间的间隙宽度
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

	startGame(){
		this.gameSpeed = 200; //游戏速度
		this.gameIsOver = false; //游戏是否已结束的标志
		this.hasHitGround = false; //是否已碰撞到地面的标志
		this.hasStarted = true; //游戏是否已经开始的标志
		this.score = 0; //初始得分
		this.bg.autoScroll(-(this.gameSpeed/10),0); //让背景开始移动
		this.ground.autoScroll(-this.gameSpeed,0); //让地面开始移动
		this.bird.body.gravity.y = 1150; //给鸟设一个重力
		this.readyText.destroy(); //去除 'get ready' 图片
		this.playTip.destroy(); //去除 '玩法提示 图片
		this.game.input.onDown.add(this.fly, this); //给鼠标按下事件绑定鸟的飞翔动作
		this.game.time.events.start(); //启动时钟事件，开始制造管道
	}

	fly(){
		this.bird.body.velocity.y = -350; //飞翔，实质上就是给鸟设一个向上的速度
		this.game.add.tween(this.bird).to({angle:-30}, 100, null, true, 0, 0, false); //上升时头朝上的动画
		this.soundFly = this.game.add.sound('fly_sound');
		this.soundFly.play(); //播放飞翔的音效
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

	checkScore(pipe){
		//负责分数的检测和更新,pipe表示待检测的管道
		//pipe.hasScored 属性用来标识该管道是否已经得过分
		//pipe.y<0是指一组管道中的上面那个管道，一组管道中我们只需要检测一个就行了
		//当管道的x坐标 加上管道的宽度小于鸟的x坐标的时候，就表示已经飞过了管道，可以得分了
		if(!pipe.hasScored && pipe.y<=0 && pipe.x<=this.bird.x-17-54){
			pipe.hasScored = true; //标识为已经得过分
			this.scoreText.text = ++this.score; //更新分数的显示
			this.soundScore = this.game.add.sound('score_sound');
			this.soundScore.play(); //得分的音效
			return true;
		}
		return false;
	}
	hitGround(){
		this.hasHitGround = true;
		this.gameOver();
	}

	hitPipe(){
		this.gameOver();
	}

	gameOver(){
		var gray = this.game.add.filter('Gray');
		this.bird.animations.stop(null, true);
		this.bird.filters = [gray];
		this.game.time.events.stop(false);
		this.bg.autoScroll(0,0); //让背景开始移动
		this.ground.autoScroll(0,0); //让地面开始移动
		this.gameIsOver = true;
		this.state.start('GameOverState')
	}

	update(){
		if(!this.hasStarted) return; //游戏未开始,先不执行任何东西
		this.game.physics.arcade.collide(this.bird,this.ground, this.hitGround, null, this); //检测与地面的碰撞
		this.game.physics.arcade.overlap(this.bird, this.pipeGroup, this.hitPipe, null, this); //检测与管道的碰撞
		if(this.bird.angle < 90) this.bird.angle += 2.5; //下降时鸟的头朝下的动画
		this.pipeGroup.forEachExists(this.checkScore,this); //分数检测和更新
	}


}
