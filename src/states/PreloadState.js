
export default class PreloadState extends Phaser.State {

    preload(){
        let center = { x: this.game.world.centerX, y: this.game.world.centerY };
        this.text = this.game.add.bitmapText(center.x, center.y, 'flappy_font', 'Loading:0', 24);
        this.text.anchor.set(0.5,1);

        this.rect = this.game.add.graphics(0,0);
        this.rect.beginFill(0xFF700B, 1);
        this.rect.drawRect((this.game.width - 240)/2, this.game.height - 200, 240, 20);
        //
        // this.game.stage.addChild(text);
        // this.game.stage.addChild(rect);

        //以下为要加载的资源
        this.game.load.image('background','assets/background.png'); //游戏背景图
        this.game.load.image('ground','assets/ground.png'); //地面
        this.game.load.image('title','assets/title.png'); //游戏标题
        this.game.load.spritesheet('bird','assets/bird.png',34,24,3); //鸟
        this.game.load.image('btn','assets/start-button.png');  //按钮
        this.game.load.spritesheet('pipe','assets/pipes.png',54,320,2); //管道
        
        this.game.load.audio('fly_sound', 'assets/flap.wav');//飞翔的音效
        this.game.load.audio('score_sound', 'assets/score.wav');//得分的音效
        this.game.load.audio('hit_pipe_sound', 'assets/pipe-hit.wav'); //撞击管道的音效
        this.game.load.audio('hit_ground_sound', 'assets/ouch.wav'); //撞击地面的音效

        this.game.load.image('ready_text','assets/get-ready.png'); //get ready图片
        this.game.load.image('play_tip','assets/instructions.png'); //玩法提示图片
        this.game.load.image('game_over','assets/gameover.png'); //gameover图片
        this.game.load.image('score_board','assets/scoreboard.png'); //得分板

        this.game.load.script('gray', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/Gray.js');

        this.game.load.onFileComplete.add(this.fileComplete,this);
        this.game.load.onLoadComplete.add(this.loadComplete,this)
    }

    create() {
        setTimeout(()=>this.game.state.start('MenuState'),1000)
    }

    fileComplete(progress, file_key, success, total_loaded_files, total_files) {
        this.text.text = 'loading:'+progress;
        this.rect.scale.x = progress / 100;
        console.log('%cloading...'+progress+'  %c'+total_loaded_files+'/'+total_files,'color:#fe9900','color:#cdcdcd')
    }

    loadComplete() {
        // this.text.kill();
        console.log('%cload finsh','color:#00ff00');
    }

}


