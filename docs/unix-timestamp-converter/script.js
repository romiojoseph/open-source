document.getElementById('convertToUnix').addEventListener('click', () => {
    const dateTimeInput = document.getElementById('datetimeInput').value;
    if (dateTimeInput) {
        const unixTimestamp = Math.floor(new Date(dateTimeInput).getTime() / 1000);
        document.getElementById('unixOutput').innerHTML = `<b>Unix Timestamp:</b> ${unixTimestamp}`;
    } else {
        document.getElementById('unixOutput').textContent = 'Please enter a valid date and time.';
    }
});

document.getElementById('convertToDate').addEventListener('click', () => {
    const unixInput = document.getElementById('unixInput').value;
    if (unixInput) {
        const date = new Date(unixInput * 1000);
        const formatter = new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
        });
        document.getElementById('dateOutput').innerHTML = `<b>Converted Date:</b> ${formatter.format(date)}`;
    } else {
        document.getElementById('dateOutput').textContent = 'Please enter a valid Unix timestamp.';
    }
});