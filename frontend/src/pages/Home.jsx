export default function Home() {
  return (
    <>
      <h1>📚 Dashboard</h1>
      <p>Chào mừng bạn đến hệ thống quản lý thư viện</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginTop: 20 }}>
        <Card title="📖 Sách" value="128" />
        <Card title="👤 Người dùng" value="54" />
        <Card title="📦 Đang mượn" value="23" />
        <Card title="💰 Phí trễ" value="1,200,000đ" />
      </div>
    </>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      background: "white",
      padding: 20,
      borderRadius: 16,
      boxShadow: "0 10px 30px rgba(0,0,0,.05)"
    }}>
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}
