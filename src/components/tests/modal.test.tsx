import React from 'react';
import Modal from '../Modal';
import {shallow} from "enzyme";

test('renders the component Modal', () => {
    const component = shallow(<Modal title={'mockTitle'} description={'mock-description'}/>);
    expect(component).toMatchSnapshot();
});