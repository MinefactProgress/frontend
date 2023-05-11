/* eslint-disable react/no-unescaped-entities */

import {
  Alert,
  Anchor,
  Button,
  Center,
  Code,
  Container,
  Group,
  List,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconCookie } from "@tabler/icons";

import { Page } from "../components/Page";
import useCookie from "../hooks/useCookie";

const Privacy = () => {
  const cookie = useCookie();
  return (
    <Page name="Privacy Policy" icon={<IconCookie />}>
      <Container py="xl">
        <Title order={1} py="xl">
          Datenschutzerklärung
        </Title>

        <Alert
          icon={<IconAlertCircle />}
          title="Ihr Cookie Status"
          color="primary"
          m="md"
          p="md"
        >
          {cookie.consent
            ? "Sie haben der Benutzung von Funktionalen Cookies in diesem Browser zugestimmt. Sie können diese Berechtigung jederzeit über die Schaltfläche unten zurückziehen."
            : "Sie haben der Benutzung von Funktionalen Cookies in diesem Browser nicht zugestimmt. Sie können diese Berechtigung jederzeit über die Schaltfläche unten oder über das Banner erteilen oder ablehnen."}
          <Group mt="md">
            <Button variant="outline" onClick={() => cookie.setConsent(true)}>
              Cookies akzeptieren
            </Button>
            <Button variant="default" onClick={() => cookie.setConsent(false)}>
              Cookies ablehnen
            </Button>
          </Group>
        </Alert>
        <Title order={2} py="lg" id="präambel">
          Präambel
        </Title>
        <Text>
          Mit der folgenden Datenschutzerklärung möchten wir Sie darüber
          aufklären, welche Arten Ihrer personenbezogenen Daten (nachfolgend
          auch kurz als "Daten“ bezeichnet) wir zu welchen Zwecken und in
          welchem Umfang im Rahmen der Bereitstellung unserer Applikation und
          Dienstleistung verarbeiten.
        </Text>
        <Text>
          Die verwendeten Begriffe sind nicht geschlechtsspezifisch. Als DSGVO
          wird hierbei die Datenschutzgrundverordnung der Europäischen Union
          bezeichnet.
        </Text>
        <br />
        <Text>Stand: 11. Mai 2023</Text>
        <Title order={2} py="lg">
          Inhaltsübersicht
        </Title>
        <List withPadding spacing="sm">
          <List.Item>
            <Anchor className="index-link" href="#präambel">
              Präambel
            </Anchor>
          </List.Item>
          <List.Item>
            <Anchor className="index-link" href="#verarbeitung">
              Übersicht der Verarbeitungen
            </Anchor>
          </List.Item>
          <List.Item>
            <Anchor className="index-link" href="#rechtsgrundlage">
              Maßgebliche Rechtsgrundlagen
            </Anchor>
          </List.Item>
          <List.Item>
            <Anchor className="index-link" href="#sicherheitsmaßnahmen">
              Sicherheitsmaßnahmen
            </Anchor>
          </List.Item>
          <List.Item>
            <Anchor className="index-link" href="#daten">
              Übermittlung von personenbezogenen Daten
            </Anchor>
          </List.Item>
          <List.Item>
            <Anchor className="index-link" href="#löschung">
              Löschung von Daten
            </Anchor>
          </List.Item>
          <List.Item>
            <Anchor className="index-link" href="#cookies">
              Einsatz von Cookies
            </Anchor>
          </List.Item>
          <List.Item>
            <Anchor className="index-link" href="#bereitstellung">
              Bereitstellung des Onlineangebotes und Webhosting
            </Anchor>
          </List.Item>
          <List.Item>
            <Anchor className="index-link" href="#konto">
              Registrierung, Anmeldung und Nutzerkonto
            </Anchor>
          </List.Item>
          <List.Item>
            <Anchor className="index-link" href="#kontakt">
              Kontakt- und Anfragenverwaltung
            </Anchor>
          </List.Item>
          <List.Item>
            <Anchor className="index-link" href="#plugins">
              Plugins und eingebettete Funktionen sowie Inhalte
            </Anchor>
          </List.Item>
          <List.Item>
            <Anchor className="index-link" href="#änderung">
              Änderung und Aktualisierung der Datenschutzerklärung
            </Anchor>
          </List.Item>
        </List>

        <Title order={2} py="lg" id="verarbeitung">
          Übersicht der Verarbeitungen
        </Title>
        <Text>
          Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und
          die Zwecke ihrer Verarbeitung zusammen.
        </Text>

        <Title order={3} py="sm">
          Arten der verarbeiteten Daten
        </Title>
        <List withPadding>
          <List.Item>Bestandsdaten</List.Item>
          <List.Item>Kontaktdaten</List.Item>
          <List.Item>Inhaltsdaten</List.Item>
          <List.Item>Nutzungsdaten</List.Item>
          <List.Item>Meta-, Kommunikations- und Verfahrensdaten</List.Item>
        </List>

        <Title order={3} py="sm">
          Kategorien betroffener Personen
        </Title>
        <List withPadding>
          <List.Item>registrierte Nutzer</List.Item>
          <List.Item>einmalige Besucher</List.Item>
        </List>

        <Title order={3} py="sm">
          Zwecke der Verarbeitung
        </Title>
        <List withPadding>
          <List.Item>
            Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit
          </List.Item>
          <List.Item>Kontaktanfragen und Kommunikation</List.Item>
          <List.Item>Sicherheitsmaßnahmen</List.Item>
          <List.Item>Verwaltung und Beantwortung von Anfragen</List.Item>
          <List.Item>Feedback</List.Item>
          <List.Item>Informationstechnische Infrastruktur</List.Item>
        </List>

        <Title order={2} py="lg" id="rechtsgrundlage">
          Maßgebliche Rechtsgrundlagen
        </Title>
        <Text>
          Im Folgenden erhalten Sie eine Übersicht der Rechtsgrundlagen der
          DSGVO, auf deren Basis wir personenbezogene Daten verarbeiten. Bitte
          nehmen Sie zur Kenntnis, dass neben den Regelungen der DSGVO nationale
          Datenschutzvorgaben in Ihrem bzw. unserem Wohn- oder Sitzland gelten
          können. Sollten ferner im Einzelfall speziellere Rechtsgrundlagen
          maßgeblich sein, teilen wir Ihnen diese in der Datenschutzerklärung
          mit.
        </Text>
        <List withPadding py="md">
          <List.Item>
            <strong>
              Vertragserfüllung und vorvertragliche Anfragen{" "}
              <Code>Art. 6 Abs. 1 S. 1 lit. b) DSGVO</Code>
            </strong>
            - Die Verarbeitung ist für die Erfüllung eines Vertrags, dessen
            Vertragspartei die betroffene Person ist, oder zur Durchführung
            vorvertraglicher Maßnahmen erforderlich, die auf Anfrage der
            betroffenen Person erfolgen.
          </List.Item>
          <List.Item>
            <strong>
              Berechtigte Interessen{" "}
              <Code>Art. 6 Abs. 1 S. 1 lit. f) DSGVO</Code>
            </strong>
            - Die Verarbeitung ist zur Wahrung der berechtigten Interessen des
            Verantwortlichen oder eines Dritten erforderlich, sofern nicht die
            Interessen oder Grundrechte und Grundfreiheiten der betroffenen
            Person, die den Schutz personenbezogener Daten erfordern,
            überwiegen.
          </List.Item>
        </List>
        <Text>
          Zusätzlich zu den Datenschutzregelungen der DSGVO gelten nationale
          Regelungen zum Datenschutz in Deutschland. Hierzu gehört insbesondere
          das Gesetz zum Schutz vor Missbrauch personenbezogener Daten bei der
          Datenverarbeitung (Bundesdatenschutzgesetz - BDSG). Das BDSG enthält
          insbesondere Spezialregelungen zum Recht auf Auskunft, zum Recht auf
          Löschung, zum Widerspruchsrecht, zur Verarbeitung besonderer
          Kategorien personenbezogener Daten, zur Verarbeitung für andere Zwecke
          und zur Übermittlung sowie automatisierten Entscheidungsfindung im
          Einzelfall einschließlich Profiling. Des Weiteren regelt es die
          Datenverarbeitung für Zwecke des Beschäftigungsverhältnisses (
          <Code>§ 26 BDSG</Code>), insbesondere im Hinblick auf die Begründung,
          Durchführung oder Beendigung von Beschäftigungsverhältnissen sowie die
          Einwilligung von Beschäftigten. Ferner können Landesdatenschutzgesetze
          der einzelnen Bundesländer zur Anwendung gelangen.
        </Text>

        <Title order={2} py="lg" id="sicherheitsmaßnahmen">
          Sicherheitsmaßnahmen
        </Title>
        <Text>
          Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter
          Berücksichtigung des Stands der Technik, der Implementierungskosten
          und der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung
          sowie der unterschiedlichen Eintrittswahrscheinlichkeiten und des
          Ausmaßes der Bedrohung der Rechte und Freiheiten natürlicher Personen
          geeignete technische und organisatorische Maßnahmen, um ein dem Risiko
          angemessenes Schutzniveau zu gewährleisten.
          <br />
          <br />
          Zu den Maßnahmen gehören insbesondere die Sicherung der
          Vertraulichkeit, Integrität und Verfügbarkeit von Daten durch
          Kontrolle des physischen und elektronischen Zugangs zu den Daten als
          auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe, der
          Sicherung der Verfügbarkeit und ihrer Trennung. Des Weiteren haben wir
          Verfahren eingerichtet, die eine Wahrnehmung von Betroffenenrechten,
          die Löschung von Daten und Reaktionen auf die Gefährdung der Daten
          gewährleisten. Ferner berücksichtigen wir den Schutz personenbezogener
          Daten bereits bei der Entwicklung bzw. Auswahl von Hardware, Software
          sowie Verfahren entsprechend dem Prinzip des Datenschutzes, durch
          Technikgestaltung und durch datenschutzfreundliche Voreinstellungen.
          <br />
          <br />
          Um Ihre via unserem Online-Angebot übermittelten Daten zu schützen,
          nutzen wir eine TLS-Verschlüsselung. Sie erkennen derart
          verschlüsselte Verbindungen an dem Präfix <i>https://</i> in der
          Adresszeile Ihres Browsers. Wir bitten sie, sofern möglich, unsere
          Angebote nur über obiges Verschlüsselungsprotokoll aufzurufen.
        </Text>

        <Title order={2} py="lg" id="daten">
          Übermittlung von personenbezogenen Daten
        </Title>
        <Text>
          Im Rahmen unserer Verarbeitung von personenbezogenen Daten kommt es
          vor, dass die Daten an andere Stellen, Unternehmen, rechtlich
          selbstständige Organisationseinheiten oder Personen übermittelt oder
          sie ihnen gegenüber offengelegt werden. Zu den Empfängern dieser Daten
          können z.B. mit IT-Aufgaben beauftragte Dienstleister oder Anbieter
          von Diensten und Inhalten, die in eine Webseite eingebunden werden,
          gehören. In solchen Fällen beachten wir die gesetzlichen Vorgaben und
          schließen insbesondere entsprechende Verträge bzw. Vereinbarungen, die
          dem Schutz Ihrer Daten dienen, mit den Empfängern Ihrer Daten ab.
        </Text>

        <Title order={2} py="lg" id="löschung">
          Löschung von Daten
        </Title>
        <Text>
          Die von uns verarbeiteten Daten werden nach Maßgabe der gesetzlichen
          Vorgaben gelöscht, sobald deren zur Verarbeitung erlaubten
          Einwilligungen widerrufen werden oder sonstige Erlaubnisse entfallen
          (z.B. wenn der Zweck der Verarbeitung dieser Daten entfallen ist oder
          sie für den Zweck nicht erforderlich sind). Sofern die Daten nicht
          gelöscht werden, weil sie für andere und gesetzlich zulässige Zwecke
          erforderlich sind, wird deren Verarbeitung auf diese Zwecke
          beschränkt. D.h., die Daten werden gesperrt und nicht für andere
          Zwecke verarbeitet. Das gilt z.B. für Daten, die aus handels- oder
          steuerrechtlichen Gründen aufbewahrt werden müssen oder deren
          Speicherung zur Geltendmachung, Ausübung oder Verteidigung von
          Rechtsansprüchen oder zum Schutz der Rechte einer anderen natürlichen
          oder juristischen Person erforderlich ist.
          <br />
          <br />
          Unsere Datenschutzhinweise können ferner weitere Angaben zu der
          Aufbewahrung und Löschung von Daten beinhalten, die für die jeweiligen
          Verarbeitungen vorrangig gelten.
        </Text>
        <Title order={2} py="lg" id="cookies">
          Einsatz von Cookies
        </Title>
        <Alert
          icon={<IconAlertCircle />}
          title="Ihr Cookie Status"
          color="primary"
          m="md"
          p="md"
        >
          {cookie.consent
            ? "Sie haben der Benutzung von Funktionalen Cookies in diesem Browser zugestimmt. Sie können diese Berechtigung jederzeit über die Schaltfläche unten zurückziehen."
            : "Sie haben der Benutzung von Funktionalen Cookies in diesem Browser nicht zugestimmt. Sie können diese Berechtigung jederzeit über die Schaltfläche unten oder über das Banner erteilen oder ablehnen."}
          <Group mt="md">
            <Button variant="outline" onClick={() => cookie.setConsent(true)}>
              Cookies akzeptieren
            </Button>
            <Button variant="default" onClick={() => cookie.setConsent(false)}>
              Cookies ablehnen
            </Button>
          </Group>
        </Alert>
        <Text>
          Cookies sind kleine Textdateien, bzw. sonstige Speichervermerke,
          sogenannte Session Storages, die Informationen auf Endgeräten
          speichern und Informationen aus den Endgeräten auslesen. Z.B. um den
          Login-Status in einem Nutzerkonto, einen Warenkorbinhalt in einem
          E-Shop, die aufgerufenen Inhalte oder verwendete Funktionen eines
          Onlineangebotes speichern. Cookies können ferner zu unterschiedlichen
          Zwecken eingesetzt werden, z.B. zu Zwecken der Funktionsfähigkeit,
          Sicherheit und Komfort von Onlineangeboten sowie der Erstellung von
          Analysen der Besucherströme.
        </Text>

        <Title order={3} py="sm">
          Hinweise zur Einwilligung
        </Title>
        <Text>
          Wir setzen Cookies im Einklang mit den gesetzlichen Vorschriften ein.
          Daher holen wir von den Nutzern eine vorhergehende Einwilligung ein,
          außer wenn diese gesetzlich nicht gefordert ist. Eine Einwilligung ist
          insbesondere nicht notwendig, wenn das Speichern und das Auslesen der
          Informationen, also auch von Cookies, unbedingt erforderlich sind, um
          dem den Nutzern einen von ihnen ausdrücklich gewünschten
          Telemediendienst (also unser Onlineangebot) zur Verfügung zu stellen.
          Zu den unbedingt erforderlichen Cookies gehören in der Regel Cookies
          mit Funktionen, die der Anzeige und Lauffähigkeit des Onlineangebotes
          , dem Lastausgleich, der Sicherheit, der Speicherung der Präferenzen
          und Auswahlmöglichkeiten der Nutzer oder ähnlichen mit der
          Bereitstellung der Haupt- und Nebenfunktionen des von den Nutzern
          angeforderten Onlineangebotes zusammenhängenden Zwecken dienen. Die
          widerrufliche Einwilligung wird gegenüber den Nutzern deutlich
          kommuniziert und enthält die Informationen zu der jeweiligen
          Cookie-Nutzung.
        </Text>

        <Title order={3} py="sm">
          Hinweise zu datenschutzrechtlichen Rechtsgrundlagen
        </Title>
        <Text>
          Auf welcher datenschutzrechtlichen Rechtsgrundlage wir die
          personenbezogenen Daten der Nutzer mit Hilfe von Cookies verarbeiten,
          hängt davon ab, ob wir Nutzer um eine Einwilligung bitten. Falls die
          Nutzer einwilligen, ist die Rechtsgrundlage der Verarbeitung Ihrer
          Daten die erklärte Einwilligung. Andernfalls werden die mithilfe von
          Cookies verarbeiteten Daten auf Grundlage unserer berechtigten
          Interessen (z.B. an einem betriebswirtschaftlichen Betrieb unseres
          Onlineangebotes und Verbesserung seiner Nutzbarkeit) verarbeitet oder,
          wenn dies im Rahmen der Erfüllung unserer vertraglichen Pflichten
          erfolgt, wenn der Einsatz von Cookies erforderlich ist, um unsere
          vertraglichen Verpflichtungen zu erfüllen. Zu welchen Zwecken die
          Cookies von uns verarbeitet werden, darüber klären wir im Laufe dieser
          Datenschutzerklärung oder im Rahmen von unseren Einwilligungs- und
          Verarbeitungsprozessen auf.
        </Text>

        <Title order={3} py="sm">
          Speicherdauer
        </Title>
        <Text>
          Im Hinblick auf die Speicherdauer werden die folgenden Arten von
          Cookies unterschieden:
        </Text>
        <List withPadding py="md">
          <List.Item>
            <strong>
              Temporäre Cookies (auch: Session- oder Sitzungs-Cookies):
            </strong>{" "}
            Temporäre Cookies werden spätestens gelöscht, nachdem ein Nutzer ein
            Online-Angebot verlassen und sein Endgerät (z.B. Browser oder mobile
            Applikation) geschlossen hat.
          </List.Item>
          <List.Item>
            <strong>Permanente Cookies:</strong> Permanente Cookies bleiben auch
            nach dem Schließen des Endgerätes gespeichert. So können
            beispielsweise der Login-Status gespeichert oder bevorzugte Inhalte
            direkt angezeigt werden, wenn der Nutzer eine Website erneut
            besucht. Ebenso können die mit Hilfe von Cookies erhobenen Daten der
            Nutzer zur Reichweitenmessung verwendet werden. Sofern wir Nutzern
            keine expliziten Angaben zur Art und Speicherdauer von Cookies
            mitteilen (z. B. im Rahmen der Einholung der Einwilligung), sollten
            Nutzer davon ausgehen, dass Cookies permanent sind und die
            Speicherdauer bis zu zwei Jahre betragen kann.
          </List.Item>
        </List>

        <Title order={3} py="sm">
          Allgemeine Hinweise zum Widerruf und Widerspruch (Opt-Out)
        </Title>
        <Text>
          Nutzer können die von ihnen abgegebenen Einwilligungen jederzeit
          widerrufen und zudem einen Widerspruch gegen die Verarbeitung
          entsprechend den gesetzlichen Vorgaben im Art. 21 DSGVO einlegen.
          Nutzer können ihren Widerspruch auch über die Einstellungen ihres
          Browsers erklären, z.B. durch Deaktivierung der Verwendung von Cookies
          (wobei dadurch auch die Funktionalität unserer Online-Dienste
          eingeschränkt sein kann). Ein Widerspruch gegen die Verwendung von
          Cookies zu Online-Marketing-Zwecken kann auch über die Websites{" "}
          <Anchor
            href="https://optout.aboutads.info"
            target="_blank"
            rel="noreferrer"
          >
            https://optout.aboutads.info
          </Anchor>{" "}
          und{" "}
          <Anchor
            href="https://www.youronlinechoices.com/"
            target="_blank"
            rel="noreferrer"
          >
            https://www.youronlinechoices.com/
          </Anchor>{" "}
          erklärt werden.
          <br />
          <br />
          <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (
          <Code>Art. 6 Abs. 1 S. 1 lit. f) DSGVO</Code>).
        </Text>
        <Title order={2} py="lg" id="bereitstellung">
          Bereitstellung des Onlineangebotes und Webhosting
        </Title>
        <Text>
          Wir verarbeiten die Daten der Nutzer, um ihnen unsere Online-Dienste
          zur Verfügung stellen zu können. Zu diesem Zweck verarbeiten wir die
          IP-Adresse des Nutzers, die notwendig ist, um die Inhalte und
          Funktionen unserer Online-Dienste an den Browser oder das Endgerät der
          Nutzer zu übermitteln.
        </Text>
        <List withPadding py="md">
          <List.Item>
            <strong>Verarbeitete Datenarten:</strong> Nutzungsdaten (z.B.
            besuchte Seiten, Interesse an Inhalten, Zugriffszeiten); Meta-,
            Kommunikations- und Verfahrensdaten (z. B. IP-Adressen, Zeitangaben,
            Identifikationsnummern, Einwilligungsstatus).
          </List.Item>
          <List.Item>
            <strong>Betroffene Personen:</strong> Nutzer (z.B.
            Webseitenbesucher, Nutzer von Onlinediensten).
          </List.Item>
          <List.Item>
            <strong>Zwecke der Verarbeitung:</strong> Bereitstellung unseres
            Onlineangebotes und Nutzerfreundlichkeit; Informationstechnische
            Infrastruktur (Betrieb und Bereitstellung von Informationssystemen
            und technischen Geräten (Computer, Server etc.).);
            Sicherheitsmaßnahmen.
          </List.Item>
          <List.Item>
            <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (
            <Code>Art. 6 Abs. 1 S. 1 lit. f) DSGVO</Code>).
          </List.Item>
        </List>
        <Title order={3} py="sm">
          Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten
        </Title>
        <List withPadding py="md">
          <List.Item>
            <strong>
              Bereitstellung Onlineangebot auf gemietetem Speicherplatz:
            </strong>
            Für die Bereitstellung unseres Onlineangebotes nutzen wir
            Speicherplatz, Rechenkapazität und Software, die wir von einem
            entsprechenden Serveranbieter (auch "Webhoster" genannt) mieten oder
            anderweitig beziehen;
            <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (
            <Code>Art. 6 Abs. 1 S. 1 lit. f) DSGVO</Code>).
          </List.Item>
          <List.Item>
            <strong>Erhebung von Zugriffsdaten und Logfiles: </strong>Der
            Zugriff auf unser Onlineangebot wird in Form von so genannten
            "Server-Logfiles" protokolliert. Zu den Serverlogfiles können die
            Adresse und Name der abgerufenen Webseiten und Dateien, Datum und
            Uhrzeit des Abrufs, übertragene Datenmengen, Meldung über
            erfolgreichen Abruf, Browsertyp nebst Version, das Betriebssystem
            des Nutzers, Referrer URL (die zuvor besuchte Seite) und im
            Regelfall IP-Adressen und der anfragende Provider gehören. Die
            Serverlogfiles können zum einen zu Zwecken der Sicherheit eingesetzt
            werden, z.B., um eine Überlastung der Server zu vermeiden
            (insbesondere im Fall von missbräuchlichen Angriffen, sogenannten
            DDoS-Attacken) und zum anderen, um die Auslastung der Server und
            ihre Stabilität sicherzustellen; <strong>Rechtsgrundlagen:</strong>{" "}
            Berechtigte Interessen (
            <Code>Art. 6 Abs. 1 S. 1 lit. f) DSGVO</Code>);{" "}
            <strong>Löschung von Daten:</strong> Logfile-Informationen werden
            für die Dauer von maximal 30 Tagen gespeichert und danach gelöscht
            oder anonymisiert. Daten, deren weitere Aufbewahrung zu
            Beweiszwecken erforderlich ist, sind bis zur endgültigen Klärung des
            jeweiligen Vorfalls von der Löschung ausgenommen.
          </List.Item>
          <List.Item>
            <strong>Content-Delivery-Network: </strong>Wir setzen ein
            "Content-Delivery-Network" (CDN) ein. Ein CDN ist ein Dienst, mit
            dessen Hilfe Inhalte eines Onlineangebotes, insbesondere große
            Mediendateien, wie Grafiken oder Programm-Skripte, mit Hilfe
            regional verteilter und über das Internet verbundener Server
            schneller und sicherer ausgeliefert werden können;
            <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (
            <Code>Art. 6 Abs. 1 S. 1 lit. f) DSGVO</Code>).
          </List.Item>
        </List>

        <Title order={2} py="lg" id="konto">
          Registrierung, Anmeldung und Nutzerkonto
        </Title>
        <Text>
          Nutzer können sich für ein Nutzerkonto anmelden. Im Rahmen der
          Registrierung werden den Nutzern die erforderlichen Pflichtangaben
          mitgeteilt und zu Zwecken der Bereitstellung des Nutzerkontos auf
          Grundlage vertraglicher Pflichterfüllung verarbeitet. Zu den
          verarbeiteten Daten gehören insbesondere die Login-Informationen
          (Nutzername, Passwort sowie eine E-Mail-Adresse). Die Anmeldung ist
          nicht verpflichtend und unverbindlich, sie wird von einem Mitglied
          nach Absenden verifiziert.
          <br />
          <br />
          Im Rahmen der Inanspruchnahme unserer Registrierungs- und
          Anmeldefunktionen sowie der Nutzung des Nutzerkontos speichern wir die
          IP-Adresse und den Zeitpunkt der jeweiligen Nutzerhandlung. Die
          Speicherung erfolgt auf Grundlage unserer berechtigten Interessen als
          auch jener der Nutzer an einem Schutz vor Missbrauch und sonstiger
          unbefugter Nutzung. Eine Weitergabe dieser Daten an Dritte erfolgt
          grundsätzlich nicht, es sei denn, sie ist zur Verfolgung unserer
          Ansprüche erforderlich oder es besteht eine gesetzliche Verpflichtung
          hierzu.
          <br />
          <br />
          Die Nutzer können über Vorgänge, die für deren Nutzerkonto relevant
          sind, wie z.B. technische Änderungen, per E-Mail informiert werden.
        </Text>
        <List withPadding py="md">
          <List.Item>
            <strong>Verarbeitete Datenarten:</strong> Bestandsdaten (z.B. Namen,
            Adressen); Kontaktdaten (z.B. E-Mail, Telefonnummern); Inhaltsdaten
            (z.B. Eingaben in Onlineformularen); Meta-, Kommunikations- und
            Verfahrensdaten (z. B. IP-Adressen, Zeitangaben,
            Identifikationsnummern, Einwilligungsstatus).
          </List.Item>
          <List.Item>
            <strong>Betroffene Personen:</strong> Nutzer (z.B.
            Webseitenbesucher, Nutzer von Onlinediensten).
          </List.Item>
          <List.Item>
            <strong>Zwecke der Verarbeitung:</strong> Erbringung vertraglicher
            Leistungen und Kundenservice; Sicherheitsmaßnahmen; Verwaltung und
            Beantwortung von Anfragen; Bereitstellung unseres Onlineangebotes
            und Nutzerfreundlichkeit.
          </List.Item>
          <List.Item>
            <strong>Rechtsgrundlagen:</strong> Vertragserfüllung und
            vorvertragliche Anfragen (
            <Code>Art. 6 Abs. 1 S. 1 lit. b) DSGVO</Code>); Berechtigte
            Interessen (<Code>Art. 6 Abs. 1 S. 1 lit. f) DSGVO</Code>).
          </List.Item>
        </List>
        <Text>
          <strong>
            Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:
          </strong>
        </Text>
        <List withPadding py="md">
          <List.Item>
            <strong>Registrierung mit Pseudonymen: </strong>Nutzer dürfen und
            sind angehalten statt Klarnamen Pseudonyme als Nutzernamen zu
            verwenden;
            <strong>Rechtsgrundlagen:</strong> Vertragserfüllung und
            vorvertragliche Anfragen (
            <Code>Art. 6 Abs. 1 S. 1 lit. b) DSGVO</Code>).
          </List.Item>
          <List.Item>
            <strong>Profile der Nutzer sind öffentlich: </strong>Die Profile der
            Nutzer sind öffentlich sichtbar und zugänglich.
          </List.Item>
        </List>
        <Title order={2} py="lg" id="kontakt">
          Kontakt- und Anfragenverwaltung
        </Title>
        <Text>
          Bei der Kontaktaufnahme mit uns (z.B. per Kontaktformular, E-Mail oder
          via soziale Medien) sowie im Rahmen bestehender Nutzer- und
          Geschäftsbeziehungen werden die Angaben der anfragenden Personen
          verarbeitet soweit dies zur Beantwortung der Kontaktanfragen und
          etwaiger angefragter Maßnahmen erforderlich ist.
        </Text>
        <List withPadding py="md">
          <List.Item>
            <strong>Verarbeitete Datenarten:</strong> Kontaktdaten (z.B. E-Mail,
            Telefonnummern); Inhaltsdaten (z.B. Eingaben in Onlineformularen);
            Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten,
            Zugriffszeiten); Meta-, Kommunikations- und Verfahrensdaten (z. B.
            IP-Adressen, Zeitangaben, Identifikationsnummern,
            Einwilligungsstatus).
          </List.Item>
          <List.Item>
            <strong>Betroffene Personen:</strong> Kommunikationspartner.
          </List.Item>
          <List.Item>
            <strong>Zwecke der Verarbeitung:</strong> Kontaktanfragen und
            Kommunikation; Verwaltung und Beantwortung von Anfragen; Feedback
            (z.B. Sammeln von Feedback via Online-Formular); Bereitstellung
            unseres Onlineangebotes und Nutzerfreundlichkeit.
          </List.Item>
          <List.Item>
            <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (
            <Code>Art. 6 Abs. 1 S. 1 lit. f) DSGVO</Code>); Vertragserfüllung
            und vorvertragliche Anfragen (
            <Code>Art. 6 Abs. 1 S. 1 lit. b) DSGVO</Code>).
          </List.Item>
        </List>
        <Text>
          <strong>
            Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:
          </strong>
        </Text>
        <List withPadding py="md">
          <List.Item>
            <strong>Kontaktformular: </strong>Wenn Nutzer über unser
            Kontaktformular, E-Mail oder andere Kommunikationswege mit uns in
            Kontakt treten, verarbeiten wir die uns in diesem Zusammenhang
            mitgeteilten Daten zur Bearbeitung des mitgeteilten Anliegens;{" "}
            <strong>Rechtsgrundlagen:</strong> Vertragserfüllung und
            vorvertragliche Anfragen (
            <Code>Art. 6 Abs. 1 S. 1 lit. b) DSGVO</Code>), Berechtigte
            Interessen (<Code>Art. 6 Abs. 1 S. 1 lit. f) DSGVO</Code>).
          </List.Item>
        </List>
        <Title order={2} py="lg" id="plugins">
          Plugins und eingebettete Funktionen sowie Inhalte
        </Title>
        <Text>
          Wir binden in unser Onlineangebot Funktions- und Inhaltselemente ein,
          die von den Servern ihrer jeweiligen Anbieter (nachfolgend bezeichnet
          als "Drittanbieter”) bezogen werden. Dabei kann es sich zum Beispiel
          um Grafiken, Videos oder Karteninhalte handeln (nachfolgend
          einheitlich bezeichnet als "Inhalte”).
          <br />
          <br />
          Die Einbindung setzt immer voraus, dass die Drittanbieter dieser
          Inhalte die IP-Adresse der Nutzer verarbeiten, da sie ohne die
          IP-Adresse die Inhalte nicht an deren Browser senden könnten. Die
          IP-Adresse ist damit für die Darstellung dieser Inhalte oder
          Funktionen erforderlich. Wir bemühen uns, nur solche Inhalte zu
          verwenden, deren jeweilige Anbieter die IP-Adresse lediglich zur
          Auslieferung der Inhalte verwenden. Drittanbieter können ferner
          sogenannte Pixel-Tags (unsichtbare Grafiken, auch als "Web Beacons"
          bezeichnet) für statistische oder Marketingzwecke verwenden. Durch die
          "Pixel-Tags" können Informationen, wie der Besucherverkehr auf den
          Seiten dieser Webseite, ausgewertet werden. Die pseudonymen
          Informationen können ferner in Cookies auf dem Gerät der Nutzer
          gespeichert werden und unter anderem technische Informationen zum
          Browser und zum Betriebssystem, zu verweisenden Webseiten, zur
          Besuchszeit sowie weitere Angaben zur Nutzung unseres Onlineangebotes
          enthalten als auch mit solchen Informationen aus anderen Quellen
          verbunden werden.
        </Text>
        <List withPadding py="md">
          <List.Item>
            <strong>Verarbeitete Datenarten:</strong> Nutzungsdaten (z.B.
            besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten); Meta-,
            Kommunikations- und Verfahrensdaten (z. B. IP-Adressen, Zeitangaben,
            Identifikationsnummern, Einwilligungsstatus).
          </List.Item>
          <List.Item>
            <strong>Betroffene Personen:</strong> Nutzer (z.B.
            Webseitenbesucher, Nutzer von Onlinediensten).
          </List.Item>
          <List.Item>
            <strong>Zwecke der Verarbeitung:</strong> Bereitstellung unseres
            Onlineangebotes und Nutzerfreundlichkeit; Erbringung vertraglicher
            Leistungen und Kundenservice.
          </List.Item>
          <List.Item>
            <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (
            <Code>Art. 6 Abs. 1 S. 1 lit. f) DSGVO</Code>).
          </List.Item>
        </List>
        <Text>
          <strong>
            Weitere Hinweise zu Verarbeitungsprozessen, Verfahren und Diensten:
          </strong>
        </Text>

        <List withPadding py="md">
          <List.Item>
            <strong>
              Einbindung von Drittsoftware, Skripten oder Frameworks (z. B.
              jQuery):
            </strong>
            Wir binden in unser Onlineangebot Software ein, die wir von Servern
            anderer Anbieter abrufen (z.B. Funktions-Bibliotheken, die wir
            zwecks Darstellung oder Nutzerfreundlichkeit unseres Onlineangebotes
            verwenden). Hierbei erheben die jeweiligen Anbieter die IP-Adresse
            der Nutzer und können diese zu Zwecken der Übermittlung der Software
            an den Browser der Nutzer sowie zu Zwecken der Sicherheit, als auch
            zur Auswertung und Optimierung ihres Angebotes verarbeiten. - Wir
            binden in unser Onlineangebot Software ein, die wir von Servern
            anderer Anbieter abrufen (z.B. Funktions-Bibliotheken, die wir
            zwecks Darstellung oder Nutzerfreundlichkeit unseres Onlineangebotes
            verwenden). Hierbei erheben die jeweiligen Anbieter die IP-Adresse
            der Nutzer und können diese zu Zwecken der Übermittlung der Software
            an den Browser der Nutzer sowie zu Zwecken der Sicherheit, als auch
            zur Auswertung und Optimierung ihres Angebotes verarbeiten;{" "}
            <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (
            <Code>Art. 6 Abs. 1 S. 1 lit. f) DSGVO</Code>).
          </List.Item>
          <List.Item>
            <strong>Google Fonts (Bezug vom Google Server): </strong>Bezug von
            Schriften (und Symbolen) zum Zwecke einer technisch sicheren,
            wartungsfreien und effizienten Nutzung von Schriften und Symbolen im
            Hinblick auf Aktualität und Ladezeiten, deren einheitliche
            Darstellung und Berücksichtigung möglicher lizenzrechtlicher
            Beschränkungen. Dem Anbieter der Schriftarten wird die IP-Adresse
            des Nutzers mitgeteilt, damit die Schriftarten im Browser des
            Nutzers zur Verfügung gestellt werden können. Darüber hinaus werden
            technische Daten (Spracheinstellungen, Bildschirmauflösung,
            Betriebssystem, verwendete Hardware) übermittelt, die für die
            Bereitstellung der Schriften in Abhängigkeit von den verwendeten
            Geräten und der technischen Umgebung notwendig sind. Diese Daten
            können auf einem Server des Anbieters der Schriftarten in den USA
            verarbeitet werden - Beim Besuch unseres Onlineangebotes senden die
            Browser der Nutzer ihre Browser HTTP-Anfragen an die Google Fonts
            Web API (d.h. eine Softwareschnittstelle für den Abruf der
            Schriftarten). Die Google Fonts Web API stellt den Nutzern die
            Cascading Style Sheets (CSS) von Google Fonts und danach die in der
            CCS angegebenen Schriftarten zur Verfügung. Zu diesen HTTP-Anfragen
            gehören (1) die vom jeweiligen Nutzer für den Zugriff auf das
            Internet verwendete IP-Adresse, (2) die angeforderte URL auf dem
            Google-Server und (3) die HTTP-Header, einschließlich des
            User-Agents, der die Browser- und Betriebssystemversionen der
            Websitebesucher beschreibt, sowie die Verweis-URL (d.h. die
            Webseite, auf der die Google-Schriftart angezeigt werden soll).
            IP-Adressen werden weder auf Google-Servern protokolliert noch
            gespeichert und sie werden nicht analysiert. Die Google Fonts Web
            API protokolliert Details der HTTP-Anfragen (angeforderte URL,
            User-Agent und Verweis-URL). Der Zugriff auf diese Daten ist
            eingeschränkt und streng kontrolliert. Die angeforderte URL
            identifiziert die Schriftfamilien, für die der Nutzer Schriftarten
            laden möchte. Diese Daten werden protokolliert, damit Google
            bestimmen kann, wie oft eine bestimmte Schriftfamilie angefordert
            wird. Bei der Google Fonts Web API muss der User-Agent die
            Schriftart anpassen, die für den jeweiligen Browsertyp generiert
            wird. Der User-Agent wird in erster Linie zum Debugging
            protokolliert und verwendet, um aggregierte Nutzungsstatistiken zu
            generieren, mit denen die Beliebtheit von Schriftfamilien gemessen
            wird. Diese zusammengefassten Nutzungsstatistiken werden auf der
            Seite „Analysen“ von Google Fonts veröffentlicht. Schließlich wird
            die Verweis-URL protokolliert, sodass die Daten für die Wartung der
            Produktion verwendet und ein aggregierter Bericht zu den
            Top-Integrationen basierend auf der Anzahl der Schriftartenanfragen
            generiert werden kann. Google verwendet laut eigener Auskunft keine
            der von Google Fonts erfassten Informationen, um Profile von
            Endnutzern zu erstellen oder zielgerichtete Anzeigen zu schalten;{" "}
            <strong>Dienstanbieter:</strong> Google Ireland Limited, Gordon
            House, Barrow Street, Dublin 4, Irland;{" "}
            <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (
            <Code>Art. 6 Abs. 1 S. 1 lit. f) DSGVO</Code>);
            <strong>Website: </strong>
            <Anchor
              href="https://fonts.google.com"
              target="_blank"
              rel="noreferrer"
            >
              https://fonts.google.com
            </Anchor>{" "}
            ; <strong>Datenschutzerklärung:</strong>{" "}
            <Anchor
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
            >
              https://policies.google.com/privacy
            </Anchor>{" "}
            ; <strong>Weitere Informationen:</strong>{" "}
            <Anchor
              href="https://developers.google.com/fonts/faq/privacy?hl=de"
              target="_blank"
              rel="noreferrer"
            >
              https://developers.google.com/fonts/faq/privacy
            </Anchor>
            .
          </List.Item>
          <List.Item>
            <strong>OpenStreetMap: </strong>Wir binden die Landkarten des
            Dienstes "OpenStreetMap" ein, die auf Grundlage der Open Data
            Commons Open Database Lizenz (ODbL) durch die OpenStreetMap
            Foundation (OSMF) angeboten werden. Die Daten der Nutzer werden
            durch OpenStreetMap ausschließlich zu Zwecken der Darstellung der
            Kartenfunktionen und zur Zwischenspeicherung der gewählten
            Einstellungen verwendet. Zu diesen Daten können insbesondere
            IP-Adressen und Standortdaten der Nutzer gehören, die jedoch nicht
            ohne deren Einwilligung (im Regelfall im Rahmen der Einstellungen
            ihrer Mobilgeräte vollzogen) erhoben werden;{" "}
            <strong>Dienstanbieter:</strong> OpenStreetMap Foundation (OSMF);{" "}
            <strong>Rechtsgrundlagen:</strong> Berechtigte Interessen (
            <Code>Art. 6 Abs. 1 S. 1 lit. f) DSGVO</Code>);{" "}
            <strong>Website:</strong>{" "}
            <Anchor
              href="https://www.openstreetmap.de"
              target="_blank"
              rel="noreferrer"
            >
              https://www.openstreetmap.de
            </Anchor>{" "}
            ; <strong>Datenschutzerklärung:</strong>{" "}
            <Anchor
              href="https://wiki.osmfoundation.org/wiki/Privacy_Policy"
              target="_blank"
              rel="noreferrer"
            >
              https://wiki.osmfoundation.org/wiki/Privacy_Policy
            </Anchor>
            .
          </List.Item>
        </List>
        <Title order={2} py="lg" id="änderung">
          Änderung und Aktualisierung der Datenschutzerklärung
        </Title>
        <Text>
          Wir bitten Sie, sich regelmäßig über den Inhalt unserer
          Datenschutzerklärung zu informieren. Wir passen die
          Datenschutzerklärung an, sobald die Änderungen der von uns
          durchgeführten Datenverarbeitungen dies erforderlich machen. Wir
          informieren Sie, sobald durch die Änderungen eine Mitwirkungshandlung
          Ihrerseits (z.B. Einwilligung) oder eine sonstige individuelle
          Benachrichtigung erforderlich wird.
          <br />
          <br />
          Sofern wir in dieser Datenschutzerklärung Adressen und
          Kontaktinformationen von Unternehmen und Organisationen angeben,
          bitten wir zu beachten, dass die Adressen sich über die Zeit ändern
          können und bitten die Angaben vor Kontaktaufnahme zu prüfen.
        </Text>
      </Container>
    </Page>
  );
};

export default Privacy;
