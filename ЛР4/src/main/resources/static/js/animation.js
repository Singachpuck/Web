document.addEventListener('DOMContentLoaded', () => {
    const settingUrl = 'http://localhost:8080/settings/';

    const settings = {
        circleRadius: null,
        controlsHeight: null
    }

    let i = 0;

    for (let key of Object.keys(settings)) {
        i++;

        let prom = fetch(settingUrl + key)
            .then(resp => resp.json())
            .then(json => {
                settings[key] = json[key]
            })

        if (i === Object.keys(settings).length) {
            prom.then(() => {
                const newMainSection = document.createElement('div'),
                    thirdBlock = document.querySelector('.main-section'),
                    firstBlock = document.querySelector('aside');

                newMainSection.style.display = 'none';
                newMainSection.classList.add('main-section', 'animation-section');
                newMainSection.style.margin = '50px 0';

                thirdBlock.parentElement.appendChild(newMainSection);

                const playButton = document.querySelector('.play');

                const work = document.createElement('div'),
                    anim = document.createElement('div'),
                    controls = document.createElement('div'),
                    start = document.createElement('button'),
                    close = document.createElement('button'),
                    reload = document.createElement('button'),
                    message = document.createElement('p'),
                    canv = document.createElement('canvas');

                playButton.addEventListener('click', () => {
                    localStorage.setItem('animLog', '');
                    thirdBlock.style.display = 'none';
                    newMainSection.style.display = 'block';

                    localStorage.setItem('animLog',
                        localStorage.getItem('animLog') + ';' + new Date().toLocaleString() + '&' + 'Switched to Animation');

                    canv.width = anim.offsetWidth - 10;
                    canv.height = anim.offsetHeight - 10;
                });

                close.addEventListener('click', () => {
                    thirdBlock.style.display = 'block';
                    newMainSection.style.display = 'none';

                    console.log(firstBlock);

                    localStorage.setItem('animLog',
                        localStorage.getItem('animLog') + ';' + new Date().toLocaleString() + '&' + 'Animation Closed');

                    firstBlock.innerHTML = '';

                    let entryList = document.createElement('ul');

                    localStorage.getItem('animLog').substr(1).split(';').forEach(log => {
                        let splitLog = log.split('&'),
                            date = splitLog[0],
                            msg = splitLog[1];

                        const li = document.createElement('li');

                        li.innerText = date + ': ' + msg;

                        entryList.appendChild(li);
                    });

                    firstBlock.appendChild(entryList);
                    localStorage.removeItem('animLog');
                });

                let x1 = undefined,
                    y1 = undefined,
                    x2 = undefined,
                    y2 = undefined,
                    speed = 0,
                    speedInterval = undefined;

                anim.appendChild(canv);
                work.appendChild(controls);
                work.appendChild(anim);
                newMainSection.appendChild(work);

                const controlsHeight = parseFloat(settings["controlsHeight"]),
                    circleRadius = parseFloat(settings["circleRadius"]),
                    firstCircleColor = 'yellow',
                    secondCircleColor = 'red';

                let prevTime = undefined,
                    direction = undefined,
                    collied = false;

                newMainSection.style.height = '400px';

                work.style.height = '100%';

                anim.style.width = 'calc(100% - 10px)';
                anim.style.height = 'calc(100% - 50px)';
                anim.style.border = '5px solid green';

                CanvasRenderingContext2D.prototype.clear =
                    CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
                        if (preserveTransform) {
                            this.save();
                            this.setTransform(1, 0, 0, 1, 0, 0);
                        }

                        this.clearRect(0, 0, this.canvas.width, this.canvas.height);

                        if (preserveTransform) {
                            this.restore();
                        }
                    };

                generateCircles();

                window.requestAnimationFrame(moveCircles);

                controls.style.height = controlsHeight + 'px';

                start.innerText = 'Start';
                start.style.margin = '0 auto';

                start.addEventListener('click', (e) => {
                    clearInterval(speedInterval);

                    speedInterval = setInterval(() => {
                        speed += 10;
                    }, 1000);

                    speed = 100;
                    start.disabled = true;
                    start.style.display = 'none';
                    reload.style.display = 'initial';
                    reload.disabled = false;
                    message.innerText = 'Animation started!';
                    localStorage.setItem('animLog',
                        localStorage.getItem('animLog') + ';' + new Date().toLocaleString() + '&' + 'Animation Started');
                });

                reload.innerText = 'Reload';
                reload.style.display = 'none';
                reload.disabled = true;
                reload.style.margin = '0 auto';

                reload.addEventListener('click', (e) => {
                    clearInterval(speedInterval);

                    generateCircles();
                    speed = 0;
                    start.disabled = false;
                    start.style.display = 'initial';
                    reload.style.display = 'none';
                    reload.disabled = true;
                    message.innerText = 'Animation reloaded!';
                    localStorage.setItem('animLog',
                        localStorage.getItem('animLog') + ';' + new Date().toLocaleString() + '&' + 'Animation Reloaded');
                });

                close.innerText = 'Close';

                controls.style.display = 'flex';
                controls.appendChild(close);
                controls.appendChild(start);
                controls.appendChild(reload);
                controls.appendChild(message);
                anim.style.background = 'url("../images/snowflake.png")';

                function generateCircles() {
                    collied = false;
                    prevTime = performance.now();
                    direction = Math.random() > 0.5 ? {
                        'yellowCircle': Math.random() > 0.5 ? 'left' : 'right',
                        'redCircle': Math.random() > 0.5 ? 'up' : 'down'
                    } : {
                        'yellowCircle': Math.random() > 0.5 ? 'up' : 'down',
                        'redCircle': Math.random() > 0.5 ? 'left' : 'right'
                    };

                    x1 = getRandomArbitrary(circleRadius, canv.width - circleRadius);
                    y1 = getRandomArbitrary(circleRadius, canv.height - circleRadius);
                    x2 = getRandomArbitrary(circleRadius, canv.width - circleRadius);
                    y2 = getRandomArbitrary(circleRadius, canv.height - circleRadius);
                }

                function moveCircles() {
                    const ctx = canv.getContext('2d');
                    let nowPerformance = performance.now();
                    const delta = (nowPerformance - prevTime) / 1000;

                    prevTime = nowPerformance;

                    if (collision(x1, y1, circleRadius, x2, y2, circleRadius)) {
                        clearInterval(speedInterval);
                        speed = 0;

                        message.innerText = 'Circles collided!';
                        if (!collied) {
                            localStorage.setItem('animLog',
                                localStorage.getItem('animLog') + ';' + new Date().toLocaleString() + '&' + 'Balls Collided');
                            collied = true;
                        }
                    }

                    if (x1 + circleRadius >= canv.width) {
                        direction['yellowCircle'] = 'left';
                    }

                    if (x1 - circleRadius <= 0) {
                        direction['yellowCircle'] = 'right';
                    }

                    if (y1 + circleRadius >= canv.height) {
                        direction['yellowCircle'] = 'up';
                    }

                    if (y1 - circleRadius <= 0) {
                        direction['yellowCircle'] = 'down';
                    }

                    if (x2 + circleRadius >= canv.width) {
                        direction['redCircle'] = 'left';
                    }

                    if (x2 - circleRadius <= 0) {
                        direction['redCircle'] = 'right';
                    }

                    if (y2 + circleRadius >= canv.height) {
                        direction['redCircle'] = 'up';
                    }

                    if (y2 - circleRadius <= 0) {
                        direction['redCircle'] = 'down';
                    }

                    ctx.clear();

                    ctx.beginPath();
                    ctx.fillStyle = firstCircleColor;
                    ctx.arc(Math.floor(x1), Math.floor(y1), circleRadius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.fillStyle = secondCircleColor;
                    ctx.arc(Math.floor(x2), Math.floor(y2), circleRadius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.closePath();

                    if (direction['yellowCircle'] === 'left') {
                        x1 -= delta * speed;

                        if (direction['redCircle'] === 'up') {
                            y2 -= delta * speed;
                        } else {
                            y2 += delta * speed;
                        }
                    } else if (direction['yellowCircle'] === 'right') {
                        x1 += delta * speed;

                        if (direction['redCircle'] === 'up') {
                            y2 -= delta * speed;
                        } else {
                            y2 += delta * speed;
                        }
                    } else if (direction['yellowCircle'] === 'up') {
                        y1 -= delta * speed;

                        if (direction['redCircle'] === 'left') {
                            x2 -= delta * speed;
                        } else {
                            x2 += delta * speed;
                        }
                    } else {
                        y1 += delta * speed;

                        if (direction['redCircle'] === 'left') {
                            x2 -= delta * speed;
                        } else {
                            x2 += delta * speed;
                        }
                    }

                    window.requestAnimationFrame(moveCircles);
                }

                function getRandomArbitrary(min, max) {
                    return Math.random() * (max - min) + min;
                }

                function collision(p1x, p1y, r1, p2x, p2y, r2) {
                    let a;
                    let x;
                    let y;

                    a = r1 + r2;
                    x = p1x - p2x;
                    y = p1y - p2y;

                    return a > Math.sqrt((x * x) + (y * y));
                }
            })
        }

    }
})