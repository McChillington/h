// Get DOM elements
const uploadForm = document.getElementById('uploadForm');
const memesContainer = document.getElementById('memes');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const contentInput = document.getElementById('content');
const titleError = document.getElementById('title-error');
const descriptionError = document.getElementById('description-error');
const contentError = document.getElementById('content-error');
const loadingMemes = document.getElementById('loading-memes');
const userIdDisplay = document.getElementById('user-id-display');

let memesData = []; // Array to hold memes fetched from Firestore

/**
 * Displays memes in the UI.
 * @param {Array} memes - An array of meme objects to display.
 */
function displayMemes(memes) {
    memesContainer.innerHTML = '<h2 class="text-xl font-semibold mb-2 text-purple-600">Последние Мемы</h2>';
    if (memes.length === 0) {
        memesContainer.innerHTML += '<p class="text-gray-500">Пока нет мемов. Загрузите свой первый мем!</p>';
    } else {
        // Sort memes by timestamp in descending order (newest first)
        memes.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));

        memes.forEach((meme) => {
            const memeCard = document.createElement('div');
            memeCard.classList.add('meme-card');

            let contentElement;
            if (meme.type.startsWith('image')) {
                contentElement = document.createElement('img');
                contentElement.src = meme.url;
                contentElement.alt = meme.title;
            } else if (meme.type.startsWith('video')) {
                contentElement = document.createElement('video');
                contentElement.src = meme.url;
                contentElement.controls = true;
                contentElement.autoplay = false;
            } else {
                contentElement = document.createElement('p');
                contentElement.textContent = "Неподдерживаемый тип контента.";
            }

            memeCard.appendChild(contentElement);

            const titleElement = document.createElement('h3');
            titleElement.textContent = meme.title;
            titleElement.classList.add('text-lg', 'font-semibold', 'mb-1', 'text-gray-800');
            memeCard.appendChild(titleElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = meme.description;
            descriptionElement.classList.add('text-gray-600', 'mb-2');
            memeCard.appendChild(descriptionElement);

            memesContainer.appendChild(memeCard);
        });
    }
    loadingMemes.style.display = 'none'; // Hide loading indicator once memes are displayed
}

/**
 * Validates the upload form inputs.
 * @returns {boolean} True if all inputs are valid, false otherwise.
 */
function validateForm() {
    let isValid = true;
    if (!titleInput.value.trim()) {
        titleError.textContent = "Пожалуйста, введите название мема.";
        titleError.style.display = "block";
        isValid = false;
    } else {
        titleError.style.display = "none";
    }

    if (!descriptionInput.value.trim()) {
        descriptionError.textContent = "Пожалуйста, введите описание мема.";
        descriptionError.style.display = "block";
        isValid = false;
    } else {
        descriptionError.style.display = "none";
    }

    if (!contentInput.files || contentInput.files.length === 0) {
        contentError.textContent = "Пожалуйста, выберите файл для мема.";
        contentError.style.display = "block";
        isValid = false;
    } else {
        const fileType = contentInput.files[0].type;
        if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
            contentError.textContent = "Неподдерживаемый тип файла. Загрузите изображение или видео.";
            contentError.style.display = "block";
            isValid = false;
        } else {
            contentError.style.display = "none";
        }
    }
    return isValid;
}

/**
 * Initializes the meme display by setting up a Firestore snapshot listener.
 * This function is called once Firebase is ready.
 */
window.initMemeDisplay = function() {
    // Check if Firebase is ready and necessary objects are available
    if (!window.isFirebaseReady || !window.firebase.firestore.db || !window.currentUserId) {
        console.warn("Firebase not ready for meme display initialization.");
        return;
    }

    // Display the user ID in the header
    userIdDisplay.textContent = window.currentUserId;

    // Get the app ID from the environment
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    // Define the Firestore collection path for user-specific memes
    // This collection stores data private to the current user.
    const memesCollectionRef = window.firebase.firestore.collection(
        window.firebase.firestore.db,
        `/artifacts/${appId}/users/${window.currentUserId}/memes`
    );

    // Set up a real-time listener for the memes collection
    // onSnapshot provides real-time updates whenever data changes in the collection.
    window.firebase.firestore.onSnapshot(memesCollectionRef, (snapshot) => {
        memesData = []; // Clear existing data to refresh with current snapshot
        snapshot.forEach((doc) => {
            // Add each document's data and its ID to the memesData array
            memesData.push({ id: doc.id, ...doc.data() });
        });
        displayMemes(memesData); // Update the UI with the new data
    }, (error) => {
        // Log any errors that occur during the snapshot listener
        console.error("Error fetching memes from Firestore:", error);
        loadingMemes.textContent = "Ошибка загрузки мемов."; // Inform user about the error
    });
};


// Event listener for the upload form submission
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission to handle it with JavaScript

    // Validate form inputs
    if (!validateForm()) {
        return; // Stop if form is not valid
    }

    // Check if Firebase is ready before attempting to upload
    if (!window.isFirebaseReady || !window.firebase.firestore.db || !window.currentUserId) {
        // Use a custom alert message instead of browser's alert()
        alert('Firebase еще не готов. Пожалуйста, подождите и попробуйте снова.');
        console.error("Firebase is not ready for upload.");
        return;
    }

    // Get form input values
    const title = titleInput.value;
    const description = descriptionInput.value;
    const contentFile = contentInput.files[0];
    const fileType = contentFile.type;

    // Use FileReader to read the file content as a Data URL (Base64)
    const reader = new FileReader();
    reader.onload = async (e) => {
        // Create a meme data object to store in Firestore
        const memeData = {
            title: title,
            description: description,
            url: e.target.result, // Base64 string of the file content
            type: fileType,
            timestamp: window.firebase.firestore.serverTimestamp() // Firestore server timestamp for ordering
        };

        // Get the app ID from the environment
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        // Define the Firestore collection reference where the meme will be added
        const memesCollectionRef = window.firebase.firestore.collection(
            window.firebase.firestore.db,
            `/artifacts/${appId}/users/${window.currentUserId}/memes`
        );

        try {
            // Add the meme data as a new document to the Firestore collection
            await window.firebase.firestore.addDoc(memesCollectionRef, memeData);
            console.log("Meme successfully uploaded to Firestore!");
            uploadForm.reset(); // Clear the form fields after successful upload
            // Hide any previous error messages
            titleError.style.display = "none";
            descriptionError.style.display = "none";
            contentError.style.display = "none";
            // Inform the user about the successful upload (replace with custom modal in production)
            alert('Мем успешно загружен!');
        } catch (error) {
            // Log and inform the user if there's an error during upload
            console.error("Error adding meme to Firestore:", error);
            alert('Ошибка при загрузке мема. Пожалуйста, попробуйте снова.'); // Replace with custom modal
        }
    };

    // Read the file content. This triggers the `reader.onload` event.
    reader.readAsDataURL(contentFile);
});

// Ensure initMemeDisplay is called when the window loads and Firebase is ready.
// If Firebase is already ready, call it immediately. Otherwise, the onAuthStateChanged
// listener in index.html will call it once authentication is complete.
window.onload = function() {
    if (window.isFirebaseReady) {
        window.initMemeDisplay();
    }
};
