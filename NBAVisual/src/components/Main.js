//Main component of the App, it will contain the player profile and the shotchart

//imports
import React from 'react';
import {ShotChart} from './ShotChart';
import {Profile} from './Profile';
import nba from 'nba'; //https://github.com/bttmly/nba

//The declaration of the Main component in class form. We want to export this to App.js
export class Main extends React.Component {
	constructor(props) {
		super(props);

		/*
		Dummy variables for now, state will hold player information dynamically
		depending on which player the user searches for.
		*/
		this.state = {
			playerId: 2544,
			playerInfo: {}
		}
	}


	//when the component is mounted
	componentDidMount() {
		//we want to get player info and stats using playerId
		nba.stats.playerInfo({PlayerID: this.state.playerId}).then( //return promise
			(info) => {
				/*Important to note that stats.nba.com endpoints are poorly documented
				and so is the libary. To find these values one must do some testing
				through the console*/
				const playerInfo = Object.assign({},
					info.commonPlayerInfo[0], info.playerHeadlineStats[0]);
				
				//Log the values and set state
				console.log('final player info', playerInfo);
				this.setState({playerInfo});
			}
		).catch((e) => {
			//catch errors
			console.log(e);
		});
	}

	render() {
		//Render the player profile and the shotchart
		return (
			<div className="main">
				<Profile playerInfo={this.state.playerInfo} />
				<ShotChart playerId={this.state.playerId} />
			</div>
		)
	}
}