const app = require("./app");
const PORT = process.env.PORT || 3131;

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});