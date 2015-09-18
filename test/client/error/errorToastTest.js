'use strict';

import {expect} from 'chai';
import React from 'react/addons';

const TestUtils = React.addons.TestUtils;

import ErrorToast from '../../../client/js/error/errorToast.jsx';

describe('ErrorToast Component', () => {

    const shallowRenderer = TestUtils.createRenderer();

    it('should render a div element with id and className without error', () => {
        shallowRenderer.render(React.createElement(ErrorToast));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual.type).to.equal('div');
        expect(actual._store.props.id).to.equal('errorToast');
        expect(actual._store.props.className).to.equal('out');
        expect(actual._store.props.children.type).to.equal('span');
        expect(actual._store.props.children._store.props.children).to.equal('');
    });

    it('should render a div element with id and className with error and error message', () => {
        let errorMessage = 'error';

        shallowRenderer.render(React.createElement(ErrorToast, { error: errorMessage }));
        let actual = shallowRenderer.getRenderOutput();

        expect(actual._store.props.className).to.equal('in');
        expect(actual._store.props.children.type).to.equal('span');
        expect(actual._store.props.children._store.props.children).to.equal(errorMessage);
    });

});