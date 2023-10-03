const videoElement = document.getElementById('cameraStream');
const toggleCameraButton = document.getElementById('toggleCameraButton');
const captureButton = document.getElementById('captureButton');
const capturedImagesContainer = document.querySelector('.captured-images');
let currentCameraFacingMode = 'environment'; // 'environment' for rear camera, 'user' for front camera

function initializeCamera(facingMode) {
    const constraints = {
        video: {
            facingMode: facingMode,
        },
    };

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
            videoElement.srcObject = stream;
        })
        .catch(function (error) {
            console.error('Error accessing the camera:', error);
        });
}

function toggleCamera() {
    if (currentCameraFacingMode === 'environment') {
        currentCameraFacingMode = 'user';
    } else {
        currentCameraFacingMode = 'environment';
    }

    // Stop the current camera stream and initialize the new camera
    videoElement.srcObject.getTracks().forEach((track) => track.stop());
    initializeCamera(currentCameraFacingMode);
}

// Initialize the camera with the default facing mode
initializeCamera(currentCameraFacingMode);

toggleCameraButton.addEventListener('click', toggleCamera);

let imageCounter = 1;

// Function to save captured images and descriptions to localStorage
function saveDataToLocalStorage() {
    const imageContainers = capturedImagesContainer.querySelectorAll('.image-container');
    const savedData = [];

    imageContainers.forEach((container, index) => {
        const imgSrc = container.querySelector('img').src;
        const description = container.querySelector('.image-description').value;

        // Store image source and description in an object
        const imageData = {
            src: imgSrc,
            description: description,
        };

        savedData.push(imageData);
    });

    // Save the data as JSON in localStorage
    localStorage.setItem('capturedImageData', JSON.stringify(savedData));
}

// Function to load saved data from localStorage
function loadSavedDataFromLocalStorage() {
    const savedData = localStorage.getItem('capturedImageData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);

        parsedData.forEach((data, index) => {
            const capturedImage = document.createElement('img');
            capturedImage.src = data.src;
            capturedImage.className = 'captured-image';

            const descriptionBox = document.createElement('textarea');
            descriptionBox.placeholder = 'Enter image description';
            descriptionBox.className = 'image-description';
            descriptionBox.value = data.description;

            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';

            // Create a delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', function () {
                capturedImagesContainer.removeChild(imageContainer);
                // Update the image counter and save data after removing the image
                imageCounter--;
                saveDataToLocalStorage();
            });

            imageContainer.appendChild(capturedImage);
            imageContainer.appendChild(descriptionBox);
            imageContainer.appendChild(deleteButton);
            capturedImagesContainer.appendChild(imageContainer);

            // Update the image counter
            imageCounter++;
        });
    }
}

// Call the loadSavedDataFromLocalStorage function to load previously saved data
loadSavedDataFromLocalStorage();

captureButton.addEventListener('click', function () {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const capturedImage = document.createElement('img');
    capturedImage.src = canvas.toDataURL('image/png');
    capturedImage.className = 'captured-image';

    const descriptionBox = document.createElement('textarea');
    descriptionBox.placeholder = 'Enter image description';
    descriptionBox.className = 'image-description';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    // Create a delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', function () {
        capturedImagesContainer.removeChild(imageContainer);
        // Update the image counter and save data after removing the image
        imageCounter--;
        saveDataToLocalStorage();
    });

    imageContainer.appendChild(capturedImage);
    imageContainer.appendChild(descriptionBox);
    imageContainer.appendChild(deleteButton);
    capturedImagesContainer.appendChild(imageContainer);

    // Update the image counter
    imageCounter++;

    // Save the data to localStorage after capturing a new image
    saveDataToLocalStorage();
});
