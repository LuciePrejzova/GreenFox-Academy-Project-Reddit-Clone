import "dotenv/config";
import {app} from "./server.js";
import sequelize from "./config/index.js";
import 'regenerator-runtime/runtime.js'

const PORT = process.env.SERVER_PORT;


(async () => {
  await sequelize.sync();
})();

app.listen(PORT, () => {
  console.log(
    `Express started on http://localhost:${PORT}` +
      "; press Ctrl-C to terminate..."
  );
});

  

