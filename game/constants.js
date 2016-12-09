// This file contains various constants for which a number of components may be
// concerned. If there's a better way to do class-based constants (similar to
// enums maybe?) please ping me or leave an issue on github
export class PUP {
  static get BOUNCE_SPEED () {
    return -1600;
  }

  // Want to be rising for 3/4 a second
  static get FALL_SPEED () {
    return -this.BOUNCE_SPEED / (0.8 * GAME.FPS);
  }

  static get MIN_V_X () {
    return 350;
  }

  static get MAX_V_X () {
    return 1000;
  }

  // Time to accelerate from min horizontal speed to max
  static get INTERP_TIME () {
    return 0.3;
  }
}

export class GAME {
  static get FPS () {
    return 60;
  }

  static get NUM_PLATFORMS () {
    return 30;
  }

  static get SCROLL_SPEED () {
    return 75;
  }

  static get KEYS () {
    return {
      LEFT: [37, 65],
      RIGHT: [39, 68],
      UP: [38, 87, 32]
    }
  }

  static get NUM_IMAGES () {
    return 2;
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
