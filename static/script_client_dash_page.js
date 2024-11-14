const userData = {
    firstName: "John",
    lastName: "Doe",
    rentals: [
        { bikeImage: "/api/placeholder/100/60", date: "2024-11-14", duration: "2h" },
        { bikeImage: "/api/placeholder/100/60", date: "2024-11-13", duration: "4h" },
        { bikeImage: "/api/placeholder/100/60", date: "2024-11-12", duration: "1h" }
    ]
};

document.getElementById('userName').textContent = `${userData.firstName} ${userData.lastName}`;

const tableBody = document.getElementById('rentalTableBody');
userData.rentals.forEach(rental => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><img src="${rental.bikeImage}" alt="Bike" class="bike-image"></td>
        <td>${rental.date}</td>
        <td>${rental.duration}</td>
    `;
    tableBody.appendChild(row);
});

function logout() {
    alert('Logout clicked');
}