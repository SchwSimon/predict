import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Statistic } from '../../components/predict-statistic';

Enzyme.configure({ adapter: new Adapter() });


describe('<Statistic />', () => {
	it('renders without crashing', () => {
		const wrapper = shallow(<Statistic statistic={{
			knownWords: 0,
			inputWords: 0
		}}/>);

		expect(wrapper.length).toBe(1);
  });
});
