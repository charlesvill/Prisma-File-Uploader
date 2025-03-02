const prisma = require("../prisma/prisma.js");

async function createFolderByUser(userid, folderName) {
  const response = await prisma.folder.create({
    data: {
      folder_name: folderName,
      owner: {
        connect: {
          id: Number(userid)
        },
      },
    },
    include: {
      owner: {
        include: {
          folders: true,
        },
      },
    },
  });

  return response;
}

module.exports = {
  createFolderByUser,
};

