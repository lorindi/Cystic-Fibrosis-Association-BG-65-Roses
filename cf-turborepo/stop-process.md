# Намерете Node.js процесите
Get-Process node

# За по-подробна информация с портовете
netstat -ano | findstr "3000 8888"

# Прекратете процеса по ID (заменете PID с ID на процеса)
taskkill /F /PID PID


# Спрете процеси с високо натоварване на CPU и памет (вероятно са Вашите приложения)
# Например, процеси с ID 5004, 13000, 17192, 18364, 22780 имат високо потребление

taskkill /F /PID 5004
taskkill /F /PID 13000
taskkill /F /PID 17192
taskkill /F /PID 18364
taskkill /F /PID 22780



# Спира всички Node.js процеси
taskkill /F /IM node.exe



netstat -ano | findstr "3000"
netstat -ano | findstr "8888"


FOR /F "tokens=5" %p IN ('netstat -ano ^| findstr ":3000"') DO taskkill /F /PID %p
FOR /F "tokens=5" %p IN ('netstat -ano ^| findstr ":8888"') DO taskkill /F /PID %p