import { NavLink } from 'react-router-dom';
import './rules.css';

function Rules({ addToCart, setErrors, cursor }) {


    return (
        <div className="App">
            <main className="rules">
                <div class="container">
                    <h1>PREKIŲ PIRKIMO PARDAVIMO TAISYKLĖS</h1>
                    <h2>Pirkimo pardavimo taisyklės</h2>
                    <div className='rule'>
                        <h3>I. Sąvokos</h3>
                        <ol>
                            <li>
                                <strong>Duomenų valdytojas ir svetainės operatorius (toliau – Duomenų valdytojas)</strong>
                                <p>yra MB „Instalika“, įmonės kodas 305276105, PVM mokėtojo kodas LT100012828716, adresas Piratų g. 9, Derceklių k., LT-96399 Klaipėdos r. Lietuvos Respublika, elektroninio pašto adresas – <NavLink to="mailto:info@instalika.eu">info@instalika.eu</NavLink></p>
                            </li>
                            <li>
                                <strong>Pirkėjas</strong>
                                <p>– veiksnus fizinis arba juridinis asmuo, įsigijęs prekių interneto parduotuvėje <NavLink to="https://instalika.lt/">instalika.lt</NavLink>.</p>
                            </li>
                            <li>
                                <strong>Prekių pirkimo pardavimo taisyklės (toliau – Taisyklės)</strong>
                                <p>reglamentuoja Pirkėjo ir Pardavėjo teises, įsipareigojimus, Prekių kainas, apmokėjimo tvarką, terminus, pristatymą, Prekių kokybės garantiją, Prekių grąžinimą ir keitimą, atsakomybes.</p>
                            </li>
                        </ol>

                    </div>
                    <div className='rule'>
                        <h3>II. Bendrosios nuostatos</h3>
                        <ol>
                            <li>
                                <strong>Šios prekių pirkimo – pardavimo taisyklės (toliau &quot;Taisyklės&quot;)</strong>
                                <p>Jas patvirtinus Pirkėjui (susipažinus su Taisyklėmis bei pažymėjus varnelę prie teiginio &quot;Susipažinau su <NavLink to="https://instalika.lt/">https://instalika.lt/</NavLink> pirkimo taisyklėmis ir su jomis sutinku&quot;), yra šalims privalomas teisinis dokumentas, kuriame nustatomos Pirkėjo ir Pardavėjo teisės bei pareigos, prekių įsigijimo bei apmokėjimo už jas sąlygos, prekių pristatymo ir grąžinimo tvarka, šalių atsakomybė bei kitos su prekių pirkimu – pardavimu internetinėje parduotuvėje susijusios nuostatos.</p>
                            </li>
                            <li>
                                <strong>Pardavėjas pasilieka teisę bet kuriuo metu pakeisti, taisyti ar papildyti Taisykles,</strong>
                                <p>atsižvelgdamas į teisės aktų nustatytus reikalavimus.</p>
                            </li>
                            <li>
                                <strong>Pirkėjas, patvirtindamas Taisykles,</strong>
                                <p>patvirtina, kad jis turi teisę pirkti prekes <NavLink to="https://instalika.lt/">https://instalika.lt/</NavLink> internetinėje parduotuvėje.</p>
                            </li>
                            <li>
                                <strong>Taip pat informuojame, kad šios Taisyklės gali būti keičiamos pasikeitus teisiniam reglamentavimui.</strong>
                                <p>Kiekvieną kartą užsakant Prekes, rekomenduojame peržiūrėti Taisykles tam, kad Pirkėjas būtų įsitikinęs, jog pilnai supranta kokiomis sąlygomis, konkrečiu atveju, bus daromas užsakymas.</p>
                            </li>
                            <li>
                                <strong>Pirkėjas privalo susipažinti su Pardavėjo patvirtinta Privatumo politika.</strong>
                                <p>Sutikimą arba nesutikimą su konkrečiais Pirkėjo Asmens duomenų naudojimo būdais Pirkėjas išreiškia Privatumo politikoje numatyta tvarka.</p>
                            </li>
                            <li>
                                <strong>Jei pardavėjui numatyta teisė ar pareiga pateikti dokumentus ar informaciją Pirkėjui elektroniniu paštu,</strong>
                                <p>visais atvejais už veikiančio ir Pirkėjui priklausančio elektroninio pašto adreso pateikimą Pardavėjui atsako pats Pirkėjas.</p>
                            </li>
                        </ol>

                    </div>
                    <div className='rule'>
                        <h3>III. Privatumo politika</h3>
                        <ol>
                            <li>
                                <strong>MB “Instalika“, vykdydama elektroninę prekybą,</strong>
                                <p>vadovaujasi Lietuvos Respublikos asmens duomenų teisinės apsaugos įstatymu, bendruoju duomenų apsaugos reglamentu (ES) 2016/679 ir kitais teisės aktais, nustatančiais asmens duomenų tvarkymą, laikymąsi ir įgyvendinimą.</p>
                            </li>
                            <li>
                                <strong>Privatumo politika yra Taisyklių sudėtinė dalis.</strong>
                            </li>
                        </ol>

                    </div>
                    <div className='rule'>
                        <h3>IV. Prekės</h3>
                        <ol>
                            <li>
                                <strong>Internetinėje parduotuvėje pateikiami Prekių atvaizdai yra iliustracinio pobūdžio.</strong>
                                <p>Nepaisant to, kad Pardavėjas dėjo visas pastangas tam, kad Prekių spalvos būtų atvaizduotos kuo tiksliau, Pardavėjas negali garantuoti, kad Pirkėjo įrenginio ekranas tiksliai atspindės Prekių spalvas. Pirkėjas supranta, kad Prekės gali nežymiai skirtis nuo jų atvaizdų.</p>
                            </li>
                            <li>
                                <strong>Prekių įpakavimas gali skirtis nuo to, kuris pateikiamas atvaizduose, esančiuose internetinėje parduotuvėje.</strong>
                            </li>
                            <li>
                                <strong>Visos Prekės, pateikiamos internetinėje parduotuvėje, yra prieinamos Pirkėjui.</strong>
                                <p>Tuo atveju, jeigu užsakytos Prekės nebelieka, Pirkėjas yra nedelsiant apie tai informuojamas elektroniniu paštu ar kitomis priemonėmis (skambučiu ir/arba SMS žinute), ir tokios Prekės užsakymo vykdymas yra nutraukiamas.</p>
                            </li>
                            <li>
                                <strong>Sutartis tarp Pirkėjo ir Pardavėjo laikoma sudaryta nuo to momento, kai Pirkėjas, išsirinkęs perkamą (-as) prekę (-es) ir suformavęs prekių krepšelį, paspaudžia nuorodą &quot;Užsakyti&quot; ir kai Pardavėjas susisiekęs su Pirkėju jo nurodytu telefonu arba el. paštu, patvirtina užsakymą atsiųsdamas laišką el. paštu apie užsakymo patvirtinimą.</strong>
                            </li>
                            <li>
                                <strong>Kiekviena tarp Pirkėjo ir Pardavėjo sudaryta pirkimo – pardavimo sutartis yra registruojama ir saugoma internetinės parduotuvės duomenų bazėje.</strong>
                            </li>
                        </ol>

                    </div>
                    <div className='rule'>
                        <h3>V. Pirkėjo teisės</h3>
                        <ol>
                            <li>
                                <strong>Pirkėjas turi teisę susipažinti su savo asmens duomenimis ir teisę reikalauti ištaisyti neteisingus, neišsamius, netikslius savo asmens duomenis,</strong>
                                <p>parašydamas el. laišką <NavLink to="mailto:info@instalika.eu">info@instalika.eu</NavLink>. Tokiu atveju pardavėjas nedelsdamas turi įgyvendinti pirkėjo prašymą (per 1-2 darbo dienas).</p>
                            </li>
                            <li>
                                <strong>Pirkėjas teise atsisakyti prekių pirkimo – pardavimo sutarties gali pasinaudoti tik tuo atveju, jeigu prekė nebuvo sugadinta arba iš esmės nepasikeitė jos išvaizda, taip pat ji nebuvo naudojama, nebuvo surinkta ir liko originalioje pakuotėje.</strong>
                            </li>
                            <li>
                                <strong>Pirkėjas, įsigijęs netinkamos kokybės prekę iš <NavLink to="https://instalika.eu/">https://instalika.eu/</NavLink> internetinės parduotuvės, turi teisę:</strong>
                                <ol type="a">
                                    <li>reikalauti iš pardavėjo nemokamai pašalinti daikto trūkumus,</li>
                                    <li>reikalauti pardavėjo nemokamai pakeisti netinkamos kokybės prekę tinkamos kokybės preke,</li>
                                    <li>reikalauti iš pardavėjo atitinkamai sumažinti kainą,</li>
                                    <li>vienašališkai nutraukti sutartį ir pareikalauti grąžinti sumokėtą sumą.</li>
                                </ol>
                            </li>
                        </ol>
                    </div>
                    <div className='rule'>
                        <h3>VI. Pirkėjo įsipareigojimai</h3>
                        <ol>
                            <li>
                                <strong>Pirkėjas privalo sumokėti už prekes ir priimti jas šių Taisyklių nustatyta tvarka.</strong>
                            </li>
                            <li>
                                <strong>Jeigu pasikeičia Pirkėjo užsakymo formoje pateikti duomenys, jis privalo nedelsdamas apie juos informuoti Pardavėją.</strong>
                            </li>
                            <li>
                                <strong>Pirkėjas, naudodamasis <NavLink to="https://instalika.eu/">https://instalika.eu/</NavLink> internetine parduotuve, įsipareigoja laikytis šių Taisyklių, kitų sąlygų, aiškiai nurodytų internetinėje parduotuvėje bei nepažeisti Lietuvos Respublikos teisės aktų.</strong>
                            </li>
                        </ol>

                    </div>
                    <div className='rule'>
                        <h3>VII. Pardavėjo teisės</h3>
                        <ol>
                            <li>
                                <strong>Pardavėjas turi teisę savo nuožiūra nustatyti minimalų prekių krepšelio dydį,</strong>
                                <p>t.y. minimalią sumą, kurią pasiekus bus vykdomas Pirkėjo užsakymas. Šios sumos dydis matomas peržiūrint prekių krepšelį.</p>
                            </li>
                            <li>
                                <strong>Jei Pirkėjas bando pakenkti internetinės parduotuvės darbo stabilumui ir saugumui ar pažeidžia savo įsipareigojimus,</strong>
                                <p>Pardavėjas turi teisę nedelsiant ir be perspėjimo apriboti ar sustabdyti jam galimybę naudotis internetine parduotuve arba išskirtiniais atvejais panaikinti Pirkėjo registraciją.</p>
                            </li>
                            <li>
                                <strong>Susidarius svarbioms aplinkybėms, Pardavėjas gali laikinai arba iš viso nutraukti internetinės parduotuvės veiklą,</strong>
                                <p>apie tai iš anksto nepranešę Pirkėjui.</p>
                            </li>
                            <li>
                                <strong>Pardavėjas turi teisę iš anksto nepranešęs Pirkėjui anuliuoti jo užsakymą,</strong>
                                <p>jeigu Pirkėjas pasirinkęs apmokėjimą banko pavedimu nesumoka už prekes.</p>
                            </li>
                            <li>
                                <strong>Pardavėjas dėl svarbių priežasčių negalėdamas laiku ir tinkamai įvykdyti užsakymo,</strong>
                                <p>pasilieka teisę keisti pristatymo sąlygas ir laiką, arba nutraukti užsakymą apie tai nedelsiant informuodamas Pirkėją ir grąžindamas apmokėjimą.</p>
                            </li>
                        </ol>

                    </div>
                    <div className='rule'>
                        <h3>VIII. Pardavėjo įsipareigojimai</h3>
                        <ol>
                            <li>
                                <strong>Pardavėjas įsipareigoja šiose Taisyklėse ir internetinėje parduotuvėje nustatytomis sąlygomis sudaryti Pirkėjui galimybę naudotis internetinės parduotuvės <NavLink to="https://instalika.eu/">https://instalika.eu/</NavLink> teikiamomis paslaugomis.</strong>
                            </li>
                            <li>
                                <strong>Pardavėjas įsipareigoja gerbti Pirkėjo privatumo teisę į jam priklausančią asmeninę informaciją,</strong>
                                <p>t.y. Pirkėjo nurodytus asmens duomenis tvarkyti Lietuvos Respublikos teisės aktų nustatyta tvarka.</p>
                            </li>
                            <li>
                                <strong>Pardavėjas įsipareigoja pristatyti Pirkėjo užsakytas prekes jo nurodytu adresu, nurodytomis sąlygomis.</strong>
                            </li>
                            <li>
                                <strong>Pardavėjas, dėl svarbių aplinkybių negalėdamas pristatyti Pirkėjui užsakytos prekės, įsipareigoja pasiūlyti analogišką ar kiek įmanoma savo savybėmis panašesnę prekę.</strong>
                                <p>Pirkėjui atsisakius priimti analogišką ar savo savybėmis panašiausią prekę, Pardavėjas įsipareigoja grąžinti Pirkėjui sumokėtus pinigus per 3 (tris) darbo dienas, jeigu buvo atliktas išankstinis apmokėjimas.</p>
                            </li>
                        </ol>

                    </div>
                    <div className='rule'>
                        <h3>IX. Prekių kainos, apmokėjimo tvarka ir terminai</h3>
                        <ol>
                            <li>
                                <strong>Prekių kainos internetinėje parduotuvėje ir suformuotame užsakyme nurodomos eurais.</strong>
                            </li>
                            <li>
                                <strong>Pirkėjas atsiskaito už prekes vienu iš šių būdų:</strong>
                                <ol type="a">
                                    <li>
                                        <strong>Apmokėjimas banko pavedimu –</strong> tai apmokėjimas, kai Pirkėjas po užsakymo patvirtinimo, gavęs nurodymą apie apmokėjimą, perveda pinigus į MB Instalika banko sąskaitą.
                                    </li>
                                </ol>
                            </li>
                            <li>
                                <strong>Pardavėjas pasilieka teisę reikalauti iš Pirkėjo pasirašyti prekių užsakymo sutartį.</strong>
                            </li>
                            <li>
                                <strong>PVM sąskaitose faktūrose pateikiamos pasirinktos prekės, jų kiekis, suteikiamos nuolaidos, galutinė prekių kaina, įskaitant visus mokesčius,</strong>
                                <p>ir kiti buhalterinę apskaitą reglamentuojančių teisės aktų patvirtinti būtini pateikti duomenys.</p>
                            </li>
                        </ol>

                    </div>
                    <div className='rule'>
                        <h3>X. Prekių pristatymas</h3>
                        <ol>
                            <li>
                                <strong>Pirkėjas, užsakydamas prekes, gali pasirinkti prekių pateikimo būdą,</strong>
                                <p>t.y. pasinaudoti Pardavėjo teikiama prekių pristatymo paslauga arba Pardavėjo prekių atsiėmimo punkte.</p>
                            </li>
                            <li>
                                <strong>Prekių pristatymas Pirkėjo nurodytu adresu:</strong>
                                <ol type="a">
                                    <li>
                                        <strong>Pirkėjas, užsakymo metu pasirinkęs prekių pristatymo paslaugą, įsipareigoja nurodyti tikslią prekių pristatymo vietą.</strong>
                                    </li>
                                    <li>
                                        <strong>Pirkėjas įsipareigoja prekes priimti pats.</strong>
                                        <p>Tuo atveju, kai jis prekių pats priimti negali, o prekės pristatytos nurodytu adresu ir remiantis kitais Pirkėjo pateiktais duomenimis, Pirkėjas neturi teisės reikšti Pardavėjui pretenzijų dėl prekių pristatymo netinkamam subjektui.</p>
                                    </li>
                                    <li>
                                        <strong>Prekes pristato Pardavėjas arba jo įgaliotas atstovas.</strong>
                                    </li>
                                    <li>
                                        <strong>Prekių pristatymas (transportavimas) Lietuvos Respublikos teritorijoje yra nemokamas.</strong>
                                    </li>
                                </ol>
                            </li>
                            <li>
                                <strong>Prekių atsiėmimas Pardavėjo prekių atsiėmimo punktuose:</strong>
                                <ol type="a" start="5">
                                    <li>
                                        <strong>Pirkėjas gali atsiimti prekes nemokamai iš Pardavėjo prekių atsiėmimo punkto.</strong>
                                    </li>
                                    <li>
                                        <strong>Užsakytas prekes būtina atsiimti ne vėliau kaip per 3 (tris) darbo dienas, skaičiuojamas nuo Pardavėjo patvirtinimo, kad užsakymas jau paruoštas, gavimo momento.</strong>
                                        <p>Pirkėjui laiku neatsiėmus prekių, Pardavėjas pasilieka teisę nutraukti užsakymą be įspėjimo ir grąžinti sumokėtą mokėjimą.</p>
                                    </li>
                                    <li>
                                        <strong>Prekes gali atsiimti tik užsakymą pateikęs asmuo arba asmuo, nurodytas užsakymo pateikimo metu.</strong>
                                    </li>
                                    <li>
                                        <strong>Pardavėjas pateikia prekes Pirkėjui vadovaudamasis prekių aprašymuose nurodytais terminais.</strong>
                                        <p>Šie terminai yra preliminarūs, be to netaikomi tais atvejais, kai Pardavėjo sandėlyje nėra reikiamų prekių, o Pirkėjas informuojamas apie jo užsakytų prekių trūkumą. Kartu Pirkėjas sutinka, jog išimtiniais atvejais prekių pateikimas gali vėluoti dėl nenumatytų, nuo Pardavėjo nepriklausančių aplinkybių. Tokiu atveju Pardavėjas įsipareigoja nedelsiant susisiekti su Pirkėju ir suderinti prekių pateikimo sąlygas.</p>
                                    </li>
                                    <li>
                                        <strong>Visais atvejais Pardavėjas atleidžiamas nuo atsakomybės už prekių pateikimo terminų pažeidimą,</strong>
                                        <p>jeigu prekės Pirkėjui nėra pateikiamos arba pateikiamos ne laiku dėl Pirkėjo kaltės arba dėl nuo Pirkėjo priklausančių aplinkybių.</p>
                                    </li>
                                    <li>
                                        <strong>Prekių pateikimo Pirkėjui metu Pirkėjas privalo kartu su Pardavėju arba jo įgaliotu atstovu patikrinti siuntos ir prekės(-ių) būklę bei pasirašyti siuntos perdavimo – priėmimo dokumentą.</strong>
                                        <p>Pirkėjui pasirašius siuntos perdavimo – priėmimo dokumente, laikoma, kad siunta yra perduota tinkamos būklės, prekių pažeidimų, kurių atsiradimo pagrindas priskirtinas ne gamykliniam brokui, bei prekės(-ių) komplektacijos neatitikimų (tokių, kuriuos galima nustatyti išorinės prekių apžiūros metu) nėra.</p>
                                        <p>Pastebėjęs, kad pateiktos siuntos pakuotė pažeista(suglamžyta, šlapia ar kitaip išoriškai pažeista), prekė(-ės) yra pažeista(-os) ir/ar prekė(-ės) yra netinkamos komplektacijos, Pirkėjas privalo tai pažymėti siuntos perdavimo – priėmimo dokumente.</p>
                                    </li>
                                </ol>
                            </li>
                        </ol>
                    </div>
                    <div className='rule'>
                        <h3>XI. Prekių kokybės garantija ir tinkamumo naudoti terminas</h3>
                        <ol>
                            <li>
                                <p>
                                    Kiekvienos <NavLink to="https://instalika.eu/">instalika.eu</NavLink> parduodamos prekės savybės bendrai nurodomos prie kiekvienos prekės esančiame prekės aprašyme.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Pardavėjas neatsako už tai, kad internetinėje parduotuvėje esančios prekės savo spalva, forma ar kitais parametrais gali neatitikti realaus prekių dydžio, formų ir spalvos dėl Pirkėjo naudojamo monitoriaus ypatybių.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Pardavėjas visoms prekėms suteikia 24 mėnesių garantiją, jei nėra nurodyta kitaip prekės aprašyme.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Tuo atveju, kai Pardavėjas tam tikroms prekių rūšims daiktų kokybės garantijos nesuteikia, galioja garantija, numatyta atitinkamų teisės aktų.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Pardavėjas teikia prekių garantinės priežiūros paslaugas tarpininkaudamas tarp Pirkėjo ir gamintojo, ar gamintojo atstovo.
                                </p>
                            </li>
                        </ol>

                    </div>
                    <div className='rule'>
                        <h3>XII. Prekių grąžinimas ir keitimas</h3>
                        <ol>
                            <li>
                                <p>
                                    Pardavėjas suteikia garantinį aptarnavimą visam savo parduodamos produkcijos asortimentui, remdamasis LR ir ES galiojančiais garantinio aptarnavimo įstatymais.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Pardavėjas turi teisę atsisakyti priimti Prekes, kurių prekinė pakuotė (išvaizda) yra pakitusi.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Pirkėjas turi teisę per 3 mėnesius grąžinti Prekes, kurių prekinė išvaizda ir (ar) pakuotė yra nepažeista, prieš tai raštu informavęs Pardavėją.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Garantiniu prekės galiojimo laikotarpiu pastebėjęs prekės(ių) broką, Pirkėjas praneša apie tai raštu arba el. paštu Pardavėjui per 3 kalendorines dienas nuo prekių trūkumo pastebėjimo.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Nekokybiškas ar brokuotas prekes Pardavėjas įsipareigoja taisyti arba keisti naujomis. Pardavėjas kartu su prekėmis įsipareigoja perduoti pirkėjui prekių naudojimosi instrukcijas, jei tokias privalo perduoti pagal prekių specifikaciją, arba pateikti nuorodą, kur Pirkėjas gali susipažinti su prekės instrukcijomis, bei Pirkėjo pageidavimu Pardavėjas atlieka negarantinės įrangos remontą. Gedimų diagnostikos fiksuotas ir nekintantis įkainis – 10 EUR + PVM, galutinė kaina priklauso nuo remonto sudėtingumo.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Pardavėjas nėra atsakingas už prekių kokybės pablogėjimą, jei Pirkėjas ar asmenys, kuriems Pirkėjas perdavė prekes, jas naudojo ne tiems tikslams, kuriems tokios prekės yra paprastai naudojamos, nesilaikė instrukcijose nurodytų reikalavimų, pažeidė Prekių gabenimo, laikymo, naudojimo ir/ar sandėliavimo taisykles, taip pat, jeigu matomi Prekių įpakavimo ir kiti išoriniai defektai, raštu neaptarti Prekių perdavimo metu, ar Prekių kokybės pablogėjimas yra dėl Pirkėjo ar kitų asmenų, kuriems Pirkėjas perdavė Prekes, veiksmų.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Pinigai už grąžintas prekes visais atvejais pervedami mokėjimo pavedimu ir tik į mokėtojo banko sąskaitą.
                                </p>
                            </li>
                        </ol>

                    </div>
                    <div className='rule'>
                        <h3>XIII. Atsakomybė</h3>
                        <ol>
                            <li>
                                <p>
                                    Pirkėjas yra visiškai atsakingas už jo pateikiamų asmens duomenų teisingumą. Jei Pirkėjas nepateikia tikslių asmens duomenų, Pardavėjas neatsako už dėl to atsiradusius padarinius ir įgyja teisę reikalauti iš Pirkėjo patirtų tiesioginių nuostolių atlyginimo.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Pirkėjas atsako už veiksmus, atliktus naudojantis šia internetine parduotuve.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Užsiregistravęs Pirkėjas atsako už savo prisijungimo duomenų perdavimą tretiesiems asmenims. Jei Instalika teikiamomis paslaugomis naudojasi trečiasis asmuo, prisijungęs prie internetinės parduotuvės naudodamasis Pirkėjo prisijungimo duomenimis, Pardavėjas šį asmenį laiko Pirkėju.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Pardavėjas atleidžiamas nuo bet kokios atsakomybės tais atvejais, kai nuostoliai kyla dėl to, jog Pirkėjas, neatsižvelgdamas į Pardavėjo rekomendacijas ir savo įsipareigojimus, nesusipažino su šiomis Taisyklėmis, nors tokia galimybė jam buvo suteikta.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Jei Pardavėjo internetinėje parduotuvėje yra nuorodos į kitų įmonių, įstaigų, organizacijų ar asmenų tinklapius, Pardavėjas nėra atsakingas už ten esančią informaciją ar vykdomą veiklą, tų tinklapių neprižiūri, nekontroliuoja ir toms įmonėms bei asmenims neatstovauja.
                                </p>
                            </li>
                        </ol>
                    </div>
                    <div className='rule'>
                        <h3>XIV. Apsikeitimas informacija</h3>
                        <ol>
                            <li>
                                <p>
                                    Pardavėjas visus pranešimus siunčia Taisyklėse numatyta tvarka Pirkėjo pateiktu elektroninio pašto adresu.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Pirkėjas visus pranešimus ir klausimus siunčia Pardavėjo internetinės parduotuvės skyriuje "Kontaktai" nurodytomis susisiekimo priemonėmis.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Taisyklėse vartojama sąvoka „raštu“ apima ir elektroninius laiškus.
                                </p>
                            </li>
                        </ol>

                    </div>
                    <div className='rule'>
                        <h3>XV. Baigiamosios nuostatos</h3>
                        <ol>
                            <li>
                                <p>
                                    Šios taisyklės sudarytos vadovaujantis LR teisės aktais.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Šių taisyklių pagrindu kylantiems santykiams taikoma LR teisė.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Visi nesutarimai, kilę dėl šių taisyklių vykdymo, sprendžiami derybų būdu. Nepavykus susitarti, ginčai sprendžiami LR įstatymų nustatyta tvarka, pagal Pardavėjo buveinės vietą.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Pirkėjas neturi teisės perleisti ar perduoti visų ar dalies teisių ir įsipareigojimų, kylančių iš šių Taisyklių, trečiajam asmeniui ar asmenims be Pardavėjo rašytinio sutikimo.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Tuo atveju, jei Pirkėjas nesutinka su Pardavėjo parengtu ir perduotu atsakymu į Pirkėjo rašytinę pretenziją, savo prašymą/skundą dėl instalika.eu įsigytos prekės iš Pardavėjo Pirkėjas (fizinis asmuo, vartotojas) gali pateikti Valstybinei vartotojų teisių apsaugos tarnybai (Vilniaus g. 25, 01402 Vilnius, el.p. tarnyba@vvtat.lt, tel. 85 262 67 51, faks. (85) 279 1466, interneto svetainėje www.vvtat.lt (taip pat Valstybinės vartotojų teisių apsaugos tarnybos teritoriniams padaliniams apskrityse) - ar užpildyti prašymo formą EGS platformoje https://ec.europa.eu/odr/.
                                </p>
                            </li>
                        </ol>

                    </div>
                </div>
            </main>
        </div>
    );
}

export default Rules;