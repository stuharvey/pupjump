import React, { Component } from 'react'
import Platform from './Platform'
import Pup from './Pup'
import { RandNum } from './util'

const SCROLL_SPEED = 50;
const NUM_PLATFORMS = 12;

const KEYS = {
  LEFT: [37, 65],
  RIGHT: [39, 68],
  UP: [38, 87, 32]
}

export class PupJump extends Component {
  constructor () {
    super();
    this.state = {
      screen: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      keysPressed: {
        left  : 0,
        right : 0,
        up    : 0
      },
      ctx: null,
      score: 0,
      topScore: localStorage.topscore || 0
    }

    this.pup = null;
    this.pupImage = new Image();

    this.platforms = [];

    this.handleResize = this.handleResize.bind(this);

    this.lastTime;
    this.currentTime;

    this.shiftThreshold = (3 / 4) * this.state.screen.height;
    this.maxPlatform = null;
    this.rand = new RandNum();
  }

  handleResize () {
    this.setState({
      screen: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  updateKeys (newState, e) {
    let keys = this.state.keysPressed;
    let code = e.keyCode;

    if (KEYS.LEFT.includes(code))  keys.left = newState;
    if (KEYS.RIGHT.includes(code)) keys.right = newState;
    if (KEYS.UP.includes(code))    keys.up = newState;

    this.setState({
      keysPressed: keys
    });
  }

  componentDidMount () {
    this.addEventListeners();
    const ctx = this.refs.canvas.getContext('2d');
    this.setState({ ctx : ctx });
    this.init();

    // start the game loop
    requestAnimationFrame(() => this.update());
  }

  addEventListeners () {
    window.addEventListener('keyup', this.updateKeys.bind(this, false));
    window.addEventListener('keydown', this.updateKeys.bind(this, true));
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateKeys);
    window.removeEventListener('resize', this.updateKeys);
    window.removeEventListener('resize', this.handleResize);
  }

  init () {
    this.worldShift = 0;

    let w = this.state.screen.width;
    let h = this.state.screen.height;
    this.setState({
      score: 0
    });

    this.pup = new Pup({
      pos: {
        x: this.state.screen.width / 2,
        y: this.state.screen.height / 2
      }
    });

    this.platforms = [new Platform({
      pos: {
        x: (w / 2) - (Platform.WIDTH / 2),
        y: (3 * h / 4)
      }
    })];
    this.maxPlatform = this.platforms[0];

    this.addPlatform();

    // this.addPlatform(this.platforms[0]);
    this.lastTime = Date.now();
  }

  update () {
    this.redrawBackground();
    let state = this.state;

    this.currentTime = Date.now();
    let delta = (this.currentTime - this.lastTime) / 1000;

    if (delta < 0.2) { // don't update if delta too large, e.g. tabbing in
      this.scrollUp(delta);
      this.checkCollisions(delta);
      if (!this.pup.update(state, delta)) {
        this.init();
      }
      this.updatePlatforms(state, delta);
    }

    this.lastTime = this.currentTime;
    requestAnimationFrame(() => this.update());
  }

  updatePlatforms(state, delta) {
    this.platforms = this.platforms.reduce(function(plats, p) {
      if (p.update(state, delta)) plats.push(p);
      return plats;
    }, []);
    this.addPlatform(this.platforms[this.platforms.length - 1]);
  }

  scrollUp(delta) {
    if (this.pup.top < this.state.screen.height / 4) {
      this.worldShift = this.shiftThreshold - this.pup.top;
    }
    if (this.worldShift > 0) {
      let modifier = (
        (this.shiftThreshold + this.worldShift) / this.shiftThreshold
      );
      if (modifier < 1) modifier = 1;
      let shiftAmt = SCROLL_SPEED * Math.pow(modifier, 5) * delta;
      let plats = this.platforms;
      for (let i = 0; i < plats.length; i++) {
        plats[i].top = plats[i].top + shiftAmt;
      }
      this.pup.pos.y += shiftAmt;
      this.worldShift -= shiftAmt;
    }
  }

  redrawBackground () {
    let state = this.state;
    let ctx = state.ctx;

    ctx.save();
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, state.screen.width, state.screen.height);
    ctx.restore();
  }

  checkCollisions(delta) {
    let state = this.state;
    let collidePlatform = -1;
    for (let i = 0; i < this.platforms.length; i++) {
      if (this.pup.checkCollision(delta, this.platforms[i]))
        collidePlatform = i;
    }
    if (collidePlatform !== -1) {
      this.pup.standing = false;
      let plat = this.platforms[collidePlatform];
      if (plat.top < this.shiftThreshold) {
        this.worldShift = this.shiftThreshold - plat.top;
      }
    }
  }

  addPlatform () {
    if (this.platforms.length >= NUM_PLATFORMS) return;

    let rand = this.rand;
    let base = this.maxPlatform;
    let x0 = base.left;
    let y0 = base.top;

    let dx = rand.sign() * rand.inRange(Platform.MIN_X_SEP, Platform.MAX_X_SEP);
    let dy = rand.inRange(Platform.MIN_Y_SEP, Platform.MAX_Y_SEP);

    if (x0 < this.state.screen.width / 4) dx = Math.abs(dx);
    else if (x0 > (3/4) * this.state.screen.width) dx = -Math.abs(dx);
    let type = Math.random() > .25 ? 'normal' : 'boost';
    let newPlat = new Platform({
      pos: {
        x: x0 + dx,
        y: y0 - dy
      },
      type: type
    });

    if (newPlat.top < this.maxPlatform.top)
      this.maxPlatform = newPlat;

    this.platforms.push(newPlat);
  }

  render () {
    return (
      <div>
        <canvas ref="canvas"
          width={this.state.screen.width}
          height={this.state.screen.height}
        />
      </div>
    )
  }
}
