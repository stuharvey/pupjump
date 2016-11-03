import { Rectangle } from './util'
import { PLAT } from './constants'

const FALL_SPEED = 200;

export default class Platform extends Rectangle {
  constructor (args) {
    super(args.pos.x, args.pos.y, PLAT.WIDTH, PLAT.HEIGHT);
    this.type = args.type;
    this.falling = false;
  }

  // So we can get the platform width anywhere

  update (state, delta) {
    if (this.falling) {
      this.top += PLAT.FALL_SPEED * delta;
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
    if (this.type === 'boost')
      ctx.fillStyle = 'blue';
    else
      ctx.fillStyle = '#000';
    ctx.fillRect(this.left, this.top, this.w, this.h);
    ctx.restore();
  }
}
