const req = require.context('./', true, /.*\.otf$/);

req.keys().forEach(req);
