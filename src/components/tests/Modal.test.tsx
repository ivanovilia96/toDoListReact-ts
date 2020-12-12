import React from 'react';
import {shallow} from 'enzyme';
import Modal from '../Modal';

test('renders the component', () => {
    const component = shallow(<Modal title={'mockTitle'} description={'mock-description'}/>);
    expect(component).toMatchSnapshot();
});