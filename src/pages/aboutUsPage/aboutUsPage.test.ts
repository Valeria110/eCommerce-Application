import { aboutUsPage, createTeamBlock } from './aboutUsPage';

describe('about us page', () => {
  it('should return an element with the main tag name', () => {
    const main = aboutUsPage();
    expect(main.tagName).toBe('MAIN');
  });

  it('should not return null value', () => {
    expect(aboutUsPage()).not.toBeNull();
  });

  it('should contain a certain classname', () => {
    const main = aboutUsPage();
    expect(main.classList.contains('about-us-main')).toBeTruthy();
  });
});

describe('createTeamBlock function', () => {
  it('should return an element with the main tag name', () => {
    const teamContainer = createTeamBlock();
    expect(teamContainer.tagName).toBe('DIV');
  });

  it('should not return null value', () => {
    expect(createTeamBlock()).not.toBeNull();
  });

  it('should not return null value', () => {
    const teamContainer = createTeamBlock();
    expect(teamContainer.classList.contains('about-us__team-container')).toBeTruthy();
  });
});
