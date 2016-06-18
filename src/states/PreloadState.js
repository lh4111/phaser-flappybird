
export default class PreloadState extends Phaser.State {

    preload(){
        let center = { x: this.game.world.centerX, y: this.game.world.centerY };
        let text = new Phaser.Text(this.game, center.x, center.y, "Loading...",{ font: "45px Arial", fill: "#ffffff", align: "center" });
        text.anchor.set(0.5,1);
        this.game.stage.addChild(text);

        //以下为要加载的资源
        this.game.load.image('background','assets/background.png'); //游戏背景图
        this.game.load.image('ground','assets/ground.png'); //地面
        this.game.load.image('title','assets/title.png'); //游戏标题
        this.game.load.spritesheet('bird','assets/bird.png',34,24,3); //鸟
        this.game.load.image('btn','assets/start-button.png');  //按钮
        this.game.load.spritesheet('pipe','assets/pipes.png',54,320,2); //管道
        this.game.load.bitmapFont('flappy_font', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');//显示分数的字体
        this.game.load.audio('fly_sound', 'assets/flap.wav');//飞翔的音效
        this.game.load.audio('score_sound', 'assets/score.wav');//得分的音效
        this.game.load.audio('hit_pipe_sound', 'assets/pipe-hit.wav'); //撞击管道的音效
        this.game.load.audio('hit_ground_sound', 'assets/ouch.wav'); //撞击地面的音效

        this.game.load.image('ready_text','assets/get-ready.png'); //get ready图片
        this.game.load.image('play_tip','assets/instructions.png'); //玩法提示图片
        this.game.load.image('game_over','assets/gameover.png'); //gameover图片
        this.game.load.image('score_board','assets/scoreboard.png'); //得分板

        this.game.load.onFileComplete.add(this.fileComplete,text);
        this.game.load.onLoadComplete.add(this.loadComplete,text)
    }

    create() {
        this.game.state.start('GameState')
    }

    fileComplete(progress, file_key, success, total_loaded_files, total_files) {
        this.text = '资源加载中... \t'+total_loaded_files+'/'+total_files
        console.log('%cloading...'+progress+'  %c'+total_loaded_files+'/'+total_files,'color:#fe9900','color:#cdcdcd')
    }

    loadComplete() {
        this.kill();
        console.log('%cload finsh','color:#00ff00');
    }

}


