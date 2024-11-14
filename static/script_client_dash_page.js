async function fetchRentalHistory() {
    try {
        const response = await fetch('/api/client/rental_history');
        if (!response.ok) {
            throw new Error('Failed to fetch rental history');
        }

        const rentals = await response.json();
        const tableBody = document.getElementById('rentalTableBody');
        tableBody.innerHTML = '';

        rentals.forEach(rental => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rental.inventory_number} - ${rental.bike_type}</td>
                <td>${rental.start_date}</td>
                <td>${rental.duration}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching rental history:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchRentalHistory);