import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { App } from '../../containers/App';

Enzyme.configure({ adapter: new Adapter() });

describe('<App />', () => {
	const wrapper = shallow(<App />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });
});
