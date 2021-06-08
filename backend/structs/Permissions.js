
class Permissions {

  // Bitwise or's all the elements together
  static or(arr) {
    return arr.reduce((x, y) => x | y);
  }

  static permsDict = {
    "a": 1,
    "b": 2,
    "c": 4,
    "d": 8,
    "e": 16,
    "f": 32,
    "g": 64,
    "h": 128,
    "i": 256,
    "j": 512,
    "k": 1024,
    "l": 2048,
    "m": 4096,
    "n": 8192,
    "o": 16384,
    "p": 32768,
    "q": 65536,
    "r": 131072,
    "s": 262144,
    "t": 524288,
    "u": 1048576,
    "v": 2097152,
    "w": 4194304,
    "x": 8388608,
    "y": 16777216,
    "z": 33554432,
  }


  constructor(perms) {
    if (typeof (perms) === "number") {
      // Takes in an integer, permissions are read from each bit
      this.binPerms = perms;
    }

    else {
      // Or takes in an array of strings, each string being the permission name
      this.binPerms = 0;
      for (const s of perms) {
        this.binPerms |= Permissions.permsDict[s];
      }
    }
  }


  has(perms) {
    if (typeof (perms) === "number") {
      // Takes in an integer as a bit-set of permissions
      return !! ((this.binPerms & perms) === perms);
    }

    else if (typeof (perms) === "string") {
      // Takes in a string
      return !! ((this.binPerms & Permissions.permsDict[perms]) === Permissions.permsDict[perms]);
    }

    else {
      // Takes in an array of strings as the permission names
      return !! ((this.binPerms & or(perms.map(s => Permissions.permsDict[s]))) === perms);
    }
  }


  set(perm, bool) {
    if (typeof (perm) === "string") {
      // Cast string to the corresponding permission number
      perm = Permissions.permsDict[perm];
    }

    if (bool) {
      if (!(this.binPerms & perm)) {
        this.binPerms += perm;
      }
    }

    else {
      if (this.binPerms & perm) {
        this.binPerms -= perm;
      }
    }
  }


  toggle(perms) {
    if (typeof (perms) === "number") {
      // Takes in an integer as a bit-set of permissions
      this.binPerms ^= perms;
    }

    else if (typeof (perms) === "string") {
      // Takes in a string
      this.binPerms ^= Permissions.permsDict[perms];
    }

    else {
      // Takes in an array of strings as the permission names
      return this.binPerms ^= or(perms.map(s => Permissions.permsDict[s]));
    }
  }


  all() {
    // Returns a list of strings containing every accessible permission 
    return Object.keys(Permissions.permsDict).filter(p => this.has(p));
  }
}


module.exports = Permissions;