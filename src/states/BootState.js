
export default class BootState extends Phaser.State {

    preload(){
        this.game.load.bitmapFont('flappy_font', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');//显示分数的字体
    }

    create() {
        this.game.state.start('PreloadState');
    }

}


