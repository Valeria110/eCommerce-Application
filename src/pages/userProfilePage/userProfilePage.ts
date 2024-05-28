import './userProfilePage.scss';
import * as validationRegPage from '../registration-page/validationInputsShippingAndBillingAddressForms';
import * as personalInfoValidation from '../registration-page/validationInputsRegistrationForm';
import { AppEvents, IAddressObj } from '../../elements/types';
import pencilIcon from '../../img/pencil-icon.svg';

import Bootstrap from '../../elements/bootstrap/Bootstrap';
import userPhotoSrc from './../../img/placeholderUser.png';
import requestsAPI from '../../elements/requestsAPI';
import { countriesList, isNull } from '../../utils/utils';
import eyeOffIcon from '../../img/eye-off-icon.svg';
import { showOrHidePassword } from '../../elements/loginValidation';

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

  document.body.addEventListener(AppEvents.updateUserName, () => {
    userFullname.textContent = `${requestsAPI.customerData.firstName} ${requestsAPI.customerData.lastName}`;
    userEmail.textContent = `${requestsAPI.customerData.email}`;
  });

  const userProfileForm = Bootstrap.createElement('form', 'user-profile-form d-flex flex-column readonly-mode');
  userProfileForm.setAttribute('novalidate', '');
  const personalInfoBox = createPersonalInfoBox();
  const addressesInfoBox = Bootstrap.createElement('div', 'user-profile-form__addresses-info d-flex flex-column');
  const addressesInfoBoxTitle = Bootstrap.createElement(
    'h4',
    'user-profile-form__addresses-info-title fw-bold',
    'Addresses',
  );
  const editBtn = Bootstrap.createElement('button', 'btn edit-btn d-flex justify-content-center');
  const pencilImg = Bootstrap.createElement('img', 'user-profile-form__pencil-img');
  pencilImg.src = pencilIcon as string;
  const editBtnText = Bootstrap.createElement('span', 'edit-btn__text', 'edit');
  editBtn.append(pencilImg, editBtnText);
  editBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMode(editBtn, editBtnText);
  });

  userProfileForm.appendChild(editBtn);
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
    'btn btn-orange border-0 btn-style-default save-changes-btn disabled d-none',
  );
  saveChangesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMode(editBtn, editBtnText);
  });

  userProfileForm.append(saveChangesBtn);

  //Check if a user changed the value of any input and let him save those changes
  const inputs = Array.from(userProfileForm.querySelectorAll('.user-profile-form__input')) as HTMLInputElement[];

  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      isInputChanged(input, inputs);
      if (isFormValid()) {
        saveChangesBtn.classList.remove('disabled');
      } else {
        saveChangesBtn.classList.add('disabled');
      }
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

  const emailLabel = createInputAndLabelElem('Email', 'email');
  const emailInput = emailLabel.querySelector('input');
  isNull<HTMLInputElement>(emailInput);
  emailInput.value = requestsAPI.customerData.email;
  emailInput.dataset.initialValue = requestsAPI.customerData.email;

  const passwordLabel = createInputAndLabelElem('Password', 'password');
  const passwordInput = passwordLabel.querySelector('input');
  isNull<HTMLInputElement>(passwordInput);
  passwordInput.value = requestsAPI.customerData.password;
  passwordInput.dataset.initialValue = requestsAPI.customerData.password;
  const showPasswordBtn = Bootstrap.createElement('img', 'show-password-btn user-profile-form__show-password-btn');
  showPasswordBtn.src = eyeOffIcon as string;
  showPasswordBtn.addEventListener('click', showOrHidePassword);
  passwordLabel.appendChild(showPasswordBtn);

  document.body.addEventListener(AppEvents.updateUserName, () => {
    nameInput.value = `${requestsAPI.customerData.firstName}`;
    lastNameInput.value = `${requestsAPI.customerData.lastName}`;
    emailInput.value = `${requestsAPI.customerData.email}`;
    dateOfBirthInput.value = `${requestsAPI.customerData.dateOfBirth}`;
    passwordInput.value = `${requestsAPI.customerData.password}`;
  });

  inputsContainer.append(nameLabel, lastnameLabel, dateOfBirthLabel, emailLabel, passwordLabel);

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
  const inputsContainer = Bootstrap.createElement('div', 'addresses-info__inputs-container d-grid');

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

  const updateAddress = (addressesObj: IAddressObj | null) => {
    countryInput.value = addressesObj ? countriesList[addressesObj.country] : '';
    countryInput.dataset.initialValue = addressesObj ? countriesList[addressesObj.country] : '';
    cityInput.value = addressesObj ? addressesObj.city : '';
    cityInput.dataset.initialValue = addressesObj ? addressesObj.city : '';
    streetInput.value = addressesObj ? addressesObj.streetName : '';
    streetInput.dataset.initialValue = addressesObj ? addressesObj.streetName : '';
    zipcodeInput.value = addressesObj ? addressesObj.postalCode : '';
    zipcodeInput.dataset.initialValue = addressesObj ? addressesObj.postalCode : '';
  };

  updateAddress(shippingAddressObj);
  document.body.addEventListener(AppEvents.updateUserName, () => {
    const shippingAddresses2 = requestsAPI.getCustomerAddresses().shippingAddresses;
    if (shippingAddresses2) {
      updateAddress(shippingAddresses2[addressIndex]);
    }
  });

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
  const inputsContainer = Bootstrap.createElement('div', 'addresses-info__inputs-container d-grid');

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

  const updateAddress = (addressObj: IAddressObj | null) => {
    countryInput.value = addressObj ? countriesList[addressObj.country] : '';
    countryInput.dataset.initialValue = addressObj ? countriesList[addressObj.country] : '';
    cityInput.value = addressObj ? addressObj.city : '';
    cityInput.dataset.initialValue = addressObj ? addressObj.city : '';
    streetInput.value = addressObj ? addressObj.streetName : '';
    streetInput.dataset.initialValue = addressObj ? addressObj.streetName : '';
    zipcodeInput.value = addressObj ? addressObj.postalCode : '';
    zipcodeInput.dataset.initialValue = addressObj ? addressObj.postalCode : '';
  };
  updateAddress(billingAddressObj);

  document.body.addEventListener(AppEvents.updateUserName, () => {
    const billingAddresses2 = requestsAPI.getCustomerAddresses().shippingAddresses;
    if (billingAddresses2) {
      updateAddress(billingAddresses2[addressIndex]);
    }
  });
  inputsContainer.append(countryLabel, cityLabel, streetLabel, zipcodeLabel);
  billingAddressBox.append(billingAddressBoxTitle, inputsContainer);

  return billingAddressBox;
}

function createInputAndLabelElem(labelText: string, inputType: string) {
  const label = Bootstrap.createElement('label', 'user-profile-form__label form-label d-flex flex-column', labelText);
  const input = Bootstrap.createElement('input', 'user-profile-form__input form-control');
  input.setAttribute('type', inputType);
  input.setAttribute('readonly', '');

  if (labelText === 'Country') {
    input.setAttribute('list', 'countriesList');
    input.classList.add('country-input');
    const datalist = Bootstrap.createElement('datalist', 'countries-list');
    datalist.id = 'countriesList';

    Object.keys(countriesList).forEach((key: string) => {
      const option = Bootstrap.createElement('option', 'country-option');
      option.value = countriesList[key];
      datalist.appendChild(option);
    });

    const error = Bootstrap.createElement('div', 'error text-danger');
    label.append(input, error, datalist);
    addInputEventListener(labelText, input);

    return label;
  }

  if (labelText === 'Password') {
    input.classList.add('password-input');
  }

  const error = Bootstrap.createElement('div', 'error text-danger');

  label.append(input, error);
  addInputEventListener(labelText, input);

  return label;
}

function addInputEventListener(labelText: string, input: HTMLInputElement) {
  const error = input.nextElementSibling;
  isNull<HTMLDivElement>(error);

  switch (labelText) {
    case 'Country':
      input.addEventListener('input', () => {
        validationRegPage.validateInputCountry(input, error);
      });
      break;
    case 'City':
      input.addEventListener('input', () => {
        validationRegPage.validateInputCity(input, error);
      });
      break;
    case 'Zip code':
      input.addEventListener('input', () => {
        const addressBox = input.closest('.addresses-info__inputs-container');
        isNull<HTMLDivElement>(addressBox);
        const countryInput = addressBox.querySelector('.country-input');
        isNull<HTMLInputElement>(countryInput);
        validationRegPage.validateInputPostalCode(countryInput, input, error);
      });
      break;
    case 'Street':
      input.addEventListener('input', () => {
        validationRegPage.validateInputStreet(input, error);
      });
      break;
    case 'Name':
      input.addEventListener('input', () => {
        personalInfoValidation.validateInputFirstName(input, error);
      });
      break;
    case 'Lastname':
      input.addEventListener('input', () => {
        personalInfoValidation.validateInputLastName(input, error);
      });
      break;
    case 'Date of birth':
      input.addEventListener('input', () => {
        const inputContainer = input.closest('.user-profile-form__label');
        isNull<HTMLElement>(inputContainer);
        personalInfoValidation.validateBirthDate(input, error, inputContainer);
      });
      break;
    case 'Email':
      input.addEventListener('input', () => {
        personalInfoValidation.validateInputEmail(input, error);
      });
      break;
    case 'Password':
      input.addEventListener('input', () => {
        const inputContainer = input.closest('.user-profile-form__label');
        isNull<HTMLElement>(inputContainer);
        personalInfoValidation.validateInputPassword(input, error, inputContainer);
      });
      break;
  }
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

function toggleMode(editBtn: HTMLButtonElement, editBtnText: HTMLSpanElement) {
  const inputs = Array.from(document.querySelectorAll('.user-profile-form__input')) as HTMLInputElement[];
  const saveChangesBtn = document.querySelector('.save-changes-btn');
  isNull<HTMLButtonElement>(saveChangesBtn);

  inputs.forEach((input: HTMLInputElement | null) => {
    isNull<HTMLInputElement>(input);
    if (input.hasAttribute('readonly')) {
      input.removeAttribute('readonly');
      saveChangesBtn.classList.remove('d-none');
      editBtn.classList.add('read-form-btn');
      editBtnText.textContent = 'back';
    } else {
      input.setAttribute('readonly', '');
      saveChangesBtn.classList.add('d-none');
      editBtn.classList.remove('read-form-btn');
      editBtnText.textContent = 'edit';
    }
  });
}

function isFormValid() {
  const inputs = Array.from(document.querySelectorAll('.user-profile-form__input')) as HTMLInputElement[];
  const isValid = !inputs.some((input) => input.classList.contains('is-invalid'));
  return isValid;
}

export { userProfilePage };
