import { PUP, GAME } from './constants'

// We want jumps to last 1/2 a second each, so define the jump speed as some
// value:
// const BOUNCE_SPEED = -950;
// then we want the y velocity to reach 0 after a second, so given our FPS,
// calculate gravity as:

// const GRAVITY = -BOUNCE_SPEED / FPS;
// const MOVE_SPEED = 500;

export default class Pup {
  constructor (args) {
    this.pos = args.pos;
    this.v = {
      x: 0,
      y: 0
    }
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
    if (keys.right && keys.left)
      this.v.x = 0;
    else if (keys.right)
      this.v.x = PUP.MOVE_SPEED;
    else if (keys.left)
      this.v.x = -PUP.MOVE_SPEED;
    else
      this.v.x = 0;

    if (keys.up) {
      if (!this.jumping) {
        this.standing = false;
        this.jumping = true;
        this.v.y = BOUNCE_SPEED;
      }
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
