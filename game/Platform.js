import { Rectangle } from './util'
import { PLAT,  } from './constants'

const FALL_SPEED = 200;

export default class Platform extends Rectangle {
  constructor (args) {
    super(args.pos.x, args.pos.y, PLAT.WIDTH, PLAT.HEIGHT);
    this.type = args.type;
    this.falling = false;
    this.images = args.images;
    
    if (this.type === PLAT.MOVING) {
      this.xOrigin = args.pos.x;
      this.travelDistance = (Math.random() * PLAT.BASE_TRAVEL_DISTANCE + PLAT.BASE_TRAVEL_DISTANCE) / 2
      this.xDir = Math.random() < .5 ? -1 : 1
    }
  }

  update (state, delta) {
    if (this.falling) {
      this.top += PLAT.FALL_SPEED * delta;
    }
    if (this.top > state.screen.height) {
      return false;
    }
    if (this.type === PLAT.MOVING) {
      // handle horizontal translation
      const xMin = Math.max(0, this.xOrigin - this.travelDistance / 2)
      const xMax = Math.min(
        state.screen.width - PLAT.WIDTH, 
        this.xOrigin + this.travelDistance / 2
      )
      this.left += PLAT.MOVE_SPEED * delta * this.xDir
      if (this.left < xMin) {
        this.left = xMin;
        this.xDir *= -1;
      }
      else if (this.left > xMax) {
        this.left = xMax;
        this.xDir *= -1;
      }
    }
    this.draw(state);
    return true;
  }

  draw (state) {
    const ctx = state.ctx;
    ctx.save();
    if (this.type === 'boost')
      ctx.fillStyle = 'blue';
    else if (this.type === PLAT.MOVING)
      ctx.fillStyle = 'green';
    else
      ctx.fillStyle = '#000';
    ctx.fillRect(this.left, this.top, this.w, this.h);
    ctx.restore();
  }
}