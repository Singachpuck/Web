window.onload = () => {
    const firstBlock = document.querySelector('aside'),
        secondBlock = document.querySelector('.header-section > .small-paragraph'),
        thirdBlock = document.querySelector('.main-section > p'),
        splitButton = document.querySelector('#split-button'),
        firstCheckbox = document.querySelector('#rightAlignFirst'),
        secondCheckbox = document.querySelector('#rightAlignSecond'),
        hoverBlock = document.querySelector('.hover-block'),
        list = document.querySelector('#list'),
        addItemButton = document.querySelector('#addItemButton'),
        saveItemsToLocalStorageButton = document.querySelector('#saveItemsToLocalStorage'),
        clearLocalStorageButton = document.querySelector('#clearLocalStorage'),
        addObjectButton = document.querySelector(".add-object-button"),
        objectInput = document.querySelector(".object-input"),
        objectList = document.querySelector(".object-list"),
        objectDirectionParameter = document.querySelectorAll("input[name=objects-order]"),
        objectFontParameter = document.querySelector(".object-font");

    const getObjectsUrl = 'http://localhost:8080/object',
        saveObjectUrl = 'http://localhost:8080/object/save',
        removeObjectUrl = 'http://localhost:8080/object/{id}',
        setSettingsUrl = 'http://localhost:8080/settings';

    const a = 2, b = 4;

    init();

    swapText(firstBlock, secondBlock);

    thirdBlock.innerHTML += ellipsisSquare(a, b).toFixed(3);

    splitButton.addEventListener('click', () => {
        const number = parseInt(document.querySelector('#split-number-input').value),
            dividers = splitNumber(number);
        
        document.cookie = `splitNumber=${dividers.toString()};`;

        alert(dividers);
    });

    function init() {
        const calculatorBlock = document.querySelector('.divider-calculator'),
            items = localStorage.getItem('items'),
            alignment = localStorage.getItem('align'),
            alignmentBlocks = [firstBlock, secondBlock];

        list.innerHTML = '';

        items && items.split(';').forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            list.appendChild(li);
        });

        alignment && alignment.split(';').forEach((al, index) => {
            alignmentBlocks[index].style.textAlign = al;
        });

        if (document.cookie !== '') {
            calculatorBlock.setAttribute('style', 'display: none;');

            if (confirm(`Cookie data:\n${document.cookie}\nDo you want to remove them?`)) {
                deleteAllCookies();
                location.reload();
            } else {
                alert('Cookies are used on this page!\nReload page to change that.');
            }
        } else {
            calculatorBlock.removeAttribute('style');
        }

        fetch(getObjectsUrl)
            .then(response => response.json())
            .then(data => {
                data.forEach(object => {
                    objectList.appendChild(createObject(object.id, object.value, object.font));
                });
            });

        hoverBlock.addEventListener('mouseover', () => {
            let localStorageQuery = '';

            if (firstCheckbox.checked) {
                firstBlock.style.textAlign = 'right';
                localStorageQuery += 'right;';
            } else {
                firstBlock.style.textAlign = 'unset';
                localStorageQuery += 'unset;';
            }

            if (secondCheckbox.checked) {
                secondBlock.style.textAlign = 'right';
                localStorageQuery += 'right';
            } else {
                secondBlock.style.textAlign = 'unset';
                localStorageQuery += 'unset';
            }

            localStorage.setItem('align', localStorageQuery);
        });

        addItemButton.addEventListener('click', () => {
            const item = document.createElement('li');

            item.textContent = 'Item ' + (list.children.length + 1);

            list.appendChild(item);
        });

        saveItemsToLocalStorageButton.addEventListener('click', () => {
            let items = '';

            [...list.children].forEach(child => {
                items += child.textContent + ';';
            });

            items = items.substr(0, items.length - 1);

            localStorage.setItem('items', items);
        });

        clearLocalStorageButton.addEventListener('click', () => {
            localStorage.removeItem('items');
            location.reload();
        });

        addObjectButton.addEventListener("click", () => {
            const object = {
                value: objectInput.value,
                font: objectFontParameter.value
            };

            fetch(saveObjectUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(object)
            })
                .then(response => response.json())
                .then(data => {
                    objectList.appendChild(createObject(data.id, data.value, data.font));
                })
                .catch(reason => console.error(reason));
        });

        objectDirectionParameter.forEach(radio => {
            if (radio.value === 'row' && radio.checked) {
                objectList.style.display = 'flex';
            }

            radio.addEventListener('change', e => {
                let settings = [{
                    name: 'direction',
                }];

                if (e.currentTarget.value === 'row') {
                    objectList.style.display = 'flex';
                } else {
                    objectList.removeAttribute('style');
                }

                settings[0].value = e.currentTarget.value;

                fetch(setSettingsUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(settings)
                }).catch(reason => console.error(reason));
            })
        });

        objectList.addEventListener('click', e => {
            const objectNode = e.target;

            if (objectNode.classList.contains('glitch')) {
                fetch(removeObjectUrl.replace('{id}', objectNode.dataset.id), {
                    method: 'DELETE'
                })
                    .then(() => {
                        objectList.removeChild(objectNode.parentNode);
                    })
                    .catch(reason => console.log(reason));
            }
        })
    }

    function swapText(el1, el2) {
        let tmp = el1.innerHTML;
        el1.innerHTML = el2.innerHTML;
        el2.innerHTML = tmp;
    }

    function ellipsisSquare(a, b) {
        return Math.PI * a * b;
    }

    function splitNumber(number) {
        const dividers = [];

        for (let i = 2; i < number; i++) {
            if (number % i === 0) {
                dividers.push(i);
            }
        }

        return dividers;
    }

    function deleteAllCookies() {
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    function createObject(id, text, fontSize) {
        const listItem = document.createElement("li"),
            object = document.createElement("span");

        listItem.classList.add("object");
        object.classList.add("hero", "glitch", "layers");
        object.dataset.id = id
        object.dataset.text = text;
        object.innerText = text;
        object.style.fontSize = fontSize + 'px';

        listItem.appendChild(object);
        return listItem;
    }
}