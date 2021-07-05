//Profile section of selected player

//imports
import React from 'react';
import {PROFILE_PIC_URL_PREFIX, TEAM_LOGO_URL_PREFIX} from '../constants';

//Class declaration of the Profile component, export to App.js
export class Profile extends React.Component {

	render() {
		//get stats from props
		const {
			teamAbbrviation,
			teamCity,
			teamName,
			playerName,
			height,
			weight,
			playerId,
			pts, reb, ast, pie
		} = this.props.playerInfo;

		//We want to render the player name, profile pic and all the stats
		return (
			<div className="profile">
				<div className="profile-entry player-name">{`${playerName}`}</div>

				{/* render image */}
				<img
					className="profile-pic"
					src={`${PROFILE_PIC_URL_PREFIX}${playerId}.png`}
					alt="Profile"
				/>

				{/* The structure of all profile entry will follow this format
				except for images */}
				<div className="profile-entry">
					<div className="profile-entry-left">Team</div>
					<div className="profile-entry-right">{`${teamCity} : ${teamName}`}</div>
				</div>

				<img
					className="team-logo"
					src={`${TEAM_LOGO_URL_PREFIX}/${teamAbbrviation}_logo.svg`}
					alt="Team"
				/>

				<div className="profile-entry">
					<div className="profile-entry-left">Height</div>
					<div className="profile-entry-right">{`${height}`}</div>
				</div>

				<div className="profile-entry">
					<div className="profile-entry-left">Weight</div>
					<div className="profile-entry-right">{`${weight}`}</div>
				</div>

				<div className="profile-entry">
					<div className="profile-entry-left">PTS</div>
					<div className="profile-entry-right">{`${pts}`}</div>
				</div>

				<div className="profile-entry">
					<div className="profile-entry-left">REB</div>
					<div className="profile-entry-right">{`${reb}`}</div>
				</div>

				<div className="profile-entry">
					<div className="profile-entry-left">AST</div>
					<div className="profile-entry-right">{`${ast}`}</div>
				</div>

				<div className="profile-entry">
					<div className="profile-entry-left">PIE</div>
					<div className="profile-entry-right">{`${pie}`}</div>
				</div>
				
			</div>
		);
	}
}