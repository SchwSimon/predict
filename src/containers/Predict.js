import React, { PureComponent } from 'react';

import Learn from './Learn';	// container

import PredictInput from '../components/predict-input';
import PredictRandom from '../components/predict-random';

class Predict extends PureComponent {
	render() {
		return (
			<div>
				<Learn />
				<PredictInput />
				<PredictRandom />
			</div>
		)
	}
}

export default Predict;
