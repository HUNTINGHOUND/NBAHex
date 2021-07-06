//Main component of the App, it will contain the player profile and the shotchart

//imports
import React from 'react';
import { DataViewContainer } from './DataViewContainer';
import { Profile } from './Profile';
import { SearchBar } from './SearchBar'
import nba from 'nba'; //https://github.com/bttmly/nba
import { DEFAULT_PLAYER_INFO } from '../constants'

//The declaration of the Main component in class form. We want to export this to App.js
export class Main extends React.Component {
	constructor(props) {
		super(props);

		/*
		Dummy variables for now, state will hold player information dynamically
		depending on which player the user searches for.
		*/
		this.state = {
			playerInfo: DEFAULT_PLAYER_INFO
		}
	}

	//function for loading playerInfo
	loadPlayerInfo = (playerName) => {
		nba.stats.playerInfo({ PlayerID: nba.findPlayer(playerName).playerId }).then( //return promise
			(info) => {
				/*Important to note that stats.nba.com endpoints are poorly documented
				and so is the libary. To find these values one must do some testing
				through the console*/
				console.log(info);
				const playerInfo = Object.assign({},
					info.commonPlayerInfo[0], info.playerHeadlineStats[0]);

				//Log the values and set state
				console.log('final player info', playerInfo);
				this.setState({ playerInfo });
			}
		).catch((e) => {
			//catch and log errors
			console.log(e);
		});
	}


	//when the component is mounted
	componentDidMount() {
		//we want to get player info and stats using playerId
		this.loadPlayerInfo(this.state.playerInfo.fullName)
	}

	//callback function for selecting player in search bar
	handleSelectPlayer = (playerName) => {
		this.loadPlayerInfo(playerName);
	}

	render() {
		//Render the player profile and the shotchart
		return (
			<div className="main">
				<SearchBar handleSelectPlayer={this.handleSelectPlayer} />
				<div className="player">
					<Profile playerInfo={this.state.playerInfo} />
					<DataViewContainer playerId={this.state.playerInfo.playerId} />
				</div>
			</div>
		)
	}
}