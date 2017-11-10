import React, { PureComponent } from 'react';

import Predict from './Predict';

import '../styles/App.css';

export class App extends PureComponent {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Predict</h1>
        </header>
    		<div className="App-body">
    			<Predict />
    		</div>
      </div>
    );
  }
}

export default App;
