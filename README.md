# Introduksjon

# Forberedelser
Vi benytter oss av det råeste og nyeste AWS har å tilby av funksjoner. Det er derfor nødvendig å installere nyeste versjon av: 
* aws-cli (min 1.11)
* docker (nyeste versjon)
* Sjekk at git-repoet er en undermappe av en av mappene som er i listen under fanen "File Sharing" i Docker sine innstillinger.
* npm install -g aws-sam-local
* Verifiser at installasjonen var vellykket ved å kjøre "sam --version"

# Oppgave 1 - Hello World
3. Hello World oppgave med lambda. Bli kjent med interfacet og hva lambda er. Lage et endepunkt for en frontend-tjeneste.
    1. Gå til Lambda i AWS Management Console 
    2. Velg "Create a function"
    3. Velg "Author from scratch" og fyll inn navn. 
    4. Create custome role (lambda_basic_execution)
    5. Lag testevent og test lambdafunksjonen
    6. Legg til et felt ´navn´ i testeventen. Endre lambdafunksjonen slik at responsen inneholder navnet.
    7. Legg til en miljøvariabel og ta den i bruk i lambdafunksjonen.

# Del 2 - Utvikle lokal
I august 2017 lanserte AWS en betaversjon av et kommandolinjeverktøy kalt "AWS SAM Local" som gjør det mulig å utvikle og feilsøke tjenerløse applikasjoner lokalt. I denne oppgaven skal vi bruke dette verktøyet til å finne og fikse en feil i en lambdafunksjon.

Serverless Application Model (SAM) er en utvidelse av Cloudformation (AWS sitt svar på Terraform) som forenkler oppsettet av tjenerløse applikasjoner. Filen template.yaml definerer en lambdafunksjon som trigges av kall mot et API. AWS SAM Local kan lese denne filen og opprette de ressursene som er definert der. Mer om det senere.

Lambdafunksjoner kan trigges av ulike hendelser, f.eks. HTTP-kall eller opplasting av filer til en S3-bøtte. SAM Local kan lage slike hendelser for oss. Kjør "sam local generate-event api > event.json". Filen event.json inneholder nå et eksempel på et HTTP-kall. Denne hendelsen kan vi bruke til å trigge lambdafunksjonen. Kjør "sam local invoke "ExampleFunction" -e event.json".

        6. sam local start-api
        7. Gå til adressen som blir printet ut i konsoll-loggen
        8. Sjekk at "OK" printes
        9. Endre meldingen i body i index.js og lagre. Når du nå laster siden på nytt skal den nye meldingen vises.
        10. Legg til en console.log('Logging works'). Lagre og refresh. Meldingen skal bli logget i terminalen/konsollen.
        11. Nå skal vi teste ut lokal debugging. 
        Legg til følgende konfigurasjon for debugging via Visual Studio Code:
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
        12. Kjør sam local start-api -d 5858. Gjør deretter et kall til API-endepunktet. Legg til et breakpoint inne i funksjonen din og start debugging i Visual Studio Code. Rekkefølgen her er viktig. Sjekk at eksekveringen av koden stopper ved breakpointet og at du kan inspisere variabler o.l.
        13. For å deploye til AWS må man først opprette en S3-bøtte som man kan laste opp lambda-funksjonen til. Pass på at S3-bøtta ligger i samme region som lambdaen du skal deploye. Følgende kommando laster opp lambda-funksjonen til S3 og lager en template fil som peker på hvor lambda-filen ligger. 
        
            `sam package --template-file template.yaml --s3-bucket ${nameOfS3Bucket} --output-template-file packaged.yaml`
            
            For å deploye lambda-funksjonen og API Gateway kjører man følgende kommando.
        
            `sam deploy --template-file packaged.yaml --stack-name ${nameOfYourNewStack} --capabilities CAPABILITY_IAM`
        14. For å deploye til AWS må man først opprette en S3-bøtte som man kan laste opp lambda-funksjonen til. Følgende kommando laster opp lambda-funksjonen til S3 og lager en template fil som peker på hvor lambda-filen ligger. 
        
            `sam package --template-file template.yaml --s3-bucket ${nameOfS3Bucket} --output-template-file packaged.yaml`
            
        For å deploye lambda-funksjonen og API Gateway kjører man følgende kommando.
        
            `sam deploy --template-file packaged.yaml --stack-name ${nameOfYourNewStack} --capabilities CAPABILITY_IAM`

5. Oppgave der du kjører mye data og/eller beregninger med Lambda. 

Test your S3 lambda by running "sam local invoke 'S3Function' -e s3-event.json --template s3-template.yaml"∏



## Post til slack!
Det er et krav fra kunden at outputen fra lambdaen skal postes som en melding til slack. Heldigvis for deg har et tidligere konsulenthus glemt igjen filen 'slack.js' i repositoriet vårt. Denne tilbyr en funksjon som gjør nettopp dette. Importer denne filen inn i index.js.

NB! Husk å:
* Sett ditt eget valgfrie username i config.js.
* Spesifiser slack sin webhook-url i environments. Denne har vi postet på slack :)
