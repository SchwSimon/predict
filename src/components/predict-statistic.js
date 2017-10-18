import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import '../styles/predict-statistic.css';

class Statistic extends PureComponent {
	render() {
		return (
			<div className="Statistic">
				<div>
					<div className="Statistic-value">{this.props.statistic.knownWords}</div>
					<div className="Statistic-label">Known words</div>
				</div>
				<div>
					<div className="Statistic-value">{this.props.statistic.inputWords}</div>
					<div className="Statistic-label">Feeded words</div>
				</div>
			</div>
		)
	}
}

export default connect(
	state => ({
		statistic: state.predict.statistic
	})
)(Statistic);
