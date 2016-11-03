import { PUP, GAME } from './constants'
import { Interp } from './util'

export default class Pup {
  constructor (args) {
    this.pos = args.pos;
    this.v = {
      x: 0,
      y: 0
    }
    this.xDir = 0; // -1 <=> left, 1 <=> right
    this.moveStart = 0; // time we started moving
    this.w = 20;
    this.h = 20;
    this.jumping = false;
    this.standing = false;
  }

  get left () {
    return this.pos.x - this.w / 2;
  }

  get right () {
    return this.pos.x + this.w / 2;
  }

  get top () {
    return this.pos.y - this.h / 2;
  }

  get bottom () {
    return this.pos.y + this.h / 2;
  }

  update (state, delta) {
    let alive = this.checkBoundaries(state.screen.width, state.screen.height);
    this.updateVelocities(state.keysPressed);
    let scoreIncrease = this.updatePosition(delta);
    this.draw(state.ctx);
    return {
      alive: alive,
      scoreIncrease: scoreIncrease
    };
  }

  updateVelocities (keys) {
    if ((keys.right && keys.left) || !(keys.left || keys.right)) {
      this.xDir = 0;
      this.moveStart = 0;
    }
    else if (keys.right) {
      this.xDir = 1;
    }
    else if (keys.left)
      this.xDir = -1;

    if (this.xDir !== 0) {
      if (this.moveStart === 0) this.moveStart = Date.now();
      let t = (Date.now() - this.moveStart) / (1000 * PUP.INTERP_TIME);
      this.v.x = this.xDir * Interp.smoothValue(PUP.MIN_V_X, PUP.MAX_V_X, t);
    }
    else {
      this.v.x = 0;
    }
  }

  updatePosition (delta) {
    this.v.y += PUP.FALL_SPEED;
    this.pos.x += this.v.x * delta;
    this.pos.y += this.v.y * delta;
    if (this.v.y < 0) {
      return Math.abs(this.v.y * delta);
    }
    return 0;
  }

  checkCollision (delta, platform) {
    let dy = this.v.y * delta;
    let intersects = platform.intersects(
      this.left,
      this.top + dy / 2,
      this.w,
      this.h
    );
    let falling = dy > 0;
    let above = this.pos.y <= platform.top;
    if (intersects && falling && above) {
      this.jumping = true;
      let modifier = platform.type === 'boost' ? 2.5 : 1;
      this.v.y = modifier * PUP.BOUNCE_SPEED;
      platform.falling = true;
      return true;
    }

    return false;
  }

  checkBoundaries (w, h) {
    if (this.right > w) {
      this.pos.x = w - this.w / 2;
      this.v.x = 0;
    }
    else if (this.left < 0) {
      this.pos.x = this.w / 2;
      this.v.x = 0;
    }

    if (this.bottom >= h) {
      return false;
    }
    return true;
  }

  draw (ctx) {
    ctx.save();

    ctx.fillStyle = '#000';

    if (this.image === undefined)
      ctx.fillRect(this.left, this.top, this.w, this.h);
    else
      ctx.drawImage(this.image, this.left, this.top);

    ctx.restore();
  }
}
