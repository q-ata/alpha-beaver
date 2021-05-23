class AggregatedPermissions {
  constructor(perms) {
    this.overrides = perms.overrides;
    this.roles = perms.roles;
  }
}

module.exports = AggregatedPermissions;