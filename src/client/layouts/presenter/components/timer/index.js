const startTimer = () => {
    let timerElement = document.querySelector('#timer'),
        clockElement = document.querySelector('#clock'),
        seconds = 0,
        minutes = 0,
        hours = 0;

    const formatTime = time => {
        return time ? (time < 10 ? '0' + time : time) : '00';
    };
    /****** TIMER FUNCTIONS ******/
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
        timerElement.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
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

    /****** CLOCK FUNCTIONS ******/
    const updateTime = () => {
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        clockElement.textContent = `${formatTime(hours)}:${formatTime(minutes)}`;
    };
    const clock = () => {
        updateTime();
        setInterval(updateTime, 1000);
    };

    let restartTimer = timer();
    clock();

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
        startTimer();
    }
});
