import { isNull } from '../../utils/utils';
import requestsAPI from '../../elements/requestsAPI';
import Bootstrap from '../../elements/bootstrap/Bootstrap';
import * as validationRegPage from '../registration-page/validationInputsShippingAndBillingAddressForms';
import * as personalInfoValidation from '../registration-page/validationInputsRegistrationForm';
import { createAddressBoxBottomPart, createInputAndLabelElem, createEditBtn } from './userProfilePage';
import { showError } from '../../elements/loginValidation';
import { IAddressObj } from '../../elements/types';

function resetFormValues(clickedEditBtn: HTMLButtonElement) {
  const form = clickedEditBtn.closest('.user-profile__form');
  isNull<HTMLElement>(form);
  const inputs = Array.from(form.querySelectorAll('.user-profile-form__input')) as HTMLInputElement[];
  inputs.forEach((input) => {
    input.value = input.dataset.initialValue ? input.dataset.initialValue : '';
    input.classList.remove('is-invalid');
    input.classList.remove('is-valid');
  });

  const errors = Array.from(form.querySelectorAll('.error')) as HTMLDivElement[];
  if (errors.length) {
    errors.forEach((error) => (error.textContent = ''));
  }
}

function clearFormAfterSaving(form: HTMLElement) {
  const inputs = Array.from(form.querySelectorAll('.user-profile-form__input')) as HTMLInputElement[];
  inputs.forEach((input) => {
    input.classList.remove('is-valid');
    input.classList.remove('is-invalid');
  });
}

function saveUpdatedData(form: HTMLElement) {
  const inputs = Array.from(form.querySelectorAll('.user-profile-form__input')) as HTMLInputElement[];
  const addresses = localStorage.getItem('addresses') ? JSON.parse(localStorage.getItem('addresses') as string) : [];
  const shippingAddressesIds: string[] = localStorage.getItem('shippingAddressIds')
    ? JSON.parse(localStorage.getItem('shippingAddressIds') as string)
    : [];
  const billingAddressIds: string[] = localStorage.getItem('billingAddressIds')
    ? JSON.parse(localStorage.getItem('billingAddressIds') as string)
    : [];
  const isShippingAddress = form.classList.contains('user-profile-form__shipping-address-box');
  const customerId = requestsAPI.customerData.id;

  if (
    form.classList.contains('user-profile-form__shipping-address-box') ||
    form.classList.contains('user-profile-form__billing-address-box')
  ) {
    const checkboxInput = form.querySelector('.form-check-input');
    isNull<HTMLInputElement>(checkboxInput);
    const addressBoxTitle = form.querySelector('.address-box__title');
    isNull<HTMLElement>(addressBoxTitle);

    if (!checkboxInput.checked) {
      if (form.dataset.addressId) {
        requestsAPI.changeAddress(getUpdatedAddressData(form));
        updateAddress(getUpdatedAddressData(form));
      } else {
        const { street, postalCode, city, country } = getnewAddressData(form);
        requestsAPI.addNewAddress(street, postalCode, city, country).then((newAddressData) => {
          addresses.push(newAddressData);
          localStorage.setItem('addresses', JSON.stringify(addresses));

          if (isShippingAddress) {
            requestsAPI.setShippingAddress(newAddressData.id, customerId);
            shippingAddressesIds.push(newAddressData.id);
            localStorage.setItem('shippingAddressIds', JSON.stringify(shippingAddressesIds));
          } else {
            requestsAPI.setBillingAddress(newAddressData.id, customerId);
            billingAddressIds.push(newAddressData.id);
            localStorage.setItem('billingAddressIds', JSON.stringify(shippingAddressesIds));
          }
        });
      }
    } else {
      if (form.dataset.addressId) {
        requestsAPI.changeAddress(getUpdatedAddressData(form));
        updateAddress(getUpdatedAddressData(form));
        if (isShippingAddress) {
          requestsAPI.setDefShippingAddress(form.dataset.addressId, requestsAPI.customerData.id);
          localStorage.setItem('defaultShippingAddressId', form.dataset.addressId);
          addressBoxTitle.textContent = 'Default shipping address';
        } else {
          requestsAPI.setDefBillingAddress(form.dataset.addressId, requestsAPI.customerData.id);
          localStorage.setItem('defaultBillingAddressId', form.dataset.addressId);
          addressBoxTitle.textContent = 'Default billing address';
        }
      } else {
        const { street, postalCode, city, country } = getnewAddressData(form);
        requestsAPI.addNewAddress(street, postalCode, city, country).then((newAddressData) => {
          form.dataset.addressId = newAddressData.id;
          addresses.push(newAddressData);
          localStorage.setItem('addresses', JSON.stringify(addresses));
          if (isShippingAddress) {
            requestsAPI.setShippingAddress(newAddressData.id, requestsAPI.customerData.id);
            shippingAddressesIds.push(newAddressData.id);
            localStorage.setItem('shippingAddressIds', JSON.stringify(shippingAddressesIds));
          } else {
            requestsAPI.setBillingAddress(newAddressData.id, requestsAPI.customerData.id);
            billingAddressIds.push(newAddressData.id);
            localStorage.setItem('billingAddressIds', JSON.stringify(shippingAddressesIds));
          }

          if (isShippingAddress) {
            requestsAPI.setDefShippingAddress(newAddressData.id, requestsAPI.customerData.id);
            localStorage.setItem('defaultShippingAddressId', newAddressData.id);
            addressBoxTitle.textContent = 'Default shipping address';
          } else {
            requestsAPI.setDefBillingAddress(newAddressData.id, requestsAPI.customerData.id);
            localStorage.setItem('defaultBillingAddressId', newAddressData.id);
            addressBoxTitle.textContent = 'Default billing address';
          }
        });
      }
    }
  } else {
    inputs.forEach((input) => {
      if (input.value !== input.dataset.initialValue) {
        const label = input.closest('.user-profile-form__label');
        isNull<HTMLLabelElement>(label);
        const userProfileHeaderEmail = document.querySelector('.user-profile-header__email');
        const userFullname = document.querySelector('.user-profile-header__fullname');
        isNull<HTMLElement>(userProfileHeaderEmail);
        isNull<HTMLElement>(userFullname);

        switch (label.textContent) {
          case 'Name':
            requestsAPI.updateUserFirstName(input.value);
            userFullname.textContent = `${input.value} ${requestsAPI.customerData.lastName}`;
            break;
          case 'Lastname':
            requestsAPI.updateUserLastName(input.value);
            userFullname.textContent = `${requestsAPI.customerData.firstName} ${input.value}`;
            break;
          case 'Email':
            requestsAPI.changeUserEmail(input.value);
            userProfileHeaderEmail.textContent = input.value;
            break;
          case 'Date of birth':
            requestsAPI.setDateOfBirth(input.value);
            break;
        }
      }
    });
  }

  clearFormAfterSaving(form);
}

function updateAddress(updatedAddressData: IAddressObj) {
  const addresses: IAddressObj[] = localStorage.getItem('addresses')
    ? JSON.parse(localStorage.getItem('addresses') as string)
    : [];
  const addressId = updatedAddressData.id;
  const updatedAddressIndex = addresses.findIndex((address) => address.id === addressId);
  addresses.splice(updatedAddressIndex, 1);
  addresses.push(updatedAddressData);
  localStorage.setItem('addresses', JSON.stringify(addresses));
}

function deleteAddressInLocalStorage(addressId: string, clickedBtn: HTMLButtonElement) {
  const addresses: IAddressObj[] = localStorage.getItem('addresses')
    ? JSON.parse(localStorage.getItem('addresses') as string)
    : [];
  const shippingAddressesIds: string[] = localStorage.getItem('shippingAddressIds')
    ? JSON.parse(localStorage.getItem('shippingAddressIds') as string)
    : [];
  const billingAddressIds: string[] = localStorage.getItem('billingAddressIds')
    ? JSON.parse(localStorage.getItem('billingAddressIds') as string)
    : [];

  const deletedAddressIndex = addresses.findIndex((address) => address.id === addressId);
  addresses.splice(deletedAddressIndex, 1);
  localStorage.setItem('addresses', JSON.stringify(addresses));

  const form = clickedBtn.closest('.user-profile__form');
  isNull<HTMLDivElement>(form);
  const isShipping = form?.classList.contains('user-profile-form__shipping-address-box');
  const checkbox = form.querySelector('.address-box__checkbox') as HTMLInputElement;
  const isDefaultAddress = checkbox.checked;

  if (isShipping) {
    const deletedShippingAddressIndex = shippingAddressesIds.findIndex(
      (shippingAddressesId) => shippingAddressesId === addressId,
    );
    shippingAddressesIds.splice(deletedShippingAddressIndex, 1);
    localStorage.setItem('shippingAddressIds', JSON.stringify(shippingAddressesIds));
    if (isDefaultAddress) {
      localStorage.setItem('defaultShippingAddressId', '');
    }
  } else {
    const deletedBillingAddressIndex = billingAddressIds.findIndex(
      (billingAddressesId) => billingAddressesId === addressId,
    );
    billingAddressIds.splice(deletedBillingAddressIndex, 1);
    localStorage.setItem('billingAddressIds', JSON.stringify(billingAddressIds));
    if (isDefaultAddress) {
      localStorage.setItem('defaultBillingAddressId', '');
    }
  }
}

function getUpdatedAddressData(editedForm: HTMLElement): IAddressObj {
  const addressId = editedForm.dataset.addressId as string;
  const countryInput = editedForm.querySelector('.country-input');
  const cityInput = editedForm.querySelector('.city-input');
  const streetInput = editedForm.querySelector('.street-input');
  const postalCodeInput = editedForm.querySelector('.zipcode-input');
  isNull<HTMLInputElement>(countryInput);
  isNull<HTMLInputElement>(cityInput);
  isNull<HTMLInputElement>(streetInput);
  isNull<HTMLInputElement>(postalCodeInput);
  const newAddressData = {
    id: addressId,
    street: streetInput.value ? streetInput.value : '',
    postalCode: postalCodeInput.value ? postalCodeInput.value : '',
    city: cityInput.value ? cityInput.value : '',
    country: countryInput.value ? countryInput.value : '',
    email: requestsAPI.customerData.email,
  };

  return newAddressData;
}

function getnewAddressData(editedForm: HTMLElement) {
  const countryInput = editedForm.querySelector('.country-input');
  const cityInput = editedForm.querySelector('.city-input');
  const streetInput = editedForm.querySelector('.street-input');
  const postalCodeInput = editedForm.querySelector('.zipcode-input');
  isNull<HTMLInputElement>(countryInput);
  isNull<HTMLInputElement>(cityInput);
  isNull<HTMLInputElement>(streetInput);
  isNull<HTMLInputElement>(postalCodeInput);

  const newAddressData = {
    street: streetInput.value ? streetInput.value : '',
    postalCode: postalCodeInput.value ? postalCodeInput.value : '',
    city: cityInput.value ? cityInput.value : '',
    country: countryInput.value ? countryInput.value : '',
  };

  return newAddressData;
}

function toggleMode(editBtn: HTMLButtonElement, editBtnText: HTMLSpanElement, form: HTMLElement) {
  const inputs = Array.from(form.querySelectorAll('.user-profile-form__input')) as HTMLInputElement[];
  const saveChangesBtn = document.querySelector('.save-changes-btn');
  isNull<HTMLButtonElement>(saveChangesBtn);

  inputs.forEach((input: HTMLInputElement | null) => {
    isNull<HTMLInputElement>(input);
    if (input.hasAttribute('readonly')) {
      input.removeAttribute('readonly');
      saveChangesBtn.classList.remove('d-none');
      editBtn.classList.add('read-form-btn');
      editBtnText.textContent = 'cancel';
      form.classList.add('form-in-edit-mode');
    } else {
      input.setAttribute('readonly', '');
      saveChangesBtn.classList.add('d-none');
      editBtn.classList.remove('read-form-btn');
      editBtnText.textContent = 'edit';
      form.classList.remove('form-in-edit-mode');
    }
  });
}

function isFormValid() {
  let isValid = false;

  const forms = Array.from(document.querySelectorAll('.form-in-edit-mode')) as HTMLElement[];
  forms.forEach((form) => {
    const inputs = Array.from(form.querySelectorAll('.user-profile-form__input')) as HTMLInputElement[];
    isValid =
      !inputs.some((input) => input.classList.contains('is-invalid')) && !inputs.some((input) => input.value === '');
  });

  return isValid;
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

function createNewAddress(clickedBtn: HTMLButtonElement) {
  const saveChangesBtn = document.querySelector('.save-changes-btn');
  isNull<HTMLButtonElement>(saveChangesBtn);

  if (clickedBtn.classList.contains('add-shipping-address-btn')) {
    const shippingAddressBox = Bootstrap.createElement(
      'div',
      'user-profile-form__shipping-address-box user-profile__form d-flex flex-column',
    );

    const shipAddressBoxTitleWrapper = Bootstrap.createElement('div', 'shipping-address-box__title-wrapper d-flex');
    const shippingAddressBoxTitle = Bootstrap.createElement(
      'h4',
      'shipping-address-box__title address-box__title fw-bold',
      'Shipping address',
    );
    const { editBtn, editBtnText } = createEditBtn();
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMode(editBtn, editBtnText, shippingAddressBox);
    });
    shipAddressBoxTitleWrapper.append(shippingAddressBoxTitle, editBtn);

    const inputsContainer = Bootstrap.createElement('div', 'addresses-info__inputs-container d-grid');

    const countryLabel = createInputAndLabelElem('Country', 'text');

    const cityLabel = createInputAndLabelElem('City', 'text');

    const streetLabel = createInputAndLabelElem('Street', 'text');

    const zipcodeLabel = createInputAndLabelElem('Zip code', 'text');

    const addressBoxBottomPart = createAddressBoxBottomPart();
    inputsContainer.append(countryLabel, cityLabel, streetLabel, zipcodeLabel);
    shippingAddressBox.append(shipAddressBoxTitleWrapper, inputsContainer, addressBoxBottomPart);
    const inputs = Array.from(shippingAddressBox.querySelectorAll('.user-profile-form__input')) as HTMLInputElement[];

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

    const shippingAddressesBox = document.querySelector('.user-profile-form__shipping-addresses');
    isNull<HTMLDivElement>(shippingAddressesBox);
    shippingAddressesBox.insertBefore(shippingAddressBox, clickedBtn);
  } else {
    const billingAddressBox = Bootstrap.createElement(
      'div',
      'user-profile-form__billing-address-box user-profile__form d-flex flex-column',
    );

    const billingAddressBoxTitleWrapper = Bootstrap.createElement('div', 'billing-address-box__title-wrapper d-flex');
    const billingAddressBoxTitle = Bootstrap.createElement(
      'h4',
      'billing-address-box__title address-box__title fw-bold',
      'Billing address',
    );
    const { editBtn, editBtnText } = createEditBtn();
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMode(editBtn, editBtnText, billingAddressBox);
    });
    billingAddressBoxTitleWrapper.append(billingAddressBoxTitle, editBtn);

    const inputsContainer = Bootstrap.createElement('div', 'addresses-info__inputs-container d-grid');

    const countryLabel = createInputAndLabelElem('Country', 'text');

    const cityLabel = createInputAndLabelElem('City', 'text');

    const streetLabel = createInputAndLabelElem('Street', 'text');

    const zipcodeLabel = createInputAndLabelElem('Zip code', 'text');

    const addressBoxBottomPart = createAddressBoxBottomPart();
    inputsContainer.append(countryLabel, cityLabel, streetLabel, zipcodeLabel);
    billingAddressBox.append(billingAddressBoxTitleWrapper, inputsContainer, addressBoxBottomPart);

    const inputs = Array.from(billingAddressBox.querySelectorAll('.user-profile-form__input')) as HTMLInputElement[];

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

    const billingAddressesBox = document.querySelector('.user-profile-form__billing-addresses');
    isNull<HTMLDivElement>(billingAddressesBox);
    billingAddressesBox.insertBefore(billingAddressBox, clickedBtn);
  }
}

function passwordConfirmation(
  newPasswordInput: HTMLInputElement,
  confirmPasswordInput: HTMLInputElement,
  confirmPasswordLabel: HTMLLabelElement,
) {
  const error = confirmPasswordLabel.querySelector('.error');
  isNull<HTMLDivElement>(error);

  if (confirmPasswordInput.value !== newPasswordInput.value) {
    error.textContent = 'The password confirmation does not match';
    confirmPasswordInput.classList.add('is-invalid');
  } else {
    error.textContent = '';
    confirmPasswordInput.classList.remove('is-invalid');
    if (!newPasswordInput.classList.contains('is-invalid')) {
      confirmPasswordInput.classList.add('is-valid');
    }
  }
}

function validateChangePasswordForm(
  newPasswordInput: HTMLInputElement,
  confirmPasswordInput: HTMLInputElement,
  saveBtn: HTMLButtonElement,
): boolean {
  if (
    !newPasswordInput.classList.contains('is-invalid') &&
    !confirmPasswordInput.classList.contains('is-invalid') &&
    newPasswordInput.value !== '' &&
    confirmPasswordInput.value !== ''
  ) {
    saveBtn.classList.remove('disabled');
    return true;
  }
  saveBtn.classList.add('disabled');
  return false;
}

function checkCurrentPassword(
  currentPasswordInput: HTMLInputElement,
  newPasswordInput: HTMLInputElement,
  confirmPasswordInput: HTMLInputElement,
  saveBtn: HTMLButtonElement,
) {
  const error = currentPasswordInput.nextElementSibling;
  isNull<HTMLDivElement>(error);

  requestsAPI
    .authCustomersLogin(requestsAPI.customerData.email, currentPasswordInput.value)
    .then((serverAnswer) => {
      if (serverAnswer.isOk) {
        currentPasswordInput.classList.add('is-valid');
        currentPasswordInput.classList.remove('is-invalid');
        error.textContent = '';
        if (validateChangePasswordForm(newPasswordInput, confirmPasswordInput, saveBtn)) {
          saveBtn.classList.remove('disabled');
          requestsAPI.changePassword(currentPasswordInput.value, newPasswordInput.value);
          const modal = document.querySelector('.change-password-modal');
          isNull<HTMLDivElement>(modal);
          modal.classList.remove('active');

          const userForm = document.querySelector('.user-profile-form');
          isNull<HTMLFormElement>(userForm);
          const passwordInput = userForm.querySelector('.password-input');
          isNull<HTMLInputElement>(passwordInput);
          passwordInput.value = newPasswordInput.value;
        }
      } else {
        if (serverAnswer.field === 'password') {
          showError(currentPasswordInput, serverAnswer.message);
          currentPasswordInput.classList.add('is-invalid');
        }
      }
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
    });
}

export {
  resetFormValues,
  saveUpdatedData,
  toggleMode,
  addInputEventListener,
  isInputChanged,
  isFormValid,
  createNewAddress,
  passwordConfirmation,
  validateChangePasswordForm,
  checkCurrentPassword,
  deleteAddressInLocalStorage,
};
