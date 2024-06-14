# :books: LitHub — Online Book Store LitHub

**Welcome to our eCommerce Application, an online book store "LitHub"!** Here you will find an analogue of the real shopping experience in a digital environment. 🏪 Our platform is a comprehensive online portal for purchasing books, providing users with an interactive and user-friendly interface. From product discovery to checkout, our app offers a seamless shopping path, increasing user engagement and confidence in every step. 😊

Our users can enjoy _a wide range of books_ 📖, _view detailed descriptions_ 🤓, _add impressive finds to the cart_ 🛒 and _effortlessly proceed to checkout_. 💳 Our application provides functionality for _registration and login_ ✏️🔐, _instant product search_ :mag:, as well as _convenient categorization and sorting_ to make the shopping process simple and enjoyable.

_One of the key factors that makes our application attractive is its adaptability_. This feature allows the application to function flawlessly on various devices with screen resolutions of 390 pixels and above. Such an approach guarantees that users can enjoy the convenience and functionality of shopping regardless of the device they prefer to use. :iphone::computer:

We wish that each purchase through our application brought not only satisfaction from the new acquisition, but also joy and pleasure from the process of selection and making the deal. :handshake:

**_Let each purchase be accompanied only by positive emotions and bring a lot of pleasure!_** :shopping::sparkles:

### Key pages in the application include:

- Login and Registration pages :key:
- Main page :house:
- Catalog Product page :clipboard:
- Detailed Product page :mag_right:
- User Profile page :bust_in_silhouette:
- Basket page :shopping_cart:
- About Us page :raising_hand::raising_hand_woman:

Our application is based on the **CommerceTools platform**🌐 - a leading provider of commercial solutions for B2C and B2B enterprises. CommerceTools offers an innovative cloud commerce platform built on microservices architecture. This allows brands to create unique and attractive opportunities for digital commerce.

When creating our application, we actively used the **Kanban board**📋 to effectively manage tasks and track progress. Our Kanban board has been divided into several columns reflecting the various stages of completing tasks:

- To Do: Tasks selected for execution are moved to this column. Here they await their turn for execution. 🔴
- In Progress: When the team started working on a task, it was moved to this column. Here we tracked the current status and progress of each task. 🟡
- In Review: After completing work on a task, it was sent for review by other team members. Quality assessment of the completed work was conducted in this column. 🟣
- Done: Tasks that successfully passed the review were moved to this column. Here we marked the task as completed and closed. 🟢

We regularly updated and monitored the status of the Kanban board, holding weekly meetings to discuss progress and identify any issues. The use of the Kanban board allowed us to organize the team's work, increase process transparency, and ensure more effective project management.

### In our project we use 🔧:

1. TypeScript
2. Webpack
3. ESLint
4. Prettier
5. Husky
6. Jest
7. SCSS
8. Bootstrap

### To deploy an application to a local environment 🖥️:

Copy repository:

    git clone https://github.com/Valeria110/eCommerce-Application.git

Install dependencies:

    npm install -D

npm run script:

    npm run comand-name

    "scripts": {
    "start": "webpack serve --open --mode development --config ./webpack.config.js",
    "build": "webpack --mode production --config ./webpack.config.js",
    "test": "jest",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write .",
    "ci:format": "prettier --check ."
    }
