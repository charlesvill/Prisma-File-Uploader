const prisma = require("../prisma/prisma.js");

async function updateFolderById(folderId, folderName) {
  const update = await prisma.folder.update({
    where: {
      id: Number(folderId),
    },
    data: {
      folder_name: folderName,
    },
  });
}

module.exports = {
  updateFolderById,
};
