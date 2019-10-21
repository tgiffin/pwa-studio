/**
 * handlers is an object that holds all the message
 * handlers for the service worker messages. Key is the
 * type of the message and value is an array of handlers.
 *
 * When a message arrives from the service worker, the
 * message's type will be used to get the list of handlers
 * that need to be invoked from the handlers object.
 */
const handlers = {};

/**
 *
 * registerMessageHandler is a SW Util that registers a
 * handler for a given message type in the handlers object.
 *
 * handler is a function that bears this signature:
 *
 * (payload: Object, event: MessageEvent) => void
 *
 * @param {string} type type of the message to register a handler
 * @param {function} handler reference of the function to register as handler
 *
 * @returns {function} a function that when called will unregister
 * the handler from the handlers object.
 */
export const registerMessageHandler = (type, handler) => {
    if (!handlers[type]) {
        handlers[type] = [];
    }
    handlers[type].push(handler);
    return () => unRegisterMessageHandler(type, handler);
};

/**
 * unRegisterMessageHandler is a SW util that will un register
 * a handler for a given message type in the handlers object.
 *
 * The handler function provided here should be the exact function
 * that was used to register in the first place.
 *
 * @param {string} type type of the message handler to unregister
 * @param {function} handler reference of the handler to unregister
 *
 * @returns {void}
 */
export const unRegisterMessageHandler = (type, handler) => {
    if (handlers[type]) {
        handlers[type] = handlers[type].filter(
            handlerfn => handler !== handlerfn
        );
    }
};

/**
 *
 * handleMessageFromSW handles messages from the SW. It matches
 * the message with the handler in the handlers object and delegates
 * the message payload along with the MessageEvent to the handler.
 *
 * @param {string} type type of the message from the SW
 * @param {object} payload payload of the message from the SW
 * @param {MessageEvent} event MessageEvent of the message from the SW
 *
 * @returns {void}
 */
export const handleMessageFromSW = (type, payload, event) => {
    const handlerList = handlers[type];
    if (handlerList) {
        handlerList.forEach(handler => {
            handler(payload, event);
        });
    }
};

/**
 *
 * sendMessageToSW sends a message to the SW. It constructs the message
 * with the type and payload provided as arguments and wraps them in a
 * promise that will be returned to the caller. If the SW responds to the
 * message, the promise will resolve with that response.
 *
 * @param {string} type type of the message to be sent to the SW
 * @param {object} payload payload of the message to be sent to the SW
 *
 * @returns {Promise} promise that will resolve to the reply from the SW
 */
export const sendMessageToSW = (type, payload) =>
    new Promise((resolve, reject) => {
        const channel = new MessageChannel();

        // Listening for a reply from the SW
        channel.port1.onmessage = event => {
            if (event.data.error) {
                reject(event.data.error);
            } else {
                resolve(event.data);
            }
        };

        navigator.serviceWorker.controller.postMessage({ type, payload }, [
            channel.port2
        ]);
    });
