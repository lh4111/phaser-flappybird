
export default class MenuState extends Phaser.State {

	create() {
		let bg = this.game.add.tileSprite(0,0,this.game.width,this.game.height,'background'); //当作背景的tileSprite
		let ground = this.game.add.tileSprite(0,this.game.height-112,this.game.width,112,'ground'); //当作地面的tileSprite
		bg.autoScroll(-10,0); //让背景动起来
		ground.autoScroll(-100,0); //让地面动起来


		let titleGroup = this.game.add.group(); //创建存放标题的组
		titleGroup.create(0,0,'title'); //通过组的create方法创建标题图片并添加到组里
		let bird = titleGroup.create(190, 10, 'bird'); //创建bird对象并添加到组里
		bird.animations.add('fly'); //给鸟添加动画
		bird.animations.play('fly',12,true); //播放动画
		titleGroup.x = 40; //调整组的水平位置
		titleGroup.y = 80; //调整组的垂直位置
		this.game.add.tween(titleGroup).to({ y:120 },1000,null,true,0,Number.MAX_VALUE,true); //对这个组添加一个tween动画，让它不停的上下移动

		let btn = this.game.add.button(this.game.width/2,this.game.height/2,'btn',function(){//添加一个按钮
			this.game.state.start('GameState'); //点击按钮时跳转到play场景
		});
		btn.anchor.setTo(0.5,0.5); //设置按钮的中心点
	}

}
