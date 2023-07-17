const fs = require("fs").promises;

const deleteImage = async (userImagePath) => {
  //   fs.access(userImagePath)
  //     .then(() => fs.unlink(userImagePath))
  //     .then(() => console.error("user image sas deleted "))
  //     .catch((err) => console.error("user image does not exist "));

  try {
    await fs.access(userImagePath);
    await fs.unlink(userImagePath);
    console.error("user image sas deleted ");
  } catch (error) {
    console.error("user image does not exist ");
  }
};

module.exports = { deleteImage };
