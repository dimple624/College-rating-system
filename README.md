College Rating System  

Overview  
This is a web-based application where students can rate their colleges anonymously based on various aspects like campus, placement, faculty, hostel, food, and more.  

Features  
 User authentication (Signup/Login ) 
 Search for colleges  
 Submit and view anonymous ratings  
 Categories include campus, placement, infrastructure, hostel, food, etc.  
 Responsive design  

Tech Stack  
Frontend: HTML, CSS, JavaScript  
Backend: Node.js, Express.js  
Database: MongoDB  

Installation  

1. Clone the Repository  
```sh
git clone https://github.com/your-username/college-rating-system.git
cd college-rating-system
```

2. Install Dependencies  
```
npm install
```

3. Set Up Environment Variables  
Create a `.env` file in the root directory and add:  
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

4. Start the Server  
```
node backend/server.js
```
5. Open in Browser  
Go to `http://localhost:5000`  

  
