const uploadForm = document.getElementById('uploadForm');
const memesContainer = document.getElementById('memes');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const contentInput = document.getElementById('content');
const titleError = document.getElementById('title-error');
const descriptionError = document.getElementById('description-error');
const contentError = document.getElementById('content-error');

let memes = [];
try {
    const savedMemes = JSON.parse(localStorage.getItem('memes')) || [];
    memes = savedMemes;
} catch (error) {
    console.error("Error parsing saved memes:", error);
    memes = [];
}

function displayMemes() {
    memesContainer.innerHTML = '<h2 class="text-xl font-semibold mb-2 text-purple-600">Последние Мемы</h2>';
    memes.slice().reverse().forEach((meme, index) => { // Reverse for newest first
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
            contentElement.textContent = "Unsupported content type.";
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

uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (validateForm()) {
        const title = titleInput.value;
        const description = descriptionInput.value;
        const contentFile = contentInput.files[0];
        const fileType = contentFile.type;

        const reader = new FileReader();
        reader.onload = (e) => {
            const newMeme = {
                title: title,
                description: description,
                url: e.target.result,
                type: fileType,
                date: new Date().toISOString()
            };
            memes.push(newMeme);
            try{
                localStorage.setItem('memes', JSON.stringify(memes));
            } catch(e){
                console.error("Failed to save memes to local storage", e);
            }

            displayMemes();
            uploadForm.reset();
            titleError.style.display = "none";
            descriptionError.style.display = "none";
            contentError.style.display = "none";
            alert('Мем успешно загружен и добавлен!');
        };

        if (fileType.startsWith('image')) {
            reader.readAsDataURL(contentFile);
        } else if (fileType.startsWith('video')) {
            reader.readAsDataURL(contentFile);
        }
    }
});

displayMemes();
