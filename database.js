const { connect } = require("mongoose");

module.exports = (mongoUrl) => {
  connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(`Connected to DB`);
    })
    .catch((error) => {
      console.log("DB Error: ", error);
    });
};
