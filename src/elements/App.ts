import demoPage from '../pages/demoPage';

export default class App {
  start(): void {
    document.body.append(demoPage());
  }
}
