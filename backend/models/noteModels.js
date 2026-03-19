const Note = require("../schema/Note");

const findAll = async () => {
  return await Note.findAll({
    attributes: ["id", "judul", "isi", "tanggal_dibuat"],
    order: [["tanggal_dibuat", "DESC"]],
  });
};

const create = async (noteData) => {
  return await Note.create(noteData);
};

const findById = async (id) => {
  return await Note.findByPk(id, {
    attributes: ["id", "judul", "isi", "tanggal_dibuat"],
  });
};

const updateById = async (id, noteData) => {
  const note = await Note.findByPk(id);

  if (!note) {
    return null;
  }

  await note.update(noteData);
  return note;
};

const deleteById = async (id) => {
  const note = await Note.findByPk(id);

  if (!note) {
    return null;
  }

  await note.destroy();
  return note;
};

module.exports = {
  findAll,
  create,
  findById,
  updateById,
  deleteById,
};
