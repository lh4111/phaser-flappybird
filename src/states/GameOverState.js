
export default class GameOverState extends Phaser.State {

	create() {
		let game_over = this.game.add.sprite(this.game.width/2, 140,'game_over'); //当作背景的tileSprite
		game_over.anchor.x = 0.5;
		game_over.anchor.y = 0.5;
		
	}

}
