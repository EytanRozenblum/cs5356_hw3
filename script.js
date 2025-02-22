async function getRandomArtwork() {
    try {
        // First, get a list of all object IDs
        const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=*');
        const data = await response.json();
        
        // Get a random ID from the array
        const randomIndex = Math.floor(Math.random() * data.objectIDs.length);
        const randomId = data.objectIDs[randomIndex];
        
        // Fetch the details for this specific artwork
        const artworkResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomId}`);
        const artwork = await artworkResponse.json();
        
        // Display the artwork
        displayArtwork(artwork);
    } catch (error) {
        console.error('Error fetching artwork:', error);
    }
}

function displayArtwork(artwork) {
    const container = document.getElementById('artwork-container');
    
    container.innerHTML = `
        <figure>
            <div class="artwork-wrapper">
                <img src="${artwork.primaryImageSmall}" alt="${artwork.title}" class="artwork-image">
                <div class="spotlight"></div>
            </div>
            <figcaption>
                <h3>${artwork.title}</h3>
                <p>${artwork.artistDisplayName || 'Unknown Artist'}</p>
                <p>${artwork.objectDate || 'Date unknown'}</p>
                <p>${artwork.medium || ''}</p>
                <a href="${artwork.objectURL}" target="_blank">View at The Met</a>
            </figcaption>
        </figure>
    `;

    // Add spotlight effect after artwork loads
    const img = container.querySelector('.artwork-image');
    img.addEventListener('load', () => {
        setupSpotlight(container.querySelector('.artwork-wrapper'));
    });
}

function setupSpotlight(wrapper) {
    const spotlight = wrapper.querySelector('.spotlight');
    const img = wrapper.querySelector('.artwork-image');

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        spotlight.style.background = `radial-gradient(
            circle at ${x}px ${y}px,
            transparent 50px,
            rgba(0, 0, 0, 0.8) 80px
        )`;
    });

    wrapper.addEventListener('mouseenter', () => {
        spotlight.style.display = 'block';
    });

    wrapper.addEventListener('mouseleave', () => {
        spotlight.style.display = 'none';
    });
}

// Add click event listener to the button
document.getElementById('discover-art').addEventListener('click', getRandomArtwork);
