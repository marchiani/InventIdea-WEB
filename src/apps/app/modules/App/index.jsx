
import React from 'react';
import classNames from 'classnames';
import { isMobile } from 'react-device-detect';

export default class App extends React.Component {
	render() {
		return (
			<div className={classNames('App', { 'App--isMobile': isMobile })}>
				<h1>Hello</h1>
				<div className="App__Body" />
			</div>
		);
	}
}

import './index.sass';
