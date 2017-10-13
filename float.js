import Filters from './lib/filters';
import {createElement} from './lib/utils';
import ItemInfo from './lib/ItemInfo';
import FloatQueue from './lib/FloatQueue';
import Item from './lib/Item';

const itemInfo = new ItemInfo();
const floatQueue = new FloatQueue();

let floatTimer;
let steamListingInfo = {};
let listingInfoPromises = [];
let filters = new Filters();

// retrieve g_rgListingInfo from page script
window.addEventListener('message', (e) => {
    if (e.data.type == 'listingInfo') {
        steamListingInfo = e.data.listingInfo;

        // resolve listingInfoPromises
        for (let promise of listingInfoPromises) promise(steamListingInfo);

        listingInfoPromises = [];
    }
});

const retrieveListingInfoFromPage = function(listingId) {
    if (listingId != null && (listingId in steamListingInfo)) {
        return Promise.resolve(steamListingInfo);
    }

    window.postMessage({
        type: 'requestListingInfo'
    }, '*');

    return new Promise((resolve) => {
        listingInfoPromises.push(resolve);
    });
};

const getFloatData = function(item) {
    if (itemInfo.hasItem(item)) {
        return Promise.resolve({iteminfo: itemInfo.getItemInfo(item)});
    }

    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({inspectLink}, (data) => {
            if (data && data.iteminfo) resolve(data);
            else reject(data);
        });
    });
};

const showFloat = function(item) {
    let itemInfo = item.iteminfo;

    let floatDiv = document.querySelector(`#item_${listingId}_floatdiv`);

    if (floatDiv) {
        // Remove the "get float" button
        let floatButton = floatDiv.querySelector('.float-btn');
        if (floatButton) floatDiv.removeChild(floatButton);

        // Remove message div
        let msgdiv = floatDiv.querySelector('.floatmessage');
        if (msgdiv) floatDiv.removeChild(msgdiv);

        // Add the float value
        let itemFloatDiv = floatDiv.querySelector('.itemfloat');
        if (itemFloatDiv) itemFloatDiv.innerText = `Float: ${itemInfo.floatvalue}`;

        // Add the paint seed
        let seedDiv = floatDiv.querySelector('.itemseed');
        if (seedDiv) seedDiv.innerText = `Paint Seed: ${itemInfo.paintseed}`;

        // Check to see if there is a filter match
        let filterColour = filters.getMatchColour(item.filterVars);
        
        if (filterColour) {
            floatDiv.parentNode.parentNode.style.backgroundColor = filterColour;
        }
    }
};

floatQueue.process((item) => {
    let floatDiv = document.querySelector(`#item_${item.listingId}_floatdiv`);

    if (!floatDiv) {
        // they have switched pages since initiating the request, so continue
        return Promise.resolve();
    }

    let buttonText = floatDiv.querySelector('span');
    if (buttonText) buttonText.innerText = 'Fetching';

    return getFloatData(item)
        .then((data) => {
            item.addItemInfo(data.iteminfo);
            itemInfo.addItem(item);

            showFloat(item);
        })
        .catch((err) => {
            // Reset the button text for this itemid
            if (buttonText) buttonText.innerText = 'Get Float';

            // Change the message div for this item to the error
            if (floatDiv) {
                floatDiv.querySelector('.floatmessage').innerText = err.error || 'Unknown Error';
            }
        });
});

// Puts all of the available items on the page into the queue for float retrieval
const getAllFloats = function() {
    retrieveListingInfoFromPage()
    .then((steamListingData) => {
        // Get all current items on the page (in proper order)
        let listingRows = document.querySelectorAll('.market_listing_row.market_recent_listing_row');

        for (const row of listingRows) {
            const id = row.id.replace('listing_', '');
            const listingData = steamListingData[id];
            const inspectLink = listingData.asset.market_actions[0].link
            .replace('%listingid%', id)
            .replace('%assetid%', listingData.asset.id);

            const item = new Item(id, inspectLink);
            floatQueue.addItem(item);
        }
    });
};

// Adds float utilities
const addFloatUtilities = function() {
    const parentDiv = createElement('div', {id: 'floatUtilities'});

    // Add get all floats button
    const allFloatButton = createButton('Get All Floats', 'green');
    allFloatButton.addEventListener('click', getAllFloats);
    parentDiv.appendChild(allFloatButton);

    // Add github link
    const githubLink = createElement('a', {
        href: 'https://github.com/Step7750/CSGOFloat',
        innerText: 'Powered by CSGOFloat'
    });
    githubLink.classList.add('float-github');
    parentDiv.appendChild(githubLink);

    // Add filter div
    filters.addFilterUI(parentDiv);

    document.querySelector('#searchResultsTable').insertBefore(parentDiv, document.querySelector('#searchResultsRows'));
};

const getFloatButtonClicked = function(e) {
    let row = e.currentTarget.parentElement.parentElement.parentElement;
    let id = row.id.replace('listing_', '');

    retrieveListingInfoFromPage(id)
    .then((steamListingData) => {
        let listingData = steamListingData[id];

        if (!listingData) return;

        let inspectLink = listingData.asset.market_actions[0].link
        .replace('%listingid%', id)
        .replace('%assetid%', listingData.asset.id);

        floatQueue.addItem(id, inspectLink);
    });
};

// If an item on the current page doesn't have the float div/buttons, this function adds it
const addButtons = function() {
    // Iterate through each item on the page
    let listingRows = document.querySelectorAll('.market_listing_row.market_recent_listing_row');

    for (let row of listingRows) {
        let id = row.id.replace('listing_', '');

        if (row.querySelector(`#item_${id}_floatdiv`)) { continue; }

        let listingNameElement = row.querySelector(`#listing_${id}_name`);

        let floatDiv = createElement('div', {id: `item_${id}_floatdiv`});
        floatDiv.classList.add('float-div');
        listingNameElement.parentElement.appendChild(floatDiv);

        let getFloatButton = createButton('Get Float', 'green');
        getFloatButton.addEventListener('click', getFloatButtonClicked);
        floatDiv.appendChild(getFloatButton);

        // Create divs the following class names and append them to the button div
        let divClassNames = ['floatmessage', 'itemfloat', 'itemseed'];

        for (let className of divClassNames) {
            let div = createElement('div');
            div.classList.add(className);
            floatDiv.appendChild(div);
        }

        // check if we already have the float for this item
        if (itemInfo.hasListingId(id)) {
            showFloat(itemInfo.getItemForId(id));
        }
    }

    // Add float utilities if it doesn't exist and we have valid items
    if (!document.querySelector('#floatUtilities') && listingRows.length > 0) {
        addFloatUtilities();
    }
};


// register the message listener in the page scope
let script = document.createElement('script');
script.innerText = `
    window.addEventListener('message', (e) => {
        if (e.data.type == 'requestListingInfo') {
            window.postMessage({
                type: 'listingInfo',
                listingInfo: g_rgListingInfo
            }, '*');
        }
    });
`;
document.head.appendChild(script);

floatTimer = setInterval(() => { addButtons(); }, 500);

const logStyle = 'background: #222; color: #fff;';
console.log('%c CSGOFloat Market Checker (v1.2.0) by Step7750 ', logStyle);
console.log('%c Changelog can be found here: https://github.com/Step7750/CSGOFloat-Extension ', logStyle);
