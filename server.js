const http = require("http");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Serve static files
  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);

  // Get file extension
  const extname = path.extname(filePath);
  let contentType = "text/html";

  switch (extname) {
    case ".js":
      contentType = "application/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
  }

  // Check if file exists
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // Page not found
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(
          "<h1>404 - Page Not Found</h1><p>The Karaoke Platform is being set up...</p>",
        );
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Karaoke Platform server running on port ${PORT}`);
});
