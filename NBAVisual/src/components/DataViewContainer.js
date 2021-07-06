//Dataviewcontainer for containing data like shotchart and options

//imports
import React from 'react';
import _ from 'lodash';
import { ShotChart } from './ShotChart';
import { CountSlider } from './CountSlider';
import { Radio, Row, Col, Switch } from 'antd';

const RadioGroup = Radio.Group;

//class declaration for dataviewcontainer
export class DataViewContainer extends React.Component {
	constructor(props) {
		super(props);

		//initialize the states
		this.state = {
			minCount: 2,
			chartType: 'hexbin',
			displayTooltip: true
		}
	}

	//callback function passed down to count slider
	onCountSliderChange = (count) => {
		this.setState({ minCount: count });
	}

	//callback function passed down to chart radio
	onChartTypeChange = (e) => {
		//log the value and change the chart type
		console.log(e.target.value);
		this.setState({ chartType: e.target.value });
	}

	//callback function passed down to tip radio
	onTooltipChange = (displayTooltip) => {
		//log the value and change the tip display boolean
		console.log(displayTooltip);
		this.setState({ displayTooltip });
	}

	render() {
		console.log('render');
		return (
			<div className="data-view">
				{/* Render the shotchart and pass down vital information */}
				<ShotChart
					playerId={this.props.playerId}
					minCount={this.state.minCount}
					chartType={this.state.chartType}
					displayTooltip={this.state.displayTooltip}
				/>

				{/* Filter setting for the shotchart */}
				<div className="filters">
					{/* We only show the count slider if the chart type if hexbin
					debounce the onCountSliderChange to avoid breaking the shotchart */}
					{this.state.chartType === 'hexbin' ?
					<CountSlider value={this.state.minCount}
					onCountSliderChange={_.debounce(this.onCountSliderChange, 500)}/> : null}
					<br></br>

					<Row>
						<Col span={9}>
							{/* Radio group for option of hexbin vs scatter plot
							See documentation of ant design */}
							<RadioGroup onChange={this.onChartTypeChange}
								value={this.state.chartType}>

									<Radio value="hexbin">Hexbin</Radio>
									<Radio value="scatter">Scatter</Radio>

							</RadioGroup>
						</Col>

						<Col span={4}>
							{/* Switch to choose whether or not to see legends
							when mousing over points */}
							<Switch
								checkedChildren="Tips"
								unCheckedChildren="Tips"
								onChange={this.onTooltipChange}
								defaultChecked />
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}