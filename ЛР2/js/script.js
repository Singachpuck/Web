window.onload = () => {
    let firstBlock = document.querySelector('aside'),
        secondBlock = document.querySelector('.header-section > .small-paragraph'),
        thirdBlock = document.querySelector('.main-section > p'),
        splitButton = document.querySelector('#split-button');

    const a = 2, b = 4;

    init();

    swapText(firstBlock, secondBlock);

    thirdBlock.innerHTML += ellipsisSquare(a, b).toFixed(3);

    splitButton.addEventListener('click', () => {
        const number = parseInt(document.querySelector('#split-number-input').value),
            dividers = splitNumber(number);
        
        document.cookie = `splitNumber=${dividers.toString()};`;

        console.log(document.cookie);

        alert(dividers);
    });

    function init() {
        const calculatorBlock = document.querySelector('.divider-calculator');

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
        var cookies = document.cookie.split(";");
    
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
}