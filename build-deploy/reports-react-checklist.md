# app setup 
cd ~/src
git clone git@github.com:brentgroves/reports-react.git 
cd reports-react
npm install

# npm run build or yarn build
Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed.

# build react app
pushd ~/src/reports-react
npm run build
