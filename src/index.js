import BootState from 'states/BootState';
import PreloadState from 'states/PreloadState';
import MenuState from 'states/MenuState';
import GameState from 'states/GameState';
import RankState from 'states/RankState';

class Game extends Phaser.Game {

	constructor() {
		super('100%', 505, Phaser.AUTO, 'content', null);
		this.state.add('BootState', BootState, false);
		this.state.add('PreloadState', PreloadState, false);
		this.state.add('MenuState', GameState, false);
		this.state.add('GameState', GameState, false);
		this.state.add('RankState', RankState, false);

		this.state.start('BootState');
	}

}

new Game();
