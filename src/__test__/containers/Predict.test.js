import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Predict } from '../../containers/Predict';

Enzyme.configure({ adapter: new Adapter() });

describe('<Predict />', () => {
	const wrapper = shallow(<Predict />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });
});
