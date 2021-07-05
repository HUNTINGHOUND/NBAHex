//App component to hold the bulk of the application

//imports
import React from 'react';
import {TopBar} from './TopBar';
import {Main} from ',/Main';

//App class declaration
class App extends React.Component {
	render() {
		//render the top bar and the main page
		return (
			<div className="App">
				<TopBar />
				<Main />
			</div>
		)
	}
}

export default App;