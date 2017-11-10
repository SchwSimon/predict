import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import { App } from '../../containers/App';

describe('<App />', () => {
	const wrapper = shallow(<App />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });
});
