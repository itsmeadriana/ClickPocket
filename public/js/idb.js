const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webKitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

let deb;
const request = indexedDB.open('click_pocket', 1);

request.onupgradeneeded = function(e) {
    const db = e.target.result;
    db.createObjectStore('pending', { autoincrement: true })
};

request.onsuccess = function(e) {
    db = e.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(e) {
    console.log(e.target.errorCode);
};

function saveTransactionRecord(record) {
    const transaction =  db.transaction(['pending'], 'readwrite');
    const transactionObjectStore = transaction.objectStore('pending');
    transactionObjectStore.add(record);
}

function checkDatabase() {
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application'
                }
            })
            .then(response => {
                return response.json();
            })
            .then(()=> {
                const transaction = db.transaction(['pending'], readwrite);
                const store = transaction.objectStore('pending');
                store.clear();
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
}

window.addEventListener('online', checkDatabase);