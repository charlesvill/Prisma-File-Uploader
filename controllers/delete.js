const prisma = require("../prisma/prisma.js");

async function deleteFolderById(folderId){
  // deletes should be cascading. 

    const deleteFiles = prisma.file.deleteMany({
      where: {
        folderId: Number(folderId),
      },
    });
    const deleteFolder = prisma.folder.delete({
      where: {
        id: Number(folderId),
      },
    });

    const transaction = await prisma.$transaction([deleteFiles, deleteFolder]);

  console.log("delete successful");
}

module.exports = {
  deleteFolderById,
};
