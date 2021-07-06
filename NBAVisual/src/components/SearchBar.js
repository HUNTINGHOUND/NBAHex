//SearchBar component that can search through player base

//imports
import React from 'react';
import { AutoComplete, Input } from 'antd';
import nba from 'nba';
import { PROFILE_PIC_URL_PREFIX } from '../constants';

const Option = AutoComplete.Option;

//class declaration for the component
export class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: []
		}
	}

	//callback function to expand/shrink search options when new input is recieved
	handleSearch = (value) => {
		console.log(value);

		this.setState({
			dataSource: !value ?
				[] : nba.searchPlayers(value).map(player => ({
					fullName: player.fullName,
					playerId: player.playerId
				}))
		});
	}

	//callback function to select a player from autocomplete
	onSelect = (playerName) => {
		console.log(playerName);
		this.props.handleSelectPlayer(playerName);
	}

	render() {
		const { dataSource } = this.state;
		//generate all options
		const options = dataSource.map((player) => {
			return (
				< Option key={player.fullName} value={player.fullName} className="player-option" >
					<img className="player-option-image" src={`${PROFILE_PIC_URL_PREFIX}/${player.playerId}.png`} />
					<span className="player-option-label">{player.fullName}</span>
				</Option >
			);
		});

		return (
			<AutoComplete
				className="search-bar"
				dataSource={options}
				onSelect={this.onSelect}
				onSearch={this.handleSearch}
				optionLabelProp="value"
				size="large" 
				placeholder="Search NBA Player"
			>
				<Input />
			</AutoComplete>
		);
	}
}