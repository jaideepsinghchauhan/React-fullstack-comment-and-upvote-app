# Full stack Nodejs and React app
# Using mongodb atlas for database
# using firebase for authentication
# using Google cloud for deploy and hosting

This is a Nodejs project which will run on 
http://localhost:8000

Eg urls :
http://localhost:8000/hello      simply returns hello 
http://localhost:8000/articles/learn-node   


# To Start : npm run start

To debug just the nodejs side of code , comment the code mentioned below in src/server.js 

app.use(express.static(path.join(__dirname, '../build')));
app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

This above code is actually loading the javascript front end app which has been build and packaged in front end app and moved here,
using "build": "react-scripts build" in my-blog-frontend,

What this command does is, it generates a minified bundle of front end project which we put here in backend project inside build folder,
and hence from nodejs we serve those files, any change we make in my-blog-frontend has to be build and put here so that those changes are put into main backend and serve from there


To Deploy we need to use Gcloud in the backend folder after taking latest code from front end bundle 
the command to deploy is gcloud app deploy ( may change in future but this should work )
