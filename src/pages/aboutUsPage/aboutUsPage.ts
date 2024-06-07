import './aboutUsPage.scss';
import Bootstrap from '../../elements/bootstrap/Bootstrap';
import githubIcon from '../../img/github-icon.svg';
import rssLogo from '../../img/rss-logo.svg';
import userProfileImg from '../../img/placeholderUser.png';
import leraImg from '../../img/lera-img.jpg';

function aboutUsPage(): HTMLElement {
  const main = Bootstrap.createElement('main', 'about-us-main d-flex flex-column align-items-center');
  const teamContainer = createTeamBlock();
  const contributionsBlock = createContributionBlock();
  const RSLogoLink = Bootstrap.createElement('a', 'about-us__rss-logo');
  RSLogoLink.setAttribute('target', '_blank');
  RSLogoLink.href = 'https://rs.school/';
  const rssLogoIcon = Bootstrap.createElement('img', 'about-us__rss-logo-img');
  rssLogoIcon.src = rssLogo as string;
  RSLogoLink.append(rssLogoIcon);
  main.append(teamContainer, contributionsBlock, RSLogoLink);
  // create page
  return main;
}

function createTeamBlock(): HTMLElement {
  const teamContainer = Bootstrap.createElement(
    'div',
    'about-us__team-container d-flex flex-column align-items-center',
  );
  const teamContainerHeader = Bootstrap.createElement('h1', 'about-us__team-header fs-1 text-uppercase', 'our team');
  const teamCardsContainer = Bootstrap.createElement(
    'div',
    'about-us__team-cards-container d-flex justify-content-center',
  );
  teamContainer.append(teamContainerHeader, teamCardsContainer);

  for (let i = 0; i < 3; i += 1) {
    const teamMemberCard = Bootstrap.createElement('div', 'about-us__team-card d-flex flex-column align-items-center');
    const teamMemberCardDesc = Bootstrap.createElement(
      'div',
      'about-us__team-card-desc d-flex flex-column align-items-center',
    );
    const teamMemberCardGitHub = Bootstrap.createElement(
      'div',
      'about-us__team-card-github d-flex justify-content-center',
    );
    teamMemberCard.append(teamMemberCardDesc, teamMemberCardGitHub);
    const teamCardDescTop = Bootstrap.createElement(
      'div',
      'about-us__team-card-desc-top d-flex flex-column align-items-center',
    );
    const teamMemberImg = Bootstrap.createElement('img', 'about-us__team-card-img rounded-circle');
    teamMemberImg.src = userProfileImg as string;
    const teamMemberBriefInfo = Bootstrap.createElement(
      'div',
      'about-us__team-card-brief-info d-flex flex-column align-items-center',
    );
    const teamMemberFullName = Bootstrap.createElement('h4', 'about-us__team-card-fullname');
    const teamMemberRole = Bootstrap.createElement('p', 'about-us__team-card-role text-secondary');
    teamCardDescTop.append(teamMemberImg, teamMemberBriefInfo);
    teamMemberBriefInfo.append(teamMemberFullName, teamMemberRole);
    const teamMemberDesc = Bootstrap.createElement('div', 'about-us__team-member-desc text-secondary-emphasis');
    teamMemberCardDesc.append(teamCardDescTop, teamMemberDesc);

    const githubLink = Bootstrap.createElement('a', 'about-us__team-card-github-link d-flex justify-content-center');
    githubLink.setAttribute('target', '_blank');

    const gitHubIcon = Bootstrap.createElement('img', 'about-us__team-card-github-icon');
    gitHubIcon.src = githubIcon as string;
    const gitHubLinkText = Bootstrap.createElement('span', 'about-us__team-card-github-text');
    githubLink.append(gitHubIcon, gitHubLinkText);
    teamMemberCardGitHub.appendChild(githubLink);
    if (i === 0) {
      teamMemberImg.src = leraImg as string;
      teamMemberFullName.textContent = 'Valerie Ivashkevich';
      teamMemberRole.textContent = 'Front-end developer';
      teamMemberDesc.textContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum';
      gitHubLinkText.textContent = 'Valeria110';
      githubLink.href = 'https://github.com/Valeria110';
    }
    if (i === 1) {
      teamMemberFullName.textContent = 'Mikhail Semenuk';
      teamMemberRole.textContent = 'Team Lead & Front-end developer';
      teamMemberDesc.textContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum';
      gitHubLinkText.textContent = 'mikhailsemenuk';
      githubLink.href = 'https://github.com/MikhailSemenuk';
    }
    if (i === 2) {
      teamMemberFullName.textContent = 'Viktoriya Rashchepkina';
      teamMemberRole.textContent = 'Front-end developer';
      teamMemberDesc.textContent =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum';
      gitHubLinkText.textContent = 'qwgfsehte';
      githubLink.href = 'https://github.com/qwgfsehte';
    }

    teamCardsContainer.appendChild(teamMemberCard);
  }

  return teamContainer;
}

function createContributionBlock(): HTMLElement {
  const contributionsBlock = Bootstrap.createElement(
    'div',
    'about-us__contributions-block d-flex flex-column align-items-center',
  );
  const contribsBlockHeader = Bootstrap.createElement(
    'h2',
    'about-us__contributions-block-header text-uppercase',
    'used Collaboration methods',
  );
  const methodsContainer = Bootstrap.createElement(
    'div',
    'about-us__methods-block d-flex flex-wrap justify-content-center',
  );
  for (let i = 0; i < 7; i += 1) {
    const methodBlock = Bootstrap.createElement('div', 'about-us__method-block');
    const methodBlockText = Bootstrap.createElement('p', 'about-us__method-block-text text-secondary-emphasis');
    methodBlock.appendChild(methodBlockText);

    if (i === 0) {
      methodBlockText.textContent = 'daily progress reports';
    }
    if (i === 1) {
      methodBlockText.textContent = 'code review of completed tasks and detailed feedback';
    }
    if (i === 2) {
      methodBlockText.textContent = 'completed work discussion after finishing a sprint';
    }
    if (i === 3) {
      methodBlockText.textContent = 'call if problems arise';
    }
    if (i === 4) {
      methodBlockText.textContent = 'delegation of responsibilities';
    }
    if (i === 5) {
      methodBlockText.textContent = 'using a Kanban board for a better tasks management';
    }
    if (i === 6) {
      methodBlockText.textContent = 'improving development progress by discussing some problem areas';
    }

    methodsContainer.appendChild(methodBlock);
  }

  contributionsBlock.append(contribsBlockHeader, methodsContainer);

  return contributionsBlock;
}

export { aboutUsPage };
