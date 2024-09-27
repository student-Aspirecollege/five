const BASE_URL = 'https://api.exchangerate-api.com/v4/latest/'; // Example API endpoint

// Example countryList (fill this with actual data)


let dropdowns = document.querySelectorAll('.dropdown select');
let btn = document.querySelector('button');
let fromCurr = document.querySelector("select[name='from']");
let toCurr = document.querySelector("select[name='to']");
let results = document.querySelector('.result');

// Populate dropdowns with currency options
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement('option');
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === 'from' && currCode === 'USD') {
            newOption.selected = true;
        } else if (select.name === 'to' && currCode === 'PKR') {
            newOption.selected = true;
        }
        select.append(newOption);
    }
    select.addEventListener('change', (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let img = element.parentElement.querySelector('img');
    if (countryCode && img) {
        let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
        img.src = newSrc;
    } else {
        console.error('Invalid country code or flag image element not found');
    }
};

btn.addEventListener('click', async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector('.amount input');
    let amtVal = parseFloat(amount.value);
    
    if (isNaN(amtVal) || amtVal <= 0) {
        amtVal = 1;
        amount.value = '1';
    }
    
    let fromCurrency = fromCurr.value;
    let toCurrency = toCurr.value;
    let url = `${BASE_URL}${fromCurrency}`;

    try {
        let res = await fetch(url);
                
        // Check if the response was successful
        if (res.ok) {
            let data = await res.json();
            
            // Check if the data contains rates for the target currency
            if (data && data.rates && data.rates[toCurrency]) {
                let rate = data.rates[toCurrency];
                let finalValue = rate * amtVal;
                results.innerHTML = `${amtVal} ${fromCurrency} = ${finalValue.toFixed(2)} ${toCurrency}`;
            } else {
                results.innerHTML = 'Error: Unable to retrieve conversion rate.';
            }
        } else {
            // Handle different types of errors
            results.innerHTML = `Error: Network response was not ok. Status: ${res.status}`;
        }
    } catch (error) {
        // Catch and display any errors during fetch
        console.error('Fetch error:', error);
        results.innerHTML = `Error: ${error.message}`;
    }
});

// Initial flag update
updateFlag(fromCurr);
updateFlag(toCurr);
