'use strict';

let React = require('react'),
    GameSetupStore = require('./gameSetupStore');

module.exports = React.createClass({
    render: function () {
        return (
            <div id="connecting" className={(this.props.setupState !== GameSetupStore.GameSetupState.CONNECTING ? 'hidden' : '')}>
                <h1 className="jumbotron">Connecting to Server...</h1>
            </div>
        )
    }
});