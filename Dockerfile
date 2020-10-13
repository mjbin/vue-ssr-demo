COPY server/ /var/www/server/
COPY dist/ /var/www/dist/
COPY public/ /var/www/public/
# COPY manifest.json /var/www/manifest.json
COPY src/index.template.html /var/www/src/index.template.html
COPY yarn.lock /var/www/yarn.lock

WORKDIR /var/www
RUN yarn

ENV NODE_ENV production

EXPOSE 8080

ENTRYPOINT ["node", "server"]
