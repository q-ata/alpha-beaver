import Cookies from "js-cookie";
import Class from "./Class";
import User from "./User";
import Announcement from "./Announce";

function Client() {
  const token = Cookies.get("auth_token");

  this.getUser = async (userID) => {
    const url = new URL("http://localhost:8000/api/users/"+userID+"/get");
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const obj = await res.json();
    const user = new User(obj);
    return user;
  };

  this.me = async () => {
    const url = new URL("http://localhost:8000/api/users/me");
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const obj = await res.json();
    const user = new User(obj);
    return user;
  };

  this.getCourses = async () => {
    const url = new URL("http://localhost:8000/api/users/me/classes");
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const obj = await res.json();
    const classes = obj.classes.map(c => {
      return new Class(c);
    });
    return classes;
  };

  this.getAnnouncements = async () => {
    const url = new URL("http://localhost:8000/api/users/me/announcements");

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const obj = await res.json();
    const announcements = obj.announcements.map(a => {
      return new Announcement(a);
    });
    return announcements;
  };

  this.getClass = async (classID) => {
    const url = new URL("http://localhost:8000/api/classes/" + classID + "/get");

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const obj = await res.json();
    const c = new Class(obj);
    return c;
  };

  this.getAnnouncement = async (classID) => {
    const url = new URL("http://localhost:8000/api/classes/" + classID + "/announcements");

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const obj = await res.json();
    const announcements = obj.announcements.map(a => {
      new Announcement(a);
    });
    return announcements;
  };
}

export default new Client();