document.addEventListener("DOMContentLoaded", function(event) { 
    const form = document.querySelector(".form");

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const input = document.querySelector(".input")
        const file = input.files[0];
        const data = new FormData();
        data.append('file', file);

        try {
            const resp = await fetch('http://localhost:3000/cnab', {
                method: 'POST',
                body: data
            })
            console.log(resp)
        } catch(err) {
            console.log(err)
        }

        setTimeout(async () => {
            const stores = await fetchStores();
            addStoreDivs(stores)
        }, 1500)

    })

});


const fetchStores = async () => {
    const stores = await fetch('http://localhost:3000/store');

    const byteArray = (await stores.body.getReader().read()).value;
    const string = new TextDecoder().decode(byteArray);

    return JSON.parse(string);

}

const fetchTransactions = async (storeId) => {

    const transactions = await fetch(`http://localhost:3000/transaction/${storeId}`);

    const byteArray = (await transactions.body.getReader().read()).value;
    const string = new TextDecoder().decode(byteArray);

    return JSON.parse(string);
}

const showTransactions = async (storeId) => {
    const transactions = await fetchTransactions(storeId);

    const transactionsWrapper = document.createElement("div");
    transactionsWrapper.classList.add("transactions");

    const closeDiv = document.createElement("div");
    closeDiv.innerHTML = "X"
    closeDiv.classList.add("close");

    closeDiv.addEventListener('click', e => {
        transactionsWrapper.remove();
    })

    transactionsWrapper.appendChild(closeDiv);
    const transactionsElements = transactions.map(createTransactionElement);

    for(let i = 0; i < transactionsElements.length; i++) {
        transactionsWrapper.appendChild(transactionsElements[i]);
    }

    const wrapper = document.querySelector(".wrapper");

    wrapper.appendChild(transactionsWrapper);
}

const addStoreDivs = (stores) => {
    const storeWrapper = document.querySelector(".stores-wrapper");
    removeAllChildren(storeWrapper);

    const children = stores.map(createStoreElement)

    for(let i = 0; i < children.length; i++) {
        storeWrapper.appendChild(children[i])
    }

    return storeWrapper;
}

const createStoreElement = (store) => {

    const newStore = document.createElement("div");
    newStore.classList.add("store");
    const name = document.createElement("span")
    name.innerHTML = store.name
    const balance = document.createElement("span")
    balance.innerHTML = parseFloat(store.balance).toFixed(2);

    newStore.appendChild(name);
    newStore.appendChild(balance);

    newStore.addEventListener('click', e => {
        showTransactions(store.id);
    })

    return newStore;
}

const createTransactionElement = (transaction) => {
    const newTransaction = document.createElement("div")
    newTransaction.classList.add("transaction")
    const value = document.createElement("span")
    const negativeTransactions = [2, 3, 9];
    if(negativeTransactions.includes(transaction.type))
        transaction.value = -transaction.value
    value.innerHTML = parseFloat(transaction.value).toFixed(2);
    const cpf = document.createElement("span")
    cpf.innerHTML = transaction.creditCard

    newTransaction.appendChild(cpf)
    newTransaction.appendChild(value)

    return newTransaction;
}

const removeAllChildren = (node) => {
    while(node.firstChild)
        node.removeChild(node.firstChild)
}
