const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(422).json({ message: error.details[0].message }); //422-unprocessable content
  } else {
    next();
  }
};

export default validate;
