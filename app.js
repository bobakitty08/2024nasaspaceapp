// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);  // Scaled radius of the Sun
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet data (name, scaled size, distance from the Sun in AU, and color)
const planets = [
  { name: 'Mercury', size: 0.38, distance: 4, color: 0xaaaaaa },
  { name: 'Venus', size: 0.95, distance: 7, color: 0xffcc99 },
  { name: 'Earth', size: 1.0, distance: 10, color: 0x0000ff },
  { name: 'Mars', size: 0.53, distance: 15, color: 0xff0000 },
  { name: 'Jupiter', size: 11.2, distance: 52, color: 0xffa500 },
  { name: 'Saturn', size: 9.45, distance: 95, color: 0xf7cba5 },
  { name: 'Uranus', size: 4.01, distance: 192, color: 0x66ccff },
  { name: 'Neptune', size: 3.88, distance: 300, color: 0x3333ff }
];

// Function to create each planet as a 3D object
function createPlanet(size, distance, color) {
  const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
  const planetMaterial = new THREE.MeshBasicMaterial({ color });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);

  planet.userData = { distance: distance };  // Store the distance to simulate orbit
  return planet;
}

// Create all the planets and add them to the scene
const planetMeshes = planets.map(planet => {
  const mesh = createPlanet(planet.size, planet.distance, planet.color);
  scene.add(mesh);
  return mesh;
});

// Fetch NEO data from NASA API and display them
const apiKey = 'C0RetHE0hbDNm4BawkAjWnVAeWLSEweoLl698Z5J';
const startDate = '2024-10-01';
const endDate = '2024-10-07';

fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    const neos = data.near_earth_objects;

    // Loop through each date's NEO data
    Object.keys(neos).forEach(date => {
      neos[date].forEach(neo => {
        // Create a sphere for each NEO
        const neoGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const neoMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const neoMesh = new THREE.Mesh(neoGeometry, neoMaterial);

        // Use NEO's semi-major axis for orbit distance (in AU, scaled to the 3D scene)
        const orbitDistance = (neo.orbit_data.semi_major_axis || 1) * 10;

        // Randomize position along the orbit path
        const angle = Math.random() * Math.PI * 2;
        neoMesh.position.x = Math.cos(angle) * orbitDistance;
        neoMesh.position.z = Math.sin(angle) * orbitDistance;

        // Add NEO to the scene
        scene.add(neoMesh);
      });
    });
  })
  .catch(error => {
    console.error('Error fetching NEO data:', error);
  });

// Camera positioning
camera.position.z = 120;  // Adjust to view all planets

// Animate the scene and simulate orbits
function animate() {
  requestAnimationFrame(animate);

  // Rotate the Sun slowly
  sun.rotation.y += 0.001;

  // Simulate planetary orbits (simple circular motion)
  planetMeshes.forEach((planet, index) => {
    const speed = 0.001 * (index + 1);  // Speed for orbit (closer planets orbit faster)
    planet.position.x = Math.cos(Date.now() * speed) * planets[index].distance;
    planet.position.z = Math.sin(Date.now() * speed) * planets[index].distance;
  });

  renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Show the chart when the button is clicked
const factsButton = document.getElementById('factsButton');
const chart = document.getElementById('chart');
const closeChart = document.getElementById('closeChart');

factsButton.addEventListener('click', () => {
  chart.style.display = 'block';  // Show the chart
});

closeChart.addEventListener('click', () => {
  chart.style.display = 'none';  // Hide the chart
});

// Optional: Hide the chart when clicking outside of it
chart.addEventListener('click', (event) => {
  if (event.target === chart) {
    chart.style.display = 'none';  // Hide the chart
  }
});
