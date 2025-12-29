export const SCALE = 300;
export const BASE_REAL_X = 210;
export const BASE_REAL_Z = 150;
export const OCT_AREA = 50;
export const OCT_HEIGHT = 3;
export const OCT_RADIUS = Math.sqrt(OCT_AREA / (2 * Math.sqrt(2)));
export const OCT_FACE_DIST = OCT_RADIUS * Math.cos(Math.PI / 8) * 2;

export const CYBER = {
    LENGTH: 5.683,
    WIDTH: 2.032,
    HEIGHT: 1.791,
    WHEELBASE: 3.635,
    GROUND_CLEARANCE: 0.35,
    MAX_SPEED: 50,
    ACCELERATION: 15,
    BRAKE_FORCE: 25,
    TURN_RATE: 2.5,
    FRICTION: 0.97,
    COLOR_BODY: 0xc0c0c0,
    COLOR_WINDOW: 0x1a1a2e,
    COLOR_LIGHT: 0xffffff,
    COLOR_WHEEL: 0x222222
};

export const COLORS = {
    BACKGROUND: 0x151515,
    ROAD: 0x222222,
    GRASS: 0x1a472a,
    LINES: 0xffffff,
    SELECTED: 0x3b82f6,
    SELECTED_EMISSIVE: 0x1e3a8a,
    OCT_WALL: 0x3a3a3a,
    OCT_CAP: 0x1a1a1a,
    OCT_VERTEX: 0xffcc00,
    OCT_HIGHLIGHT: 0x0078d4,
    PYLON_TOWER: 0xc0c0c0,
    PYLON_HEAD: 0x444444,
    PYLON_SHEAVE: 0x333333,
    PYLON_BASE: 0x666666
};

export const SNAP_DISTANCE_ROAD = 8;
export const SNAP_DISTANCE_VEHICLE = 4;
export const SNAP_ANGLE_TOLERANCE = 0.3;
