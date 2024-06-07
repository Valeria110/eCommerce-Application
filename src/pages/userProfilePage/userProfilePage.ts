import './userProfilePage.scss';
import { AppEvents, IAddressObj } from '../../elements/types';
import pencilIcon from '../../img/pencil-icon.svg';
import trashCanIcon from '../../img/trash-can-icon.svg';
import {
  resetFormValues,
  saveUpdatedData,
  addInputEventListener,
  isInputChanged,
  isFormValid,
  toggleMode,
  createNewAddress,
  passwordConfirmation,
  validateChangePasswordForm,
  deleteAddressInLocalStorage,
  checkCurrentPassword,
} from './userProfilePageFormActions';

import Bootstrap from '../../elements/bootstrap/Bootstrap';
import * as personalInfoValidation from '../registration-page/validationInputsRegistrationForm';
import userPhotoSrc from './../../img/placeholderUser.png';
import requestsAPI from '../../elements/requestsAPI';
import { countriesList, isNull } from '../../utils/utils';
import eyeOffIcon from '../../img/eye-off-icon.svg';
import { showOrHidePassword } from '../../elements/loginValidation';

function userProfilePage(): HTMLElement {
  const changePasswordModal = createChangePasswordModal();
  document.body.appendChild(changePasswordModal);

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

  const userProfileForm = Bootstrap.createElement('form', 'user-profile-form d-flex flex-column readonly-mode');
  userProfileForm.setAttribute('novalidate', '');
  userProfileForm.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });
  const personalInfoBox = createPersonalInfoBox();
  const addressesInfoBox = Bootstrap.createElement('div', 'user-profile-form__addresses-info d-flex flex-column');
  const addressesInfoBoxTitle = Bootstrap.createElement(
    'h4',
    'user-profile-form__addresses-info-title fw-bold',
    'Addresses',
  );
  const shippingAddressesBox = Bootstrap.createElement(
    'div',
    'user-profile-form__shipping-addresses d-flex flex-column',
  );
  const billingAddressesBox = Bootstrap.createElement('div', 'user-profile-form__billing-addresses d-flex flex-column');
  const passwordBox = createPasswordBox();
  main.append(userProfileHeader, userProfileForm);
  userProfileHeader.append(userImg, userProfileHeaderInfo);
  userProfileHeaderInfo.append(userFullname, userEmail);
  userProfileForm.append(personalInfoBox, passwordBox, addressesInfoBox);
  addressesInfoBox.append(addressesInfoBoxTitle);
  addressesInfoBox.append(shippingAddressesBox, billingAddressesBox);

  const createAddressBoxes = () => {
    userFullname.textContent = `${requestsAPI.customerData.firstName} ${requestsAPI.customerData.lastName}`;
    userEmail.textContent = `${requestsAPI.customerData.email}`;

    const shippingAddressesIds: string[] = localStorage.getItem('shippingAddressIds')
      ? JSON.parse(localStorage.getItem('shippingAddressIds') as string)
      : [];

    if (shippingAddressesIds.length) {
      shippingAddressesIds.forEach((shippingAddressId) => {
        shippingAddressesBox.append(createShippingAddressBlock(shippingAddressId));
      });
    }

    const addShippingAddressBtn = Bootstrap.createElement(
      'button',
      'btn btn-outline-primary, add-shipping-address-btn d-flex',
    );
    addShippingAddressBtn.innerHTML = `<span class="plus">+</span>
    <span class="add-shipping-address-btn-text">add shipping address</span>`;
    addShippingAddressBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const clickedBtn = e.currentTarget as HTMLButtonElement;
      createNewAddress(clickedBtn);
    });
    shippingAddressesBox.append(addShippingAddressBtn);

    const billingAddressesIds: string[] = localStorage.getItem('billingAddressIds')
      ? JSON.parse(localStorage.getItem('billingAddressIds') as string)
      : [];

    if (billingAddressesIds.length) {
      billingAddressesIds.forEach((billingAddressesId) => {
        billingAddressesBox.append(createBillingAddressBlock(billingAddressesId));
      });
    }

    const addBillingAddressBtn = Bootstrap.createElement(
      'button',
      'btn btn-outline-primary, add-billing-address-btn d-flex',
    );
    addBillingAddressBtn.innerHTML = `<span class="plus">+</span>
  <span class="add-billing-address-btn-text">add billing address</span>`;
    addBillingAddressBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const clickedBtn = e.currentTarget as HTMLButtonElement;
      createNewAddress(clickedBtn);
    });
    billingAddressesBox.append(addBillingAddressBtn);

    const saveChangesBtn = Bootstrap.createButton(
      'Save changes',
      'btn btn-orange border-0 btn-style-default save-changes-btn disabled d-none',
    );
    saveChangesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const forms = Array.from(document.querySelectorAll('.form-in-edit-mode')) as HTMLElement[];
      forms.forEach((form) => {
        const editBtn = form.querySelector('.edit-btn');
        const editBtnText = form.querySelector('.edit-btn__text');
        isNull<HTMLButtonElement>(editBtn);
        isNull<HTMLSpanElement>(editBtnText);

        saveUpdatedData(form);
        toggleMode(editBtn, editBtnText, form);
      });
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
  };

  createAddressBoxes();

  document.body.addEventListener(AppEvents.updateUserName, () => {
    shippingAddressesBox.innerHTML = '';
    billingAddressesBox.innerHTML = '';
    const saveChangesBtn = userProfileForm.querySelector('.save-changes-btn');
    saveChangesBtn?.remove();
    createAddressBoxes();
  });

  return main;
}

function createPersonalInfoBox(): HTMLElement {
  const personalInfoBox = Bootstrap.createElement(
    'div',
    'user-profile-form__personal-info user-profile__form d-flex flex-column',
  );
  const personalInfoBoxTitleWrapper = Bootstrap.createElement(
    'div',
    'user-profile-form__personal-info-title-wrapper d-flex justify-content-between align-items-center',
  );
  const personalInfoBoxTitle = Bootstrap.createElement(
    'h4',
    'user-profile-form__personal-info-title fw-bold',
    'Personal information',
  );
  const { editBtn, editBtnText } = createEditBtn();
  editBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMode(editBtn, editBtnText, personalInfoBox);
  });
  personalInfoBoxTitleWrapper.append(personalInfoBoxTitle, editBtn);

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

  document.body.addEventListener(AppEvents.updateUserName, () => {
    nameInput.value = `${requestsAPI.customerData.firstName}`;
    nameInput.dataset.initialValue = `${requestsAPI.customerData.firstName}`;
    lastNameInput.value = `${requestsAPI.customerData.lastName}`;
    lastNameInput.dataset.initialValue = `${requestsAPI.customerData.lastName}`;
    emailInput.value = `${requestsAPI.customerData.email}`;
    emailInput.dataset.initialValue = `${requestsAPI.customerData.email}`;
    dateOfBirthInput.value = `${requestsAPI.customerData.dateOfBirth}`;
    dateOfBirthInput.dataset.initialValue = `${requestsAPI.customerData.dateOfBirth}`;
  });

  inputsContainer.append(nameLabel, lastnameLabel, dateOfBirthLabel, emailLabel);

  personalInfoBox.append(personalInfoBoxTitleWrapper, inputsContainer);

  return personalInfoBox;
}

function createPasswordBox(): HTMLElement {
  const passwordInputWrapper = Bootstrap.createElement('div', 'user-profile-form__password-wrapper d-flex flex-column');
  const passwordLabel = createInputAndLabelElem('Password', 'password');
  const passwordInput = passwordLabel.querySelector('input');
  isNull<HTMLInputElement>(passwordInput);
  passwordInput.value = requestsAPI.customerData.password;
  passwordInput.dataset.initialValue = requestsAPI.customerData.password;
  const showPasswordBtn = Bootstrap.createElement('img', 'show-password-btn user-profile-form__show-password-btn');
  showPasswordBtn.src = eyeOffIcon as string;
  showPasswordBtn.addEventListener('click', showOrHidePassword);
  passwordLabel.appendChild(showPasswordBtn);
  const changePasswordLink = Bootstrap.createElement(
    'a',
    'change-password__link link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover',
    'Change password',
  );
  changePasswordLink.addEventListener('click', () => {
    const changePasswordModal = document.querySelector('.change-password-modal');
    isNull<HTMLDivElement>(changePasswordModal);
    changePasswordModal.classList.add('active');
  });
  passwordInputWrapper.append(passwordLabel, changePasswordLink);

  document.body.addEventListener(AppEvents.updateUserName, () => {
    if (requestsAPI.customerData.password === '') {
      requestsAPI.getCustomer().then((data) => (passwordInput.value = data ? data.password : ''));
    } else {
      passwordInput.value = `${requestsAPI.customerData.password}`;
    }
  });

  return passwordInputWrapper;
}

function createChangePasswordModal(): HTMLElement {
  const modal = Bootstrap.createElement('div', 'change-password-modal');
  const modalBox = Bootstrap.createElement('div', 'change-password-modal__box');
  const modalTitle = Bootstrap.createElement('h3', 'change-password-modal__title', 'Password reset');
  const changePasswordForm = Bootstrap.createElement('form', 'change-password-form d-flex flex-column');
  const inputsContainer = Bootstrap.createElement('div', 'change-password-form__inputs-container');
  const currentPasswordLabel = createInputAndLabelElem('Current password', 'text');
  const currentPasswordInput = currentPasswordLabel.querySelector('input');
  const newPasswordLabel = createInputAndLabelElem('New password', 'text');
  const confirmPasswordLabel = createInputAndLabelElem('Confirm new password', 'text');
  const newPasswordInput = newPasswordLabel.querySelector('input');
  const confirmPasswordInput = confirmPasswordLabel.querySelector('input');
  isNull<HTMLInputElement>(currentPasswordInput);
  isNull<HTMLInputElement>(newPasswordInput);
  isNull<HTMLInputElement>(confirmPasswordInput);
  newPasswordInput.removeAttribute('readonly');
  confirmPasswordInput.removeAttribute('readonly');
  currentPasswordInput.removeAttribute('readonly');

  const newPasswordError = newPasswordLabel.querySelector('.error');
  isNull<HTMLDivElement>(newPasswordError);

  newPasswordInput.addEventListener('input', () => {
    personalInfoValidation.validateInputPassword(newPasswordInput, newPasswordError, inputsContainer);
    validateChangePasswordForm(newPasswordInput, confirmPasswordInput, saveBtn);
  });

  confirmPasswordInput.addEventListener('input', () => {
    passwordConfirmation(newPasswordInput, confirmPasswordInput, confirmPasswordLabel);
    validateChangePasswordForm(newPasswordInput, confirmPasswordInput, saveBtn);
  });

  inputsContainer.append(currentPasswordLabel, newPasswordLabel, confirmPasswordLabel);
  const btnsWrapper = Bootstrap.createElement('div', 'change-password-form__btns-wrapper d-flex');
  const saveBtn = Bootstrap.createButton(
    'Save',
    'btn change-password-form__save-btn btn-orange border-0 btn-style-default disabled',
  );
  saveBtn.type = 'submit';
  const cancelBtn = Bootstrap.createButton(
    'Cancel',
    'btn change-password-form__cancel-btn btn-outline-secondary border-0 btn-style-default',
  );

  cancelBtn.addEventListener('click', () => modal.classList.remove('active'));

  changePasswordForm.addEventListener('submit', () => {
    checkCurrentPassword(currentPasswordInput, newPasswordInput, confirmPasswordInput, saveBtn);
  });

  saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    checkCurrentPassword(currentPasswordInput, newPasswordInput, confirmPasswordInput, saveBtn);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
  document.body.addEventListener(AppEvents.updateUserName, () => {
    currentPasswordInput.value = requestsAPI.customerData.password;
  });

  btnsWrapper.append(saveBtn, cancelBtn);
  changePasswordForm.append(inputsContainer, btnsWrapper);

  modal.appendChild(modalBox);
  modalBox.append(modalTitle, changePasswordForm);

  return modal;
}

function createShippingAddressBlock(shippingAddressId: string): HTMLElement {
  const shippingAddressObj = JSON.parse(localStorage.getItem('addresses') as string).find(
    (address: IAddressObj) => address.id === shippingAddressId,
  );

  let isDefShippingAddress: boolean = false;

  if (shippingAddressObj) {
    isDefShippingAddress = isDefaultAddress('shipping', shippingAddressObj.id);
  }

  const shippingAddressBox = Bootstrap.createElement(
    'div',
    'user-profile-form__shipping-address-box user-profile__form d-flex flex-column',
  );

  const shipAddressBoxTitleWrapper = Bootstrap.createElement('div', 'shipping-address-box__title-wrapper d-flex');
  const shippingAddressBoxTitle = Bootstrap.createElement(
    'h4',
    'shipping-address-box__title address-box__title fw-bold',
  );
  const { editBtn, editBtnText } = createEditBtn();
  editBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMode(editBtn, editBtnText, shippingAddressBox);
  });
  shipAddressBoxTitleWrapper.append(shippingAddressBoxTitle, editBtn);

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

  shippingAddressBox.dataset.addressId = shippingAddressObj ? shippingAddressObj.id : '';
  countryInput.value = shippingAddressObj ? countriesList[shippingAddressObj.country] : '';
  countryInput.dataset.initialValue = shippingAddressObj ? countriesList[shippingAddressObj.country] : '';
  cityInput.value = shippingAddressObj ? shippingAddressObj.city : '';
  cityInput.dataset.initialValue = shippingAddressObj ? shippingAddressObj.city : '';
  streetInput.value = shippingAddressObj ? shippingAddressObj.streetName : '';
  streetInput.dataset.initialValue = shippingAddressObj ? shippingAddressObj.streetName : '';
  zipcodeInput.value = shippingAddressObj ? shippingAddressObj.postalCode : '';
  zipcodeInput.dataset.initialValue = shippingAddressObj ? shippingAddressObj.postalCode : '';

  const addressBoxBottomPart = createAddressBoxBottomPart();
  inputsContainer.append(countryLabel, cityLabel, streetLabel, zipcodeLabel);
  shippingAddressBox.append(shipAddressBoxTitleWrapper, inputsContainer, addressBoxBottomPart);

  return shippingAddressBox;
}

function createBillingAddressBlock(billingAddressId: string): HTMLElement {
  const billingAddressObj = JSON.parse(localStorage.getItem('addresses') as string).find(
    (address: IAddressObj) => address.id === billingAddressId,
  );

  let isDefBillingAddress: boolean = false;
  if (billingAddressObj) {
    isDefBillingAddress = isDefaultAddress('billing', billingAddressObj.id);
  }

  const billingAddressBox = Bootstrap.createElement(
    'div',
    'user-profile-form__billing-address-box user-profile__form d-flex flex-column',
  );
  const billingAddressTitleWrapper = Bootstrap.createElement('div', 'billing-address-box__title-wrapper d-flex');
  const billingAddressBoxTitle = Bootstrap.createElement('h4', 'billing-address-box__title address-box__title fw-bold');
  const { editBtn, editBtnText } = createEditBtn();
  editBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMode(editBtn, editBtnText, billingAddressBox);
  });
  billingAddressTitleWrapper.append(billingAddressBoxTitle, editBtn);

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

  billingAddressBox.dataset.addressId = billingAddressObj ? billingAddressObj.id : '';
  countryInput.value = billingAddressObj ? countriesList[billingAddressObj.country] : '';
  countryInput.dataset.initialValue = billingAddressObj ? countriesList[billingAddressObj.country] : '';
  cityInput.value = billingAddressObj ? billingAddressObj.city : '';
  cityInput.dataset.initialValue = billingAddressObj ? billingAddressObj.city : '';
  streetInput.value = billingAddressObj ? billingAddressObj.streetName : '';
  streetInput.dataset.initialValue = billingAddressObj ? billingAddressObj.streetName : '';
  zipcodeInput.value = billingAddressObj ? billingAddressObj.postalCode : '';
  zipcodeInput.dataset.initialValue = billingAddressObj ? billingAddressObj.postalCode : '';

  const addressBoxBottomPart = createAddressBoxBottomPart();

  inputsContainer.append(countryLabel, cityLabel, streetLabel, zipcodeLabel);
  billingAddressBox.append(billingAddressTitleWrapper, inputsContainer, addressBoxBottomPart);

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
    label.classList.add('password-label');
  }
  if (labelText === 'City') {
    input.classList.add('city-input');
  }
  if (labelText === 'Street') {
    input.classList.add('street-input');
  }
  if (labelText === 'Zip code') {
    input.classList.add('zipcode-input');
  }

  const error = Bootstrap.createElement('div', 'error text-danger');

  label.append(input, error);
  addInputEventListener(labelText, input);

  return label;
}

function isDefaultAddress(addressType: 'shipping' | 'billing', addressId: string): boolean {
  if (addressType === 'shipping') {
    const defaultShippingAddressId = localStorage.getItem('defaultShippingAddressId')
      ? localStorage.getItem('defaultShippingAddressId' as string)
      : '';

    if (!defaultShippingAddressId) {
      return false;
    } else {
      return defaultShippingAddressId === addressId;
    }
  }

  const defaultBillingAddressId = localStorage.getItem('defaultBillingAddressId')
    ? localStorage.getItem('defaultBillingAddressId' as string)
    : '';
  if (!defaultBillingAddressId) {
    return false;
  } else {
    return defaultBillingAddressId === addressId;
  }
}

function createEditBtn(): { editBtn: HTMLButtonElement; editBtnText: HTMLSpanElement } {
  const editBtn = Bootstrap.createElement('button', 'btn edit-btn d-flex justify-content-center');
  const pencilImg = Bootstrap.createElement('img', 'user-profile-form__pencil-img');
  pencilImg.src = pencilIcon as string;
  const editBtnText = Bootstrap.createElement('span', 'edit-btn__text', 'edit');
  editBtn.append(pencilImg, editBtnText);

  editBtn.addEventListener('click', (e) => {
    const clickedEditBtn = e.currentTarget as HTMLButtonElement;
    if (clickedEditBtn.classList.contains('read-form-btn')) {
      resetFormValues(clickedEditBtn);
    }
  });
  return { editBtn, editBtnText };
}

function createAddressBoxBottomPart(): HTMLElement {
  const bottomPartContainer = Bootstrap.createElement('div', 'address-box__bottom-part d-flex justify-content-between');

  const addressBoxCheckboxContainer = Bootstrap.createElement(
    'div',
    'address-box__checkbox-container form-check d-none',
  );
  const checkboxInput = Bootstrap.createElement('input', 'form-check-input address-box__checkbox');
  checkboxInput.type = 'checkbox';
  const checkboxLabel = Bootstrap.createElement(
    'label',
    'form-check-label address-box__checkbox-label',
    'Use by default',
  );
  addressBoxCheckboxContainer.append(checkboxInput, checkboxLabel);

  const deleteBtn = Bootstrap.createElement(
    'button',
    'btn delete-btn d-flex align-items-center justify-content-between',
  );
  const trashCanImg = Bootstrap.createElement('img', 'delete-btn__img');
  trashCanImg.src = trashCanIcon as string;
  const deleteBtnText = Bootstrap.createElement('span', 'delete-btn__text', 'Delete');

  deleteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const clickedBtn = e.currentTarget as HTMLButtonElement;
    const deletedAddressBox = clickedBtn.closest('.user-profile__form ');
    isNull<HTMLDivElement>(deletedAddressBox);
    const addressId = deletedAddressBox.dataset.addressId;
    if (addressId) {
      requestsAPI.removeAddress(addressId);
      deleteAddressInLocalStorage(addressId, clickedBtn);
    }
    deletedAddressBox.remove();
  });

  deleteBtn.append(trashCanImg, deleteBtnText);

  bottomPartContainer.append(addressBoxCheckboxContainer, deleteBtn);

  return bottomPartContainer;
}

export { userProfilePage, createAddressBoxBottomPart, createInputAndLabelElem, createEditBtn };
