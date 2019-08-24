import React, { useCallback, useState } from 'react';
import withItemEvents from 'with-item-events';
const ItemOne = withItemEvents(
    (props) => {
        const { onChange, item, onTestClick, id } = props;
        const { imageUrl, title, description } = item;
        return (
            <div onClick={onChange} data-id={id}>
                <p>{`Click to show item's name and dispatch item to parent componet`}</p>
                <div>
                    <img src={imageUrl} />
                    <h4>{title}</h4>
                    <p>{description}</p>
                </div>
                <div onClick={onTestClick}>
                    <p>{'Click  to show [name]:value API  and dispatch item and [name]:item to parent componet'}</p>
                </div>
            </div>
        );
    },
    [ { actionType: 'onTestClick', isStopPropagation: true }, { actionType: 'onTestClick', isStopPropagation: true } ]
);
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
            <ItemOne name='point' value={{ x: 1, y: 2 }} onChange={_onChange} onTestClick={_onChange} actionType='deleteItem' item={{ title: 'My Ttitle', description: 'This is a test descrtion \n show here \n ', id: 1 }} id='1' />
            <hr />
            <h2>Result</h2>
            <p>
                {`item's name:`}
                {stateItem.name}
            </p>
            <div>
                <p>
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
export default App;
