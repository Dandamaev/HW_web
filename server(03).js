import http from 'http';
import fs from 'fs/promises';
import path from 'path';

const port = 3000;
const baseDir = './files';

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const filePath = path.join(baseDir, url.pathname);

  try {
    if (req.method === 'GET') {
      if (url.pathname === '/') {
        // GET на директорию
        const files = await fs.readdir(baseDir);
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(files.join('\n'));
      } else {
        // GET на файл
        const fileContent = await fs.readFile(filePath, 'utf-8');
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Length', fileContent.length);
        res.end(fileContent);
      }
    } else if (req.method === 'HEAD') {
      // HEAD на файл
      const fileStat = await fs.stat(filePath);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Length', fileStat.size);
      res.end();
    } else if (req.method === 'PUT') {
      // PUT на файл
      const fileContent = [];
      req.on('data', chunk => fileContent.push(chunk));
      req.on('end', async () => {
        await fs.writeFile(filePath, Buffer.concat(fileContent));
        res.statusCode = 200;
        res.end();
      });
    } else if (req.method === 'PATCH') {
      // PATCH на файл
      const fileContent = [];
      req.on('data', chunk => fileContent.push(chunk));
      req.on('end', async () => {
        const exists = await fs.stat(filePath).catch(() => null);
        const appendOptions = { flag: exists ? 'a' : 'w' };
        await fs.writeFile(filePath, Buffer.concat(fileContent), appendOptions);
        res.statusCode = 200;
        res.end();
      });
    } else if (req.method === 'DELETE') {
      // DELETE на файл
      await fs.unlink(filePath);
      res.statusCode = 200;
      res.end();
    } else {
      // Неподдерживаемый метод
      res.statusCode = 400;
      res.end();
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Файл не найден
      res.statusCode = 404;
      res.end();
    } else {
      // Ошибка на сервере
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(`Error: ${err.message}`);
    }
  }
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
