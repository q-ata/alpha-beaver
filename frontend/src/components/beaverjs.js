import Cookies from "js-cookie";

class User {
  constructor(obj) {
    this.id = obj.id;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.perms = obj.perms;
    this.classes = obj.classes;
    this.standings = obj.standings;
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

class Class {
  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.background = obj.background;
    this.desc = obj.desc;
  }
}

function Client() {
  const token = Cookies.get("auth_token");

  const query = async (path) => {
    const url = new URL(path);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const obj = await res.json();
    return obj;
  };

  this.getUser = async (userID) => {
    const obj = await query(`http://localhost:8000/api/users/${userID}/get`);
    const user = new User(obj);
    return user;
  };

  this.me = async () => {
    const obj = await query("http://localhost:8000/api/users/me");
    const user = new User(obj);
    return user;
  };

  this.getCourses = async () => {
    const obj = await query("http://localhost:8000/api/users/me/classes");
    const classes = obj.classes.map(c => {
      return new Class(c);
    });
    return classes;
  };

  this.getAnnouncements = async () => {
    const obj = await query("http://localhost:8000/api/users/me/announcements");
    const announcements = obj.announcements.map(a => {
      return new Announcement(a);
    });
    return announcements;
  };

  this.getClass = async (classID) => {
    const obj = await query(`http://localhost:8000/api/classes/${classID}/get`);
    const c = new Class(obj);
    return c;
  };

  this.getAnnouncement = async (classID) => {
    const obj = await query(`http://localhost:8000/api/classes/${classID}/announcements`);
    const announcements = obj.announcements.map(a => {
      new Announcement(a);
    });
    return announcements;
  };
}

export default new Client();