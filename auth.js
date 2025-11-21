const auth = (req, res, next) => {
  
  const authHeader = req.headers.authorization;

 
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    
    res.setHeader('WWW-Authenticate', 'Basic realm="Acesso Restrito"');
    return res.status(401).json({ error: 'Autenticação necessária.' });
  }


  const encoded = authHeader.substring(6); 
  

  let decoded;
  try {
   
    decoded = Buffer.from(encoded, 'base64').toString('utf8');
  } catch (err) {
    return res.status(400).json({ error: 'Token Base64 inválido.' });
  }
  
 
  const expectedCredentials = 'admin:password'; 

 
  if (decoded === expectedCredentials) {
   
    next();
  } else {
 
    res.setHeader('WWW-Authenticate', 'Basic realm="Acesso Restrito"');
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }
};

module.exports = auth;