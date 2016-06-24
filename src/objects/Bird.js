export default class Bird extends Phaser.Sprite {

    constructor(ctx,x, y) {
        super(ctx,x,y,'bird');
        this.animations.add('fly');
        this.animations.play('fly',12,true);
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this,Phaser.Physics.ARCADE); //开启鸟的物理系统
        this.body.gravity.y = 0;
        //Sounds
        this.soundFly = this.game.add.sound('fly_sound');
        this.game.stage.addChild(this);
    }

    fly(){
        this.body.velocity.y = -350; //飞翔，实质上就是给鸟设一个向上的速度
        this.game.add.tween(this).to({angle:-30}, 100, null, true, 0, 0, false); //上升时头朝上的动画
        this.soundFly.play(); //播放飞翔的音效
    }
    
    die(){
        let gray = this.game.add.filter('Gray');
        this.filters = [gray];
    }

    enableInput(){
        this.game.input.onDown.add(this.fly,this);
    }

    disableInput(){
        this.game.input.onDown.remove(this.fly,this);
    }
}