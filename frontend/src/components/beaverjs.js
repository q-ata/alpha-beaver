import Cookies from "js-cookie";

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
      return (this.binPerms & Permissions.or(perms.map(s => Permissions[s]))) === perms;
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
      return this.binPerms ^= Permissions.or(perms.map(s => Permissions[s]));
    }
  }

  all() {
    // Returns a list of strings containing every accessible permission 
    return Permissions.ALL_PERMS.filter((p) => this.has(p));
  }
}

class User {
  constructor(obj) {
    this.id = obj.id;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.perms = obj.perms;
    this.classes = obj.classes;
    this.standings = obj.standings;
    this.pfp = obj.pfp;
  }
}

class Announcement {
  constructor(obj) {
    this.class = obj.class;
    this.title = obj.title;
    this.content = obj.content;
    this.date = obj.date;
  }
}

class Event {
  constructor(obj) {
    this.class = obj.class;
    this.title = obj.title;
    this.content = obj.content;
    this.start = new Date(obj.start);
    this.end = new Date(obj.end);
  }
}

class Class {
  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.background = obj.background;
    this.desc = obj.desc;
  }
}

class Module {
  constructor(obj) {
    this.id = obj.id;
    this.class = obj.class;
    this.type = obj.type;
    this.data = obj.data;
  }
}

class Page {
  constructor(obj) {
    this.id = obj.id;
    this.class = obj.class;
    this.modules = obj.modules;
    this.name = obj.name;
  }
}

class Assignment {
  constructor(obj) {
    this.id = obj.id;
    this.class = obj.class;
    this.title = obj.title;
    this.desc = obj.desc;
    this.due = obj.due;
  }
}

class Grade {
  constructor(data) {
    this.assignment = data.assignment;
    this.student = data.student;
    this.grader = data.grader;
    this.score = data.score;
    this.feedback = data.feedback;
    this.class = data.class;
  }
}

class Client {
  constructor() {
    let token = Cookies.get("auth_token");

    const parseJWT = (token) => {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(atob(base64).split("").map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));

      return JSON.parse(jsonPayload);
    };

    const refresh = async (payload) => {
      const res = await fetch("http://localhost:8000/api/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "user": payload.user,
          "school": payload.school
        }),
        credentials: "include"
      });
      const obj = await res.json();
      return obj;
    };

    const checkToken = async (token) => {
      if (!token) return {error: true, msg: "JWT missing or invalid."};
      const jwtPayload = parseJWT(token);
      if (Date.now() >= jwtPayload.exp * 1000) {
        return await refresh(jwtPayload);
      } else {
        return {};
      }
    };

    const query = async (path, options = {}) => {
      const update = await checkToken(token);
      if (update.error) {
        return update;
      } else if (update.token) {
        Cookies.set("auth_token", update.token, {sameSite: "Strict"});
        token = update.token;
      }

      const url = new URL(path);
      const param = {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      };
      const hasJson = Object.prototype.hasOwnProperty.call(options, "json");
      if (options.body && (!hasJson || options.json)) param.body = JSON.stringify(options.body);
      if (hasJson && !options.json) {
        param.body = options.body;
        delete param.headers["Content-Type"];
      }
      const res = await fetch(url, param);
      const obj = await res.json();
      return obj;
    };


    this.getUser = async (userID) => {
      const obj = await query(`http://localhost:8000/api/users/${userID}/get`);
      if (obj.error) {
        return obj;
      }
      const user = new User(obj);
      return user;
    };

    this.me = async () => {
      const obj = await query("http://localhost:8000/api/users/me");
      if (obj.error) {
        return obj;
      }
      const user = new User(obj);
      return user;
    };

    this.getCourses = async () => {
      const obj = await query("http://localhost:8000/api/users/me/classes");
      if (obj.error) {
        return obj;
      }
      const classes = obj.classes.map(c => {
        return new Class(c);
      });
      return classes;
    };

    this.getAnnouncements = async () => {
      const obj = await query("http://localhost:8000/api/users/me/announcements");
      if (obj.error) {
        return obj;
      }
      const announcements = obj.announcements.map(a => {
        return new Announcement(a);
      });
      return announcements;
    };

    this.getEvents = async () => {
      const obj = await query("http://localhost:8000/api/users/me/events");
      if (obj.error) {
        return obj;
      }
      const events = obj.events.map(a => {
        return new Event(a);
      });
      return events;
    };

    this.getClass = async (classID) => {
      const obj = await query(`http://localhost:8000/api/classes/${classID}/get`);
      if (obj.error) {
        return obj;
      }
      const c = new Class(obj);
      return c;
    };

    this.getPageList = async (classID) => {
      const obj = await query(`http://localhost:8000/api/classes/${classID}/pages`);
      if (obj.error) {
        return obj;
      }
      const pages = obj.pages.map(p => {
        return new Page(p);
      });
      return pages;
    };

    this.getAnnouncement = async (classID) => {
      const obj = await query(`http://localhost:8000/api/classes/${classID}/announcements`);
      if (obj.error) {
        return obj;
      }
      const announcements = obj.announcements.map(a => {
        return new Announcement(a);
      });
      return announcements;
    };

    this.addAnnouncement = async (classID, ann) => {
      const obj = await query(`http://localhost:8000/api/classes/${classID}/addannouncement`, {method: "POST", body: ann});
      return obj;
    };

    this.addEvent = async (classID, event) => {
      const obj = await query(`http://localhost:8000/api/classes/${classID}/addevent`, {method: "POST", body: event});
      return obj;
    };

    this.getContentModules = async (classID, contentID) => {
      const obj = await query(`http://localhost:8000/api/classes/${classID}/pages/${contentID}/modules`);
      if (obj.error) {
        return obj;
      }
      return obj.content_modules.map((e) => new Module(e));
    };

    this.addModule = async (classID, module) => {
      const obj = await query(`http://localhost:8000/api/classes/${classID}/addmodule`, {method: "POST", body: module});
      return obj;
    };

    this.getPage = async (classID, pageID) => {
      const obj = await query(`http://localhost:8000/api/classes/${classID}/pages/${pageID}/get`);
      if (obj.error) return obj;
      return new Page(obj);
    };

    this.setPageModules = async (classID, pageID, modules) => {
      const obj = await query(`http://localhost:8000/api/classes/${classID}/pages/${pageID}/setmodules`, {method: "POST", body: {modules}});
      return obj;
    };

    this.setModules = async (classID, modules) => {
      const obj = await query(`http://localhost:8000/api/classes/${classID}/setmodules`, {method: "POST", body: {modules}});
      return obj;
    };

    this.getAssignments = async (classID) => {
      const obj = await query(`http://localhost:8000/api/classes/${classID}/assignments`);
      if (obj.error) return obj;
      return obj.assignments.map((o) => new Assignment(o));
    };

    this.submitAssignment = async (classID, assignID, files) => {
      const formData = new FormData();
      console.log(files);
      files.forEach((f) => formData.append("submissions", f));
      query(`http://localhost:8000/api/classes/${classID}/submit?assignID=${assignID}`, {method: "POST", body: formData, json: false});
    };

    this.getGrades = async (classID) => {
      const obj = await query(`http://localhost:8000/api/classes/${classID}/grades`);
      if (obj.error) return obj;
      return obj.grades.map((o) => new Grade(o));
    };


    this.getClassPermissions = async (userID, classID) => {
      const url = classID ? `http://localhost:8000/api/classes/${classID}/permissions?userID=${userID}` : `http://localhost:8000/api/classes/${userID}/permissions`;
      const obj = await query(url);
      return new Permissions(obj.bitset);
    };

    this.getGlobalPermissions = async (userID) => {
      const obj = await query(`http://localhost:8000/api/users/${userID}/permissions`);
      return new Permissions(obj.bitset);
    };
  }
}

export default Client;