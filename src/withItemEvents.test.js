// import ExampleComponent from './'
import React, { useState, useCallback } from 'react';
import withItemEvents from '.';
import { render, fireEvent, getByTestId } from '@testing-library/react';

// import '@testing-library/jest-dom/extend-expect';

const ITEM_TITLE_1 = `Click to show item's name and dispatch item to parent componet`;
const ITEM_TITLE_2 = 'Click  to show [name]:value API  and dispatch item and [name]:item to parent componet';
const ItemOne = withItemEvents(
    (props) => {
        const { onChange, item, onTestClick, id, actionType } = props;
        const { imageUrl, title, description } = item;
        return (
            <div role={actionType} onClick={onChange} data-testid={actionType} data-id={id}>
                <p>{ITEM_TITLE_1}</p>
                <div>
                    <img src={imageUrl} />
                    <h4>{title}</h4>
                    <p>{description}</p>
                </div>
                <div data-testid='onTestClick' role='onTestClick' onClick={onTestClick}>
                    <p>{ITEM_TITLE_2}</p>
                </div>
            </div>
        );
    },
    [ { actionType: 'onTestClick', isStopPropagation: true } ]
);
const fieldTest = {
    actionType: 'getItem',
    item: { title: 'My Ttitle', description: 'This is a test descrtion \n show here \n ', id: 1 },
    id: 1,
    name: 'point',
    value: { x: 1, y: 2 }
};
const App = () => {
    const [ { item: stateItem }, setState ] = useState({ item: {} });
    const [ { x, y }, setPoint ] = useState({});
    const _onChange = useCallback((e, data) => {
        switch (data.actionType) {
            case 'onTestClick':
                setPoint(data.point);
                break;
            default:
                setState(data);
                break;
        }
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <hr />
            <h2>Item</h2>
            <ItemOne onChange={_onChange} onTestClick={_onChange} {...fieldTest} />
            <hr />
            <h2>Result</h2>
            <p role={fieldTest.name + 'Item'}>
                {`item's name:`}
                {stateItem.title}
            </p>
            <div>
                <p role={fieldTest.name + 'X'}>
                    {`x:`}
                    {x}
                </p>
                <p>
                    {`y:`}
                    {y}
                </p>
            </div>
            <hr />
        </div>
    );
};
describe('withItemEvents', () => {
    test('HOC is truthy', () => {
        expect(withItemEvents).toBeTruthy();
    });
    test('ItemOne can show', () => {
        expect(ItemOne).toBeTruthy();
    });
    test('Componet can show', () => {
        expect(App).toBeTruthy();
    });
    test('Test App Events', () => {
        const { getByRole, getByTestId } = render(<App />);
        expect(getByRole(fieldTest.name + 'X').innerHTML).toEqual('x:');
        fireEvent.click(getByTestId(/onTestClick/i));
        expect(getByRole(fieldTest.name + 'X').innerHTML).toEqual('x:' + fieldTest.value.x);
        expect(getByRole(/pointItem/i).innerHTML).toMatch("item's name:");
        fireEvent.click(getByTestId('getItem'));
        expect(getByRole(/pointItem/i).innerHTML).toMatch(new RegExp(fieldTest.item.title, 'i'));
    });
});
