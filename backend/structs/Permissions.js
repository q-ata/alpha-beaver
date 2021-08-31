
class Permissions {

  // Bitwise or's all the elements together
  static or(arr) {
    return arr.reduce((x, y) => x | y, 0);
  }

  static CREATE_CLASS = 0x1;
  static CREATE_ACCOUNT = 0x2;
  static MANAGE_CLASS = 0x4;
  static MANAGE_ANNOUNCEMENTS = 0x8;
  static MANAGE_EVENTS = 0x10;
  static MANAGE_CONTENT = 0x20;
  static PLACEHOLDER_A = 0x40;
  static PLACEHOLDER_C = 0x40
  static PLACEHOLDER_D = 0x80
  static PLACEHOLDER_E = 0x100
  static PLACEHOLDER_F = 0x200
  static PLACEHOLDER_G = 0x400
  static PLACEHOLDER_H = 0x800
  static PLACEHOLDER_I = 0x1000
  static PLACEHOLDER_J = 0x2000
  static PLACEHOLDER_K = 0x4000
  static PLACEHOLDER_L = 0x8000
  static PLACEHOLDER_M = 0x10000
  static PLACEHOLDER_N = 0x20000
  static PLACEHOLDER_O = 0x40000
  static PLACEHOLDER_P = 0x80000
  static PLACEHOLDER_Q = 0x100000
  static PLACEHOLDER_R = 0x200000
  static PLACEHOLDER_S = 0x400000
  static PLACEHOLDER_T = 0x800000
  static PLACEHOLDER_U = 0x1000000
  static PLACEHOLDER_V = 0x2000000
  static PLACEHOLDER_W = 0x4000000
  static PLACEHOLDER_X = 0x8000000
  static PLACEHOLDER_Y = 0x10000000
  static PLACEHOLDER_Z = 0x20000000

  static ALL_PERMS = ["CREATE_CLASS", "CREATE_ACCOUNT", "MANAGE_CLASS", "MANAGE_ANNOUNCEMENTS", "MANAGE_EVENTS", "MANAGE_CONTENT",
    "PLACEHOLDER_A", "PLACEHOLDER_B", "PLACEHOLDER_C", "PLACEHOLDER_D", "PLACEHOLDER_E", "PLACEHOLDER_F", "PLACEHOLDER_G", "PLACEHOLDER_H",
    "PLACEHOLDER_I", "PLACEHOLDER_J", "PLACEHOLDER_K", "PLACEHOLDER_L", "PLACEHOLDER_M", "PLACEHOLDER_N", "PLACEHOLDER_O", "PLACEHOLDER_P",
    "PLACEHOLDER_Q", "PLACEHOLDER_R", "PLACEHOLDER_S", "PLACEHOLDER_T", "PLACEHOLDER_U", "PLACEHOLDER_V", "PLACEHOLDER_W", "PLACEHOLDER_X",
    "PLACEHOLDER_Y", "PLACEHOLDER_Z"];

  constructor(perms) {
    if (typeof perms === "number") {
      // Takes in an integer, permissions are read from each bit
      this.binPerms = perms;
    }
    else {
      // Or takes in an array of strings, each string being the permission name
      this.binPerms = 0;
      for (const s of perms) {
        this.binPerms |= Permissions[s];
      }
    }
  }

  has(perms) {
    if (perms instanceof Permissions) return this.has(perms.binPerms);
    if (typeof perms === "number") {
      // Takes in an integer as a bit-set of permissions
      return (this.binPerms & perms) === perms;
    }
    else if (typeof perms === "string") {
      // Takes in a string
      return (this.binPerms & Permissions[perms]) === Permissions[perms];
    }
    else if (Array.isArray(perms)) {
      // Takes in an array of strings as the permission names
      return (this.binPerms & or(perms.map(s => Permissions[s]))) === perms;
    }
    else {
      console.error(`Invalid permission check: ${JSON.stringify(perms)}`);
      return false;
    }
  }

  set(perm, bool) {
    if (typeof perm === "string") {
      // Cast string to the corresponding permission number
      perm = Permissions[perm];
    }
    if (bool && !this.has(perm)) {
      this.binPerms += perm;
    }
    else if (!bool && this.has(perm)) {
      this.binPerms -= perm;
    }
  }

  toggle(perms) {
    if (typeof perms === "number") {
      // Takes in an integer as a bit-set of permissions
      this.binPerms ^= perms;
    }
    else if (typeof perms === "string") {
      // Takes in a string
      this.binPerms ^= Permissions[perms];
    }
    else {
      // Takes in an array of strings as the permission names
      return this.binPerms ^= or(perms.map(s => Permissions[s]));
    }
  }

  all() {
    // Returns a list of strings containing every accessible permission 
    return Permissions.ALL_PERMS.filter((p) => this.has(p));
  }
}

module.exports = Permissions;