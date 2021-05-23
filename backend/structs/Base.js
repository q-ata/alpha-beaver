class Base {
  constructor(school) {
    this.school = school;
  }

  print() {
    const copy = Object.assign({}, this);
    delete copy.school;
    console.log(copy);
  }
}

module.exports = Base;