import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import { Data, blobPrefix } from '../../components/predict-data';

describe('const blobPrefix', () => {
	it('must be "-Simon1991-"', () => {
		expect(blobPrefix).toBe('-Simon1991-');
  });
});

describe('<Data />', () => {
	it('renders without crashing', () => {
		const wrapper = shallow(<Data />);
		expect(wrapper.length).toBe(1);
  });

	describe('functionality', () => {
		const validFileContent = blobPrefix + '{}';
		const invalidFileContent = '{}';

		describe('function onFileLoad()', () => {
			const spy = sinon.spy();
			it('must trigger 2x dispatch', () => {
				const wrapper = shallow(<Data dispatch={spy} />);
				wrapper.instance().onFileLoad(validFileContent);
				expect(spy.callCount).toBe(2);
			});

			it('must return on invalid fileContent', () => {
				const wrapper = shallow(<Data dispatch={spy} />);
				expect(wrapper.instance().onFileLoad(invalidFileContent)).toBeUndefined()
			});
		});

		describe('function onFileChange()', () => {
			it('reads the file as text', () => {
				sinon.spy(FileReader.prototype, 'readAsText');
				const wrapper = shallow(<Data />);
				const file = new Blob([validFileContent], {type : 'text/plain'});
				wrapper.instance().onFileChange({
					target: {files: [file]}
				});
				expect(FileReader.prototype.readAsText.calledWith(file)).toBeTruthy();
			});
		});
	});
});
