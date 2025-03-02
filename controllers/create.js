const prisma = require("../prisma/prisma.js");

async function createFolderbyUser(userid) {
  const response = await prisma.folder.create({
    data: {
      folder_name: name,
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
  createFolderbyUser,
};

