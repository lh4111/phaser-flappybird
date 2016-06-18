import BootState from 'states/BootState';
import PreloadState from 'states/PreloadState';
import GameState from 'states/GameState';

class Game extends Phaser.Game {

	constructor() {
		super(288, 505, Phaser.AUTO, 'content', null);
		this.state.add('BootState', BootState, false);
		this.state.add('PreloadState', PreloadState, false);
		this.state.add('GameState', GameState, false);
		
		this.state.start('BootState');
	}

}

new Game();
