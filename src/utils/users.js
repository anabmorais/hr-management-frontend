export const alphabeticSort = (userA, userB) => {
    if (userA.name.toLowerCase() < userB.name.toLowerCase()) {
      return -1;
    }
    if (userA.name.toLowerCase() > userB.name.toLowerCase()) {
      return 1;
    }
    return 0;
  };