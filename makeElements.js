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
<!-- AIO CSS -->
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