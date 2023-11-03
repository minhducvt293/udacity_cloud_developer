import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



// Init the Express application1
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

/**************************************************************************** */

//! END @TODO1

app.get("/filteredimage", async (req, res) => {
// get image url from url
const image_url = req.query.image_url;

// check if image_url is available
if (!image_url) {
  res.status(400).send({message: "image_url not found"});
  return;
}

// check if image_url is valid image file
if (!image_url.endsWith(".jpg") && !image_url.endsWith(".jpeg")
&& !image_url.endsWith(".png") && !image_url.endsWith(".bmp")) {
  res.status(400).send({message: "only support jpg, jpeg, png or bmp format"});
  return;
}

filterImageFromURL(image_url).then(image=>{
  return res.status(200).sendFile(image, error => {
	if (!error) {
	  let toBeDeletedImages = [image];
	  deleteLocalFiles(toBeDeletedImages);
	}
  });
}).catch(()=>{
  res.status(404).send({message: "image not found or cannot be processed for url: ", image_url});
  return;
})
});

// Root Endpoint
// Displays a simple message to the user
app.get( "/", async (req, res) => {
res.send("try GET /filteredimage?image_url={{}}")
} );


// Start the Server
app.listen( port, () => {
  console.log( `server running http://localhost:${ port }` );
  console.log( `press CTRL+C to stop server` );
} );