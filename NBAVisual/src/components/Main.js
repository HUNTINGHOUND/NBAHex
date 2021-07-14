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
		let xmlHttp = new XMLHttpRequest();
		const url = "http://localhost:8080"

		xmlHttp.open("GET", url, true);

		xmlHttp.setRequestHeader("Want", "CommonPlayerInfo");
		xmlHttp.setRequestHeader("PlayerID", nba.findPlayer(playerName).playerId.toString());

		console.log("Sending request");

		xmlHttp.send();


		xmlHttp.onreadystatechange = () => {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				console.log(xmlHttp.responseText);

				let info = JSON.parse(xmlHttp.responseText);
				console.log("Raw response");
				console.log(info);

				let data = {};

				for(let i = 0; i < info.resultSets.length; i++) {
					data[info.resultSets[i].name] = {};
					let headers = info.resultSets[i].headers;
					let value = info.resultSets[i].rowSet[0];

					for(let j = 0; j < headers.length; j++) {
						data[info.resultSets[i].name][headers[j]] = value[j];
					}
				}

				const playerInfo = Object.assign({},
					data.CommonPlayerInfo, data.PlayerHeadlineStats);
				console.log("Final player info", playerInfo);
				this.setState({playerInfo});
			}
		}
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
					<DataViewContainer playerId={this.state.playerInfo.PLAYER_ID} teamId={this.state.playerInfo.TEAM_ID} />
				</div>
			</div>
		)
	}
}