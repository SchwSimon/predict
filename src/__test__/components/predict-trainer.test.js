import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import { Trainer } from '../../components/predict-trainer';
import { trainFromText, setLearningState } from '../../actions/index';

Enzyme.configure({ adapter: new Adapter() });

describe('<Trainer />', () => {
	const dispatchSpy = sinon.spy();
	const props = {
		dispatch: dispatchSpy,
		isLearning: true,
		settings: 'settings'
	};
	const wrapper = shallow(<Trainer {...props} />);
	const defaultState = Object.assign({}, wrapper.state());
	defaultState.urlInput = Object.assign({}, wrapper.state().urlInput);

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	it('default state', () => {
		expect(defaultState).toEqual({
			text: '',
			learningState: false,
			modalShow: false,
			modalContent: '',
			modalTimeout: null,
			urlInput: {
				value: '',
				disabled: false
			}
		});
  });

	describe('Lifecycle', () => {
		describe('function componentWillUpdate()', () => {
			it('must trigger handleModal with args', () => {
				const handleModalStub = sinon.stub(wrapper.instance(), 'handleModal');
				wrapper.instance().componentWillUpdate({
					isLearning: false
				});
				handleModalStub.restore();
				expect(handleModalStub.calledWith({
					show: true,
					content: 'Text learned !',
					timeout: 2000
				})).toBeTruthy();
			});
		});
	});

	describe('functionality', () => {
		describe('function onTextChange()', () => {
			it('must set the correct state', () => {
				wrapper.find('.Trainer-text-input').simulate('change', {target: {value: 'value'}});
				expect(wrapper.state().text).toBe('value');
			});
		});

		describe('function onUrlChange()', () => {
			it('must set the correct state', () => {
				wrapper.find('.Trainer-url-input').simulate('change', {target: {value: 'value'}});
				expect(wrapper.state().urlInput).toMatchObject({
					value: 'value'
				});
			});
		});

		describe('function onUrlEnter()', () => {
			const fetchStub = sinon.stub(window, 'fetch').returns({
				then: (func) => {
					func({
						text: () => ({
							then: (func) => func('<div>text one two</div>')
						})
					});
					return {
						catch: (func) => func()
					}
				}
			});
			const url = 'url';
			const toggleUrlInputStub = sinon.stub(wrapper.instance(), 'toggleUrlInput');
			const putLearningTextStub = sinon.stub(wrapper.instance(), 'putLearningText');
			const handleModalStub = sinon.stub(wrapper.instance(), 'handleModal');
			wrapper.state().urlInput.value = url;
			wrapper.find('.Trainer-url-input').simulate('keydown', {key: 'Enter'});
			toggleUrlInputStub.restore();
			putLearningTextStub.restore();
			handleModalStub.restore();

			it('must trigger toggleUrlInput', () => {
				expect(toggleUrlInputStub.called).toBeTruthy();
			});

			it('must trigger fetch with args', () => {
				expect(fetchStub.calledWith(url)).toBeTruthy();
			});

			it('must trigger toggleUrlInput again', () => {
				expect(toggleUrlInputStub.callCount).toBe(3);
			});

			describe('fetch.resolve()', () => {
				it('must trigger putLearningText with args', () => {
					expect(putLearningTextStub.calledWith('text one two')).toBeTruthy();
				});
			});

			describe('fetch.reject()', () => {
				it('must trigger handleModal with args', () => {
					expect(handleModalStub.calledWith({
						show: true,
						content: '"' + url.substr(0, 20) + ((url.length > 20) ? '...' : '') + '" is blocking cross-site requests.'
					})).toBeTruthy();
				});
			});
		});

		describe('function toggleUrlInput()', () => {
			it('toggle url input "disabled" prop', () => {
				wrapper.state().urlInput = {
					disabled: false
				};
				wrapper.instance().toggleUrlInput();
				expect(wrapper.state().urlInput).toEqual({
					value: 'Fetching website data...',
					disabled: true
				});
			});
		});

		describe('function onFileChange()', () => {
			const putLearningTextStub = sinon.stub(wrapper.instance(), 'putLearningText');
			const readAsTextSpy = sinon.spy();
			sinon.stub(window, 'FileReader').returns({
				addEventListener: (a, onFileLoad, c) => {
					onFileLoad.call({
						removeEventListener: () => {},
						result: 'result'
					});
				},
				readAsText: readAsTextSpy
			});
			wrapper.find('.Trainer-file-input').simulate('change', {target: {files: ['file_0']}});
			putLearningTextStub.restore();

			it('must trigger readAsText with args', () => {
				expect(readAsTextSpy.calledWith('file_0')).toBeTruthy();
			});

			it('must trigger putLearningText with args', () => {
				expect(putLearningTextStub.calledWith('result')).toBeTruthy();
			});
		});

		describe('function onTextLearn()', () => {
			const handleModalStub = sinon.stub(wrapper.instance(), 'handleModal');
			wrapper.state().text = 'value';
			wrapper.find('.Trainer-head-learnBtn').simulate('click');
			handleModalStub.restore();

			it('must trigger handleModal with args', () => {
				expect(handleModalStub.calledWith({
					show: true,
					content: 'Learning text...'
				})).toBeTruthy();
			});

			it('trigger dispatch with setLearningState', () => {
				expect(dispatchSpy.calledWith(setLearningState(true))).toBeTruthy();
			});

			it('trigger dispatch with setLearningState', () => {
				expect(dispatchSpy.calledWith(trainFromText('value', props.settings))).toBeTruthy();
			});
		});

		describe('function onModalClose()', () => {
			const handleModalStub = sinon.stub(wrapper.instance(), 'handleModal');
			wrapper.instance().onModalClose();
			const state = wrapper.state().text;
			handleModalStub.restore();

			it('must trigger handleModal with args', () => {
				expect(handleModalStub.calledWith({show: false})).toBeTruthy();
			});

			it('must empty the text input value', () => {
				expect(state).toBe('');
			});
		});

		describe('function handleModal()', () => {
			const props = {
				show: true,
				content: 'content',
				timeout: 1000
			};
			wrapper.instance().handleModal(props)

			it('must set the state correctly', () => {
				expect(wrapper.state()).toMatchObject({
					modalShow: props.show,
					modalContent: props.content
				});
			});

			it('must set state:modalTimeout to new timeout', () => {
				expect(wrapper.state().modalTimeout).toBeTruthy();
			});
		});

		describe('function putLearningText()', () => {
			it('must set the text input value', () => {
				const text = wrapper.state().text;
				wrapper.instance().putLearningText('text');
				expect(wrapper.state().text).toBe(text + ' text');
			});
		});
	});
});
