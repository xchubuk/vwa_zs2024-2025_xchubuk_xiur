
# Zadání 3: Webová aplikace pro půjčování kol a správu bikeparku.

## Popis projektu
Cílem je vytvoření webové aplikace, která umožní návštěvníkům bikeparku půjčovat si kola, evidovat jejich stav, spravovat opravy a sledovat další související operace. 
Aplikace bude sloužit jak pro zákazníky, tak pro zaměstnance bikeparku, kteří budou mít možnost spravovat nabídku kol a sledovat jejich využití.

## Funkce aplikace

1. **Uživatelské účty**
   - **Zákazníci:**
     - Registrace a přihlášení pro půjčování kol.
     - Možnost prohlížení dostupných kol a jejich specifikací.
   - **Zaměstnanci bikeparku:**
     - Registrace a přihlášení pro správu nabídky kol.
     - Možnost aktualizace stavu kol (dostupná/pujčená) a přidávání nových kol do systému.

2. **Půjčování kol**
   - **Zákazníci mohou:**
     - Vybrat kolo z aktuální nabídky.
     - Zadat dobu půjčení (např. na hodinu, den).
     - Zvolit způsob platby (např. online platba, platba na místě).

3. **Evidence kol**
   - Systém bude evidovat:
     - Historii půjčování jednotlivých kol.
     - Stav každého kola (např. technický stav, potřeba opravy).
     - Záznamy o provedených opravách a údržbě.

4. **Kontrola kola při vrácení**
   - Při vrácení kola:
     - Zaměstnanec provede vizuální kontrolu kola (např. kontrola brzd, pneumatik, rámu).
     - Systém umožní zaznamenat stav kola při vrácení (např. bez poškození, drobné oděrky, vážné poškození).
     - Možnost přidat komentáře k provedené kontrole.

5. **Vytvoření požadavku na servis**
   - Pokud je kolo po vrácení v nevyhovujícím stavu:
     - Zaměstnanec může vytvořit požadavek na servis.
     - Požadavek bude obsahovat popis problému, datum a čas požadavku.
     - Systém umožní sledování stavu servisu (čekající, v procesu, dokončeno).

6. **Statistiky a reporty**
   - Systém bude sledovat:
     - Počet půjčených kol za určité období.
     - Příjmy z půjčování kol.
     - Nejvíce půjčovaná kola a jejich využití.

## Technické požadavky

- **Technologie**
  - Frontend: HTML5, CSS3, responsivní design.
  - Backend: Flask (Python) pro serverovou logiku.
  - Databáze: PostgreSQL nebo SQLite pro ukládání dat o uživatelích, kolech a transakcích.

- **Architektura**
  - MVC (Model-View-Controller) architektura pro oddělení logiky aplikace od uživatelského rozhraní.

## Zabezpečení

- Šifrování citlivých dat (např. hesel) pomocí knihovny bcrypt.
- Ověření identity uživatelů.
- Ochrana proti CSRF útokům a SQL injection.

## Cílová skupina
Návštěvníci bikeparku hledající možnost půjčení kvalitních kol a zaměstnanci bikeparku spravující nabídku a údržbu těchto kol.
