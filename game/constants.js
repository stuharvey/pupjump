// I shouldn't have to do things like this. If there's a better way, please
// create an issue in this repo
export class PUP {
  static get BOUNCE_SPEED () {
    return -1200;
  }

  // Want to be rising for 3/4 a second
  static get FALL_SPEED () {
    return -this.BOUNCE_SPEED / (0.75 * GAME.FPS);
  }

  static get MOVE_SPEED () {
    return this._moveSpeed || 600;
  }

  // Want to be able to cross the whole screen in one second
  static set MOVE_SPEED (gameWidth) {
    this._moveSpeed = gameWidth / GAME.FPS;
  }
}

export class GAME {
  static get FPS () {
    return 60;
  }

  static get NUM_PLATFORMS () {
    return 50;
  }

  static get SCROLL_SPEED () {
    return 50;
  }

  static get KEYS () {
    return {
      LEFT: [37, 65],
      RIGHT: [39, 68],
      UP: [38, 87, 32]
    }
  }
}

export class PLAT {
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
    return 0;
  }

  static get MAX_Y_SEP () {
    return 150;
  }

  static get MIN_Y_SEP () {
    return 20;
  }

  static get FALL_SPEED () {
    return 200;
  }
}
