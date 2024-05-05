// import demoPage from '../pages/demoPage';
import header from './header/header';

export default class App {
  start(): void {
    document.body.append(header());
  }
}
