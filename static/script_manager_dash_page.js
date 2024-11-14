let selectedBicycleId = null;

function goToMainPage() {
    location.href = '/index';
}

async function fetchAndPopulateTable() {
    try {
        const response = await fetch('/api/admin/bicycles');
        if (!response.ok) {
            throw new Error('Failed to fetch bicycles');
        }

        const bicycles = await response.json();

        const tableBody = document.querySelector('#bicycleTable tbody');
        tableBody.innerHTML = '';

        bicycles.forEach(bike => {
            let statusClass = "";
            let statusText = "";

            if (bike.status === "1") {
                statusClass = "status-available";
                statusText = "Available";
            } else if (bike.status === "0") {
                statusClass = "status-in-use";
                statusText = "In Use";
            } else if (bike.status === "-1") {
                statusClass = "status-maintenance";
                statusText = "Under Maintenance";
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Inventory Number">${bike.inventory_number}</td>
                <td data-label="Name">${bike.type_name || ''}</td>
                <td data-label="Bicycle Type">${bike.bicycle_type || ''}</td>
                <td data-label="Type">${bike.type}</td>
                <td data-label="Status" class="${statusClass}">${statusText}</td>
                <td data-label="Purchase Date">${bike.purchase_date ? new Date(bike.purchase_date).toLocaleDateString() : 'N/A'}</td>
                <td data-label="Description">${bike.description || 'No description'}</td>
                <td data-label="Inspection Date">${bike.inspection_date ? new Date(bike.inspection_date).toLocaleString() : 'N/A'}</td>
                <td data-label="Comment">${bike.comment || 'No comments'}</td>
                <td data-label="Actions">
                    <button class="button button-repair" onclick="openRepairForm(${bike.bicycle_id})" ${bike.status !== "0" ? "disabled" : ""}>Repair</button>
                    <button class="button button-return" onclick="returnBicycle(${bike.bicycle_id})">Return</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error populating bicycle table:', error);
    }
}

async function returnBicycle(bicycleId) {
    try {
        const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cash';

        const response = await fetch(`/api/manager/bicycles/${bicycleId}/return`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({
                payment_method: paymentMethod
            })
        });

        if (!response.ok) {
            throw new Error('Failed to return bicycle');
        }

        alert('Bicycle returned successfully.');
        fetchAndPopulateTable();
    } catch (error) {
        console.error('Error returning bicycle:', error);
        alert(error.message);
    }
}

async function submitRepairRequest() {
    const problemDescription = document.getElementById('problemDescription').value;

    if (!problemDescription) {
        alert("Please enter a problem description.");
        return;
    }

    try {
        const response = await fetch(`/api/manager/bicycles/${selectedBicycleId}/repair`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({
                problem_description: problemDescription
            })
        });

        if (!response.ok) {
            throw new Error('Failed to submit repair request');
        }

        alert('Repair request submitted successfully.');
        closeRepairForm();
        fetchAndPopulateTable();
    } catch (error) {
        console.error('Error submitting repair request:', error);
    }
}

const modal = document.getElementById('repairModal');
const closeBtn = document.querySelector('.close');

function openRepairForm(bicycleId) {
    selectedBicycleId = bicycleId;
    document.getElementById('repairFormModal').style.display = 'block';
}

function closeRepairForm() {
    document.getElementById('repairFormModal').style.display = 'none';
    document.getElementById('problemDescription').value = '';
}

closeBtn.onclick = function () {
    modal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

document.getElementById('repairForm').onsubmit = function (e) {
    e.preventDefault();
    const bikeId = document.getElementById('bikeId').value;
    const description = document.getElementById('issueDescription').value;
    const priority = document.getElementById('priority').value;

    console.log('Repair request submitted:', { bikeId, description, priority });

    modal.style.display = 'none';
    alert('Repair request submitted successfully!');
}

function returnBike(bikeId) {
    // Implementation for returning a bike
    alert(`Bike ${bikeId} marked as returned`);
}

function rentBike(bikeId) {
    // Implementation for renting a bike
    alert(`Bike ${bikeId} marked as rented`);
}

function getCsrfToken() {
    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    return csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : null;
}

fetchAndPopulateTable();