//ShotChart component for the shotchart of specified player

//imports
import React from 'react';
import nba from 'nba';
import * as d3 from `d3`; //https://github.com/d3
import {hexbin} from 'd3-hexbin';
import {court, shots} from 'd3-shotchart'; //https://github.com/mc-buckets/d3-shotchart
import PropTypes from 'prop-types';

window.d3_hexbin = {hexbin : hexbin} //workaround library problem

//Declaration for the shortchart component class
export class ShortChart extends React.Component {

	//proptypes for type checking
	static propTypes = {
		//require player id
		playerId: PropTypes.number.isRequired
	}

	componentDidUpdate() {
		//renew shot data after the chart renders
		nba.stats.shots({
			PlayerID: this.props.playerId
		}).then((response) => {
			//map reponse data to custom objects
			const final_shots = response.shot_Chart_Detail.map(shot => ({
				//we need to transform the x and y value for beauty
				x: (shot.locX + 250) / 10,
				y: (shot.locY + 50) / 10,

				//get shot attributes
				action_type: shot.actionType,
				shot_distance: shot.shotDistance,
				shot_made_flag: shot.shotMadeFlag,
			}));

			//select the type of chart
			const courtSelection = d3.select('#shot-chart');
			//select the dimension of the court
			const chart_court = court().width(500);

			//settings for each shot
			const chart_shots = 
			shots().shotRenderThreshold(2).displayToolTips(true).displayType("hexbin");

			//create and configure the chart
			courtSelection.call(chart_court);
			courtSelection.datum(final_shots).call(chart_shots);
		});
	}

	render() {
		//render the chart
		return (
			<div id="shot-chart"></div>
		)
	}
}
