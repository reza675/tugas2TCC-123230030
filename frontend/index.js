let port = 3000;

const getApiBase = () => `http://localhost:${port}/api/v1/notes`;

document.addEventListener("DOMContentLoaded", () => {
  const inputPort = prompt(
    'Masukkan port Back-End\nPort default: 3000'
  );

  if (inputPort && inputPort.trim() !== "") {
    port = inputPort.trim();
  }

  getNotes();
});

const formulir = document.querySelector("#note-form");
const tombolBatal = document.querySelector("#btn-batal");
const statusEl = document.querySelector("#status");

formulir.addEventListener("submit", async (e) => {
  e.preventDefault();

  const elemenJudul = document.querySelector("#judul");
  const elemenIsi = document.querySelector("#isi");

  const judul = elemenJudul.value.trim();
  const isi = elemenIsi.value.trim();
  const id = elemenJudul.dataset.id || "";

  if (!judul || !isi) return;

  try {
    if (id === "") {
      await axios.post(getApiBase(), { judul, isi });
      statusEl.textContent = "Catatan berhasil ditambahkan";
    } else {
      await axios.put(`${getApiBase()}/${id}`, { judul, isi });
      statusEl.textContent = "Catatan berhasil diperbarui";
    }

    resetForm();

    getNotes();
  } catch (error) {
    statusEl.textContent = "Terjadi kesalahan saat menyimpan data";
    console.log(error.response?.data || error.message);
  }
});

tombolBatal.addEventListener("click", () => {
  resetForm();
  statusEl.textContent = "Edit dibatalkan";
});

async function getNotes() {
  try {
    const response = await axios.get(getApiBase());
    const notes = response.data?.data || [];

    const table = document.querySelector("#table-note");
    let tampilan = "";
    let no = 1;

    for (const note of notes) {
      tampilan += tampilkanNote(no, note);
      no++;
    }

    table.innerHTML = tampilan;
    hapusNote();
    editNote();
  } catch (error) {
    statusEl.textContent = "Gagal mengambil data catatan";
    console.log(error.response?.data || error.message);
  }
}

function tampilkanNote(no, note) {
  return `
    <tr>
      <td>${no}</td>
      <td class="judul">${note.judul ?? "-"}</td>
      <td class="isi">${note.isi ?? "-"}</td>
      <td>${formatTanggal(note.tanggal_dibuat)}</td>
      <td><button data-id="${note.id}" class="btn-edit" type="button">Edit</button></td>
      <td><button data-id="${note.id}" class="btn-hapus" type="button">Hapus</button></td>
    </tr>
  `;
}

function hapusNote() {
  const tombolHapus = document.querySelectorAll(".btn-hapus");

  tombolHapus.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      try {
        await axios.delete(`${getApiBase()}/${id}`);
        statusEl.textContent = "Catatan berhasil dihapus";
        getNotes();
      } catch (error) {
        statusEl.textContent = "Gagal menghapus catatan";
        console.log(error.response?.data || error.message);
      }
    });
  });
}

function editNote() {
  const tombolEdit = document.querySelectorAll(".btn-edit");

  tombolEdit.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const row = btn.closest("tr");
      const judul = row.querySelector(".judul").innerText;
      const isi = row.querySelector(".isi").innerText;

      const elemenJudul = document.querySelector("#judul");
      const elemenIsi = document.querySelector("#isi");

      elemenJudul.dataset.id = id;
      elemenJudul.value = judul;
      elemenIsi.value = isi;
      statusEl.textContent = "Mode edit aktif";
    });
  });
}

function resetForm() {
  const elemenJudul = document.querySelector("#judul");
  const elemenIsi = document.querySelector("#isi");

  elemenJudul.dataset.id = "";
  elemenJudul.value = "";
  elemenIsi.value = "";
}

function formatTanggal(tanggal) {
  if (!tanggal) return "-";

  const date = new Date(tanggal);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
  });
}