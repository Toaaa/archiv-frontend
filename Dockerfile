FROM node:alpine as build
WORKDIR /app
COPY . .
RUN npm i && \
    source .env && \
    if [[ -n "$VITE_FRONTEND_URL" && "$VITE_ALLOW_SEARCH_INDEXING" == "true" ]]; then echo -e "User-agent: *\nDisallow:\n\nSitemap: ${VITE_FRONTEND_URL}/sitemap.xml" > static/robots.txt; else echo -e "User-agent: *\nDisallow: /" > static/robots.txt; fi && \
    npm run build && \
    npm prune --omit=dev

FROM node:alpine
USER node:node
WORKDIR /app
COPY --from=build --chown=node:node /app/build ./build
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json .
CMD ["node","build"]
