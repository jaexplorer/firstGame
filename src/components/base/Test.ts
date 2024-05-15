// TypeScript

interface PLColor {
  hex: number;
}
class Vect {
  x: number;
  y: number;
}
let id = 0;
let border: number[] = [];
let extents: PLSquadInfo[] = [];
let color: PLColor;
let selected: boolean;
let pointed: boolean;
let immunity: number;
let boundmc: BoundMC;
class PLSquadInfo {
  public diff: Vect;
  public dist: number;
  public sid: number;
  public aang: number;
  public ang: number;
  public pos: Vect;

  constructor() {
    this.diff = new Vect();
    this.dist = 0;
    this.sid = 0;
    this.aang = 0;
    this.ang = 0;
    this.pos = new Vect();
  }
}

interface GraphicsContext {
  clear(): void;
  beginFill(color: number, alpha: number): void;
  lineStyle(width: number, color: number, alpha: number): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  endFill(): void;
}

interface BoundMC {
  graphics: GraphicsContext;
  visible: boolean;
  x: number;
  y: number;
}

export const cleanExtents = () => {
  var _loc1_ = new Array();
  for (const _loc2_ of extents) {
    if (_loc2_.sid == id) {
      _loc1_.push(_loc2_);
    }
  }
  extents = _loc1_;
  return extents.length;
};

export const drawBounds = (): void => {
  let _loc6_: number = 0;
  let _loc7_: number = 0;
  let _loc1_: number = cleanExtents();
  extents.sort((a, b) => a.ang - b.ang);

  border = new Array<number>();
  let _loc2_: number = _loc1_ / 1.5;
  let _loc3_: number = 360 / _loc2_;
  let _loc4_: number = 0;

  if (_loc2_ > 12) {
    _loc2_ = 12;
  }

  if (_loc2_ < 6) {
    _loc7_ = 0;
    while (_loc7_ < _loc1_) {
      border.push(_loc7_);
      _loc7_++;
    }
  } else {
    _loc7_ = 1;
    while (_loc7_ < _loc1_) {
      if (extents[_loc7_].ang > _loc3_) {
        border.push(_loc4_);
        _loc3_ += 360 / _loc2_;
        _loc4_ = _loc7_;
      } else if (extents[_loc7_].dist > extents[_loc4_].dist) {
        _loc4_ = _loc7_;
      }
      _loc7_++;
    }
  }

  let _loc5_: GraphicsContext;
  _loc5_ = boundmc.graphics;
  _loc5_.clear();

  if (border.length === 0) {
    boundmc.visible = false;
    return;
  }

  if (selected) {
    _loc5_.beginFill(color.hex, 0.4);
    _loc5_.lineStyle(3, color.hex, 0.8);
  } else if (pointed) {
    _loc5_.beginFill(color.hex, 0.15);
  }

  if (immunity > 0) {
    _loc5_.lineStyle(3, 16777215, 1);
  }

  _loc5_.moveTo(extents[border[0]].pos.x, extents[border[0]].pos.y);

  for (let _loc6_ of border) {
    _loc5_.lineTo(extents[_loc6_].pos.x, extents[_loc6_].pos.y);
  }

  _loc5_.lineTo(extents[border[0]].pos.x, extents[border[0]].pos.y);
  _loc5_.endFill();

  boundmc.x = boundmc.y = 0;

  if (selected || pointed || immunity > 0) {
    boundmc.visible = true;
  } else {
    boundmc.visible = false;
  }
};
