import { app } from './app';
import { env } from './setup/env';

app.listen({ port: env.PORT }).then(() => {
  console.log(`HTTP server running on http://localhost:${env.PORT}`);
});
