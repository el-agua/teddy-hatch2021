# Whats Teddy?
Teddy is a Machine Learning powered application to help the diagnosis of cancer.  
It accomplishes so by combining data about past diagnosis and ancestry history with the illness.  
# How was Teddy created?
Teddy was created using a pretty complex technology stack, which is comprised of:
- An API made with Golang to create, request, update and delete data
- A PostgreSQL database to store the data
- A Tensorflow model that makes prediction based on the data
- And a NEXT.js frontend to diplay the data to the client
# Is my information on Teddy safe from hackers?
The dev team developed the application in a security-driven mindset to ensure that your information won't be realeased to the public.  
We have used tecniques such as:
- Input sanitization and validation to mitigate malicious database queries (SQLi)
- Reverse proxy servers and CORS to mitigate denial of serice attack and abuse from remote sources
- Encrypted token-based authentification to ensure that malicious actors cannot take control over user accounts

# Who made Teddy and why?
Teddy was made by a team of high schoolers with computer science at their heart to solve a major health issue.

# Demo
Teddy can be demoed at: https://teddyapp.vercel.app/
