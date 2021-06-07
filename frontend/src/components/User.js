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

export default User;