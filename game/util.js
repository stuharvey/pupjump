export class Rectangle {
  constructor (x, y, w, h) {
    this.w = w;
    this.h = h;

    this.left = x;
    this.top = y;
  }

  get top () {
    return this._top;
  }

  get left () {
    return this._left;
  }

  get bottom () {
    return this._bottom;
  }

  get right () {
    return this._right;
  }

  set top (y) {
    this._top = y;
    this._bottom = this.top + this.h;
  }

  set left (x) {
    this._left = x;
    this._right = this.left + this.w;
  }

  intersectsRect (other) {
    return (this.left  <= other.right  &&
            other.left <=  this.right  &&
            this.top   <= other.bottom &&
            other.top  <=  this.bottom)
  }

  intersects (x, y, w, h) {
    return this.intersectsRect({
      left: x,
      right: x + w,
      top: y,
      bottom: y + h
    });
  }
}

export class RandNum {
  constructor () {

  }

  inRange (start, end) {
    return Math.random() * (end - start) + start;
  }

  sign () {
    return Math.pow(-1, this.binary());
  }

  binary () {
    return Math.random() > .5 ? 0 : 1;
  }
}

export class Interp {
  // Smoothly interpolates from min to max given the current time
  static smoothValue(min, max, t) {
    return Interp.smoothstep(0, 1, t) * (max - min) + min;
  }

  static smoothstep(min, max, x) {
    x = Interp.clamp((x - min)/(max - min), 0.0, 1.0);
    return x*x*x*(x*(x*6 - 15) + 10);
  }


  // Clamp x to the interval [a, b]
  static clamp(x, a, b) {
    return x < a ? a : (x > b ? b : x);
  }
}
