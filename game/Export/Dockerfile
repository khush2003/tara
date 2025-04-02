# Use the official nginx image as the base image
FROM nginx:alpine

# Copy the custom nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the HTML, JavaScript, and other static files to the nginx html directory
COPY . /usr/share/nginx/html

# Expose port 8080 to the outside world
EXPOSE 8082

# Start nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]