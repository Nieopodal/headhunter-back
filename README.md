<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://i.ibb.co/CMYzDvn/logo-white.png">
  <source media="(prefers-color-scheme: light)" srcset="https://i.ibb.co/pR1by1g/logo-black.png">
  <img alt="MegaK HeadHunter logo" src="https://i.ibb.co/pR1by1g/logo-black.png">
</picture>

# About The Project

![screenshot of the app](https://i.ibb.co/smrmmbr/browser-mockup.png)

MegaK HeadHunter is a project made by participants of a Polish webdev course called [MegaKurs](https://megak.pl). It was a team-based (agile/scrum) effort, that was assigned as a final project.

MegaK HeadHunter is an IT employment-focused platform, which allows the students, who have completed the abovementioned course, to apply for their first jobs. It allows head hunters from various companies to browse each sudent's CV's and appoint interviews.

Check out the live demo at [tutaj link](https://tutaj link)

Test *student account* credentials:
* login: kursant@testowy.pl
* password: testowy123!@#

Test *headhunter account* credentials:
* login: headhunter@testowy.pl
* password: testowy123!@#

# Features 🔧

* Three types of accounts: administrator, headhunter and student
* Authorization and authentication (JWT/bearer)
* All accounts are created by administrator either by CSV file upload or a special form
* Account activation or password-reset links sent through e-mail
* Responsive for mobile

# About this repo🔍
This is a backend client for the MegaK HeadHunter app. It was made using:
* NodeJs [![nodejs][nodejs]][nodejs-url]
* NestJS [![NestJS][NestJS]][NestJs-url]
* Typescript [![typescript][typescript]][typescript-url]
* mySQL [![mySQL][mySQL]][mySQL-url]

* packages like [Nodemailer](https://nodemailer.com/about/), [Passport](https://www.passportjs.org/),
[TypeORM](https://typeorm.io/),
[Helmet](https://helmetjs.github.io/), and others


### Install locally
To install HeadHunter app locally:

1. Clone the repo
   ```sh
   git clone https://github.com/Nieopodal/headhunter-back.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. run npm start
   ```sh
   npm run start:dev
   or
   nest start --watch
   ```

### Set up your env file
To configure this backend server correctly, edit the appropriate fields of the .env file, such as the app running port, your mailer config, SQL database connection details, or CORS settings for the frontend client. The template for this file is in the code (`env-example`)

Also, take a look a the TypeORM config file
(`src/config/typeorm.config.ts`) and make sure you have synchronization turned on, so that TypeORM can populate your database with the right tables. 

```
{...
synchronize: true,
...}
```

After that, it is advised to turn this setting off. 

### Frontend app
<span style="color:#e02735">You *will* need the MegaK HeadHunter frontend app for this to make sense</span>.

Check it out at [https://github.com/Nieopodal/headhunter-front](https://github.com/Nieopodal/headhunter-front)

⚠️ Make sure the file structure of both apps is this *(and mind the folder names)*:

```
├─ //your folder
│   ├── headhunter-back
│   ├── headhunter-front
```

# About the authors
This version of MegaK HeadHunter app was made by participants of the group #2 from the 2nd edition of [MegaKurs](https://megak.pl) webdev course:

* Maciej [https://github.com/Nieopodal/](https://github.com/Nieopodal)
* Marcin [https://github.com/mp-martin/](https://github.com/mp-martin/)
* Mateusz [https://github.com/MWyso](https://github.com/MWyso)
* Irek [https://github.com/IrePro78](https://github.com/IrePro78)
* Wojtek [https://github.com/RavenPl](https://github.com/RavenPl)
* Paweł [https://github.com/Now1k](https://github.com/Now1k)


It was a great co-working experience 🤝

<!-- MARKDOWN LINKS & IMAGES -->
[nodejs]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[nodejs-url]: https://nodejs.org/
[typescript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/

[NestJS]: https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white
[NestJS-url]: https://https://nestjs.com/

[mySQL]: https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white
[mySQL-url]: https://https://nestjs.com/