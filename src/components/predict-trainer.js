import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { trainFromText, setLearningState } from '../actions/index';

import '../styles/predict-trainer.css';

export class Trainer extends PureComponent {			// MAKE URL LOADING STATE !
	constructor(props) {
		super(props);

		this.state = {
			learningState: false,
			modalShow: false,
			modalContent: '',
			modalTimeout: null
		}

		this.onTextLearn = this.onTextLearn.bind(this);
		this.onUrlEnter = this.onUrlEnter.bind(this);
		this.onFileChange = this.onFileChange.bind(this);
		this.onModalClose = this.onModalClose.bind(this);
	}

	// file change handler
	onFileChange(event) {
		const self = this;

			// read the file
		const reader = new FileReader();
		reader.addEventListener('load', function load(result) {
			this.removeEventListener('load', load, false);

				// put the file's content in to the input field
			self.putLearningText(this.result);
    }, false);
    reader.readAsText(event.target.files[0]);
	}

	// learn from provided url
	onUrlEnter(event) {
		const url = event.target.value.trim();
		if (event.key !== 'Enter' || !url) return;

		this.toggleUrlInput();

		fetch(url).then((response) => {
			response.text().then((result) => {
				const vNode = document.createElement('div');
				vNode.innerHTML = result;

				let textContent = '';
				let liveNodeCollection = vNode.getElementsByTagName('*');
				for(let i = 0; i < liveNodeCollection.length; i++) {
						// nodes from which we do not want the content
						// - nodes with the following tags
						// - nodes which class name begins with "nav" probably is a navigation structure
					if (['title','script','style','meta','link','head','iframe','noscript','img','br','a','hr'].includes(liveNodeCollection[i].tagName.toLowerCase())
							|| liveNodeCollection[i].className.indexOf('nav') === 0) {
						liveNodeCollection[i].parentNode.removeChild(liveNodeCollection[i]);
						continue;
					}
						// concat the node's textcontent
					textContent += liveNodeCollection[i].textContent;
				}
					// put the parsed content in to the input field
					// regex multiple spaces
				this.putLearningText(textContent.replace(/\s+/g, ' '));
				this.toggleUrlInput();
			})
		}).catch((error) => {
			this.toggleUrlInput();
				// could not fetch the url
			this.handleModal({
				show: true,
				content: '"' + url.substr(0, 20) + ((url.length > 20) ? '...' : '') + '" is blocking cross-site requests.'
			});
		});
	}

	// toggle url input field
	toggleUrlInput() {
		this.urlInput.value = (this.urlInput.disabled) ? '' : 'Fetching website data...';
		this.urlInput.disabled = !this.urlInput.disabled;
	}

	// request to learn the given text
	onTextLearn() {
		const text = this.textInput.value.trim();
		if (!text) return;	// return if empty

		this.handleModal({
			show: true,
			content: 'Learning text...'
		});
			// set the learning state to true
		this.props.dispatch(setLearningState(true));
			// timeout to force the second dispatch to not be in the same frame
			// so the component can update the learning state
			// before setting the learning state back to default (as this can happen to quick for the component to update learning state twice)
		setTimeout(() => {
			this.props.dispatch(trainFromText(text, this.props.settings))
		}, 100);
	}

	// close the modal and reset the text input
	onModalClose() {
			// clear the modal timeout if running
		clearTimeout(this.state.modalTimeout);

		this.handleModal({
			show: false
		});
		this.textInput.value = '';
	}

	// modal handler
	handleModal(props) {
		this.setState({
			modalShow: props.show,
			modalContent: props.content
		});

			// set a timeout to close the modal
		if (props.timeout) {
				// clear the modal timeout if running
			clearTimeout(this.state.modalTimeout);
			this.setState({
				modalTimeout: setTimeout(this.onModalClose.bind(this), props.timeout)
			});
		}
	}

	// concat text to the learning text input
	putLearningText(text) {
		this.textInput.value += ' ' + text;
	}

	componentWillUpdate(nextProps) {
		if (this.props.isLearning !== nextProps.isLearning && !nextProps.isLearning) {
			// show the modal with a confirmation message when the learning state changes from learning to not learning
			this.handleModal({
				show: true,
				content: 'Text learned !',
				timeout: 2000
			});
		}
	}

	render() {
		return (
			<div className="Trainer">
				<div className="Trainer-head-label">Learn from text</div>
				<button
					className="Trainer-head-learnBtn"
					onClick={this.onTextLearn}
					disabled={this.state.modalShow}
				>Learn!</button>
				<textarea
					className="Trainer-text-input onInputFocus"
					ref={input => this.textInput = input}
					spellecheck="false"
				/>
				<div
					ref={modal => this.modal = modal}
					className="Trainer-text-modal"
					style={{
						display: this.state.modalShow ? 'block' : 'none'
					}}
				>
					<div className="Trainer-text-modal-content">
						{this.state.modalContent}
						<button className="Trainer-text-modal-close" onClick={this.onModalClose}>OK</button>
					</div>
					<div className="vCenterer" />
				</div>
				<div className="Trainer-file">
					<div className="Trainer-file-label">
						Import .txt file
						<span role="img" aria-label="file"> &#128193;</span>
					</div>
					<div className="vCenterer" />
					<input
						className="Trainer-file-input"
						onChange={this.onFileChange}
						accept="text/plain"
						type="file"
					/>
				</div>
				<input
					className="Trainer-url-input"
					ref={input => this.urlInput = input}
					onKeyDown={this.onUrlEnter}
					placeholder="Get URL text (press enter)"
					type="text"
				/>
			</div>
		)
	}
}

export default connect(
	state => ({
		isLearning: state.predict.isLearning,
		settings: state.settings
	})
)(Trainer);
