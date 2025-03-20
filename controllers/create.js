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

async function createFileByUser(
  fileName, 
  fileExt, 
  fileSize,
  fileUrl,
  publicId,
  userId,
  folderId
){
  const response = await prisma.file.create({
    data: {
      file_name: fileName,
      file_extension: fileExt,
      file_size: Number(fileSize),
      file_url: fileUrl,
      public_id: publicId,
      owner: {
        connect: {
          id: Number(userId),
        },
      },
      folder: {
        connect: {
          id: Number(folderId),
        },
      },
    },
    include: {
      folder: {
        include: {
          files: true,
        },
      },
    },
  }).catch((error) => {
      throw new Error(error);
    });

  // console.log("file creation response", response);
  // console.log("folder contents: ", response.folder.files);
  return response;
}

async function createShareLink(folderId, shareCode, lifeSpan) {
  const response = await prisma.share.create({
    data: {
      folder: {
        connect: {
          id: parseInt(folderId),
        },
      },
      share_code: shareCode,
      lifespan: parseInt(lifeSpan),
    },
  });


  return response;
}

module.exports = {
  createFolderByUser,
  createFileByUser,
  createShareLink,
};

