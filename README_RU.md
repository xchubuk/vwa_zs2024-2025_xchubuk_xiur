# Задание 3: Веб-приложение для аренды велосипедов и управления байкпарком

## Описание проекта
Целью является создание веб-приложения, которое позволит посетителям байкпарка арендовать велосипеды, вести учет их состояния, управлять ремонтами и отслеживать другие связанные операции. 
Приложение будет служить как для клиентов, так и для сотрудников байкпарка, которые смогут управлять предложением велосипедов и отслеживать их использование.

## Функции приложения

1. **Пользовательские аккаунты**
   - **Клиенты:**
     - Регистрация и вход для аренды велосипедов.
     - Возможность просмотра доступных велосипедов и их характеристик.
   - **Сотрудники байкпарка:**
     - Регистрация и вход для управления предложением велосипедов.
     - Возможность обновления состояния велосипедов (доступно/арендовано) и добавления новых велосипедов в систему.

2. **Аренда велосипедов**
   - **Клиенты могут:**
     - Выбрать велосипед из актуального предложения.
     - Указать срок аренды (например, на час, день).
     - Выбрать способ оплаты (например, онлайн-оплата, оплата на месте).

3. **Учет велосипедов**
   - Система будет вести учет:
     - Истории аренды каждого велосипеда.
     - Состояния каждого велосипеда (например, техническое состояние, необходимость ремонта).
     - Записей о проведенных ремонтах и обслуживании.

4. **Проверка велосипеда при возврате**
   - При возврате велосипеда:
     - Сотрудник проводит визуальный осмотр велосипеда (например, проверка тормозов, шин, рамы).
     - Система позволяет зафиксировать состояние велосипеда при возврате (например, без повреждений, мелкие царапины, серьезные повреждения).
     - Возможность добавить комментарии к проведенной проверке.

5. **Создание запроса на сервисное обслуживание**
   - Если велосипед после возврата в неудовлетворительном состоянии:
     - Сотрудник может создать запрос на сервисное обслуживание.
     - Запрос будет содержать описание проблемы, дату и время запроса.
     - Система позволит отслеживать статус сервиса (в ожидании, в процессе, завершено).

6. **Статистика и отчеты**
   - Система будет отслеживать:
     - Количество арендованных велосипедов за определенный период.
     - Доходы от аренды велосипедов.
     - Самые часто арендуемые велосипеды и их использование.

## Технические требования

- **Технологии**
  - Frontend: HTML5, CSS3, адаптивный дизайн.
  - Backend: Flask (Python) для серверной логики.
  - База данных: PostgreSQL или SQLite для хранения данных о пользователях, велосипедах и транзакциях.

- **Архитектура**
  - Архитектура MVC (Model-View-Controller) для разделения логики приложения и пользовательского интерфейса.

## Безопасность

- Шифрование конфиденциальных данных (например, паролей) с использованием библиотеки bcrypt.
- Подтверждение личности пользователей.
- Защита от CSRF атак и SQL-инъекций.

## Целевая аудитория
Посетители байкпарка, ищущие возможность аренды качественных велосипедов, и сотрудники байкпарка, управляющие предложением и обслуживанием этих велосипедов.
