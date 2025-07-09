import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function Check() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:3000/event"); // Change port if needed
                // console.log(res.data);
                setUsers(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map(user => (
                    <li key={user._id}>{user.title}</li>
                ))}
            </ul>
        </div>
    );
}