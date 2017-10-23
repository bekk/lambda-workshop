### Idemyldring om innhold

1. Prereqs - info og forberedelser i forkant.
2. Introduksjon.
3. Hello World oppgave med lambda. Bli kjent med interfacet og hva lambda er. Lage et endepunkt for en frontend-tjeneste.
4. Oppgave der du utvikler lokalt.
    1. Oppsett av AWS Cli
    2. Få hello world til å kjøre ?
    3. Lokal debugging med AWS Serverless Application Model
        1. Installer Docker
        2. SAM local requires that the project directory (or any parent directory) is listed in Docker file sharing options.
        3. npm install -g aws-sam-local
        4. sam local generate-event api > event.json
        5. sam local invoke "ExampleFunction" -e event.json
        6. sam local start-api
        7. Gå til adressen som blir printet ut i konsoll-loggen
        8. Sjekk at "OK" printes
        9. Endre meldingen i body i index.js og lagre. Når du nå laster siden på nytt skal den nye meldingen vises.
        10. Legg til en console.log('Logging works'). Lagre og refresh. Meldingen skal bli logget i terminalen/konsollen.
        11. sam local start-api -d 5858
        12. Legg til følgende konfigurasjon for debugging via Visual Studio Code:
        ```
        {
        "name": "Attach to SAM Local",
        "type": "node",
        "request": "attach",
        "address": "localhost",
        "port": 5858,
        "localRoot": "${workspaceRoot}",
        "remoteRoot": "/var/task"
        }
        ```
        13. Legg til et breakpoint et sted inne lambda-funksjonen. Kall funksjonen ved å laste siden på nytt eller ved å bruke en REST-klient (f.eks. Postman eller Advanced Rest Client). Sjekk at eksekveringen av koden stopper ved breakpointet og at du kan inspisere variabler o.l.

5. Oppgave der du kjører mye data og/eller beregninger med Lambda. 