import React, { PureComponent } from 'react';

import Data from '../components/predict-data';
import Trainer from '../components/predict-trainer';
import Statistic from '../components/predict-statistic';
import Settings from '../components/predict-settings';


class Learn extends PureComponent {
	render() {
		return (
			<div>
				<div style={{
					display: 'inline-block',
					marginBottom: 30,
					marginTop: 30
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
					<div>
						<Trainer />
						<Settings />
						<div style={{clear:'both'}} />
					</div>
				</div>
			</div>
		)
	}
}

export default Learn;