import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import { Trainer } from '../../components/predict-trainer';

describe('<Trainer />', () => {
	const wrapper = shallow(<Trainer />);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	it('default state', () => {
		expect(wrapper.state()).toEqual({
			learningState: false,
			modalShow: false,
			modalContent: '',
			modalTimeout: null
		});
  });

	describe('function onFileChange()', () => {
		it('must trigger FileReader\' readAsText with the file', () => {
			const blob = new Blob();
			sinon.spy(FileReader.prototype, 'readAsText');
			wrapper.find('.Trainer-file-input').simulate('change', {target: {files: [blob]}})
			expect(FileReader.prototype.readAsText.calledWith(blob)).toBeTruthy();
		});
	});

	describe('function onUrlEnter()', () => {
		let stubedFetch;
		beforeEach(() => {
			stubedFetch = sinon.stub(window, 'fetch');
			stubedFetch.returns(new Promise(resolve => resolve()));
		});
		afterEach(() => {
		  sinon.restore(window.fetch);
		});

		const wrapper = mount(<Trainer />);
		const input = wrapper.find('.Trainer-url-input');

		it('must return before fetching url on key != Enter', () => {
			input.simulate('keydown', {target: {value: 'url' }, key: 'noEnter'});
			expect(stubedFetch.called).toBeFalsy();
		});

		it('must return before fetching url if input value is empty', () => {
			input.simulate('keydown', {target: {value: '' }, key: 'Enter'});
			expect(stubedFetch.called).toBeFalsy();
		});

		it('must trigger toggleUrlInput()', () => {
			sinon.spy(Trainer.prototype, 'toggleUrlInput');
			input.simulate('keydown', {target: {value: 'value' }, key: 'Enter'});
			expect(Trainer.prototype.toggleUrlInput.called).toBeTruthy();
		});

		it('must call fetch with the input value url', () => {
			input.simulate('keydown', {target: {value: '127.0.0.1' }, key: 'Enter'});
			expect(window.fetch.calledWith('127.0.0.1')).toBeTruthy();
		});
	});

	describe('function toggleUrlInput()', () => {
		const wrapper = mount(<Trainer />);

		it('toggle url input "disabled" prop', () => {
			wrapper.instance().urlInput.disabled = false;
			wrapper.instance().toggleUrlInput();
			expect(wrapper.instance().urlInput.disabled).toBe(true);
		});
	});

	describe('function onTextLearn()', () => {
		const dispatch = sinon.spy();
		const wrapper = shallow(<Trainer dispatch={dispatch} />);
		const button = wrapper.find('.Trainer-head-learnBtn');
		sinon.spy(wrapper.instance(), 'handleModal')

		const modalArg = {
			show: true,
			content: 'Learning text...'
		};

		it('return on empty input', () => {
			button.simulate('click', {target: {value: ''}});
			expect(wrapper.instance().handleModal.calledWith(modalArg)).toBeFalsy();
		});

		it('trigger handleModal() on non empty click', () => {
			button.simulate('click', {target: {value: 'test'}})
			expect(wrapper.instance().handleModal.calledWith(modalArg)).toBeTruthy();
		});

		it('trigger disptach', () => {
			button.simulate('click', {target: {value: 'test'}})
			expect(dispatch.called).toBeTruthy();
		});
	});

	sinon.spy(window, 'clearTimeout');

	describe('function onModalClose()', () => {
		const wrapper = mount(<Trainer />);

		it('must clear the state:modalTimeout', () => {
			const timeout = setTimeout(a => 1, 5000);
			wrapper.state().modalTimeout = timeout;
			wrapper.instance().onModalClose();
			expect(window.clearTimeout.calledWith(timeout)).toBeTruthy();
		});

		it('must trigger handleModal() with arg', () => {
			sinon.spy(wrapper.instance(), 'handleModal')
			wrapper.instance().onModalClose();
			expect(wrapper.instance().handleModal.calledWith({show: false})).toBeTruthy();
		});

		it('must empty the text input value', () => {
			wrapper.instance().textInput.value = 'test';
			wrapper.instance().onModalClose();
			expect(wrapper.instance().textInput.value).toBe('');
		});
	});

	describe('function handleModal()', () => {
		const props = {
			show: true,
			content: 'content',
			timeout: 1000
		};

		it('must set state', () => {
			wrapper.instance().handleModal(props)
			expect(wrapper.state('modalShow')).toBe(props.show);
			expect(wrapper.state('modalContent')).toBe(props.content);
		});

		it('must clear the state:modalTimeout', () => {
			const timeout = setTimeout(a => 1, 5000);
			wrapper.state().modalTimeout = timeout;
			wrapper.instance().handleModal(props);
			expect(window.clearTimeout.calledWith(timeout)).toBeTruthy();
		});

		it('must set state:modalTimeout to new timeout', () => {
			wrapper.state().modalTimeout = null;
			wrapper.instance().handleModal(props);
			expect(wrapper.state().modalTimeout).toBeTruthy();
		});
	});

	describe('function putLearningText()', () => {
		it('must set the text input value to " text"', () => {
			const wrapper = mount(<Trainer />);
			wrapper.instance().putLearningText('text');
			expect(wrapper.instance().textInput.value).toBe(' text');
		});
	});

	describe('function componentWillUpdate()', () => {
		it('must NOT trigger handleModal()', () => {
			const wrapper = shallow(<Trainer isLearning={true}/>);
			sinon.spy(wrapper.instance(), 'handleModal')
			wrapper.instance().componentWillUpdate({isLearning: true});
			expect(wrapper.instance().handleModal.called).toBeFalsy();
		});

		it('must NOT trigger handleModal()', () => {
			const wrapper = shallow(<Trainer isLearning={false}/>);
			sinon.spy(wrapper.instance(), 'handleModal')
			wrapper.instance().componentWillUpdate({isLearning: false});
			expect(wrapper.instance().handleModal.called).toBeFalsy();
		});

		it('must trigger handleModal() with the given args', () => {
			const wrapper = shallow(<Trainer isLearning={true}/>);
			sinon.spy(wrapper.instance(), 'handleModal')
			wrapper.instance().componentWillUpdate({isLearning: false});
			expect(wrapper.instance().handleModal.calledWith({
				show: true,
				content: 'Text learned !',
				timeout: 2000
			})).toBeTruthy();
		});
	});
});
