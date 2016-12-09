import { Rectangle } from './util'
import { PLAT } from './constants'

const FALL_SPEED = 200;

export default class Platform extends Rectangle {
  constructor (args) {
    super(args.pos.x, args.pos.y, PLAT.WIDTH, PLAT.HEIGHT);
    this.type = args.type;
    this.falling = false;
    this.images = args.images;
  }

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

// Alternate drawing style... broken for some reason
// let delta  = 2;
// // background coordinates
// let rLeft   = this.left - delta;
// let rRight  = this.right - delta;
// let rTop    = this.top - delta;
// let rBot    = this.bottom - delta;
// // foreground coordinates
// let fLeft  = this.left + delta;
// let fRight = this.right + delta;
// let fBot   = this.bottom + delta;
// let fTop   = this.top + delta;
//
// let rLeftTop   = [rLeft,  rTop];
// let rRightTop  = [rRight, rTop];
// let rLeftBot   = [rLeft,  rBot];
// let fLeftTop  = [fLeft, fTop];
// let fLeftBot  = [fLeft, fBot];
// let fRightTop = [fRight, fTop];
// let fRightBot = [fRight, fBot];
//
// // front face
// let frontFace = [fLeftTop, fRightTop, fRightBot, fLeftBot];
// // top face
// let topFace = [rLeftTop, rRightTop, fRightTop, fLeftTop];
// // side face
// let sideFace = [rLeftTop, fLeftTop, fLeftBot, rLeftBot];
// let faces = [frontFace, sideFace, topFace];
// for (let i = 0; i < faces.length; i++) {
//   let face = faces[i];
//   ctx.moveTo(face[0][0], face[0][1]);
//   [face[1], face[2], face[3], face[0]].forEach(p => ctx.lineTo(p[0], p[1]));
//   ctx.stroke();
//
// }
