//Countslider componenent that sets the threshold for hexbin shotchart

//imports
import React from 'react';
import {Slider, InputNumber, Row, Col} from 'antd';

//class declaration for the counterslider component
export class CountSlider extends React.Component {
	constructor(props) {
		super(props);
		//set the states of input value
		this.state = {inputValue: this.props.value};
	}

	//callback function for the slider when the input value changes
	onChange = (value) => {
		//get the new value
		const cleanValue = Number(value) ? value : this.state.inputValue;

		//set the state to new value
		this.setState({
			inputValue: cleanValue
		});

		//call back function to reflect state changes on parent component in the dom tree
		this.props.onCountSliderChange(cleanValue);
	}

	render() {
		return (
			<Row>
				{/* Decide the placing of the slider */}
				<Col span={12}>
					<Slider min={1} max={20} onChange={this.onChange}
						value={this.state.inputValue}/>
				</Col>

				<Col span={12}>
					<InputNumber
						min={1}
						max={20}
						style={{marginLeft: 16}}
						value={this.state.inputValue}
						onChange={this.onChange}
					/>
				</Col>
			</Row>
		);
	}
}