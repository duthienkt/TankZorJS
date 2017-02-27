var ICON_PATH = "http://i.imgur.com/djop4PJ.png";
var ICON_WAIT_PATH = "http://i.imgur.com/E9HQv3q.png";

function Animation(p, imgs, elapseTime, _loop = true) {
    this.length = imgs.length;
    this.currentId = 0;
    this.width = imgs[0].width;
    this.height = imgs[0].height;
    this.delayRemain = elapseTime;
    this.elapseTime = elapseTime;
    this.isLoop = _loop;

    this.isAlive = function() {
        return this.loop || this.currentId < this.length;
    }
    this.copy = function() {
        return new Animation(p, imgs, this.elapseTime, this.isLoop);
    }


    this.draw = function(x, y, w = -1, h = -1) {
        if (!this.isAlive()) return;
        if (w < 0 || h < 0)
            p.image(imgs[this.currentId], x, y);
        else
            p.image(imgs[this.currentId], x, y, w, h);
    };

    this.update = function(deltaTime) {
        this.delayRemain -= deltaTime;
        while (this.delayRemain <= 0) {
            this.currentId += 1;
            this.delayRemain += this.elapseTime;
        }
        if (this.isLoop) {
            while (this.currentId >= this.length) {
                this.currentId = this.currentId - this.length;
            }
        }
    };

    this.noLoop = function() {
        this.isLoop = false;
    }

    this.loop = function() {
        this.isLoop = true;
    }


    this.reset = function() {
        this.currentId = 0;
        this.delayRemain = elapseTime;
    }
}





var TankZor = function(p) {
    var animationCache = {};
    var mMap = {};
    var test;
    var lastTime;
    var currentTime;
    var deltaTime = 0;
    p.preload = function() {
        this.createAnimation(ICON_WAIT_PATH, 6, 100, true, function(a) {
            test = a;
        });
    }

    p.setup = function() {
        p.createCanvas(700, 410);
        currentTime = p.millis();
        deltaTime = 0;
    };

    p.draw = function() {
        lastTime = currentTime;
        currentTime = p.millis();
        deltaTime = currentTime - lastTime;
        p.background(0);
        if (test) {
            test.update(deltaTime);
            test.draw(0, 0);
        }
    };

    this.createAnimation = function(path, length, elapseTime, loop, onSuccess) {
        var res = animationCache[path];
        if (!res) {
            p.loadImage(path, function(im) {
                imgs = splitImage(im, length);
                res = new Animation(p, imgs, elapseTime, loop);
                animationCache[path] = res;
                onSuccess(res.copy());
            });
        } else
            onSuccess(res.copy());
    }
    this.splitImage = function(im, length) {
        var imgs = [];
        var w = Math.floor(im.width / length);
        for (i = 0; i < length; ++i) {
            imgs.push(im.get(w * i, 0, w, im.height));
        }
        return imgs;
    }
};

var myp5 = new p5(TankZor, "gameContainer");
