# Version 1
# base image
FROM node:latest

# maintainer
MAINTAINER wei.zhang3@decathlon.com

#copy
COPY . ./

#RUN npm install

EXPOSE 8111

ENTRYPOINT ["npm","run"]

CMD ["start"]
