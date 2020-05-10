import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
var validUrl = require('valid-url');

(async () => {

  // Init the Express application
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
  app.get("/filteredimage", async(req, res) => {
    //Get image url param
      let { image_url } = req.query;

      //Check if has param
      if (!image_url) {
        return res.status(400).send({message:'Provide a valid image url'});
      }

      // Check if image_url is a valid URL
      if (!validUrl.isWebUri(image_url)) {
        return res.status(422).send({error: "image_url is not a valid url"});
      }

      try {
        // Get filterImageFromURL
        let imgPath = await filterImageFromURL(image_url);
        
        //Check result
        if (imgPath && imgPath.length != 0) {
          //Delet on finish
          res.on('finish', () => deleteLocalFiles([imgPath]));
          //return result
          return res.status(200).send(imgPath);
        } else {
          //Image not found
          return res.status(404).send({message:'Image not found'});
        }
      } catch (error) {
        //Error occured
        res.status(500).send({error: 'An error occurred while processing your image.'});
      }
  });


  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();