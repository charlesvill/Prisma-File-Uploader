const prisma = require("../prisma/prisma.js");
const cloudinary = require("../cloud/cloudinary.js");

async function deleteFolderById(folderId) {
  // will perform cascading delete of all files from folder & cloud

  const deleteRemoteFiles = await prisma.file.findMany({
    where: {
      folderId: Number(folderId),
    },
    select: {
      public_id: true,
    },
  }).then(async (publicIds) => {
      const pubIdArr = publicIds.map(obj=>obj.public_id);
      const response = await cloudinary.deleteManyFromRemote(pubIdArr);
      console.log("remote delete succesful: ", response);
    }).catch((error) => {
     throw new Error(error); 
    });

  try {
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

    const transaction = await prisma.$transaction([deleteFiles, deleteFolder]).then(
      response => console.log("db delete successful: ", response)
    );

  } catch (error) {

    throw new Error(error);
  }
}


module.exports = {
  deleteFolderById,
};
