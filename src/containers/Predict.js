import React, { PureComponent } from 'react';

import PredictInput from '../components/PredictInput';
import RandomText from '../components/RandomText';

import '../styles/Predict.css';

class Predict extends PureComponent {
	render() {
		return (
			<div>
				<PredictInput isTrainInput={true} />
				<RandomText />
			</div>
		)
	}
}

export default Predict;
