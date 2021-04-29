// import React in our code
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
// import all the components we are going to use
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";

//import for the animation of Collapse and Expand
import * as Animatable from "react-native-animatable";

//import for the Accordion view
import Accordion from "react-native-collapsible/Accordion";

//Content to show
const CONTENT = [
  {
    title: "Skrifaðar reglur",
    content:
      "Þetta eru einu skrifuðu reglurnar sem fólki ber að fylgja á hundasvæðum höfuðborgarsvæðisins. Erlendis eru reglurnar töluvert fleiri og skýrari. Þar eru skilti við inngang stórra afgirtra garða með 15-20 reglum, meðal annars:\n\n1. Loka verður hliðinu á eftir hverjum hundi.\n\n2. Hundar mega ekki yfirgefa garðinn án þess að vera í taum.\n\n3. Hundar verða að vera fullbólusettir.\n\n4. Hundar verða að vera í kallfæri við eiganda sinn öllum stundum.\n\n5. Grimmir hundar eru bannaðir.\n\n6. Sýni hundur árásargirni ber honum að yfirgefa garðinn strax.\n\n7. Tíkur á lóðaríi eru bannaðar.\n\n8. Börn undir 15 ára aldri verða að vera í fylgd með fullorðnum.\n\n9. Takið upp eftir hundinn og setjið í ruslatunnur. \n\n-Hundasamfélagið",
  },
  {
    title: "Kunna almennt merkjamál hunda",
    content:
      "Það er munur á leikurri og viðvörunarurri. \n\nHundur þarf ekki að vera grimmur þó hann urri á hundinn þinn. Hann getur verið að láta vita að honum sé illa við hvernig þinn hundur hagar sér og vilji smá pláss. Vertu ábyrgur hundaeigandi og passaðu að hundurinn þinn hlýði þessari beiðni. Einnig ef dæminu er snúið við, passaðu hundinn þinn og fáðu eiganda til að kalla á sinn hund eða færðu þig svo þinn hundur fái frið. \n\nLeikur er ekki alltaf bara leikur. \n\nÞað er nauðsynlegt að skilja hvað er heilbrigður leikur á milli hunda og hvað ekki. Ef annar hundurinn er að vera dónalegur, ágengur eða of æstur í leik er nauðsylegt að hjálpa hinum hundinum og stoppa leikinn. Dónalegi hundurinn á ekki að fá samþykki fyrir því að haga sér svona í leik. Þar af leiðandi er leikurinn stoppaður ef hann hagar sér ekki vel. Það er stundum nóg að taka ágenga hundinn í pásu í nokkrar mínútur og hleypa honum svo aftur í leik þegar hann hefur róað sig. Ef hundurinn þýtur beint aftur í hundinn þegar honum er sleppt aftur skaltu fjarlægja hann úr aðstæðunum. Svona leikir einkennast oft af eftirfarandi hlutum: \n\na) Annar hundurinn er ítrekað tæklaður niður á meðann hinn stendur yfir honum.\n \nb) Annar hundurinn snýr sér oft undan, sleikir út um eða sýnir önnur róandi merki sem ágengi hundurinn tekur ekki mark á.\n \nc) Óviðeigandi urr. Aftur, urr er ekki það sama og urr. Það er gífurlega mikilvægt að skilja hvenær hundur urrar til að biðja um pásu á leiknum og grípa inn í ef skilaboðin komast ekki til skila. \n\n -Hundasamfélagið",
  },
  {
    title: "Ekki fara á hundasvæði með of æstan hund.",
    content:
      "Það er algengur misskilningur að hundar þurfi að fara á hundasvæðið þegar þeir eru mjög æstir. Í þeim tilfellum er skynsamlegra að fara út fyrir bæjarmörkin og leyfa hundinum að hlaupa. Oft er gott að taka góða hundavini með. Æstur hundur á hundasvæði getur skapað vandamál. Hann er líklegur til að verða ágengur og hunsa merkjamál hinna hundanna í von um að þeir leiki við sig. Hundur á að mæta yfirvegaður, glaður og vel umhverfisþjálfaður á hundasvæði. Þar kynnist hann mörgum og ólíkum hundum í einu og því er mikilvægt að þeir kunni að bregðast við mismunandi persónuleikum. \n\n-Hundasamfélagið",
  },
  {
    title: "Ekki neyða hundinn þinn til að vera á hundasvæði ef honum líkar það illa.",
    content:
      "Það er nauðsynlegt að skilja að hundurinn þinn er ekki slæmur hundur þó svo að honum líði ekki vel í áreitinu sem oft vill myndast á hundasvæðum. Sumir hundar eru hræddir við aðra hunda, með styttri þráð, orðnir gamlir og nenna ekki ungu hundunum eða þeim finnst hreinlega ekki gaman að umgangast aðra hunda. Það er á þína ábyrgð að setja hundinn ekki í aðstæður sem hann vill ekki vera í. Farðu frekar með honum út fyrir bæinn með vinum, í afgirtu gerðin að sparka bolta eða stundaðu aðra hreyfingu sem hundurinn hefur gaman af. \n\nÞað getur setið lengi í hundi ef ráðist er á hann og ef hann hefur lent í árás gæti hann þurft mikla þjálfun áður en hann er andlega tilbúinn til að mæta aftur á hundasvæði. Það er mikilvægt að umhverfisþjálfa hundana okkar og venja þá við ýmis áreiti. Það þarf að vera á þeirra forsendum. Ekki ýta hundi í aðstæður sem hann ræður ekki við, það gerir hann bara hræddari og líklegri til að bíta frá sér. Sé hundur byrjaður að sýna merki sem þú skilur ekki eða treystir þér ekki til að vinna með, farðu með hann til hundaþjálfara. \n\n-Hundasamfélagið",
  },
  {
    title: "Ekki fara með tík á lóðaríi eða óbólusetta hvolpa á hundasvæði.",
    content:
      "Hvolpar þurfa 2-3 bólusetningar til að geta talist fullbólusettir. Fyrir það er mælt með því að takmarka umgengni hvolpsins við hunda sem þú þekkir í þínu allra nánasta umhverfi. Líkt og með ungabörn eru hvolpar á þessum aldri mjög viðvæmir fyrir bakteríum og sjúkdómum. \n\nTík á lóðaríi er ekki aðeins í hættu á að verða hvolpafull, heldur myndar lyktin af henni ótrúlega spennu í hundunum í kring. Bæði karlhundarnir og tíkin sjálf geta komið af stað slagsmálum við aðra hunda. Tikin mun ekki skemmta sér á hundasvæðinu með alla rakkana hangandi í rassinum á sér og þetta getur verið stórhættulegt fyrir alla, bæði menn og hunda. \n\n-Hundasamfélagið",
  },
  {
    title: "Aldrei skilja hundinn eftir eftirlitslausan á hundasvæði.",
    content:
      "Hundasvæði eru ætluð hundum í fylgd með eiganda. Eftirlitslausir hundar eru bannaðir á hundasvæðum samkvæmt hundasamþykkt, því þeir geta valdið tvennskonar óþægindum:\n\nHundurinn gæti skaðað sig, aðra hunda eða fólk. Hann getur valdið skemmdum á svæðinu sjálfu eða eignum annarra. Einnig kemur fyrir að hundar þurfi að losa sig við úrgang. Hafi hundurinn ekki lært að þrífa upp eftir sig og henda í tunnu er það á ábyrgð eiganda.\n\nÞað er mikilvægt að þú sért til staðar hvort sem það er vegna þess að hundurinn þinn lendir í áreiti annarra eða vegna þess að hundurinn þinn áreitir aðra. Sé hundur eftirlitslaus geta skapast mjög hættulegar aðstæður mjög fljótt. Komi upp spenna er mikilvægt að rjúfa hana strax áður en hún veldur slagsmálum. Þá skiptir miklu máli að eigendur hundanna séu báðir til staðar, hundarnir hlýði báðir innkalli og að eigendur þekki merkjamál vel ef rjúfa á spennuna á sem auðveldastan hátt. Virki það ekki og komi til slagsmála er mikilvægt að báðir aðilar kunni að bregðast hratt og rétt við.\n\n-Hundasamfélagið",
  },
];

const Info = () => {
  // Default active selector
  const [activeSections, setActiveSections] = useState([]);

  const setSections = (sections) => {
    //setting up a active section state
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  //Renders the head of each Accordition when clicked on
  const renderHeader = (section, _, isActive) => {
    //Accordion Header view
    return (
      <Animatable.View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        // transition="backgroundColor"
      >
        <Animatable.Text
          style={[isActive ? styles.headerActive : styles.headerInactive]}
          
          // animation={isActive ? "bounceIn" : undefined}
          // style={{ textAlign: "left", color: "white" }}
        >
          {section.title}
        </Animatable.Text>
      </Animatable.View>
    );
  };

  const renderContent = (section, _, isActive) => {
    //Accordion Content view
    return (
      <Animatable.View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
        // transition="opacity"
      >
        <Animatable.Text
          // animation={isActive ? "bounceIn" : undefined}
          style={{ textAlign: "left", color: "white" }}
        >
          {section.content}
        </Animatable.Text>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Gott að vita</Text>
          <Accordion
            activeSections={activeSections} //for any default active section
            sections={CONTENT} //title and content of accordion
            renderHeader={renderHeader} //Header Component(View) to render
            renderContent={renderContent} //Content Component(View) to render
            duration={500} //Duration for Collapse and expand
            onChange={setSections} //setting the state of active sections
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Info;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 90,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 20,
    marginTop: 40,
    fontWeight: "bold",
    color: "#069380",
  },
  header: {
    paddingBottom: 10,
  },
  content: {
    padding: 20,
    
  },
  active: {
    backgroundColor: "#034B42",
  },
  inactive: {
    backgroundColor: "white",
  },
  droidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 35 : 0,
  },
  headerActive: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    
  },
  headerInactive: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#069380",
  },
});
