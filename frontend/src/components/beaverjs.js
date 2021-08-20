/* eslint-disable */

import Cookies from "js-cookie";

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

class Class {
  constructor(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.background = obj.background;
    this.desc = obj.desc;
  }
}

function Client() {
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
      credentials:"include"
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

  this.loadToken = () => {
    token = Cookies.get("auth_token");
    return token;
  };

  const query = async (path) => {
    const update = await checkToken(token);
    if (update.error) {
      return update;
    } else if (update.token) {
      Cookies.set("auth_token", update.token, {sameSite: "Strict"});
      token = update.token;
    }

    const url = new URL(path);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      credentials:"include"
    });
    const obj = await res.json();
    return obj;
  };


  this.getUser = async (userID) => {
    const obj = await query(`http://localhost:8000/api/users/${userID}/get`);
    if(obj.error) {
      return obj;
    }
    const user = new User(obj);
    return user;
  };

  this.me = async () => {
    const obj = await query("http://localhost:8000/api/users/me");
    if(obj.error) {
      return obj;
    }
    const user = new User(obj);
    return user;
  };

  this.getCourses = async () => {
    const obj = await query("http://localhost:8000/api/users/me/classes");
    if(obj.error) {
      return obj;
    }
    const classes = obj.classes.map(c => {
      return new Class(c);
    });
    return classes;
  };

  this.getAnnouncements = async (classID) => {
    const obj = await query(`http://localhost:8000/api/${classID ? `classes/${classID}/announcements` : "users/me/announcements"}`);
    if(obj.error) {
      return obj;
    }
    const announcements = obj.announcements.map(a => {
      return new Announcement(a);
    });
    return announcements;
  };

  this.getClass = async (classID) => {
    const obj = await query(`http://localhost:8000/api/classes/${classID}/get`);
    if(obj.error) {
      return obj;
    }
    const c = new Class(obj);
    return c;
  };

  this.getAnnouncement = async (classID) => {
    const obj = await query(`http://localhost:8000/api/classes/${classID}/announcements`);
    if(obj.error) {
      return obj;
    }
    const announcements = obj.announcements.map(a => {
      new Announcement(a);
    });
    return announcements;
  };

  this.getContentModules = async (classID, contentID) => {
    return [
      {
        type: "text",
        settings: {
          selectable: true,
          data: `<p >ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddasdq<i> wdasjldj</i>as<u><b>d asd</b></u><u>awss</u>d qwo daw<s>opd jaw</s>spod lkas</p><h1 >s<i>a</i><a href="jknflkaldfdsd"><i>dla</i><i><b>s</b></i><b>kd</b></a><b>j qw</b>a <u>da</u>s <i>dq</i><s><i><b>w</b></i></s><s> ea </s>eas<s>e</s><s><u>a</u></s><u>s</u></h1><h5 ><u>rka woe</u><u><i> q</i></u><s><u><i><b>woej</b></i></u></s><s><u><b>a</b></u></s><u>wo</u>ed qwjo<b>q ejaj</b><u><b>d alw</b></u><u>sd asw</u></h5>`
        }
      },
      {
        type: "image",
        settings: {
          size: 80,
          source: "https://static.zerochan.net/Nishikino.Maki.full.2735664.jpg"
        }
      },
      {
        type: "youtube",
        settings: {
          size: 80,
          source: "https://www.youtube.com/embed/OURLqqtlaLo"
        }
      }
    ];
  };
}

export default Client;