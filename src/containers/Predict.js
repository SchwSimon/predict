import React, { PureComponent } from 'react';

import Settings from '../components/Settings';
import Trainer from '../components/Trainer';
import PredictInput from '../components/PredictInput';
import RandomText from '../components/RandomText';

import '../styles/Predict.css';

class Predict extends PureComponent {
	render() {
		return (
			<div>
				<Settings />
				<Trainer />
				<PredictInput />
				<RandomText />
			</div>
		)
	}
}

export default Predict;
