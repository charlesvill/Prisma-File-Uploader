// controller for reading the files that are present for a certain user
const prisma = require("../prisma/prisma.js");

async function readAllFoldersByUser(user){
  const userId = user.id;
  console.log(userId);
  const folders = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    include: {
      folders: true,
    },
  });

  console.dir("read all query", folders);

  return folders;
}


module.exports = {
  readAllFoldersByUser,
};
