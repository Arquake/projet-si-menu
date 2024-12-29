
id (pk) (uuid)
username (/^[\w]{4,32}$/) (Unique)
email (/^[\w\-\.]+@(?:[\w-]+\.)+[\w-]{2,4}$/) (Unique)
password (hashed /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,32}$/)