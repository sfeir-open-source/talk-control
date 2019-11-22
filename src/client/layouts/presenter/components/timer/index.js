const startTimer = () => {
    let timerElement = document.querySelector('#timer'),
        seconds = 0,
        minutes = 0,
        hours = 0;

    const add = () => {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }

        timerElement.textContent =
            (hours ? (hours > 9 ? hours : '0' + hours) : '00') +
            ':' +
            (minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00') +
            ':' +
            (seconds > 9 ? seconds : '0' + seconds);
    };

    const timer = () => {
        const intervalID = setInterval(add, 1000);
        return () => {
            clearInterval(intervalID);
            seconds = 0;
            minutes = 0;
            hours = 0;
            timerElement.textContent = '00:00:00';
        };
    };
    let restartTimer = timer();
    timerElement.addEventListener('click', () => {
        restartTimer();
        restartTimer = timer();
    });
};

addEventListener('message', message => {
    if (!message || !message.data) {
        return;
    }

    if (typeof message.data === 'object' && message.data.type === 'init') {
        startTimer(false);
    }
});
