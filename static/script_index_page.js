const bikes = [
    { 
        id: 1, 
        name: "Mountain Explorer", 
        type: "Sport", 
        ready: true, 
        image: "/api/placeholder/300/200" 
    },
    { 
        id: 2, 
        name: "City Cruiser", 
        type: "Regular", 
        ready: true, 
        image: "/api/placeholder/300/200" 
    },
    { 
        id: 3, 
        name: "Road Master", 
        type: "Sport", 
        ready: false, 
        image: "/api/placeholder/300/200" 
    },
    { 
        id: 4, 
        name: "Urban Rider", 
        type: "Regular", 
        ready: true, 
        image: "/api/placeholder/300/200" 
    },
    { 
        id: 5, 
        name: "Trail Blazer", 
        type: "Sport", 
        ready: true, 
        image: "/api/placeholder/300/200" 
    },
    { 
        id: 6, 
        name: "Commuter Plus", 
        type: "Regular", 
        ready: false, 
        image: "/api/placeholder/300/200" 
    }
];

function renderBikes(filteredBikes) {
    const gallery = document.getElementById('bike-gallery');
    gallery.innerHTML = '';

    filteredBikes.forEach(bike => {
        const card = document.createElement('div');
        card.className = 'bike-card';
        card.innerHTML = `
            <img src="${bike.image}" alt="${bike.name}">
            <div class="bike-info">
                <h3>${bike.name}</h3>
                <p>Type: ${bike.type}</p>
                <span class="bike-status ${bike.ready ? 'status-ready' : 'status-not-ready'}">
                    ${bike.ready ? 'Ready' : 'Not Ready'}
                </span>
            </div>
        `;
        gallery.appendChild(card);
    });
}

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

        card.innerHTML = `
            <img src="${bikeImageSrc}" alt="${bike.type} Bike" class="bike-image">
            <div class="bike-info">
                ${Object.keys(bike).map(key => {
                    if (key !== 'bicycle_id') {
                        return `<p><strong>${key.replace('_', ' ')}:</strong> ${bike[key]}</p>`;
                    }
                    return '';
                }).join('')}
            </div>
        `;

        card.addEventListener('click', () => openModal(bike));

        gallery.appendChild(card);
    });
}

async function fetchAndRenderBicycles() {
    try {
        const response = await fetch('/api/bicycles');
        if (response.ok) {
            const bicycles = await response.json();
            renderBikes(bicycles);
        } else {
            console.error('Failed to fetch bicycles');
        }
    } catch (error) {
        console.error('Error:', error);
    }
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

document.getElementById('rent-button').addEventListener('click', async () => {
    const modal = document.getElementById('rental-modal');
    const bikeId = modal.dataset.bikeId;
    const selectedTime = document.querySelector('.time-option.selected').dataset.hours;

    try {
        const response = await fetch('/api/rent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bikeId: bikeId,
                hours: selectedTime
            })
        });

        if (response.ok) {
            alert('Rental successful!');
            modal.style.display = 'none';
        } else {
            alert('Failed to process rental. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}

fetchAndRenderBicycles()