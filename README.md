## Teddy
# Inspiration
Going through thousands of user input data to label genetic cancer risk is tedious and inefficient. Because it requires both time and genetic expertise to classify genetic risk, the task itself wastes the time of genetic experts that could be spent in risk prevention research. To make matters worse, current data is not standardized and provide challenges to interpreting exactly what information patients were trying to give. Thus, to address these issues, we built a robust end-to-end interactive framework to assist genetic counselors with input sanitation and autonomous risk prediction.
# What it does
Teddy. offers an innovative platform that provides patients with a easy-to-use dashboard for autonomous genetic risk prediction, and it offers medical professionals an all-inclusive web app to analyze patient risk and past patient data. Through the intuitive administrator interface, medical professionals can view patients' information easily and effectively.
# How we built it
Our front end web app was made using Next.js and React. We created a backend artificial neural network using the Keras library from Tensorflow2.0. To store our data, we used the PostgreSQL database and integrated key security features such as token-based authentication, input sanitation, anti-proxy servers, as well as Cross-Origin Resource Sharing to prevent any malicious attacks or abuse. Then we created a Flask/Golang Rest API to allow easy and secure communication between our front end and back end frameworks. 
# Challenges we ran into
While developing our platform, we ran into a couple issues on both the PostgreSQL and machine learning model. Due to the nature of the data given in this challenge, it was incredibly difficult to train an accurate model. However, we overcame this by constructing a natural language processing feature that standardized most of the data that was given. Thus, any typos and inconsistencies were resolved, and we were able to train a model that boasts a 77% accuracy. Keep in mind that this number was tested on 25% of the dataset and many key machine learning models were implemented to prevent overfitting. Thus, we can confidently say that our evaluation provides a real metric of our model accuracy. Additionally, to collect future data, we implemented smart input sanitation and validation techniques to prevent malicious database queries and to make sure new data is standardized and useful.
# Accomplishments that we're proud of
Overall, we're proud of our adaptability through this challenge. Although the data was incredibly difficult to process and make sense of, we implemented a way to correct existing data and prevent invalid entries for future data points. Not to mention, we went beyond the challenge and developed an all inclusive web app that assists both patients and medical professionals and allows for them to communicate with each other directly within the app. Additionally, we constructed a login framework that allows users to save their entries to prevent redundancy. Lastly, we realized the importance of security and developed a series of security measures to prevent illegal access to critical information. All in all, our app is a complete, secure, and working app that is currently deployed on the internet for anyone to use.
# What we learned
Through this challenge, we realized the reality of most databases that are key to various health infrastructures. Much like the previous datasets we have worked with, we expected the dataset given in this challenge to be cleaned up and consistent throughout. However, we were quickly faced with the harsh truth. Through this incredibly challenging dataset that Hudson Alpha gave us, we were able to realize how to deal with inconsistent data and develop a working and accurate model to assist medical professionals and genetic counselors.
# What's next for Teddy.
In the future, we hope to develop a more robust model with new data that our web app collects. By crowdsourcing familial data and genetic expertise, we can train a much more accurate model to further assist both the general population and genetic counselors. Additionally, we hope offer more features to direct patients to clinics that can provide genetic testing and advice.
# Whats Teddy?
Teddy is a Machine Learning powered application to help the diagnosis of cancer.  
It accomplishes so by combining data about past diagnosis and ancestry history with the illness.  
# How was Teddy created?
Teddy was created using a pretty complex technology stack, which is comprised of:
- An API made with Golang to create, request, update and delete data
- A PostgreSQL database to store the data
- A Keras model that makes prediction based on the data
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
