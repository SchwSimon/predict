import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import { Learn } from '../../containers/Learn';

describe('<Learn />', () => {
	const wrapper = shallow(<Learn />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });
});
