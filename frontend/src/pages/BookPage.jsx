import { useEffect, useState } from "react";
import axios from "axios";
import { FaPen, FaTrash } from "react-icons/fa";
import "./BookPage.css";

export default function BookPage() {
  const emptyForm = {
    id: null,
    book_code: "",
    title: "",
    author: "",
    publisher: "",
    publish_year: "",
    quantity: "",
    image_url: "",
  };

  const [books, setBooks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageMode, setImageMode] = useState("link");
  const [imageFile, setImageFile] = useState(null);
  const [keyword, setKeyword] = useState("");

  const load = async () => {
    const res = await axios.get("http://localhost:4001/api/books");
    setBooks(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (book) => {
    setForm({
      id: book.id,
      title: book.title || "",
      author: book.author || "",
      publisher: book.publisher || "",
      publish_year: book.publish_year?.toString() || "",
      quantity: book.quantity?.toString() || "",
    });

    setImageMode("link");
    setImageFile(null);
    setShowEdit(true);
  };

  const createBook = async () => {
    const formData = new FormData();

    formData.append("book_code", form.book_code);
    formData.append("title", form.title);
    formData.append("author", form.author);
    formData.append("publisher", form.publisher);
    formData.append("publish_year", Number(form.publish_year));
    formData.append("quantity", Number(form.quantity));

    if (imageMode === "upload" && imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image_url", form.image_url);
    }

    await axios.post("http://localhost:4001/api/books", formData);

    setShowAdd(false);
    setForm(emptyForm);
    setImageFile(null);
    setImageMode("link");
    load();
  };

  const updateBook = async () => {
    const formData = new FormData();

    formData.append("book_code", form.book_code);
    formData.append("title", form.title);
    formData.append("author", form.author);
    formData.append("publisher", form.publisher);
    formData.append("publish_year", Number(form.publish_year));
    formData.append("quantity", Number(form.quantity));

    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image_url", form.image_url);
    }

    await axios.put(`http://localhost:4001/api/books/${form.id}`, formData);

    const res = await axios.get("http://localhost:4001/api/books");
    setBooks(res.data);

    const updated = res.data.find((b) => b.id === form.id);
    setSelected(updated || null);

    setShowEdit(false);
    setForm(emptyForm);
    setImageFile(null);
    setImageMode("link");
  };

  const deleteBook = async () => {
    if (!window.confirm("Bạn chắc chắn muốn xóa sách này?")) return;
    await axios.delete(`http://localhost:4001/api/books/${form.id}`);
    setShowEdit(false);
    setSelected(null);
    setForm(emptyForm);
    load();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageMode("upload");
    setImageFile(file);
    setForm((prev) => ({
      ...prev,
      image_url: "",
    }));
  };
  const closeEdit = () => {
    setShowEdit(false);
    setImageMode("link");
    setImageFile(null);
  };
  return (
    <div className="book-container">
      <div className="top-bar">
        <input
          className="search"
          placeholder=" Tìm theo tên hoặc mã sách..."
          value={keyword}
          onChange={async (e) => {
            const q = e.target.value;
            setKeyword(q);

            if (!q) {
              load();
              return;
            }

            const res = await axios.get(
              `http://localhost:4001/api/books/search?q=${q}`
            );
            setBooks(res.data);
          }}
        />
        <button className="add-btn" onClick={() => setShowAdd(true)}>
          Thêm sách
        </button>
      </div>

      {/* GRID */}
      <div className="book-grid">
        {books.map((b) => (
          <div className="book-card" key={b.id} onClick={() => setSelected(b)}>
            <img
              src={
                b.image_url
                  ? `http://localhost:4001${b.image_url}`
                  : "/no-book.png"
              }
              alt={b.title}
            />
            <div className="overlay">
              <h4>{b.title}</h4>
              <span>{b.author}</span>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div className="modal-bg" onClick={() => setSelected(null)}>
          <div className="modal modern" onClick={(e) => e.stopPropagation()}>
            {/* EDIT BUTTON */}
            <FaPen
              className="edit-floating"
              title="Sửa sách"
              onClick={() => openEdit(selected)}
            />

            {/* IMAGE */}
            <img
              src={
                selected.image_url
                  ? `http://localhost:4001${selected.image_url}`
                  : "/no-book.png"
              }
              alt={selected.title}
            />

            {/* INFO */}
            <div className="modal-info">
              <h2 className="modal-title">{selected.title}</h2>
              <p>
                <b>Mã sách:</b> {selected.book_code}
              </p>
              <p>
                <b>Tác giả:</b> {selected.author}
              </p>
              <p>
                <b>NXB:</b> {selected.publisher}
              </p>
              <p>
                <b>Năm:</b> {selected.publish_year}
              </p>
              <p>
                <b>Số lượng:</b> {selected.quantity}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAdd && (
        <div className="modal-bg" onClick={() => setShowAdd(false)}>
          <div
            className="modal-form modern"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Thêm sách mới</h3>
            <input
              placeholder="Mã sách (VD: MS001)"
              value={form.book_code}
              onChange={(e) => setForm({ ...form, book_code: e.target.value })}
            />
            <input
              placeholder="Tên sách"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              placeholder="Tác giả"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
            />
            <input
              placeholder="Nhà xuất bản"
              value={form.publisher}
              onChange={(e) => setForm({ ...form, publisher: e.target.value })}
            />
            <input
              type="number"
              placeholder="Năm xuất bản"
              value={form.publish_year}
              onChange={(e) =>
                setForm({ ...form, publish_year: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Số lượng"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
            {/* IMAGE TOGGLE */}
            <div className="image-toggle">
              <div
                className={imageMode === "link" ? "active" : ""}
                onClick={() => setImageMode("link")}
              >
                Link ảnh
              </div>
              <div
                className={imageMode === "upload" ? "active" : ""}
                onClick={() => setImageMode("upload")}
              >
                Upload ảnh
              </div>
              <div className={`slider ${imageMode}`} />
            </div>

            {/* INPUT */}
            {imageMode === "link" ? (
              <input
                placeholder="https://image-url..."
                value={form.image_url}
                onChange={(e) =>
                  setForm({ ...form, image_url: e.target.value })
                }
              />
            ) : (
              <input type="file" accept="image/*" onChange={handleFileChange} />
            )}

            {/* PREVIEW */}
            {imageFile && (
              <img src={URL.createObjectURL(imageFile)} className="preview" />
            )}

            {!imageFile && form.image_url && (
              <img
                src={`http://localhost:4001${form.image_url}`}
                className="preview"
              />
            )}

            <div className="form-actions">
              <button className="cancel" onClick={() => setShowAdd(false)}>
                Hủy
              </button>
              <button className="save" onClick={createBook}>
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <div className="modal-bg" onClick={() => setShowEdit(false)}>
          <div
            className="modal-form modern"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Cập nhật sách</h3>
            <div class="form-group">
              <label>Mã sách</label>
              <input
                type="text"
                value={form.book_code}
                onChange={(e) =>
                  setForm({ ...form, book_code: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Tên sách</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Tác giả</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Nhà xuất bản</label>
              <input
                type="text"
                value={form.publisher}
                onChange={(e) =>
                  setForm({ ...form, publisher: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Năm xuất bản</label>
              <input
                type="number"
                value={form.publish_year}
                onChange={(e) =>
                  setForm({ ...form, publish_year: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Số lượng</label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </div>
            <div className="form-actions space">
              <button className="delete" onClick={deleteBook}>
                <FaTrash /> Xóa
              </button>
              <div>
                <button className="cancel" onClick={closeEdit}>
                  Hủy
                </button>

                <button className="save" onClick={updateBook}>
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
