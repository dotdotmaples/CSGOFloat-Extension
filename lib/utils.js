export const removeButtons = function() {
    // Iterate through each item on the page
    let listingRows = document.querySelectorAll('.market_listing_row.market_recent_listing_row');

    for (let row of listingRows) {
        let id = row.id.replace('listing_', '');

        let floatdiv = row.querySelector(`#item_${id}_floatdiv`);

        if (floatdiv) {
            row.style.backgroundColor = '';
            floatdiv.parentNode.removeChild(floatdiv);
        }
    }
};

export const hexToRgb = function(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

export const rgbToHex = function(rgb) {
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
};

export const createElement = function(type, properties = {}) {
    let e = document.createElement(type);
    e = Object.assign(e, properties); // Assign shallow properties

    // Assign deep properties
    for (const key of Object.keys(properties)) {
        if (typeof properties[key] === 'object') {
            const theseProperties = properties[key];

            for (const prop of Object.keys(theseProperties)) {
                e[key][prop] = theseProperties[prop];
            }
        }
    }

    return e;
};

export const createButton = function(text, colour, properties) {
    const e = createElement('a', properties);
    e.classList.add(`btn_${colour}_white_innerfade`);
    e.classList.add('btn_small');
    e.classList.add('float-btn');

    const span = createElement('span', {innerText: text});
    e.appendChild(span);

    return e;
};

export const helpHTML = `
    <hr></hr>
    Filters will highlight matching items with the specified colour<br><br>
    
    <b>Examples: </b>
    <ul>
      <li>float < 0.3</li>
        <ul>
            <li>Matches items with floats less than 0.3</li>
        </ul>
      <li>float >= 0.112 and float < 0.2</li>
        <ul>
            <li>Matches items with floats greater than or equal to 0.112 and less than 0.2</li>
        </ul>
      <li>float == 0.2 or (seed > 500 and float < 0.15)</li>
        <ul>
            <li>Matches items with floats of 0.2 or paint seeds greater than 500 and floats less than 0.15</li>
        </ul>
       <li>match(float, "7355608") >= 1</li>
        <ul>
            <li>Matches items with floats that contain at least one match of the CS bomb code</li>
            <li>Example Match: 0.234327355608454</li>
        </ul>
    </ul>
    
    <b>Variables</b>
    <ul>
      <li>float</li>
        <ul>
            <li>The float value of the item</li>
        </ul>
      <li>seed</li>
        <ul>
            <li>The paint seed of the item</li>
        </ul>
      <li>minfloat</li>
        <ul>
            <li>The minimum float the skin can have (regardless of wear)</li>
        </ul>
      <li>maxfloat</li>
        <ul>
            <li>The maximum float the skin can have (regardless of wear)</li>
        </ul>
    </ul>
    
    <b>Functions:</b>
    <ul>
      <li>match(x, regex)</li>
        <ul>
            <li>Performs a regex match on 'x' and returns the amount of matches</li>
        </ul>
      <li>abs(x)</li>
        <ul>
            <li>Absolute value</li>
        </ul>
      <li>ceil(x)</li>
        <ul>
            <li>Round floating point up</li>
        </ul>
      <li>floor(x)</li>
        <ul>
            <li>Round floating point down</li>
        </ul>
      <li>log(x)</li>
        <ul>
            <li>Natural logarithm</li>
        </ul>
      <li>max(a, b, c...)</li>
        <ul>
            <li>Max value (variable length of args)</li>
        </ul>
      <li>min(a, b, c...)</li>
        <ul>
            <li>Min value (variable length of args)</li>
        </ul>
      <li>random()</li>
        <ul>
            <li>Random floating point from 0.0 to 1.0</li>
        </ul>
      <li>round(x)</li>
        <ul>
            <li>Round floating point</li>
        </ul>
      <li>sqrt(x)</li>
        <ul>
            <li>Square root</li>
        </ul>
    </ul>
`;
