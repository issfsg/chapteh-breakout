function target(x, y, width, height, color, container) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.elem = document.createElement('div');
    this.deleted = false;
    css(this.elem, {
        backgroundColor: color,
        width: width + 'px',
        height: height + 'px',
        position: 'absolute',
        left: x + 'px',
        top: y + 'px'
    });

    this.container = container;

    this.container.appendChild(this.elem);

    this.delete = () => {
        if(!this.deleted) {
            this.container.removeChild(this.elem);
            this.deleted = true;
        }
    }

    this.isTouched = (domains) => {
        if(!this.deleted) {
            let targetDomains = {
                x: {
                    min: this.x,
                    max: this.x + settings.target.width
                },
                y: {
                    min: settings.canvas.height - this.y - settings.target.height,
                    max: settings.canvas.height - this.y
                },
            }

            return !(
                domains.y.max < targetDomains.y.min || domains.y.min > targetDomains.y.max ||
                domains.x.max < targetDomains.x.min || domains.x.min > targetDomains.x.max
            )
        } else return false;
    }
}

function populateTargets(numRows, numCols, width, height, topOffset, leftOffset, color, container) {
    let targets = []
    for(let i = 0; i < numRows; i++) {
        targets.push([])
        for(let j = 0; j < numCols; j++) {
            targets[i].push(
                new target(
                    (j+leftOffset)*width, (i+topOffset)*settings.target.height, 
                    width, height, color, container
                )    
            )
        }
    }
    return targets;

}

function comments(score, maxScore) {
    if(score < maxScore / 2) {
        return "You can do better!";
    } else if(score < maxScore) {
        return "Come on, you're almost there!";
    } else {
        return "You did it! Great job!";
    }
}