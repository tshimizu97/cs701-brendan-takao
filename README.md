# TutorMatch
## Middlebury College, Computer Science CSCI 701 (Fall 2020)

## About
This is a final project done by Brendan Philbin and Takao Shimizu as a part of
CS 701 course at Middlebury College taught by Prof. Caplan.
TutorMatch is a web application that connects people who want to give and receive tutoring sessions.
We implemented both front-end and back-end codes of tutor match employing Google Sheets as pseudo-database.
This projects utilizes React, Node.js, Next.js as well as JSX (HTML/CSS/Javascript).

## Limitation / Warning
This project is a proof-of-concept and not to be used as a practical implementation that can be deployed immediately.
To be used as a practical application, it has security flaw in communicating user's data.

## Deployment
First, build the production application in the `.next` folder:

```bash
npm run build
# or
yarn build
```

Then, start a Node.js server:

```bash
npm run start
# or
yarn start
```

Check out  [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Development
The application is developed using Next.js: [Next.js Documentation](https://nextjs.org/docs)

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Requirement
- Node.js 10.13 or later
- MacOS, Windows (including WSL), and Linux are supported
- npm 6.14.4 or later
- Javascript libraries: nextjs 0.0.3 or later, googleapis 66.0.0 or later

This application internally uses Google's APIs.
To test the code, in addition to install googleapis, you need to authenticate by ****.
After authentication process is done, *** as JSON needs to be placed in the project's directory.

## References
For further details about the project, read [our paper](https://drive.google.com/file/d/1EjeS-svQTcnx9OwUNhfWlnzviXpFGXyr/view?usp=sharing).
Also, you might find papers cited in the above paper find interesting.

### Authors
Brendan Philbin and Takao Shimizu
