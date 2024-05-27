import './userProfilePage.scss';

import Bootstrap from '../../elements/bootstrap/Bootstrap';
import userPhotoSrc from './../../img/placeholderUser.png';
import requestsAPI from '../../elements/requestsAPI';
import { countriesList, isNull } from '../../utils/utils';

function userProfilePage(): HTMLElement {
  const main = Bootstrap.createElement('main', 'user-profile-main d-flex flex-column');
  const userProfileHeader = Bootstrap.createElement('div', 'user-profile-main__header d-flex');
  const userImg = Bootstrap.createElement('img', 'user-profile-header__img rounded-circle');
  userImg.src = userPhotoSrc as string;
  const userProfileHeaderInfo = Bootstrap.createElement('div', 'user-profile-header__info d-flex flex-column');
  const userFullname = Bootstrap.createElement(
    'h2',
    'user-profile-header__fullname',
    `${requestsAPI.customerData.firstName} ${requestsAPI.customerData.lastName}`,
  );
  const userEmail = Bootstrap.createElement(
    'p',
    'user-profile-header__email',
    localStorage.getItem('customerEmail') as string,
  );

  const userProfileForm = Bootstrap.createElement('form', 'user-profile-form d-flex flex-column');
  userProfileForm.setAttribute('novalidate', '');
  const personalInfoBox = createPersonalInfoBox();
  const addressesInfoBox = Bootstrap.createElement('div', 'user-profile-form__addresses-info d-flex flex-column');
  const addressesInfoBoxTitle = Bootstrap.createElement(
    'h4',
    'user-profile-form__addresses-info-title fw-bold',
    'Addresses',
  );

  main.append(userProfileHeader, userProfileForm);
  userProfileHeader.append(userImg, userProfileHeaderInfo);
  userProfileHeaderInfo.append(userFullname, userEmail);
  userProfileForm.append(personalInfoBox, addressesInfoBox);
  addressesInfoBox.append(addressesInfoBoxTitle);

  const shippingAddresses = requestsAPI.getCustomerAddresses().shippingAddresses;
  const shippingAddressesNum = shippingAddresses ? shippingAddresses.length : 1;
  for (let i = 0; i < shippingAddressesNum; i += 1) {
    const shippingAddressBox = createShippingAddressBlock(i);
    addressesInfoBox.append(shippingAddressBox);
  }

  const billingAddresses = requestsAPI.getCustomerAddresses().billingAddresses;
  const billingAddressesNum = billingAddresses ? billingAddresses.length : 1;
  for (let i = 0; i < billingAddressesNum; i += 1) {
    const billingAddressBox = createBillingAddressBlock(i);
    addressesInfoBox.append(billingAddressBox);
  }

  const saveChangesBtn = Bootstrap.createButton(
    'Save changes',
    'btn btn-orange border-0 btn-style-default save-changes-btn disabled',
  );
  saveChangesBtn.addEventListener('click', (e) => {
    e.preventDefault();
  });

  userProfileForm.append(saveChangesBtn);

  //Check if a user changed the value of any input and let him save those changes
  const inputs = Array.from(userProfileForm.querySelectorAll('.user-profile-form__input')) as HTMLInputElement[];

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      isInputChanged(input, inputs);
    });
  });

  return main;
}

function createPersonalInfoBox(): HTMLElement {
  const personalInfoBox = Bootstrap.createElement('div', 'user-profile-form__personal-info d-flex flex-column');
  const personalInfoBoxTitle = Bootstrap.createElement(
    'h4',
    'user-profile-form__personal-info-title fw-bold',
    'Personal information',
  );

  const inputsContainer = Bootstrap.createElement('div', 'personal-info__inputs-container d-grid');

  const nameLabel = createInputAndLabelElem('Name', 'text');
  const nameInput = nameLabel.querySelector('input');
  isNull<HTMLInputElement>(nameInput);
  nameInput.value = requestsAPI.customerData.firstName;
  nameInput.dataset.initialValue = requestsAPI.customerData.firstName;

  const lastnameLabel = createInputAndLabelElem('Lastname', 'text');
  const lastNameInput = lastnameLabel.querySelector('input');
  isNull<HTMLInputElement>(lastNameInput);
  lastNameInput.value = requestsAPI.customerData.lastName;
  lastNameInput.dataset.initialValue = requestsAPI.customerData.lastName;

  const dateOfBirthLabel = createInputAndLabelElem('Date of birth', 'date');
  const dateOfBirthInput = dateOfBirthLabel.querySelector('input');
  isNull<HTMLInputElement>(dateOfBirthInput);
  dateOfBirthInput.value = requestsAPI.customerData.dateOfBirth;
  dateOfBirthInput.dataset.initialValue = requestsAPI.customerData.dateOfBirth;

  inputsContainer.append(nameLabel, lastnameLabel, dateOfBirthLabel);

  personalInfoBox.append(personalInfoBoxTitle, inputsContainer);

  return personalInfoBox;
}

function createShippingAddressBlock(addressIndex: number): HTMLElement {
  const shippingAddresses = requestsAPI.getCustomerAddresses().shippingAddresses;
  const shippingAddressObj = shippingAddresses !== null ? shippingAddresses[addressIndex] : null;
  let isDefShippingAddress: boolean = false;

  if (shippingAddressObj) {
    isDefShippingAddress = isDefaultAddress('shipping', shippingAddressObj.id);
  }

  const shippingAddressBox = Bootstrap.createElement(
    'div',
    'user-profile-form__shipping-address-box d-flex flex-column',
  );

  const shippingAddressBoxTitle = Bootstrap.createElement('h4', 'shipping-address-box__title fw-bold');

  if (isDefShippingAddress) {
    shippingAddressBoxTitle.textContent = 'Default shipping address';
    shippingAddressBox.classList.add('default-shipping-address-box');
  } else {
    shippingAddressBoxTitle.textContent = 'Shipping address';
  }
  const inputsContainer = Bootstrap.createElement('div', 'personal-info__inputs-container d-grid');

  const countryLabel = createInputAndLabelElem('Country', 'text');
  const countryInput = countryLabel.querySelector('input');
  isNull<HTMLInputElement>(countryInput);

  const cityLabel = createInputAndLabelElem('City', 'text');
  const cityInput = cityLabel.querySelector('input');
  isNull<HTMLInputElement>(cityInput);

  const streetLabel = createInputAndLabelElem('Street', 'text');
  const streetInput = streetLabel.querySelector('input');
  isNull<HTMLInputElement>(streetInput);

  const zipcodeLabel = createInputAndLabelElem('Zip code', 'text');
  const zipcodeInput = zipcodeLabel.querySelector('input');
  isNull<HTMLInputElement>(zipcodeInput);

  countryInput.value = shippingAddressObj ? countriesList[shippingAddressObj.country] : '';
  countryInput.dataset.initialValue = shippingAddressObj ? countriesList[shippingAddressObj.country] : '';
  cityInput.value = shippingAddressObj ? shippingAddressObj.city : '';
  cityInput.dataset.initialValue = shippingAddressObj ? shippingAddressObj.city : '';
  streetInput.value = shippingAddressObj ? shippingAddressObj.streetName : '';
  streetInput.dataset.initialValue = shippingAddressObj ? shippingAddressObj.streetName : '';
  zipcodeInput.value = shippingAddressObj ? shippingAddressObj.postalCode : '';
  zipcodeInput.dataset.initialValue = shippingAddressObj ? shippingAddressObj.postalCode : '';

  inputsContainer.append(countryLabel, cityLabel, streetLabel, zipcodeLabel);
  shippingAddressBox.append(shippingAddressBoxTitle, inputsContainer);

  return shippingAddressBox;
}

function createBillingAddressBlock(addressIndex: number): HTMLElement {
  const billingAddresses = requestsAPI.getCustomerAddresses().billingAddresses;
  const billingAddressObj = billingAddresses !== null ? billingAddresses[addressIndex] : null;

  let isDefBillingAddress: boolean = false;
  if (billingAddressObj) {
    isDefBillingAddress = isDefaultAddress('billing', billingAddressObj.id);
  }

  const billingAddressBox = Bootstrap.createElement('div', 'user-profile-form__billing-address-box d-flex flex-column');
  const billingAddressBoxTitle = Bootstrap.createElement('h4', 'billing-address-box__title fw-bold');

  if (isDefBillingAddress) {
    billingAddressBoxTitle.textContent = 'Default billing address';
    billingAddressBox.classList.add('default-billing-address-box');
  } else {
    billingAddressBoxTitle.textContent = 'Billing address';
  }
  const inputsContainer = Bootstrap.createElement('div', 'personal-info__inputs-container d-grid');

  const countryLabel = createInputAndLabelElem('Country', 'text');
  const countryInput = countryLabel.querySelector('input');
  isNull<HTMLInputElement>(countryInput);

  const cityLabel = createInputAndLabelElem('City', 'text');
  const cityInput = cityLabel.querySelector('input');
  isNull<HTMLInputElement>(cityInput);

  const streetLabel = createInputAndLabelElem('Street', 'text');
  const streetInput = streetLabel.querySelector('input');
  isNull<HTMLInputElement>(streetInput);

  const zipcodeLabel = createInputAndLabelElem('Zip code', 'text');
  const zipcodeInput = zipcodeLabel.querySelector('input');
  isNull<HTMLInputElement>(zipcodeInput);

  countryInput.value = billingAddressObj ? countriesList[billingAddressObj.country] : '';
  countryInput.dataset.initialValue = billingAddressObj ? countriesList[billingAddressObj.country] : '';
  cityInput.value = billingAddressObj ? billingAddressObj.city : '';
  cityInput.dataset.initialValue = billingAddressObj ? billingAddressObj.city : '';
  streetInput.value = billingAddressObj ? billingAddressObj.streetName : '';
  streetInput.dataset.initialValue = billingAddressObj ? billingAddressObj.streetName : '';
  zipcodeInput.value = billingAddressObj ? billingAddressObj.postalCode : '';
  zipcodeInput.dataset.initialValue = billingAddressObj ? billingAddressObj.postalCode : '';

  inputsContainer.append(countryLabel, cityLabel, streetLabel, zipcodeLabel);
  billingAddressBox.append(billingAddressBoxTitle, inputsContainer);

  return billingAddressBox;
}

function createInputAndLabelElem(labelText: string, inputType: string) {
  const label = Bootstrap.createElement('label', 'user-profile-form__label form-label d-flex flex-column', labelText);

  const input = Bootstrap.createElement('input', 'user-profile-form__input form-control');
  input.setAttribute('type', inputType);
  if (labelText === 'Country') {
    input.setAttribute('list', 'countriesList');
    const datalist = Bootstrap.createElement('datalist', 'countries-list');
    datalist.id = 'countriesList';
    Object.keys(countriesList).forEach((key: string) => {
      const option = Bootstrap.createElement('option', 'country-option');
      option.value = countriesList[key];
      datalist.appendChild(option);
    });

    label.append(input, datalist);
    return label;
  }

  label.appendChild(input);

  return label;
}

function isInputChanged(input: HTMLInputElement, inputs: HTMLInputElement[]) {
  const saveChangesBtn = document.querySelector('.save-changes-btn');
  isNull<HTMLButtonElement>(saveChangesBtn);
  const isChanged = inputs.some((inputElem) => {
    isNull<HTMLInputElement>(inputElem);
    return inputElem.value !== inputElem.dataset.initialValue;
  });

  if (isChanged) {
    saveChangesBtn.removeAttribute('disabled');
    saveChangesBtn.classList.remove('disabled');
  } else {
    saveChangesBtn.setAttribute('disabled', '');
    saveChangesBtn.classList.add('disabled');
  }
}

function isDefaultAddress(addressType: 'shipping' | 'billing', shippingAddressId: string): boolean {
  if (addressType === 'shipping') {
    const defaultShippingAddress = requestsAPI.getCustomerAddresses().defShippingAddress;
    if (!defaultShippingAddress) {
      return false;
    } else {
      const defaultShippingAddressId = defaultShippingAddress.id;
      return defaultShippingAddressId === shippingAddressId;
    }
  }

  const defaultBillingAddress = requestsAPI.getCustomerAddresses().defBillingAddress;
  if (!defaultBillingAddress) {
    return false;
  } else {
    const defaultBillingAddressId = defaultBillingAddress.id;
    return defaultBillingAddressId === shippingAddressId;
  }
}

export { userProfilePage };
