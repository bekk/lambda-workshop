# Introduksjon

# Forberedelser
Vi benytter oss av det råeste og nyeste AWS har å tilby av funksjoner. Det er derfor nødvendig å installere nyeste versjon av: 
* aws-cli (min 1.11)
* docker (nyeste versjon)
* Sjekk at git-repoet er en undermappe av en av mappene som er i listen under fanen "File Sharing" i Docker sine innstillinger.
* npm install -g aws-sam-local
* Verifiser at installasjonen var vellykket ved å kjøre "sam --version"

# Oppgave 1 - Hello World
Lambda lar deg kjøre kode uten at må forholde deg til servere. Du laster opp koden din, og Lambda tar seg av eksekvering og skalering. For å bli kjent med Lambda og hvordan det brukes starter vi med å lage en enkel lambda-funksjon i AWS Management Console. 

## Opprette Lambda-funksjon
1. Gå til Lambda i AWS Management Console. Velg `Create a function` og `Author from scratch`. Gi Lambda-funksjonen et navn.

### Rolle
2. Ved oppretting av Lambda-funksjonen må du angi en rolle. Rollen definerer tilgangene til funksjonen din. Dersom du har en eksisterende rolle med nødvendige tilganger kan denne brukes. 

Oppretting av ny rolle gjøres ved å velge `create a custom role` og opprette rollen `lambda_basic_execution`. [Mer informasjon om rollene finner du her](https://docs.aws.amazon.com/lambda/latest/dg/intro-permission-model.html#lambda-intro-execution-role). Det kan ta noen minutter før rollen blir tilgjengelig.

## Teste lambda-funksjonen
Lambdafunksjonen er nå opprettet og du kan kjøre den, endre koden og konfigurasjonen. Gjør deg kjent med hvilke konfigurasjonsendringer du har mulighet til å gjøre.


### Test events
3. Klikk på "Test"-knappen for å teste funksjonen. Opprett testevent og test lambda-funksjonen. Legg merke til hvilken informasjon som gis etter kjøringen. 

Feltene som angis i eventen kan brukes i Lambdafunksjonen.

4. Legg til et felt ´navn´ i testeventen. Endre på lambdafunksjonen slik at responsen inneholder navnet fra eventen.

### Logging
CloudWatch brukes for å håndtere logging, og du finner oversikt over logginnslagene under `Log Output`.

5. Legg til logging i lambda-funksjonen din og test lambdafunksjonen på nytt. F.eks `console.log("Dev logging");`


### Miljøvariabler
I Lambda Management Console har man mulighet til å spesifisere miljøvariabler (Environment Variables). Disse miljøvariablene er tilgjengelige fra lambda-funksjonen og gjør det mulig å endre konfigurasjonsinnstillinger uten å måtte gjøre kodeendringer.

6. Opprett en miljøvariabel `environment` og gi den verdien `dev`. Endre lambdafunksjonen slik at logging kun skjer dersom environment er `dev`. 

7. Endre verdien på miljøvariabelen til f.eks `prod`og sjekk at loggen ikke inneholder logginnslaget.


# Del 2 - Utvikle lokalt
I august 2017 lanserte AWS en betaversjon av et kommandolinjeverktøy kalt "AWS SAM Local" som gjør det mulig å utvikle og feilsøke tjenerløse applikasjoner lokalt. I denne oppgaven skal vi bruke dette verktøyet til å finne og fikse en feil i en lambdafunksjon.

Serverless Application Model (SAM) er en utvidelse av Cloudformation (AWS sitt svar på Terraform) som forenkler oppsettet av tjenerløse applikasjoner. Filen template.yaml definerer en lambdafunksjon som trigges av kall mot et API. AWS SAM Local kan lese denne filen og opprette de ressursene som er definert der. Mer om det senere.

Lambdafunksjoner kan trigges av ulike hendelser, f.eks. HTTP-kall eller opplasting av filer til en S3-bøtte. SAM Local kan lage slike hendelser for oss. Kjør `sam local generate-event api > event.json`. Filen event.json inneholder nå et eksempel på et HTTP-kall. Denne hendelsen kan vi bruke til å trigge lambdafunksjonen. Kjør `sam local invoke 'ExampleFunction' -e event.json`. Alternativt kan man sende inn hendelsen via stdout slik: `sam local generate-event api | sam local invoke 'ExampleFunction'`. Sjekk at et objekt som inneholder `"body": Incomplete` blir skrevet ut i terminalen.

API Gateway kan også kjøres lokalt. Kjør `sam local start-api` og bruk nettleseren, curl e.l. til å sende et HTTP-kall til adressen som blir skrevet ut i terminalen. Sjekk at responsen er den samme som i sted. SAM Local hot-reloader endringer som blir gjort i lambdaen slik at man slipper å restarte API Gateway. Sjekk at dette fungerer ved å endre meldingen som logges og lagre filen. Den nye meldingen skal nå logges i terminalen ved neste HTTP-kall.

Nå skal vi teste ut lokal debugging. Legg til følgende konfigurasjon for debugging i Visual Studio Code:
```json
{
"name": "Attach to SAM Local",
"type": "node",
"request": "attach",
"address": "localhost",
"port": 5858,
"localRoot": "${workspaceRoot}/del2",
"remoteRoot": "/var/task"
}
```
Kjør `sam local start-api -d 5858`. Gjør deretter et kall til API-endepunktet. Legg til et breakpoint inne i funksjonen din og start debugging i Visual Studio Code. Rekkefølgen her er viktig. Fiks "feilen" i funksjonen slik at den returnerer statuskode 200 og kan deployes.

For å deploye til AWS må man ha en S3-bøtte som man kan laste opp lambdafunksjonen til. Denne bøtta må ligge i samme region som lambdafunksjonen skal kjøre i. Opprett en ny bøtte om nødvendig. Følgende kommando laster opp lambdafunksjonen til S3 og lager en template-fil som peker på hvor lambda-filen ligger. 
        
```sam package --template-file template.yaml --s3-bucket <name-of-s3-bucket> --output-template-file packaged.yaml```
            
For å deploye lambda-funksjonen og API Gateway kjører man følgende kommando.
        
```sam deploy --template-file packaged.yaml --stack-name <name-of-your-new-stack> --capabilities CAPABILITY_IAM```

Gå til AWS-konsollet og sjekk at lambdafunksjonen og API Gateway har blitt deployet. Test at lambdafunksjonen fungerer ved å gjøre et HTTP-kall mot API Gateway. URL-en til API-et finner du under "Stages - Prod". Dersom man bruker samme klient som ved lokal kjøring skal funksjonen returnere 200 OK.

# Del 3
Kunden du er innleid hos har inngått en avtale med Oslo Bysykkel om å få levert en dump av bysykkeldata hver måned. Til å begynne med er de interessert i en POC som månedlig rapporterer om den mest brukte sykkelruten fra Vippetangen. De har ikke lagt noen spesielle føringer for valg av teknologi, men er opptatt av at driftskostnadene blir så lave som mulig og at rapporten genereres så snart dataen er tilgjengelig. Oslo bysykkel er fleksible mtp. hvor de skal sende datadumpen, men kan kun garantere at den kommer en eller annen gang i løpet av den første uka hver måned. Du tenker umiddelbart at dette kan løses ved at man trigger en lambda ved opplasting til en S3-bøtte og setter i gang med å kode.

Tips:

* Test funksjonen din lokalt ved å lese testdata.json fra en S3-bøtte.
* ID-en til de to sykkelstativene på Vippetangen er 249 og 278.

## Post til slack!
Det er et krav fra kunden at outputen fra lambdaen skal postes som en melding til slack. Heldigvis for deg har et tidligere konsulenthus glemt igjen filen 'slack.js' i repositoriet vårt. Denne tilbyr en funksjon som gjør nettopp dette. Importer denne filen inn i s3-lambda.js.

NB! Husk å:
* Sett ditt eget valgfrie username i config.js.
* Spesifiser slack sin webhook-url i environments. Denne har vi postet på slack :)
