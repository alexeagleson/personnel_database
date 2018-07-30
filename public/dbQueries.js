const rootUrl = 'http://localhost:3000/';

async function fetchOneValue(id) {
    return fetch(`${rootUrl}find_person?id=${id}`, { method: 'GET' })
        .then((response) => {
            if (response.status !== 200) throw Error(`${response.status} ${response.statusText}`);
            return response.text();
        })
        .then((response) => JSON.parse(response))
        .catch(error => console.error(`Fetch Error =\n`, error));
};

async function fetchAllValues() {
    const displayTag = document.getElementById('sql-response')

    return fetch(`${rootUrl}sql`, { method: 'GET' })
        .then((response) => {
            if (response.status !== 200) throw Error(`${response.status} ${response.statusText}`);
            return response.text();
        })
        .then((response) => {
            const tableElement = document.getElementById('data-table-body');
            const responseObjectArray = JSON.parse(response);
            // Sort alphabetically
            responseObjectArray.sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase()) ? -1 : 1);
            while (tableElement.lastChild) tableElement.lastChild.remove();

            responseObjectArray.forEach((responseObject) => {
                tableElement.append(generateTableElement(responseObject));
            });
            resetUpdateFields();
        })
        .catch((error) => displayTag.innerHTML = error)
}

async function postNewValueAndRefresh(dataValue) {
    if (!validateSubmitData(dataValue)) return;
    await postNewValue(dataValue);
    await fetchAllValues();
    hideSubmitComponent();
};

async function updateValueAndRefresh(dataValue) {
    if (!validateSubmitData(dataValue)) return;
    await updateValue(dataValue);
    await fetchAllValues();
    hideSubmitComponent();
};

async function postNewValue(dataValue) {
    if (!validateSubmitData(dataValue)) return;

    return fetch(`${rootUrl}sql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(dataValue),
    })
        .then(response => response)
        .catch(error => console.error(`Fetch Error =\n`, error));
};

async function updateValue(dataValue) {
    if (!validateSubmitData(dataValue)) return;

    return fetch(`${rootUrl}sql`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(dataValue),
    })
        .then(response => response)
        .catch(error => console.error(`Fetch Error =\n`, error));
};

async function removeAllValues() {
    return fetch(`${rootUrl}sql`, { method: 'DELETE' })
        .then(response => {
            fetchAllValues();
            return response;
        })
        .catch(error => console.error(`Fetch Error =\n`, error));
};

async function removeOneValue(id) {
    return fetch(`${rootUrl}remove_person?id=${id}`, { method: 'DELETE' })
        .then((response) => {
            if (response.status !== 200) throw Error(`${response.status} ${response.statusText}`);
            return response.text();
        })
        .then(response => {
            fetchAllValues();
            return response;
        })
        .catch(error => console.error(`Fetch Error =\n`, error));
};

async function populateDummyData() {
    hideSubmitComponent();
    showDatabaseLoader()
    await removeAllValues();
    for (const dataValue of dummyData) {
        await postNewValue(dataValue);
    }
    await fetchAllValues();
    hideDatabaseLoader()
};