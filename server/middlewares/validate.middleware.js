const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    return next();
  } catch (err) {
    // const message = err.issues.map((curElem) => curElem.message);
    // res.status(422).json({ message })
    // next(message);

    const status = 422;
    const message = "Fill the input properly";
    const extraDetails = err.issues.map((curElem) => curElem.message);

    const error = {
      status,
      message,
      extraDetails,
    };

    console.log(error);
    
    next(error);
  }
};

export default validate;
