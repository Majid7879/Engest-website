validateFormData()
// varables
let sentencesField = document.getElementById("sentence");
let sentencesFieldMessage = document.querySelector("#sentence+span.message");
let translationField = document.getElementById("translation");
let translationFieldMessage = document.querySelector("#translation+span.message");
let isPublicField = document.getElementById("ispublic");
let addButton = document.getElementById("add");
let data = localStorage.getItem("sentences") !== null ? JSON.parse(localStorage.getItem("sentences")) : [];
let counter = 0;
let mode = 'add';
let editingItemId = -1;

// functions

function viewSentencesList() {
    let sentencesList = document.querySelector(".sentences-list .sentences");
    sentencesList.innerHTML = ""; // Clear the list before adding new sentences
    if (data.length === 0) {
        sentencesList.innerHTML = `<div class="no-data ">No data found</div>`;
        return;
    }
    // Loop through the data array and create HTML elements for each sentence
    data.forEach((item, index) => {
        sentencesList.innerHTML += `                    
                    <div class="sentence-item ${item.id === editingItemId ? 'editing' : ''}" data-id="${item.id}">
                        <div class="sentence-text">
                            <p>
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="5.3335" y="4" width="21.3333" height="24" rx="2" fill="#7E869E" fill-opacity="0.25" />
                                    <path d="M5.3335 25.3333C5.3335 24.7133 5.3335 24.4034 5.40164 24.149C5.58658 23.4588 6.12567 22.9197 6.81586 22.7348C7.07019 22.6667 7.38018 22.6667 8.00016 22.6667H22.6668C24.5524 22.6667 25.4953 22.6667 26.081 22.0809C26.6668 21.4951 26.6668 20.5523 26.6668 18.6667V24C26.6668 25.8856 26.6668 26.8284 26.081 27.4142C25.4953 28 24.5524 28 22.6668 28H8.00017C7.38018 28 7.07019 28 6.81586 27.9318C6.12567 27.7469 5.58658 27.2078 5.40164 26.5176C5.3335 26.2633 5.3335 25.9533 5.3335 25.3333Z" fill="#222222" />
                                    <path d="M12.6665 14L15.2271 16.5606C15.2857 16.6192 15.3807 16.6192 15.4392 16.5606L20.6665 11.3333"stroke="#222222" stroke-width="1.2" />
                                </svg>
                                <span>${item.sentence}</span>
                            </p>
                        </div>
                        <div class="sentence-control">
                            <button class="edit" onclick="edit(${item.id})" >
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.5047 6.82843L8.45304 16.8801L8.45304 16.8801C8.22828 17.1049 8.11591 17.2173 8.04438 17.3563C7.97285 17.4952 7.94672 17.652 7.89447 17.9655L6.78158 24.6429C6.72912 24.9576 6.70289 25.115 6.79387 25.206C6.88484 25.2969 7.04222 25.2707 7.35698 25.2183L14.0343 24.1054L14.0343 24.1054C14.3478 24.0531 14.5046 24.027 14.6436 23.9555C14.7826 23.8839 14.8949 23.7716 15.1197 23.5468L15.1197 23.5468L25.1714 13.4951L25.1714 13.4951C26.5047 12.1618 27.1714 11.4951 27.1714 10.6667C27.1714 9.83824 26.5047 9.17158 25.1714 7.83825L25.1714 7.83824L24.1616 6.82843C22.8283 5.49509 22.1616 4.82843 21.3332 4.82843C20.5047 4.82843 19.8381 5.49509 18.5047 6.82843Z" fill="#7E869E" fill-opacity="0.25" />
                                    <path d="M16.6261 8.70711L8.45304 16.8801L8.45304 16.8801C8.22828 17.1049 8.11591 17.2173 8.04438 17.3563C7.97285 17.4952 7.94672 17.652 7.89447 17.9655L6.78158 24.6429C6.72912 24.9576 6.70289 25.115 6.79387 25.206C6.88484 25.2969 7.04222 25.2707 7.35698 25.2183L14.0343 24.1054L14.0343 24.1054C14.3478 24.0531 14.5046 24.027 14.6436 23.9555C14.7826 23.8839 14.895 23.7716 15.1197 23.5468L23.2927 15.3738C23.6261 15.0404 23.7927 14.8738 23.7927 14.6667C23.7927 14.4596 23.6261 14.2929 23.2927 13.9596L18.0403 8.70711C17.7069 8.37377 17.5403 8.20711 17.3332 8.20711C17.1261 8.20711 16.9594 8.37377 16.6261 8.70711Z" fill="#222222" />
                                </svg>
                            </button>
                            <button class="delete" onclick="remove(${item.id}, this)">
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <rect width="32" height="32" fill="white" />
                                    <path d="M4 8C4 5.79086 5.79086 4 8 4H24C26.2091 4 28 5.79086 28 8V24C28 26.2091 26.2091 28 24 28H8C5.79086 28 4 26.2091 4 24V8Z" fill="#7E869E" fill-opacity="0.25" />
                                    <path d="M12 19.9995L20 11.9995" stroke="#222222" stroke-width="1.2" />
                                    <path d="M20 20L12 12" stroke="#222222" stroke-width="1.2" />
                                </svg>
                            </button>
                        </div>
                    </div>`;
    });
}

function changeMode(Mode) {
    mode = Mode;

    if (mode === 'add') {
        addButton.innerHTML = 'ADD';
        document.querySelector(".add-sentences h1.head").innerHTML = "Add sentence";
    } else if (mode === 'edit') {
        addButton.innerHTML = 'UPDATE';
        document.querySelector(".add-sentences h1.head").innerHTML = "Update sentence";
    }
}
function remove(id, btn) {
    // get the parent element of the button
    let parent = btn.parentElement.parentElement;
    parent.classList.add("removingAnimation");

    parent.addEventListener("animationend", function () {
        data = data.filter((item) => {
            return item.id !== id;
        });
        viewSentencesList();
        // Add the data to loccal storage
        console.log(data);
        localStorage.setItem("sentences", JSON.stringify(data));
    });

}

function edit(id) {
    let selectedItem = {};
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
            selectedItem = data[i];
            break;
        }
    }

    // put the data in the form fields
    sentencesField.value = selectedItem.sentence;
    translationField.value = selectedItem.translation;
    isPublicField.checked = selectedItem.isPublic;

    editingItemId = selectedItem.id;
    changeMode('edit');
    viewSentencesList();
}

addButton.addEventListener("click", function (e) {

    let sentencesFieldErrors = validateFormData(sentencesField.value, {
        isRequired: true,
        minLength: 10,
        maxLength: 100,
    });
    let translationFieldErrors = validateFormData(translationField.value, {
        isRequired: true,
        minLength: 10,
        maxLength: 100,
    });

    if (sentencesFieldErrors.length > 0) {
        sentencesFieldMessage.innerHTML = sentencesFieldErrors[0];
        sentencesFieldMessage.classList.add("text-danger");
        return false;
    } else {
        sentencesFieldMessage.innerHTML = "";
        sentencesFieldMessage.classList.remove("text-danger");
    }

    if (translationFieldErrors.length > 0) {
        translationFieldMessage.innerHTML = translationFieldErrors[0];
        translationFieldMessage.classList.add("text-danger");
        return false;
    } else {
        translationFieldMessage.innerHTML = "";
        translationFieldMessage.classList.remove("text-danger");
    }

    if (mode === 'add') {
        // If there are no errors, add the sentence to the list
        data.push({
            id: counter++,
            sentence: sentencesField.value.trim(),
            translation: translationField.value.trim(),
            isPublic: isPublicField.checked,
        });

    } else if (mode === 'edit') {
        data.forEach(item => {
            if (item.id === editingItemId) {
                item.sentence = sentencesField.value.trim();
                item.translation = translationField.value.trim();
                item.isPublic = isPublicField.checked;
            }
        });
        changeMode('add');
        editingItemId = -1;
    }
    // clear form data
    sentencesField.value = "";
    translationField.value = "";
    isPublicField.checked = false;
    sentencesField.focus();

    // Add the data to loccal storage
    localStorage.setItem("sentences", JSON.stringify(data));

    // view the sentences list
    viewSentencesList();
});

// view the sentences list
viewSentencesList();
