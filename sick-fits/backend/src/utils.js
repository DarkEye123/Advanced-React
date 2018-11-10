function hasPermission(currentPermissions, permissionsNeeded) {
  const matchedPermissions = currentPermissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave),
  );
  if (!matchedPermissions.length) {
    return false;
  }
  return true;
}

exports.hasPermission = hasPermission;
