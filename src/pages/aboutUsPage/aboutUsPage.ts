import './aboutUsPage.scss';
import Bootstrap from '../../elements/bootstrap/Bootstrap';
import githubIcon from '../../img/github-icon.svg';
import rssLogo from '../../img/rss-logo.svg';
import leraImg from '../../img/lera-img.jpg';
import mishaImg from '../../img/misha-img.jpg';
import vikaImg from '../../img/vika-img.jpg';
import { aboutUsData } from './aboutUsData';

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
    const cardAccordion = generateAccordion(i);
    const teamMemberCardGitHub = Bootstrap.createElement(
      'div',
      'about-us__team-card-github d-flex justify-content-center',
    );
    teamMemberCard.append(teamMemberCardDesc, cardAccordion, teamMemberCardGitHub);
    const teamCardDescTop = Bootstrap.createElement(
      'div',
      'about-us__team-card-desc-top d-flex flex-column align-items-center',
    );
    const teamMemberImg = Bootstrap.createElement('img', 'about-us__team-card-img rounded-circle');
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
        "Extremely self-disciplined, responsible and creative, with incredible industriousness and passion for web-development. During the work process, Valerie demonstrated willingness and pursuit of creating a unique and attractive application. She devoted all her free time to the project and was always ready to make some improvements to it. Facing some challenges did not stop her, but on the contrary, stimulated her to find the cause and solve it. Valerie's contributions are definitely invaluable and important.";
      gitHubLinkText.textContent = 'Valeria110';
      githubLink.href = 'https://github.com/Valeria110';
    }
    if (i === 1) {
      teamMemberImg.src = mishaImg as string;
      teamMemberFullName.textContent = 'Mikhail Semenuk';
      teamMemberRole.textContent = 'Team Lead & Front-end developer';
      teamMemberDesc.textContent =
        'Super smart and industrious leader of our team, with excellent self-organization and self-discipline. Mike is extremely punctual, likes to organize information and tasks, pays a lot of attention to the details. Besides, he likes to automate everything that is possible, periodically writing small scripts to simplify life and work. Moreover, Mike creates a pretty friendly and pleasant atmosphere in our team. Certainly, his contribution to our project cannot be overestimated.';
      gitHubLinkText.textContent = 'mikhailsemenuk';
      githubLink.href = 'https://github.com/MikhailSemenuk';
    }
    if (i === 2) {
      teamMemberImg.src = vikaImg as string;
      teamMemberFullName.textContent = 'Viktoriya Rashchepkina';
      teamMemberRole.textContent = 'Front-end developer';
      teamMemberDesc.textContent =
        'Incredibly hardworking and responsible, with a high-quality and attentive approach to performing her duties. During the project, Vika was doing her best to contribute to the creation of our online bookstore. She is not only hardworking and result-oriented, but also approached the work painstakingly and studiously. Additionally, she is always willing to dedicate all her time and effort to our project. Vika is an amazing and positive member of our team!';
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

function generateAccordion(cardNumber: number) {
  const accordion = Bootstrap.createElement('div', 'about-us-accordion accordion');
  accordion.id = 'accordion';

  for (let i = 1; i <= 4; i += 1) {
    const accordionItem = Bootstrap.createElement('div', 'accordion-item');

    const accordionHeader = Bootstrap.createElement('h2', 'accordion-header');

    const accordionButton = Bootstrap.createElement('button', 'accordion-button collapsed');
    accordionButton.setAttribute('type', 'button');
    accordionButton.setAttribute('data-bs-toggle', 'collapse');

    accordionButton.setAttribute('data-bs-target', `#collapse${cardNumber}-${i}`);
    accordionButton.setAttribute('aria-expanded', `${i === 1 ? 'true' : 'false'}`);
    accordionButton.setAttribute('aria-controls', `collapse${i}`);

    const buttonText = i === 1 ? 'Contributions' : i === 2 ? 'Education' : i === 3 ? 'Work experience' : 'Languages';
    accordionButton.textContent = buttonText;

    accordionHeader.appendChild(accordionButton);

    const accordionCollapse = Bootstrap.createElement('div', 'accordion-collapse collapse');
    accordionCollapse.setAttribute('id', `collapse${cardNumber}-${i}`);
    accordionCollapse.setAttribute('data-bs-parent', '#accordion');

    const accordionBody = Bootstrap.createElement('div', 'accordion-body');
    if (i === 1) {
      const contribsList = Bootstrap.createElement('ul', 'accordion-body__contribs-list');
      const contribs = aboutUsData[cardNumber].contributions;
      contribs.forEach((contrib: string) => {
        const li = Bootstrap.createElement('li', 'contribs-list__item', contrib);
        contribsList.append(li);
      });
      accordionBody.appendChild(contribsList);
    }
    if (i === 2) {
      const educationList = Bootstrap.createElement('ul', 'accordion-body__education-list');
      const educationPlaces = aboutUsData[cardNumber].education;
      educationPlaces.forEach((educationItem: string) => {
        const li = Bootstrap.createElement('li', 'education-list__item', educationItem);
        educationList.append(li);
      });
      accordionBody.appendChild(educationList);
    }
    if (i === 3) {
      const workList = Bootstrap.createElement('ul', 'accordion-body__work-list');
      const workExperienceList = aboutUsData[cardNumber].work;
      workExperienceList.forEach((workExperienceItem: string) => {
        const li = Bootstrap.createElement('li', 'work-list__item', workExperienceItem);
        workList.append(li);
      });
      accordionBody.appendChild(workList);
    }
    if (i === 4) {
      const languagesList = Bootstrap.createElement('ul', 'accordion-body__languages-list');
      const languages = aboutUsData[cardNumber].languages;
      languages.forEach((language: string) => {
        const li = Bootstrap.createElement('li', 'languages-list__item', language);
        languagesList.append(li);
      });
      accordionBody.appendChild(languagesList);
    }

    accordionCollapse.appendChild(accordionBody);

    accordionItem.appendChild(accordionHeader);
    accordionItem.appendChild(accordionCollapse);

    accordion.appendChild(accordionItem);
  }

  return accordion;
}

export { aboutUsPage, createTeamBlock };
