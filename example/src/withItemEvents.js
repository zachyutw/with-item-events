import React from 'react';
import { string, func, object, number, oneOfType, element, array, node, arrayOf, shape, bool } from 'prop-types';
import pickBy from 'lodash/pickBy';

const eventHandler = (meta, item, onChange, actionType, isStopPropagation) => (e) => {
    if (isStopPropagation) {
        e.stopPropagation();
    }
    onChange(e, { ...meta, item, actionType });
};

const defaultEventsFields = [
    { actionType: 'onMouseEnter', isStopPropagation: true },
    { actionType: 'onMouseLeave', isStopPropagation: true },
    { actionType: 'onMouseOver', isStopPropagation: true },
    { actionType: 'onClickImage', isStopPropagation: true },
    { actionType: 'onBlur', isStopPropagation: false },
    { actionType: 'onFocus', isStopPropagation: false }
];

/**
 * 
 * @param {*} Component 
 * @param {*} eventsFields 
 * @param {*} name: the key to create specific value back
 * @param {*} value: this value to create specific value back
 */
const withItemEvents = (Component, eventsFields = []) => {
    const wrapper = (props) => {
        const {
            onChange = (e, data = {}) => {
                /**return data as object */
            },
            className,
            item = {},
            meta = {},
            index,
            name = 'any',
            id,
            value,
            defaultValue,
            actionType,
            selected,
            input = {},
            ...rest
        } = props;
        const itemMeta = pickBy({ id, [name]: value, actionType, selected, index }, (v) => v !== undefined);
        const ffMetaClassName = Object.keys(pickBy(meta, (v) => v !== undefined)).join(' ');
        const getHandlers = (meta) => {
            const defaultHandler = [ ...defaultEventsFields, ...eventsFields ].reduce((handler, { actionType, isStopPropagation }) => {
                handler[actionType] = eventHandler(meta, item, onChange, actionType, isStopPropagation);
                return handler;
            }, {});
            return {
                ...defaultHandler,
                onChange: eventHandler(meta, item, onChange, actionType),
                onClick: eventHandler(meta, item, onChange, actionType)
            };
        };
        const handlers = getHandlers(itemMeta);

        return <Component {...rest} meta={meta} className={[ className, ...ffMetaClassName ].join(' ')} {...handlers} {...input} {...itemMeta} item={item} />;
    };
    wrapper.propTypes = {
        onChange: func,
        item: object,
        name: string,
        selected: oneOfType([ string, number, object, array, node ]),
        index: oneOfType([ string, number ]),
        id: oneOfType([ string, number ]),
        value: oneOfType([ string, number, object, array, node ])
    };
    return wrapper;
};
withItemEvents.propTypes = {
    Component: element.isRequired,
    eventsFields: arrayOf(shape({ actionType: string.isRequired, isStopPropagation: bool }))
};
export default withItemEvents;
