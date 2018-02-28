# Introduksjon
Serverless, eller [Function as a Service (FaaS)](https://stackify.com/function-as-a-service-serverless-architecture/), lar oss kjøre kode i containere håndtert av en tredjepart. Det betyr at vi ikke trenger å forholde oss til maskinvare eller hvordan software som kjøres. Vi definerer bare funksjoner som trigges av eventer, for eksempel at en fil har blitt lastet opp eller et vanlig HTTP kall. Den  kanskje mest kjente implementasjonen av Serverless er AWS Lambda. I denne workshoppen utforsker vi mulighetene AWS lambda gir oss og ser på hvordan vi får til effektiv utvikling ved blant annet å kjøre funksjonene lokalt.

![alt text](http://www.rw-designer.com/icon-image/14439-256x256x32.png "Lambda")


# Forberedelser
Vi benytter oss av det råeste, nyeste AWS har å tilby av funksjonalitet. Internettkapasiteten på workshoppen er begrenset, det er derfor viktig at du på forhånd utfører følgende:

1. Sørg for at du har en editor som støtter nodejs debugging, f.eks [Visual Studio Code](https://code.visualstudio.com/) (gratis) eller [IntelliJ Ultimate](https://www.jetbrains.com/idea).
2. Hvis du ikke har allerede, lag en [AWS-konto](https://aws.amazon.com/). 
2. Installer [aws-cli](https://aws.amazon.com/cli/?sc_channel=PS&sc_campaign=acquisition_ND&sc_publisher=google&sc_medium=command_line_b&sc_content=aws_cli_e&sc_detail=aws%20cli&sc_category=command_line&sc_segment=161194456247&sc_matchtype=e&sc_country=ND&s_kwcid=AL!4422!3!161194456247!e!!g!!aws%20cli&ef_id=V671xQAAACZf9KTq:20171119153001:s) (min 1.11). For å kjøre kommandoer opp mot AWS-kontoen din.
3. [Konfigurer](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) aws-cli til å være sammenkoblet med din AWS-konto. 
3. Installer [docker](https://www.docker.com/) (nyeste versjon). For å kjøre lambda-funksjoner lokalt 💪
    * Sjekk at git-repoet er en undermappe av en av mappene som er i listen under fanen "File Sharing" i Docker sine innstillinger.
4. For å kjøre lambda-funksjoner trenger du å installere aws-sam local: ```npm install -g aws-sam-local ```. Verifiser at installasjonen var vellykket ved å kjøre ```sam --version```.
5. Sørg for at docker imaget som brukes er lastet ned på forhånd ved å kjøre: 
```
$ cd del2
$ sam local generate-event api | sam local invoke 'ExampleFunction'
```

# Oppgave 1 - Hello World
For å bli kjent med Lambda og hvordan det brukes starter vi med å lage en enkel lambda-funksjon i AWS Management Console.

## Opprette Lambda-funksjon
1. Gå til Lambda i [AWS Management Console](https://aws.amazon.com/). Velg `Create a function` og `Author from scratch`. Gi Lambda-funksjonen et navn.
2. Bruk nyeste node.js som runtime.
2. Ved oppretting av Lambda-funksjonen må du angi en rolle. Rollen definerer tilgangene til funksjonen din. Dersom du har en eksisterende rolle med nødvendige tilganger kan denne brukes. Oppretting av ny rolle gjøres ved å velge `create a custom role` og opprette rollen `lambda_basic_execution`. [Mer informasjon om rollene finner du her](https://docs.aws.amazon.com/lambda/latest/dg/intro-permission-model.html#lambda-intro-execution-role). Det kan ta noen minutter før rollen blir tilgjengelig.

## Teste lambda-funksjonen
Lambdafunksjonen er nå opprettet og du kan kjøre den, endre koden og konfigurasjonen. Du kan legge til en rekke triggers som bestemmer når funksjonen skal kjøre. I første omgang bruker vi testfunksjonaliteten til Lambda.


1. Klikk på "Test"-knappen for å teste funksjonen. Opprett testevent og test lambda-funksjonen. Legg merke til hvilken informasjon som gis etter kjøringen.
    * Feltene som angis i event-objektet er typisk knyttet til hvordan type trigger det er.

2. Legg til et feltene gold, silver and bronze i testeventen. Fyll inn [norges medaljestatiskk](https://www.vg.no/spesial/2018/ol/medaljer) fra OL.
3. Endre på funksjonen slik at den printer ut det samlede antallet medaljer Norge fikk under OL.


### Miljøvariabler
I Lambda Management Console har man mulighet til å spesifisere miljøvariabler (Environment Variables). Disse miljøvariablene er tilgjengelige fra lambda-funksjonen og gjør det mulig å endre konfigurasjonsinnstillinger uten å måtte gjøre kodeendringer.

6. Opprett en miljøvariabel `environment` og gi den verdien `development`. Endre lambdafunksjonen slik at logging kun skjer dersom environment er `development`.

7. Endre verdien på miljøvariabelen til f.eks `prod`og sjekk at loggen ikke inneholder logginnslaget.


# Oppgave 2 - Utvikle lokalt
I august 2017 lanserte AWS en betaversjon av et kommandolinjeverktøy kalt "AWS SAM Local" som gjør det mulig å utvikle og feilsøke tjenerløse applikasjoner lokalt. I denne oppgaven skal vi bruke dette verktøyet til å finne og fikse en feil i en lambdafunksjon.

Serverless Application Model (SAM) er en utvidelse av [Cloudformation](https://aws.amazon.com/cloudformation/) (AWS sitt svar på Terraform) som forenkler oppsettet av tjenerløse applikasjoner. Filen template.yaml definerer en lambdafunksjon som trigges av kall mot et API. AWS SAM Local kan lese denne filen og opprette de ressursene som er definert der. Mer om det senere.

Lambdafunksjoner kan trigges av ulike hendelser, f.eks. HTTP-kall eller opplasting av filer til en S3-bøtte. SAM Local kan lage slike hendelser for oss. Naviger til mappen "del2" og kjør `sam local generate-event api > event.json`. Filen event.json inneholder nå et eksempel på et HTTP-kall. Denne hendelsen kan vi bruke til å trigge lambdafunksjonen. Kjør `sam local invoke 'ExampleFunction' -e event.json`. Alternativt kan man sende inn hendelsen via stdout slik: `sam local generate-event api | sam local invoke 'ExampleFunction'`. Sjekk at et objekt som inneholder `"body": Incomplete` blir skrevet ut i terminalen.

[API Gateway](https://aws.amazon.com/api-gateway/) kan også kjøres lokalt. Kjør `sam local start-api` og bruk nettleseren, curl e.l. til å sende et HTTP-kall til adressen som blir skrevet ut i terminalen. Sjekk at responsen er den samme som i sted. SAM Local hot-reloader endringer som blir gjort i lambdaen slik at man slipper å restarte API Gateway. Sjekk at dette fungerer ved å endre meldingen som logges og lagre filen. Den nye meldingen skal nå logges i terminalen ved neste HTTP-kall.

Nå skal vi teste ut lokal debugging. Legg til følgende konfigurasjon for debugging i Visual Studio Code (trykk "Debug" og "Open Configurations" i menyen):
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
Kjør `sam local start-api -d 5858`. Gjør deretter et kall til API-endepunktet. Legg til et breakpoint inne i funksjonen din og start debugging i Visual Studio Code (trykk "Debug" og "Start Debugging" i menyen). Rekkefølgen her er viktig. Fiks "feilen" i funksjonen slik at den returnerer statuskode 200 og kan deployes.

## Deploye til AWS

For å deploye til AWS må man ha en S3-bøtte som man kan laste opp lambdafunksjonen til. Denne bøtta må ligge i samme region som lambdafunksjonen skal kjøre i. Opprett en ny bøtte om nødvendig (instrukser for å gjøre dette finner du [her](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/create-bucket.html)). Følgende kommando laster opp lambdafunksjonen til S3 og lager en template-fil som peker på hvor lambda-filen ligger. 
        
```sam package --template-file template.yaml --s3-bucket <name-of-s3-bucket> --output-template-file packaged.yaml```
            
For å deploye lambda-funksjonen og API Gateway kjører man følgende kommando.
        
```sam deploy --template-file packaged.yaml --stack-name <name-of-your-new-stack> --capabilities CAPABILITY_IAM```

Gå til AWS-konsollet og sjekk at lambdafunksjonen og API Gateway har blitt deployet. Test at lambdafunksjonen fungerer ved å gjøre et HTTP-kall mot API Gateway. URL-en til API-et finner du under "Stages - Prod". Dersom man bruker samme klient som ved lokal kjøring skal funksjonen returnere 200 OK.

# Oppgave 3a - Trigge lambda fra S3
Kunden du er innleid hos har inngått en avtale med Oslo Bysykkel om å få levert en dump av bysykkeldata hver måned. Til å begynne med er de interessert i en POC som månedlig rapporterer om den mest brukte sykkelruten fra Vippetangen. De har ikke lagt noen spesielle føringer for valg av teknologi, men er opptatt av at driftskostnadene blir så lave som mulig og at rapporten genereres så snart dataen er tilgjengelig. Oslo bysykkel er fleksible mtp. hvor de skal sende datadumpen, men kan kun garantere at den kommer en eller annen gang i løpet av den første uka hver måned. Du tenker umiddelbart at dette kan løses ved at man trigger en lambda ved opplasting til en S3-bøtte og setter i gang med å kode.

Tips:

* Test funksjonen din lokalt ved å lese testdata.json fra en S3-bøtte.
* ID-en til de to sykkelstativene på Vippetangen er 249 og 278.
* Endre `localRoot` i debug-konfigurasjonen i VS Code til å peke på mappen "del3" istedenfor "del2".
* Kunden er ikke så opptatt av at tallet du returnerer er korrekt. Fokuser heller på å produksjonssette en løsning som demonstrerer hele flyten dersom det blir lite tid.

# Oppgave 3b - Post til slack!
Kunden vil gjerne at straks rådataen er tilgjengelig, så skal beregningen fra forrige oppgave straks postes til slack. Heldigvis for deg har et tidligere konsulenthus glemt igjen filen 'slack.js' i repositoriet vårt. Denne tilbyr en funksjon som gjør nettopp dette. Utvid løsningen fra forrige oppgave med dette. Til slutt deployer du løsningen og laster opp [bysykkeldata](https://developer.oslobysykkel.no/data/24.json) for oktober til S3-bøtta som trigger funksjonen din. Når resultatet av lambdafunksjonen er postet på slack er du ferdig!

Tips:
* Sett ditt eget valgfrie username i config.js.
* Spesifiser slack sin webhook-url i environments. Denne har vi postet på slack :)
* Slack-modulen har en avhengighet til npm-modulen request. Hvordan kan du få denne inn?
