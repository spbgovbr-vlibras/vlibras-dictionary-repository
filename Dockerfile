FROM node:dubnium-alpine AS build

RUN apk --no-cache add python make g++

COPY . /src
WORKDIR /src

RUN npm ci \
  && npm run build \
  && npm prune --production

FROM node:dubnium-alpine

COPY --from=build /src/dist dist
COPY --from=build /src/node_modules node_modules
COPY --from=build /src/.sequelizerc .sequelizerc
COPY --from=build /src/scripts/sysinit.sh sysinit.sh

ENV DEBUG vlibras-dictionary-*:*
ENV NODE_ENV production

CMD ["/bin/sh", "sysinit.sh"]
