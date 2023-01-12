import http from 'node:http';

const PORT = process.env.PORT || 4000;

const server = http.createServer(async (req, res) => {});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});
