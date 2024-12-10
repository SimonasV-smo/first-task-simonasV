document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://testapi.io/api/SimonasV/resource/users";
  const userTable = document.getElementById("userTable");
  const userForm = document.getElementById("userForm");

  const fetchUsers = () => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Nepavyko gauti vartotojų duomenų.");
        return response.json();
      })
      .then((data) => {
        renderUsers(data.data);
      })
      .catch((error) => {
        console.error("Klaida:", error.message);
      });
  };

  const renderUsers = (users) => {
    userTable.innerHTML = "";
    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>
            <button data-id="${user.id}" class="delete-btn">Ištrinti</button>
          </td>
        `;
      userTable.appendChild(row);
    });
  };

  const addUser = (name, email) => {
    const userData = { name, email };
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Nepavyko pridėti vartotojo.");
        return response.json();
      })
      .then((data) => {
        console.log("Naujas vartotojas pridėtas:", data);
        fetchUsers();
      })
      .catch((error) => {
        console.error("Klaida:", error.message);
      });
  };

  const deleteUser = (id) => {
    fetch(`${apiUrl}/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Nepavyko ištrinti vartotojo.");
        console.log(`Vartotojas su ID ${id} ištrintas.`);
        fetchUsers();
      })
      .catch((error) => {
        console.error("Klaida:", error.message);
      });
  };

  userForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !email) {
      alert("Prašome užpildyti visus laukus.");
      return;
    }

    addUser(name, email);
    userForm.reset();
  });

  userTable.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const userId = event.target.getAttribute("data-id");
      deleteUser(userId);
    }
  });

  fetchUsers();
});
