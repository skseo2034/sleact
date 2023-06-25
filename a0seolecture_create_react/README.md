# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### 리액트 서버 배포시 url 환경 설정하기(.env파일)
로컬에서 개발을 하다가 서버에 배포시에는 url을 도메인에 맞게 설정을 해주어야 한다. 로컬에서 개발할때는 localhost:3000, localhost:8000으로 서버에 배포시에는 url을 api서버, 리액트서버 도메인을 직접 셋팅해주어야 한다.
이때 creact-react-app으로 프로젝트를 생성하면 .env파일을 사용하여 설정을 할수있다.

로컬 개발시에는 .env.local,
서버 배포시에는 .env.production을 이용하게끔 하는 방법이다.

먼저 package.json 파일이 있는 루트 디렉토리에 .env.local 파일과, .env.production파일을 만든다.

.env.local

NODE_PATH=src/
REACT_APP_API_ROOT="http://localhost:8080"
REACT_APP_HOME_URL="http://localhost:3000"

.env.production

NODE_PATH=src/
REACT_APP_API_ROOT="https://api.yourdomain.net:8443"
REACT_APP_HOME_URL="https://www.yourdomain.net"

호출하는 쪽에서 사용하는 방식

export const API_BASE_URL = process.env.REACT_APP_API_ROOT;
export const HOME_URL = process.env.REACT_APP_HOME_URL;

const URL_SAVE_USER = `${API_BASE_URL}/api/v1/user`;
const URL_SINGIN = `${API_BASE_URL}/api/v1/authenticate`;
const URL_EXIST_USER = `${API_BASE_URL}/api/v1/exist_user`;
package.json

env-cmd를 install 하고 scripts를 수정함

> npm install env-cmd

"scripts": {
"start": "react-scripts start",
"build": "env-cmd -f .env.production react-scripts build",
"test": "react-scripts test",
"eject": "react-scripts eject"
},
env-cmd -f 에서 -f를 빠져먹으니 .env파일을 찾을수 없다고 나오니 반드시 -f를 넣을것

>npm run build

빌드하고 서버에 적용하면 정상적으로 .evn.production이 적용이 되는 걸 확인할 수 있다.