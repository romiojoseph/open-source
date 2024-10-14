let timerInterval;
let remainingTime = 0;
let isPaused = false;
let isFlashing = false;
let originalTime = 0;
let additionalTime = 0;
let startTime, endTime, newEndTime, endedTime;
let isMuted = true;
let audio;
let currentTimerName = 'Name your timer...';
let selectedFont = 'Bai Jamjuree';
let flashInterval;
let percentage = 0; // Initialize percentage to 0

document.addEventListener('DOMContentLoaded', function () {
    audio = new Audio('audio/times-up-alarm.mp3');

    document.getElementById('startBtn').addEventListener('click', startTimer);
    document.getElementById('pauseResumeBtn').addEventListener('click', pauseResumeTimer);
    document.getElementById('flashBtn').addEventListener('click', flashTimer);
    document.getElementById('resetBtn').addEventListener('click', resetTimer);
    document.getElementById('muteButton').addEventListener('click', toggleMute);
    document.getElementById('editTimerNameBtn').addEventListener('click', editTimerName);

    populateFontDropdown();
    updateTimerNameDisplay();
    updateTimerFont();

    document.getElementById('startBtn').disabled = true;
    document.getElementById('pauseResumeBtn').disabled = true;
    document.getElementById('flashBtn').disabled = true;
    document.getElementById('resetBtn').disabled = true;
    document.getElementById('clearBtn').disabled = true;

    loadTimerData(); // Load timer data on page load
});

window.addEventListener('beforeunload', function (e) {
    if (timerInterval) {
        e.preventDefault();
        e.returnValue = '';
        return "A timer is currently running. Are you sure you want to leave?";
    }
});

function updateCurrentTime() {
    const now = moment().tz(moment.tz.guess());
    document.getElementById('current-time').textContent = now.format('ddd, D MMM YYYY • h:mm:ss A z');
}

setInterval(updateCurrentTime, 1000);
updateCurrentTime();

function setTimer(seconds) {
    if (timerInterval) {
        showModal("A timer is currently running. Please reset the current timer or wait for it to finish before setting a new one.");
        return;
    }

    if (seconds > 24 * 60 * 60) {
        showModal("Maximum timer duration is 24 hours.");
        return;
    }
    remainingTime = seconds;
    originalTime = seconds;
    additionalTime = 0;
    updateTimerDisplay();
    updateExtraTimeButtons();
    logAction(`Timer set for ${formatTime(seconds)}`);
    updateHistoryHeading();
    document.getElementById('times-up').style.display = 'none';

    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseResumeBtn').disabled = true;
    document.getElementById('flashBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;

    disablePresetButtons();

    startTime = null;
    endTime = null;
    newEndTime = null;
}

function openCustomTimerModal() {
    if (timerInterval) {
        showModal("A timer is currently running. Please reset the current timer or wait for it to finish before setting a new one.");
        return;
    }
    const modal = document.getElementById('customTimerModal');
    modal.style.display = 'block';
    populateCustomTimerDropdowns();
}

function closeCustomTimerModal() {
    const modal = document.getElementById('customTimerModal');
    modal.style.display = 'none';
}

function populateCustomTimerDropdowns() {
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    hours.innerHTML = '';
    minutes.innerHTML = '';
    seconds.innerHTML = '';

    for (let i = 0; i <= 24; i++) {
        hours.options.add(new Option(i.toString().padStart(2, '0'), i));
    }

    for (let i = 0; i < 60; i++) {
        minutes.options.add(new Option(i.toString().padStart(2, '0'), i));
        seconds.options.add(new Option(i.toString().padStart(2, '0'), i));
    }
}

function updateCustomTimerInputs() {
    const hours = parseInt(document.getElementById('hours').value);
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    if (hours === 24) {
        minutes.value = '00';
        seconds.value = '00';
        minutes.disabled = false;
        seconds.disabled = false;
    } else {
        minutes.disabled = false;
        seconds.disabled = false;
    }
}

function setCustomTimer() {
    const hours = parseInt(document.getElementById('hours').value);
    const minutes = parseInt(document.getElementById('minutes').value);
    const seconds = parseInt(document.getElementById('seconds').value);

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setTimer(totalSeconds);
    closeCustomTimerModal();
}

function startTimer() {
    if (remainingTime > 0 && !timerInterval) {
        timerInterval = setInterval(updateTimer, 1000);
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseResumeBtn').disabled = false;
        document.getElementById('extraTimeButtons').style.display = 'block';
        startTime = moment();
        endTime = moment().add(remainingTime, 'seconds');
        newEndTime = endTime.clone();
        logAction("Timer started");
        updateHistoryHeading();

        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseResumeBtn').disabled = false;
        document.getElementById('flashBtn').disabled = false;
        document.getElementById('resetBtn').disabled = false;

        disablePresetButtons();
    }
}

function pauseResumeTimer() {
    if (isPaused) {
        timerInterval = setInterval(updateTimer, 1000);
        document.getElementById('pauseResumeText').textContent = 'Pause';
        document.getElementById('timer').classList.remove('paused');
        document.getElementById('paused-text').style.display = 'none';
        logAction("Timer resumed");

        disablePresetButtons();
    } else {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById('pauseResumeText').textContent = 'Resume';
        document.getElementById('timer').classList.add('paused');
        document.getElementById('paused-text').style.display = 'inline';
        document.getElementById('paused-text').textContent = 'Timer paused. Click Resume to continue.';
        logAction("Timer paused");
    }
    isPaused = !isPaused;
}

function flashTimer() {
    if (remainingTime > 0) {
        const timerDisplay = document.getElementById('timer');
        const flashBtn = document.getElementById('flashBtn');

        if (isFlashing) {
            clearInterval(flashInterval);
            timerDisplay.classList.remove('flashing');
            isFlashing = false;
            flashBtn.querySelector('span').textContent = 'Flash';
            logAction("Flashing stopped");
        } else {
            flashInterval = setInterval(() => {
                timerDisplay.classList.toggle('flashing');
            }, 1000);
            isFlashing = true;
            flashBtn.querySelector('span').textContent = 'Stop Flashing';
            logAction("Flashing started");
        }
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    clearInterval(flashInterval);
    timerInterval = null;
    flashInterval = null;

    remainingTime = originalTime;
    isPaused = false;
    isFlashing = false;

    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseResumeBtn').disabled = true;
    document.getElementById('pauseResumeBtn').innerHTML =
        '<i class="ph-fill ph-play-pause"></i><span id="pauseResumeText">Pause</span>';
    document.getElementById('flashBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;

    document.getElementById('timer').classList.remove('paused', 'flashing');
    document.getElementById('paused-text').style.display = 'none';
    document.getElementById('extraTimeButtons').style.display = 'none';
    document.getElementById('times-up').style.display = 'none';
    updateTimerDisplay();
    updateProgressBar();

    additionalTime = 0;

    if (endTime) {
        newEndTime = endTime.clone();
    }
    endedTime = null;

    enablePresetButtons();

    logAction("Timer reset");
    updateHistoryHeading();
}

function updateTimer() {
    if (remainingTime > 0) {
        remainingTime--;
        updateTimerDisplay();
        updateProgressBar();
        if (remainingTime === 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            document.getElementById('startBtn').disabled = false;
            document.getElementById('pauseResumeBtn').disabled = true;
            document.getElementById('extraTimeButtons').style.display = 'none';
            document.getElementById('clearBtn').disabled = false;
            document.getElementById('timer').classList.remove('paused', 'flashing');
            document.getElementById('paused-text').style.display = 'none';
            logAction("Timer finished");
            document.getElementById('times-up').style.display = 'block';
            playNotificationSound();
            endedTime = moment();
            updateHistoryHeading();
        }
    }
}

function updateTimerDisplay() {
    document.getElementById('timer').textContent = formatTime(remainingTime);
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(":");
}

function updateExtraTimeButtons() {
    const container = document.getElementById('extraTimeButtons');
    const caption = document.getElementById('extraTimeCaption');
    container.innerHTML = '';
    const maxExtraTime = Math.min(30 * 60, originalTime, 24 * 60 * 60 - originalTime);
    const buttons = [5, 10, 15, 30, 45, 60, 120, 300, 600, 900];
    let buttonsAdded = false;

    buttons.forEach(seconds => {
        if (seconds <= maxExtraTime) {
            const button = document.createElement('button');
            button.textContent = `+${formatTime(seconds)}`;
            button.onclick = () => addExtraTime(seconds);
            button.className = 'button extra-time-button';
            container.appendChild(button);
            buttonsAdded = true;
        }
    });

    if (buttonsAdded) {
        caption.style.display = 'block';
    } else {
        caption.style.display = 'none';
    }
}

function addExtraTime(seconds) {
    if ((timerInterval || isPaused) && remainingTime > 0) {
        const maxExtraTime = Math.min(30 * 60, originalTime, 24 * 60 * 60 - originalTime - additionalTime);
        if (seconds > maxExtraTime) {
            showModal("Cannot add more time. Maximum timer duration is 24 hours.");
            return;
        }
        const newTime = remainingTime + seconds;
        remainingTime = newTime;
        additionalTime += seconds;
        newEndTime = moment().add(remainingTime, 'seconds');
        updateTimerDisplay();
        updateProgressBar();
        updateHistoryHeading();
        logAction(`Added ${formatTime(seconds)} to timer`);
    }
}

function updateProgressBar() {
    const progress = document.getElementById('progress');
    const totalTime = originalTime + additionalTime;
    let percentage = 0; // Initialize percentage to 0

    if (totalTime > 0) { // Only calculate percentage if totalTime is not 0
        percentage = 100 - (remainingTime / totalTime * 100);
    }

    progress.style.width = percentage + '%';

    if (percentage >= 90) {
        progress.style.backgroundColor = '#ef4444';
        if (!isFlashing) {
            document.getElementById('timer').classList.add('flashing');
        }
    } else if (percentage >= 50) {
        progress.style.backgroundColor = '#ea580c';
        document.getElementById('timer').classList.remove('flashing');
    } else {
        progress.style.backgroundColor = '#22c55e';
        document.getElementById('timer').classList.remove('flashing');
    }
}

function updateHistoryHeading() {
    const heading = document.getElementById('history-heading');
    if (timerInterval || isPaused || remainingTime === 0) {
        let content = `
            <div class="current-timer"><strong>Current timer:</strong> ${formatTime(originalTime)}</div> 
            <div class="timer-duration"><strong>Duration:</strong> ${formatTime(originalTime)}</div>
            <div class="start-time"><strong>Start time:</strong> ${startTime ? startTime.format('hh:mm:ss A') : 'N/A'}</div>
            <div class="end-time"><strong>Initaly expected end time:</strong> ${endTime ? endTime.format('hh:mm:ss A') : 'N/A'}</div>
            <div class="additional-time"><strong>Additional time:</strong> ${formatTime(additionalTime)}</div>
        `;
        if (additionalTime > 0) {
            content += `<div class="new-end-time"><strong>New expected end time:</strong> ${newEndTime ? newEndTime.format('hh:mm:ss A') : 'N/A'}</div>`;
        }
        if (endedTime) {
            content += `<div class="ended-time"><strong>Ended time:</strong> ${endedTime.format('hh:mm:ss A')}</div>`;
        }
        heading.innerHTML = content;
    } else {
        heading.textContent = 'History';
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        appendToChatLog(message, true);
        showModal(message);
        input.value = '';
    }
}

function appendToChatLog(message, isUserMessage = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = isUserMessage ? 'user-message' : 'system-message';
    const timestamp = moment().format('ddd, D MMM YYYY • h:mm:ss A');
    messageElement.innerHTML = `
        <div class="message-content"><strong>${isUserMessage ? 'You' : 'System'}:</strong> ${message}</div>
        <div class="message-timestamp">${timestamp}</div>
    `;

    chatMessages.insertBefore(messageElement, chatMessages.firstChild);

    if (chatMessages.scrollTop === 0) {
        chatMessages.scrollTop = 0;
    }
}

function logAction(action) {
    appendToChatLog(action);
}

function clearChat() {
    document.getElementById('chat-messages').innerHTML = '';
    document.getElementById('clearBtn').disabled = true;
}

function showModal(message) {
    const modal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Disable background scrolling
    setTimeout(() => {
        closeModal();
    }, 5000);
}

function closeModal() {
    const modal = document.getElementById('messageModal');
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Re-enable background scrolling
}

function toggleMute() {
    isMuted = !isMuted;
    const muteButton = document.getElementById('muteButton');
    const muteIcon = muteButton.querySelector('i');

    if (isMuted) {
        muteButton.title = 'Unmute';
        muteIcon.classList.remove('ph-speaker-simple-high');
        muteIcon.classList.add('ph-speaker-simple-slash');
        muteButton.querySelector('span').textContent = 'Sound Off';
    } else {
        muteButton.title = 'Mute';
        muteIcon.classList.remove('ph-speaker-simple-slash');
        muteIcon.classList.add('ph-speaker-simple-high');
        muteButton.querySelector('span').textContent = 'Sound On';
    }

    muteButton.classList.toggle('muted', isMuted);
    logAction(isMuted ? "Sound muted" : "Sound unmuted");
}

function playNotificationSound() {
    if (!isMuted && audio) {
        audio.play().catch(error => console.error('Error playing audio:', error));
    }
}

function populateFontDropdown() {
    const fontDropdown = document.createElement('select');
    fontDropdown.id = 'fontDropdown';
    fontDropdown.className = "button";

    const fonts = [
        'Akshar',
        'Anek Latin',
        'Bai Jamjuree',
        'Blinker',
        'Chakra Petch',
        'Goldman',
        'Inter',
        'Monda',
        'Quantico',
        'Share',
        'Syncopate',
        'Tomorrow',
        'Teko',
        'Orbitron'
    ];

    fonts.forEach(font => {
        const option = document.createElement('option');
        option.value = font;
        option.textContent = font;
        if (font === selectedFont) {
            option.selected = true;
        }
        fontDropdown.appendChild(option);
    });

    fontDropdown.addEventListener('change', function () {
        selectedFont = this.value;
        updateTimerFont();
    });

    document.querySelector('.basic-contols').appendChild(fontDropdown);
}

function updateTimerFont() {
    const timerDisplay = document.getElementById('timer');
    timerDisplay.style.fontFamily = `'${selectedFont}', serif`;
    timerDisplay.style.fontWeight = 'bold';
}

function editTimerName() {
    const timerNameElement = document.getElementById('timerName');
    const editButton = document.getElementById('editTimerNameBtn');
    const isEditing = timerNameElement.classList.contains('editing');

    if (isEditing) {
        const input = timerNameElement.querySelector('input');
        currentTimerName = input.value.trim() || 'Timer';
        timerNameElement.innerHTML = currentTimerName;
        editButton.textContent = "Edit";
        timerNameElement.classList.remove('editing');
    } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentTimerName;
        input.className = 'timer-name-input';
        timerNameElement.innerHTML = '';
        timerNameElement.appendChild(input);
        editButton.textContent = "Save";
        timerNameElement.classList.add('editing');
        input.focus();
    }
}

function updateTimerNameDisplay() {
    const timerNameElement = document.getElementById('timerName');
    timerNameElement.innerHTML = currentTimerName;
}

function disablePresetButtons() {
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(button => button.disabled = true);
    document.querySelector('.preset-btn[onclick="openCustomTimerModal()"]').disabled = true;
}

function enablePresetButtons() {
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(button => button.disabled = false);
    document.querySelector('.preset-btn[onclick="openCustomTimerModal()"]').disabled = false;
}

document.getElementById('chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Function to save timer data to localStorage
function saveTimerData() {
    if (timerInterval || isPaused) {
        const timerData = {
            remainingTime: remainingTime,
            originalTime: originalTime,
            additionalTime: additionalTime,
            startTime: startTime ? startTime.toISOString() : null,
            endTime: endTime ? endTime.toISOString() : null,
            newEndTime: newEndTime ? newEndTime.toISOString() : null,
            endedTime: endedTime ? endedTime.toISOString() : null,
            isPaused: isPaused,
            currentTimerName: currentTimerName,
            selectedFont: selectedFont,
            isMuted: isMuted,
            isFlashing: isFlashing
        };
        localStorage.setItem('timerData', JSON.stringify(timerData));
    }
}

// Function to load timer data from localStorage
function loadTimerData() {
    const timerDataJSON = localStorage.getItem('timerData');
    if (timerDataJSON) {
        const timerData = JSON.parse(timerDataJSON);
        remainingTime = timerData.remainingTime;
        originalTime = timerData.originalTime;
        additionalTime = timerData.additionalTime;
        startTime = timerData.startTime ? moment(timerData.startTime) : null;
        endTime = timerData.endTime ? moment(timerData.endTime) : null;
        newEndTime = timerData.newEndTime ? moment(timerData.newEndTime) : null;
        endedTime = timerData.endedTime ? moment(timerData.endedTime) : null;
        isPaused = timerData.isPaused;
        currentTimerName = timerData.currentTimerName || 'Name your timer...';
        selectedFont = timerData.selectedFont || 'Bai Jamjuree';
        isMuted = timerData.isMuted;
        isFlashing = timerData.isFlashing;

        updateTimerNameDisplay(); // Update timer name display
        updateTimerDisplay();
        updateProgressBar();
        updateExtraTimeButtons();
        updateHistoryHeading();
        updateTimerFont(); // Update timer font

        if (isPaused) {
            document.getElementById('pauseResumeText').textContent = 'Resume';
            document.getElementById('timer').classList.add('paused');
            document.getElementById('paused-text').style.display = 'inline';
        } else if (remainingTime > 0) {
            // Adjust remainingTime based on the elapsed time since startTime
            const elapsedTime = moment().diff(startTime, 'seconds');
            remainingTime = Math.max(0, originalTime + additionalTime - elapsedTime);
            startTimer(); 
        } else {
            document.getElementById('times-up').style.display = 'block';
        }

        document.getElementById('startBtn').disabled = timerInterval !== null;
        document.getElementById('pauseResumeBtn').disabled = timerInterval === null;
        document.getElementById('flashBtn').disabled = remainingTime <= 0;
        document.getElementById('resetBtn').disabled = remainingTime === originalTime && !timerInterval && !isPaused;
        
        // Set mute button state and icon
        const muteButton = document.getElementById('muteButton');
        const muteIcon = muteButton.querySelector('i');
        if (isMuted) {
            muteButton.title = 'Unmute';
            muteIcon.classList.remove('ph-speaker-simple-high');
            muteIcon.classList.add('ph-speaker-simple-slash');
            muteButton.querySelector('span').textContent = 'Sound Off';
            muteButton.classList.add('muted'); 
        } else {
            muteButton.title = 'Mute';
            muteIcon.classList.remove('ph-speaker-simple-slash');
            muteIcon.classList.add('ph-speaker-simple-high');
            muteButton.querySelector('span').textContent = 'Sound On';
            muteButton.classList.remove('muted');
        }

        // Restore flashing state
        if (isFlashing) {
            flashTimer();
        }


        disablePresetButtons();
    }
}

setInterval(saveTimerData, 1000);