# Код: Python, C++, фронтенд и дополнительные языки

> Данные актуальны на 2026-10-09.

В C++ две компании расходятся почти по каждому параметру, который видно глазами: отступ 4 против 2, строка без предела против 80 колонок, `TFoo`/`IFoo`/`EFoo`/`NFoo` против `Foo` и `snake_case`-переменных, `#pragma once` против `#define`-guard, стандартная библиотека последней в списке include против первой, и главное - исключения как основной способ сообщать об ошибках против их полного запрета в пользу `absl::Status`. В Python расхождения мельче, но системнее: Яндекс в открытых репозиториях живёт на инструментах экосистемы (ruff или black, 120 колонок, двойные кавычки, mypy), Google - на собственном гайде с особыми правилами импортов (только модули, без относительных), 80 колонками, pyink и pylintrc, а его внутренний отступ в 2 пробела в публичный гайд так и не попал. Во фронтенде Google публикует гайд Angular, но ни строчки о React; Яндекс не публикует ни одного прозаического гайда, зато поддерживает живые конфиги Gravity UI для React и БЭМ-имена классов. Для Django и FastAPI публичных правил нет ни у одной компании. Семь самых заметных различий - в [таблице ниже](#семь-главных-различий); парные примеры одного кода в двух стилях - в [examples.md](examples.md), причины и история - в [approach.md](approach.md).

Содержание: [Семь главных различий](#семь-главных-различий) · [C++](#c) · [Python](#python) · [Фронтенд](#фронтенд) · [Django и FastAPI](#django-и-fastapi) · [Дополнительные языки](#дополнительные-языки) · [Доля автоматизируемых правил](#доля-автоматизируемых-правил)

Как читать. Правила профилей обозначены их ID: `Y-…` - профиль Яндекса, `G-…` - профиль Google; каждый ID ведёт в документ профиля. «Яндекс» в таблицах означает выбранный вариант профиля - аркадийный для C++ и конфиги Gravity UI для веба; альтернативные стили (userver, YTsaurus) названы отдельно. В столбце «почему так» факты из источников отделены от наших выводов пометкой «Интерпретация:». Полные отчёты по источникам - [../research/yandex.md](../research/yandex.md) и [../research/google.md](https://github.com/k1sur1n/google-codestyle/blob/main/research/google.md); термины вроде «Аркадия», «readability», «ya style» - в [glossary.md](glossary.md).

## Семь главных различий

| # | Тема | Яндекс | Google | Где подробнее |
|---|---|---|---|---|
| 1 | Исключения в C++ | основной способ сообщать об ошибках ([Y-CPP-048](../docs/languages/cpp.md)) | запрещены, ошибки - `absl::Status` ([G-CPP-034](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-035](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)) | [C++ → ошибки](#ошибки-исключения-против-abslstatus) |
| 2 | Имена типов в C++ | префиксы `T`/`I`/`E`/`N`, поля `Name_`, переменные `camelCase` ([Y-CPP-020](../docs/languages/cpp.md) … [Y-CPP-027](../docs/languages/cpp.md)) | без префиксов, переменные `snake_case`, константы `kName` ([G-CPP-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) … [G-CPP-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)) | [C++ → заголовок](#заголовок-всё-различие-в-одном-файле) |
| 3 | Длина строки и отступ в C++ | 4 пробела, `ColumnLimit: 0` ([Y-CPP-001](../docs/languages/cpp.md), [Y-CPP-018](../docs/languages/cpp.md)) | 2 пробела, 80 колонок ([G-CPP-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)) | [C++ → таблица](#c-таблица) |
| 4 | Импорты в Python | PEP 8 и isort через ruff ([Y-PY-011](../docs/languages/python.md)) | только модули, без относительных, сортировка по полному пути ([G-PY-017](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-PY-018](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-PY-022](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)) | [Python → импорты](#импорты-главное-отличие-python) |
| 5 | Длина строки и форматтер в Python | 120, `ruff format` ([Y-PY-001](../docs/languages/python.md), [Y-PY-002](../docs/languages/python.md)) | 80, pyink и pylintrc ([G-PY-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-PY-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)) | [Python → таблица](#python-таблица) |
| 6 | Фронтенд | React, БЭМ-имена, конфиги Gravity UI: 4 пробела, `{a: 1}` ([Y-TS-001](../docs/languages/other.md), [Y-CSS-001](../docs/frameworks/react.md)) | Angular Style Guide 2025 и TS-гайд: 2 пробела, именованные экспорты, классы только через дефис ([G-TS-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md), [G-TS-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md), [G-CSS-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md)) | [Фронтенд](#фронтенд) |
| 7 | Откуда правила | тексты и конфиги отдельных проектов, часть - только реконструкция | один публичный набор гайдов, копии внутренних | [approach.md](approach.md) |

## C++

**Вывод.** Это самая далёкая пара стилей в репозитории. Профиль Яндекса - аркадийный диалект: исключения, собственные префиксы имён, 4 пробела, строка без предела, `#pragma once`, стандартная библиотека в конце списка include; внутри Аркадии к этому добавляется библиотека `util` с `TString`, `THolder` и `yexception`. Профиль Google - публичный гайд: без исключений и почти без RTTI, `absl::Status` вместо `throw`, 2 пробела и 80 колонок, `#define`-guard от пути файла, Abseil первой в списке библиотек, длинный перечень запрещённых возможностей языка. Совпадают они в немногом, но важном: оба целятся в C++20, оба пишут функции в PascalCase, оба требуют `override`, `nullptr`, `explicit`, фигурные скобки и комментарий у закрывающей скобки namespace, оба держат поля класса с завершающим `_` и оба кладут тест рядом с кодом. Источник правил тоже устроен по-разному: у Google один текст, у Яндекса - три редакции одного гайда (CatBoost, util, YDB) плюс два отдельных стиля, YTsaurus и userver; подробности - в [../research/yandex.md](../research/yandex.md) и [../research/google.md](https://github.com/k1sur1n/google-codestyle/blob/main/research/google.md).

### C++: таблица

| Параметр | Яндекс (аркадийный вариант) | Google | Почему так |
|---|---|---|---|
| Отступ и длина строки | 4 пробела; `ColumnLimit: 0` - форматтер строки не переносит, ориентир 110 символов из дополнений CatBoost ([Y-CPP-001](../docs/languages/cpp.md), [Y-CPP-018](../docs/languages/cpp.md), [Y-CPP-019](../docs/languages/cpp.md)) | 2 пробела; 80 колонок с исключениями для URL, `#include` и guard ([G-CPP-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)) | У Яндекса предел не записан ни в общем гайде, ни в дефолтном конфиге `cppcommittee`; 110 - правило одной команды, у userver - 120. У Google 80 колонок - требование гайда, которое пресет `Google` в clang-format воспроизводит. Интерпретация: при `ColumnLimit: 0` переносы остаются авторскими, и ревьюер в Яндексе всё ещё судит о раскладке аргументов, а в Google её целиком выдаёт форматтер. |
| Скобки и положение `*`/`&` | 1TBS: `{` на строке оператора, функции и классы - тоже; `{}` обязательны даже для одного оператора (`InsertBraces: true`); `const T& value`, `int* p` ([Y-CPP-002](../docs/languages/cpp.md) … [Y-CPP-006](../docs/languages/cpp.md)) | то же положение `{`; однострочный `if (x) return;` без скобок «разрешён, но не поощряется»; `char* c`, `const std::string& s` без вариантов с 2025-07-31 ([G-CPP-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)) | Положение `*` у обеих компаний одинаковое; Google закрепил его в гайде в 2025 году, а пресет clang-format до версии 20 включительно подражал стилю файла (`DerivePointerAlignment: true`), поэтому профиль Google пишет опцию явно. Обязательные скобки в конфиге Аркадии появились 2024-11-22; гайд Google ту же норму смягчил 2026-05-07. |
| Типы, интерфейсы, перечисления, пространства имён | `TFoo`, `IFoo` (абстрактный класс без полей), `EFoo` со значениями `PascalCase`, `NFoo` с отступом тела, концепты `CFoo` ([Y-CPP-020](../docs/languages/cpp.md) … [Y-CPP-023](../docs/languages/cpp.md), [Y-CPP-033](../docs/languages/cpp.md), [Y-CPP-010](../docs/languages/cpp.md)) | `Foo` без префиксов для всех типов и концептов; перечислители `kFoo`; namespace в `snake_case` без отступа ([G-CPP-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-015](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)) | Префиксы подтверждены текстами и кодом util, CatBoost, YDB и YTsaurus; объяснения их происхождения в публичных источниках нет. Интерпретация: префикс сообщает категорию сущности без контекста, и в коде, где рядом живут `TString` и `std::string`, это помогает отличать своё от стандартного. Дефолтный clang-tidy Аркадии префиксы не проверяет - они держатся на ревью, и в профиле Яндекса их проверка помечена как реконструкция. |
| Функции, переменные, поля, константы, макросы | функции и методы `PascalCase`; локальные и параметры `camelCase`; поля `PascalCase`, приватные с `_`; константы namespace и макросы `UPPER_CASE`, макросы с префиксом проекта ([Y-CPP-024](../docs/languages/cpp.md), [Y-CPP-026](../docs/languages/cpp.md) … [Y-CPP-029](../docs/languages/cpp.md)) | функции `PascalCase`, аксессоры можно `snake_case`; переменные и параметры `snake_case`; поля класса `snake_case_`, поля структуры без `_`; константы `kMixedCase`; макросы `MYPROJECT_UPPER_CASE` ([G-CPP-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) … [G-CPP-014](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-016](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)) | Единственное полное совпадение - PascalCase у функций. Завершающий `_` у приватных полей гайд CatBoost получил только 2026-07-18, и в существующем коде YDB и CatBoost таких полей ноль из сотен; у Google суффикс - правило гайда без оговорок о старом коде. `UPPER_CASE` для констант - спорный пункт даже внутри Яндекса: YDB и YTsaurus пишут их в PascalCase. |
| Файлы | `snake_case`, `.h` и `.cpp`, тесты `*_ut.cpp` ([Y-CPP-034](../docs/languages/cpp.md)) | `snake_case` (допустим дефис), `.h` и `.cc`, тесты `*_test.cc`, текстовые включения `.inc` ([G-CPP-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-071](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)) | Расширение `.cc` - узнаваемый признак кода Google; у Яндекса `.cpp` (userver - `.hpp` и `.cpp`). Правила для имён каталогов нет ни у той, ни у другой компании. |
| Защита заголовка и порядок include | `#pragma once` первой строкой; include «от частного к общему»: парный заголовок, локальные, каталоги проекта, сторонние, базовая библиотека, стандартная библиотека; `SortIncludes: false` - порядок держит ревью ([Y-CPP-035](../docs/languages/cpp.md), [Y-CPP-039](../docs/languages/cpp.md)) | `#define`-guard `<PROJECT>_<PATH>_<FILE>_H_`, `#pragma once` запрещён; порядок: парный, системные C, стандартная библиотека, чужие, свои; пресет сортирует и перегруппировывает ([G-CPP-019](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-022](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)) | Оба гайда ставят парный заголовок первым и объясняют это одинаково: так компилятор проверяет самодостаточность заголовка. Дальше порядок зеркальный: Яндекс заканчивает стандартной библиотекой, Google начинает с неё. Причина зеркальности в источниках не названа. Интерпретация: guard от полного пути единственен в монорепозитории любого размера и не зависит от того, как компилятор отождествляет файлы; `#pragma once` короче и в Аркадии дописывается `ya style` автоматически. |
| Исключения | основной способ сообщать об ошибках; коды возврата - только в C-коде и в доказанно горячих местах ([Y-CPP-048](../docs/languages/cpp.md)) | запрещены полностью, вместе с `std::exception_ptr`; сборка с `-fno-exceptions` ([G-CPP-034](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)) | Google объясняет запрет практикой, а не принципом: существующий код не рассчитан на исключения, перевод слишком дорог, а открытым проектам исключения не рекомендуются, чтобы их можно было использовать внутри компании; гайд добавляет, что при старте с нуля решение, вероятно, было бы другим. У Яндекса обратное решение записано в гайде без обоснования; в сборке ya `-fexceptions` снимается только явным `NO_CXX_EXCEPTIONS`. |
| Обработка ошибок и инварианты | свой базовый класс исключений проекта, текст ошибки собирается в месте броска; инварианты - макросом проекта (`Y_ENSURE`, `YT_VERIFY`, `UINVARIANT`), не `assert()`; серверный код не завершает процесс там, где можно вернуть ошибку ([Y-CPP-049](../docs/languages/cpp.md) … [Y-CPP-051](../docs/languages/cpp.md)) | восстановимая ошибка - `absl::Status` или `absl::StatusOr<T>`, статус нельзя игнорировать; конструктор, который может не удаться, заменяется фабрикой; диагностика - через библиотеку логирования, а не `std::cerr` ([G-CPP-035](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-036](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-038](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)) | Правило о `absl::Status` - из документации Abseil, в самом гайде его нет, отсюда SHOULD. У Яндекса правило о логах взято из гайда YTsaurus (единственный письменный источник), а запрет abort-макросов - из инструкции YDB для ИИ-агентов 2026 года; аркадийный гайд о логировании молчит. |
| RTTI и другие ограничения языка | RTTI: письменного правила нет, включён по умолчанию; запрещены Boost, приёмы «чистого C» и вычисления на шаблонах, лишний препроцессор, завершающий возвращаемый тип без нужды ([Y-CPP-059](../docs/languages/cpp.md) … [Y-CPP-062](../docs/languages/cpp.md)); единой позиции по целым типам нет | RTTI избегать вне тестов; запрещены модули C++20, пользовательские литералы включая `5s`, `<filesystem>`, `long double`, `short`/`long`, C-приведения, `using namespace`, статические объекты с нетривиальным деструктором, объявление вперёд чужих сущностей, `auto`-параметры; корутины - только через одобренные библиотеки ([G-CPP-040](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) … [G-CPP-045](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-051](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) … [G-CPP-054](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-061](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) … [G-CPP-064](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)) | Гайд Google - в первую очередь перечень языковых ограничений, и он их регулярно пополняет (2024-09-05 - `long double`, модули, корутины; 2026-05-01 - объявления вперёд). Аркадийный гайд короче и описывает оформление и имена; содержательные запреты в нём - один абзац «Background». Boost обе компании не используют: у Яндекса это прямой запрет, у Google раздел о Boost заменён 2026-05-01 общим правилом о сторонних библиотеках ([G-CPP-068](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)). |
| Стандартная библиотека и своя | в Аркадии - `util`: `TString`, `TVector`, `THashMap`, `TMaybe`, `yexception`; вне Аркадии профиль берёт `std::`, потому что `util` недоступен; тренд 2024-2026 - сближение со `std::` | приоритет: то, что уже принято в кодовой базе → Abseil → стандартная библиотека → свои библиотеки → сторонние ([G-CPP-068](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)); правила совместимости Abseil обязательны ([G-CPP-069](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)) | Abseil - открытая версия базовой библиотеки Google, и гайд прямо называет её API (`absl::StrCat`, `absl::down_cast`, `absl::Status`); с редакции 2024-02-12 в ряде мест гайд предпочитает `std` аналогам из `absl`. `util` снаружи Аркадии не собирается; 2026-07-15 из гайда CatBoost убрали поощрение `TString`, ядро YTsaurus уже на `std::vector` и `std::string`. |
| Владение и умные указатели | умный указатель выражает владение, единоличное предпочтительнее разделяемого, сырой указатель - невладеющая ссылка; в Аркадии - `THolder` и `TIntrusivePtr` ([Y-CPP-053](../docs/languages/cpp.md)) | один владелец, передача через `std::unique_ptr`; `std::shared_ptr` - только с веской причиной; выходные параметры заменяются возвращаемым значением ([G-CPP-049](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md), [G-CPP-050](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)) | Правило Яндекса собрано из гайда YTsaurus и `AGENTS.md` userver - в аркадийном гайде про выбор указателей ничего, кроме «`new`, а не `malloc`». У Google правило в самом гайде, со ссылками на Tips of the Week #116 и #176. |
| Тесты | юнит-тесты обязательны для новой функциональности; файлы `*_ut.cpp` в `ut/` рядом с кодом; в Аркадии - свой фреймворк `Y_UNIT_TEST`, вне её - GoogleTest ([Y-CPP-064](../docs/languages/cpp.md) … [Y-CPP-066](../docs/languages/cpp.md)) | GoogleTest; `foo_test.cc` рядом с `foo.cc`; имена `TEST(SuiteName, TestName)` в PascalCase без `_`; API со словом `Suite` ([G-CPP-070](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) … [G-CPP-072](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)) | Ни один из гайдов раздела о тестах не содержит: у Яндекса правила взяты из README util и инструкций YDB, у Google - из документации GoogleTest и двух проверок clang-tidy. Фреймворк unittest Аркадии работает только в сборке ya, поэтому вне её остаётся GoogleTest, на котором уже живут YTsaurus и userver. |
| Стандарт языка | C++20 ([Y-CPP-067](../docs/languages/cpp.md)); CUDA-код - C++17 или C++20; YTsaurus заявил переход на C++23 | C++20 без возможностей C++23 ([G-CPP-073](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)); Chromium уже на C++23 | Google перешёл на C++20 в гайде 2023-10-12 (с C++17); гайд CatBoost называл C++14 до 2026-07-17 - хотя сборка ya давно собирала C++20 по умолчанию. Интерпретация: у Google стандарт двигает текст гайда, у Яндекса - система сборки, а тексты догоняют. |
| Форматтер и линтер | дефолтный `.clang-format` Аркадии (один файл в четырёх репозиториях, владелец `cppcommittee`) на стоковом clang-format 18; clang-tidy - реконструкция из дефолта Аркадии и конфигов YQL и YT Flow; внутри - `ya style` с патченной сборкой `ynd-clang-format-18` | `BasedOnStyle: Google` плюс явные `PointerAlignment` и `Standard`; clang-tidy `google-*` и настроенный `readability-identifier-naming`; cpplint - форк сообщества, из google/styleguide удалён 2024-07-08 | Общее у компаний: ни одна не запускает clang-format или clang-tidy в публичных GitHub Actions (0 из 24 workflow у Google; ни одной задачи у ydb, catboost, ytsaurus, userver). Стоковый clang-format с конфигом Аркадии расходится с патченной сборкой в положении `{` после списка инициализации конструктора - 101 из 113 отличающихся файлов util. |

### Заголовок: всё различие в одном файле

Один и тот же заголовок кеша, написанный по двум профилям. Оба варианта проходят `clang-format --dry-run --Werror` с конфигом своего профиля ([Яндекс](../configs/cpp/.clang-format), [Google](https://github.com/k1sur1n/google-codestyle/blob/main/configs/cpp/.clang-format), clang-format 18.1.3); полный класс с реализацией - в [examples.md](examples.md).

```cpp
// Яндекс: cache/lru_cache.h
#pragma once

#include "cache_options.h"

#include <myproject/base/string_utils.h>

#include <optional>
#include <string>

namespace NCache {
    enum class EEvictionPolicy {
        LeastRecentlyUsed,
        FirstInFirstOut,
    };

    class TLruCache: public ICache {
    public:
        explicit TLruCache(const TCacheOptions& options);

        std::optional<std::string> Find(const std::string& key) override;
        void Insert(const std::string& key, std::string value);

    private:
        TCacheOptions Options_;
        size_t Size_ = 0;
    };
} // namespace NCache
```

```cpp
// Google: myproject/cache/lru_cache.h
#ifndef MYPROJECT_CACHE_LRU_CACHE_H_
#define MYPROJECT_CACHE_LRU_CACHE_H_

#include <optional>
#include <string>
#include <string_view>

#include "absl/strings/str_cat.h"
#include "myproject/cache/cache_options.h"

namespace myproject {

enum class EvictionPolicy { kLeastRecentlyUsed, kFirstInFirstOut };

class LruCache : public Cache {
 public:
  explicit LruCache(const CacheOptions& options);

  std::optional<std::string> Find(std::string_view key) override;
  void Insert(std::string_view key, std::string value);

 private:
  CacheOptions options_;
  int size_ = 0;
};

}  // namespace myproject

#endif  // MYPROJECT_CACHE_LRU_CACHE_H_
```

Что здесь видно. Первая строка - `#pragma once` против guard от пути ([Y-CPP-035](../docs/languages/cpp.md), [G-CPP-019](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)). Список include у Яндекса идёт от своего к чужому и заканчивается `<string>`, у Google стандартная библиотека стоит сразу после парного заголовка, а свои файлы - последними и с путём от корня проекта в кавычках ([Y-CPP-039](../docs/languages/cpp.md), [G-CPP-022](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)). Тело namespace у Яндекса сдвинуто, как тело класса, а у Google нет; перед комментарием `// namespace` пресет Google ставит два пробела, конфиг Аркадии - один ([Y-CPP-010](../docs/languages/cpp.md), [G-CPP-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)). Метки доступа: в Яндексе `public:` стоит в колонке класса, у Google - с отступом в один пробел ([Y-CPP-011](../docs/languages/cpp.md)). Имена: `TLruCache`, `ICache`, `EEvictionPolicy`, `NCache` и поля `Options_` против `LruCache`, `Cache`, `EvictionPolicy`, `myproject` и `options_` ([Y-CPP-020](../docs/languages/cpp.md) … [Y-CPP-026](../docs/languages/cpp.md), [G-CPP-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md) … [G-CPP-015](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)). Значения перечисления - `LeastRecentlyUsed` против `kLeastRecentlyUsed` ([Y-CPP-022](../docs/languages/cpp.md), [G-CPP-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)). Перечисление в одну строку у Яндекса не переживает и форматтер: конфиг Аркадии разбивает `enum class EKind { A, B };` по строкам (наблюдение авторов профиля на clang-format 18.1.3), поэтому значения пишут по одному на строку. Наконец, `size_t` против `int`: гайд Google разрешает из встроенных целых только `int`, а беззнаковые - лишь для битовых масок ([G-CPP-040](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)); у Яндекса единой позиции нет - дополнения CatBoost требуют беззнаковые для размеров, YTsaurus - знаковые (см. [раздел 7 профиля](../docs/languages/cpp.md)).

### Ошибки: исключения против `absl::Status`

Это различие меняет сигнатуры, а не оформление, и поэтому важнее всех остальных: код, написанный по одному профилю, нельзя перевести в другой автозаменой.

```cpp
// Яндекс (Y-CPP-048, Y-CPP-049): ошибка - исключение проекта
TModel LoadModel(const std::string& path) {
    if (path.empty()) {
        throw TModelError("Model path is empty");
    }
    return TModel::FromFile(path);
}

void Run(const TOptions& options) {
    try {
        TModel model = LoadModel(options.ModelPath);
        model.Apply(options.Input);
    } catch (const TModelError& e) {
        LOG_ERROR("Model loading failed (Path: " << options.ModelPath << ", Error: " << e.what() << ")");
    }
}
```

```cpp
// Google (G-CPP-034, G-CPP-035): ошибка - значение, которое нельзя проигнорировать
absl::StatusOr<Model> LoadModel(std::string_view path) {
  if (path.empty()) {
    return absl::InvalidArgumentError("model path must not be empty");
  }
  return Model::FromFile(path);
}

absl::Status Run(const Options& options) {
  absl::StatusOr<Model> model = LoadModel(options.model_path);
  if (!model.ok()) {
    return model.status();
  }
  model->Apply(options.input);
  return absl::OkStatus();
}
```

В варианте Яндекса тип возвращаемого значения - сама модель, ошибка уходит вверх по стеку сама, и единственное письменное требование - один базовый класс исключений на проект и текст ошибки, собранный в месте броска ([Y-CPP-049](../docs/languages/cpp.md)); формат сообщения в логе - «не предложение, без точки, переменные в скобках парами `Key: value`» - взят из гайда YTsaurus ([Y-CPP-052](../docs/languages/cpp.md)). В варианте Google ошибка - часть сигнатуры: `absl::StatusOr<Model>` заставляет вызывающий код проверить `ok()`, а `ABSL_MUST_USE_RESULT` не даёт отбросить статус молча; за `try` компилятор с `-fno-exceptions` отвечает ошибкой. Цена - каждая функция, которая может не справиться, обрастает проверкой и прокидыванием статуса; Google считает эту цену меньше, чем переписывание существующего кода под исключения, и говорит об этом в гайде прямо. Интерпретация: для нового проекта вне обеих компаний выбор зависит от зависимостей - библиотеки на исключениях (большая часть экосистемы) плохо живут под `-fno-exceptions`, а Abseil и GoogleTest собираются в обоих режимах.

### Форматтер: кто решает, где переносить строку

Оба профиля отдают оформление clang-format, но роль у него разная. Конфиг Аркадии задаёт `ColumnLimit: 0`: форматтер правит пробелы, скобки и отступы, а переносы оставляет авторскими - поэтому правило о раскладке длинного списка аргументов в профиле Яндекса проверяет ревью, а не инструмент ([Y-CPP-019](../docs/languages/cpp.md)). Пресет Google перекладывает строки сам: аргументы либо выравниваются по скобке, либо уходят на новую строку с отступом 4 ([G-CPP-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)), и спорить о раскладке на ревью не о чем. Вторая разница - бинарь. Яндекс форматирует собственной сборкой `ynd-clang-format-18`; стоковый clang-format с тем же конфигом ставит `{` после списка инициализации конструктора на той же строке, а гайд и код util - на отдельной ([Y-CPP-005](../docs/languages/cpp.md)). Профиль Яндекса принял вывод стокового форматтера, иначе проверка в CI невозможна. У Google проблема обратная и уже решённая: пресет до clang-format 20 угадывал положение `*` по файлу, с 21.1.0 ставит `T* p`, как требует гайд ([G-CPP-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)); профиль пишет опцию явно, чтобы результат не зависел от версии. Третье - где всё это запускается. Внутри Аркадии стилевой тест включается макросом `STYLE_CPP()` по каталогам, и в открытых репозиториях он подключён только для `util`, `yql/essentials` и двух каталогов YDB; у Google проверки идут вне GitHub. В публичных CI ни одна из компаний clang-format не запускает - это общая черта, а не различие.

### Библиотека: `util` против Abseil

Аркадийный стиль неотделим от `util`: `TString`, `TVector`, `THashMap`, `TMaybe`, `THolder`, `yexception` и макросы `Y_ENSURE`, `Y_ABORT_UNLESS` - это и есть «диалект», который видит внешний читатель кода YDB или CatBoost. Снаружи Аркадии `util` не собирается, поэтому профиль Яндекса заменяет его стандартной библиотекой и помечает замену «не Яндекс»; сами проекты движутся туда же - ядро YTsaurus и C++ SDK YDB написаны на `std::`, а в `catboost/libs/model` пока 511 `TVector<` против 53 `std::vector<` (подсчёт авторов исследования, см. [раздел 7 профиля](../docs/languages/cpp.md)). У Google своя базовая библиотека открыта - это Abseil, и гайд ставит её первой в порядке предпочтения, называя конкретные API: `absl::StrCat` вместо `printf` ([G-CPP-039](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)), `absl::down_cast` для приведения вниз ([G-CPP-042](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md)), `absl::Status` для ошибок. При этом «Abseil первой» не значит «вместо всего»: с редакции 2024-02-12 гайд в ряде мест предпочитает `std`. Практическое следствие для чужого репозитория: профиль Google переносится вместе с зависимостью от Abseil, профиль Яндекса - без зависимости от `util`, но и без половины узнаваемых типов.

### userver: стиль Google внутри Яндекса

userver - исключение, которое стоит знать, прежде чем говорить «так пишут в Яндексе». Письменного гайда у фреймворка нет, стиль задают `.clang-format`, `.clang-tidy` и `AGENTS.md`, и по именам это стиль Google: типы без префиксов (`Mutex`, `HttpHandlerBase`), поля `snake_case_`, константы `kCamelCase`, пространства имён `lower_case` (см. [раздел 13 профиля Яндекса](../docs/languages/cpp.md)). Оформление при этом аркадийное: `BasedOnStyle: Google`, но `IndentWidth: 4`, `ColumnLimit: 120`, `AccessModifierOffset: -4` - к этому userver пришёл 2024-10-20, уйдя от чистого Google-стиля с 2 пробелами и 80 колонками, а 2025-11-23 переформатировал 1855 файлов «под ya style»; имена остались прежними.

```cpp
// userver: имена по Google, отступ и ширина по Аркадии
namespace sample::handlers {

class HelloHandler final : public server::handlers::HttpHandlerBase {
public:
    static constexpr std::string_view kName = "handler-hello";

    std::string HandleRequestThrow(const server::http::HttpRequest& request, server::request::RequestContext&)
        const override;

private:
    std::string greeting_;
};

}  // namespace sample::handlers
```

Сниппет проверен копией `.clang-format` userver (коммит `fa7f958`) без последней строки `VanillaContinuationIndenter: true`, которую стоковый clang-format 18.1.3 не знает. Исключения и RTTI в userver разрешены, как и везде в Яндексе; на C++17 фреймворк отказался в версии 3.0 (2026-04). Интерпретация: userver - ближайшая к профилю Google точка в коде Яндекса, и команде, которой нужны стоковые инструменты и стандартная библиотека без аркадийных имён, профиль Яндекса предлагает именно его как альтернативу.

### Chromium: производный гайд, который расходится с основным

«Google style» для C++ не один, и Chromium - самый заметный пример. Его гайд объявляет, что следует публичному гайду Google «кроме перечисленного», но перечисленное велико: целевой стандарт C++23 (по состоянию на 01/2026) против C++20 в основном гайде; `{}` обязательны на всех условиях и циклах, тогда как основной гайд однострочную форму лишь «не поощряет»; объявления вперёд предпочтительнее `#include` - прямо названное отличие от Google; большая часть Abseil запрещена (`StatusOr`, `string_view`, Strings, Synchronization, Time, flags), как и `std::function`, `std::shared_ptr`, `<chrono>`, `<format>`, `<span>`; поля-указатели - `raw_ptr<T>`; суффикс тестов `_unittest.cc`, который основной гайд объявил устаревшим; форматирование - отдельным пресетом `Chromium` (пресет `Google` с запретом однострочных `if` и одним параметром на строку). Fuchsia идёт своим путём короче: 100 колонок и запрет вложенных namespace. Таблица на 17 параметров - в [разделе 11 профиля Google](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/cpp.md). Интерпретация: производные гайды обеих компаний устроены одинаково - «основной гайд плюс исключения», - но у Google исключения записаны в собственных документах проектов, а у Яндекса они видны по конфигам и коду (YTsaurus, userver) и лишь частично по текстам.

## Python

**Вывод.** В Python обе компании стоят на PEP 8, и внешне код похож сильнее, чем в C++: 4 пробела, `snake_case`, `CapWords`, `is None`. Расходятся они в том, что над PEP 8 надстроено. У Google это собственный гайд с правилами, которых в PEP 8 нет: импортировать только модули, никаких относительных импортов, сортировка по полному пути, формат docstring с `Args:`/`Returns:`/`Raises:`, запрет `staticmethod` и нескольких `for` в comprehension, 80 колонок, обязательный pylint с опубликованным `pylintrc`. У Яндекса единого гайда нет - есть дефолтные конфиги Аркадии (black или ruff на 120 колонках, `flake8` с пятью группами правил), один письменный гайд команды YTsaurus и семнадцать открытых репозиториев с собственными настройками; профиль Яндекса - реконструкция по ним: `ruff format` и `ruff check`, 120 колонок, двойные кавычки, mypy с обязательными аннотациями, pytest, Python 3.10. Итог для практики: правила Google меняют то, как пишется каждый импорт и каждый docstring; правила Яндекса почти целиком выражаются конфигом инструментов и в прозе почти не нуждаются.

### Python: таблица

| Параметр | Яндекс (профиль) | Google | Почему так |
|---|---|---|---|
| Отступ | 4 пробела ([Y-PY-003](../docs/languages/python.md)) | 4 пробела в публичном гайде ([G-PY-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)); внутри Google и в 8 из 12 открытых Python-репозиториев - 2 | Комментарий в самом `pylintrc` Google говорит, что внутренний гайд требует 2 пробела, а публичный - 4, как PEP 8; до февраля 2025 года и `pylintrc` требовал 2. Профиль Google берёт 4 по тексту гайда и помечает 2 как известное расхождение. У Яндекса вариантов нет: PEP 8 в гайде YTsaurus и группа `W` в дефолтном ruff Аркадии. |
| Длина строки | 120; `E501` выключен, длину держит форматтер ([Y-PY-002](../docs/languages/python.md)) | 80 с исключениями для длинных импортов и URL; pyink `line-length = 80`, `pylint C0301` ([G-PY-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)) | 120 стоит в обоих дефолтных конфигах Аркадии (black и ruff) и в 6 из 17 репозиториев; гайд YTsaurus требует 100, flake8 Аркадии ловит только строки длиннее 200. Почему выбрано 120 - публичных данных не найдено. У Google 80 - число из гайда; pyink и Black по умолчанию дают 88, поэтому значение задаётся явно. |
| Кавычки | двойные ([Y-PY-004](../docs/languages/python.md)) | один вид в пределах файла, любой; docstring всегда `"""` ([G-PY-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)) | Двойные - единственное письменное правило Яндекса (гайд YTsaurus) и поведение black по умолчанию; дефолт Аркадии кавычки не нормализует (`skip-string-normalization`), три репозитория из 17 выбрали одинарные. Гайд Google требует только единообразия; pyink с `pyink-use-majority-quotes` сохраняет вид, которого в файле больше, - ради этого Google и держит форк Black. |
| Форматтер | `ruff format` с проверкой в CI; вариант B - black 120 без нормализации кавычек, буквальный дефолт Аркадии ([Y-PY-001](../docs/languages/python.md)) | pyink (форк Black от Google) с проверкой в CI; Black - допустимая замена; yapf не обновляется с 2024-11 ([G-PY-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)) | В Аркадии дефолтный форматтер - black, ruff появился как опция 2024-01-24; на ruff уже 11 из 17 репозиториев, и новые стартуют на нём. pyink Google объясняет невозможностью перевести монорепозиторий на Black за один день; пресета «Google» у pyink нет - опции выставлены по тексту гайда. Ни один из 12 открытых Python-репозиториев Google не проверяет pyink в CI. |
| Импорты: что и как | PEP 8: `from pkg.module import Name` допустим; порядок стандартная библиотека → сторонние → свои, сортирует `ruff I001`; относительные - только внутри пакета ([Y-PY-011](../docs/languages/python.md) … [Y-PY-014](../docs/languages/python.md)) | только модули и пакеты (`from pkg import module`), кроме `typing` и `collections.abc`; относительные запрещены; один импорт на строку; сортировка по полному пути без разделения `import x` и `from x import y` ([G-PY-017](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) … [G-PY-022](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)) | Гайд Google объясняет: по записи `x.Obj` читатель видит, где `Obj` определён. Публичной проверки правила «только модули» нет - гайд ссылается на внутренние проверки pylint с префиксом `g-`. У Яндекса конфликт внутри компании: гайд YTsaurus сортирует «от частного к общему», как `#include` в C++, остальные 13 из 17 - по PEP 8; профиль берёт большинство. |
| Именование | PEP 8 через `ruff N`; префиксы `T`/`I`/`E` из C++ в Python не переносят ([Y-PY-009](../docs/languages/python.md), [Y-PY-010](../docs/languages/python.md)) | PEP 8 с прямой отсылкой с 2026-09-10; акроним в `CapWords` заглавными целиком (`HTTPServerError`); `TypeVar` с описательным именем ([G-PY-011](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) … [G-PY-016](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)) | Здесь Яндекс и Google пишут одинаково - оба следуют PEP 8. Оговорка Google: `pylintrc` пропускает `CamelCase` у функций - наследие внутреннего стиля, в котором методы когда-то назывались как в C++ ради единообразия с ним (так пересказывает книгу «Software Engineering at Google» профиль Google, [раздел 11](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)). |
| Формат docstring | reST-поля `:param:`, `:return:`; наличие не проверяется ([Y-PY-020](../docs/languages/python.md), [Y-PY-021](../docs/languages/python.md)) | секции `Args:`, `Returns:`/`Yields:`, `Raises:`, `Attributes:`; обязателен для публичных и нетривиальных функций; `@override` освобождает от docstring ([G-PY-027](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) … [G-PY-032](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)) | «Google style» docstring - одно из немногих правил Google, ставшее нормой далеко за пределами компании. В Яндексе формата нет: четыре SDK пишут reST, YaFSDP и tabm - формат Google, CatBoost - NumPy; проверку наличия docstring отключили все проекты, где она возможна. Профиль Яндекса взял reST как формат большинства SDK. |
| Аннотации и проверка типов | аннотации у всех функций, mypy с `disallow_untyped_defs` ([Y-PY-031](../docs/languages/python.md), [Y-PY-032](../docs/languages/python.md)) | аннотировать публичный API, каждую функцию не требуется; проверка типов в CI; гайд называет pytype, профиль - mypy «не Google» ([G-PY-042](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) … [G-PY-045](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)) | У Яндекса правило взято с запасом строгости: полнота аннотаций в репозиториях следует за инструментом - 99 % в ch-tools с `disallow_untyped_defs` против 3 % в `yt/python`, где аннотаций ждёт только текст гайда. У Google pytype в архиве с 2026-09-03 (Python не новее 3.12), а гайд редакции 2026-09-10 всё ещё его называет; чем он заменён внутри - публичных данных не найдено, в открытых репозиториях видны mypy, pyrefly и ty. |
| Исключения | голый `except:` запрещён, `except Exception` допустим; у библиотеки одна иерархия с базовым классом ([Y-PY-025](../docs/languages/python.md), [Y-PY-026](../docs/languages/python.md)) | `except:` и `except Exception` запрещены, кроме повторного выброса и «точки изоляции»; имя класса оканчивается на `Error`; `assert` не заменяет проверку входных данных ([G-PY-035](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) … [G-PY-037](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)) | В коде Яндекса `except Exception` встречается часто (94 случая в `ydb/`, 54 в ch-tools), и дефолт Аркадии его не запрещает - `broad-except` в списке игнорируемых. Google формулирует запрет в гайде и проверяет его `pylint W0718`. Заметная разница с C++: в Python Google исключения разрешает. |
| Логирование | `logger = logging.getLogger(__name__)` на модуль; аргументы лениво, через `%`-шаблон; без `print` в библиотеке ([Y-PY-027](../docs/languages/python.md) … [Y-PY-030](../docs/languages/python.md)) | первый аргумент - литерал-шаблон с `%`, не f-строка; значения отдельными аргументами; сообщение об ошибке точно называет условие ([G-PY-038](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md), [G-PY-039](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)) | Содержательно правило одно и то же, но у Google оно в гайде с объяснением (шаблон хранится как поле для запросов, строка не форматируется зря), а у Яндекса - практика без текста: в 10 из 11 кодовых баз ленивых вызовов больше, чем f-строк, при том что flake8 Аркадии `logging-not-lazy` игнорирует. |
| Запрещённые и ограниченные возможности | письменного списка нет; ограничения - набор правил линтера: `E4`, `E7`, `E9`, `F`, `W` плюс `B`, `UP`, `N`, `G`, `LOG`; `eval` не используют ([Y-PY-036](../docs/languages/python.md) … [Y-PY-039](../docs/languages/python.md)) | глава «Python Language Rules»: без `staticmethod`, один `for` и одно условие в comprehension, свойства только для дешёвой логики, без метаклассов и прочих «мощных» возможностей, `lambda` только однострочная, условное выражение только в одну строку, без изменяемых значений по умолчанию ([G-PY-049](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) … [G-PY-060](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)) | Это главное отличие по духу: гайд Google выносит вердикт по каждой возможности языка, и инструмент эти вердикты почти не ловит (`staticmethod`, несколько `for`, свойства-обёртки - только ревью). В Яндексе ограничением считается то, что включено в линтере, и спорить о `staticmethod` там не с чем. |
| Тесты | pytest, файлы `test_*.py`, `--strict-markers`; тест приходит вместе с изменением; матрица версий Python в CI ([Y-PY-040](../docs/languages/python.md) … [Y-PY-043](../docs/languages/python.md)) | тест рядом с кодом в `<модуль>_test.py`; метод `test_<что>_<состояние>`; docstring тестам не нужен; `absltest.main()` в проектах на abseil-py; pytest с `filterwarnings = ["error"]` - практика репозиториев ([G-PY-061](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) … [G-PY-065](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)) | Раннер ни один гайд не предписывает. У Яндекса pytest назван документацией `ya test` и используется в 13 из 17 репозиториев; правила для ИИ-агентов в монорепозитории YDB при этом требуют `unittest`. У Google имя `foo_test.py` - из CONTRIBUTING TensorFlow и Keras, схема имени метода - из гайда. |
| Версия языка | 3.10 как нижняя граница ([Y-PY-046](../docs/languages/python.md)); YTsaurus - 3.8+ | минимальная версия в гайде не названа; примеры рассчитаны на 3.10-3.12 (`X \| None`, `typing.override`); в конфиге профиля 3.12 | К 3.10 сошлись активные SDK Яндекса (7 из 17; ydb-python-sdk снял 3.8 и 3.9 в июле 2026). Google гайд о версии молчит, но в тексте остались следы Python 3.5 и 3.6. |
| Набор линтеров | один инструмент - ruff (формат и линтер), mypy, pytest ([Y-PY-036](../docs/languages/python.md)) | pylint с `pylintrc` из google/styleguide (требование гайда) плюс isort, ruff и mypy - все три «не Google» ([G-PY-048](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)) | `pylintrc` Google официален, но сам называет себя «best-effort»: отключена вся категория `R`, проверки docstring функций, порядка импортов и формата TODO. Чтобы обязательные по гайду правила хоть что-то проверяло, профиль Google добавляет ruff с `convention = "google"`. У Яндекса обратная ситуация: конфиг и есть правило. |

### Импорты: главное отличие Python

Один и тот же клиент, написанный по двум профилям. Оба файла проходят `ruff format --check` и `ruff check` с конфигом своего профиля (ruff 0.16.8; для Google - его ruff-секция, pyink и pylint в среде сборки недоступны).

```python
# Яндекс: src/mypkg/metrics_client.py
"""Client for the metrics service."""

import logging
from collections.abc import Sequence

import grpc

from mypkg.errors import ClientError

logger = logging.getLogger(__name__)


class MetricsClient:
    """Thin wrapper over the metrics gRPC API."""

    def __init__(self, channel: grpc.Channel, timeout: float = 5.0) -> None:
        self._channel = channel
        self._timeout = timeout

    def fetch(self, names: Sequence[str]) -> dict[str, float]:
        """Fetch current values of the given metrics.

        :param names: metric names to fetch.
        :return: mapping from metric name to its value.
        :raises ClientError: if the service is unavailable.
        """
        if not names:
            return {}
        logger.debug("Fetching metrics (Count: %d, Timeout: %.1fs)", len(names), self._timeout)
        try:
            response = self._channel.unary_unary("/metrics.Fetch")(list(names), timeout=self._timeout)
        except grpc.RpcError as e:
            raise ClientError("Metrics service is unavailable") from e
        return dict(response)
```

```python
# Google: src/myproject/metrics_client.py
"""Client for the metrics service."""

from collections.abc import Mapping, Sequence
import logging

import grpc

from myproject import errors

_DEFAULT_TIMEOUT_SEC = 5.0


class MetricsClient:
    """A thin wrapper over the metrics gRPC API.

    Attributes:
        timeout_sec: Deadline for each request, in seconds.
    """

    def __init__(
        self,
        channel: grpc.Channel,
        timeout_sec: float = _DEFAULT_TIMEOUT_SEC,
    ):
        """Initializes the client.

        Args:
            channel: An open gRPC channel to the metrics service.
            timeout_sec: Deadline for each request, in seconds.
        """
        self._channel = channel
        self.timeout_sec = timeout_sec

    def fetch(self, names: Sequence[str]) -> Mapping[str, float]:
        """Fetches current values of the given metrics.

        Args:
            names: Names of the metrics to fetch.

        Returns:
            A mapping from metric name to its current value.

        Raises:
            errors.ServiceUnavailableError: The service did not respond.
        """
        if not names:
            return {}
        logging.debug('Fetching %d metrics', len(names))
        try:
            response = self._channel.unary_unary('/metrics.Fetch')(
                list(names), timeout=self.timeout_sec
            )
        except grpc.RpcError as e:
            raise errors.ServiceUnavailableError('metrics service') from e
        return dict(response)
```

Первое, что бросается в глаза, - блок импортов. У Яндекса он обычный: `from mypkg.errors import ClientError`, группы по PEP 8, внутри группы `import` раньше `from` - так сортирует `ruff I001` ([Y-PY-011](../docs/languages/python.md)). У Google класс ошибки не импортируется - импортируется модуль `errors`, и в коде он виден как `errors.ServiceUnavailableError` ([G-PY-017](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)); единственное исключение из этого правила - `typing` и `collections.abc`, поэтому `Mapping` и `Sequence` можно импортировать поимённо, и даже в одну строку ([G-PY-021](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)). Сортировка тоже другая: `from collections.abc import …` стоит выше `import logging`, потому что isort с профилем `google` сортирует по пути модуля, не отделяя `import x` от `from x import y` ([G-PY-022](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)). Относительный `from .errors import …` в профиле Google запрещён и ловится `ruff TID252` ([G-PY-018](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)); в профиле Яндекса он допустим внутри пакета ([Y-PY-012](../docs/languages/python.md)). Интерпретация: правило «только модули» - самое дорогое правило Google для внешнего кода, потому что ни один публичный инструмент его не проверяет, а каждый пример из документации любой библиотеки (`from fastapi import FastAPI`) его нарушает; профили Google для Django и FastAPI вынуждены оговаривать это отдельно.

Дальше - всё, что видно в сигнатурах. Строки у Яндекса доходят до 120 символов: вызов с `timeout=self._timeout` помещается в одну строку, у Google тот же вызов разложен на три, потому что предел 80 ([Y-PY-002](../docs/languages/python.md), [G-PY-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)). Кавычки: двойные против одинарных - у Google это не требование, а выбор конфига профиля под правило «один вид в файле» ([Y-PY-004](../docs/languages/python.md), [G-PY-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)). Аннотации: у Яндекса `-> None` стоит и на `__init__`, потому что mypy с `disallow_untyped_defs` иначе не пропустит ([Y-PY-031](../docs/languages/python.md)); гайд Google разрешает `__init__` без возвращаемого типа ([G-PY-042](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)), зато требует `Mapping` вместо `dict` в сигнатуре - абстрактный контейнер, а не конкретный ([G-PY-044](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)). Docstring: reST-поля в три строки против секций `Args:`/`Returns:`/`Raises:` с обязательным docstring у `__init__` - его требует `ruff D107` при `convention = "google"` ([Y-PY-021](../docs/languages/python.md), [G-PY-028](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)). Константа `_DEFAULT_TIMEOUT_SEC` у Google - внутреннее имя с `_` и `CAPS_WITH_UNDER` ([G-PY-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)); у Яндекса значение по умолчанию записано прямо в сигнатуре, никакое правило не запрещает ни того ни другого. Логирование совпадает по существу - `%`-шаблон и отдельные аргументы ([Y-PY-028](../docs/languages/python.md), [G-PY-039](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)); разница в том, что профиль Яндекса ждёт логгер модуля (`logging.getLogger(__name__)`, [Y-PY-027](../docs/languages/python.md)), а гайд Google в примерах зовёт `logging.debug` напрямую, и формат сообщения «Fetching metrics (Count: …)» у Яндекса - перенос привычки из C++-гайда YTsaurus, в Python-источниках его нет.

### Два пробела у Google и разнобой у Яндекса

У обеих компаний есть зазор между правилом и практикой, но зазоры разные. У Google он один и известный: публичный гайд требует 4 пробела, внутренний - 2, и это записано в комментарии к `pylintrc`, видно по 8 из 12 открытых Python-репозиториев (abseil-py, tensorflow, jax, flax, optax, google-research и другие; `pyink-indentation = 2` у flax и optax, `indent-width = 2` у jax) и подтверждается примерами самого гайда, часть которых набрана с отступом 2 ([раздел 11 профиля Google](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)). Профиль Google расхождение не перенимает: 4 пробела - текст гайда, текущий `pylintrc` и вся экосистема. Единственный повод писать 2 - отправлять код в проект Google, где так принято.

У Яндекса зазора между гайдом и практикой нет, потому что нет гайда; есть разброс между проектами. По 17 репозиториям длина строки задана значениями от 79 до 200 (120 - в шести, 88 - в пяти, 80 - в трёх), кавычки - тремя способами (двойные, одинарные, «не нормализовать»), форматтер - black в пяти, `ruff format` в шести, yapf в двух, нигде - в четырёх; mypy - в 11 ([таблица инструментов в профиле Яндекса](../docs/languages/python.md)). Чем ближе проект к Аркадии, тем мягче автоматика в его открытой части: YTsaurus и CatBoost живут на дефолтном flake8 с пределом 200, а гайд YTsaurus на 100 символов форматтером не поддержан, и 4,2 % строк там длиннее. Интерпретация: из этого не следует, что код Яндекса хуже оформлен, - следует, что «стиль Яндекса для Python» нельзя скопировать из одного файла, и профиль Яндекса честно назван реконструкцией, а его конфиг - сборкой из трёх слоёв (дефолт Аркадии, опции открытых репозиториев, гайд YTsaurus).

### Чем ещё они различаются на практике

**Докстринг обязателен или нет.** Профиль Google проверяет наличие docstring у публичных функций и классов через ruff `D` (`D102`, `D103`, `D107`), потому что гайд этого требует, а `pylintrc` Google эту проверку отключил - редкий случай, когда профилю пришлось взять инструмент «не Google», чтобы выполнить правило Google ([G-PY-028](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)). Профиль Яндекса наличие docstring не проверяет ([Y-PY-020](../docs/languages/python.md)): так решили все проекты выборки, у которых была такая возможность, а datalens-backend прямо пишет в конфиге, что docstring по всему репозиторию не нужны. **Проверка типов строже у Яндекса.** `disallow_untyped_defs = true` стоит в python-sdk, ch-tools и datalens-backend и перенесено в профиль ([Y-PY-031](../docs/languages/python.md)); гайд Google ограничивается публичным API, и профиль Google `disallow_untyped_defs` намеренно не включает ([G-PY-042](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)). **Запреты в языке почти не автоматизированы у Google и почти не существуют у Яндекса.** `staticmethod`, несколько `for` в comprehension, `@property`-обёртки, вложенные функции ради сокрытия, метаклассы - всё это в гайде Google запрещено или ограничено ([G-PY-049](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md) … [G-PY-058](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)) и целиком лежит на ревью: ни одно правило ruff 0.16.8 comprehension с двумя `for` не помечает (проверено запуском при подготовке профиля). У Яндекса письменного списка нет, и профиль Яндекса ограничивается тем, что включено в линтерах репозиториев: `B006`/`B008` для изменяемых значений по умолчанию, `UP` для остатков Python 2, `S307` для `eval` по желанию ([Y-PY-037](../docs/languages/python.md) … [Y-PY-039](../docs/languages/python.md)). Интерпретация: в этом и есть разница между гайдом, который воспитывает вкус, и конфигом, который ловит ошибки; подробнее о том, почему Google выбирает первое, - в [approach.md](approach.md).

## Фронтенд

**Вывод.** Сравнение здесь несимметричное. Google публикует гайды - TypeScript (последний экспорт 2023-10-11), JavaScript (заморожен с 2024-07), HTML/CSS и, вне google/styleguide, Angular Style Guide в редакции 2025 года, - но ни строчки о React: в текстах google/styleguide слово «React» не встречается. Яндекс не публикует ни одного прозаического гайда по фронтенду, зато поддерживает живые конфиги Gravity UI для ESLint, Prettier и Stylelint, которые расширяют 15 из 16 его открытых JS/TS-репозиториев, и методологию БЭМ; об Angular у Яндекса публичных данных не найдено - ни зависимости `@angular/*`, ни конфига. Поэтому в каждом профиле «чужой» фреймворк взят из общепринятого источника с пометкой: React у Google - это Rules of React с react.dev («не Google»), Angular у Яндекса - тот же гайд Angular («не Яндекс»). На уровне языка стили ближе, чем кажется: обе компании пишут одинарные кавычки, точки с запятой, `{a}` без пробелов и висячие запятые; расходятся отступ (4 против 2), ширина строки, стрелочные функции и несколько запретов TS-гайда Google, которых в конфигах Яндекса нет. На уровне CSS расходятся сильнее всего: БЭМ-имена `block__elem_mod_val` с подчёркиваниями прямо противоречат правилу гайда Google «слова в имени класса разделяются только дефисом».

### Кто что публикует

| Область | Яндекс | Google |
|---|---|---|
| Прозаический гайд по TS/JS | нет; mapsapi-codestyle команды Карт - архив с 2023-08-03, текст заморожен в 2018-2019 годах | TypeScript Style Guide (экспорт 2023-10-11, без раздела о форматировании); JavaScript Style Guide (не обновляется с 2024-07, советует переходить на TS) |
| Конфиги линтера и форматтера | `@gravity-ui/eslint-config` 4.3.2 (2026-06-30, ESLint 9, flat config), `@gravity-ui/prettier-config` 1.1.1, `@gravity-ui/stylelint-config` 5.0.0 - активны ([Y-TS-001](../docs/languages/other.md)) | gts 7.0.0 (2025-12-05; README: «not an official Google product»); `eslint-config-google` - архив с 2026-06-01, последний релиз 2019 года; конфига Stylelint у Google нет |
| React | правила отдельных проектов: `eslint.config.mjs` и `contribute/` uikit, `AGENTS.md` ydb-embedded-ui ([Y-REACT-001](../docs/frameworks/react.md) … [Y-REACT-021](../docs/frameworks/react.md)) | публичных данных не найдено; профиль - Rules of React и `eslint-plugin-react-hooks` 7.1.1, «не Google» ([G-REACT-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/react.md) … [G-REACT-015](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/react.md)) |
| Angular | публичных данных не найдено; профиль - Angular Style Guide и `angular-eslint`, «не Яндекс» ([Y-NG-001](../docs/frameworks/angular.md) … [Y-NG-015](../docs/frameworks/angular.md)) | Angular Style Guide, редакция 2025 года: 22 правила вместо «Style 01-01 … A-02» ([G-NG-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) … [G-NG-032](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md)) |
| CSS | методология БЭМ (правки 2026-05-02) и `@bem-react/classname`; Stylelint-конфиг Gravity UI ([Y-CSS-001](../docs/frameworks/react.md) … [Y-CSS-014](../docs/frameworks/react.md)) | Google HTML/CSS Style Guide (последняя содержательная правка 2025-02); конфиг Stylelint профиля собран вручную, «не Google» ([G-CSS-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) … [G-CSS-019](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md)) |

Гипотеза из постановки задачи о том, что ESLint-конфиги обеих компаний ушли в архив, верна только для старых JavaScript-конфигов: `eslint-config-loris` (2018) и `eslint-config-google` (2019). Действующие конфиги под TypeScript есть у обеих - `@gravity-ui/eslint-config` и gts, - и оба собраны под ESLint 9, тогда как актуальный мажор ESLint - 10, а поддержка ветки 9 закончилась 2026-08-06 ([eslint.org/version-support](https://eslint.org/version-support/)). Разница в статусе: конфиг Gravity UI развивается (4.0.0 с переходом на flat config - 2025-04-18, 4.3.2 - 2026-06-30) и его расширяет большинство репозиториев Яндекса, а gts после 7.0.0 получил один содержательный коммит и называет себя неофициальным; профиль Google поэтому пакет gts не подключает, а переносит его правила в собственный `eslint.config.js` под ESLint 10.12.0 поштучно.

### TypeScript: в чём разница между конфигами

| Параметр | Яндекс (Gravity UI) | Google (TS-гайд и gts) |
|---|---|---|
| Отступ | 4 пробела ([Y-TS-001](../docs/languages/other.md)) | 2 пробела - умолчание Prettier в gts и число JS-гайда ([G-TS-003](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md)) |
| Ширина строки | 100 (`printWidth`), без `max-len` | 80 в gts и JS-гайде; 100 в конфиге профиля ради Angular (шаблон Angular CLI и репозиторий Angular используют 100); публичный TS-гайд числа не задаёт |
| Кавычки, точки с запятой, `{}` | одинарные, `;` обязательна, `bracketSpacing: false`, `trailingComma: 'all'` | то же самое: одинарные ([G-TS-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md)), `;`, `bracketSpacing: false`, `trailingComma: "all"` |
| Стрелочные функции | `(x) => x * 2` - умолчание Prettier `arrowParens: "always"` | `x => x * 2` - gts ставит `arrowParens: "avoid"` |
| `var`, `const`/`let`, `namespace`, `public` | `no-var`, `prefer-const` ([Y-TS-002](../docs/languages/other.md)); `namespace` и модификатор `public` запрещены ([Y-TS-007](../docs/languages/other.md)) | то же: [G-TS-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md), [G-TS-006](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md); `public` не пишут по разделу Visibility TS-гайда |
| Экспорты | именованные предпочтительны, `export default` остаётся там, где его требует инструмент - SHOULD, реконструкция ([Y-REACT-004](../docs/frameworks/react.md)) | только именованные, `export default` запрещён - MUST; gts это не проверяет, профиль добавляет `no-restricted-syntax` ([G-TS-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md)) |
| Именование | `camelCase` и `PascalCase`, без ведущего `_` у типов; намеренно неиспользуемое начинается с `_` ([Y-TS-004](../docs/languages/other.md), [Y-TS-009](../docs/languages/other.md)) | те же регистры плюс `CONSTANT_CASE` для глобальных констант и значений enum; `_` запрещён и в начале, и в конце любого имени; префикс `I` у интерфейсов запрещён ([G-TS-008](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md), [G-TS-009](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md)) |
| `any`, `!`, `==` | `no-explicit-any`, `no-non-null-assertion`, `eqeqeq` - предупреждения, обязательны только при `--max-warnings=0` ([Y-TS-008](../docs/languages/other.md)) | `any` заменяют типом или `unknown` (раздел гайда, без правила профиля); `===` обязателен, единственное исключение - `== null` ([G-TS-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md)) |
| enum | в API компонентов - объединение строковых литералов, а не `enum` ([Y-REACT-003](../docs/frameworks/react.md)) | `enum` допустим, `const enum` запрещён; значения - `CONSTANT_CASE` ([G-TS-008](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md)) |
| `#private`, `@ts-ignore` | правил нет; ydb-js-sdk пишет приватные поля через `#` | `#поле` запрещено - пишут `private`; `@ts-ignore` и `@ts-expect-error` запрещены ([G-TS-009](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md), [G-TS-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md)) |
| Импорты | группы builtin → external → internal → parent → sibling → index, `import/order` ([Y-TS-006](../docs/languages/other.md)); `import type` отдельной инструкцией - SHOULD | правила порядка нет; внутри проекта - относительные пути (раздел Import paths TS-гайда) |
| Компилятор | `strict` плюс `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns` ([Y-TS-005](../docs/languages/other.md)) | `gts/tsconfig-google.json`: `strict: true`, `target: ES2022` |

Интерпретация: форматные решения двух компаний почти совпадают - одинарные кавычки, точки с запятой и `{a}` без пробелов у Яндекса прошли без изменений от JSCS-пресета `yandex` 2014 года до Gravity UI, а у Google те же три опции стоят в `.prettierrc.json` gts; текст mapsapi-codestyle при этом местами совпадает со старым Google JavaScript Style Guide для ES5 (список образцов именования, пример длинной строки), хотя источников не называет. Расходятся они в том, что Google записал в гайд как запреты (`export default`, `_`-имена, `#private`, `@ts-ignore`), а у Яндекса правилом считается то, что стоит в конфиге, - и в конфиге Gravity UI этих запретов нет.

### React: один компонент в двух стилях

Оба файла проходят `prettier --check` с `.prettierrc.json` своего профиля (Prettier 3.8.1); правила ESLint сверены по именам, сами плагины в среде сборки не устанавливались.

```tsx
// Яндекс: src/components/UserCard/UserCard.tsx
import * as React from 'react';

import {block} from '../utils/cn';

const b = block('user-card');

export interface UserCardProps {
    /** Display name of the user. */
    name: string;
    onSelect: (name: string) => void;
}

export function UserCard({name, onSelect}: UserCardProps) {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <section className={b({expanded})}>
            <button
                type="button"
                className={b('toggle')}
                onClick={() => setExpanded((value) => !value)}
            >
                {name}
            </button>
            {expanded && (
                <button type="button" className={b('select')} onClick={() => onSelect(name)}>
                    Select
                </button>
            )}
        </section>
    );
}
```

```tsx
// Google: src/user-card.tsx
import {useState} from 'react';

interface UserCardProps {
  name: string;
  onSelect: (name: string) => void;
}

export function UserCard({name, onSelect}: UserCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="user-card">
      <button
        type="button"
        className="user-card-toggle"
        onClick={() => setExpanded(value => !value)}
      >
        {name}
      </button>
      {expanded && (
        <button type="button" className="user-card-select" onClick={() => onSelect(name)}>
          Select
        </button>
      )}
    </section>
  );
}
```

Общее: функция, а не класс и не `React.FC` ([Y-REACT-001](../docs/frameworks/react.md); у Google правила нет, но примеры react.dev и профиля - функции), именованный экспорт, `interface` для пропсов ([Y-REACT-002](../docs/frameworks/react.md), [G-REACT-014](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/react.md)), хуки на верхнем уровне ([Y-REACT-008](../docs/frameworks/react.md), [G-REACT-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/react.md)), JSX-атрибуты в двойных кавычках ([Y-REACT-012](../docs/frameworks/react.md)). Различия: у Яндекса React импортируется как `import * as React` - так в uikit, page-constructor и components, и профиль закрепляет один стиль на репозиторий ([Y-REACT-005](../docs/frameworks/react.md)); у Google правила нет, и профиль импортирует `useState` поимённо. Файл у Яндекса называется как компонент и лежит в своей папке `UserCard/` вместе со стилями, тестами и i18n ([Y-REACT-014](../docs/frameworks/react.md)); у Google имя файла строчными буквами через дефис - это правило JS-гайда (замороженного), перенесённое на React, чтобы не расходиться с Angular. Главное различие - классы. У Яндекса они не пишутся руками: хелпер `block()` из `@bem-react/classname` собирает `user-card`, `user-card__toggle`, `user-card_expanded` ([Y-CSS-001](../docs/frameworks/react.md) … [Y-CSS-003](../docs/frameworks/react.md)); у Google классы - строки `user-card-toggle`, потому что HTML/CSS-гайд разрешает в имени класса только дефис и требует, чтобы имя отражало назначение, а не вид ([G-CSS-012](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md)). Интерпретация: БЭМ-схему с `__` и `_` в проекте по профилю Google применять нельзя, не нарушив G-CSS-012; обратный перенос проще - схема «только дефис» в проекте Яндекса ничему не противоречит, но лишает хелпер смысла.

### Стили: БЭМ против гайда HTML/CSS

У Яндекса стиль организован вокруг БЭМ, но от методологии в React-коде осталось немногое: схема имён `block-name__elem-name_mod-name_mod-val`, префикс проекта у блока (`g-` в uikit), один SCSS-файл на компонент с вложенностью, повторяющей БЭМ-дерево (`&__elem`, `&_mod`), и запрет «элемента элемента» ([Y-CSS-001](../docs/frameworks/react.md) … [Y-CSS-005](../docs/frameworks/react.md)). Уровни переопределения, i-bem.js, BEMHTML и файл на каждый элемент не используются; темы заданы CSS-переменными Gravity UI, и цвета берутся из семантических токенов `--g-color-*` ([Y-CSS-009](../docs/frameworks/react.md)). Линтера БЭМ-имён в конфигах Gravity UI нет - схему держит хелпер; Stylelint-конфиг Gravity UI проверяет остальное: запрет `!important`, вендорных префиксов и именованных цветов, порядок свойств по группам, лимит на id-селекторы ([Y-CSS-006](../docs/frameworks/react.md) … [Y-CSS-011](../docs/frameworks/react.md)). Из 35 правил React и CSS инструмент проверяет полностью 14.

У Google отправная точка - HTML/CSS-гайд: 2 пробела, всё в нижнем регистре, UTF-8 без BOM, `<!doctype html>`, двойные кавычки у атрибутов HTML и одинарные в CSS, никаких id-селекторов и уточнения класса типом (`.error`, а не `div.error`), сокращённые свойства, `0` без единицы и трёхсимвольный hex ([G-CSS-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) … [G-CSS-019](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md)). Методологии именования, кроме «назначение, не вид, разделитель - дефис», гайд не задаёт, и инструмента для него у Google нет: `.stylelintrc.json` профиля собран из встроенных правил Stylelint 17 и помечен «не Google». Что совпадает: запрет `!important` ([Y-CSS-006](../docs/frameworks/react.md), [G-CSS-016](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md)) и ограничение id-селекторов ([Y-CSS-010](../docs/frameworks/react.md), [G-CSS-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md)). Что противоположно: Stylelint Яндекса запрещает именованные цвета и требует порядок свойств по группам, Google советует алфавитный порядок, если нет автоматической сортировки; Яндекс пишет SCSS с интерполяцией `#{$block}`, Google о препроцессорах молчит.

### Angular: гайд Google в обоих профилях

Angular Style Guide - единственный фреймворковый гайд Google, и в 2025 году он переписан: 22 правила в четырёх разделах вместо нумерованных «Style 01-01 … A-02», без суффиксов `.component.ts` и `Component`, с `inject()` вместо параметров конструктора, `protected` для членов, нужных только шаблону, `readonly` для свойств, которые инициализирует Angular, и привязками `[class]`/`[style]` вместо `NgClass`/`NgStyle` ([G-NG-004](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), [G-NG-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md), [G-NG-022](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) … [G-NG-024](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md)). Гайд сам называет свои правила необязательными, поэтому в профиле Google почти все они SHOULD; инструменты при этом строже текста - пресет `angular-eslint` требует standalone, `OnPush` и встроенный control flow, которых в 22 правилах нет ([G-NG-029](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md) … [G-NG-031](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/angular.md)). Линтер - проект сообщества, не Google; из 32 правил он проверяет полностью 12. Профиль Яндекса берёт тот же гайд с пометкой «не Яндекс» и в 15 правилах ([Y-NG-001](../docs/frameworks/angular.md) … [Y-NG-015](../docs/frameworks/angular.md)), но оставляет форматирование Gravity UI: 4 пробела и `{a}` против 2 пробелов и `{ a }` в шаблоне Angular CLI - это решение профиля ради единообразия TypeScript в репозитории, а не практика Яндекса. Так же устроен React у Google: Rules of React и `eslint-plugin-react-hooks` 7.1.1 с правилами React Compiler, а поверх них TS-гайд Google там, где привычки экосистемы с ним расходятся, - именованные экспорты вместо `export default`, `interface` вместо `type`, имена файлов строчными буквами ([G-REACT-014](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/react.md)). Интерпретация: у каждой компании есть ровно один фреймворк с публичными правилами, и в обоих случаях правила «чужого» фреймворка в профиле - это чужой гайд плюс языковые привычки своей компании.

## Django и FastAPI

**Вывод.** Ни одна из компаний не публикует правил ни для Django, ни для FastAPI - в обоих случаях «публичных данных не найдено», и это проверено одинаково: поиском по клону google/styleguide (слов Django, Flask и FastAPI там нет) и по открытым организациям Яндекса (один активный Django-проект, django-ydb-backend, - бэкенд базы данных, а не образец приложения; для FastAPI - учебный пример деплоя из одного файла). Поэтому оба профиля устроены одинаково: общие Python-правила своей компании плюс правила самих фреймворков с пометкой «не Яндекс» или «не Google» - стиль кода Django, гайд HackSoft, документация FastAPI, проверки `DJ` и `FAST` в ruff, django-stubs.

Разница - в том, как общий Python-профиль сталкивается с привычками фреймворка. У Яндекса столкновений почти нет: Django-код живёт на 120 колонках и порядке импортов PEP 8, как весь остальной Python, тесты идут через раннер Django ([Y-DJ-001](../docs/frameworks/django.md)), миграции сохраняют имена Django ([Y-DJ-002](../docs/frameworks/django.md)), а единственный настоящий конфликт - `B008` против `db: Session = Depends(get_db)` - решён переводом зависимостей на `Annotated` ([Y-FAPI-005](../docs/frameworks/fastapi.md), [Y-FAPI-014](../docs/frameworks/fastapi.md)). У Google столкновений четыре, и все из-за правил импорта: `from django.shortcuts import render` и `from fastapi import Depends, FastAPI` из учебников нарушают «только модули» ([G-PY-017](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)), `from .models import Question` - запрет относительных импортов ([G-PY-018](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/python.md)), шесть групп импортов Django - сортировку Google, 88 колонок Django - 80 колонок Google. Профиль Google везде берёт вариант Google ([G-DJ-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/django.md), [G-FAPI-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/fastapi.md)) и предупреждает, что команда может записать исключение для имён фреймворка в CONTRIBUTING, но это будет отступление от гайда, а не его толкование. Сами фреймворковые правила в двух профилях совпадают почти дословно - `request` первым параметром, порядок членов модели, `__str__` у каждой модели, `Annotated` в зависимостях, `lifespan` вместо `@app.on_event`, `TestClient` в тестах ([Y-DJ-004](../docs/frameworks/django.md) … [Y-DJ-015](../docs/frameworks/django.md), [G-DJ-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/django.md) … [G-DJ-015](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/django.md); [Y-FAPI-001](../docs/frameworks/fastapi.md) … [Y-FAPI-014](../docs/frameworks/fastapi.md), [G-FAPI-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/fastapi.md) … [G-FAPI-013](https://github.com/k1sur1n/google-codestyle/blob/main/docs/frameworks/fastapi.md)), потому что взяты из одних и тех же чужих источников. Интерпретация: для Django и FastAPI выбор профиля сводится к выбору Python-профиля; содержательной разницы во фреймворковых правилах нет.

## Дополнительные языки

**Вывод.** У Google есть публичные гайды для Java, Kotlin (на developer.android.com), Go и C#, официальный RuboCop-конфиг для Ruby и ни одного публичного документа для Rust, PHP, Scala и Elixir. У Яндекса общего публичного гайда нет ни для одного языка: есть абзацы документации yatool о линтерах Аркадии (checkstyle, ktlint, `gofmt`, `govet`, `yolint`) без самих конфигов и конфиги отдельных открытых проектов - почти все из SDK YDB. Поэтому правила Google - пересказ гайдов, а правила Яндекса - значения реальных конфигов на зафиксированных коммитах, и уверенность в них как в «стиле компании» ниже. Состав языков в обоих профилях один и тот же и определён по опросам 2025-2026 годов: TypeScript/JavaScript, Java, C#, Go, Rust, Kotlin - полностью; PHP и Ruby - кратко (долгосрочный спад по данным JetBrains); Scala и Elixir исключены (меньше 5 % в Stack Overflow 2026 и ни одного верхнего списка). TypeScript разобран в разделе [«Фронтенд»](#фронтенд).

| Язык | Яндекс | Google | Главное отличие |
|---|---|---|---|
| Java | checkstyle-конфиг ydb-java-sdk: 120 колонок, форматтер IntelliJ IDEA через `.editorconfig`, группы импортов `java`, `javax`, сторонние, `yandex`, `ru.yandex`, свои, статические - в конце ([Y-JAVA-001](../docs/languages/other.md) … [Y-JAVA-008](../docs/languages/other.md)) | Google Java Style (правки 2026-09-09): 2 пробела, 100 колонок, google-java-format без настроек, Error Prone; статические импорты первой группой ([G-JAVA-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md) … [G-JAVA-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md)) | ширина 120 против 100 и ненастраиваемый форматтер против форматтера IDE; скобки K&R у обоих |
| Kotlin | стиль IDE `KOTLIN_OFFICIAL` в Yatagan, detekt с порогами сложности в DivKit, `explicitApi()` и дамп API для библиотек; ktlint назван документацией yatool, но ни один из двух открытых проектов его не подключает ([Y-KT-001](../docs/languages/other.md) … [Y-KT-007](../docs/languages/other.md)) | Android Kotlin style guide (2026-09-22): 4 пробела, 100 колонок, импорты одним списком ASCII, KDoc у публичного API; инструментов гайд не называет, ktfmt - не Google ([G-KT-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md) … [G-KT-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md)) | по оформлению обе стороны сходятся на 4 пробелах и официальных соглашениях Kotlin; у Google есть текст, у Яндекса - два проекта с разными инструментами |
| Go | golangci-lint v2 с «все линтеры минус список из 40», gofumpt и gci, правила revive, реализация в `internal/`, тесты с `-race`, английский в комментариях ([Y-GO-001](../docs/languages/other.md) … [Y-GO-010](../docs/languages/other.md)) | Go Style в трёх частях (2026-03-18): из инструментов назван только `gofmt`; без лимита длины строки; без assert-библиотек в тестах; `MixedCaps` даже для констант ([G-GO-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md) … [G-GO-010](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md)) | Google пишет про идиомы и ничего про линтеры; Яндекс - максимальный набор линтеров и короткие письменные правила в `.agents/rules/` |
| C# | ReSharper `cleanupcode` и InspectCode в ydb-dotnet-sdk: скобка на новой строке, 4 пробела, `<Nullable>enable</Nullable>`, `ConfigureAwait(false)` в библиотеке ([Y-CS-001](../docs/languages/other.md) … [Y-CS-007](../docs/languages/other.md)) | гайд 2020 года: 2 пробела, 100 колонок, скобка на той же строке, `_camelCase` для приватных полей; ни форматтера, ни конфига Google нет ([G-CS-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md) … [G-CS-009](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md)) | Google отступает от умолчаний .NET (скобки, отступ - взяты из Java-гайда Google), Яндекс им следует |
| Rust | ydb-rs-sdk: rustfmt по умолчанию, clippy с `-D warnings`, `unsafe_code = "forbid"`, без `unwrap`/`expect`/`panic!` в рабочем коде, MSRV 1.88 в CI ([Y-RS-001](../docs/languages/other.md) … [Y-RS-010](../docs/languages/other.md)) | публичного гайда нет: Chromium сообщает о неопубликованном внутреннем «Google Rust Style Guide»; профиль - Rust Style Guide и API Guidelines сообщества, «не Google» ([G-RS-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md) … [G-RS-007](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md)) | единственный язык, где у Яндекса есть письменные проектные правила, а у Google публично нет ничего |
| PHP, Ruby | PHP: только проверка синтаксиса `phplint` в ydb-php-sdk, стиль - PER Coding Style «не Яндекс» ([Y-PHP-001](../docs/languages/other.md) … [Y-PHP-005](../docs/languages/other.md)); Ruby: публичных данных не найдено ([Y-RB-001](../docs/languages/other.md) … [Y-RB-005](../docs/languages/other.md), все «не Яндекс») | PHP: практика одного репозитория google-cloud-php (PSR-2), профиль - PER-CS «не Google» ([G-PHP-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md) … [G-PHP-005](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md)); Ruby: официальный gem `google-style` 1.32.0 - 120 колонок, двойные кавычки, `def` без скобок ([G-RB-001](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md) … [G-RB-006](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md)) | Ruby - единственный случай «машинный конфиг без прозаического гайда» у Google; у Яндекса Ruby нет вовсе |

**Java.** Конфиг YDB построен на стандартных проверках Checkstyle и умолчаниях IntelliJ IDEA; лимит в 120 символов сопровождает ссылка на внутренний ресурс, а два запрета объяснены удобством поиска по монорепозиторию - по этим признакам профиль Яндекса считает конфиг внутренним по происхождению (интерпретация). Гайд Google - самая благополучная у него пара «гайд плюс инструмент»: правки 2026 года (запрет module imports, Markdown-Javadoc) и google-java-format 1.37.0, вывод которого гайд называет образцом переноса строк.

**Kotlin.** Инструмент, который принято считать «гугловским», ktfmt, создан в Meta и летом 2026 года перешёл в организацию Kotlin; его `--google-style` даёт «Google internal style» с 2 пробелами, что публичному гайду с 4 пробелами не соответствует - та же история, что с отступом в Python. У Яндекса уверенность в правилах Kotlin низкая: два Android-проекта с разными инструментами.

**Go.** Go Style - единственный гайд Google, построенный как три документа («Guide, Decisions, Best Practices»), и единственный из разобранных здесь без лимита длины строки: формат отдан `gofmt` ([G-GO-002](https://github.com/k1sur1n/google-codestyle/blob/main/docs/languages/other.md)). ydb-go-sdk идёт противоположным путём - включает все линтеры golangci-lint и выключает 40 поимённо ([Y-GO-004](../docs/languages/other.md)), так что `lll` с лимитом 120 там работает; базовые `gofmt` и `go vet` подтверждает и документация yatool.

**C#.** Гайд Google прямо называет свои источники - именование от Microsoft, пробелы от Java-гайда Google, переносы от C++-гайда Google - и потому расходится с умолчаниями .NET по скобкам и отступу; машинного «Google C#» не существует, кроме ветки пресета `Google` в clang-format. Яндекс в ydb-dotnet-sdk берёт форматтер ReSharper, совпадающий с соглашениями .NET, а проверку именования в CI отключает.

**Rust.** Содержательные правила Яндекса - запрет `unwrap` в рабочем коде, приватность по умолчанию, запрет утечки типов `prost` и `tonic` в публичный API - записаны только в `coding-standards.md` и линтером не проверяются ([Y-RS-004](../docs/languages/other.md) … [Y-RS-006](../docs/languages/other.md)). У Google профиль опирается на Rust Style Guide сообщества, как это делают Chromium и Fuchsia.

**PHP и Ruby.** Для PHP обе компании дают только практику одного репозитория, и оба профиля берут PER Coding Style; для Ruby у Google есть `google-style` с нестандартными решениями (120 колонок против 80 в Ruby Style Guide, `def call request, options = {}` без скобок), а у Яндекса публичных данных не найдено.

## Доля автоматизируемых правил

Числа ниже - доли в правилах двух профилей - yandex-codestyle и google-codestyle, а не измерение практики компаний: внутренние проверки обеих компаний публично недоступны, а состав правил выбран авторами профилей. Подсчёт сделан по строкам «Проверка» в документах профилей: «инструмент целиком» - строка называет инструмент без оговорок, «частично» - начинается со слова «частично», «только ревью» - содержит лишь «ручное ревью». Проценты округлены, поэтому в строке могут давать 101.

| Область | Профиль | Правил | Инструмент целиком | Частично | Только ревью |
|---|---|---|---|---|---|
| Python | Яндекс | 47 | 23 (49 %) | 4 (9 %) | 20 (43 %) |
| Python | Google | 65 | 19 (29 %) | 22 (34 %) | 24 (37 %) |
| C++ | Яндекс | 68 | 23 (34 %) | 7 (10 %) | 38 (56 %) |
| C++ | Google | 73 | 19 (26 %) | 34 (47 %) | 20 (27 %) |

Коротко о том, что за этим стоит: в Python профиль Яндекса автоматизирован сильнее, потому что почти целиком состоит из опций конфигов, а у Google много правил о выборе конструкций языка, которые инструмент не ловит; в C++ у Google больше «частично» (clang-tidy, флаги компилятора и cpplint закрывают по куску многих правил), а у Яндекса больше «только ревью» (владение, ошибки, порядок include, тесты - без инструмента). Сравнение подходов к контролю соблюдения - readability у Google против ревью и `ya style` у Яндекса - в [approach.md](approach.md); матрицы по правилам - в `docs/enforcement.md` каждого профиля ([Яндекс](../docs/enforcement.md), [Google](https://github.com/k1sur1n/google-codestyle/blob/main/docs/enforcement.md)).

Соседние документы: парные примеры «один код - два стиля» - [examples.md](examples.md); что взять у каждой команды для своего стека - [choosing.md](choosing.md); термины - [glossary.md](glossary.md); навигация по сравнению - [README.md](README.md).
