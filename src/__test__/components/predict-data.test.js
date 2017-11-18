import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import { Data, FILE_PREFIX } from '../../components/predict-data';
import { loadWordsFromFile, loadSettingsFromFile } from '../../actions/index';
import FileSaver from 'file-saver';

Enzyme.configure({ adapter: new Adapter() });

describe('FILE_PREFIX constant', () => {
	it('must be "-Simon1991-"', () => {
		expect(FILE_PREFIX).toBe('-Simon1991-');
  });
});

describe('<Data />', () => {
	const dispatchSpy = sinon.spy();
	const wrapper = shallow(<Data dispatch={dispatchSpy} />);
	const defaultState = wrapper.state();

	it('renders without crashing', () => {
		expect(wrapper.length).toBe(1);
  });

	it('default state', () => {
		expect(defaultState).toEqual({
			preLoadButton: {
				show: true,
				disabled: false,
				content: {
					default: 'Click here to feed ~2.7million words taken from 25 popular books',
					loading: 'Loading...'
				}
			}
		});
  });

	describe('functionality', () => {
		describe('function onSave()', () => {
			it('must FileSaver.saveAs with args', () => {
				const saveAsStub = sinon.stub(FileSaver, 'saveAs');
				wrapper.setProps({state: {a:1,b:2}})
				wrapper.find('.Data-save').simulate('click');
				saveAsStub.restore();

				expect(saveAsStub.calledWith(
					new Blob(
						[FILE_PREFIX + JSON.stringify({a:1,b:2})],
						{type: 'text/plain;charset=utf-8'}
					),
					'Predict_data.json'
				)).toBeTruthy();
			});
		});

		describe('function onFileLoad()', () => {
			const dataObject = {
				predict: {a: 1, b: 2},
				settings: {c: 3, d: 4}
			};
			const dataString = JSON.stringify(dataObject);
			const validFileContent = FILE_PREFIX + dataString;
			const invalidFileContent = dataString;
			wrapper.instance().onFileLoad(validFileContent);

			describe('valid file', () => {
				it('must trigger dispatch with loadWordsFromFile', () => {
					expect(dispatchSpy.calledWith(loadWordsFromFile(dataObject.predict))).toBeTruthy();
				});

				it('must trigger dispatch with loadSettingsFromFile', () => {
					expect(dispatchSpy.calledWith(loadSettingsFromFile(dataObject.settings))).toBeTruthy();
				});
			});

			describe('invalid file', () => {
				it('must trigger alert', () => {
					const alertStub = sinon.stub(window, 'alert');
					wrapper.instance().onFileLoad(invalidFileContent)
					alertStub.restore();
					expect(alertStub.called).toBeTruthy()
				});
			});
		});

		describe('function onFileChange()', () => {
			const onFileLoadStub = sinon.stub(wrapper.instance(), 'onFileLoad');
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

			wrapper.find('.Data-loadInput').simulate('change', {target: {files: ['file_0']}});
			onFileLoadStub.restore();

			it('must trigger readAsText with args', () => {
				expect(readAsTextSpy.calledWith('file_0')).toBeTruthy();
			});

			it('must trigger onFileLoad with args', () => {
				expect(onFileLoadStub.calledWith('result')).toBeTruthy();
			});
		});

		describe('function onPreFeed()', () => {
			const loadPreFeedDataStub = sinon.stub(wrapper.instance(), 'loadPreFeedData').returns({
				then: (resolve) => {
					resolve();
					return {catch: () => {}}
				}
			});
			wrapper.instance().onPreFeed();
			loadPreFeedDataStub.restore();

			it('must set the correct state', () => {
				expect(wrapper.state().preLoadButton.disabled).toBe(true);
			});

			describe('loadPreFeedData -> resolve', () => {
				it('must set the correct state', () => {
					expect(loadPreFeedDataStub.called).toBeTruthy();
				});
			});

			describe('loadPreFeedData -> reject', () => {
				it('must set the correct state', () => {
					const loadPreFeedDataStub = sinon.stub(wrapper.instance(), 'loadPreFeedData').returns({
						then: () => ({
							catch: (reject) => reject()
						})
					});
					wrapper.instance().onPreFeed();
					loadPreFeedDataStub.restore();
					expect(wrapper.state().preLoadButton.disabled).toBe(false);
				});
			});
		});

		describe('function loadPreFeedData()', () => {
			const responseObject = {
				predict: {a: 1, b: 2},
				settings: {c: 3, d: 4}
			};
			const fetchStub = sinon.stub(window, 'fetch').returns({
				then: (resolve) => resolve({
					json: () => ({
						then: (func) => func(responseObject)
					})
				})
			});
			wrapper.instance().loadPreFeedData();
			fetchStub.restore();

			it('must fetch with args', () => {
				expect(fetchStub.calledWith(process.env.PUBLIC_URL + '/preFeedData.json')).toBeTruthy();
			});

			it('must trigger dispatch with loadWordsFromFile', () => {
				expect(dispatchSpy.calledWith(loadWordsFromFile(responseObject.predict))).toBeTruthy();
			});

			it('must trigger dispatch with loadWordsFromFile', () => {
				expect(dispatchSpy.calledWith(loadSettingsFromFile(responseObject.settings))).toBeTruthy();
			});
		});
	});
});
