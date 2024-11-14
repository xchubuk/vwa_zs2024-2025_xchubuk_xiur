document.getElementById('type-filter').addEventListener('change', (e) => {
    const selectedType = e.target.value;
    const filteredBikes = selectedType === 'all' 
        ? bikes 
        : bikes.filter(bike => bike.type === selectedType);
    renderBikes(filteredBikes);
});

function openModal(bike) {
    const modal = document.getElementById('rental-modal');
    const modalImage = document.getElementById('modal-bike-image');
    const modalName = document.getElementById('modal-bike-name');
    const modalType = document.getElementById('modal-bike-type');
    const rentButton = document.getElementById('rent-button');

    const imgPath = document.getElementById('bike-gallery').getAttribute('data-img-path');
    modalImage.src = `${imgPath}/${bike.type.toLowerCase()}.png`;

    modalName.textContent = bike.type_name;
    modalType.textContent = `Type: ${bike.type}`;
    modal.dataset.bikeId = bike.bicycle_id;
    rentButton.disabled = true;
    rentButton.textContent = 'Select rental duration';
    
    document.querySelectorAll('.time-option').forEach(option => {
        option.classList.remove('selected');
    });

    modal.style.display = 'block';
}

function renderBikes(bicycles) {
    const gallery = document.getElementById('bike-gallery');
    const imgPath = gallery.getAttribute('data-img-path');
    gallery.innerHTML = '';

    bicycles.forEach(bike => {
        const card = document.createElement('div');
        card.className = 'bike-card';

        const bikeImageSrc = `${imgPath}/${bike.type.toLowerCase()}.png`;
        const statusText = bike.status === "1" ? "Available" : bike.status === "0" ? "In Use" : "Under Maintenance";
        const capitalizedType = bike.type.charAt(0).toUpperCase() + bike.type.slice(1);

        card.innerHTML = `
            <img src="${bikeImageSrc}" alt="${capitalizedType} Bike" class="bike-image">
            <div class="bike-info">
                <p><strong>Description:</strong> ${bike.description}</p>
                <p><strong>Status:</strong> ${statusText}</p>
                <p><strong>Type:</strong> ${capitalizedType}</p>
            </div>
        `;

        if (bike.status === "1") { 
            card.addEventListener('click', () => openModal(bike));
        }

        gallery.appendChild(card);
    });
}

document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('rental-modal').style.display = 'none';
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('rental-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

document.querySelectorAll('.time-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.time-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        const rentButton = document.getElementById('rent-button');
        rentButton.disabled = false;
        rentButton.textContent = `Rent for ${option.textContent}`;
    });
});

document.getElementById('logout-button').addEventListener('click', async () => {
    try {
        const response = await fetch('/logout', {
            method: 'GET'
        });

        console.log(response.ok)

        if (response.ok) {
            location.href = '/';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('rent-button').addEventListener('click', async () => {
    const modal = document.getElementById('rental-modal');
    const bikeId = modal.dataset.bikeId;
    const selectedTime = document.querySelector('.time-option.selected').dataset.hours;
    const paymentType = document.querySelector('input[name="payment"]:checked')?.value;

    if (!paymentType) {
        alert("Please select a payment type.");
        return;
    }

    try {
        const response = await fetch('/api/rent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({
                bikeId: bikeId,
                hours: selectedTime,
                payment: paymentType
            })
        });

        if (response.ok) {
            alert('Rental successful!');
            modal.style.display = 'none';
            fetchAndRenderBicycles();
        } else {
            alert('Failed to process rental. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

async function fetchTypes() {
    try {
        const response = await fetch('/api/types');
        if (response.ok) {
            const types = await response.json();
            const typeFilter = document.getElementById('type-filter');
            
            types.forEach(type => {
                const option = document.createElement('option');
                option.value = type.toLowerCase();
                option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
                typeFilter.appendChild(option);
            });
        } else {
            console.error('Failed to fetch types');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function applyFilters(bicycles) {
    const selectedType = document.getElementById('type-filter').value;
    const selectedAvailability = document.getElementById('availability-filter').value;

    return bicycles.filter(bike => {
        const matchesType = selectedType === 'all' || bike.type.toLowerCase() === selectedType;
        const matchesAvailability = selectedAvailability === 'all' || bike.status === selectedAvailability;
        return matchesType && matchesAvailability;
    });
}

async function fetchAndRenderBicycles() {
    try {
        const response = await fetch('/api/bicycles');
        if (response.ok) {
            const bicycles = await response.json();

            const filteredBicycles = applyFilters(bicycles);
            renderBikes(filteredBicycles);
        } else {
            console.error('Failed to fetch bicycles');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/api/get_user_role');
        if (response.ok) {
            const data = await response.json();
            let dashboardLink = '#';

            switch (data.role) {
                case 'client':
                    dashboardLink = '/client_dashboard';
                    break;
                case 'manager':
                    dashboardLink = '/manager_dashboard';
                    break;
                case 'admin':
                    dashboardLink = '/admin_dashboard';
                    break;
                default:
                    console.warn('User role not recognized.');
            }

            const dashboardButton = document.getElementById('dashboard-button');
            if (dashboardButton) {
                dashboardButton.addEventListener('click', () => {
                    location.href = dashboardLink;
                });
            }
        } else {
            console.error("Failed to retrieve user role.");
        }
    } catch (error) {
        console.error("Error fetching user role:", error);
    }
});

document.getElementById('type-filter').addEventListener('change', fetchAndRenderBicycles);
document.getElementById('availability-filter').addEventListener('change', fetchAndRenderBicycles);

fetchTypes();
fetchAndRenderBicycles();