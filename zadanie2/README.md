# SQL Injection zadanie


## Potrebne pred spustením

- Docker a docker compose, vsetko bezi v kontajneroch (frontend, backend, postgres)

## Spustenie

docker compose up --build

Frontend port: http://localhost:5173
Backend  port: http://localhost:8000

Pre ukončenie:
docker compose down -v;


### Useri v DB:

admin / admin123

jan / heslo123

maria / maria2024


## Scenare

Tlacidla pod formularom, vyplnia polia za mna.

1. Bezne prihlasenie - normalne prihlasenie
2. Obist prihlasenie - username ' OR '1'='1' -- prihlasi bez toho aby som poznal heslo
3. Vytiahnut heslo cez UNION - username ' UNION SELECT password FROM users WHERE username='admin' -- , server mi vrati ako "username" v skutocnosti heslo admina
4. Zmenit cudzie heslo cez stacked query - vlozi sa druhy prikaz do dotazu, ktory potichu zmeni heslo pouzivatela jan, hoci ja sa prihlasujem ako admin

Pod formularom je live ukazla ako presne vyzera SQL dotaz, ktory sa posiela, a po odoslani aj aktualny stav celej tabulky users, takze vidno aj co sa zmenilo na pozadi.

V secure rezime ziadny z tychto payloadov nefunguje, vstup sa berie len ako obycajny text.
