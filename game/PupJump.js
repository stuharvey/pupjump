import React, { Component } from 'react'

// Game related imports
import Platform from './Platform'
import Pup from './Pup'
import { RandNum } from './util'
import { GAME, PLAT, PUP } from './constants'

// Component imports
import Link from './components/Link';
import BooksModal from './components/BooksModal';

const getTopScore = () => parseFloat(localStorage.getItem('topScore') || '0');

export class PupJump extends Component {
  state = {
    paused: false,
    screen: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    keysPressed: {
      left: 0,
      right: 0,
      up: 0
    },
    ctx: null,
    score: 0,
    topScore: getTopScore(),
    pupImage: null,
    activeModal: null,
  }

  constructor() {
    super();

    this.pup = null;
    this.loadImages();

    this.platforms = [];

    this.handleResize = this.handleResize.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);

    this.lastTime;
    this.currentTime;

    this.shiftThreshold = (1 / 2) * this.state.screen.height;
    this.maxPlatform = null;
    this.rand = new RandNum();
  }

  loadImages() {
    this.imagesLoaded = 0;
    this.images = {
      pupUpL: new Image(),
      pupUpR: new Image(),
    }
    let that = this;
    this.images.pupUpL.onload = function () {
      that.imagesLoaded += 1;
      if (that.pup !== null)
        that.pup.images.pupUpL = that.images.pupUpL;
    }
    this.images.pupUpR.onload = function () {
      that.imagesLoaded += 1;
      if (that.pup !== null)
        that.pup.images.pupUpR = that.images.pupUpR;
    }
    this.images.pupUpL.src = require('./images/pupL_rise.png');
    this.images.pupUpR.src = require('./images/pupR_rise.png');
  }

  componentDidMount() {
    this.addEventListeners();
    const ctx = this.refs.canvas.getContext('2d');
    this.setState({ ctx: ctx });
    this.init();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateKeys);
    window.removeEventListener('resize', this.updateKeys);
    window.removeEventListener('resize', this.handleResize);
  }

  addEventListeners() {
    window.addEventListener('keyup', this.updateKeys.bind(this, false));
    window.addEventListener('keydown', this.updateKeys.bind(this, true));
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('touchstart', this.handleTouchStart);
    window.addEventListener('touchend', this.handleTouchEnd);
  }

  handleResize() {
    this.setState({
      screen: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  handleTouchStart(e) {
    let x = e.touches[0].pageX;
    if (x < this.state.screen.width / 2) {
      this.state.keysPressed.left = true;
    }
    else {
      this.state.keysPressed.right = true;
    }
  }

  handleTouchEnd(e) {
    this.state.keysPressed.left = false;
    this.state.keysPressed.right = false;
  }

  updateKeys(newState, e) {
    let keys = this.state.keysPressed;
    let code = e.keyCode;

    if (GAME.KEYS.LEFT.includes(code)) keys.left = newState;
    if (GAME.KEYS.RIGHT.includes(code)) keys.right = newState;
    if (GAME.KEYS.UP.includes(code)) keys.up = newState;
    if (e.type === 'keyup' && (e.key === ' ' || e.key === 'Escape')) this.togglePause()

    this.setState({
      keysPressed: keys,
    });
  }

  init() {
    console.log(this.state.topScore, this.state.score)
    if (this.state.score > 0 && this.state.score > getTopScore()) {
      localStorage.setItem('topScore', `${this.state.score}`);
    }

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
      },
      fps: GAME.FPS,
      images: this.imagesLoaded === GAME.NUM_IMAGES ? this.images : {}
    });

    this.platforms = [new Platform({
      pos: {
        x: (w / 2) - (PLAT.WIDTH / 2),
        y: (3 * h / 4)
      },
      type: 'normal',
      images: this.imagesLoaded === GAME.NUM_IMAGES ? this.images : {}
    })];
    this.maxPlatform = this.platforms[0];

    this.addPlatform();

    this.lastTime = Date.now();

    if (this.gameLoop === undefined) {
      this.gameLoop = setInterval(() => this.update(), 1000 / GAME.FPS);
    }
  }

  update() {
    this.redrawBackground();
    const state = this.state;
    const { paused } = state;

    this.currentTime = Date.now();
    const timeDiffMs = (this.currentTime - this.lastTime);
    let delta = paused ? 0.000000001 : timeDiffMs / 1000;

    if (delta < 0.2) { // don't update if delta too large, e.g. tabbing in
      this.scrollUp(delta);
      this.checkCollisions(delta);
      this.updatePlatforms(state, delta);
      let pupState = this.pup.update(state, delta);
      if (!pupState.alive) {
        this.init();
      }
      if (pupState.scoreIncrease > 0) {
        this.updateScore(pupState.scoreIncrease);
      }
    }

    this.lastTime = this.currentTime;
  }

  updateScore(toAdd) {
    this.setState({
      score: this.state.score + toAdd
    });
    if (this.state.score > this.state.topScore) {
      this.setState({
        topScore: this.state.score
      });
    }
  }

  updatePlatforms(state, delta) {
    this.platforms = this.platforms.reduce(function (plats, p) {
      if (p.update(state, delta)) plats.push(p);
      return plats;
    }, []);
    this.addPlatform(this.platforms[this.platforms.length - 1]);
  }

  scrollUp(delta) {
    this.worldShift = this.shiftThreshold - this.pup.top;
    if (this.worldShift > 0) {
      let modifier = (
        (this.shiftThreshold + this.worldShift) / this.shiftThreshold
      );
      if (modifier < 1) modifier = 1;
      let shiftAmt = GAME.SCROLL_SPEED * Math.pow(modifier, 5) * delta;
      let plats = this.platforms;
      for (let i = 0; i < plats.length; i++) {
        plats[i].top = plats[i].top + shiftAmt;
      }
      this.pup.pos.y += shiftAmt;
      this.worldShift -= shiftAmt;
    }
  }

  redrawBackground() {
    let state = this.state;
    let ctx = state.ctx;

    ctx.save();
    ctx.fillStyle = 'beige';
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

  togglePause() {
    this.setState(lastState => {
      this.lastTime = Date.now()
      return { paused: !lastState.paused }
    });
  }

  addPlatform() {
    if (this.platforms.length >= GAME.NUM_PLATFORMS) return;

    let rand = this.rand;
    let base = this.maxPlatform;
    let x0 = base.left;
    let y0 = base.top;

    let dx = rand.sign() * rand.inRange(PLAT.MIN_X_SEP, PLAT.MAX_X_SEP);
    let dy = rand.inRange(PLAT.MIN_Y_SEP, PLAT.MAX_Y_SEP);

    if (x0 < this.state.screen.width / 4) dx = Math.abs(dx);
    else if (x0 > (3 / 4) * this.state.screen.width) dx = -Math.abs(dx);

    const r = Math.random()
    const type = r > 0.15 ? 'normal' : r > .05 ? 'MOVING' : 'boost';
    let w = this.state.screen.width;
    let newPlat = new Platform({
      pos: {
        x: rand.inRange(w / 6, (5 / 6) * w - PLAT.WIDTH),
        y: y0 - dy
      },
      type: type,
      images: this.imagesLoaded === GAME.NUM_IMAGES ? this.images : {},
    });

    if (newPlat.top < this.maxPlatform.top)
      this.maxPlatform = newPlat;

    this.platforms.push(newPlat);
  }

  toggleModal = modalName => e => {
    this.setState(prev => ({ activeModal: prev.activeModal === modalName ? null : modalName }))
    this.togglePause()
  }

  render() {
    const { activeModal } = this.state;
    return (
      <div>
        <BooksModal
          active={activeModal === 'books'}
          handleClose={this.toggleModal('books')}
        />
        <span className="current-score score">Score:
          {parseInt(this.state.score / 100)}
        </span>
        <span className="score top-score">High score:
          {parseInt(this.state.topScore / 100)}
        </span>
        <ul className="links">
          <Link
            address="#"
            text="About"
            onClick={this.toggleModal('aobut')}
          />
          <Link
            address="#"
            text="Books"
            onClick={this.toggleModal('books')}
          />
        </ul>
        <canvas ref="canvas"
          width={this.state.screen.width}
          height={this.state.screen.height}
        />
      </div>
    )
  }
}
