import generateLayoutRegistrationPage from '../pages/registration-page/layoutRegistrationPage';

export default class App {
  // start(): void {
  // document.body.append(demoPage());
  // }
  register(): void {
    document.body.append(generateLayoutRegistrationPage());
  }
}
