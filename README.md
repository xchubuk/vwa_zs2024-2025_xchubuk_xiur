# vwa_zs2024-2025_xchubuk_xiur

Zadání 3: Webová aplikace pro půjčování kol a správu bikeparku
Popis projektu
Cílem je vytvoření webové aplikace, která umožní návštěvníkům bikeparku půjčovat si kola, evidovat jejich stav,
spravovat opravy a sledovat další související operace. Aplikace bude sloužit jak pro zákazníky, tak pro zaměstnance
bikeparku, kteří budou mít možnost spravovat nabídku kol a sledovat jejich využití.
Funkce aplikace
1.••2.•3.•4.•5.•6.•Uživatelské účty
Zákazníci:
o Registrace a přihlášení pro půjčování kol.
o Možnost prohlížení dostupných kol a jejich specifikací.
Zaměstnanci bikeparku:
o Registrace a přihlášení pro správu nabídky kol.
o Možnost aktualizace stavu kol (dostupná/pujčená) a přidávání nových kol do systému.
Půjčování kol
Zákazníci mohou:
o Vybrat kolo z aktuální nabídky.
o Zadat dobu půjčení (např. na hodinu, den).
o Zvolit způsob platby (např. online platba, platba na místě).
Evidence kol
Systém bude evidovat:
o Historii půjčování jednotlivých kol.
o Stav každého kola (např. technický stav, potřeba opravy).
o Záznamy o provedených opravách a údržbě.
Kontrola kola při vrácení
Při vrácení kola:
o Zaměstnanec provede vizuální kontrolu kola (např. kontrola brzd, pneumatik, rámu).
o Systém umožní zaznamenat stav kola při vrácení (např. bez poškození, drobné oděrky, vážné
poškození).
o Možnost přidat komentáře k provedené kontrole.
Vytvoření požadavku na servis
Pokud je kolo po vrácení v nevyhovujícím stavu:
o Zaměstnanec může vytvořit požadavek na servis.
o Požadavek bude obsahovat popis problému, datum a čas požadavku.
o Systém umožní sledování stavu servisu (čekající, v procesu, dokončeno).
Statistiky a reporty
Systém bude sledovat:
o Počet půjčených kol za určité období.
o Příjmy z půjčování kol.
o Nejvíce půjčovaná kola a jejich využití.
Technické požadavky
•
 Technologie
o Frontend: HTML5, css3, responsivní design
o Backend: Flask (Python) pro serverovou logiku.
o Databáze: PostgreSQL nebo SQLite pro ukládání dat o uživatelích, kolech a transakcích.
•
Architektura
o MVC (Model-View-Controller) architektura pro oddělení logiky aplikace od uživatelského rozhraní.
Zabezpečení
•
•
•
Šifrování citlivých dat (např. hesel) pomocí knihovny bcrypt.
Ověření identity uživatelů
Ochrana proti CSRF útokům a SQL injection.
Cílová skupina
Návštěvníci bikeparku hledající možnost půjčení kvalitních kol a zaměstnanci bikeparku spravující nabídku a údržbu
těchto kol.
