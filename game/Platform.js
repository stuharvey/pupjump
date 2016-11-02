import { Rectangle } from './util'

const FALL_SPEED = 200;

export default class Platform extends Rectangle {
  constructor (args) {
    super(args.pos.x, args.pos.y, Platform.WIDTH, Platform.HEIGHT);
    this.falling = false;
  }

  // So we can get the platform width anywhere
  static get WIDTH() {
    return 30;
  }

  static get HEIGHT() {
    return 10;
  }

  static get MAX_X_SEP () {
    return 200;
  }

  static get MIN_X_SEP () {
    return 100;
  }

  static get MAX_Y_SEP () {
    return 150;
  }

  static get MIN_Y_SEP () {
    return 50;
  }

  update (state, delta) {
    if (this.falling) {
      this.top += FALL_SPEED * delta;
    }
    if (this.top > state.screen.height) {
      return false;
    }
    this.draw(state);
    return true;
  }

  draw (state) {
    const ctx = state.ctx;
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.fillRect(this.left, this.top, this.w, this.h);
    ctx.restore();
  }
}
