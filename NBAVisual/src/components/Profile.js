//Profile section of selected player

//imports
import React from 'react';
import {PROFILE_PIC_URL_PREFIX, TEAM_LOGO_URL_PREFIX} from '../constants';

//Class declaration of the Profile component, export to App.js
export class Profile extends React.Component {

	render() {
		//get stats from props
		const {
			TEAM_ABBREVIATION,
			TEAM_CITY,
			TEAM_NAME,
			PLAYER_NAME,
			HEIGHT,
			WEIGHT,
			PLAYER_ID,
			PTS, REB, AST, PIE
		} = this.props.playerInfo;


		//We want to render the player name, profile pic and all the stats
		return (
			<div className="profile">
				<div className="profile-entry player-name">{`${PLAYER_NAME}`}</div>

				{/* render image */}
				<img
					className="profile-pic"
					src={`${PROFILE_PIC_URL_PREFIX}/${PLAYER_ID}.png`}
					alt="Profile"
				/>

				{/* The structure of all profile entry will follow this format
				except for images */}
				<div className="profile-entry">
					<div className="profile-entry-left">Team</div>
					<div className="profile-entry-right">{`${TEAM_CITY} : ${TEAM_NAME}`}</div>
				</div>

				<img
					className="team-logo"
					src={`${TEAM_LOGO_URL_PREFIX}/${TEAM_ABBREVIATION}_logo.svg`}
					alt="Team"
				/>

				<div className="profile-entry">
					<div className="profile-entry-left">Height</div>
					<div className="profile-entry-right">{`${HEIGHT}`}</div>
				</div>

				<div className="profile-entry">
					<div className="profile-entry-left">Weight</div>
					<div className="profile-entry-right">{`${WEIGHT}`}</div>
				</div>

				<div className="profile-entry">
					<div className="profile-entry-left">PTS</div>
					<div className="profile-entry-right">{`${PTS}`}</div>
				</div>

				<div className="profile-entry">
					<div className="profile-entry-left">REB</div>
					<div className="profile-entry-right">{`${REB}`}</div>
				</div>

				<div className="profile-entry">
					<div className="profile-entry-left">AST</div>
					<div className="profile-entry-right">{`${AST}`}</div>
				</div>

				<div className="profile-entry">
					<div className="profile-entry-left">PIE</div>
					<div className="profile-entry-right">{`${PIE}`}</div>
				</div>
				
			</div>
		);
	}
}