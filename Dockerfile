FROM node:18

WORKDIR /usr/src/web

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_CHANNELTALK_KEY
RUN touch .env.production
RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" >> .env.production
RUN echo "NEXT_PUBLIC_CHANNELTALK_KEY=$NEXT_PUBLIC_CHANNELTALK_KEY" >> .env.production


EXPOSE 3000

CMD ["npm", "run", "start"]