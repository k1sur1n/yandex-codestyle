# Дополнительные языки - профиль Яндекса

> Данные актуальны на 2026-10-09.

Ни для одного из десяти языков-кандидатов у Яндекса нет общего публичного стайлгайда. Есть общие конфиги Gravity UI для TypeScript и JavaScript, конфиги отдельных открытых проектов (в основном SDK YDB) для Go, Java, C#, Rust и PHP, настройки IDE и detekt в Android-библиотеках на Kotlin и несколько строк о линтерах `ya make` в документации yatool. Для Ruby, Scala и Elixir публичных данных не найдено. По опросам 2025-2026 годов в профиль включены TypeScript/JavaScript, Java, C#, Go, Rust и Kotlin, кратко - PHP и Ruby; Scala и Elixir исключены. Правила ниже, кроме помеченных «не Яндекс», - это значения реальных конфигов и проектных правил на зафиксированных коммитах; как «стиль Яндекса» в целом они остаются реконструкцией.

Связанные документы профиля: [python.md](python.md) · [cpp.md](cpp.md) · [React](../frameworks/react.md) · [матрица проверок](../enforcement.md) · конфиги для TS/JS - [configs/web/](../../configs/web/). Подробности о выборке и источниках - в [research/yandex.md](../../research/yandex.md).

## 1. Какие языки включены и почему

Состав определён по трём источникам, названным в постановке задачи:

- Stack Overflow Developer Survey - издания [2025](https://survey.stackoverflow.co/2025/technology) и [2026](https://survey.stackoverflow.co/2026/technology/data). Издание 2026 [вышло 2026-10-06](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/); база вопроса о языках - 14 099 ответов против 31 771 в 2025 году, поэтому сдвиги меньше одного процентного пункта трендом считать нельзя.
- [JetBrains State of Developer Ecosystem 2025](https://blog.jetbrains.com/research/2025/10/state-of-developer-ecosystem-2025/) - 24 534 разработчика, опрос апреля-июня 2025 года. Издание 2026 на 2026-10-09 не опубликовано; из данных 2026 года доступна только заметка о [миграции между языками](https://blog.jetbrains.com/research/2026/08/programming-language-migration/).
- [GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/) - опубликован 2025-10-28, данные за сентябрь 2024 - август 2025. Издание 2026 на 2026-10-09 не опубликовано.

| Язык | Stack Overflow, 2025 → 2026, % всех респондентов | JetBrains 2025 | Octoverse 2025 | Решение | Что есть у Яндекса публично |
|---|---|---|---|---|---|
| TypeScript / JavaScript (Node.js) | TS 43,6 → 43,8; JS 66,0 → 62,0 | TS - первое место в Language Promise Index и самый резкий рост использования за пять лет; JS - «плато зрелости» | TS - № 1 (2 636 006 контрибьюторов в месяц, +66,63 % за год); JS - № 3 (2,15 млн, +24,79 %) | **включить** | общие конфиги Gravity UI (активны); гайд команды Карт (архив) |
| Java | 29,4 → 27,6 | основной язык для 33 % (по стороннему пересказу отчёта) | № 4, +20,73 % | **включить** | checkstyle-конфиг SDK YDB; абзац в документации yatool |
| C# | 27,8 → 27,1 | основной язык для 12 % (по стороннему пересказу) | № 5, +22,22 % | **включить** | линт-джоб одного SDK |
| Go | 16,4 → 16,5 | первое место в списке «хотят освоить» (11 %), четвёртое в Promise Index; единственный из «перспективных» с фактическим ростом по данным о миграции | в топ-10, место не названо | **включить** | конфиги golangci-lint трёх проектов, правила ydb-go-sdk; абзацы в документации yatool |
| Rust | 14,8 → 18,0 (+3,2 п. п.); первое место по Admired оба года (72,4 и 67,4) | второе место в Promise Index; «хотят освоить» 10 % | в топ-10 не входит | **включить** | CI и правила одного SDK |
| Kotlin | 10,8 → 10,8 | медленный устойчивый рост; «хотят освоить» 6 %; переход Java → Kotlin - третий по объёму | в топ-10 не входит | **включить** | стиль IDE в Yatagan, detekt в DivKit; абзац в документации yatool |
| PHP | 18,9 → 17,7 | долгосрочный спад, «плато зрелости» | в топ-10, место не названо | **включить кратко** | синтаксическая проверка в одном SDK |
| Ruby | 6,4 → 5,8 | долгосрочный спад | в топ-10 не входит | **включить кратко** (пограничный случай) | публичных данных не найдено |
| Scala | 2,6 → 2,2 | основной язык для 2 %; при этом первое место среди самых высокооплачиваемых (38 %) | не упомянут | **исключить** | код есть (SPYT), конфигов стиля нет |
| Elixir | 2,7 → 2,6; Admired 65,9 и 62,1 | в верхние списки не входит (по стороннему пересказу) | не упомянут | **исключить** | публичных данных не найдено |

Источники чисел: Stack Overflow - [2025](https://survey.stackoverflow.co/2025/technology), [2026](https://survey.stackoverflow.co/2026/technology/data); JetBrains - [пост об отчёте 2025](https://blog.jetbrains.com/research/2025/10/state-of-developer-ecosystem-2025/), [раздел о трендах](https://devecosystem-2025.jetbrains.com/tools-and-trends), [Go Language Trends 2025](https://blog.jetbrains.com/go/2025/11/10/go-language-trends-ecosystem-2025/), [заметка о миграции](https://blog.jetbrains.com/research/2026/08/programming-language-migration/); доли «основного языка» - сторонний пересказ графиков отчёта ([Blog du Modérateur, 2025-10-27](https://www.blogdumoderateur.com/etude-langages-utilises-developpeurs-2025/), уверенность средняя); Octoverse - [отчёт 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/).

Интерпретация: критерий отбора сформулирован авторами профиля, в источниках его нет. «Включить» - не меньше 10 % в Stack Overflow 2025 или 2026, либо топ-5 Octoverse, либо первые четыре места в Promise Index или первые пять в списке «хотят освоить» у JetBrains. «Включить кратко» - от 5 до 20 % в Stack Overflow при зафиксированном JetBrains долгосрочном спаде. «Исключить» - меньше 5 % в Stack Overflow и отсутствие в верхних списках всех трёх источников. Swift, Zig и Dart, заметные в тех же опросах, не добавлены: это не бэкенд-языки, данных о серверном использовании в трёх источниках нет.

Scala и Elixir описаны одной строкой каждый в [разделе 12](#12-исключённые-языки-scala-и-elixir).

## 2. Сводная таблица

| Язык | Публичные правила Яндекса | Форматтер | Линтер | Конфиги (пакеты и версии) | Основной источник |
|---|---|---|---|---|---|
| TypeScript / JavaScript (Node.js) | Общего гайда нет. Общие конфиги Gravity UI - активны; гайд mapsapi-codestyle - архив с 2023-08-03 | Prettier 3.x с `@gravity-ui/prettier-config` 1.1.1 | ESLint 9.x с `@gravity-ui/eslint-config` 4.3.2 (для Node.js - точка входа `/server`); `tsc --noEmit` | `@gravity-ui/tsconfig` 1.0.0; файлы профиля в [configs/web/](../../configs/web/) | [gravity-ui/eslint-config](https://github.com/gravity-ui/eslint-config/tree/v4.3.2) |
| Java | Общего гайда нет. Документация yatool называет checkstyle и `ya jstyle`; сами конфиги Аркадии не опубликованы | форматтер IntelliJ IDEA (`.editorconfig` с ключами `ij_java_*`; в Аркадии - `ya jstyle`) | Checkstyle через `maven-checkstyle-plugin` 3.6.0 | `config/ydb.checkstyle.xml`, `.editorconfig` | [ydb-java-sdk](https://github.com/ydb-platform/ydb-java-sdk/blob/464e52508487e2380401a7994d85766d98114c39/config/ydb.checkstyle.xml) |
| Kotlin | Общего гайда нет. Документация yatool: ktlint запускается автоматически; его конфиг не опубликован | стиль IDE `KOTLIN_OFFICIAL` (Yatagan) | ktlint (Аркадия, версия не раскрыта); detekt 2.0.0-alpha.6 (DivKit) | `.idea/codeStyles/Project.xml`; `detekt.yml`; binary-compatibility-validator 0.13.2 | [yatagan](https://github.com/yandex/yatagan/blob/5b733611354ef50f4847c3853d113463ab38bed8/.idea/codeStyles/Project.xml), [divkit](https://github.com/divkit/divkit/blob/7079d294b9b6fc82db0272753ee689fb691a5f1b/client/android/config/detekt/detekt.yml) |
| Go | Общего гайда нет. Документация yatool: `gofmt`, `govet`, `yoimports`, `yolint`; есть проектные правила ydb-go-sdk | gofmt, gofumpt, gci, goimports (запускает golangci-lint) | golangci-lint v2.13.1, конфиг формата `version: "2"` | `.golangci.yml` | [ydb-go-sdk](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.golangci.yml) |
| C# | Публичных правил нет; есть только линт-джоб одного проекта | `jb cleanupcode` (JetBrains.ReSharper.GlobalTools 2025.3.2) | ReSharper InspectCode 2025.3.2; анализатор .NET CA2007 | `*.sln.DotSettings`, `.editorconfig` | [ydb-dotnet-sdk](https://github.com/ydb-platform/ydb-dotnet-sdk/blob/1add2779f2595e09f93afbe6c14215102ba3967c/.github/workflows/lint.yml) |
| Rust | Общего гайда нет; есть проектные правила ydb-rs-sdk | rustfmt с настройками по умолчанию; taplo 0.10.0 для TOML | clippy с `-D warnings` (Rust 1.96); typos v1.48.0 | `Cargo.toml`: `edition = "2024"`, `rust-version = "1.88"`, `[workspace.lints]` | [ydb-rs-sdk](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/.github/workflows/linter.yaml) |
| PHP | Публичных правил нет | нет (только `.editorconfig`) | `overtrue/phplint` ^3.0 - проверка синтаксиса | `composer.json`, `.editorconfig`; альтернатива «не Яндекс» - PER Coding Style 3.1 | [ydb-php-sdk](https://github.com/ydb-platform/ydb-php-sdk/blob/95214dffb63b5a5d78c61957f4176478860bcdd7/composer.json) |
| Ruby | публичных данных не найдено | «не Яндекс»: RuboCop | «не Яндекс»: RuboCop 1.91 | - | [Ruby Style Guide](https://rubystyle.guide/) (не Яндекс) |

## 3. Как читать правила

- **Уровень.** `MUST` - правило проверяет форматтер или CI проекта-источника либо источник формулирует его как обязательное. `SHOULD` - рекомендация источника, предупреждение линтера или практика, выведенная из кода.
- **Уверенность** в строке «Источник» отвечает на вопрос «насколько это правило отражает практику Яндекса шире одного проекта». Сами значения опций проверены по файлам на указанных коммитах, и в этом смысле достоверны все.
- **Правила из `AGENTS.md` и `.agents/rules/`.** С 2025 года SDK YDB держат в репозитории короткие правила для ИИ-агентов и разработчиков. Это единственное место, где команды формулируют требования словами; тип источника - «производный гайд проекта».
- **«не Яндекс»** - правило взято из общепринятого гайда сообщества, потому что у Яндекса публичного правила нет. **«реконструкция»** - правило сформулировано авторами профиля по наблюдениям, в источнике оно нормой не названо. **«архив»** - источник заархивирован и не обновляется.

## 4. TypeScript и JavaScript (Node.js)

**Публичные правила.** Единого прозаического гайда нет. Действующий общий стандарт - npm-пакеты Gravity UI (выросли из Yandex Cloud): [`@gravity-ui/eslint-config`](https://github.com/gravity-ui/eslint-config/tree/v4.3.2) 4.3.2 (2026-06-30; ESLint 9, только flat config и только ESM), [`@gravity-ui/prettier-config`](https://github.com/gravity-ui/prettier-config/blob/v1.1.1/index.js) 1.1.1 (2026-04-08; опции не менялись с 2021-11-12) и [`@gravity-ui/tsconfig`](https://github.com/gravity-ui/tsconfig/blob/v1.0.0/tsconfig.json) 1.0.0 (2022-08-24; **не обновляется**). Прозаический гайд команды API Карт [yandex/mapsapi-codestyle](https://github.com/yandex/mapsapi-codestyle) - **архив с 2023-08-03**, текст заморожен в 2018-2019 годах; в профиле он остаётся только историческим источником для того, что инструмент не выражает.

**Что используют открытые репозитории (реконструкция).** `@gravity-ui/eslint-config` и `@gravity-ui/prettier-config` расширяют 15 из 16 изученных публичных JS/TS-репозиториев Яндекса; на актуальный мажор конфига (v4, ESLint 9) перешли 5 из 15. Серверную точку входа `/server` подключают 3 из 16: nodekit, app-builder, i18n. Серверные проекты при этом настроены по-разному:

| Проект (дата коммита) | Линтер, форматтер, версии | Чем отличается от Gravity UI |
|---|---|---|
| [gravity-ui/nodekit](https://github.com/gravity-ui/nodekit/blob/b88cc97ef584818a159a2eab7b6133257ecae10f/eslint.config.mjs) (2026-09-17) | ESLint ^9.39.4 с `@gravity-ui/eslint-config` ^4.3.1 (`.`, `/server`, `/prettier`); Prettier с `@gravity-ui/prettier-config` ^1.1.0; `@gravity-ui/tsconfig` ^1.0.0; TypeScript ^6.0.3; Jest ^30.4.2; Node.js ≥ 20 | образец для серверного кода в этом профиле; единственное отступление - `no-param-reassign` с `props: false` |
| [ydb-platform/ydb-js-sdk](https://github.com/ydb-platform/ydb-js-sdk/blob/abc8955bfc494c220490b04414dff77e572d4c86/AGENTS.md) (2026-10-08) | [oxlint](https://github.com/ydb-platform/ydb-js-sdk/blob/abc8955bfc494c220490b04414dff77e572d4c86/.oxlintrc.json) ^1.66.0 и [oxfmt](https://github.com/ydb-platform/ydb-js-sdk/blob/abc8955bfc494c220490b04414dff77e572d4c86/.oxfmtrc.json) ^0.52.0; TypeScript ^6.0.3; Vitest; Node.js `^22.15.0 \|\| >=23.8.0` | табы шириной 4, без точек с запятой, `trailingComma: "es5"`, пробелы внутри `{}`; «всегда `let`, никогда `const`»; приватные поля через `#`; в тестах только `test()` без вложенных `describe` |
| [yandex-cloud/nodejs-sdk](https://github.com/yandex-cloud/nodejs-sdk/blob/e6538f4e7d5dd16406f803a9793fa43f8602be06/.eslintrc.json) (2026-05-07) | ESLint ^8.57.1 с `airbnb-base`, `airbnb-typescript/base`, `plugin:unicorn/recommended`, `plugin:@typescript-eslint/recommended`; Prettier ^3.8.3; TypeScript ^4.9.5 | `max-len` 140 при `printWidth: 100`; `bracketSpacing: true`; обязательные стрелочные функции (`prefer-arrow-functions`), пустая строка перед `return` |

Профиль берёт вариант Gravity UI: он общий для 15 из 16 репозиториев, а правила двух SDK проектные и противоречат друг другу. Расхождения разобраны в [research/yandex.md](../../research/yandex.md), раздел E.

**Версии.** ESLint 9.x, не 10: зависимости конфига объявляют совместимость только до `^9`; при этом поддержка ESLint 9 закончилась 2026-08-06 ([eslint.org/version-support](https://eslint.org/version-support/)), и профиль наследует этот риск от источника - см. [react.md](../frameworks/react.md), раздел 5. Prettier 3.x, TypeScript в диапазоне `>=4.8.4 <6.1.0`, Node.js ≥ 20.

**Конфиги профиля.** [eslint.config.js](../../configs/web/eslint.config.js), [.prettierrc.json](../../configs/web/.prettierrc.json), [.stylelintrc.json](../../configs/web/.stylelintrc.json) (CSS и SCSS). Для серверного кода замените в `eslint.config.js` точки входа `/client` и `/a11y` на `@gravity-ui/eslint-config/server`, как сделано в nodekit. Правила React и CSS - в [react.md](../frameworks/react.md).

### Y-TS-001 · MUST · Код форматирует Prettier с опциями Gravity UI: отступ 4 пробела, ширина строки 100, одинарные кавычки, точка с запятой, висячая запятая, без пробелов внутри `{}`
- Проверка: Prettier `tabWidth: 4`, `printWidth: 100`, `singleQuote: true`, `trailingComma: 'all'`, `bracketSpacing: false`; для `*.md`, `*.json`, `*.yaml`, `*.yml` - `tabWidth: 2`; умолчания Prettier 3 `semi: true`, `arrowParens: "always"`, `jsxSingleQuote: false`, `endOfLine: "lf"`. Отдельное правило `max-len` не включается: длину ведёт форматтер.
- Источник: [@gravity-ui/prettier-config, index.js#L2-L22](https://github.com/gravity-ui/prettier-config/blob/v1.1.1/index.js#L2-L22) (1.1.1, 2026-04-08) · конфиг или инструмент · высокая; [умолчания Prettier](https://github.com/prettier/prettier/blob/main/docs/options.md).
- Пример:

```ts
// плохо
import { readFile } from "node:fs/promises"
const double = x => x * 2

// хорошо
import {readFile} from 'node:fs/promises';
const double = (x) => x * 2;
```

### Y-TS-002 · MUST · `var` запрещён; по умолчанию `const`, `let` - только при переприсваивании
- Проверка: ESLint `no-var`, `prefer-const`.
- Источник: [@gravity-ui/eslint-config, base.js#L123-L125](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/base.js#L123-L125) (4.3.2, 2026-06-30) · конфиг или инструмент · высокая.

### Y-TS-003 · MUST · Тело `if`, `else`, `for`, `while` всегда в фигурных скобках
- Проверка: ESLint `curly`. В общем конфиге правило задано как error, но точка входа `/prettier` его выключает (так работает `eslint-config-prettier`), поэтому в конфиге профиля оно возвращено явно: `curly: ['error', 'all']`.
- Источник: [base.js#L47](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/base.js#L47) (4.3.2); [issue #44](https://github.com/gravity-ui/eslint-config/issues/44) (открыт 2025-10-24); [ydb-embedded-ui, eslint.config.mjs](https://github.com/ydb-platform/ydb-embedded-ui/blob/a2659a05cf93c6cf863294e7f534e74371736abd/eslint.config.mjs) (2026-10-08) · конфиг или инструмент · средняя.

### Y-TS-004 · MUST · Идентификаторы - в `camelCase`; типы, интерфейсы, классы и enum - в `PascalCase` без ведущего `_`; конструкторы вызываются с заглавной буквы
- Проверка: частично: ESLint `camelcase` (`properties: 'never'`), `new-cap`, `@typescript-eslint/naming-convention` (селектор `typeLike`, `format: ['PascalCase']`, `leadingUnderscore: 'forbid'`); константы-значения в `UPPER_SNAKE_CASE` и аббревиатуры как слова (`Json`, а не `JSON`) - ручное ревью.
- Источник: [base.js#L101-L104](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/base.js#L101-L104), [typescript.js#L63-L70](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/typescript.js#L63-L70) (4.3.2) · конфиг или инструмент · высокая; для констант и аббревиатур - [mapsapi-codestyle, Naming](https://github.com/yandex/mapsapi-codestyle/blob/d549f85deb7ed7d90e3b302478fc50dd950447e0/javascript.md#naming) (текст 2018 года) · официальный гайд · средняя · архив.

### Y-TS-005 · MUST · TypeScript компилируется в строгом режиме: `strict`, `noImplicitReturns`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noEmitOnError`
- Проверка: `tsc --noEmit` отдельным шагом CI. Из базового `@gravity-ui/tsconfig` стоит брать только флаги строгости: `target`, `module` и `moduleResolution` в нём устарели, и живые проекты их переопределяют (nodekit - `es2022` и `nodenext`).
- Источник: [@gravity-ui/tsconfig, tsconfig.json](https://github.com/gravity-ui/tsconfig/blob/v1.0.0/tsconfig.json) (1.0.0, 2022-08-24, не обновляется) · конфиг или инструмент · высокая; [uikit, ci.yml#L24-L25](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/.github/workflows/ci.yml#L24-L25) (2026-10-07).

### Y-TS-006 · MUST · Импорты идут группами builtin → external → internal → parent → sibling → index, внутри группы - по алфавиту, между группами - пустая строка; повторные импорты одного модуля запрещены
- Проверка: ESLint `import/order` (точка входа `@gravity-ui/eslint-config/import-order`), `sort-imports` (`ignoreDeclarationSort: true`), `import/no-duplicates`. Импорт типов отдельной инструкцией `import type {…}` в общий конфиг не входит: это проектная надстройка (`@typescript-eslint/consistent-type-imports`; её включают 6 из 16 репозиториев выборки), в [конфиге профиля](../../configs/web/eslint.config.js) она включена как рекомендация уровня SHOULD.
- Источник: [import-order.js#L10-L48](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/import-order.js#L10-L48), [base.js#L114-L132](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/base.js#L114-L132) (4.3.2) · конфиг или инструмент · высокая. Точка входа `/import-order` подключается отдельно; она включена в 8 из 15 репозиториев выборки.

### Y-TS-007 · MUST · В классах модификатор `public` не пишется, члены идут в порядке «статические поля, статические методы, поля, конструктор, методы»; тип приводится только через `as`; `namespace` не используется
- Проверка: `@typescript-eslint/explicit-member-accessibility` (`accessibility: 'no-public'`), `@typescript-eslint/member-ordering`, `@typescript-eslint/consistent-type-assertions`, `@typescript-eslint/no-namespace`.
- Источник: [typescript.js#L71-L102](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/typescript.js#L71-L102) (4.3.2) · конфиг или инструмент · высокая.

### Y-TS-008 · SHOULD · Без `any` и без non-null-утверждения `!`; сравнение - через `===`; приведение типов явное; бросать только `Error` и его наследников
- Проверка: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-non-null-assertion`, `eqeqeq`, `no-implicit-coercion`, `no-throw-literal`. В конфиге это предупреждения, отсюда уровень SHOULD; при запуске `eslint --max-warnings=0` в CI (так делает [page-constructor](https://github.com/gravity-ui/page-constructor/blob/df7f4c1198e2d74b06381db7ae0549984f1ddabc/package.json)) правило становится обязательным.
- Источник: [typescript.js#L100-L103](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/typescript.js#L100-L103), [base.js#L49-L77](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/base.js#L49-L77) (4.3.2) · конфиг или инструмент · высокая.

### Y-TS-009 · MUST · Неиспользуемые переменные запрещены, намеренно неиспользуемые начинаются с `_`; `console.log` и `console.debug` в коммит не попадают
- Проверка: `@typescript-eslint/no-unused-vars` (`argsIgnorePattern`, `varsIgnorePattern`, `caughtErrorsIgnorePattern` - все `'^_'`); `no-console` с `allow: ['info', 'warn', 'error']`.
- Источник: [typescript.js#L52-L59](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/typescript.js#L52-L59), [base.js#L52](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/base.js#L52) (4.3.2) · конфиг или инструмент · высокая.
- Пример:

```ts
// плохо
items.forEach((item, index) => send(item));

// хорошо
items.forEach((item, _index) => send(item));
```

### Y-TS-010 · MUST · Серверный код на Node.js линтуется с точкой входа `@gravity-ui/eslint-config/server`
- Проверка: глобальные имена Node.js и 11 правил `eslint-plugin-security` уровня error, среди них `security/detect-child-process`, `security/detect-eval-with-expression`, `security/detect-non-literal-regexp`, `security/detect-non-literal-require`, `security/detect-unsafe-regex`, `security/detect-possible-timing-attacks`; `global-require` - предупреждение.
- Источник: [server.js#L17-L30](https://github.com/gravity-ui/eslint-config/blob/v4.3.2/server.js#L17-L30) (4.3.2) · конфиг или инструмент · средняя; [nodekit, eslint.config.mjs](https://github.com/gravity-ui/nodekit/blob/b88cc97ef584818a159a2eab7b6133257ecae10f/eslint.config.mjs) (2026-09-17) · практика, выведенная из репозиториев (3 из 16) · реконструкция.

**Остаётся на ручном ревью.** Инструмент не выражает несколько соглашений, которые видны в коде Gravity UI и в архивном гайде Карт: наборы вариантов в API - объединения строковых литералов, а не enum ([uikit, Label.tsx](https://github.com/gravity-ui/uikit/blob/a2f7a1db051b617ca1798fddeb8fcdd44a636840/src/components/Label/Label.tsx#L54-L58)); объектные типы - через `interface`, массивы - `T[]` ([mapsapi-codestyle, typescript.md](https://github.com/yandex/mapsapi-codestyle/blob/d549f85deb7ed7d90e3b302478fc50dd950447e0/typescript.md), архив); проверка на `undefined` - `x === undefined`, без лишних `async` и `return await` ([mapsapi-codestyle, javascript.md](https://github.com/yandex/mapsapi-codestyle/blob/d549f85deb7ed7d90e3b302478fc50dd950447e0/javascript.md#async-await), архив). Правилами профиля они не сделаны: источник либо один проект, либо архив.

## 5. Java

**Публичные правила.** Общего гайда нет: публичных данных не найдено. Документация yatool сообщает только, что стиль Java-кода в Аркадии проверяет checkstyle на обычном и строгом уровнях (строгий включает макрос `LINT(strict)`), а форматирует команда `ya jstyle` на основе форматтера IntelliJ IDEA ([test.md](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/test.md?plain=1#L369-L372), [style.md](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/style.md?plain=1#L51-L59)). Сами конфиги checkstyle Аркадии в открытом yatool не опубликованы.

**Что используют открытые репозитории (реконструкция).** Конфиг checkstyle есть в 2 из 4 проверенных Java-кодовых баз: в ydb-java-sdk и в ydb-spark-connector, и это один и тот же `ydb.checkstyle.xml`. В yandex-cloud/java-sdk конфигов стиля нет; для `yt/java` в ytsaurus публичный CI запускает только сборку и тесты. В `ydb.checkstyle.xml` лимит строки сопровождает ссылка на внутренний ресурс `clubs.at.yandex-team.ru/java/593` - признак того, что конфиг перенесён из внутренней практики (интерпретация). В ydb-java-sdk checkstyle запускается на фазе `test` через `maven-checkstyle-plugin` 3.6.0, цель компиляции - Java 8 ([pom.xml](https://github.com/ydb-platform/ydb-java-sdk/blob/464e52508487e2380401a7994d85766d98114c39/pom.xml#L199-L216)). Форматирование задаёт [`.editorconfig`](https://github.com/ydb-platform/ydb-java-sdk/blob/464e52508487e2380401a7994d85766d98114c39/.editorconfig) с ключами `ij_java_*` для IntelliJ IDEA; отдельного форматтера в CI нет.

Точечные подавления в этом конфиге - аннотация `@SuppressWarnings` и пара комментариев `// CHECKSTYLE:OFF` … `// CHECKSTYLE:ON`.

### Y-JAVA-001 · MUST · Строка не длиннее 120 символов; лимит не действует на строки `package`, `import` и строки javadoc
- Проверка: Checkstyle `LineLength` (`max = 120`, `ignorePattern` для `package`, `import` и строк, начинающихся с `*`); `.editorconfig` `max_line_length = 120`.
- Источник: [ydb.checkstyle.xml#L48-L54](https://github.com/ydb-platform/ydb-java-sdk/blob/464e52508487e2380401a7994d85766d98114c39/config/ydb.checkstyle.xml#L48-L54) (2026-10-09) · конфиг или инструмент · средняя.

### Y-JAVA-002 · MUST · Отступы только пробелами, без пробелов в конце строк, файл заканчивается переводом строки
- Проверка: Checkstyle `FileTabCharacter` (`eachLine = true`), `RegexpSingleline` с шаблоном `\s+$`, `NewlineAtEndOfFile`.
- Источник: [ydb.checkstyle.xml#L10-L34](https://github.com/ydb-platform/ydb-java-sdk/blob/464e52508487e2380401a7994d85766d98114c39/config/ydb.checkstyle.xml#L10-L34) (2026-10-09) · конфиг или инструмент · средняя.

### Y-JAVA-003 · MUST · Импорты без `*` и без неиспользуемых; группы идут в порядке `java`, `javax`, сторонние, `yandex`, `ru.yandex`, пакет проекта; статические импорты - в конце
- Проверка: Checkstyle `AvoidStarImport` (звёздочка запрещена и для классов, и для статических членов), `UnusedImports` (`processJavadoc = true`), `RedundantImport`, `ImportOrder` (`groups`, `ordered`, `separated`, `option = bottom`, `sortStaticImportsAlphabetically`); в IDE - `ij_java_imports_layout`. В своём проекте замените последнюю группу `tech.ydb` на корневой пакет проекта.
- Источник: [ydb.checkstyle.xml#L91-L98](https://github.com/ydb-platform/ydb-java-sdk/blob/464e52508487e2380401a7994d85766d98114c39/config/ydb.checkstyle.xml#L91-L98), [#L218-L246](https://github.com/ydb-platform/ydb-java-sdk/blob/464e52508487e2380401a7994d85766d98114c39/config/ydb.checkstyle.xml#L218-L246) (2026-10-09) · конфиг или инструмент · средняя. Комментарии в конфиге объясняют оба запрета удобством поиска по коду в монорепозитории.
- Пример:

```java
// плохо
import java.util.*;
import static org.junit.Assert.assertEquals;
import tech.ydb.core.Status;

// хорошо
import java.util.List;

import com.google.common.base.Preconditions;

import tech.ydb.core.Status;

import static org.junit.Assert.assertEquals;
```

### Y-JAVA-004 · MUST · Именование - стандартное для Java; константы `static final` - в `UPPER_SNAKE_CASE`, исключение - логгеры `log` и `logger`
- Проверка: Checkstyle `ConstantName` (шаблон допускает `log`, `logger`, `*Log`, `*Logger`), `LocalVariableName`, `LocalFinalVariableName`, `MemberName`, `MethodName`, `PackageName`, `ParameterName`, `StaticVariableName`, `TypeName`.
- Источник: [ydb.checkstyle.xml#L64-L89](https://github.com/ydb-platform/ydb-java-sdk/blob/464e52508487e2380401a7994d85766d98114c39/config/ydb.checkstyle.xml#L64-L89) (2026-10-09) · конфиг или инструмент · средняя.

### Y-JAVA-005 · MUST · Фигурные скобки обязательны у всех блоков, открывающая скобка стоит в конце строки
- Проверка: Checkstyle `NeedBraces`, `LeftCurly`, `RightCurly`; в IDE - `ij_java_if_brace_force = always` (то же для `for`, `while`, `do-while`) и `ij_java_*_brace_style = end_of_line`.
- Источник: [ydb.checkstyle.xml#L151-L154](https://github.com/ydb-platform/ydb-java-sdk/blob/464e52508487e2380401a7994d85766d98114c39/config/ydb.checkstyle.xml#L151-L154), [.editorconfig#L8-L18](https://github.com/ydb-platform/ydb-java-sdk/blob/464e52508487e2380401a7994d85766d98114c39/.editorconfig#L8-L18) (2026-10-09) · конфиг или инструмент · средняя.

### Y-JAVA-006 · MUST · Одно объявление и один оператор на строку; в каждом `switch` есть `default`; `equals` и `hashCode` переопределяются только вместе
- Проверка: Checkstyle `MultipleVariableDeclarations`, `OneStatementPerLine`, `MissingSwitchDefault`, `EqualsHashCode`, `EmptyStatement`.
- Источник: [ydb.checkstyle.xml#L162-L191](https://github.com/ydb-platform/ydb-java-sdk/blob/464e52508487e2380401a7994d85766d98114c39/config/ydb.checkstyle.xml#L162-L191) (2026-10-09) · конфиг или инструмент · средняя.

### Y-JAVA-007 · MUST · Метод не длиннее 150 строк и принимает не больше 7 параметров, файл не длиннее 2000 строк
- Проверка: Checkstyle `MethodLength`, `ParameterNumber`, `FileLength` - все со значениями по умолчанию; лимиты названы в комментариях конфига.
- Источник: [ydb.checkstyle.xml#L17-L19](https://github.com/ydb-platform/ydb-java-sdk/blob/464e52508487e2380401a7994d85766d98114c39/config/ydb.checkstyle.xml#L17-L19), [#L100-L110](https://github.com/ydb-platform/ydb-java-sdk/blob/464e52508487e2380401a7994d85766d98114c39/config/ydb.checkstyle.xml#L100-L110) (2026-10-09) · конфиг или инструмент · средняя.

### Y-JAVA-008 · MUST · Поля класса не публичные; у класса из одних статических членов конструктор скрыт; локальная переменная не затеняет поле
- Проверка: Checkstyle `VisibilityModifier` (разрешены package-private и `protected`), `HideUtilityClassConstructor`, `HiddenField` (только `VARIABLE_DEF`, то есть параметры конструкторов и сеттеров не считаются).
- Источник: [ydb.checkstyle.xml#L169-L206](https://github.com/ydb-platform/ydb-java-sdk/blob/464e52508487e2380401a7994d85766d98114c39/config/ydb.checkstyle.xml#L169-L206) (2026-10-09) · конфиг или инструмент · средняя.

## 6. Kotlin

**Публичные правила.** Общего гайда нет: публичных данных не найдено. Документация yatool сообщает, что проекты на Kotlin в Аркадии автоматически проверяет ktlint; проверку отключает макрос `NO_LINT(ktlint)`, исключения задаёт `KTLINT_BASELINE_FILE` ([test.md](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/test.md?plain=1#L374-L377)). Версия и конфиг этого ktlint не опубликованы.

**Что используют открытые репозитории (реконструкция).** Проверены два проекта, общего инструмента у них нет, ktlint не подключён ни в одном (0 из 2):

- [Yatagan](https://github.com/yandex/yatagan/tree/5b733611354ef50f4847c3853d113463ab38bed8) (2026-10-08; Kotlin 1.9.24) - стиль IDE лежит в репозитории, для стабильных артефактов включены `explicitApi()` и binary-compatibility-validator 0.13.2; ktlint и detekt не подключены.
- [DivKit](https://github.com/divkit/divkit/blob/7079d294b9b6fc82db0272753ee689fb691a5f1b/client/android/config/detekt/detekt.yml) (2026-10-09; Kotlin 2.3.21) - detekt 2.0.0-alpha.6 с общим `detekt.yml` и файлом `detekt-baseline.xml` в каждом модуле.

**Альтернатива «не Яндекс».** [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html) и [ktlint](https://github.com/pinterest/ktlint) 1.8.0 (2025-11-14). Профиль берёт ktlint, потому что это единственный инструмент, названный в документации самого Яндекса, и настраивает его под официальный стиль Kotlin, который выбран в Yatagan.

### Y-KT-001 · SHOULD · Kotlin-код проверяется ktlint; известные нарушения выносятся в baseline-файл, а не отключают проверку целиком
- Проверка: ktlint в CI. В Аркадии проверка автоматическая, то есть обязательная; в профиле уровень ниже, потому что её конфиг не опубликован, а открытые Gradle-проекты ktlint не подключают.
- Источник: [yatool, test.md#L374-L377](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/test.md?plain=1#L374-L377) (2026-10-06) · конфиг или инструмент · средняя.

### Y-KT-002 · SHOULD · Форматирование - по официальному стилю Kotlin (Kotlin Coding Conventions)
- Проверка: IDE - `CODE_STYLE_DEFAULTS = KOTLIN_OFFICIAL`; ktlint - `.editorconfig` с `ktlint_code_style = intellij_idea` (этот стиль ktlint основан на Kotlin Coding Conventions; выбор авторов профиля).
- Источник: [Yatagan, Project.xml#L13-L16](https://github.com/yandex/yatagan/blob/5b733611354ef50f4847c3853d113463ab38bed8/.idea/codeStyles/Project.xml#L13-L16) (2026-10-08) · конфиг или инструмент · низкая; [Kotlin Coding Conventions](https://kotlinlang.org/docs/coding-conventions.html) · официальный гайд · не Яндекс; [стили ktlint](https://github.com/pinterest/ktlint/blob/master/documentation/release-latest/docs/rules/code-styles.md) · конфиг или инструмент · не Яндекс.

### Y-KT-003 · SHOULD · Импорты со звёздочкой не используются
- Проверка: IDE - `NAME_COUNT_TO_USE_STAR_IMPORT` и `NAME_COUNT_TO_USE_STAR_IMPORT_FOR_MEMBERS` равны 2147483647; ktlint `standard:no-wildcard-imports`.
- Источник: [Yatagan, Project.xml#L5-L11](https://github.com/yandex/yatagan/blob/5b733611354ef50f4847c3853d113463ab38bed8/.idea/codeStyles/Project.xml#L5-L11) (2026-10-08) · конфиг или инструмент · низкая.

### Y-KT-004 · SHOULD · В многострочных списках параметров и аргументов допускается висячая запятая
- Проверка: IDE - `ALLOW_TRAILING_COMMA = true`; ktlint `standard:trailing-comma-on-declaration-site` и `standard:trailing-comma-on-call-site`. В стиле `intellij_idea` ktlint висячую запятую не разрешает, а требует - это строже настройки IDE.
- Источник: [Yatagan, Project.xml#L12](https://github.com/yandex/yatagan/blob/5b733611354ef50f4847c3853d113463ab38bed8/.idea/codeStyles/Project.xml#L12) (2026-10-08) · конфиг или инструмент · низкая; [правила ktlint](https://pinterest.github.io/ktlint/latest/rules/standard/) · конфиг или инструмент · не Яндекс.

### Y-KT-005 · MUST · Публичный API библиотеки объявляется с явными модификаторами видимости и явными типами
- Проверка: компилятор Kotlin в режиме `explicitApi()`. Правило относится к публикуемым библиотекам; для приложений Yatagan его не включает.
- Источник: [Yatagan, yatagan.stable-api-artifact.gradle.kts#L6-L8](https://github.com/yandex/yatagan/blob/5b733611354ef50f4847c3853d113463ab38bed8/buildSrc/src/main/kotlin/yatagan.stable-api-artifact.gradle.kts#L6-L8) (2026-10-08) · конфиг или инструмент · низкая.
- Пример:

```kotlin
// плохо: в режиме explicitApi() не скомпилируется
fun createComponent() = ComponentImpl()

// хорошо
public fun createComponent(): Component = ComponentImpl()
```

### Y-KT-006 · MUST · Изменение публичного API библиотеки сопровождается обновлением API-дампа в том же изменении
- Проверка: Gradle-плагин `org.jetbrains.kotlinx.binary-compatibility-validator` 0.13.2 - задача `apiCheck` (входит в `check`) сверяет API с дампом, `apiDump` обновляет дамп; внутренние и экспериментальные объявления исключаются через `nonPublicMarkers` и `ignoredPackages`. Сам [плагин](https://github.com/Kotlin/binary-compatibility-validator) на 2026-10-09 объявлен находящимся в режиме сопровождения (не Яндекс).
- Источник: [Yatagan, yatagan.stable-api-artifact.gradle.kts#L1-L19](https://github.com/yandex/yatagan/blob/5b733611354ef50f4847c3853d113463ab38bed8/buildSrc/src/main/kotlin/yatagan.stable-api-artifact.gradle.kts#L1-L19), [libs.versions.toml#L20-L22](https://github.com/yandex/yatagan/blob/5b733611354ef50f4847c3853d113463ab38bed8/gradle/libs.versions.toml#L20-L22) (2026-10-08) · конфиг или инструмент · низкая.

### Y-KT-007 · SHOULD · Сложность ограничена порогами detekt: когнитивная сложность метода до 15, метод до 60 строк, класс до 500 строк, до 6 параметров функции и 7 параметров конструктора, вложенность до 4
- Проверка: detekt `CognitiveComplexMethod`, `LongMethod`, `LargeClass`, `LongParameterList`, `NestedBlockDepth`; существующие нарушения лежат в `detekt-baseline.xml` модуля. Уровень SHOULD: источник - один проект на альфа-версии detekt.
- Источник: [DivKit, detekt.yml#L3-L27](https://github.com/divkit/divkit/blob/7079d294b9b6fc82db0272753ee689fb691a5f1b/client/android/config/detekt/detekt.yml#L3-L27) (2026-10-09; detekt 2.0.0-alpha.6) · конфиг или инструмент · низкая.

## 7. Go

**Публичные правила.** Общего гайда нет. Документация yatool: `ya style` для Go запускает `yoimports` и правит только импорты, полный линтинг делает `yolint`; среди типов тестов есть `gofmt` и `govet` ([style.md](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/style.md?plain=1#L37-L40), [test.md](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/test.md?plain=1#L379-L381)); линтер по умолчанию задан как [`GO_VET=yolint`](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/conf/go.conf#L98). Исходники `yolint` и `yoimports` и список их проверок не опубликованы. Письменные правила уровня проекта есть у ydb-go-sdk: [coding-standards.md](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.agents/rules/coding-standards.md).

**Что используют открытые репозитории (реконструкция).** Конфиг golangci-lint формата `version: "2"` есть в 3 из 5 проверенных Go-репозиториев, но устроен он по-разному:

- [ydb-go-sdk](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.golangci.yml) (2026-10-08) - `linters.default: all` минус 40 отключённых; форматтеры gci, gofmt, gofumpt, goimports; в CI golangci-lint v2.13.1 и Go 1.27, в `go.mod` - `go 1.24.0`.
- [ytsaurus-k8s-operator](https://github.com/ytsaurus/ytsaurus-k8s-operator/blob/645a69e02d5451b423da3bfb92785e606e4b37a6/.golangci.yaml) (2026-10-01) - явный список включённых линтеров (errcheck, govet, staticcheck, gosec, errorlint, gocritic, goheader и др.), форматтеры gofmt и goimports.
- [yandex-cloud/go-sdk](https://github.com/yandex-cloud/go-sdk/blob/f1c9a62c8c87ca03b536b6f9f76f7e49903b545b/.golangci.yml) (2026-10-05) - файл из одной строки `version: "2"`, при этом workflow закрепляет golangci-lint v1.54 и Go 1.22: конфиг и CI не согласованы.
- yandex/pandora - `go vet` и проверка gofmt в Makefile; `yt/go` в ytsaurus - в публичном CI только `go build`, `go test` и `go test -race`.

Профиль берёт вариант ydb-go-sdk: это самый полный конфиг, и рядом с ним лежат письменные правила.

### Y-GO-001 · MUST · Код отформатирован `gofmt` с упрощением и `gofumpt`
- Проверка: golangci-lint, форматтеры `gofmt` (`simplify: true`) и `gofumpt`; в Аркадии - тест типа `gofmt`.
- Источник: [ydb-go-sdk, .golangci.yml#L202-L217](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.golangci.yml#L202-L217) (2026-10-08) · конфиг или инструмент · средняя; [yatool, test.md#L379-L381](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/test.md?plain=1#L379-L381) (2026-10-06) · конфиг или инструмент.

### Y-GO-002 · MUST · Импорты идут тремя группами: стандартная библиотека, сторонние пакеты, собственный модуль
- Проверка: golangci-lint, форматтеры `gci` (`sections: standard, default, prefix(<модуль>)`) и `goimports` (`local-prefixes`); в Аркадии - `yoimports`.
- Источник: [ydb-go-sdk, .golangci.yml#L208-L220](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.golangci.yml#L208-L220) (2026-10-08) · конфиг или инструмент · средняя; [yatool, style.md#L37-L40](https://github.com/yandex/yatool/blob/daa9a3c774de905c447227eb7547cfb2e9418746/build/docs/ru/style.md?plain=1#L37-L40) (2024-08-05) · конфиг или инструмент.
- Пример:

```go
// хорошо
import (
	"context"
	"fmt"

	"google.golang.org/grpc"

	"github.com/ydb-platform/ydb-go-sdk/v3/internal/conn"
)
```

### Y-GO-003 · MUST · `go vet` запускается со всеми анализаторами, кроме `shadow` и `fieldalignment`
- Проверка: golangci-lint `govet` (`enable-all: true`, `disable: [shadow, fieldalignment]`); в Аркадии - тест типа `govet`.
- Источник: [ydb-go-sdk, .golangci.yml#L113-L117](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.golangci.yml#L113-L117) (2026-10-08) · конфиг или инструмент · средняя.

### Y-GO-004 · SHOULD · В golangci-lint включены все линтеры, а отключённые перечислены в конфиге поимённо
- Проверка: `linters.default: all` и список `linters.disable` (в ydb-go-sdk 40 имён, среди них `cyclop`, `depguard`, `exhaustruct`, `gochecknoglobals`, `gosec`, `mnd`, `varnamelen`, `wrapcheck`, `wsl`); `staticcheck` - все проверки, кроме `ST1000`, `ST1003`, `ST1016`, `ST1020`, `ST1021`, `ST1022`, `QF1008`. Среди оставшихся включёнными - `lll` и `funlen` с порогами по умолчанию: строка до 120 символов, функция до 60 строк и 40 операторов ([справочный конфиг golangci-lint](https://github.com/golangci/golangci-lint/blob/main/.golangci.reference.yml), не Яндекс). В ydb-go-sdk это проверяет CI; в профиле уровень SHOULD, потому что ytsaurus-k8s-operator делает наоборот - перечисляет включённые линтеры.
- Источник: [ydb-go-sdk, .golangci.yml#L11-L62](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.golangci.yml#L11-L62), [#L151-L160](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.golangci.yml#L151-L160) (2026-10-08) · практика, выведенная из репозиториев (1 из 3 с конфигом golangci-lint) · низкая · реконструкция.

### Y-GO-005 · MUST · Имена и идиомы соответствуют набору правил revive: переменные ошибок начинаются с `err` или `Err`, текст ошибки - со строчной буквы и без точки в конце, `context.Context` - первый аргумент, имя получателя одно на тип, после `return` нет лишнего `else`
- Проверка: revive `error-naming`, `error-strings`, `context-as-argument`, `receiver-naming`, `var-naming`, `indent-error-flow`, `superfluous-else`, `exported`, `blank-imports`, `dot-imports` и ещё одиннадцать правил из конфига. Наличие комментариев у экспортируемых имён CI не требует: в конфиге подключён пресет исключений `comments`, а проверки `staticcheck` `ST1000` и `ST1020`-`ST1022` отключены.
- Источник: [ydb-go-sdk, .golangci.yml#L122-L148](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.golangci.yml#L122-L148), [#L161-L167](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.golangci.yml#L161-L167) (2026-10-08) · конфиг или инструмент · средняя.

### Y-GO-006 · MUST · Комментарии, godoc, сообщения ошибок и логи пишутся на английском в американской орфографии
- Проверка: частично: `misspell` с `locale: US`; язык текста - ручное ревью.
- Источник: [ydb-go-sdk, coding-standards.md#L7](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.agents/rules/coding-standards.md?plain=1#L7) (2026-10-08) · производный гайд проекта · средняя; [.golangci.yml#L118-L121](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.golangci.yml#L118-L121) · конфиг или инструмент. То же требование об английском языке повторяют правила SDK YDB на Rust, JavaScript и Python.

### Y-GO-007 · SHOULD · Мьютекс освобождается через `defer mu.Unlock()` сразу после `Lock()`; блокирующую работу выносят из критической секции во вспомогательную функцию
- Проверка: ручное ревью.
- Источник: [ydb-go-sdk, coding-standards.md#L38-L44](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.agents/rules/coding-standards.md?plain=1#L38-L44) (2026-10-08) · производный гайд проекта · низкая.
- Пример:

```go
// плохо: новый ранний return оставит мьютекс захваченным
p.mu.Lock()
if p.closed {
	p.mu.Unlock()
	return errClosed
}
p.conns[c.id] = c
p.mu.Unlock()

// хорошо
p.mu.Lock()
defer p.mu.Unlock()
if p.closed {
	return errClosed
}
p.conns[c.id] = c
```

### Y-GO-008 · MUST · Реализация лежит в `internal/`; внутренние типы не попадают в публичные пакеты без стабильной обёртки
- Проверка: ручное ревью; сам запрет импорта `internal/` извне модуля обеспечивает компилятор Go.
- Источник: [ydb-go-sdk, coding-standards.md#L17-L22](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.agents/rules/coding-standards.md?plain=1#L17-L22) (2026-10-08) · производный гайд проекта · низкая.

### Y-GO-009 · MUST · Тесты запускаются с детектором гонок
- Проверка: `go test -race ./...` в CI.
- Источник: [ydb-go-sdk, testing.md#L3-L7](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.agents/rules/testing.md?plain=1#L3-L7), [tests.yml#L37](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.github/workflows/tests.yml#L37) (2026-10-08) · производный гайд проекта · средняя. В публичном CI `yt/go` тоже есть шаг `go test -race`.

### Y-GO-010 · MUST · Сгенерированные файлы вручную не правятся и исключаются из линтеров и форматтеров
- Проверка: golangci-lint `linters.exclusions.generated: lax` и `formatters.exclusions.generated: lax`; ручное ревью для правок в сгенерированных файлах.
- Источник: [ydb-go-sdk, .golangci.yml#L161-L162](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.golangci.yml#L161-L162), [coding-standards.md#L24-L27](https://github.com/ydb-platform/ydb-go-sdk/blob/c508a149d29de88f7ccb1d3de3c66ba19ad87aec/.agents/rules/coding-standards.md?plain=1#L24-L27) (2026-10-08) · конфиг или инструмент · средняя.

## 8. C#

**Публичные правила.** Публичных правил нет: публичных данных не найдено. В документации yatool о стиле и тестах (`style.md`, `test.md`) C# не упоминается.

**Что используют открытые репозитории (реконструкция).** Настроенная проверка стиля есть в 1 из 3 проверенных репозиториев с C#-кодом:

- [ydb-dotnet-sdk](https://github.com/ydb-platform/ydb-dotnet-sdk/blob/1add2779f2595e09f93afbe6c14215102ba3967c/.github/workflows/lint.yml) (2026-10-07) - два джоба: автоформатирование ReSharper с проверкой, что рабочая копия не изменилась, и ReSharper InspectCode. Настройки формата лежат в `*.sln.DotSettings`, корневой `.editorconfig` состоит из одной опции. Целевая платформа - `net8.0`, в CI - .NET SDK 10.0.x. В [`AGENTS.md`](https://github.com/ydb-platform/ydb-dotnet-sdk/blob/1add2779f2595e09f93afbe6c14215102ba3967c/AGENTS.md?plain=1#L232-L253) того же репозитория сказано, что линт-джоб запускает `dotnet format`; на деле workflow вызывает `jb cleanupcode`. Профиль следует workflow.
- [catboost/dotnet](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/dotnet/.editorconfig) (2026-10-09) - только `.editorconfig` без проверки в CI.
- yandex-cloud/dotnet-sdk - конфигов стиля нет.

Два набора настроек расходятся: в ydb-dotnet-sdk методы-выражения предпочтительны, а открывающая скобка стоит на новой строке; в `.editorconfig` CatBoost - наоборот (`csharp_style_expression_bodied_methods = false:silent`, `csharp_new_line_before_open_brace = none`). Профиль берёт вариант ydb-dotnet-sdk: он проверяется в CI и совпадает с [соглашениями .NET](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions) (не Яндекс; редакция 2025-01-18). В исходниках `src/Ydb.Sdk/src` пространства имён объявлены в файловой форме (`namespace X;`) в 95 из 102 файлов, блочной формы нет - это тоже совпадает с соглашениями .NET.

### Y-CS-001 · MUST · Код проходит автоформатирование ReSharper без изменений
- Проверка: `jb cleanupcode <решение>.sln --profile="Custom Cleanup"` (пакет `JetBrains.ReSharper.GlobalTools` 2025.3.2), затем проверка, что в рабочей копии нет изменений; профиль очистки хранится в `*.sln.DotSettings`.
- Источник: [ydb-dotnet-sdk, lint.yml#L33-L38](https://github.com/ydb-platform/ydb-dotnet-sdk/blob/1add2779f2595e09f93afbe6c14215102ba3967c/.github/workflows/lint.yml#L33-L38), [format-all-dotnet-code.sh#L10](https://github.com/ydb-platform/ydb-dotnet-sdk/blob/1add2779f2595e09f93afbe6c14215102ba3967c/.github/scripts/format-all-dotnet-code.sh#L10) (2026-10-07) · конфиг или инструмент · средняя.

### Y-CS-002 · MUST · Инспекции ReSharper уровня WARNING и выше не допускаются
- Проверка: ReSharper InspectCode 2025.3.2 (`minimumReportSeverity: WARNING`) по файлам `**.cs` и `**.cshtml`. Часть типов замечаний проект игнорирует, в том числе типы `Unused*`, `NotAccessed*` и `InconsistentNaming`, - то есть именование CI не проверяет.
- Источник: [ydb-dotnet-sdk, lint.yml#L57-L99](https://github.com/ydb-platform/ydb-dotnet-sdk/blob/1add2779f2595e09f93afbe6c14215102ba3967c/.github/workflows/lint.yml#L57-L99) (2026-10-07) · конфиг или инструмент · средняя.

### Y-CS-003 · MUST · Ссылочные типы, допускающие `null`, включены во всех проектах
- Проверка: компилятор C#, свойство `<Nullable>enable</Nullable>` в `.csproj`.
- Источник: [ydb-dotnet-sdk, Ydb.Sdk.csproj#L4-L7](https://github.com/ydb-platform/ydb-dotnet-sdk/blob/1add2779f2595e09f93afbe6c14215102ba3967c/src/Ydb.Sdk/src/Ydb.Sdk.csproj#L4-L7) (2026-10-07) · конфиг или инструмент · средняя.

### Y-CS-004 · SHOULD · В библиотечном коде каждый `await` вызывается с `ConfigureAwait(false)`
- Проверка: анализатор .NET `CA2007`, включённый как `dotnet_diagnostic.CA2007.severity = warning` для каталога библиотеки. Уровень SHOULD: в источнике это предупреждение.
- Источник: [ydb-dotnet-sdk, src/Ydb.Sdk/src/.editorconfig#L3-L7](https://github.com/ydb-platform/ydb-dotnet-sdk/blob/1add2779f2595e09f93afbe6c14215102ba3967c/src/Ydb.Sdk/src/.editorconfig#L3-L7) (2026-10-07) · конфиг или инструмент · средняя. Причина названа в комментарии конфига: библиотека не должна захватывать контекст синхронизации вызывающего кода, иначе блокирующий вызов из WPF или WinForms зависнет.
- Пример:

```csharp
// плохо
await connection.OpenAsync(cancellationToken);

// хорошо
await connection.OpenAsync(cancellationToken).ConfigureAwait(false);
```

### Y-CS-005 · SHOULD · Метод из одного выражения записывается через `=>`
- Проверка: `.editorconfig` `csharp_style_expression_bodied_methods = true:suggestion` (анализатор `IDE0022`); уровень в источнике - подсказка.
- Источник: [ydb-dotnet-sdk, .editorconfig](https://github.com/ydb-platform/ydb-dotnet-sdk/blob/1add2779f2595e09f93afbe6c14215102ba3967c/.editorconfig) (2026-10-07) · конфиг или инструмент · низкая. В `.editorconfig` CatBoost значение обратное (`false:silent`).

### Y-CS-006 · SHOULD · Отступ - 4 пробела, перевод строки - LF
- Проверка: `.editorconfig` `indent_style = space`, `indent_size = 4`, `end_of_line = lf`; форматтер.
- Источник: [catboost/dotnet, .editorconfig#L10-L15](https://github.com/catboost/catboost/blob/963da016857b91dc729f6f8c61a5711e608ea1d8/catboost/dotnet/.editorconfig#L10-L15) (2026-10-09) · конфиг или инструмент · средняя.

### Y-CS-007 · SHOULD · Открывающая фигурная скобка стоит на отдельной строке
- Проверка: форматтер ReSharper из Y-CS-001.
- Источник: [ydb-dotnet-sdk, YdbConnection.cs](https://github.com/ydb-platform/ydb-dotnet-sdk/blob/1add2779f2595e09f93afbe6c14215102ba3967c/src/Ydb.Sdk/src/Ado/YdbConnection.cs) (2026-10-07) · практика, выведенная из репозиториев (1 из 2; в `.editorconfig` CatBoost - обратное) · низкая · реконструкция; [соглашения .NET](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions) (2025-01-18) · официальный гайд · не Яндекс.

## 9. Rust

**Публичные правила.** Общего гайда нет: публичных данных не найдено. В документации yatool о стиле и тестах Rust не упоминается. Письменные правила уровня проекта есть у ydb-rs-sdk: [coding-standards.md](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/.agents/rules/coding-standards.md).

**Что используют открытые репозитории (реконструкция).** Источник один - [ydb-rs-sdk](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/.github/workflows/linter.yaml) (2026-10-07): rustfmt без `rustfmt.toml`, clippy с предупреждениями как ошибками, taplo 0.10.0 для TOML, typos v1.48.0; в [`Cargo.toml`](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/Cargo.toml#L13-L22) - `edition = "2024"`, `rust-version = "1.88"`, общие линты в `[workspace.lints]`; линт-джоб работает на Rust 1.96. Сгенерированный крейт `ydb-grpc` из clippy исключён.

**Альтернатива «не Яндекс»** для того, чего в проекте нет: [Rust Style Guide](https://doc.rust-lang.org/style-guide/) (его и реализует rustfmt по умолчанию) и [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/).

### Y-RS-001 · MUST · Код отформатирован rustfmt с настройками по умолчанию
- Проверка: `cargo fmt --all` и проверка отсутствия изменений (в CI - `git diff --exit-code`; локально - `cargo fmt --check`); файла `rustfmt.toml` в проекте нет.
- Источник: [ydb-rs-sdk, linter.yaml#L55-L58](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/.github/workflows/linter.yaml#L55-L58) (2026-10-07) · конфиг или инструмент · низкая.

### Y-RS-002 · MUST · Любое предупреждение clippy - ошибка сборки; сгенерированные крейты из проверки исключаются
- Проверка: `cargo clippy --workspace --all-targets --no-deps --exclude=<сгенерированный крейт> -- -D warnings`.
- Источник: [ydb-rs-sdk, linter.yaml#L65-L67](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/.github/workflows/linter.yaml#L65-L67) (2026-10-07) · конфиг или инструмент · низкая.

### Y-RS-003 · MUST · `unsafe` запрещён на уровне workspace
- Проверка: компилятор, `[workspace.lints.rust] unsafe_code = "forbid"`.
- Источник: [ydb-rs-sdk, Cargo.toml#L17-L18](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/Cargo.toml#L17-L18) (2026-10-07) · конфиг или инструмент · низкая.

### Y-RS-004 · MUST · В рабочем коде нет `unwrap`, `expect` и `panic!`; нарушенный инвариант возвращается как ошибка, а не маскируется значением по умолчанию
- Проверка: ручное ревью. В проекте-источнике не автоматизировано; при желании - линты clippy `unwrap_used`, `expect_used`, `panic` (не Яндекс). В тестах `unwrap` и `expect` разрешены.
- Источник: [ydb-rs-sdk, coding-standards.md#L53-L57](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/.agents/rules/coding-standards.md?plain=1#L53-L57) (2026-10-07) · производный гайд проекта · низкая.
- Пример:

```rust
// плохо
let column = row.columns.get(index).unwrap();
let codec = Codec::from_id(id).unwrap_or_default();

// хорошо
let column = row
    .columns
    .get(index)
    .ok_or_else(|| Error::MissingColumn { table: table.clone(), index })?;
let codec = Codec::from_id(id)?;
```

### Y-RS-005 · MUST · Видимость по умолчанию приватная; `pub(crate)` - для общего внутри крейта, `pub` - только для того, что предназначено пользователям библиотеки
- Проверка: ручное ревью.
- Источник: [ydb-rs-sdk, coding-standards.md#L30-L34](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/.agents/rules/coding-standards.md?plain=1#L30-L34) (2026-10-07) · производный гайд проекта · низкая.

### Y-RS-006 · MUST · Типы транспортного и сгенерированного слоя (`prost`, `tonic`) не появляются в публичных сигнатурах
- Проверка: ручное ревью.
- Источник: [ydb-rs-sdk, coding-standards.md#L42-L44](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/.agents/rules/coding-standards.md?plain=1#L42-L44) (2026-10-07) · производный гайд проекта · низкая.

### Y-RS-007 · SHOULD · `Option<T>` используется только там, где отсутствие значения - настоящее состояние предметной области; если есть разумное значение по умолчанию, поле обязательное
- Проверка: ручное ревью.
- Источник: [ydb-rs-sdk, coding-standards.md#L36-L38](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/.agents/rules/coding-standards.md?plain=1#L36-L38) (2026-10-07) · производный гайд проекта · низкая.

### Y-RS-008 · MUST · В коммит не попадают закомментированный код и отладочный вывод `println!` и `dbg!`, включая примеры
- Проверка: частично: clippy `dbg_macro` (в `Cargo.toml` - `warn`, с `-D warnings` становится ошибкой); `println!` и закомментированный код - ручное ревью.
- Источник: [ydb-rs-sdk, coding-standards.md#L23](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/.agents/rules/coding-standards.md?plain=1#L23), [Cargo.toml#L20-L21](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/Cargo.toml#L20-L21) (2026-10-07) · производный гайд проекта · низкая.

### Y-RS-009 · MUST · Минимальная поддерживаемая версия Rust объявлена в `Cargo.toml` и проверяется: линтом и прогоном тестов на ней
- Проверка: `rust-version` в `[workspace.package]`; clippy `incompatible_msrv`; CI собирает тесты на минимальной версии (1.88) и на закреплённой свежей (1.96).
- Источник: [ydb-rs-sdk, Cargo.toml#L13-L22](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/Cargo.toml#L13-L22), [coding-standards.md#L25-L28](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/.agents/rules/coding-standards.md?plain=1#L25-L28) (2026-10-07) · конфиг или инструмент · низкая.

### Y-RS-010 · MUST · Комментарии, doc-комментарии, сообщения ошибок и логи пишутся на английском; опечатки ловит отдельная проверка
- Проверка: частично: `typos` (в CI - `crate-ci/typos@v1.48.0`); язык текста - ручное ревью.
- Источник: [ydb-rs-sdk, coding-standards.md#L19](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/.agents/rules/coding-standards.md?plain=1#L19), [linter.yaml#L74-L80](https://github.com/ydb-platform/ydb-rs-sdk/blob/0b83f5a1f63d758a73006e7d8389246ac20b683c/.github/workflows/linter.yaml#L74-L80) (2026-10-07) · производный гайд проекта · низкая.

## 10. PHP (кратко)

**Публичные правила.** Публичных правил нет: публичных данных не найдено.

**Что используют открытые репозитории (реконструкция).** Источник один - [ydb-php-sdk](https://github.com/ydb-platform/ydb-php-sdk/blob/95214dffb63b5a5d78c61957f4176478860bcdd7/composer.json) (2026-09-12). В CI работает только синтаксическая проверка `overtrue/phplint` ^3.0 на PHP 7.2 и тесты PHPUnit (`>= 6.0, <10.0`) на PHP 7.2, 7.4, 8.0 и 8.2. Инструменты стиля и статического анализа - phpcs, PHP-CS-Fixer, PHPStan, Psalm - не подключены, поэтому оформление кода в этом проекте ничем не проверяется.

### Y-PHP-001 · MUST · Код синтаксически корректен для минимальной поддерживаемой версии PHP
- Проверка: `./vendor/bin/phplint ./ --exclude=vendor` на минимальной версии из `composer.json` (в источнике - PHP 7.2).
- Источник: [ydb-php-sdk, sumplelinter.yml#L16-L50](https://github.com/ydb-platform/ydb-php-sdk/blob/95214dffb63b5a5d78c61957f4176478860bcdd7/.github/workflows/sumplelinter.yml#L16-L50), [composer.json#L11-L25](https://github.com/ydb-platform/ydb-php-sdk/blob/95214dffb63b5a5d78c61957f4176478860bcdd7/composer.json#L11-L25) (2026-09-12) · конфиг или инструмент · низкая.

### Y-PHP-002 · MUST · Пространства имён и расположение классов соответствуют PSR-4
- Проверка: автозагрузчик Composer (`autoload.psr-4`) - класс, лежащий не по своему пути, не загрузится и уронит тесты; сам `composer.json` в CI проверяет `composer validate --strict`.
- Источник: [ydb-php-sdk, composer.json#L26-L32](https://github.com/ydb-platform/ydb-php-sdk/blob/95214dffb63b5a5d78c61957f4176478860bcdd7/composer.json#L26-L32) (2026-09-12) · конфиг или инструмент · низкая.

### Y-PHP-003 · SHOULD · Отступ - 4 пробела, UTF-8, LF, перевод строки в конце файла, без пробелов в конце строк
- Проверка: `.editorconfig`; в CI источника не проверяется, отсюда уровень SHOULD.
- Источник: [ydb-php-sdk, .editorconfig](https://github.com/ydb-platform/ydb-php-sdk/blob/95214dffb63b5a5d78c61957f4176478860bcdd7/.editorconfig) (2026-09-12) · конфиг или инструмент · низкая.

### Y-PHP-004 · SHOULD · Тесты пишутся на PHPUnit и запускаются на всех поддерживаемых версиях PHP
- Проверка: матрица версий PHP в CI.
- Источник: [ydb-php-sdk, tests.yml#L33](https://github.com/ydb-platform/ydb-php-sdk/blob/95214dffb63b5a5d78c61957f4176478860bcdd7/.github/workflows/tests.yml#L33) (2026-09-12) · практика, выведенная из репозиториев (1 из 1) · низкая · реконструкция.

### Y-PHP-005 · SHOULD · Оформление кода - по PER Coding Style: фигурная скобка класса и метода на новой строке, у управляющих конструкций - на той же; видимость указана у всех свойств, констант и методов; в многострочных списках висячая запятая
- Проверка: PHP-CS-Fixer или PHP_CodeSniffer с набором правил PER Coding Style (версии инструментов выбирает проект).
- Источник: [PER Coding Style](https://www.php-fig.org/per/coding-style/) (3.1) · сторонний источник · средняя · не Яндекс.

## 11. Ruby (кратко)

**Публичные правила и практика.** Публичных данных не найдено. Репозиториев `yandex-cloud/ruby-sdk` и `ydb-platform/ydb-ruby-sdk` не существует; в ydb, ytsaurus, catboost и yatool нет Ruby-файлов вне `contrib/`; найденные гемы для сервисов Яндекса сторонние. Утверждение относится к проверенным репозиториям и именам, а не ко всем организациям Яндекса на GitHub.

Все правила ниже - общепринятая альтернатива, а не практика Яндекса: [Ruby Style Guide](https://rubystyle.guide/) сообщества и RuboCop, который на нём основан (имена проверок сверены с документацией RuboCop 1.91).

### Y-RB-001 · SHOULD · Отступ - 2 пробела; строка не длиннее 80 символов, если команда не договорилась о большем лимите
- Проверка: RuboCop `Layout/IndentationWidth`, `Layout/LineLength`.
- Источник: [Ruby Style Guide, Spaces Indentation](https://rubystyle.guide/#spaces-indentation), [Max Line Length](https://rubystyle.guide/#max-line-length) (без версии; прочитан 2026-10-09) · сторонний источник · средняя · не Яндекс.

### Y-RB-002 · SHOULD · Методы, переменные, символы и файлы - в `snake_case`; классы и модули - в `CapitalCase`; прочие константы - в `SCREAMING_SNAKE_CASE`
- Проверка: RuboCop `Naming/MethodName`, `Naming/VariableName`, `Naming/FileName`, `Naming/ClassAndModuleCamelCase`, `Naming/ConstantName`.
- Источник: [Ruby Style Guide, Snake Case](https://rubystyle.guide/#snake-case-symbols-methods-vars), [CamelCase Classes](https://rubystyle.guide/#camelcase-classes), [Screaming Snake Case](https://rubystyle.guide/#screaming-snake-case) · сторонний источник · средняя · не Яндекс.

### Y-RB-003 · SHOULD · Имя метода-предиката заканчивается на `?` и не начинается с `is_`, `does_` или `can_`
- Проверка: RuboCop `Naming/PredicatePrefix`.
- Источник: [Ruby Style Guide, Bool Methods](https://rubystyle.guide/#bool-methods-qmark), [Bool Methods Prefix](https://rubystyle.guide/#bool-methods-prefix) · сторонний источник · средняя · не Яндекс.

### Y-RB-004 · SHOULD · В логических выражениях используются `&&` и `||`; `and` и `or` - только для управления потоком выполнения
- Проверка: RuboCop `Style/AndOr`.
- Источник: [Ruby Style Guide, And/Or](https://rubystyle.guide/#and-or-flow) · сторонний источник · средняя · не Яндекс.

### Y-RB-005 · SHOULD · Стиль проверяется RuboCop в CI, конфигурация лежит в `.rubocop.yml` в корне репозитория
- Проверка: `bundle exec rubocop`.
- Источник: [Ruby Style Guide](https://rubystyle.guide/) · сторонний источник · средняя · не Яндекс; [документация RuboCop](https://docs.rubocop.org/rubocop/latest/cops_naming.html) (1.91) · конфиг или инструмент · не Яндекс.

## 12. Исключённые языки: Scala и Elixir

- **Scala.** Правил нет: публичных данных не найдено. Код на Scala у Яндекса открыт - [ytsaurus-spyt](https://github.com/ytsaurus/ytsaurus-spyt/tree/a4c2d08125d4bb00a67027ca4438f1b7c5edd869) (567 файлов `.scala`, сборка Gradle) и модуль Spark в CatBoost, - но конфигов scalafmt, scalastyle или scalafix в них нет: стиль проверяет только компилятор. Исключён по опросам: около 2 % в Stack Overflow и снижение (2,6 → 2,2). Если Scala всё же нужна - [Scala Style Guide](https://docs.scala-lang.org/style/) и scalafmt (не Яндекс).
- **Elixir.** Публичных данных не найдено: ни SDK, ни файлов `.ex` или `mix.exs` вне `contrib/` в проверенных репозиториях нет; пакеты на hex.pm для сервисов Яндекса сторонние. Исключён по опросам: 2,6-2,7 % в Stack Overflow при высокой лояльности, признаков роста нет. Если Elixir всё же нужен - встроенный форматтер [`mix format`](https://mix.hexdocs.pm/Mix.Tasks.Format.html) с проверкой `mix format --check-formatted` в CI (не Яндекс).

## 13. Что пересмотреть при обновлении

- Выйдут JetBrains State of Developer Ecosystem 2026 и Octoverse 2026 - обновить таблицу раздела 1 и решение по пограничным языкам (Ruby, PHP).
- `@gravity-ui/eslint-config` заявит поддержку ESLint 10 - поднять версии в [configs/web/](../../configs/web/); до тех пор профиль закреплён на ESLint 9.
- Правила из `AGENTS.md` и `.agents/rules/` SDK YDB - новый тип источника, появившийся в 2025-2026 годах: ссылки в этом документе ведут на коммиты от 2026-10-07 и 2026-10-08, при пересмотре их нужно сверить с актуальными версиями файлов.
