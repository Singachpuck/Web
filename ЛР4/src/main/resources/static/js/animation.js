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
                    message = document.createElement('p');

                playButton.addEventListener('click', () => {
                    localStorage.setItem('animLog', '');
                    thirdBlock.style.display = 'none';
                    newMainSection.style.display = 'block';

                    localStorage.setItem('animLog',
                        localStorage.getItem('animLog') + ';' + new Date().toLocaleString() + '&' + 'Switched to Animation');

                    setHeightDuration();
                    setWidthDuration();

                    generateCircles();
                });

                close.addEventListener('click', () => {
                    thirdBlock.style.display = 'block';
                    newMainSection.style.display = 'none';

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

                let speed = 150,
                    collisionInterval = undefined,
                    circle1StartAnimDuration = undefined,
                    circle2StartAnimDuration = undefined,
                    circle1 = document.createElement('div'),
                    circle2 = document.createElement('div'),
                    widthDuration = undefined,
                    heightDuration = undefined;

                anim.appendChild(circle1);
                anim.appendChild(circle2);
                work.appendChild(controls);
                work.appendChild(anim);
                newMainSection.appendChild(work);

                const controlsHeight = parseFloat(settings["controlsHeight"]),
                    circleRadius = 10,
                    firstCircleColor = 'yellow',
                    secondCircleColor = 'red';

                let direction = undefined,
                    collied = false;

                circle1.style.position = 'absolute';
                circle2.style.position = 'absolute';

                circle1.style.width = '20px';
                circle1.style.height = '20px';
                circle2.style.width = '20px';
                circle2.style.height = '20px';

                circle1.style.backgroundColor = firstCircleColor;
                circle2.style.backgroundColor = secondCircleColor;

                circle1.style.borderRadius = '50%';
                circle2.style.borderRadius = '50%';

                newMainSection.style.height = '400px';

                work.style.height = '100%';

                anim.style.position = 'relative';
                anim.style.width = 'calc(100% - 10px)';
                anim.style.height = 'calc(100% - 50px)';
                anim.style.border = '5px solid green';

                controls.style.height = controlsHeight + 'px';

                start.innerText = 'Start';
                start.style.margin = '0 auto';

                start.addEventListener('click', (e) => {
                    moveCircle('yellowCircle');
                    moveCircle('redCircle');

                    collisionInterval = setInterval(() => {
                        let x1 = circle1.offsetLeft,
                            y1 = circle1.offsetTop,
                            x2 = circle2.offsetLeft,
                            y2 = circle2.offsetTop;

                        if (collision(x1, y1, circleRadius,
                                        x2, y2, circleRadius)) {
                            circle1.getAnimations().forEach(animation => {
                                animation.pause();
                            });

                            circle2.getAnimations().forEach(animation => {
                                animation.pause();
                            });

                            message.innerText = 'Balls Collided!';

                            localStorage.setItem('animLog',
                                localStorage.getItem('animLog') + ';' + new Date().toLocaleString() + '&' + 'Balls Collided!');
                        }
                    }, 100);

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
                    circle1.getAnimations().forEach(animation => {
                        animation.cancel();
                    });

                    circle2.getAnimations().forEach(animation => {
                        animation.cancel();
                    });

                    speed = 150;

                    generateCircles();
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

                    direction = Math.random() > 0.5 ? {
                        'yellowCircle': Math.random() > 0.5 ? 'left' : 'right',
                        'redCircle': Math.random() > 0.5 ? 'up' : 'down'
                    } : {
                        'yellowCircle': Math.random() > 0.5 ? 'up' : 'down',
                        'redCircle': Math.random() > 0.5 ? 'left' : 'right'
                    };

                    circle1.style.top = getRandomArbitrary(0, anim.offsetHeight - 20) + 'px';
                    circle1.style.left = getRandomArbitrary(0, anim.offsetWidth - 20) + 'px';
                    circle2.style.top = getRandomArbitrary(0, anim.offsetHeight - 20) + 'px';
                    circle2.style.left = getRandomArbitrary(0, anim.offsetWidth - 20) + 'px';

                    parseCircleTime();
                }

                function parseCircleTime() {
                    if (direction['yellowCircle'] === 'left') {
                        circle1StartAnimDuration = circle1.offsetLeft * 1000 / speed;

                        if (direction['redCircle'] === 'up') {
                            circle2StartAnimDuration = circle2.offsetTop * 1000 / speed;
                        } else {
                            circle2StartAnimDuration =
                                (anim.offsetHeight - circle2.offsetTop) * 1000 / speed;
                        }
                    } else if (direction['yellowCircle'] === 'right') {
                        circle1StartAnimDuration =
                            (anim.offsetWidth - circle1.offsetLeft) * 1000 / speed;

                        if (direction['redCircle'] === 'up') {
                            circle2StartAnimDuration = circle2.offsetTop * 1000 / speed;
                        } else {
                            circle2StartAnimDuration =
                                (anim.offsetHeight - circle2.offsetTop) * 1000 / speed;
                        }
                    } else if (direction['yellowCircle'] === 'up') {
                        circle1StartAnimDuration = circle1.offsetTop * 1000 / speed;

                        if (direction['redCircle'] === 'left') {
                            circle2StartAnimDuration = circle2.offsetLeft * 1000 / speed;
                        } else {
                            circle2StartAnimDuration =
                                (anim.offsetWidth - circle2.offsetLeft) * 1000 / speed;
                        }
                    } else {
                        circle1StartAnimDuration =
                            (anim.offsetHeight - circle1.offsetTop) * 1000 / speed;

                        if (direction['redCircle'] === 'left') {
                            circle2StartAnimDuration = circle2.offsetLeft * 1000 / speed;
                        } else {
                            circle2StartAnimDuration =
                                (anim.offsetWidth - circle2.offsetLeft) * 1000 / speed;
                        }
                    }
                }

                function moveCircle(circleName) {
                    let circle, duration, animation;

                    if (circleName === 'yellowCircle') {
                        circle = circle1;
                        duration = circle1StartAnimDuration;
                    } else {
                        circle = circle2;
                        duration = circle2StartAnimDuration;
                    }

                    if (direction[circleName] === 'left') {
                        animation = circle.animate({
                            left: 0
                        }, {
                            duration: duration,
                            iterations: 1,
                            fill: "forwards"
                        });

                        animation.onfinish = () => {
                            direction[circleName] = 'right';
                            speed += 20;

                            setWidthDuration();

                            if (circleName === 'yellowCircle') {
                                circle1StartAnimDuration = widthDuration;
                            }
                            else {
                                circle2StartAnimDuration = widthDuration;
                            }

                            moveCircle(circleName);
                        }
                    } else if (direction[circleName] === 'right') {
                        animation = circle.animate({
                            left: anim.offsetWidth - 2 * circleRadius - 10  + 'px'
                        }, {
                            duration: duration,
                            iterations: 1,
                            fill: "forwards"
                        });

                        animation.onfinish = () => {
                            direction[circleName] = 'left';
                            speed += 20;

                            setWidthDuration();

                            if (circleName === 'yellowCircle') {
                                circle1StartAnimDuration = widthDuration;
                            }
                            else {
                                circle2StartAnimDuration = widthDuration;
                            }

                            moveCircle(circleName);
                        }
                    } else if (direction[circleName] === 'up') {
                        animation = circle.animate({
                            top: 0
                        }, {
                            duration: duration,
                            iterations: 1,
                            fill: "forwards"
                        });

                        animation.onfinish = () => {
                            direction[circleName] = 'down';
                            speed += 20;

                            setHeightDuration();

                            if (circleName === 'yellowCircle') {
                                circle1StartAnimDuration = heightDuration;
                            }
                            else {
                                circle2StartAnimDuration = heightDuration;
                            }

                            moveCircle(circleName);
                        }
                    } else {
                        animation = circle.animate({
                            top: anim.offsetHeight - 2 * circleRadius - 10 + 'px'
                        }, {
                            duration: duration,
                            iterations: 1,
                            fill: "forwards"
                        });

                        animation.onfinish = () => {
                            direction[circleName] = 'up';
                            speed += 20;

                            setHeightDuration()

                            if (circleName === 'yellowCircle') {
                                circle1StartAnimDuration = heightDuration;
                            }
                            else {
                                circle2StartAnimDuration = heightDuration;
                            }

                            moveCircle(circleName);
                        }
                    }

                    return animation;
                }

                function setHeightDuration() {
                    heightDuration = anim.offsetHeight * 1000 / speed;
                }

                function setWidthDuration() {
                    widthDuration = anim.offsetWidth * 1000 / speed;
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