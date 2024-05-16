/**
 * @jest-environment jsdom
 */
import { validateEmail } from '../../elements/loginValidation';
import { showError } from '../../elements/loginValidation';

describe('validateEmail', () => {
  it('should show error message for empty email value', () => {
    const emailInput = document!.createElement('input');
    emailInput.classList.add('login-form__email-input');

    validateEmail('');

    validateEmail(emailInput.value);
    expect(showError).toHaveBeenCalledWith(emailInput, 'This field is required');
  });
});

// describe('validateEmail', () => {
//   // Тест на проверку пустого значения email
//   it('should show error message for empty email value', () => {
//     const emailInput = document.createElement('input');
//     emailInput.classList.add('login-form__email-input');

//     validateEmail('');

//     expect(emailInput.classList).toContain('is-invalid');
//     const error = emailInput.nextElementSibling;
//     isNull<HTMLElement>(error);
//     expect(error.textContent).toBe('This field is required');
//   });
// });
