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
