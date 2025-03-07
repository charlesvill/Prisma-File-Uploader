// controller for reading the files that are present for a certain user
const prisma = require("../prisma/prisma.js");

async function readAllFoldersByUser(user) {
  const userId = user.id;
  console.log(userId);
  const { folders } = await prisma.user.findUnique({
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

async function readFolderById(userId, folderId) {
  const { folders } = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
    include: {
      folders: {
        where: {
          id: Number(folderId),
        },
        include: {
          files: {
            where : {
              ownerId: Number(userId),
            },
          },
        },
      },
    },
  });

  console.log("folder contents", folders);
  return folders;
}

async function readFileById(fileId, userId){
  const response = await prisma.file.findUnique({
    where: {
      id: Number(fileId),
      ownerId: Number(userId),
    },
    include: {
      owner: true,
    },
  });

  return response;
}



module.exports = {
  readAllFoldersByUser,
  readFolderById,
  readFileById, 
};
