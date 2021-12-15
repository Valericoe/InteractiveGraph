const GRAPH_TITLE_TEXT = 'Broad Jump Metric Research';
const GRAPH_SUBTITLE_TEXT = '';
const GRAPH_SPEED_SUBTITLE_TEXT = 'Launch Speed: ';
const GRAPH_DISTANCE_SUBTITLE_TEXT = 'Distance: ';
const GRAPH_DISCLAIMER_SUBTITLE_TEXT = 'Assuming other metrics follow average trends';
const SLIDER_TRACK_COLOR = '#d4af37';
const SLIDER_TRACK_INACTIVE_COLOR = '#6a581c';
const SLIDER_SPEED_TRACK_COLOR1 = '#f08080';
const SLIDER_SPEED_TRACK_COLOR2 = '#90ee90';
const SLIDER_SPEED_TRACK_INACTIVE_COLOR = '#778899';
// TODO: Finish these
const SLIDER_CONFIGS = [{
    id: 'aace-hip-slider',
    value: 50
}, {
    id: 'aace-knee-slider',
    value: 50
}, {
    id: 'aace-hand-slider',
    value: 50
}, {
    id: 'aace-angle-of-attack-slider',
    value: 45
}, {
    id: 'aace-drag-slider',
    value: 200
}, {
    id: 'aace-acceleration-slider',
    value: 50
}];
const sliderIds = SLIDER_CONFIGS.map(slider => slider.id);

/**
 * Update the colors of the slider track
 * @param id Element id
 */
const drawSliderTrack = (id) => {
    const slider = document.getElementById(id);
    if (slider) {
        const min = slider.min
        const max = slider.max
        const value = slider.value

        slider.style.background = `linear-gradient(to right,
            ${SLIDER_TRACK_COLOR} 0%,
            ${SLIDER_TRACK_COLOR} ${(value - min) / (max - min) * 100}%,
            ${SLIDER_TRACK_INACTIVE_COLOR} ${(value - min) / (max - min) * 100}%,
            ${SLIDER_TRACK_INACTIVE_COLOR} 100%)`
    } else {
        console.error("Could not find element with id: ", id)
    }
};

/**
 * Update the colors of the speed slider track
 * @param id Speed slider element id
 */
const drawSpeedTrack = (id) => {
    const slider = document.getElementById(id);
    if (slider) {
        const min = slider.min
        const max = slider.max
        const value = slider.value
        let percent = (value - min) / (max - min);
        slider.style.background = `linear-gradient(to right,
            ${SLIDER_SPEED_TRACK_COLOR1} 0%,
            ${SLIDER_SPEED_TRACK_COLOR2} ${percent * 100}%,
            ${SLIDER_SPEED_TRACK_INACTIVE_COLOR} ${percent * 100}%,
            ${SLIDER_SPEED_TRACK_INACTIVE_COLOR} 100%)`
    } else {
        console.error("Could not find element with id: ", id)
    }
};

/**
 * On input change, update the slider track and the graph
 * Bound after creation
 * @param id Element id
 */
const onSliderInput = (id) => {
    drawSliderTrack(id);
    aaceUpdateGraph();
}

/**
 *
 * @returns {HTMLDivElement}
 */
const createSliders = () => {
    const sliderElement = document.createElement('div');
    sliderElement.innerHTML = `
          <!-- Trajectory inputs -->
          <h3 class="aace-h1">Metrics</h3>
          <!-- Launch acceleration as a percent -->
          <h3 class="aace-h3">Launch Acceleration</h3>
          <input type="range"
            min="0" max="100" value="50" step=".1"
            id="aace-acceleration-slider" class="aace-slider">
          <!-- Hand speed as a percent -->
          <h3 class="aace-h3">Hand Speed</h3>
          <input type="range"
            min="0" max="100" value="50" step=".1"
            id="aace-hand-slider" class="aace-slider">
          <!-- Hip extension as a percent -->
          <h3 class="aace-h3">Hip Extension</h3>
          <input type="range"
            min="0" max="100" value="50" step=".1"
            id="aace-hip-slider" class="aace-slider">
          <!-- Knee extension as a percent -->
          <h3 class="aace-h3">Knee Extension</h3>
          <input type="range"
            min="0" max="100" value="50" step=".1"
            id="aace-knee-slider" class="aace-slider">
          <!-- Angle of attack -->
          <h3 class="aace-h3">Launch Angle</h3>
          <input type="range"
            min="0" max="90" value="45" step=".1"
            id="aace-angle-of-attack-slider" class="aace-slider">
          <!-- Drag as a percent -->
          <h3 class="aace-h3">Drag</h3>
          <input type="range"
            min="0" max="2000" value="200" step=".1"
            id="aace-drag-slider" class="aace-slider">
          <button class="aace-btn" id="aace-reset-btn">
          Reset
          </button>
        `;
    sliderElement.id = 'aace-sliders';
    return sliderElement;
};

/**
 * Title element above the graph
 * @returns {HTMLHeadingElement}
 */
const createTitle = () => {
    const h2Element = document.createElement('h2');
    h2Element.textContent = GRAPH_TITLE_TEXT;
    h2Element.id = 'aace-h2';
    return h2Element;
};

/**
 * Title element above the graph, below the title
 * @returns {HTMLHeadingElement}
 */
const createSubTitle = () => {
    const h3Element = document.createElement('h3');
    h3Element.textContent = GRAPH_SUBTITLE_TEXT;
    h3Element.id = 'aace-h4';
    return h3Element;
};

/**
 * Element below the graph
 * @returns {HTMLDivElement}
 */
const createTextResultsElement = () => {
    const speedElement = document.createElement('div');
    speedElement.innerHTML = `
          <h2 id="aace-distance-h2">${GRAPH_DISTANCE_SUBTITLE_TEXT}</h2>
          <h2 id="aace-speed-h2">${GRAPH_SPEED_SUBTITLE_TEXT}</h2>
          <input type="range"
            min="0" max="100" value="50" step=".1"
            id="aace-speed-slider">
        `;
    return speedElement;
};

/**
 * Title element below the graph
 * @returns {HTMLHeadingElement}
 */
const createDisclaimerSubTitle = () => {
    const h4Element = document.createElement('h4');
    h4Element.textContent = GRAPH_DISCLAIMER_SUBTITLE_TEXT;
    h4Element.id = 'aace-disclaimer-h4';
    return h4Element;
};

/**
 * Canvas element to draw the graph to
 * @param id
 * @returns {HTMLCanvasElement}
 */
const createCanvas = (id) => {
    const canvasElement = document.createElement('canvas');
    canvasElement.id = id;
    return canvasElement;
};

/**
 * Main right container element
 * @returns {HTMLDivElement}
 */
const createGraphContainer = () => {
    const graphContainer = document.createElement('div');
    graphContainer.id = 'aace-graph-container';
    graphContainer.appendChild(createTitle());
    graphContainer.appendChild(createSubTitle());
    graphContainer.appendChild(createCanvas('aace-broad-jump-graph'));
    graphContainer.appendChild(createTextResultsElement());
    graphContainer.appendChild(createDisclaimerSubTitle());
    return graphContainer;
};

/**
 * Main left container element
 * @returns {HTMLDivElement}
 */
const createSliderContainer = () => {
    const sliderContainer = document.createElement('div');
    sliderContainer.id = 'aace-sliders-container';
    sliderContainer.appendChild(createSliders());
    return sliderContainer;
};

/**
 * Load the css
 * @returns {HTMLStyleElement}
 */
const createStyle = () => {
    // Version for same file styling
    const styleElement = document.createElement('style');
    // Can paste css here if required
    styleElement.innerHTML = `
.debug-body {
    background-color: rgb(44, 44, 44);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 85%;
    height: 445px;
}

aace-interactable-broad-jump {
    background-color: rgb(29, 29, 29, 100%);
    display: flex;
    /*width: fit-content;*/
    justify-content: center;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 0 1px 0 rgb(0 0 0 / 70%), 0 3px 4px -2px rgb(0 0 0 / 50%);
}

#aace-broad-jump-graph {
    /*background-color: rgb(255, 255, 255, 10%);*/
    /*border: 1px solid #778899;*/
    width: 100%;
    aspect-ratio: auto 600 / 300;
}

#aace-sliders-container {
    /*max-width: 165px;*/
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 0 0 5%;
}

/* Wider device overrides */
@media (min-width: 768px) {
    #aace-sliders-container {

    }
}

#aace-sliders {
    width: 100%;
    /*min-width: 100px;*/
}

#aace-graph-container {
    display: flex;
    flex-direction: column;
    width: 65%;
    justify-content: center;
    max-width: 400px;
    /*min-width: 200px;*/
    flex: 2;
}


.aace-h1 {
    font-family: avenir-lt-w01_35-light1475496, roboto, sans-serif;
    font-size: 22px;
    font-weight: 500;
    letter-spacing: 0.89px;
    color: #d4af37;
    margin: 0 0 4px 0;
}

#aace-h2 {
    font-family: roboto, sans-serif;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 0.89px;
    color: #d4af37;
    margin: 0 0 2px 0;
}

#aace-speed-h2 {
    font-family: avenir-lt-w01_35-light1475496, roboto, sans-serif;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 0.89px;
    color: #d4af37;
    margin: 0 0 2px 0;
}

#aace-distance-h2 {
    font-family: avenir-lt-w01_35-light1475496, roboto, sans-serif;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 0.89px;
    color: #d4af37;
    margin: 0 0 2px 0;
}

#aace-disclaimer-h4 {
    font-family: avenir-lt-w01_35-light1475496, roboto, sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.76px;
    color: #cfcfcf;
    margin: 0 0 8px 0;
}

#aace-h4 {
    font-family: avenir-lt-w01_35-light1475496, roboto, sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.76px;
    color: #cfcfcf;
    margin: 0 0 8px 0;
}

.aace-h3 {
    font-family: avenir-lt-w01_35-light1475496, roboto, sans-serif;
    font-size: 16px;
    font-weight: 300;
    line-height: 1.43;
    color: #cfcfcf;
    margin: 0 0 4px 0;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select:none;
    user-select:none;
}

.aace-slider {
    -webkit-appearance: none; /* Override default CSS styles */
    -moz-appearance: none;
    appearance: none;
    margin: 5px 0 14px 0; /* N/A after slider overflow fix */
    background: #d4af37;
    outline: none; /* Remove outline */
    height: 4px;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
    width: 100%;
}

.aace-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    box-sizing: border-box;
    border-radius: 50%;
    background: #d4af37;
    cursor: pointer;
    transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}

.aace-slider::-moz-range-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    border: 0 solid #d4af37;
    height: 12px;
    box-sizing: border-box;
    border-radius: 50%;
    background: #d4af37;
    cursor: pointer;
    transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}

.aace-slider::-webkit-slider-thumb:hover {
    overflow: visible;
    box-shadow: 0 0 0 8px rgb(212 175 55 / 16%);
}

.aace-slider::-moz-range-thumb:hover:hover {
    overflow: visible;
    box-shadow: 0 0 0 8px rgb(212 175 55 / 16%);
}

#aace-speed-slider {
    -webkit-appearance: none; /* Override default CSS styles */
    appearance: none;
    outline: none; /* Remove outline */
    height: 12px;
    width: 100%;
    border-radius: 0;
    box-sizing: border-box;
}

#aace-speed-slider::-webkit-slider-thumb {
    appearance: none;
    display: none;
}

#aace-speed-slider::-moz-range-thumb {
    appearance: none;
    display: none;
}

.aace-btn {
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
    font-family: avenir-lt-w01_35-light1475496, roboto, sans-serif;
    color: rgba(0, 0, 0, 0.87);
    background-color: #d4af37;
    box-shadow: 0 0 1px 0 rgb(0 0 0 / 70%), 0 2px 2px -2px rgb(0 0 0 / 50%);
    font-size: 0.875rem;
    min-width: 64px;
    box-sizing: border-box;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    text-transform: uppercase;
    border-radius: 4px;
    line-height: 1.75;
    font-weight: 800;
    border: 0;
    text-rendering: auto;
    position: relative;
    align-items: center;
    user-select: none;
    cursor: pointer;
}

.aace-btn:hover {
    /* TODO */
    background-color: #947a27;
}

#aace-reset-btn {
    width: 100%;
    margin-top: 15px;
}

        `;
    // Version for external file for styling
    return styleElement;
};

/**
 * Reset the slider inputs according to the configs
 * @param ids
 */
const resetSliders = (ids) => {
    // console.log("Resetting sliders... ", ids)
    ids && ids.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        let config = SLIDER_CONFIGS.find(config => sliderId === config.id);
        if (slider && config) {
            // console.log(sliderId, config)
            slider.value = config.value;
            slider.oninput();
        } else {
            console.error("Could not find element with id: ", sliderId)
        }
    })
}

class InteractableBroadJump extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.appendChild(createStyle());
        this.appendChild(createGraphContainer());
        this.appendChild(createSliderContainer());
        sliderIds.forEach(sliderId => {
            drawSliderTrack(sliderId);
            const slider = document.getElementById(sliderId);
            if (slider) {
                slider.oninput = () => onSliderInput(sliderId);
            } else {
                console.error("Could not find element with id: ", sliderId)
            }
        });
        const speedSliders = ['aace-speed-slider'];
        speedSliders.forEach(sliderId => {
            drawSpeedTrack(sliderId);
            const slider = document.getElementById(sliderId);
            if (slider) {
                slider.oninput = () => drawSpeedTrack(sliderId);
            } else {
                console.error("Could not find element with id: ", sliderId)
            }
        });
        const resetBtn = document.getElementById('aace-reset-btn');
        resetBtn.onclick = () => resetSliders(sliderIds);
    }
}

customElements.define('aace-interactable-broad-jump', InteractableBroadJump);
/**
 * Collection of functions for computing the trajectories of subsonic projectiles.
 *
 * @author      Sam Christy <sam_christy@hotmail.co.uk>
 * @licence     GNU GPL v3.0 <http://www.gnu.org/licenses/gpl-3.0.html>
 * @copyright   Sam Christy 2012 | All rights reserved (c)
 */

/**
 * Calculates the drag constant for an projectile that is used to compute its trajectory with
 * trajectory().
 *
 * @param {number} mass      The projectile's mass (g).
 * @param {number} diameter  The projectile's diameter (mm).
 * @param {number} dragCoef  The projectile's drag coefficient.
 * @param {number} [density] The density of the medium, e.g. air, (kg/m³).
 * @return {float}
 */
function dragConstant(mass, diameter, dragCoef, density){
    if(!density) density =  1.29;
    return Math.PI / 8 * 0.001 * density * (diameter * diameter) * dragCoef / mass;
}

/**
 * Calculates the maximum height reached during the trajectory of an projectile, as well as its final
 * distance and duration. This function is used to get an even distribution of plots across a
 * trajectory when using trajectory.
 *
 * @param {float} g         Gravitational acceleration.
 * @param {float} velocity
 * @param {float} angle
 * @param {float} [height]
 * @param {float} [bottom]
 * @param {float} [k]
 * @param {float} [dt]
 * @return {object}
 */
function trajectoryBounds(g, velocity, angle, height, bottom, k, dt){
    // Default arguments...
    if(typeof height === "undefined") height = 0;
    if(typeof bottom === "undefined") bottom = 0;
    if(!k) k = 0.0037;
    if(!dt) dt = 0.001;

    const bounds = {
        distance: null,
        height: null,
        duration: null
    };

    let vx = velocity * Math.cos(angle);   // Initial horizontal velocity.
    let vy = velocity * Math.sin(angle);   // Initial vertical velocity.
    let distance = 0;                      // Distance travelled by the projectile.
    const dtdt = dt * dt;                    // The time interval squared.

    let dx;	  // The horizontal distance covered each time interval, dt.
    let dy;	  // The vertical distance covered each time interval, dt.
    let a;	  // Vector deceleration.
    let ax;   // Horizontal deceleration due to air resistance.
    let ay;	  // Vertical deceleration due to air resistance and gravity.

    // We stop when the projectile lands, i.e. its height < bottom.
    for(var t = 0; height >= bottom; t += dt){
        // Compute drag from initial velocity.
        a = -k * velocity * velocity;

        // Compute the X and Y vector components of drag and velocity.
        ax = a * Math.cos(angle);
        ay = a * Math.sin(angle);

        // Compute the change in X and Y position.
        dx = vx * dt + 0.5 * ax * dtdt;
        dy = vy * dt + 0.5 * (ay - g) * dtdt;

        // Move the projectile.
        distance += dx;
        height += dy;

        // Compute new vector velocity.
        velocity = Math.sqrt(Math.pow(dx / dt, 2) + Math.pow(dy / dt, 2));

        // Compute new X and Y velocities.
        vx += ax * dt;
        vy += (ay - g) * dt;

        // Compute new flight angle.
        angle = Math.atan2(dy, dx);

        if(dy <= 0 && bounds.height === null)  // We've reached our max height, let's record it.
            bounds.height = height;
    }

    // Record the final distance and duration.
    bounds.distance = distance;
    bounds.duration = t;

    return bounds;
}

/**
 * Computes the trajectory of an projectile with air resistance.
 *
 * @param {number} g           Gravitational acceleration.
 * @param {number} velocity    The projectile's initial horizontal velocity (metres / second).
 * @param {number} angle       The projectile's initial angle (radians).
 * @param {number} mass        The mass of the projectile.
 * @param {number} [height]    The projectile's initial height (metres).
 * @param {float} [k]         The drag equation constant for the projectile.
 * @param {number} [duration]  The duration of the flight to compute.
 * @param {int}   [dt]        The time interval for calculations (seconds).
 * @param {int}   [plotCount]
 * @return {array}
 */
function trajectory(g, velocity, angle, mass, height, k, duration, dt, plotCount){
    // Default arguments...
    if(typeof height === "undefined") height = 0;
    if(!k) k = 0.0037;
    if(!duration) duration = 2;
    if(!dt) dt = 0.001;
    if(!plotCount) plotCount = 100;

    const data = new Array(plotCount);       // We'll store the plots here.
    let vx = velocity * Math.cos(angle);   // Initial horizontal velocity.
    let vy = velocity * Math.sin(angle);   // Initial vertical velocity.
    let distance = 0;                      // Distance travelled by the projectile.
    const dtdt = dt * dt;                    // The time interval squared.

    let dx;	  // The horizontal distance covered each time interval, dt.
    let dy;	  // The vertical distance covered each time interval, dt.
    let a;	  // Vector deceleration.
    let ax;   // Horizontal deceleration due to air resistance.
    let ay;	  // Vertical deceleration due to air resistance and gravity.

    const initialKineticEnergy = (0.0005 * mass * velocity * velocity);
    data[0] = [distance, height, 100];

    let t = 0, plot = 1;
    for(; plot < plotCount; t += dt){
        // Compute drag from initial velocity.
        a = -k * velocity * velocity;

        // Compute the X and Y vector components of drag and velocity.
        ax = a * Math.cos(angle);
        ay = a * Math.sin(angle);

        // Compute the change in X and Y position.
        dx = vx * dt + 0.5 * ax * dtdt;
        dy = vy * dt + 0.5 * (ay - g) * dtdt;

        // Move the projectile.
        distance += dx;
        height += dy;

        // Compute new vector velocity.
        velocity = Math.sqrt(Math.pow(dx / dt, 2) + Math.pow(dy / dt, 2));

        // Compute new X and Y velocities.
        vx += ax * dt;
        vy += (ay - g) * dt;

        // Compute new flight angle.
        angle = Math.atan2(dy, dx);

        // Calculate the kinetic energy as a percentage of its initial value.
        const retainedKineticEnergy = (0.0005 * mass * velocity * velocity) * 100 / initialKineticEnergy;

        if(Math.floor(t / duration * plotCount) > plot){
            data[plot] = [distance, height, retainedKineticEnergy];
            plot++;
        }
    }

    return data;
}

/**
 * Calculates the distance reached by a projectile in a vacuum.
 *
 * @param {float} g        Gravitational acceleration.
 * @param {float} angle    The launch angle in radians.
 * @param {float} velocity The velocity of the projectile.
 * @param {float} height   The initial height of the projectile (archer's chin  for an arrow).
 * @return {float}
 */
function vacFlightDistance(g, angle, velocity, height){
    const vSinAngle = Math.sin(angle) * velocity;

    return (velocity * Math.cos(angle) / g) * (vSinAngle + Math.sqrt(vSinAngle * vSinAngle + 2 * g * height));
}

/**
 * Calculates the maximum height reached by a projectile, in a vacuum.
 *
 * @param {float} g        Gravitational acceleration.
 * @param {float} angle    The initial angle (radians).
 * @param {float} velocity
 * @param {float} height   The projectile's initial height.
 * @return {float}
 */
function vacFlightHeight(g, angle, velocity, height){
    const sinAngle = Math.sin(angle);

    return (velocity * velocity * sinAngle * sinAngle) / (2 * g) + height;
}

/**
 * Calculates the flight duration of a proctile, in a vacuum.
 *
 * @param {float} g        Gravitational acceleration.
 * @param {float} angle    The initial angle in radians.
 * @param {float} velocity
 * @param {float} height   The projectile's initial height.
 * @return {float}
 */
function vacFlightDuration(g, angle, velocity, height){
    const vSinAngle = Math.sin(angle) * velocity;

    return (vSinAngle + Math.sqrt(vSinAngle * vSinAngle + 2 * g * height)) / g;
}

/**
 * Calculates the (parabolic) trajectory of a projectile in a vacuum.
 *
 * @param {float} g           Gravitational acceleration.
 * @param {float} velocity    The projectile's initial velocity (metres/second).
 * @param {float} angle       The projectile's initial angle (radians).
 * @param {float} [height]    The projectile's initial height (metres).
 * @param {float} [bottom]    The value on the y axis at which to stop the trajectory.
 * @param {int}   [plotCount] The number of plots in the trajectory.
 */
function vacTrajectory(g, velocity, angle, height, bottom, plotCount){
    if(typeof height === "undefined") height = 0;
    if(typeof bottom === "undefined") bottom = 0;
    if(typeof plotCount === "undefined") plotCount = 100;

    const data = new Array(plotCount);
    const duration = vacFlightDuration(g, angle, velocity, height - bottom);

    plotCount--;

    for(let plot = 0; plot <= plotCount; plot++){
        const time = plot / plotCount * duration;

        data[plot] = [
            velocity * time * Math.cos(angle),
            velocity * time * Math.sin(angle) - g / 2 * (time * time) + height
        ];
    }

    return data;
}
// console.log("Initializing...");
/**
 * Draw a graph on a specified canvas
 *
 * @param config JSON containing graph details
 * @constructor
 */
function Graph(config) {
    // console.log("Drawing graph...");
    // User defined properties
    this.canvas = document.getElementById(config.canvasId);
    this.minX = config.minX;
    this.minY = -Math.abs(config.maxY);
    this.maxX = config.maxX;
    this.maxY = Math.abs(config.minY);
    this.unitsPerTickX = config.unitsPerTickX;
    this.unitsPerTickY = config.unitsPerTickY;
    this.positiveOnly = config.positiveOnly;
    this.numbersInside = config.numbersInside;
    this.drawLastTick = config.drawLastTick;
    this.axisTitleX = config.axisTitleX;
    this.axisTitleY = config.axisTitleY;
    this.PPIMulitplier = config.PPIMulitplier;
    this.lineWidth = config.lineWidth;
    this.tickStyle = config.tickStyle; // 0 = both, 1 = inside, 2 = outside

    // Constants
    this.axisColor = '#778899';
    // this.axisColor = '#cfcfcf'; // Closer to white
    this.tickFont = (Math.floor(10 * this.PPIMulitplier)) + 'pt roboto,sans-serif'; // CSS Match
    this.axisFont = (Math.floor(12 * this.PPIMulitplier)) + 'pt roboto,sans-serif'; // CSS Match
    this.fontColor = '#778899';
    this.tickSize = 20;

    // Relationships
    this.canvas.width *= this.PPIMulitplier;
    this.canvas.height *= this.PPIMulitplier;
    this.context = this.canvas.getContext('2d');
    this.rangeX = this.maxX - this.minX;
    this.rangeY = this.maxY - this.minY;
    this.unitX = this.canvas.width / this.rangeX;
    this.unitY = this.canvas.height / this.rangeY;
    this.centerY = Math.round(Math.abs(this.minY / this.rangeY) * this.canvas.height);
    this.centerX = Math.round(Math.abs(this.minX / this.rangeX) * this.canvas.width);
    this.iteration = (this.maxX - this.minX) / 1000;
    this.scaleX = this.PPIMulitplier * this.canvas.width / this.rangeX;
    this.scaleY = this.PPIMulitplier * this.canvas.height / this.rangeY;
    // this.context.translate(0.5, 0.5);
    // this.context.imageSmoothingEnabled = true;

    if (this.rangeX <= 0 || this.rangeY <= 0) {
        throw "Range must be positive";
    }

    this.redrawPlane();
}

/**
 * Clear the canvas and draw the X and Y axis
 */
Graph.prototype.redrawPlane = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // draw x and y axis
    this.drawXAxis();
    this.drawYAxis();
}

/**
 * Draw the X axis and X axis title
 */
Graph.prototype.drawXAxis = function () {
    const context = this.context;
    context.save();
    context.beginPath();
    context.moveTo(this.positiveOnly ? this.getCanvasPosition(0, 0).x : 0, this.centerY);
    context.lineTo(this.canvas.width, this.centerY);
    context.strokeStyle = this.axisColor;
    context.lineWidth = this.PPIMulitplier * this.lineWidth;
    context.stroke();

    // Draw tick marks
    const xPosIncrement = this.unitsPerTickX * this.unitX;
    let unit;
    context.font = this.tickFont;
    context.fillStyle = this.fontColor;
    context.textAlign = 'center';
    context.textBaseline = this.numbersInside ? 'bottom' : 'top';

    // Draw tick marks
    unit = this.minX + this.unitsPerTickX;
    for (let xPos = xPosIncrement; xPos < this.canvas.width; xPos = Math.round(xPos + xPosIncrement)) {
        // Do not draw
        if (unit !== 0 && (this.drawLastTick || unit !== this.maxX)) {
            if (!this.positiveOnly || (this.positiveOnly && unit >= 0)) {
                if (!this.tickStyle) {
                    context.moveTo(xPos, this.centerY - this.tickSize / 2);
                    context.lineTo(xPos, this.centerY + this.tickSize / 2);
                } else if (this.tickStyle === 1) {
                    context.moveTo(xPos, this.centerY - this.tickSize / 2);
                    context.lineTo(xPos, this.centerY);
                } else if (this.tickStyle === 2) {
                    context.moveTo(xPos, this.centerY);
                    context.lineTo(xPos, this.centerY + this.tickSize / 2);
                }
                context.stroke();
                if (this.numbersInside) {
                    context.fillText(unit, xPos, this.centerY - this.tickSize / 2);
                } else {
                    context.fillText(unit, xPos, this.centerY + this.tickSize / 2 + 3);
                }
            }
        }
        unit += this.unitsPerTickX;
    }

    if (this.axisTitleX) {
        context.font = this.axisFont;
        context.textAlign = 'center';
        context.textBaseline = 'bottom';
        let x = this.positiveOnly ? (this.canvas.width + this.centerX) / 2 : this.canvas.width / 2;
        context.fillText(this.axisTitleX, x, this.canvas.height - (this.PPIMulitplier > 1 ? 15 : 1));
    }

    context.restore();
};

/**
 * Draw the Y axis and Y axis title
 */
Graph.prototype.drawYAxis = function () {
    const context = this.context;
    context.save();
    context.beginPath();
    context.moveTo(this.centerX, 0);
    context.lineTo(this.centerX, this.positiveOnly ? this.getCanvasPosition(0, 0).y : this.canvas.height);
    context.strokeStyle = this.axisColor;
    context.lineWidth = this.PPIMulitplier * this.lineWidth;
    context.stroke();

    // Draw tick marks
    const yPosIncrement = this.unitsPerTickY * this.unitY;
    let unit;
    context.font = this.tickFont;
    context.fillStyle = this.fontColor;
    context.textAlign = this.numbersInside ? 'left' : 'right';
    context.textBaseline = 'middle';

    // Draw tick marks
    unit = this.minY + (this.drawLastTick ? 0 : this.unitsPerTickY);
    for (let yPos = (this.drawLastTick ? 0 : yPosIncrement); yPos < this.canvas.width; yPos = Math.round(yPos + yPosIncrement)) {
        // Do not draw 0
        if (unit !== 0) {
            if (!this.positiveOnly || (this.positiveOnly && unit < 0)) {
                if (!this.tickStyle) {
                    context.moveTo(this.centerX - this.tickSize / 2, yPos);
                    context.lineTo(this.centerX + this.tickSize / 2, yPos);
                } else if (this.tickStyle === 1) {
                    context.moveTo(this.centerX, yPos);
                    context.lineTo(this.centerX + this.tickSize / 2, yPos);
                } else if (this.tickStyle === 2) {
                    context.moveTo(this.centerX - this.tickSize / 2, yPos);
                    context.lineTo(this.centerX, yPos);
                }
                context.stroke();
                // +y is downward for canvas
                if (this.numbersInside) {
                    context.fillText("" + -1 * unit, this.centerX + this.tickSize / 2 + 3, yPos + 1);
                } else {
                    context.fillText("" + -1 * unit, this.centerX - this.tickSize / 2 - 3, yPos + 1);
                }
            }
        }
        unit += this.unitsPerTickY;
    }


    if (this.axisTitleY) {
        context.save();
        context.font = this.axisFont;
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.rotate(-Math.PI / 2); // Rotate -90 degrees
        let y = this.positiveOnly ? -this.canvas.height + this.centerY : -this.canvas.height / 2;
        context.fillText(this.axisTitleY, y, 1);
        context.restore();
    }

    context.restore();
};

/**
 * Helper function to convert a set of graph coordinates to canvas coordinate
 * @param x Graph X
 * @param y Graph Y
 * @returns {{x: number, y: number}} Canvas X, Canvas Y
 */
Graph.prototype.getCanvasPosition = function (x, y) {
    let cX = this.canvas.width * ((x + Math.abs(this.minX)) / this.rangeX);
    // Flipped
    let cY = this.canvas.height - this.canvas.height * ((y + this.maxY) / this.rangeY);
    return {x: cX, y: cY};
}

/**
 * Draw a dot at a specified graph coordinate
 * @param x Graph X
 * @param y Graph Y
 * @param color String
 */
Graph.prototype.drawDot = function (x, y, color) {
    const context = this.context;
    const radius = 4;
    context.beginPath();
    let canvasPos = this.getCanvasPosition(x, y);
    // Convert to plane
    context.fillStyle = color;
    context.arc(canvasPos.x, canvasPos.y, radius, 0, 2 * Math.PI, false);
    context.fill();
    context.lineWidth = 3 * this.PPIMulitplier;
    context.strokeStyle = color;
    context.stroke();
}

/**
 * Draws an equation
 * @param equation Function
 * @param color String
 * @param thickness
 * @param timeDomain Boolean is X also an output of the equation
 * @param plotCount Number of values to iterate
 */
Graph.prototype.drawEquation = function (equation, color, thickness, timeDomain, plotCount) {
    const context = this.context;
    context.save();
    this.transformContext();

    context.beginPath();

    if (timeDomain) {
        for (let t = 0; t < plotCount; t++) {
            let res = equation(t);
            if (!this.positiveOnly || (res.x >= 0 && res.y >= 0)) {
                context.lineTo(res.x / this.PPIMulitplier, res.y / this.PPIMulitplier);
            }
        }
    } else {
        context.moveTo(this.minX, equation(this.minX));
        for (let x = this.minX + this.iteration; x <= this.maxX; x += this.iteration) {
            context.lineTo(x, equation(x));
        }
    }

    context.restore();
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = thickness * this.PPIMulitplier;
    context.stroke();
    context.restore();
};

/**
 * Translate context to center
 * Invert Y
 */
Graph.prototype.transformContext = function () {
    const context = this.context;

    // Move context to center of canvas
    this.context.translate(this.centerX, this.centerY);

    /*
     * Stretch grid to fit the canvas window, and
     * invert the y scale so that that increments
     * as you move upwards
     */
    context.scale(this.scaleX, -this.scaleY);
};

/**
 * Graph configuration
 * @type {Graph}
 */
const broadJumpGraph = new Graph({
    canvasId: 'aace-broad-jump-graph',
    minX: -30,
    minY: -15,
    maxX: 160,
    maxY: 30,
    unitsPerTickX: 20,
    unitsPerTickY: 10,
    numbersInside: false,
    ticksInside: false,
    positiveOnly: true,
    drawLastTick: false,
    lineWidth: 1,
    tickStyle: 2,
    PPIMulitplier: 2,
    axisTitleX: "Distance (in)",
    axisTitleY: "Height (in)"
});

/**
 * On input update, redraw the graph
 */
const aaceUpdateGraph = () => {
    if (broadJumpGraph) {
        broadJumpGraph.redrawPlane();
        // Elements
        let accelerationSliderElement = document.getElementById("aace-acceleration-slider");
        let hipSliderElement = document.getElementById("aace-hip-slider");
        let kneeSliderElement = document.getElementById("aace-knee-slider");
        let handSliderElement = document.getElementById("aace-hand-slider");
        let angleOfAttackSliderElement = document.getElementById("aace-angle-of-attack-slider");
        let dragSliderElement = document.getElementById("aace-drag-slider");
        let speedSubTitleElement = document.getElementById("aace-speed-h2");
        let speedSliderElement = document.getElementById("aace-speed-slider");
        let distanceElement = document.getElementById("aace-distance-h2");

        // Inputs
        let accelerationInput = parseFloat(accelerationSliderElement.value);
        let hipInput = parseFloat(hipSliderElement.value);
        let kneeInput = parseFloat(kneeSliderElement.value);
        let handInput = parseFloat(handSliderElement.value);
        let angleOfAttackInput = parseFloat(angleOfAttackSliderElement.value);
        let dragMultiplierInput = parseFloat(dragSliderElement.value);
        // Update acceleration based on hip/knee deltas
        if(hipSliderElement.previous !== undefined) {
            let delta = parseFloat(hipSliderElement.value) - parseFloat(hipSliderElement.previous);
            // Based on relationships
            delta *= .155;
            accelerationSliderElement.value = Math.max(0, Math.min(100, parseFloat(accelerationSliderElement.value) + delta));
        }
        if(kneeSliderElement.previous !== undefined) {
            let delta = parseFloat(kneeSliderElement.value) - parseFloat(kneeSliderElement.previous);
            // Based on relationships
            delta *= .345;
            accelerationSliderElement.value = Math.max(0, Math.min(100, parseFloat(accelerationSliderElement.value) + delta));
        }
        if(handSliderElement.previous !== undefined) {
            let delta = parseFloat(handSliderElement.value) - parseFloat(handSliderElement.previous);
            // Based on relationships - Bigger relationship, but scaled down
            delta *= .805;
            accelerationSliderElement.value = Math.max(0, Math.min(100, parseFloat(accelerationSliderElement.value) + delta));
        }
        if(hipSliderElement.previous !== undefined && kneeSliderElement.previous !== undefined) {
            // Do not use oninput else callback loop
            accelerationInput = parseFloat(accelerationSliderElement.value);
            drawSliderTrack("aace-acceleration-slider");
        }
        // Store previous values for deltas
        hipSliderElement.previous = hipSliderElement.value;
        kneeSliderElement.previous = kneeSliderElement.value;
        accelerationSliderElement.previous = accelerationSliderElement.value;
        handSliderElement.previous = handSliderElement.value;
        // Factor into speed
        // Bound from 3 to 15
        // Utilizing our targets & percent relationships: .42 for launch accel, .115 for hip extension, .145 for knee, .395 for hand
        let velocityInput = 12 * (.42 * accelerationInput / 100 + .115 * hipInput / 100 + .145 * kneeInput / 100 * handInput / 100 + .395) / (.42 + .115 + .145 + .395) + 3;
        // Write to the speed display
        if (speedSubTitleElement) {
            speedSubTitleElement.innerHTML = GRAPH_SPEED_SUBTITLE_TEXT + velocityInput.toFixed(1) + ' mph';
        }
        if (speedSliderElement) {
            speedSliderElement.value = 100 * (velocityInput - 3) / 12;
            // Trigger track update, this does not call aaceUpdateGraph()
            speedSliderElement.oninput();
        }
        // Constants
        let v_0 = velocityInput * 0.447;// mph to m/s, initial velocity
        let y_0 = 0;
        let angleOfAttack = angleOfAttackInput * Math.PI / 180; // Degrees to radians, relative to horizontal
        let gravity = 9.81; // m/s (0, -g)
        let mass = 100 * 1000; // g
        let diameter = 2 * 1000; // mm
        let dragCoefficient = 1.3 * dragMultiplierInput / 100; // 1 - 1.3 for a human
        let densityOfAir = 1.2; // kg/m^3
        let duration = 2;
        let dt = .001;
        let plotCount = 1000;
        const unitConversion = 39.37;

        // let k = .7;
        let k = dragConstant(mass, diameter, dragCoefficient, densityOfAir);

        // Calculate path
        let out = trajectory(gravity, v_0, angleOfAttack, mass, y_0, k, duration, dt, plotCount);
        // console.log(out);

        // Draw the points
        broadJumpGraph.drawEquation(t => {
            // Bound T
            if (t < 0 || t >= out.length) {
                return NaN;
            }
            let x = out[t][0];
            let y = out[t][1];
            // Convert meters to inches
            x *= unitConversion;
            y *= unitConversion;
            return {x, y};
        }, '#d4af37', 2, true, plotCount);

        // Draw a dot on the X intersect
        // Second X intersect
        let xIntersect_x;
        for (let i = 1; i < out.length; i++) {
            if (out[i][0] !== 0 && out[i][1] <= 0) {
                // Average between this and the previous
                // We skip index 0 as we don't want x=0,y=0
                xIntersect_x = (out[i][0] + out[i - 1][0]) / 2
                break;
            }
        }
        if (xIntersect_x !== undefined) {
            if (distanceElement) {
                distanceElement.innerHTML = GRAPH_DISTANCE_SUBTITLE_TEXT + Math.round((xIntersect_x * unitConversion)) + ' in';
            }
            broadJumpGraph.drawDot(xIntersect_x * unitConversion, 0, '#d4af37');
        }
    }
}
aaceUpdateGraph();

