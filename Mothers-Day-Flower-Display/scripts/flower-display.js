var pulseInterval;
var running = false;

$(document).ready(function(){
    pulsateClickHere();
});

function pulsateClickHere(){
    pulseInterval = setInterval(function(){
        var element = $("#click-message");
        if(element.css("opacity") == 0){
            element.css("opacity", 1);
        }else{
            element.css("opacity", 0);
        }
    }, 1500);
}

function toRadients(value){
    return value * Math.PI / 180;
}

$("#flower-display-click").click(function(){
    if(!running){
        running = true;
        $("#click-message").hide();
        clearInterval(pulseInterval);

        // get each flower flower and explode
        let flowers = $("#flower-display").children().each(function() {
            var flowerElement = $(this);
            var flower = new Flower(flowerElement);
            flower.transitionFlower();
        });
    }
});

class Flower{

    constructor(flower){
        this.flower = flower;
        this.totalRotation = 0;
        this.totalTicks = 0;
        this.maxTicks = 70;

        this.moveLeft = 0;
        this.moveUp = 0;
    }

    transitionFlower(){
        // change position of the flower
        this.positionAbsolute();
        setTimeout(this.positionFlower.bind(this), 5);

        // explode the flower
        this.runScheduler();
    }

    positionAbsolute(){
        this.left = this.flower.offset().left;
        this.top = this.flower.offset().top;
        this.height = this.flower.height();
        this.width = this.flower.width();
    }

    positionFlower(){
        this.flower.css("position", "absolute");
        this.flower.css("height", this.height);
        this.flower.css("width", this.width);
        this.flower.css("left", this.left);
        this.flower.css("top", this.top);
        this.flower.css("margin", "0px");
    }

    runScheduler(){
        var self = this;

        // set rotation
        this.rotate = (Math.random() * 8) - 4;

        // set velocity and angle
        this.velocity = 80;
        this.inverse = Math.floor((Math.random() * 2)) == 1 ? 1 : -1;
        this.angleOfLaunch = toRadients((Math.random() * 10) + 7) * this.inverse;
        this.angleOfLaunch = this.inverse ? this.angleOfLaunch + (.5 * Math.PI) : this.angleOfLaunch;

        var intervalID = setInterval(
            function(){
                self.calcNextPosition();
                self.calcNextRotationValue();
                self.transformFlower();

                if(self.totalTicks >= self.maxTicks){
                    // stop the Interval
                    self.fadeOut(intervalID);
                }

                self.totalTicks += 1;
            }, 10
        );
    }

    fadeOut(intervalID){
        $("#flower-display").fadeOut(200, function(){
            $("#flower-display-click").hide();
            $("#mothers-day-message").fadeIn(200);
            clearInterval(intervalID);
        });
    }

    calcNextRotationValue(){
        this.totalRotation += this.rotate;
    }

    calcNextPosition(){
        this.moveLeft = this.velocity * (this.totalTicks / 5) * Math.cos(this.angleOfLaunch);
        this.moveUp = this.velocity * (this.totalTicks / 5) * Math.sin(this.angleOfLaunch) - (1/2) * 10 * (Math.pow(this.totalTicks / 5, 2));
        this.moveUp *= -1;
    }

    transformFlower(){
        let transform = "translate(" + this.moveLeft + "px, " + this.moveUp + "px) rotate(" + this.totalRotation + "deg)";
        this.flower.css("transform", transform);
    }
}
