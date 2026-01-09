import { useEffect, useState } from "react";
import axios from "axios";

export default function UserPage() {
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    axios.get("http://localhost:5000/api/users")
      .then(r=>setUsers(r.data));
  },[]);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(u=>(
          <li key={u.id}>{u.name} - {u.role}</li>
        ))}
      </ul>
    </div>
  );
}
