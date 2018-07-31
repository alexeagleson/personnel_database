async function showUpdateFields(id) {
    const personObject = await fetchOneValue(id);
    showSubmitComponent();

    document.getElementById('person-id').value = personObject.id;
    document.getElementById('person-name').value = personObject.name;
    document.getElementById('person-age').value = personObject.age;
    document.getElementById('person-food').value = personObject.favourite_food;
    document.getElementById('person-button').value = 'Save Current Entry';
};

const resetUpdateFields = () => {
    document.getElementById('person-id').value = '';
    document.getElementById('person-name').value = '';
    document.getElementById('person-age').value = '';
    document.getElementById('person-food').value = '';
    document.getElementById('person-button').value = 'Submit New Entry';
};

const validateSubmitData = (dataValue) => {
    let checkData = { valid: true };
    if (!(dataValue.id && dataValue.id.length === 36)) checkData = { valid: false, error: 'ID must be 36 characters long (valid UUID)' };
    if (!(dataValue.name && dataValue.name.length > 0)) checkData = { valid: false, error: 'Name must be longer than 0 characters' };
    if (!(dataValue.age && dataValue.age > 0 && dataValue.age < 200)) checkData = { valid: false, error: 'Age must be greater than 0 and less than 200' };
    if (!(dataValue.food && dataValue.food.length > 0)) checkData = { valid: false, error: 'Favourite food must be longer than 0 characters' };

    if (!checkData.valid) {
        document.getElementById('error-modal-text').innerHTML = checkData.error;
        $('#errorWarningModal').modal('show');
        return false;
    }
    return true;
};

const generateTableElement = (dataObject) => {
    const newTableRow = document.createElement('tr');

    const nameColumnData = document.createElement('td');
    nameColumnData.innerHTML = dataObject.name;
    newTableRow.append(nameColumnData);

    const ageColumnData = document.createElement('td');
    ageColumnData.innerHTML = dataObject.age;
    newTableRow.append(ageColumnData);

    const foodColumnData = document.createElement('td');
    foodColumnData.innerHTML = dataObject.favourite_food;
    newTableRow.append(foodColumnData);

    const editButtonColumn = document.createElement('td');
    const editButtonElement = document.createElement('button');
    editButtonElement.onclick = () => { showUpdateFields(dataObject.id); }
    editButtonElement.innerHTML = 'Edit';
    editButtonElement.className = 'btn btn-primary btn-sm';
    editButtonColumn.append(editButtonElement);
    newTableRow.append(editButtonColumn);

    const removeButtonColumn = document.createElement('td');
    const removeButtonElement = document.createElement('button');
    removeButtonElement.onclick = () => { removeOneValue(dataObject.id) }
    removeButtonElement.innerHTML = 'Remove';
    removeButtonElement.className = 'btn btn-secondary btn-sm';
    removeButtonColumn.append(removeButtonElement);
    newTableRow.append(removeButtonColumn);
    return newTableRow;
};

const hideSubmitComponent = () => {
    document.getElementById('new-database-entry').style.display = 'none';
};

const showSubmitComponent = () => {
    document.getElementById('new-database-entry').style.display = 'block';
};

const hideDatabaseLoader = () => {
    document.getElementById('database-loader').style.display = 'none';
};

const showDatabaseLoader = () => {
    document.getElementById('database-loader').style.display = 'block';
};

const addFormSubmitEventListener = () => {
    document.getElementById("new-database-entry").addEventListener("submit", function (event) {
        event.preventDefault()
      
        if (document.getElementById('person-id').value === '') {
          postNewValueAndRefresh({
            id: uuid(),
            name: document.getElementById('person-name').value,
            age: document.getElementById('person-age').value,
            food: document.getElementById('person-food').value,
          });
        } else {
          updateValueAndRefresh({
            id: document.getElementById('person-id').value,
            name: document.getElementById('person-name').value,
            age: document.getElementById('person-age').value,
            food: document.getElementById('person-food').value,
          });
        }
      });
};

addFormSubmitEventListener();
hideDatabaseLoader();
hideSubmitComponent();
fetchAllValues();