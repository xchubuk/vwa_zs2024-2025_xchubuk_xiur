let bicycles = [];
let users = [];

function initTables() {
    populateUsersTable();
    populateBicyclesTable();
}

function fetchAdminBicycles() {
    fetch('/api/admin/bicycles')
        .then(response => response.json())
        .then(data => {
            bicycles = Array.isArray(data) ? data : [];
            populateBicyclesTable();
        })
        .catch(error => console.error('Error fetching bicycles:', error));
}

function addUser(event) {
    event.preventDefault();
    
    const newUser = {
        first_name: document.getElementById('userFirstName').value,
        last_name: document.getElementById('userLastName').value,
        email: document.getElementById('userEmail').value,
        password: document.getElementById('userPassword').value,
        role: document.getElementById('userRole').value
    };

    fetch('/api/admin/add_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(newUser)
    })
    .then(response => {
        if (response.ok) {
            closeModal('addUserModal');
            fetchAdminUsers(); 
        } else {
            throw new Error('Failed to add user');
        }
    })
    .catch(error => console.error('Error adding user:', error));
}

function removeUser(userId) {
    if (confirm('Are you sure you want to remove this user?')) {
        fetch(`/api/admin/delete_user/${userId}`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
        .then(response => {
            if (response.ok) {
                fetchAdminUsers();
            } else {
                throw new Error('Failed to delete user');
            }
        })
        .catch(error => console.error('Error deleting user:', error));
    }
}

function fetchAdminUsers() {
    fetch('/api/admin/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Access denied');
        }
        return response.json();
    })
    .then(data => {
        users = data;
        populateUsersTable();
    })
    .catch(error => console.error('Error fetching admin users:', error));
}

function populateUsersTable() {
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.user_id}</td>
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
            <td>${user.email}</td>
            <td>
                <select onchange="updateUserRole(${user.user_id}, this.value)">
                    <option value="client" ${user.role === "client" ? 'selected' : ''}>Client</option>
                    <option value="manager" ${user.role === "manager" ? 'selected' : ''}>Manager</option>
                    <option value="admin" ${user.role === "admin" ? 'selected' : ''}>Admin</option>
                </select>
            </td>
            <td>${user.registration_date ? new Date(user.registration_date).toLocaleDateString() : 'N/A'}</td>
            <td>
                <button class="button" onclick="showUserHistory(${user.user_id})">History</button>
                <button class="button" onclick="removeUser(${user.user_id})">Remove</button>
            </td>
        </tr>
    `).join('');
}

function updateBikeType(bicycleId, newTypeId) {
    fetch(`/api/admin/bicycles/${bicycleId}/type`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ type_id: parseInt(newTypeId) })
    })
    .then(response => {
        if (response.ok) {
            alert('Bicycle type updated successfully.');
        } else {
            throw new Error('Failed to update bicycle type');
        }
    })
    .catch(error => console.error('Error updating bike type:', error));
}

function populateBicyclesTable() {
    const tbody = document.querySelector('#bicyclesTable tbody');
    tbody.innerHTML = bicycles.map(bike => {
        const statusValue = parseInt(bike.status);
        return `
            <tr>
                <td>${bike.bicycle_id}</td>
                <td>${bike.inventory_number}</td>
                <td>${bike.type_name || ''}</td>
                <td>
                    <select onchange="updateBikeStatus(${bike.bicycle_id}, this.value)">
                        <option value="1" ${statusValue === 1 ? 'selected' : ''}>Available</option>
                        <option value="0" ${statusValue === 0 ? 'selected' : ''}>In Use</option>
                        <option value="-1" ${statusValue === -1 ? 'selected' : ''}>Under Maintenance</option>
                    </select>
                </td>
                <td>${bike.inspection_date ? new Date(bike.inspection_date).toLocaleString() : 'N/A'}</td>
                <td>${bike.user_id || 'N/A'}</td>
                <td>${bike.comment || 'No comments'}</td>
                <td>
                    <button class="button" onclick="removeBicycle(${bike.bicycle_id})">Remove</button>
                </td>
            </tr>
        `;
    }).join('');
}


function populateBicycleTypes() {
    fetch('/api/bicycle_types')
        .then(response => response.json())
        .then(types => {
            console.log(types);
            const typeSelect = document.getElementById('typeId');
            typeSelect.innerHTML = types.map(type => `<option value="${type.type_id}">${type.name}</option>`).join('');
        })
        .catch(error => console.error('Error fetching bicycle types:', error));
}

function addBicycle(event) {
    event.preventDefault();

    const newBicycle = {
        inventory_number: document.getElementById('inventoryNumber').value,
        type_id: parseInt(document.getElementById('typeId').value),
        inspection_date: document.getElementById('inspectionDate').value,
        comment: document.getElementById('comment').value,
        status: "1"
    };

    console.log("Payload for addBicycle:", newBicycle);

    fetch('/api/admin/bicycles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(newBicycle)
    })
    .then(response => {
        if (response.ok) {
            closeModal('addBicycleModal');
            fetchAdminBicycles();
        } else {
            throw new Error('Failed to add bicycle');
        }
    })
    .catch(error => console.error('Error adding bicycle:', error));
}

function addUser(event) {
    event.preventDefault();
    
    const newUser = {
        first_name: document.getElementById('userFirstName').value,
        last_name: document.getElementById('userLastName').value,
        email: document.getElementById('userEmail').value,
        password: document.getElementById('userPassword').value,
        role: document.getElementById('userRole').value
    };

    fetch('/api/admin/add_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify(newUser)
    })
    .then(response => {
        if (response.ok) {
            closeModal('addUserModal');
            fetchAdminUsers();
        } else {
            throw new Error('Failed to add user');
        }
    })
    .catch(error => console.error('Error adding user:', error));
}

function updateBikeStatus(bicycleId, newStatus) {
    fetch(`/api/admin/bicycles/${bicycleId}/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ status: parseInt(newStatus) })  
    })
    .then(response => {
        if (response.ok) {
            alert('Status updated successfully.');
        } else {
            throw new Error('Failed to update status');
        }
    })
    .catch(error => console.error('Error updating bike status:', error));
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabName).style.display = 'block';
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (tabName === 'users') {
        fetchAdminUsers();
    } else if (tabName === 'bicycles') {
        fetchAdminBicycles();
    }
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showUserHistory(userId) {
    const user = users.find(u => u.id === userId);
    document.getElementById('userHistoryContent').innerHTML = `
        <p>Rental history for ${user.name}</p>
        <!-- Add actual history data here -->
    `;
    showModal('userHistoryModal');
}

function showAddBicycleModal() {
    showModal('addBicycleModal');
}

function updateUserRole(userId, newRole) {
    fetch(`/api/admin/users/${userId}/role`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ role: newRole })
    })
    .then(response => {
        if (response.ok) {
            alert('User role updated successfully.');
        } else {
            throw new Error('Failed to update user role');
        }
    })
    .catch(error => console.error('Error updating user role:', error));
}

function removeBicycle(bicycleId) {
    if (confirm('Are you sure you want to remove this bicycle?')) {
        fetch(`/api/admin/bicycles/${bicycleId}`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
        .then(response => {
            if (response.ok) {
                fetchAdminBicycles(); 
            } else {
                throw new Error('Failed to remove bicycle');
            }
        })
        .catch(error => console.error('Error removing bicycle:', error));
    }
}

function getCsrfToken() {
    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    return csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : null;
}

async function generateReport() {
    try {
        const response = await fetch('/api/admin/generate_report', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCsrfToken()
            }
        });

        if (!response.ok) {
            throw new Error('Failed to generate report');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'bicycle_report.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating report:', error);
    }
}

window.onload = function() {
    populateBicycleTypes();
    fetchAdminBicycles();
    fetchAdminUsers();
};