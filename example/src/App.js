import React, { useCallback, useState } from 'react';
import withItemEvents from 'with-item-events';

const ITEM_TITLE_1 = `Click to show item's name and dispatch item to parent componet`;
const ITEM_TITLE_2 = 'Click  to show [name]:value API  and dispatch item and [name]:item to parent componet';
const ItemOne = withItemEvents(
    (props) => {
        const { onChange, item, onTestClick, id, actionType } = props;
        const { imageUrl, title, description } = item;
        console.log(props);
        return (
            <div role={actionType} onClick={onChange} data-id={id}>
                <p>{ITEM_TITLE_1}</p>
                <div>
                    <img src={imageUrl} />
                    <h4>{title}</h4>
                    <p>{description}</p>
                </div>
                <div role='onTestClick' onClick={onTestClick}>
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
        console.log(data);
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
            <h1>This is a Example</h1>
            <h2>Description</h2>
            <p>{process.env.REACT_APP_DESCRIPTION}</p>
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
                <p role={fieldTest.name}>
                    {`x:`}
                    {x}
                </p>
                <p>
                    {`y:`}
                    {y}
                </p>
            </div>
            <hr />
            <a href={process.env.REACT_APP_GITHUB} alt='github'>
                Github
            </a>
        </div>
    );
};
export default App;
