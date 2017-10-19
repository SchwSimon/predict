import React, { PureComponent } from 'react';

import Data from '../components/predict-data';
import Trainer from '../components/predict-trainer';
import Statistic from '../components/predict-statistic';
import Settings from '../components/predict-settings';


class Learn extends PureComponent {
	render() {
		return (
			<div style={{
				marginBottom: 70,
			}}>
				<div style={{
					position: 'relative',
					zIndex: 1,
					borderBottom: '1px solid gray'
				}}>
					<Data />
					<Statistic />
					<div style={{clear:'both'}} />
				</div>
				<div style={{
					position: 'relative'
				}}>
					<Trainer />
					<Settings />
				</div>
			</div>
		)
	}
}

export default Learn;