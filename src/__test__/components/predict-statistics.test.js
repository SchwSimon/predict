import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import { Statistic } from '../../components/predict-statistic';

describe('<Statistic />', () => {
	const wrapper = shallow(<Statistic statistic={{
		knownWords: 0,
		inputWords: 0
	}}/>);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });
});
