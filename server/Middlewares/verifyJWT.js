import jwt from 'jsonwebtoken';

export const verifyJWT_withuserId = (req, res, next) => {
  // Extract the JWT token from the Authorization header
  const authHeader = req.headers.x_authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('token:', token);
  console.log('----------------');
  const decodedToken = jwt.verify(token, process.env.JWTKEY);
  console.log('decodedToken:', decodedToken);
  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JWTKEY);
    console.log('decodedToken:', decodedToken);
    console.log(req.body.userId)
    console.log(decodedToken.id)

    // Check if the "id" in the token matches the "userId" in the request body
    if (decodedToken.id !== req.body.userId) {
      return res.status(403).json({ message: 'Forbidden: Token does not match userId' });
    }

    // Attach the decoded token to the request for further use if needed
    req.decodedToken = decodedToken;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.log('JWTKEY:', process.env.JWTKEY);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export const verifyJWT_withcurrentUserId = (req, res, next) => {
  // Extract the JWT token from the Authorization header
  const authHeader = req.headers.x_authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('token:', token);
  console.log('----------------');
  const decodedToken = jwt.verify(token, process.env.JWTKEY);
  console.log('decodedToken:', decodedToken);
  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JWTKEY);
    console.log('decodedToken:', decodedToken);

    // Check if the "id" in the token matches the "currentUserId" in the request body
    console.log("yoo ",decodedToken.id);
    console.log("boo ",req.body.currentUserId);
    if (decodedToken.id !== req.body.currentUserId) {
      return res.status(403).json({ message: 'Forbidden: Token does not match currentUserId' });
    }

    // Attach the decoded token to the request for further use if needed
    req.decodedToken = decodedToken;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.log('JWTKEY:', process.env.JWTKEY);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export const verifyJWT_withadminUsername = (req, res, next) => {
  // Extract the JWT token from the Authorization header
  const authHeader = req.headers.x_authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('token:', token);
  console.log('----------------');
  const decodedToken = jwt.verify(token, process.env.JWTKEY);
  console.log('decodedToken:', decodedToken);
  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JWTKEY);
    console.log('decodedToken:', decodedToken);

    // Check if the "id" in the token matches the "adminUsername" in the request body
    if (decodedToken.username !== req.body.adminUsername) {
      return res.status(403).json({ message: 'Forbidden: Token does not match adminUsername' });
    }

    // Attach the decoded token to the request for further use if needed
    req.decodedToken = decodedToken;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.log('JWTKEY:', process.env.JWTKEY);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export const verifyJWTForGetRequest = (req, res, next) => {

  // Extract the JWT token from the Authorization header
  console.log(req.headers)
  const token = req.headers.x_authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JWTKEY);

    // Attach the decoded token to the request for further use if needed
    req.decodedToken = decodedToken;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};