
FROM node:22-alpine


WORKDIR /app

COPY package*.json yarn.lock./

RUN yarn



EXPOSE 5173

CMD yarn run dev --host 0.0.0.0.
