//Topbar for the website

//imports
import React from 'react';
import logo from '../assets/images/nba-logo.jpg';

//class declaration for the topbar, we want to export it so it can be used in App.js
export class TopBar extends React.Component {
	render() {
		//For now, render the header and the logo
		return (
			<header className="App-header">
				<img src={logo} classname="App-logo" alt="logo" />
			</header>
		)
	}
}