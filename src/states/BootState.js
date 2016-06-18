
export default class BootState extends Phaser.State {

    preload(){
        this.game.load.image('loading','assets/preloader.gif'); //加载进度条图片资源
    }

    create() {
        this.game.state.start('PreloadState');
    }

}


