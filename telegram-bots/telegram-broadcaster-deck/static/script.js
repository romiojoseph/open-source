function detectFileType() {
    const fileInput = document.getElementById('file');
    const fileTypeSelect = document.getElementById('file_type');
    const file = fileInput.files[0];

    if (file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            fileTypeSelect.value = 'image';
        } else if (['mp4', 'mkv'].includes(fileExtension)) {
            fileTypeSelect.value = 'video';
        } else if (['mp3', 'wav', 'ogg'].includes(fileExtension)) {
            fileTypeSelect.value = 'audio';
        } else if (['csv', 'txt', 'pdf', 'docx', 'doc', 'xlsx'].includes(fileExtension)) {
            fileTypeSelect.value = 'document';
        } else if (['zip', '7z'].includes(fileExtension)) {
            fileTypeSelect.value = 'archive';
        } else {
            fileTypeSelect.value = 'attachment';
        }

        enableAllFileTypes();
        if (fileTypeSelect.value === 'image') {
            disableFileTypes(['video', 'audio', 'document', 'archive']);
        } else if (fileTypeSelect.value === 'video') {
            disableFileTypes(['image', 'audio', 'document', 'archive']);
        } else if (fileTypeSelect.value === 'audio') {
            disableFileTypes(['image', 'video', 'document', 'archive']);
        } else if (fileTypeSelect.value === 'document') {
            disableFileTypes(['image', 'video', 'audio', 'archive']);
        } else if (fileTypeSelect.value === 'archive') {
            disableFileTypes(['image', 'video', 'audio', 'document']);
        }
    }
}

function enableAllFileTypes() {
    const fileTypeSelect = document.getElementById('file_type');
    for (let i = 0; i < fileTypeSelect.options.length; i++) {
        fileTypeSelect.options[i].disabled = false;
    }
}

function disableFileTypes(types) {
    const fileTypeSelect = document.getElementById('file_type');
    for (let i = 0; i < fileTypeSelect.options.length; i++) {
        const option = fileTypeSelect.options[i];
        if (types.includes(option.value)) {
            option.disabled = true;
        }
    }
}

function openModal() {
    document.getElementById('configureModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('configureModal').style.display = 'none';
}

function getChannelId() {
    const selectedBot = document.getElementById('modal_selected_bot').value;
    const selectedChannelUsername = document.getElementById('modal_selected_channel_username').value;

    fetch('/get_channel_id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            selected_bot: selectedBot,
            selected_channel_username: selectedChannelUsername,
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
            if (data.error) {
                alert(data.error);
            } else {
                if (data.chat && data.chat.id) {
                    document.getElementById('channelInfo').textContent = `Chat ID: ${data.chat.id}`;
                    alert('Modal content updated successfully.');
                } else {
                    alert('Response structure is not as expected.');
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while fetching the channel chat ID: ' + error.message);
        });
}

function addPollOption() {
    const pollOptionsContainer = document.getElementById('poll-options-container');
    const pollOptionCount = pollOptionsContainer.querySelectorAll('.poll-option').length;

    if (pollOptionCount < 10) {
        const newPollOption = document.createElement('div');
        newPollOption.classList.add('poll-option');
        newPollOption.innerHTML = `
            <input type="text" class="form-control poll-option-input" name="poll_options[]" placeholder="Enter poll option" required maxlength="100">
            <span class="error-message" style="display: none;">Option cannot exceed 100 characters.</span> 
            <button type="button" class="btn btn-danger remove-poll-option-btn" onclick="removePollOption(this)">Remove</button>
        `;
        pollOptionsContainer.appendChild(newPollOption); 

        // Add event listener to check character limit
        const pollOptionInput = newPollOption.querySelector('.poll-option-input');
        const errorMessage = newPollOption.querySelector('.error-message');
        pollOptionInput.addEventListener('input', function () {
            if (this.value.length > 100) {
                errorMessage.style.display = 'inline';
            } else {
                errorMessage.style.display = 'none';
            }
        });

        updateCorrectOptionDropdown();
    }
}

function removePollOption(button) {
    const pollOption = button.parentElement;
    pollOption.remove();
    updateCorrectOptionDropdown();
}

function updateCorrectOptionDropdown() {
    const pollOptions = document.querySelectorAll('input[name="poll_options[]"]');
    const correctOptionDropdown = document.getElementById('correct_option_id');
    correctOptionDropdown.innerHTML = '<option value="">Select Correct Option</option>';

    pollOptions.forEach((option, index) => {
        const newOption = document.createElement('option');
        newOption.value = index;
        newOption.textContent = option.value;
        correctOptionDropdown.appendChild(newOption);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const sendMessageRadio = document.getElementById('send_message');
    const createPollRadio = document.getElementById('create_poll');
    const sendMessageSection = document.getElementById('send_message_section');
    const createPollSection = document.getElementById('create_poll_section');
    const pollTypeRadios = document.querySelectorAll('input[name="poll_type"]');
    const quizOptions = document.querySelectorAll('.quiz-options');
    const multipleAnswersCheckbox = document.getElementById('multiple_answers');

    sendMessageRadio.addEventListener('change', function () {
        sendMessageSection.style.display = 'block';
        createPollSection.style.display = 'none';
    });

    createPollRadio.addEventListener('change', function () {
        sendMessageSection.style.display = 'none';
        createPollSection.style.display = 'block';
        addPollOption(); // Add the first poll option when the section is shown
    });

    pollTypeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'quiz') {
                quizOptions.forEach(option => option.style.display = 'block');
                multipleAnswersCheckbox.disabled = true;
            } else {
                quizOptions.forEach(option => option.style.display = 'none');
                multipleAnswersCheckbox.disabled = false;
            }
        });
    });

    const pollOptionsContainer = document.getElementById('poll-options-container');
    pollOptionsContainer.addEventListener('input', function () {
        updateCorrectOptionDropdown();
    });
});

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});