let selectedBicycleId = null;

function goToMainPage() {
    location.href = '/index';
}

async function fetchAndPopulateTable() {
    try {
        const response = await fetch('/api/mechanic/bicycles');
        if (!response.ok) {
            throw new Error('Failed to fetch bicycles');
        }

        const bicycles = await response.json();
        const tableBody = document.querySelector('#bicycleTable tbody');
        tableBody.innerHTML = '';

        bicycles.forEach(bike => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Inventory Number">${bike.inventory_number}</td>
                <td data-label="Name">${bike.type_name || ''}</td>
                <td data-label="Type">${bike.bicycle_type || ''}</td>
                <td data-label="Purchase Date">${bike.purchase_date ? new Date(bike.purchase_date).toLocaleDateString() : 'N/A'}</td>
                <td data-label="Problem Description">${bike.problem_description || 'No description'}</td>
                <td data-label="Status" class="status-maintenance">${bike.repair_status || 'Pending'}</td>
                <td data-label="Actions" class="action-buttons">
                    <button class="button button-complete" onclick="openRepairComplete(${bike.bicycle_id})">
                        Complete Repair
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error populating bicycle table:', error);
    }
}

function openRepairComplete(bicycleId) {
    selectedBicycleId = bicycleId;
    document.getElementById('repairCompleteModal').style.display = 'block';
}

function closeRepairForm() {
    document.getElementById('repairCompleteModal').style.display = 'none';
    document.getElementById('repairNotes').value = '';
}

async function submitRepairCompletion() {
    const repairNotes = document.getElementById('repairNotes').value;

    if (!repairNotes) {
        alert("Please enter repair notes.");
        return;
    }

    try {
        const response = await fetch(`/api/mechanic/bicycles/${selectedBicycleId}/repair-complete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({
                repair_notes: repairNotes
            })
        });

        if (!response.ok) {
            throw new Error('Failed to complete repair');
        }

        closeRepairForm();
        fetchAndPopulateTable();
        alert('Repair completed successfully!');
    } catch (error) {
        console.error('Error completing repair:', error);
        alert('Failed to complete repair. Please try again.');
    }
}

function getCsrfToken() {
    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    return csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : null;
}

document.addEventListener('DOMContentLoaded', fetchAndPopulateTable);